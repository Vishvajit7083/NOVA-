import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, Truck, Package } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-gray-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#EB0028]" />
            <span className="font-bold text-sm tracking-wide">Tax Invoice & Purchase Receipt</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div id="invoice-printable-content" className="p-8 space-y-8 bg-white text-gray-900 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tighter text-gray-900">
                  NOVA<span className="text-[#EB0028]">.</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 border-l border-gray-300 pl-2">
                  Flagship Store
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                NOVA Retail Pvt. Ltd. • GSTIN: <span className="font-semibold text-gray-700">29AABCN9876Q1Z9</span>
              </p>
              <p className="text-xs text-gray-500">
                100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038, India
              </p>
              <p className="text-xs text-gray-500">Support: flagship@novastore.in | +91 (800) 456-7890</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block bg-gray-100 text-gray-800 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                Original Tax Invoice
              </span>
              <p className="text-base font-extrabold text-gray-900 mt-2">
                #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">Date: {invoiceDate}</p>
              <p className="text-xs text-gray-500">
                Payment: <span className="font-semibold text-gray-700 capitalize">{order.paymentMethod}</span> (
                {order.isPaid ? 'PAID' : 'PAY ON DELIVERY'})
              </p>
            </div>
          </div>

          {/* Billing & Shipping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/70 p-5 rounded-xl border border-gray-200 text-xs">
            <div>
              <p className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2">Billed & Shipped To:</p>
              <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600 mt-1">{order.shippingAddress.street}</p>
              {order.shippingAddress.landmark && <p className="text-gray-500">Landmark: {order.shippingAddress.landmark}</p>}
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</p>
              <p className="text-gray-600">Email: {order.userEmail}</p>
            </div>

            <div>
              <p className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2">Fulfillment Details:</p>
              <div className="space-y-1.5 text-gray-600">
                <p className="flex items-center space-x-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  <span>Order Status: <strong className="text-gray-900 uppercase">{order.status}</strong></span>
                </p>
                {order.trackingNumber && (
                  <p className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#EB0028]" />
                    <span>AWB / Courier: <strong className="text-gray-900">{order.courierPartner || 'Delhivery Express'} ({order.trackingNumber})</strong></span>
                  </p>
                )}
                {order.estimatedDelivery && (
                  <p>Est. Delivery: <strong>{order.estimatedDelivery}</strong></p>
                )}
                <p>Tax Regime: <strong>CGST 9% + SGST 9% (IGST 18% equivalent)</strong></p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-900 text-gray-900 font-extrabold uppercase tracking-wider">
                  <th className="py-2.5 pr-4">Item & Description</th>
                  <th className="py-2.5 px-3 text-center">HSN</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 pl-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 pr-4">
                      <p className="font-bold text-gray-900 text-sm">{item.product.name}</p>
                      <div className="text-[11px] text-gray-500 mt-0.5 space-x-2">
                        {item.selectedColor && <span>Color: {item.selectedColor.name}</span>}
                        {item.selectedVariant && <span>Variant: {item.selectedVariant.name}</span>}
                        <span>• SKU: {item.product.sku || 'NV-TECH-' + item.product.id.slice(0, 4)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-gray-500 font-mono">85044090</td>
                    <td className="py-3 px-3 text-center font-bold text-gray-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-gray-700">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 pl-4 text-right font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-gray-200 gap-6">
            <div className="text-xs text-gray-500 space-y-1.5 max-w-sm">
              <p className="font-bold text-gray-800">Terms & Conditions:</p>
              <p>1. All products sold by NOVA Flagship Store include 1-Year Pan-India Replacement Warranty.</p>
              <p>2. Goods once sold can be returned within 7 days in accordance with the NOVA Return Policy.</p>
              <p>3. This is a computer-generated tax invoice and requires no physical signature.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount:</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping & Handling:</span>
                <span className="font-semibold text-gray-900">
                  {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated GST (18% Incl.):</span>
                <span className="font-semibold text-gray-900">₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-base font-extrabold text-gray-900 pt-3 border-t-2 border-gray-900">
                <span>Total Amount:</span>
                <span className="text-[#EB0028] text-lg">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer badge */}
          <div className="text-center pt-6 border-t border-gray-100 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you for choosing NOVA Flagship Store • Built for Power Users</span>
          </div>
        </div>
      </div>
    </div>
  );
};
