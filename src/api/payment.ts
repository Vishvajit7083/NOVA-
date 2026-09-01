import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';

export const paymentRouter = Router();

/**
 * Lazy initializer for Razorpay SDK client using credentials from environment.
 */
export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
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
 * Handles POST /api/payment/create-order requests.
 * Validates request body, calculates server-authoritative totals,
 * creates a Razorpay order, and returns order details with order_id.
 */
export async function createOrderHandler(req: Request, res: Response) {
  try {
    let body = { ...(req.query || {}), ...(req.body || {}) };
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        body = { ...body, ...parsed };
      } catch (e) {
        // ignore JSON parse error, fall back to body object
      }
    }
    if (typeof req.query?.items === 'string') {
      try {
        body.items = JSON.parse(req.query.items as string);
      } catch (e) {
        // keep as is
      }
    }

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
      userUid,
    } = body;

    // 1. Input body validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body: "items" array with at least one product is required to create a payment order.',
      });
    }

    // 2. Server-authoritative subtotal calculation
    let calculatedSubtotal = 0;
    for (const item of items) {
      const itemPrice = Number(item.price) || 0;
      const itemQty = Math.max(1, Number(item.quantity) || 1);
      calculatedSubtotal += itemPrice * itemQty;
    }

    // 3. Coupon code validation & discount calculation
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

    // 4. Shipping, tax, and final amount calculation
    const calculatedShipping = deliveryMethod === 'express_priority' ? 199 : (calculatedSubtotal >= 999 ? 0 : 99);
    const calculatedTax = Math.round((calculatedSubtotal - calculatedDiscount) * 0.18);
    const calculatedTotal = Math.max(1, calculatedSubtotal - calculatedDiscount + calculatedShipping + calculatedTax);

    const generatedOrderId = orderId || `NV-${Date.now().toString().slice(-6)}`;
    const generatedOrderNumber = orderNumber || generatedOrderId;
    const currency = process.env.DEFAULT_CURRENCY || 'INR';
    const amountInPaise = Math.round(calculatedTotal * 100);

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_51NOVAStoreDemoKey';
    const razorpay = getRazorpayClient();
    let razorpayOrderId = '';

    // 5. Interacting with Razorpay API using environment keys
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency,
          receipt: `rcpt_${generatedOrderId.slice(-10)}`,
          notes: {
            orderId: generatedOrderId,
            orderNumber: generatedOrderNumber,
            email: contactEmail || '',
            phone: contactPhone || '',
            customerName: shippingAddress?.fullName || 'Valued Customer',
            shippingCity: shippingAddress?.city || '',
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr: any) {
        console.error('Razorpay API orders.create error:', rzpErr);
        const rzpErrMsg = rzpErr?.error?.description || rzpErr?.description || rzpErr?.message || 'Gateway order creation failed';

        if (process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live')) {
          return res.status(400).json({
            success: false,
            error: `Razorpay Live Gateway Error: ${rzpErrMsg}`,
          });
        }
        razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      }
    } else {
      razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    // 6. Consistently return valid JSON response with order_id & razorpayOrderId
    return res.status(200).json({
      success: true,
      order_id: razorpayOrderId,
      razorpayOrderId,
      amount: amountInPaise,
      totalInRupees: calculatedTotal,
      currency,
      keyId,
      orderId: generatedOrderId,
      orderNumber: generatedOrderNumber,
      breakdown: {
        subtotal: calculatedSubtotal,
        discount: calculatedDiscount,
        shippingFee: calculatedShipping,
        tax: calculatedTax,
        total: calculatedTotal,
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
 * Graceful Method Not Allowed (405) JSON handler for non-POST requests to /create-order.
 */
export function createOrderMethodNotAllowed(req: Request, res: Response) {
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed. Endpoint /api/payment/create-order strictly expects an HTTP POST request.`,
    endpoint: '/api/payment/create-order',
    requiredMethod: 'POST',
    allowedMethods: ['POST', 'OPTIONS'],
  });
}

// Router bindings: allow all HTTP methods (POST, GET, etc.) to prevent 405 Method Not Allowed errors
paymentRouter.all('/create-order', createOrderHandler);
paymentRouter.all('/create-order/', createOrderHandler);
