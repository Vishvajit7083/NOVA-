import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';

interface CheckoutPageProps {
  onNavigate: (view: string, params?: any) => void;
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
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-20 px-4 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 shadow-sm">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-950">Your shopping bag is empty</h2>
        <p className="text-xs text-zinc-500 max-w-sm">
          Please add items to your cart before proceeding to the checkout portal.
        </p>
        <button
          onClick={() => onNavigate('store')}
          className="px-6 py-3 rounded-xl bg-[#EB0028] text-white font-bold text-xs shadow-md transition-colors hover:bg-[#c90023]"
        >
          Explore Catalog
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

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
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

      const methodLabel =
        paymentMethod === 'upi'
          ? 'UPI FastPay'
          : paymentMethod === 'card'
          ? 'Credit/Debit Card'
          : paymentMethod === 'netbanking'
          ? 'Net Banking'
          : 'Cash on Delivery (COD)';

      const createdOrder = placeOrder({
        items: [...cart],
        shippingAddress,
        contactEmail: email,
        contactPhone: phone,
        deliveryMethod: shippingMethod,
        paymentMethod,
        paymentDetails: {
          methodLabel,
          transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          paid: paymentMethod !== 'cod',
        },
        subtotal: cartSubtotal,
        discount: cartDiscount,
        couponCode: appliedCoupon?.code,
        shippingFee: cartShippingFee,
        tax: 0,
        total: cartTotal,
        trackingCarrier: 'BlueDart Air Express',
        trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        estimatedDeliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      });

      setIsProcessing(false);
      onNavigate('order-confirmation', { orderId: createdOrder.id });
    }, 1200);
  };

  return (
    <div id="checkout-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Step Indicator */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <button
            onClick={() => onNavigate('store')}
            className="flex items-center space-x-1.5 text-xs text-zinc-600 hover:text-zinc-950 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          {/* Stepper */}
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#EB0028]' : 'text-zinc-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#EB0028] text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                1
              </span>
              <span>Address</span>
            </div>
            <span className="text-zinc-300">──</span>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#EB0028]' : 'text-zinc-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#EB0028] text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                2
              </span>
              <span>Delivery</span>
            </div>
            <span className="text-zinc-300">──</span>
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#EB0028]' : 'text-zinc-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#EB0028] text-white' : 'bg-zinc-200 text-zinc-600'}`}>
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
            {/* STEP 1: Address Form */}
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b border-zinc-200 pb-4">
                  <h2 className="text-lg font-bold text-zinc-950">1. Shipping & Contact Information</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    We deliver across all PIN codes in India via BlueDart Air Express.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-[#EB0028]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Phone Number (+91) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-[#EB0028]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-700 font-semibold mb-1">Email Address (for invoice & tracking) *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. vikram@example.com"
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-[#EB0028]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-700 font-semibold mb-1">Flat / House No. / Street Address *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Flat 402, Skyline Residency, Outer Ring Road"
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-[#EB0028]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">6-Digit PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeAutoFill(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 560001"
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900 font-mono focus:outline-none focus:border-[#EB0028]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-[#EB0028]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-700 font-semibold mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-[#EB0028]"
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
                  className="w-full py-3.5 bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Continue to Delivery Speed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Delivery Speed */}
            {step === 2 && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-950">2. Delivery Speed & Logistics</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Delivering to <strong>{fullName}</strong>, {city}, {state} - {pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#EB0028] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('express_priority')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      shippingMethod === 'express_priority'
                        ? 'bg-red-50 border-[#EB0028] text-zinc-950'
                        : 'bg-[#F8F9FA] border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-[#EB0028]" />
                      <div>
                        <div className="text-xs font-bold text-zinc-900">BlueDart Priority Air Express (24-48 Hours)</div>
                        <div className="text-[11px] text-zinc-500">Doorstep tracking & tamper-proof seal</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      {cartShippingFee === 0 ? 'FREE' : `₹${cartShippingFee}`}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      shippingMethod === 'standard'
                        ? 'bg-red-50 border-[#EB0028] text-zinc-950'
                        : 'bg-[#F8F9FA] border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-zinc-400" />
                      <div>
                        <div className="text-xs font-bold text-zinc-900">Standard Ground Surface (3-5 Days)</div>
                        <div className="text-[11px] text-zinc-500">Standard courier dispatch</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">FREE</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Proceed to Secure Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Options */}
            {step === 3 && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-950">3. Select Payment Mode</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Encrypted 256-Bit SSL with instant verification.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#EB0028] hover:underline"
                  >
                    Back
                  </button>
                </div>

                {/* Payment Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-red-50 border-[#EB0028] text-[#EB0028]'
                        : 'bg-[#F8F9FA] border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#EB0028]" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-red-50 border-[#EB0028] text-[#EB0028]'
                        : 'bg-[#F8F9FA] border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1.5 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-red-50 border-[#EB0028] text-[#EB0028]'
                        : 'bg-[#F8F9FA] border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-red-50 border-[#EB0028] text-[#EB0028]'
                        : 'bg-[#F8F9FA] border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span>Pay on Delivery</span>
                  </button>
                </div>

                {/* Sub-panels for payment */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-zinc-200 space-y-3 text-xs">
                    <div className="font-bold text-zinc-900">Enter UPI Virtual Payment Address (VPA)</div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@okhdfcbank or yourname@upi"
                        className="flex-1 bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 text-xs focus:outline-none focus:border-[#EB0028]"
                      />
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Supports Google Pay, PhonePe, Paytm, BHIM and Cred UPI</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-zinc-200 space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• ••••"
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-mono focus:outline-none focus:border-[#EB0028]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-mono focus:outline-none focus:border-[#EB0028]"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-700 font-semibold mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-mono focus:outline-none focus:border-[#EB0028]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1 text-amber-900">
                    <div className="font-bold">Cash / UPI on Doorstep Delivery</div>
                    <p className="text-[11px] text-amber-700">
                      You can pay via Cash or scan the BlueDart delivery agent's dynamic UPI QR code upon parcel arrival.
                    </p>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-zinc-200 text-xs space-y-2">
                    <div className="font-bold text-zinc-900">Select Popular Bank</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          className="p-2.5 bg-white rounded-xl border border-zinc-200 text-left text-zinc-700 hover:text-zinc-950 hover:border-[#EB0028] transition-colors"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  id="checkout-confirm-pay-btn"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#EB0028] hover:bg-[#c90023] disabled:bg-zinc-300 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Authenticating & Securing Order...'
                      : `Confirm & Pay ₹${cartTotal.toLocaleString('en-IN')}`}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 sticky top-24 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-3">
                Order Review ({cart.length} items)
              </h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-12 h-12 object-contain rounded-lg bg-[#F8F9FA] p-1 border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-zinc-900 font-bold truncate">{item.product.name}</h5>
                      <div className="text-[11px] text-zinc-500">
                        Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor.name}`}
                      </div>
                    </div>
                    <div className="font-bold text-zinc-950">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-zinc-200 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Courier Shipping</span>
                  <span className="text-emerald-600 font-bold">
                    {cartShippingFee === 0 ? 'FREE' : `₹${cartShippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18% Included)</span>
                  <span className="text-zinc-500">₹{Math.round(cartTotal * 0.18).toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex justify-between text-base font-extrabold text-zinc-950">
                  <span>Grand Total</span>
                  <span className="font-display text-lg text-[#EB0028]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-zinc-200 space-y-1 text-[11px] text-zinc-600">
                <div className="flex items-center text-emerald-600 font-bold space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>2-Year NovaCare™ Automatic Registration</span>
                </div>
                <p>Doorstep pickup and replacement warranty activated automatically upon order placement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
