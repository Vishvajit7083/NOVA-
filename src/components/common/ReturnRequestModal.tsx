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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#121212] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#222222] text-[#F5F2EB] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#222222] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#C5A880] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#F5F2EB] text-base">Request Fitting Exchange or Return</h4>
              <p className="text-xs text-[#A0988A]">Atelier Order #{order.orderNumber || order.id.slice(0, 8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A0988A] hover:text-[#F5F2EB] p-1.5 rounded-full hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item summary */}
        <div className="mt-4 p-3.5 bg-[#161616] rounded-2xl border border-[#242424] flex items-center space-x-3">
          <img
            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'}
            alt=""
            className="w-12 h-16 object-cover object-top rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-serif font-bold text-[#F5F2EB] truncate">{item.product?.name || item.productId}</p>
            <p className="text-[11px] text-[#A0988A]">
              Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} • Value:{' '}
              <strong className="text-[#C5A880] font-mono">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A0988A] uppercase tracking-wider mb-1.5">
              Reason for Exchange / Return
            </label>
            <select
              id="select-return-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnRequest['reason'])}
              className="w-full p-3 bg-[#181818] border border-[#2B2B2B] rounded-xl text-xs font-medium text-[#F5F2EB] focus:outline-none focus:border-[#C5A880]"
            >
              <option value="defective" className="bg-[#181818] text-[#F5F2EB]">Sizing / Fit Adjustment (Need Different Size)</option>
              <option value="damaged" className="bg-[#181818] text-[#F5F2EB]">Garment Damaged or Creased in Transit</option>
              <option value="wrong_item" className="bg-[#181818] text-[#F5F2EB]">Received Incorrect Silhouette or Colorway</option>
              <option value="missing_parts" className="bg-[#181818] text-[#F5F2EB]">Missing Atelier Belt / Brooch / Garment Bag</option>
              <option value="not_as_described" className="bg-[#181818] text-[#F5F2EB]">Drape or Texture Differed from Lookbook</option>
              <option value="changed_mind" className="bg-[#181818] text-[#F5F2EB]">Changed Mind (With Tamper Seal Intact)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A0988A] uppercase tracking-wider mb-1.5">
              Fitting Details / Sizing Needs
            </label>
            <textarea
              id="textarea-return-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your desired size exchange (e.g. Need Size L instead of M) or tailor alteration details..."
              className="w-full p-3 bg-[#181818] border border-[#2B2B2B] rounded-xl text-xs text-[#F5F2EB] placeholder-[#666666] focus:outline-none focus:border-[#C5A880]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A0988A] uppercase tracking-wider mb-1.5">
              Optional Image Link (Garment Fit or Fabric Detail)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-[#736E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-return-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (optional)"
                className="w-full pl-10 pr-3 py-2.5 bg-[#181818] border border-[#2B2B2B] rounded-xl text-xs text-[#F5F2EB] placeholder-[#666666] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="bg-[#161616] p-3.5 rounded-2xl border border-[#262626] text-xs text-[#A0988A] space-y-1">
            <p className="font-serif font-bold text-[#F5F2EB] flex items-center space-x-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Complimentary Doorstep Exchange:</span>
            </p>
            <p className="text-[11px] text-[#888888]">
              Our bespoke logistics concierge will pick up the garment from your location ({order.shippingAddress.city}, {order.shippingAddress.pincode}) in archival protective packaging.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#222222]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#181818] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#C5A880] hover:bg-[#D4AF37] rounded-full transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
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
