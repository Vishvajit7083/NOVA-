import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  Lock,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  RefreshCw,
  Globe,
  Wallet,
  CheckCircle2,
  Scissors,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address } from '../types';
import { openRazorpayCheckout, loadRazorpayScript, safeFetchJson } from '../lib/razorpay';
import { savePaymentTransactionInDB } from '../lib/db';

interface CheckoutPageProps {
  onNavigate: (view: string, params?: any) => void;
}

interface GatewayConfig {
  keyId: string;
  isConfigured: boolean;
  mode: 'test' | 'live';
  currency: string;
  enableInternational: boolean;
  storeName: string;
  brandColor: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    placeOrder,
    currentUser,
    showToast,
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Gateway Config State
  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig>({
    keyId: '',
    isConfigured: false,
    mode: 'test',
    currency: 'INR',
    enableInternational: true,
    storeName: 'AURELIA & CO. Haute Couture',
    brandColor: '#9A7B38',
  });

  // Address Form State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'express_priority' | 'standard'>('express_priority');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'international_card' | 'cod'>('upi');
  
  // Processing and failure states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  useEffect(() => {
    // Pre-load Razorpay checkout SDK
    loadRazorpayScript();

    // Fetch gateway configuration from backend
    safeFetchJson('/api/payment/config')
      .then((data) => {
        if (data && data.success) {
          setGatewayConfig(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch payment config:', err);
      });
  }, []);

  const indianStates = [
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Delhi NCR',
    'Gujarat',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Maharashtra',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#111111] py-20 px-4 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#9A7B38] shadow-xs">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">Your shopping bag is empty</h2>
        <p className="text-xs text-stone-500 max-w-sm font-normal">
          Please select your desired garments or accessories before proceeding to the checkout portal.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
        >
          Explore Collections
        </button>
      </div>
    );
  }

  const handlePincodeAutoFill = (pin: string) => {
    setPincode(pin);
    if (pin.length === 6) {
      if (pin.startsWith('560')) {
        setCity('Bengaluru');
        setState('Karnataka');
      } else if (pin.startsWith('110')) {
        setCity('New Delhi');
        setState('Delhi NCR');
      } else if (pin.startsWith('400')) {
        setCity('Mumbai');
        setState('Maharashtra');
      } else if (pin.startsWith('500')) {
        setCity('Hyderabad');
        setState('Telangana');
      } else if (pin.startsWith('600')) {
        setCity('Chennai');
        setState('Tamil Nadu');
      } else if (pin.startsWith('700')) {
        setCity('Kolkata');
        setState('West Bengal');
      } else if (pin.startsWith('411')) {
        setCity('Pune');
        setState('Maharashtra');
      }
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !street || !city || pincode.length !== 6) {
      showToast('Missing Fields', 'Please complete all address fields correctly.', 'error');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setPaymentError(null);
    setIsProcessing(true);
    setProcessingStatus('Creating secure order with Razorpay...');

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      isDefault: true,
      addressType: 'home',
    };

    // If Cash on Delivery is selected:
    if (paymentMethod === 'cod') {
      try {
        const createdOrder = await placeOrder({
          items: [...cart],
          shippingAddress,
          contactEmail: email,
          contactPhone: phone,
          deliveryMethod: shippingMethod,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          paymentDetails: {
            methodLabel: 'Cash / UPI on Delivery (COD)',
            transactionId: `COD-${Date.now().toString().slice(-8)}`,
            paid: false,
            gateway: 'cod',
            method: 'cod',
          },
          subtotal: cartSubtotal,
          discount: cartDiscount,
          couponCode: appliedCoupon?.code || '',
          shippingFee: cartShippingFee,
          tax: Math.round((cartSubtotal - cartDiscount) * 0.12),
          total: cartTotal,
          trackingCarrier: 'BlueDart Luxury Express',
          trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
          estimatedDeliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
        });

        setIsProcessing(false);
        onNavigate('order-confirmation', { orderId: createdOrder.id });
      } catch (err: any) {
        setIsProcessing(false);
        setPaymentError(err.message || 'Failed to place COD order. Please retry.');
        showToast('Order Failed', err.message || 'Failed to place COD order.', 'error');
      }
      return;
    }

    // ----------------------------------------------------
    // REAL RAZORPAY GATEWAY PAYMENT FLOW
    // ----------------------------------------------------
    try {
      const orderTimestamp = Date.now();
      const generatedOrderId = `AT-${orderTimestamp.toString().slice(-6)}`;
      const generatedOrderNumber = generatedOrderId;

      // 1. Call backend server to create official Razorpay order with server-calculated total
      const orderCreateData = await safeFetchJson('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingFee: cartShippingFee,
          couponCode: appliedCoupon?.code,
          deliveryMethod: shippingMethod,
          shippingAddress,
          contactEmail: email,
          contactPhone: phone,
          orderId: generatedOrderId,
          orderNumber: generatedOrderNumber,
          userUid: currentUser?.id,
        }),
      });

      if (!orderCreateData.success) {
        throw new Error(orderCreateData.error || 'Failed to initialize payment gateway.');
      }

      setProcessingStatus('Opening Razorpay Payment Gateway...');

      // 2. Open Razorpay Checkout modal
      await openRazorpayCheckout(
        {
          key: orderCreateData.keyId || gatewayConfig.keyId,
          amount: orderCreateData.amount,
          currency: (orderCreateData.currency && String(orderCreateData.currency).replace(/[^a-zA-Z]/g, '').trim().length === 3)
            ? String(orderCreateData.currency).replace(/[^a-zA-Z]/g, '').toUpperCase().trim()
            : 'INR',
          name: gatewayConfig.storeName || 'AURELIA & CO. Haute Couture',
          description: `Order ${generatedOrderNumber} • ${cart.length} Atelier Item(s)`,
          order_id: orderCreateData.razorpayOrderId,
          prefill: {
            name: fullName,
            email,
            contact: phone,
            method: paymentMethod === 'international_card' ? 'card' : paymentMethod,
          },
          notes: {
            orderId: generatedOrderId,
            orderNumber: generatedOrderNumber,
            shippingCity: city,
          },
          theme: {
            color: '#9A7B38',
            backdrop_color: '#111111',
          },
          modal: {
            confirm_close: true,
            ondismiss: () => {
              setIsProcessing(false);
              setProcessingStatus('');
              setPaymentError('Payment was cancelled before completion. You can retry safely whenever ready.');
              showToast('Payment Cancelled', 'The payment window was closed without completing authorization.', 'info');
            },
          },
          // 3. Handler called on successful payment authorization from Razorpay
          handler: async (response) => {
            setProcessingStatus('Cryptographically verifying payment signature on server...');

            try {
              // 4. Send signature to backend server for HMAC-SHA256 verification
              const verifyData = await safeFetchJson('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: generatedOrderId,
                  orderNumber: generatedOrderNumber,
                  userUid: currentUser?.id,
                  userEmail: email,
                }),
              });

              if (!verifyData.success || !verifyData.verified) {
                throw new Error(verifyData.error || 'Payment signature verification failed.');
              }

              // 5. Signature verified! Save completed order to Firestore
              const createdOrder = await placeOrder({
                items: [...cart],
                shippingAddress,
                contactEmail: email,
                contactPhone: phone,
                deliveryMethod: shippingMethod,
                paymentMethod,
                paymentStatus: 'paid',
                paymentDetails: verifyData.paymentDetails || {
                  methodLabel: 'Razorpay Instant Verified',
                  transactionId: response.razorpay_payment_id,
                  paid: true,
                  gateway: 'razorpay',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  paidAt: new Date().toISOString(),
                },
                subtotal: cartSubtotal,
                discount: cartDiscount,
                couponCode: appliedCoupon?.code || '',
                shippingFee: cartShippingFee,
                tax: Math.round((cartSubtotal - cartDiscount) * 0.12),
                total: cartTotal,
                trackingCarrier: 'BlueDart Luxury Express',
                trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
                estimatedDeliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                }),
              });

              // Save payment transaction audit log in Firestore
              await savePaymentTransactionInDB({
                id: `txn_${response.razorpay_payment_id}`,
                orderId: createdOrder.id,
                orderNumber: createdOrder.orderNumber,
                gateway: 'razorpay',
                gatewayOrderId: response.razorpay_order_id,
                gatewayPaymentId: response.razorpay_payment_id,
                amount: cartTotal,
                currency: 'INR',
                method: paymentMethod,
                status: 'captured',
                userUid: currentUser?.id,
                userEmail: email,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });

              setIsProcessing(false);
              showToast('Payment Verified!', `Payment ID ${response.razorpay_payment_id} confirmed.`, 'success');
              onNavigate('order-confirmation', { orderId: createdOrder.id });
            } catch (verifyError: any) {
              console.error('Verification error:', verifyError);
              setIsProcessing(false);
              setPaymentError(verifyError.message || 'Payment verification failed on server.');
              showToast('Verification Failed', verifyError.message || 'Could not verify payment.', 'error');
            }
          },
        },
        (failedResponse) => {
          // Razorpay payment failure callback
          setIsProcessing(false);
          setProcessingStatus('');
          const reason = failedResponse?.description || failedResponse?.reason || 'Transaction declined by bank/network.';
          setPaymentError(`Payment Failed: ${reason}`);
          showToast('Payment Failed', reason, 'error');
        }
      );
    } catch (err: any) {
      setIsProcessing(false);
      setProcessingStatus('');
      setPaymentError(err.message || 'An error occurred while launching the payment gateway.');
      showToast('Payment Error', err.message || 'Failed to start payment.', 'error');
    }
  };

  return (
    <div id="checkout-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Top Breadcrumb & Step Indicator */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
          <button
            onClick={() => onNavigate('shop')}
            className="flex items-center space-x-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Collections</span>
          </button>

          {/* Stepper */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#9A7B38]' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#9A7B38] text-white' : 'bg-stone-200 text-stone-600'}`}>
                1
              </span>
              <span>Client Address</span>
            </div>
            <span className="text-stone-300">──</span>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#9A7B38]' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#9A7B38] text-white' : 'bg-stone-200 text-stone-600'}`}>
                2
              </span>
              <span>Courier Logistics</span>
            </div>
            <span className="text-stone-300">──</span>
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#9A7B38]' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#9A7B38] text-white' : 'bg-stone-200 text-stone-600'}`}>
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* 2-Column Checkout Layout: Form (Left) & Order Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Multi-Step Forms */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Payment Failure / Retry Notification Banner */}
            {paymentError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-950">Payment Not Completed</div>
                    <p className="text-rose-700 text-[11px] mt-0.5">{paymentError}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Payment</span>
                </button>
              </div>
            )}

            {/* STEP 1: Address Form */}
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="border-b border-[#EAE4D8] pb-4">
                  <h2 className="text-xl font-serif font-bold text-stone-900">1. Client Shipping & Contact Details</h2>
                  <p className="text-xs text-stone-500 mt-0.5 font-normal">
                    Delivered in tamper-proof archival packaging across all Indian PIN codes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Phone Number (+91) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">Email Address (for invoice & dispatch notifications) *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. vikram@example.com"
                      className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">Flat / Villa / Apartment / Street Address *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Villa 14, Palm Grove Estates, Koramangala"
                      className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">6-Digit PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeAutoFill(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 560034"
                      className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 font-mono focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest rounded-full shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Continue to Courier Logistics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Delivery Speed */}
            {step === 2 && (
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">2. Logistics & Insured Courier</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Delivering to <strong>{fullName}</strong>, {city}, {state} - {pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-[#9A7B38] hover:underline cursor-pointer"
                  >
                    Edit Address
                  </button>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('express_priority')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      shippingMethod === 'express_priority'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-stone-950'
                        : 'bg-white border-[#E8E2D9] text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-[#9A7B38]" />
                      <div>
                        <div className="text-xs font-serif font-bold text-stone-900">BlueDart Insured Air Express (24-48 Hours)</div>
                        <div className="text-[11px] text-stone-500 font-normal">Archival box with 100% insured transit & signature confirmation</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#9A7B38]">
                      {cartShippingFee === 0 ? 'COMPLIMENTARY' : `₹${cartShippingFee}`}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      shippingMethod === 'standard'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-stone-950'
                        : 'bg-white border-[#E8E2D9] text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-stone-400" />
                      <div>
                        <div className="text-xs font-serif font-bold text-stone-900">Standard Surface Delivery (3-5 Days)</div>
                        <div className="text-[11px] text-stone-500 font-normal">Standard protected courier dispatch</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-600">COMPLIMENTARY</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3.5 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest rounded-full shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Secure Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Gateway Options */}
            {step === 3 && (
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">3. Select Payment Mode</h2>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-center space-x-1.5 font-normal">
                      <span>Powered by Razorpay</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>256-Bit SSL Encrypted</span>
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-[#9A7B38] hover:underline cursor-pointer"
                  >
                    Back
                  </button>
                </div>

                {/* Payment Option Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border text-xs font-medium flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-[#9A7B38] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#9A7B38]" />
                    <div className="text-center">
                      <div className="font-serif font-bold text-stone-900">Instant UPI</div>
                      <div className="text-[10px] font-normal text-stone-500 mt-0.5">GPay, PhonePe, Paytm, QR</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border text-xs font-medium flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-[#9A7B38] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-stone-800" />
                    <div className="text-center">
                      <div className="font-serif font-bold text-stone-900">Credit / Debit Cards</div>
                      <div className="text-[10px] font-normal text-stone-500 mt-0.5">Visa, Master, RuPay, Amex</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-4 rounded-2xl border text-xs font-medium flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-[#9A7B38] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Building className="w-5 h-5 text-stone-800" />
                    <div className="text-center">
                      <div className="font-serif font-bold text-stone-900">Net Banking</div>
                      <div className="text-[10px] font-normal text-stone-500 mt-0.5">50+ Indian Banks</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 rounded-2xl border text-xs font-medium flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-[#9A7B38] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-stone-800" />
                    <div className="text-center">
                      <div className="font-serif font-bold text-stone-900">Digital Wallets</div>
                      <div className="text-[10px] font-normal text-stone-500 mt-0.5">Mobikwik, Freecharge, etc.</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('international_card')}
                    className={`p-4 rounded-2xl border text-xs font-medium flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'international_card'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-[#9A7B38] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Globe className="w-5 h-5 text-stone-800" />
                    <div className="text-center">
                      <div className="font-serif font-bold text-stone-900">International Cards</div>
                      <div className="text-[10px] font-normal text-stone-500 mt-0.5">USD, EUR, GBP, AED</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border text-xs font-medium flex flex-col items-center space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#FAF8F5] border-[#9A7B38] text-[#9A7B38] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-stone-800" />
                    <div className="text-center">
                      <div className="font-serif font-bold text-stone-900">Pay on Delivery</div>
                      <div className="text-[10px] font-normal text-stone-500 mt-0.5">Doorstep Cash / QR</div>
                    </div>
                  </button>
                </div>

                {/* Primary Payment Trigger Button */}
                <button
                  id="checkout-confirm-pay-btn"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#111111] hover:bg-[#9A7B38] disabled:bg-stone-400 text-white font-semibold text-xs uppercase tracking-widest rounded-full shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{processingStatus || 'Connecting to Razorpay...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'cod'
                          ? `Confirm Atelier Order (₹${cartTotal.toLocaleString('en-IN')})`
                          : `Authorize with Razorpay (₹${cartTotal.toLocaleString('en-IN')})`}
                      </span>
                    </>
                  )}
                </button>

                {/* Security Footnote */}
                <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B38]" />
                  <span>PCI-DSS Level 1 Encryption • Insured Courier Dispatch • 14-Day Fitting Guarantee</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4 sticky top-24 shadow-xs">
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-[#EAE4D8] pb-3">
                Atelier Order Summary ({cart.length} items)
              </h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-xs">
                    <div className="w-12 h-16 aspect-[3/4] bg-[#FAF8F5] rounded-lg overflow-hidden border border-[#EAE4D8] shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-stone-900 font-serif font-bold truncate">{item.product.name}</h5>
                      <div className="text-[11px] text-stone-500">
                        Qty: {item.quantity} {item.selectedSize && `• Size ${item.selectedSize}`} {item.selectedColor && `• ${item.selectedColor.name}`}
                      </div>
                    </div>
                    <div className="font-bold text-stone-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#EAE4D8] space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-900 font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#9A7B38] font-medium">
                    <span>Privilege Savings ({appliedCoupon?.code})</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Express Courier</span>
                  <span className="text-[#9A7B38] font-bold">
                    {cartShippingFee === 0 ? 'COMPLIMENTARY' : `₹${cartShippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (12% Included)</span>
                  <span className="text-stone-500">₹{Math.round(cartTotal * 0.12).toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-[#EAE4D8] flex justify-between text-base font-serif font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-[#9A7B38]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] space-y-1 text-[11px] text-stone-600">
                <div className="flex items-center text-stone-900 font-serif font-bold space-x-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#9A7B38]" />
                  <span>1-Year Atelier Guarantee & 14-Day Doorstep Fitting</span>
                </div>
                <p className="font-normal">Doorstep courier pickup and size exchange service included with every order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
