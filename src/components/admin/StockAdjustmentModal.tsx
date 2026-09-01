import React, { useState } from 'react';
import { X, Check, ArrowRight, AlertTriangle, Boxes } from 'lucide-react';
import { Product, ProductVariant, InventoryAdjustmentReason } from '../../types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  product: Product | null;
  variant: ProductVariant | null;
  onClose: () => void;
  onConfirm: (
    productId: string,
    variantId: string | undefined,
    adjustmentQty: number,
    reason: InventoryAdjustmentReason,
    notes: string
  ) => Promise<void>;
  isProcessing: boolean;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  product,
  variant,
  onClose,
  onConfirm,
  isProcessing,
}) => {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [quantityInput, setQuantityInput] = useState<number>(10);
  const [reason, setReason] = useState<InventoryAdjustmentReason>('manual_restock');
  const [notes, setNotes] = useState('');

  if (!isOpen || !product) return null;

  const currentStock = variant ? (variant.stockCount || 0) : (product.stockCount || 0);

  let delta = 0;
  let resultingStock = currentStock;

  if (adjustmentType === 'add') {
    delta = quantityInput;
    resultingStock = currentStock + quantityInput;
  } else if (adjustmentType === 'remove') {
    delta = -quantityInput;
    resultingStock = Math.max(0, currentStock - quantityInput);
  } else {
    // Set absolute count
    delta = quantityInput - currentStock;
    resultingStock = Math.max(0, quantityInput);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (delta === 0) {
      onClose();
      return;
    }
    await onConfirm(
      product.id,
      variant?.id,
      delta,
      reason,
      notes.trim() || `Inventory adjustment (${adjustmentType}) by Store Admin`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8E2D9] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#9A7B38]">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-stone-900">Adjust Inventory Stock</h2>
              <p className="text-[11px] text-stone-500">{product.name} {variant ? `(${variant.name || `${variant.color} / ${variant.size}`})` : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current vs Proposed Stock Preview */}
          <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-center">
            <div>
              <span className="text-[10px] uppercase font-semibold text-stone-500">Current Stock</span>
              <div className="text-lg font-bold text-stone-900 mt-0.5">{currentStock}</div>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#9A7B38]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-stone-500">New Final Stock</span>
              <div className={`text-lg font-bold mt-0.5 ${resultingStock <= 3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {resultingStock}
              </div>
            </div>
          </div>

          {/* Adjustment Mode */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">Action Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  adjustmentType === 'add'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-[#E8E2D9] hover:bg-stone-50'
                }`}
              >
                + Restock Add
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('remove')}
                className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  adjustmentType === 'remove'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-[#E8E2D9] hover:bg-stone-50'
                }`}
              >
                - Reduce / Damaged
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('set')}
                className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  adjustmentType === 'set'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-[#E8E2D9] hover:bg-stone-50'
                }`}
              >
                = Exact Physical Count
              </button>
            </div>
          </div>

          {/* Units Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              {adjustmentType === 'set' ? 'New Total Physical Stock Count *' : 'Quantity Units to Adjust *'}
            </label>
            <input
              type="number"
              min={1}
              required
              value={quantityInput}
              onChange={(e) => setQuantityInput(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2 text-sm font-bold border border-[#E8E2D9] rounded-lg bg-[#FDFBF7] focus:outline-hidden focus:border-stone-900"
            />
          </div>

          {/* Reason Code */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">Reason for Stock Adjustment</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as InventoryAdjustmentReason)}
              className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg bg-[#FDFBF7] focus:outline-hidden focus:border-stone-900"
            >
              <option value="manual_restock">New Factory Production Batch / Inward PO</option>
              <option value="physical_audit">Physical Warehouse Inventory Reconciliation</option>
              <option value="return_restock">Customer Return Restocked After Inspection</option>
              <option value="damaged_writeoff">Damaged in Atelier / Fabric Defect Write-off</option>
              <option value="order_cancellation">Order Cancelled (Auto Returned to Pool)</option>
              <option value="reserved">Sample / Stylist Loan Reservation</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">Audit Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Master tailor received 25 units from Bengaluru weaving cluster"
              className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg bg-[#FDFBF7] focus:outline-hidden focus:border-stone-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Recording...' : 'Commit Stock Change'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
