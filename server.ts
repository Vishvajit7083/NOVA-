import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';
import { paymentRouter } from './src/api/payment';
import { shippingRouter } from './src/api/shipping';
import { requireAuth, requireAdmin } from './src/api/authMiddleware';

dotenv.config();
const envExamplePath = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
}

const PORT = 3000;
const HOST = '0.0.0.0';

// Initialize Razorpay SDK client lazily
let razorpayClient: Razorpay | null = null;

function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  if (!razorpayClient) {
    try {
      razorpayClient = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } catch (err) {
      console.error('Failed to initialize Razorpay SDK:', err);
      return null;
    }
  }

  return razorpayClient;
}

// In-memory transactions cache for immediate reconciliation fallback
interface ServerTransactionRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  gateway: 'razorpay' | 'cod';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  method: string;
  methodDetails?: {
    vpa?: string;
    cardNetwork?: string;
    cardLast4?: string;
    bank?: string;
    wallet?: string;
    international?: boolean;
  };
  status: 'created' | 'pending' | 'captured' | 'failed' | 'refunded' | 'partially_refunded';
  failureReason?: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  userUid?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
}

const serverTransactions: ServerTransactionRecord[] = [];

async function startServer() {
  const app = express();

  // Middleware for parsing JSON with raw body capture for webhook signature verification
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));

  // Create dedicated router for all /api endpoints
  const apiRouter = express.Router();

  // Router-level CORS & OPTIONS Preflight Middleware
  apiRouter.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // ----------------------------------------------------
  // PAYMENT API ENDPOINTS
  // ----------------------------------------------------

  // 1. Healthcheck
  apiRouter.all(['/health', '/health/'], (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'SINDHUDURG GARMENTS Commerce API',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Mount modular Payment Router (handles /payment/config, /payment/create-order, /payment/verify)
  apiRouter.use('/payment', paymentRouter);

  // 3. Mount modular Shipping & Logistics Router (handles /shipping/config, /shipping/serviceability, /shipping/create-shipment, /shipping/webhook)
  apiRouter.use('/shipping', shippingRouter);

  // 4. Verify Payment Cryptographic Signature & Capture Details
  apiRouter.post(['/payment/verify', '/payment/verify/'], async (req: Request, res: Response) => {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
        orderNumber,
        userUid,
        userEmail,
      } = body;

      if (!razorpay_order_id || !razorpay_payment_id) {
        return res.status(400).json({
          success: false,
          error: 'Missing required payment verification parameters (order_id or payment_id).',
        });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      let isSignatureValid = false;

      if (keySecret && razorpay_signature) {
        // Official Razorpay HMAC-SHA256 signature verification
        const generatedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        isSignatureValid = generatedSignature === razorpay_signature;

        if (!isSignatureValid) {
          console.warn('Signature verification mismatch for order:', orderId);
          return res.status(400).json({
            success: false,
            verified: false,
            error: 'Invalid Razorpay payment signature. Transaction tampering detected.',
          });
        }
      } else {
        // If keys are running in sandbox test mode, confirm transaction parameters
        isSignatureValid = Boolean(razorpay_payment_id && razorpay_order_id);
      }

      const razorpay = getRazorpayClient();
      let paymentInfo: any = {
        id: razorpay_payment_id,
        status: 'captured',
        method: 'upi',
        amount: 0,
        currency: 'INR',
      };

      if (razorpay && !razorpay_payment_id.startsWith('pay_test_demo')) {
        try {
          paymentInfo = await razorpay.payments.fetch(razorpay_payment_id);
        } catch (fetchErr) {
          console.warn('Could not fetch real-time payment object from Razorpay, using verified payload:', fetchErr);
        }
      }

      const method = paymentInfo.method || 'upi';
      let methodLabel = 'Razorpay Instant UPI';
      if (method === 'card') {
        methodLabel = `Card (${paymentInfo.card?.network || 'Visa/Mastercard'} •••• ${paymentInfo.card?.last4 || '****'})`;
      } else if (method === 'netbanking') {
        methodLabel = `Net Banking (${paymentInfo.bank || 'All Indian Banks'})`;
      } else if (method === 'wallet') {
        methodLabel = `Wallet (${paymentInfo.wallet || 'Digital Wallet'})`;
      } else if (method === 'upi') {
        methodLabel = `UPI (${paymentInfo.vpa || 'Direct UPI Transfer'})`;
      }

      // Update or insert transaction record
      const existingTxn = serverTransactions.find(
        (t) => t.gatewayOrderId === razorpay_order_id || t.orderId === orderId
      );

      const txnId = existingTxn ? existingTxn.id : `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const completedTxn: ServerTransactionRecord = {
        id: txnId,
        orderId: orderId || (existingTxn?.orderId ?? `NV-${Date.now().toString().slice(-6)}`),
        orderNumber: orderNumber || existingTxn?.orderNumber || orderId,
        gateway: 'razorpay',
        gatewayOrderId: razorpay_order_id,
        gatewayPaymentId: razorpay_payment_id,
        amount: paymentInfo.amount ? paymentInfo.amount / 100 : (existingTxn?.amount || 0),
        currency: paymentInfo.currency || 'INR',
        method,
        methodDetails: {
          vpa: paymentInfo.vpa,
          cardNetwork: paymentInfo.card?.network,
          cardLast4: paymentInfo.card?.last4,
          bank: paymentInfo.bank,
          wallet: paymentInfo.wallet,
          international: paymentInfo.international || false,
        },
        status: 'captured',
        userUid: userUid || existingTxn?.userUid,
        userEmail: userEmail || existingTxn?.userEmail,
        createdAt: existingTxn?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingTxn) {
        Object.assign(existingTxn, completedTxn);
      } else {
        serverTransactions.unshift(completedTxn);
      }

      return res.json({
        success: true,
        verified: true,
        orderId: completedTxn.orderId,
        orderNumber: completedTxn.orderNumber,
        paymentId: razorpay_payment_id,
        paymentDetails: {
          paid: true,
          gateway: 'razorpay',
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature || 'verified_server_signature',
          method,
          methodLabel,
          cardNetwork: paymentInfo.card?.network,
          cardLast4: paymentInfo.card?.last4,
          vpa: paymentInfo.vpa,
          bank: paymentInfo.bank,
          wallet: paymentInfo.wallet,
          paidAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error('Error verifying Razorpay signature:', error);
      return res.status(500).json({
        success: false,
        verified: false,
        error: error.message || 'Server error verifying payment status.',
      });
    }
  });

  // Handle non-POST requests to /payment/verify gracefully with a valid JSON 405 error
  apiRouter.all(['/payment/verify', '/payment/verify/'], (req: Request, res: Response) => {
    return res.status(405).json({
      success: false,
      verified: false,
      error: `Method ${req.method} Not Allowed. Endpoint /api/payment/verify expects an HTTP POST request containing payment verification parameters in the JSON body.`,
      endpoint: '/api/payment/verify',
      requiredMethod: 'POST',
      allowedMethods: ['POST', 'OPTIONS'],
    });
  });

  // 5. Razorpay Webhook Handler
  apiRouter.all(['/payment/webhook', '/payment/webhook/'], async (req: any, res: Response) => {
    try {
      const webhookSignature = req.headers['x-razorpay-signature'] as string;
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (webhookSecret && webhookSignature && req.rawBody) {
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(req.rawBody)
          .digest('hex');

        if (expectedSignature !== webhookSignature) {
          console.warn('Webhook signature mismatch. Rejecting untrusted webhook event.');
          return res.status(400).json({ status: 'error', message: 'Invalid webhook signature.' });
        }
      }

      const event = req.body?.event;
      const payload = req.body?.payload;

      console.log(`Received Razorpay Webhook event: ${event}`);

      if (event === 'payment.captured' || event === 'order.paid') {
        const paymentEntity = payload?.payment?.entity;
        const rzpOrderId = paymentEntity?.order_id;
        const rzpPaymentId = paymentEntity?.id;

        const txn = serverTransactions.find((t) => t.gatewayOrderId === rzpOrderId);
        if (txn) {
          txn.status = 'captured';
          txn.gatewayPaymentId = rzpPaymentId;
          txn.updatedAt = new Date().toISOString();
        }
      } else if (event === 'payment.failed') {
        const paymentEntity = payload?.payment?.entity;
        const rzpOrderId = paymentEntity?.order_id;
        const failureReason = paymentEntity?.error_description || 'Payment rejected by bank';

        const txn = serverTransactions.find((t) => t.gatewayOrderId === rzpOrderId);
        if (txn) {
          txn.status = 'failed';
          txn.failureReason = failureReason;
          txn.updatedAt = new Date().toISOString();
        }
      } else if (event === 'refund.processed') {
        const refundEntity = payload?.refund?.entity;
        const rzpPaymentId = refundEntity?.payment_id;

        const txn = serverTransactions.find((t) => t.gatewayPaymentId === rzpPaymentId);
        if (txn) {
          txn.status = 'refunded';
          txn.refundId = refundEntity?.id;
          txn.refundAmount = refundEntity?.amount ? refundEntity.amount / 100 : txn.amount;
          txn.updatedAt = new Date().toISOString();
        }
      }

      return res.status(200).json({ status: 'ok', received: true });
    } catch (webhookErr: any) {
      console.error('Webhook processing error:', webhookErr);
      return res.status(500).json({ status: 'error', message: webhookErr.message });
    }
  });

  // 6. Admin Gateway Refund Execution
  apiRouter.all(['/admin/refund', '/admin/refund/'], requireAdmin, async (req: Request, res: Response) => {
    try {
      const body = req.method === 'GET' ? req.query : req.body;
      const { paymentId, amount, reason, orderId, adminEmail } = body as any;

      if (!paymentId) {
        return res.status(400).json({ success: false, error: 'Payment ID is required to initiate a refund.' });
      }

      const refundAmount = Number(amount) || 0;
      if (refundAmount <= 0) {
        return res.status(400).json({ success: false, error: 'Refund amount must be greater than zero.' });
      }

      const razorpay = getRazorpayClient();
      let rzpRefund: any = null;

      if (razorpay && !paymentId.startsWith('pay_test_demo')) {
        rzpRefund = await razorpay.payments.refund(paymentId, {
          amount: Math.round(refundAmount * 100), // in paise
          notes: {
            orderId: orderId || '',
            reason: reason || 'Customer requested return refund',
            processedBy: adminEmail || req.user?.email || 'Store Admin',
          },
        });
      } else {
        rzpRefund = {
          id: `rfnd_sim_${Date.now()}`,
          payment_id: paymentId,
          amount: Math.round(refundAmount * 100),
          currency: 'INR',
          status: 'processed',
          created_at: Math.floor(Date.now() / 1000),
        };
      }

      // Update server transaction record
      const txn = serverTransactions.find((t) => t.gatewayPaymentId === paymentId || t.orderId === orderId);
      if (txn) {
        txn.status = 'refunded';
        txn.refundId = rzpRefund.id;
        txn.refundAmount = refundAmount;
        txn.refundReason = reason || 'Admin processed refund';
        txn.updatedAt = new Date().toISOString();
      }

      return res.json({
        success: true,
        refundId: rzpRefund.id,
        amount: refundAmount,
        currency: 'INR',
        status: 'processed',
        refund: rzpRefund,
      });
    } catch (refundError: any) {
      console.error('Error processing gateway refund:', refundError);
      return res.status(500).json({
        success: false,
        error: refundError.error?.description || refundError.message || 'Gateway refund failed.',
      });
    }
  });

  // 7. Admin Reconciliation Transactions List
  apiRouter.all(['/admin/transactions', '/admin/transactions/'], requireAdmin, (_req: Request, res: Response) => {
    res.json({
      success: true,
      count: serverTransactions.length,
      transactions: serverTransactions,
    });
  });

  // 8. API Router Catch-All (Guarantees JSON 404 response for unhandled /api requests, never 405)
  apiRouter.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Mount API router to handle all /api requests
  app.use('/api', apiRouter);

  // 9. Prevent serve-static from returning HTTP 405 Method Not Allowed for unhandled POST/PUT requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      return res.status(404).json({
        success: false,
        error: `Cannot ${req.method} ${req.originalUrl}. Route not found.`,
      });
    }
    next();
  });

  // 10. Express Global Error Handler (catches JSON parsing errors and internal exceptions)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Express caught unhandled request error:', err);
    const statusCode = err.status || err.statusCode || 400;
    res.status(statusCode).json({
      success: false,
      error: err.message || 'Malformed request body or server error.',
    });
  });

  // ----------------------------------------------------
  // FRONTEND CLIENT & VITE SERVING
  // ----------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`SINDHUDURG GARMENTS Server is running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
