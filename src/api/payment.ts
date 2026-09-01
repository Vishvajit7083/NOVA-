import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';

export const paymentRouter = Router();

/**
 * Lazy initializer for Razorpay SDK client using credentials from environment.
 */
export function getRazorpayClient(keyIdOverride?: string, keySecretOverride?: string): Razorpay | null {
  const keyId = keyIdOverride || process.env.RAZORPAY_KEY_ID;
  const keySecret = keySecretOverride || process.env.RAZORPAY_KEY_SECRET;
  if (keyId && keySecret) {
    try {
      return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } catch (e) {
      console.error('Failed to initialize Razorpay SDK client:', e);
    }
  }
  return null;
}

/**
 * Verifies Razorpay HMAC-SHA256 signature natively across Web Crypto (Cloudflare Worker) & Node.js.
 */
export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }
  const body = `${orderId}|${paymentId}`;

  // Web Crypto API (supported in Cloudflare Workers, Node 18+, Bun, Modern Browsers)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const msgData = encoder.encode(body);
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, msgData);
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      const expectedSignature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return expectedSignature.toLowerCase() === signature.toLowerCase();
    } catch (e) {
      console.error('Web Crypto HMAC verification error:', e);
    }
  }

  // Fallback Node.js crypto module if available
  try {
    const nodeCrypto = await import('node:crypto');
    const expectedSignature = nodeCrypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return expectedSignature.toLowerCase() === signature.toLowerCase();
  } catch (e) {
    console.error('Node crypto HMAC error:', e);
  }

  return false;
}

/**
 * Common order calculation logic shared between Express and Cloudflare Workers.
 */
export function calculateOrderDetails(body: any, defaultKeyId?: string) {
  const {
    items = [],
    shippingFee = 0,
    couponCode,
    deliveryMethod = 'standard',
    shippingAddress,
    contactEmail,
    contactPhone,
    orderId,
    orderNumber,
  } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return {
      isValid: false,
      error: 'Invalid request body: "items" array with at least one product is required to create a payment order.',
    };
  }

  let calculatedSubtotal = 0;
  for (const item of items) {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Math.max(1, Number(item.quantity) || 1);
    calculatedSubtotal += itemPrice * itemQty;
  }

  let calculatedDiscount = 0;
  if (couponCode) {
    const codeClean = String(couponCode).trim().toUpperCase();
    if (codeClean === 'NOVA10') {
      calculatedDiscount = Math.round(calculatedSubtotal * 0.10);
    } else if (codeClean === 'FLAGSHIP20' && calculatedSubtotal >= 4999) {
      calculatedDiscount = Math.round(calculatedSubtotal * 0.20);
    } else if (codeClean === 'PROAUDIO' && calculatedSubtotal >= 2999) {
      calculatedDiscount = 500;
    } else if (codeClean === 'FIRST100' && calculatedSubtotal >= 999) {
      calculatedDiscount = 100;
    }
  }

  const calculatedShipping = deliveryMethod === 'express_priority' ? 199 : (calculatedSubtotal >= 999 ? 0 : 99);
  const calculatedTax = Math.round((calculatedSubtotal - calculatedDiscount) * 0.18);
  const calculatedTotal = Math.max(1, calculatedSubtotal - calculatedDiscount + calculatedShipping + calculatedTax);

  const generatedOrderId = orderId || `NV-${Date.now().toString().slice(-6)}`;
  const generatedOrderNumber = orderNumber || generatedOrderId;
  
  // Strict 3-letter currency sanitization
  const rawCurrency = String(body.currency || process.env.DEFAULT_CURRENCY || 'INR').replace(/[^a-zA-Z]/g, '').toUpperCase().trim();
  const currency = rawCurrency.length === 3 ? rawCurrency : 'INR';

  const amountInPaise = Math.round(calculatedTotal * 100);
  const keyId = defaultKeyId || process.env.RAZORPAY_KEY_ID || '';

  const notes: Record<string, string> = {};
  if (generatedOrderId) notes.orderId = String(generatedOrderId).slice(0, 40);
  if (generatedOrderNumber) notes.orderNumber = String(generatedOrderNumber).slice(0, 40);
  if (contactEmail && String(contactEmail).trim()) notes.email = String(contactEmail).trim().slice(0, 254);
  if (contactPhone && String(contactPhone).trim()) notes.phone = String(contactPhone).trim().slice(0, 254);
  if (shippingAddress?.fullName && String(shippingAddress.fullName).trim()) {
    notes.customerName = String(shippingAddress.fullName).trim().slice(0, 254);
  }
  if (shippingAddress?.city && String(shippingAddress.city).trim()) {
    notes.shippingCity = String(shippingAddress.city).trim().slice(0, 254);
  }

  return {
    isValid: true,
    calculatedSubtotal,
    calculatedDiscount,
    calculatedShipping,
    calculatedTax,
    calculatedTotal,
    amountInPaise,
    generatedOrderId,
    generatedOrderNumber,
    currency,
    keyId,
    notes,
  };
}

/**
 * GET /api/payment/config Express handler
 */
export function configHandler(req: Request, res: Response) {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const rawCurrency = String(process.env.DEFAULT_CURRENCY || 'INR').replace(/[^a-zA-Z]/g, '').toUpperCase().trim();
  const currency = rawCurrency.length === 3 ? rawCurrency : 'INR';
  return res.status(200).json({
    success: true,
    keyId,
    isConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
    mode: keyId.startsWith('rzp_live') ? 'live' : 'test',
    currency,
    enableInternational: true,
    storeName: 'NOVA Flagship Electronics',
    brandColor: '#EB0028',
    methodsSupported: ['upi', 'cards', 'netbanking', 'wallets', 'international_cards', 'cod'],
  });
}

/**
 * POST /api/payment/create-order Express handler
 */
export async function createOrderHandler(req: Request, res: Response) {
  try {
    let body = { ...(req.query || {}), ...(req.body || {}) };
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        body = { ...body, ...parsed };
      } catch (e) {}
    }
    if (typeof req.query?.items === 'string') {
      try {
        body.items = JSON.parse(req.query.items as string);
      } catch (e) {}
    }

    const calcResult = calculateOrderDetails(body);
    if (!calcResult.isValid) {
      return res.status(400).json({ success: false, error: calcResult.error });
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(400).json({
        success: false,
        error: 'Razorpay API credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing or not configured on the server.',
      });
    }

    let razorpayOrderId = '';
    try {
      const sanitizedReceipt = `rcpt_${String(calcResult.generatedOrderId).replace(/[^a-zA-Z0-9_-]/g, '').slice(-30)}`;
      const safeCurrency = (calcResult.currency && calcResult.currency.length === 3) ? calcResult.currency : 'INR';
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(calcResult.amountInPaise),
        currency: safeCurrency,
        receipt: sanitizedReceipt,
        notes: calcResult.notes,
      });
      if (!rzpOrder || !rzpOrder.id) {
        return res.status(400).json({
          success: false,
          error: 'Razorpay Orders API failed to return a valid order ID.',
        });
      }
      razorpayOrderId = rzpOrder.id;
    } catch (rzpErr: any) {
      console.error('Razorpay API orders.create error:', rzpErr);
      const rzpErrMsg = rzpErr?.error?.description || rzpErr?.description || rzpErr?.message || 'Gateway order creation failed';
      const currentKey = calcResult.keyId || process.env.RAZORPAY_KEY_ID || '';
      if (currentKey.startsWith('rzp_test_')) {
        console.warn('Falling back to test order ID for Razorpay test key due to gateway API validation/auth response:', rzpErrMsg);
        razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      } else {
        return res.status(400).json({
          success: false,
          error: `Razorpay Gateway Error: ${rzpErrMsg}`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      order_id: razorpayOrderId,
      razorpayOrderId,
      amount: calcResult.amountInPaise,
      totalInRupees: calcResult.calculatedTotal,
      currency: calcResult.currency,
      keyId: calcResult.keyId,
      orderId: calcResult.generatedOrderId,
      orderNumber: calcResult.generatedOrderNumber,
      breakdown: {
        subtotal: calcResult.calculatedSubtotal,
        discount: calcResult.calculatedDiscount,
        shippingFee: calcResult.calculatedShipping,
        tax: calcResult.calculatedTax,
        total: calcResult.calculatedTotal,
      },
    });
  } catch (error: any) {
    console.error('Error in createOrderHandler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An internal error occurred while creating the payment order.',
    });
  }
}

/**
 * POST /api/payment/verify Express handler
 */
export async function verifyHandler(req: Request, res: Response) {
  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Missing required payment verification parameters (razorpay_order_id, razorpay_payment_id, or razorpay_signature).',
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'RAZORPAY_KEY_SECRET environment variable is missing on server for signature verification.',
      });
    }

    const isVerified = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Payment signature verification failed. Invalid Razorpay HMAC-SHA256 signature.',
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      paymentDetails: {
        gateway: 'razorpay',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error in verifyHandler:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error.message || 'Payment verification failed.',
    });
  }
}

// Register Express Router Endpoints
paymentRouter.all('/config', configHandler);
paymentRouter.all('/config/', configHandler);
paymentRouter.all('/create-order', createOrderHandler);
paymentRouter.all('/create-order/', createOrderHandler);
paymentRouter.all('/verify', verifyHandler);
paymentRouter.all('/verify/', verifyHandler);
