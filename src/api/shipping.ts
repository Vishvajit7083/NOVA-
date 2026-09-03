import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { ShippingConfig, ShipmentRecord, ShipmentStatus, OrderTrackingEvent } from '../types';
import { requireAdmin } from './authMiddleware';

export const shippingRouter = express.Router();

// Default warehouse configuration if not overridden by DB
export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  pickupWarehouse: {
    companyName: 'SINDHUDURG GARMENTS Handloom Logistics',
    contactName: 'Heritage Dispatch Director',
    phone: '+91 98230 45678',
    email: 'dispatch@sindhudurggarments.com',
    addressLine1: 'Heritage Handloom Complex, Near Sindhudurg Fort Road',
    addressLine2: 'Malvan Coastal Heritage Zone',
    city: 'Sindhudurg',
    state: 'Maharashtra',
    pincode: '416606',
    country: 'India',
  },
  connectedProvider: (process.env.SHIPPING_PROVIDER as any) || 'manual',
  providerStatus: {
    configured: Boolean(process.env.SHIPROCKET_API_TOKEN || process.env.DELHIVERY_API_TOKEN),
    mode: (process.env.SHIPROCKET_API_TOKEN || process.env.DELHIVERY_API_TOKEN) ? 'live' : 'manual',
    providerName: process.env.SHIPPING_PROVIDER === 'shiprocket'
      ? 'Shiprocket Automated Courier Gateway'
      : process.env.SHIPPING_PROVIDER === 'delhivery'
      ? 'Delhivery Direct Air Cargo API'
      : 'Sindhudurg Enterprise Dispatch (Manual & Multi-Carrier)',
    lastSyncAt: new Date().toISOString(),
  },
  packageDefaults: {
    defaultWeightGrams: 850,
    defaultDimensions: {
      length: 38,
      width: 28,
      height: 10,
      unit: 'cm',
    },
    defaultBoxType: 'SINDHUDURG GARMENTS Presentation Box',
  },
  shippingRules: {
    standardShippingFee: 99,
    freeShippingThreshold: 999,
    expressShippingFee: 249,
    codAvailable: true,
    codExtraFee: 50,
    enableServiceabilityCheck: true,
    defaultTransitDays: 3,
  },
  serviceableZones: [
    {
      name: 'Tier 1 Metro Air Priority (BLR, DEL, BOM, HYD, MAA, CCU)',
      pincodePrefixes: ['560', '110', '121', '122', '201', '400', '401', '500', '600', '700', '411', '380'],
      transitDays: 2,
      codAvailable: true,
    },
    {
      name: 'Tier 2 State Capitals & Industrial Corridors',
      pincodePrefixes: ['14', '16', '24', '30', '31', '36', '45', '46', '68', '69', '52', '53', '75', '80'],
      transitDays: 3,
      codAvailable: true,
    },
    {
      name: 'All-India Insured Ground & Regional Surface',
      pincodePrefixes: ['1', '2', '3', '4', '5', '6', '7', '8'],
      transitDays: 5,
      codAvailable: true,
    },
  ],
  returnPolicy: {
    returnWindowDays: 14,
    exchangesAllowed: true,
    returnFee: 0,
    terms: 'Complimentary doorstep reverse pickup within 14 days for unworn garments with security tags intact.',
  },
};

// In-memory shipment store for instant server synchronization
const serverShipments: ShipmentRecord[] = [];

// 1. GET /api/shipping/config - Fetch active configuration and provider state
shippingRouter.all(['/config', '/config/'], (_req: Request, res: Response) => {
  const provider = (process.env.SHIPPING_PROVIDER as any) || 'manual';
  const hasApiTokens = Boolean(process.env.SHIPROCKET_API_TOKEN || process.env.DELHIVERY_API_TOKEN);

  const activeConfig: ShippingConfig = {
    ...DEFAULT_SHIPPING_CONFIG,
    connectedProvider: provider,
    providerStatus: {
      configured: hasApiTokens,
      mode: hasApiTokens ? 'live' : 'manual',
      providerName: provider === 'shiprocket'
        ? 'Shiprocket Courier Engine'
        : provider === 'delhivery'
        ? 'Delhivery Air Direct API'
        : 'Enterprise Dispatch & Manual AWB Entry',
      lastSyncAt: new Date().toISOString(),
    },
  };

  res.json({
    success: true,
    config: activeConfig,
  });
});

// 2. POST /api/shipping/serviceability - Check 6-digit Indian PIN Code serviceability
shippingRouter.post(['/serviceability', '/serviceability/'], async (req: Request, res: Response) => {
  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { pincode, deliveryMethod = 'standard' } = body;
    const cleanPin = String(pincode || '').trim();

    if (!/^\d{6}$/.test(cleanPin)) {
      return res.status(400).json({
        success: false,
        serviceable: false,
        error: 'Please enter a valid 6-digit Indian postal PIN code.',
      });
    }

    // Determine region and serviceability rules
    let city = 'Metro Region';
    let state = 'India';
    let transitDays = 3;
    let courier = 'BlueDart Air Express';
    let codAvailable = true;

    if (cleanPin.startsWith('560')) {
      city = 'Bengaluru';
      state = 'Karnataka';
      transitDays = 1;
      courier = 'BlueDart Local HyperExpress';
    } else if (cleanPin.startsWith('110') || cleanPin.startsWith('121') || cleanPin.startsWith('122') || cleanPin.startsWith('201')) {
      city = 'Delhi NCR';
      state = 'Delhi';
      transitDays = 2;
      courier = 'BlueDart Air Priority';
    } else if (cleanPin.startsWith('400') || cleanPin.startsWith('401')) {
      city = 'Mumbai';
      state = 'Maharashtra';
      transitDays = 2;
      courier = 'BlueDart Air Priority';
    } else if (cleanPin.startsWith('500')) {
      city = 'Hyderabad';
      state = 'Telangana';
      transitDays = 2;
      courier = 'BlueDart Air Priority';
    } else if (cleanPin.startsWith('600')) {
      city = 'Chennai';
      state = 'Tamil Nadu';
      transitDays = 2;
      courier = 'BlueDart Air Priority';
    } else if (cleanPin.startsWith('700')) {
      city = 'Kolkata';
      state = 'West Bengal';
      transitDays = 2;
      courier = 'Delhivery Air Express';
    } else if (cleanPin.startsWith('411')) {
      city = 'Pune';
      state = 'Maharashtra';
      transitDays = 2;
      courier = 'BlueDart Air Priority';
    } else if (cleanPin.startsWith('380')) {
      city = 'Ahmedabad';
      state = 'Gujarat';
      transitDays = 2;
      courier = 'BlueDart Air Priority';
    } else {
      // General India zones
      const firstDigit = cleanPin.charAt(0);
      if (['1', '2'].includes(firstDigit)) {
        city = 'North India Regional Hub';
        state = 'Northern Zone';
      } else if (['3', '4'].includes(firstDigit)) {
        city = 'West India Regional Hub';
        state = 'Western Zone';
      } else if (['5', '6'].includes(firstDigit)) {
        city = 'South India Regional Hub';
        state = 'Southern Zone';
      } else {
        city = 'East & Central Hub';
        state = 'Eastern Zone';
      }
      transitDays = 4;
      courier = 'Delhivery Surface / DTDC Premium';
    }

    if (deliveryMethod === 'express_priority' && transitDays > 1) {
      transitDays = Math.max(1, transitDays - 1);
    }

    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + transitDays);

    const formattedEta = etaDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    return res.json({
      success: true,
      serviceable: true,
      pincode: cleanPin,
      city,
      state,
      transitDays,
      estimatedDeliveryDate: formattedEta,
      courierName: courier,
      codAvailable,
      prepaidAvailable: true,
      pickupAvailable: true,
      shippingProvider: process.env.SHIPPING_PROVIDER || 'manual',
    });
  } catch (error: any) {
    console.error('Error checking serviceability:', error);
    return res.status(500).json({
      success: false,
      serviceable: false,
      error: error.message || 'Error verifying pincode serviceability.',
    });
  }
});

// 3. POST /api/shipping/create-shipment - Admin create shipment & AWB generation
shippingRouter.post(['/create-shipment', '/create-shipment/'], requireAdmin, async (req: Request, res: Response) => {
  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const {
      orderId,
      orderNumber,
      courierName = 'BlueDart Express Air Priority',
      awbNumber: customAwb,
      packageWeightGrams = 850,
      packageDimensions = { length: 38, width: 28, height: 10, unit: 'cm' },
      pickupAddress = DEFAULT_SHIPPING_CONFIG.pickupWarehouse,
      deliveryAddress,
      shippingCharge = 0,
      isManual = true,
      adminEmail = 'admin@sindhudurggarments.com',
    } = body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required to create a shipment.',
      });
    }

    // Generate real AWB number if not provided
    const awbNumber = customAwb || `SDG-${courierName.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;
    const shipmentId = `ship_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const initialEvent: OrderTrackingEvent = {
      status: 'shipment_created',
      title: 'Shipment Manifest Created & AWB Assigned',
      location: `${pickupAddress.city || 'Sindhudurg'} Logistics Center`,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      description: `AWB ${awbNumber} generated with carrier ${courierName}. Ready for scheduled courier pickup handover.`,
      completed: true,
      current: true,
    };

    const newShipment: ShipmentRecord = {
      id: shipmentId,
      orderId,
      orderNumber: orderNumber || orderId,
      provider: (process.env.SHIPPING_PROVIDER as any) || (isManual ? 'manual' : 'other'),
      courierName,
      awbNumber,
      trackingNumber: awbNumber,
      shipmentId,
      packageWeightGrams: Number(packageWeightGrams) || 850,
      packageDimensions,
      pickupAddress: pickupAddress as any,
      deliveryAddress: deliveryAddress as any,
      status: 'shipment_created',
      trackingUrl: courierName.toLowerCase().includes('delhivery')
        ? `https://www.delhivery.com/track/package/${awbNumber}`
        : courierName.toLowerCase().includes('shiprocket')
        ? `https://shiprocket.co/tracking/${awbNumber}`
        : courierName.toLowerCase().includes('bluedart')
        ? `https://www.bluedart.com/tracking?handler=trak&numbers=${awbNumber}`
        : `https://sindhudurggarments.com/track?awb=${awbNumber}`,
      isManualEntry: isManual,
      shippingCharge: Number(shippingCharge) || 0,
      events: [initialEvent],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in server memory cache
    serverShipments.unshift(newShipment);

    return res.json({
      success: true,
      shipment: newShipment,
      awbNumber: newShipment.awbNumber,
      trackingUrl: newShipment.trackingUrl,
      message: `Shipment successfully created. AWB: ${newShipment.awbNumber} assigned.`,
    });
  } catch (error: any) {
    console.error('Error creating shipment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal error creating shipment.',
    });
  }
});

// 4. POST /api/shipping/update-status - Update shipment event (Manual or Webhook)
shippingRouter.post(['/update-status', '/update-status/'], requireAdmin, async (req: Request, res: Response) => {
  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const {
      shipmentId,
      awbNumber,
      orderId,
      newStatus,
      location,
      notes,
      adminEmail = 'admin@sindhudurggarments.com',
    } = body;

    if (!newStatus) {
      return res.status(400).json({ success: false, error: 'New shipment status is required.' });
    }

    const statusTitleMap: Record<ShipmentStatus, string> = {
      shipment_created: 'Shipment Manifest Created & AWB Assigned',
      pickup_scheduled: 'Courier Pickup Scheduled & Vehicle Dispatched',
      picked_up: 'Consignment Handed Over to Logistics Courier',
      in_transit: 'In Transit — Departed Source Air Hub',
      reached_destination_hub: 'Arrived at Destination City Logistics Facility',
      out_for_delivery: 'Out for Doorstep Handover',
      delivered: 'Delivered — Packaging Intact',
      delivery_attempted: 'Delivery Attempted — Customer Unavailable',
      failed_delivery: 'Delivery Exception — Contacting Recipient',
      returned_to_origin: 'Returned to Warehouse Hub',
      cancelled: 'Shipment Cancelled by Shipper',
    };

    const newEvent: OrderTrackingEvent = {
      status: newStatus as any,
      title: statusTitleMap[newStatus as ShipmentStatus] || 'Logistics Status Updated',
      location: location || 'Transit Logistics Network',
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      description: notes || `Shipment status progressed to ${newStatus}.`,
      completed: true,
      current: true,
    };

    // Update in memory cache
    const existing = serverShipments.find(
      (s) => s.id === shipmentId || s.awbNumber === awbNumber || s.orderId === orderId
    );

    if (existing) {
      existing.status = newStatus as ShipmentStatus;
      existing.updatedAt = new Date().toISOString();
      existing.events.forEach((e) => (e.current = false));
      existing.events.push(newEvent);
    }

    return res.json({
      success: true,
      newStatus,
      event: newEvent,
      message: `Shipment status updated to ${newStatus}.`,
    });
  } catch (error: any) {
    console.error('Error updating shipment status:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error updating shipment status.',
    });
  }
});

// 5. ALL /api/shipping/webhook - Courier Webhook receiver (Shiprocket / Delhivery / Custom)
shippingRouter.all(['/webhook', '/webhook/'], async (req: any, res: Response) => {
  try {
    const webhookSecret = process.env.SHIPPING_WEBHOOK_SECRET;
    const incomingSignature = req.headers['x-shipping-signature'] || req.headers['x-shiprocket-signature'];

    if (webhookSecret && incomingSignature && req.rawBody) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.rawBody)
        .digest('hex');

      if (expectedSignature !== incomingSignature) {
        console.warn('Courier webhook signature mismatch rejected.');
        return res.status(401).json({ success: false, error: 'Unauthorized webhook signature.' });
      }
    }

    const payload = req.body || {};
    console.log('Received courier webhook notification:', payload);

    const awb = payload.awb || payload.tracking_number || payload.awb_code;
    const courierStatus = (payload.current_status || payload.status || '').toLowerCase();
    const location = payload.location || payload.current_city || 'Regional Hub';
    const activity = payload.activity || payload.scanned_location || 'Transit checkpoint passed';

    let mappedStatus: ShipmentStatus = 'in_transit';
    if (courierStatus.includes('pick') && courierStatus.includes('sched')) mappedStatus = 'pickup_scheduled';
    else if (courierStatus.includes('pick') || courierStatus.includes('collected')) mappedStatus = 'picked_up';
    else if (courierStatus.includes('hub') || courierStatus.includes('arrived')) mappedStatus = 'reached_destination_hub';
    else if (courierStatus.includes('out') || courierStatus.includes('delivery')) mappedStatus = 'out_for_delivery';
    else if (courierStatus.includes('deliv') || courierStatus.includes('complete')) mappedStatus = 'delivered';
    else if (courierStatus.includes('rto') || courierStatus.includes('return')) mappedStatus = 'returned_to_origin';
    else if (courierStatus.includes('cancel')) mappedStatus = 'cancelled';

    const shipment = serverShipments.find((s) => s.awbNumber === awb);
    if (shipment) {
      shipment.status = mappedStatus;
      shipment.updatedAt = new Date().toISOString();
      shipment.events.forEach((e) => (e.current = false));
      shipment.events.push({
        status: mappedStatus,
        title: `Courier Checkpoint: ${activity}`,
        location,
        timestamp: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        description: `Automated live carrier scan: ${activity}`,
        completed: true,
        current: true,
      });
    }

    return res.status(200).json({ success: true, received: true, mappedStatus });
  } catch (error: any) {
    console.error('Error handling courier webhook:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
