interface Env {
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  DEFAULT_CURRENCY?: string;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json',
};

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle API requests
    if (pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      // GET /api/payment/config
      if (pathname === '/api/payment/config' || pathname === '/api/payment/config/') {
        const keyId = env.RAZORPAY_KEY_ID || 'rzp_live_TWNW4QLaIecxI5';
        const rawCurrency = String(env.DEFAULT_CURRENCY || 'INR').replace(/[^a-zA-Z]/g, '').toUpperCase().trim();
        const currency = rawCurrency.length === 3 ? rawCurrency : 'INR';
        return jsonResponse({
          success: true,
          keyId,
          isConfigured: true,
          mode: keyId.startsWith('rzp_live') ? 'live' : 'test',
          currency,
          enableInternational: true,
          storeName: 'NOVA Flagship Electronics',
          brandColor: '#EB0028',
          methodsSupported: ['upi', 'cards', 'netbanking', 'wallets', 'international_cards', 'cod'],
        });
      }

      // POST /api/payment/create-order
      if (pathname === '/api/payment/create-order' || pathname === '/api/payment/create-order/') {
        return handleCreateOrder(request, env);
      }

      // POST /api/payment/verify
      if (pathname === '/api/payment/verify' || pathname === '/api/payment/verify/') {
        return handleVerifyPayment(request, env);
      }

      return jsonResponse({ success: false, error: `API route not found: ${pathname}` }, 404);
    }

    // Pass all non-API requests to static asset fetch with SPA fallback
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !pathname.includes('.')) {
        // SPA Fallback: return index.html for client-side routing
        const indexRequest = new Request(new URL('/', request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }
      return response;
    }

    return new Response('Asset server not configured', { status: 404 });
  },
};

async function handleCreateOrder(request: Request, env: Env): Promise<Response> {
  try {
    let body: any = {};
    const url = new URL(request.url);

    url.searchParams.forEach((val, key) => {
      body[key] = val;
    });

    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const text = await request.text();
        if (text && text.trim().length > 0) {
          const jsonBody = JSON.parse(text);
          body = { ...body, ...jsonBody };
        }
      } catch (e) {}
    }

    if (typeof body.items === 'string') {
      try { body.items = JSON.parse(body.items); } catch (e) {}
    }

    const {
      items = [],
      couponCode,
      deliveryMethod = 'standard',
      shippingAddress,
      contactEmail,
      contactPhone,
      orderId,
      orderNumber,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return jsonResponse({
        success: false,
        error: 'Invalid request body: "items" array with at least one product is required to create a payment order.',
      }, 400);
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
    const rawCurrency = String(body.currency || env.DEFAULT_CURRENCY || 'INR').replace(/[^a-zA-Z]/g, '').toUpperCase().trim();
    const currency = rawCurrency.length === 3 ? rawCurrency : 'INR';
    const amountInPaise = Math.round(calculatedTotal * 100);

    const keyId = env.RAZORPAY_KEY_ID || 'rzp_live_TWNW4QLaIecxI5';
    const keySecret = env.RAZORPAY_KEY_SECRET || 'HP02MHqrsfbaWNza1GXQn3r5';

    if (!keyId || !keySecret) {
      return jsonResponse({
        success: false,
        error: 'Razorpay API credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing or not configured on the Worker environment.',
      }, 400);
    }

    let razorpayOrderId = '';
    try {
      const sanitizedNotes: Record<string, string> = {};
      if (generatedOrderId) sanitizedNotes.orderId = String(generatedOrderId).slice(0, 40);
      if (generatedOrderNumber) sanitizedNotes.orderNumber = String(generatedOrderNumber).slice(0, 40);
      if (contactEmail && String(contactEmail).trim()) sanitizedNotes.email = String(contactEmail).trim().slice(0, 254);
      if (contactPhone && String(contactPhone).trim()) sanitizedNotes.phone = String(contactPhone).trim().slice(0, 254);
      if (shippingAddress?.fullName && String(shippingAddress.fullName).trim()) {
        sanitizedNotes.customerName = String(shippingAddress.fullName).trim().slice(0, 254);
      }
      if (shippingAddress?.city && String(shippingAddress.city).trim()) {
        sanitizedNotes.shippingCity = String(shippingAddress.city).trim().slice(0, 254);
      }
      const sanitizedReceipt = `rcpt_${String(generatedOrderId).replace(/[^a-zA-Z0-9_-]/g, '').slice(-30)}`;

      const authHeader = 'Basic ' + btoa(`${keyId}:${keySecret}`);
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amountInPaise),
          currency,
          receipt: sanitizedReceipt,
          notes: sanitizedNotes,
        }),
      });

      const rzpData: any = await rzpResponse.json();
      if (rzpResponse.ok && rzpData && rzpData.id) {
        razorpayOrderId = rzpData.id;
      } else {
        console.error('Razorpay API error:', rzpData);
        const errMsg = rzpData?.error?.description || rzpData?.description || 'Failed to create order on Razorpay API';
        if (keyId.startsWith('rzp_test_')) {
          console.warn('Falling back to test order ID for Razorpay test key in Worker:', errMsg);
          razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        } else {
          return jsonResponse({
            success: false,
            error: `Razorpay Gateway Error: ${errMsg}`,
          }, 400);
        }
      }
    } catch (err: any) {
      console.error('Razorpay fetch error:', err);
      if (keyId.startsWith('rzp_test_')) {
        razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      } else {
        return jsonResponse({
          success: false,
          error: `Razorpay connection error: ${err.message || 'Failed to communicate with Razorpay API'}`,
        }, 500);
      }
    }

    return jsonResponse({
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
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message || 'Worker order error' }, 500);
  }
}

async function handleVerifyPayment(request: Request, env: Env): Promise<Response> {
  try {
    let body: any = {};
    try {
      const text = await request.text();
      if (text && text.trim().length > 0) body = JSON.parse(text);
    } catch (e) {}

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return jsonResponse({
        success: false,
        verified: false,
        error: 'Missing required payment verification parameters (razorpay_order_id, razorpay_payment_id, or razorpay_signature).',
      }, 400);
    }

    const keySecret = env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return jsonResponse({
        success: false,
        verified: false,
        error: 'RAZORPAY_KEY_SECRET environment variable is missing on Worker environment.',
      }, 400);
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(keySecret);
    const msgData = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const isVerified = expectedSignature.toLowerCase() === razorpay_signature.toLowerCase();

    if (!isVerified) {
      return jsonResponse({
        success: false,
        verified: false,
        error: 'Payment signature verification failed. HMAC mismatch.',
      }, 400);
    }

    return jsonResponse({
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
  } catch (err: any) {
    return jsonResponse({ success: false, verified: false, error: err.message || 'Worker verify error' }, 500);
  }
}
