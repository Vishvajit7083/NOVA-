import React from 'react';
import {
  CheckCircle,
  Truck,
  Download,
  ArrowRight,
  ShieldCheck,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  QrCode,
  Lock,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface OrderConfirmationPageProps {
  orderId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const { orders, showToast } = useShop();

  const currentOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId) || orders[0];

  const handleDownloadInvoice = () => {
    showToast('Invoice Downloaded', 'Official GST Tax Invoice downloaded to your device.');
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-20 text-center">
        <h2 className="text-xl font-bold">No Order Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 px-6 py-2.5 bg-[#EB0028] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const isPaid = currentOrder.paymentDetails?.paid ?? (currentOrder.paymentMethod !== 'cod');
  const paymentMethodLabel = currentOrder.paymentDetails?.methodLabel || currentOrder.paymentMethod.toUpperCase();

  return (
    <div id="order-confirmation-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Banner */}
        <div className="text-center space-y-4 bg-white border border-zinc-200 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isPaid ? 'Payment Verified & Captured' : 'Order Placed (COD Pending)'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-display">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Your hardware is being packed at our Bengaluru robotics fulfillment hub.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="bg-[#F8F9FA] px-4 py-2 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-700">
              <span>Order Reference: </span>
              <strong className="text-zinc-950 font-bold">{currentOrder.orderNumber || currentOrder.id}</strong>
            </div>

            {currentOrder.paymentDetails?.transactionId && (
              <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-800">
                <span>Transaction Ref: </span>
                <strong className="text-emerald-950 font-bold">{currentOrder.paymentDetails.transactionId}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Live Delivery Progress Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#EB0028] uppercase tracking-wider">
                BlueDart Express Consignment
              </span>
              <h3 className="text-base font-bold text-zinc-950">
                Estimated Delivery: {currentOrder.estimatedDeliveryDate}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('tracking', { trackingNumber: currentOrder.trackingNumber })}
              className="px-4 py-2 rounded-xl bg-[#F8F9FA] hover:bg-zinc-100 text-xs font-bold text-zinc-900 border border-zinc-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-[#EB0028]" />
              <span>Track Live Status</span>
            </button>
          </div>

          {/* Timeline steps */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="text-emerald-700 font-bold">1. Confirmed</div>
              <div className="text-[11px] text-emerald-600">Order verified & paid</div>
            </div>
            <div className="p-3 bg-[#F8F9FA] border border-zinc-200 rounded-xl space-y-1">
              <div className="text-zinc-950 font-bold">2. Packing</div>
              <div className="text-[11px] text-zinc-500">Bengaluru Hub</div>
            </div>
            <div className="p-3 bg-[#F8F9FA] border border-zinc-200 rounded-xl space-y-1">
              <div className="text-zinc-400 font-bold">3. In Transit</div>
              <div className="text-[11px] text-zinc-400">BlueDart Air</div>
            </div>
            <div className="p-3 bg-[#F8F9FA] border border-zinc-200 rounded-xl space-y-1">
              <div className="text-zinc-400 font-bold">4. Doorstep</div>
              <div className="text-[11px] text-zinc-400">Delivered with OTP</div>
            </div>
          </div>

          {/* Payment & Shipping Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-zinc-200 space-y-1 text-zinc-500">
              <div className="flex items-center space-x-1.5 text-zinc-950 font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#EB0028]" />
                <span>Shipping Destination</span>
              </div>
              <p className="text-zinc-800 font-medium">
                {currentOrder.shippingAddress.fullName} ({currentOrder.shippingAddress.phone})
              </p>
              <p>
                {currentOrder.shippingAddress.street}, {currentOrder.shippingAddress.city},{' '}
                {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
              </p>
            </div>

            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-zinc-200 space-y-1 text-zinc-500">
              <div className="flex items-center space-x-1.5 text-zinc-950 font-bold">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Confirmation</span>
              </div>
              <p className="text-zinc-800 font-medium">
                Method: {paymentMethodLabel}
              </p>
              <p className="font-mono text-[11px]">
                Status: <strong className={isPaid ? 'text-emerald-600' : 'text-amber-600'}>{isPaid ? 'PAID / CAPTURED' : 'CASH ON DELIVERY'}</strong>
              </p>
              {currentOrder.paymentDetails?.paidAt && (
                <p className="text-[10px] text-zinc-400">
                  Paid at: {new Date(currentOrder.paymentDetails.paidAt).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Line Items Summary */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider border-b border-zinc-200 pb-3">
            Hardware In This Order ({currentOrder.items.length})
          </h3>

          <div className="divide-y divide-zinc-100 space-y-3">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-12 object-contain rounded-lg bg-[#F8F9FA] p-1 border border-zinc-200"
                  />
                  <div>
                    <h5 className="font-bold text-zinc-900">{item.product.name}</h5>
                    <div className="text-[11px] text-zinc-500">
                      Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor.name}`}
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-zinc-950 font-mono">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-sm font-bold text-zinc-950">
            <span>Total Amount</span>
            <span className="text-lg font-mono text-[#EB0028]">
              ₹{currentOrder.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#EB0028]" />
            <span>Download GST Tax Invoice</span>
          </button>

          <button
            onClick={() => onNavigate('store')}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-colors cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
