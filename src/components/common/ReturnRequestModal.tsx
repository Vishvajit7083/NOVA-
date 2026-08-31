import React, { useState } from 'react';
import { X, RotateCcw, ShieldAlert, CheckCircle2, ArrowRight, Package, Image as ImageIcon } from 'lucide-react';
import { Order, CartItem, ReturnRequest } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ReturnRequestModalProps {
  order: Order;
  item: CartItem;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({ order, item, onClose, onSuccess }) => {
  const { requestReturn, showToast } = useShop();

  const [reason, setReason] = useState<ReturnRequest['reason']>('defective');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || details.trim().length < 10) {
      showToast('Please elaborate', 'Please give at least 10 characters explaining why you want to return or replace the item.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestReturn({
        orderId: order.id,
        orderNumber: order.orderNumber || order.id.slice(0, 8),
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || '',
        reason,
        reasonDetails: details.trim(),
        images: imageUrl.trim() ? [imageUrl.trim()] : undefined,
        refundAmount: item.price * item.quantity,
      });

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EB0028] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Request Return / Replacement</h4>
              <p className="text-xs text-gray-500">Order #{order.orderNumber || order.id.slice(0, 8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center space-x-3">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-12 h-12 object-cover rounded-lg bg-white border border-gray-200"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
            <p className="text-[11px] text-gray-500">
              Qty: {item.quantity} • Refund Value:{' '}
              <strong className="text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Reason for Return
            </label>
            <select
              id="select-return-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnRequest['reason'])}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EB0028]"
            >
              <option value="defective">Hardware Issue / Defective Product</option>
              <option value="damaged">Item Damaged in Transit</option>
              <option value="wrong_item">Received Wrong Model or Color</option>
              <option value="missing_parts">Missing Cables / Accessories / Box Contents</option>
              <option value="not_as_described">Specifications Not Matching Description</option>
              <option value="changed_mind">No Longer Needed / Changed Mind (Sealed Only)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Detailed Issue Description
            </label>
            <textarea
              id="textarea-return-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what happened with the product and whether you prefer an exact replacement or direct original-method refund..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EB0028]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Optional Image Link (Proof of defect or damaged packaging)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-return-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (optional)"
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EB0028]"
              />
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Reverse Pickup Protocol:</span>
            </p>
            <p className="text-[11px] text-amber-800">
              Our courier will pick up the package from your delivery address ({order.shippingAddress.city}, {order.shippingAddress.pincode}) within 2 business days.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-bold text-white bg-[#EB0028] hover:bg-[#c80022] rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Return Request'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
