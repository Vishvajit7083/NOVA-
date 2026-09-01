import React, { useState } from 'react';
import { X, RotateCcw, ShieldAlert, ArrowRight, Image as ImageIcon, Scissors } from 'lucide-react';
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
      showToast('Please elaborate', 'Please share at least 10 characters explaining your size exchange or alteration request.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestReturn({
        orderId: order.id,
        orderNumber: order.orderNumber || order.id.slice(0, 8),
        productId: item.product?.id || item.productId,
        productName: item.product?.name || item.productId,
        productImage: item.product?.images?.[0] || '',
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D9] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-base">Request Fitting Exchange or Return</h4>
              <p className="text-xs text-stone-500">Atelier Order #{order.orderNumber || order.id.slice(0, 8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item summary */}
        <div className="mt-4 p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D8] flex items-center space-x-3">
          <img
            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'}
            alt=""
            className="w-12 h-16 object-cover object-top rounded-xl bg-white border border-[#E8E2D9]"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-serif font-bold text-stone-900 truncate">{item.product?.name || item.productId}</p>
            <p className="text-[11px] text-stone-500">
              Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} • Value:{' '}
              <strong className="text-stone-900 font-serif">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Reason for Exchange / Return
            </label>
            <select
              id="select-return-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnRequest['reason'])}
              className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A7B38]"
            >
              <option value="defective">Sizing / Fit Adjustment (Need Different Size)</option>
              <option value="damaged">Garment Damaged or Creased in Transit</option>
              <option value="wrong_item">Received Incorrect Silhouette or Colorway</option>
              <option value="missing_parts">Missing Atelier Belt / Brooch / Garment Bag</option>
              <option value="not_as_described">Drape or Texture Differed from Lookbook</option>
              <option value="changed_mind">Changed Mind (With Tamper Seal Intact)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Fitting Details / Sizing Needs
            </label>
            <textarea
              id="textarea-return-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your desired size exchange (e.g. Need Size L instead of M) or tailor alteration details..."
              className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A7B38]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Optional Image Link (Garment Fit or Fabric Detail)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-return-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (optional)"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A7B38]"
              />
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E0D8C8] text-xs text-stone-700 space-y-1">
            <p className="font-serif font-bold text-stone-900 flex items-center space-x-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#9A7B38]" />
              <span>Complimentary Doorstep Exchange:</span>
            </p>
            <p className="text-[11px] text-stone-600">
              Our bespoke logistics concierge will pick up the garment from your location ({order.shippingAddress.city}, {order.shippingAddress.pincode}) in archival protective packaging.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#EAE4D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-[#FAF8F5] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#9A7B38] rounded-full transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Processing...' : 'Submit Exchange Request'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
