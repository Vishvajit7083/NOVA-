import React from 'react';
import {
  CheckCircle,
  Truck,
  Download,
  ArrowRight,
  ShieldCheck,
  Package,
  MapPin,
  CreditCard,
  Scissors,
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
    showToast('Invoice Downloaded', 'Official Atelier Tax Invoice downloaded to your device.');
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#111111] py-20 text-center">
        <h2 className="text-2xl font-serif font-bold">No Order Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 px-6 py-2.5 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs cursor-pointer"
        >
          Return to Atelier
        </button>
      </div>
    );
  }

  const isPaid = currentOrder.paymentDetails?.paid ?? (currentOrder.paymentMethod !== 'cod');
  const paymentMethodLabel = currentOrder.paymentDetails?.methodLabel || currentOrder.paymentMethod.toUpperCase();

  return (
    <div id="order-confirmation-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-8">
        
        {/* Success Banner */}
        <div className="text-center space-y-4 bg-white border border-[#E8E2D9] rounded-3xl p-8 sm:p-10 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center mx-auto text-[#9A7B38] shadow-xs">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isPaid ? 'Payment Verified & Captured' : 'Order Placed (COD Pending)'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-tight">
              Thank You For Your Order
            </h1>
            
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-normal">
              Your garments are being prepared and steam-finished inside archival tissue packaging at our Bengaluru atelier.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="bg-[#FAF8F5] px-4 py-2 rounded-xl border border-[#E0D8C8] text-xs font-mono text-stone-800">
              <span>Order Reference: </span>
              <strong className="text-stone-950 font-bold">{currentOrder.orderNumber || currentOrder.id}</strong>
            </div>

            {currentOrder.paymentDetails?.transactionId && (
              <div className="bg-[#FAF8F5] px-4 py-2 rounded-xl border border-[#E0D8C8] text-xs font-mono text-stone-800">
                <span>Transaction Ref: </span>
                <strong className="text-stone-950 font-bold">{currentOrder.paymentDetails.transactionId}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Live Delivery Progress Card */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE4D8] pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#9A7B38] uppercase tracking-[0.25em]">
                Insured Consignment Dispatch
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Estimated Delivery: {currentOrder.estimatedDeliveryDate}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('tracking', { trackingNumber: currentOrder.trackingNumber })}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#111111] hover:text-white text-xs font-semibold text-stone-900 border border-[#E0D8C8] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-[#9A7B38]" />
              <span>Track Live Consignment</span>
            </button>
          </div>

          {/* Timeline steps */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#9A7B38] rounded-xl space-y-1">
              <div className="text-[#9A7B38] font-serif font-bold">1. Confirmed</div>
              <div className="text-[11px] text-stone-600">Order verified & logged</div>
            </div>
            <div className="p-3.5 bg-white border border-[#E8E2D9] rounded-xl space-y-1">
              <div className="text-stone-900 font-serif font-bold">2. Atelier Prep</div>
              <div className="text-[11px] text-stone-500">Inspection & packaging</div>
            </div>
            <div className="p-3.5 bg-white border border-[#E8E2D9] rounded-xl space-y-1">
              <div className="text-stone-400 font-serif font-bold">3. In Transit</div>
              <div className="text-[11px] text-stone-400">BlueDart Air Express</div>
            </div>
            <div className="p-3.5 bg-white border border-[#E8E2D9] rounded-xl space-y-1">
              <div className="text-stone-400 font-serif font-bold">4. Doorstep</div>
              <div className="text-[11px] text-stone-400">Fitting & OTP delivery</div>
            </div>
          </div>

          {/* Payment & Shipping Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] space-y-1 text-stone-500">
              <div className="flex items-center space-x-1.5 text-stone-900 font-serif font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>Client Destination</span>
              </div>
              <p className="text-stone-800 font-medium">
                {currentOrder.shippingAddress.fullName} ({currentOrder.shippingAddress.phone})
              </p>
              <p>
                {currentOrder.shippingAddress.street}, {currentOrder.shippingAddress.city},{' '}
                {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] space-y-1 text-stone-500">
              <div className="flex items-center space-x-1.5 text-stone-900 font-serif font-bold">
                <CreditCard className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>Payment Details</span>
              </div>
              <p className="text-stone-800 font-medium">
                Method: {paymentMethodLabel}
              </p>
              <p className="font-mono text-[11px]">
                Status: <strong className={isPaid ? 'text-emerald-700' : 'text-amber-700'}>{isPaid ? 'PAID / CAPTURED' : 'CASH ON DELIVERY'}</strong>
              </p>
              {currentOrder.paymentDetails?.paidAt && (
                <p className="text-[10px] text-stone-400">
                  Authorized at: {new Date(currentOrder.paymentDetails.paidAt).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Line Items Summary */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-[#EAE4D8] pb-3">
            Garments In This Consignment ({currentOrder.items.length})
          </h3>

          <div className="divide-y divide-[#F0EBE1] space-y-3">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-16 aspect-[3/4] rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#E8E2D9]">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-stone-900">{item.product.name}</h5>
                    <div className="text-[11px] text-stone-500">
                      Qty: {item.quantity} {item.selectedSize && `• Size ${item.selectedSize}`} {item.selectedColor && `• ${item.selectedColor.name}`}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-stone-900 font-serif">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#EAE4D8] flex items-center justify-between text-sm font-serif font-bold text-stone-900">
            <span>Total Amount</span>
            <span className="text-lg text-[#9A7B38]">
              ₹{currentOrder.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E0D8C8] text-stone-900 font-semibold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#9A7B38]" />
            <span>Download Atelier Invoice</span>
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md transition-colors cursor-pointer"
          >
            <span>Explore More Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
