import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Truck, Package, Scissors } from 'lucide-react';
import { Order } from '../../types';

interface OrderInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#E8E2D9] my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111111] text-white print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#9A7B38]" />
            <span className="font-serif font-bold text-sm tracking-wider">Maison Tax Invoice & Authenticity Certificate</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div id="invoice-printable-content" className="p-8 sm:p-10 space-y-8 bg-white text-stone-900 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#EAE4D8] pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-serif font-bold tracking-wider text-stone-950">
                  AURELIA & CO<span className="text-[#9A7B38]">.</span>
                </span>
                <span className="text-xs uppercase font-medium tracking-[0.2em] text-[#9A7B38] border-l border-stone-300 pl-2">
                  Haute Couture Atelier
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                AURELIA Maison International Pvt. Ltd. • GSTIN: <span className="font-semibold text-stone-700">29AABCA9876F1Z4</span>
              </p>
              <p className="text-xs text-stone-500">
                18 Boulevard Saint-Honoré / Vittal Mallya Road, Bengaluru, Karnataka 560001, India
              </p>
              <p className="text-xs text-stone-500">Concierge: concierge@aurelia.couture | +91 (800) 789-0123</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-widest">
                Official Tax Invoice
              </span>
              <p className="text-lg font-serif font-bold text-stone-950 mt-2">
                #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-stone-500">Issued: {invoiceDate}</p>
              <p className="text-xs text-stone-500">
                Payment: <span className="font-semibold text-stone-700 uppercase">{order.paymentMethod}</span> (
                {order.isPaid || order.paymentDetails?.paid ? 'PAID / AUTHORIZED' : 'PAY ON DELIVERY'})
              </p>
            </div>
          </div>

          {/* Billing & Shipping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D9] text-xs">
            <div>
              <p className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] mb-2">Client Consignee & Destination:</p>
              <p className="font-serif font-bold text-stone-950 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-stone-600 mt-1">{order.shippingAddress.street}</p>
              {order.shippingAddress.landmark && <p className="text-stone-500">Landmark: {order.shippingAddress.landmark}</p>}
              <p className="text-stone-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-stone-600 mt-1">Phone: {order.shippingAddress.phone}</p>
              <p className="text-stone-600">Client Email: {order.userEmail || order.contactEmail}</p>
            </div>

            <div>
              <p className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] mb-2">Atelier Dispatch Details:</p>
              <div className="space-y-1.5 text-stone-600">
                <p className="flex items-center space-x-1.5">
                  <Package className="w-3.5 h-3.5 text-stone-400" />
                  <span>Order Status: <strong className="text-stone-900 uppercase font-serif">{order.status}</strong></span>
                </p>
                {order.trackingNumber && (
                  <p className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Insured Courier: <strong className="text-stone-900">{order.courierPartner || 'Blue Dart Apex'} ({order.trackingNumber})</strong></span>
                  </p>
                )}
                {order.estimatedDelivery && (
                  <p>Est. Handover: <strong>{order.estimatedDelivery}</strong></p>
                )}
                <p>Tax Regime: <strong>CGST 6% + SGST 6% (Luxury Apparel GST 12%)</strong></p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-900 text-stone-900 font-serif font-bold uppercase tracking-wider">
                  <th className="py-2.5 pr-4">Garment & Specification</th>
                  <th className="py-2.5 px-3 text-center">HSN</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Piece Price</th>
                  <th className="py-2.5 pl-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D8]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 pr-4">
                      <p className="font-serif font-bold text-stone-900 text-sm">{item.product?.name || item.productId}</p>
                      <div className="text-[11px] text-stone-500 mt-0.5 space-x-2">
                        {item.selectedSize && <span>Size: <strong className="text-stone-800">{item.selectedSize}</strong></span>}
                        {item.selectedColor && <span>• Shade: {item.selectedColor.name}</span>}
                        <span>• SKU: {item.product?.sku || 'AUR-' + item.productId.slice(0, 5).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-stone-500 font-mono">62044200</td>
                    <td className="py-3 px-3 text-center font-bold text-stone-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-stone-700 font-serif">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 pl-4 text-right font-serif font-bold text-stone-950">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-[#EAE4D8] gap-6">
            <div className="text-xs text-stone-500 space-y-1.5 max-w-sm">
              <p className="font-serif font-bold text-stone-800">Atelier Guarantee & Terms:</p>
              <p>1. Every garment is handcrafted with authenticated luxury textiles, accompanied by a 1-year seam and finish warranty.</p>
              <p>2. Complimentary 14-day doorstep size alteration and exchange with tamper-evident seal intact.</p>
              <p>3. This is an authenticated computer-generated invoice and requires no physical seal.</p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-serif font-semibold text-stone-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Privilege Savings:</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>White-Glove Delivery:</span>
                <span className="font-semibold text-stone-900">
                  {order.shippingFee === 0 ? 'COMPLIMENTARY' : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (12% Included):</span>
                <span className="font-serif font-semibold text-stone-900">₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-base font-serif font-bold text-stone-900 pt-3 border-t-2 border-stone-900">
                <span>Total Amount:</span>
                <span className="text-[#9A7B38] text-xl font-bold">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer badge */}
          <div className="text-center pt-6 border-t border-stone-100 flex items-center justify-center space-x-2 text-xs text-stone-500">
            <CheckCircle2 className="w-4 h-4 text-[#9A7B38]" />
            <span>Thank you for indulging in AURELIA & CO. Haute Couture • Timeless Craftsmanship</span>
          </div>
        </div>
      </div>
    </div>
  );
};
