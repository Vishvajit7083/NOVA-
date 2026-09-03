import React, { useState } from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Sparkles, Box } from 'lucide-react';
import { Order } from '../../types';

interface PackingSlipModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirmPacked: (orderId: string, packDetails: any) => Promise<void>;
  isProcessing: boolean;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirmPacked,
  isProcessing,
}) => {
  const [packedBy, setPackedBy] = useState('Master Tailor QC #4');
  const [boxType, setBoxType] = useState('Archival Luxury Garment Presentation Box (Magnetic Close)');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('Garment hand-steamed, organic dust sleeve applied, security authenticity tag verified.');

  if (!isOpen || !order) return null;

  const handleToggleItem = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCompletePacking = async () => {
    await onConfirmPacked(order.id, {
      packedBy,
      boxType,
      notes,
      verifiedItemIds: order.items?.map((it, idx) => it.product?.id || String(idx)) || [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E2D9] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header (Hidden on print) */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5] print:hidden">
          <div className="flex items-center space-x-2">
            <Box className="w-5 h-5 text-[#9A7B38]" />
            <div>
              <h2 className="text-sm font-serif font-bold text-stone-900">Atelier Garment Packing Slip & QC Manifest</h2>
              <p className="text-[11px] text-stone-500">Order Ref: {order.orderNumber || order.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Packing Slip Document (Printable area) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-stone-900 bg-white" id="printable-packing-slip">
          {/* Slip Header */}
          <div className="flex items-start justify-between border-b border-stone-900 pb-4">
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight">SINDHUDURG GARMENTS</h1>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-0.5">Sindhudurg • Maharashtra Handlooms</p>
              <p className="text-[10px] text-stone-400 mt-1">Heritage Textile Cluster, Malvan, Sindhudurg, MH 416606</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold uppercase tracking-wider">PACKING SLIP & QC SEAL</div>
              <div className="text-sm font-mono font-bold mt-1">{order.orderNumber || order.id}</div>
              <div className="text-[10px] text-stone-400">
                Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Recipient / Shipping Address */}
          <div className="grid grid-cols-2 gap-6 text-xs p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9]">
            <div>
              <span className="font-semibold text-stone-500 uppercase text-[10px] tracking-wider">Ship To (Consignee)</span>
              <div className="font-bold text-stone-900 mt-1">{order.shippingAddress?.fullName || 'Customer'}</div>
              <div className="text-stone-600 mt-0.5 leading-relaxed">
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-mono font-bold">{order.shippingAddress?.pincode}</span>
                <br />
                Phone: {order.shippingAddress?.phone}
              </div>
            </div>

            <div>
              <span className="font-semibold text-stone-500 uppercase text-[10px] tracking-wider">Logistics & Payment</span>
              <div className="mt-1 space-y-1">
                <div>
                  Payment Method: <span className="font-bold uppercase">{order.paymentMethod}</span>
                  {order.paymentMethod === 'cod' ? (
                    <span className="text-amber-800 font-bold ml-1.5">(Collect ₹{(Number(order.total) || 0).toLocaleString('en-IN')})</span>
                  ) : (
                    <span className="text-emerald-700 font-bold ml-1.5">(PREPAID VERIFIED)</span>
                  )}
                </div>
                <div>
                  Carrier Method: <span className="font-medium text-stone-700">{order.shippingMethod || 'Air Priority Insured'}</span>
                </div>
                <div>
                  Fulfillment Status: <span className="font-bold capitalize">{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Garments Checklist */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Garments & Accessories Checklist ({order.items?.length || 0} items)
            </div>
            <table className="w-full text-left text-xs border border-[#E8E2D9]">
              <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-stone-600">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">QC</th>
                  <th className="py-2.5 px-3">Garment Item & SKU</th>
                  <th className="py-2.5 px-3">Color / Size</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(checkedItems[idx])}
                        onChange={() => handleToggleItem(idx)}
                        className="w-4 h-4 rounded-sm border-[#E8E2D9] text-stone-900 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-serif font-bold text-stone-900">{item.product?.name || 'Luxury Garment'}</div>
                      <div className="font-mono text-[10px] text-stone-400">
                        SKU: {item.product?.sku || `AUR-${idx + 1}`}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium">{item.selectedColor?.name || 'Colorway'}</div>
                      <div className="text-[10px] font-bold text-stone-700">Size: {item.selectedSize || 'Standard'}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">₹{(Number(item.price) || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Packing Details Input (Configurable before sealing) */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] space-y-3 print:hidden">
            <div className="text-xs font-bold text-stone-900">Packing & Inspection Verification</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Packed & Inspected By</label>
                <input
                  type="text"
                  value={packedBy}
                  onChange={(e) => setPackedBy(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Packaging Box Type</label>
                <input
                  type="text"
                  value={boxType}
                  onChange={(e) => setBoxType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Packaging Quality Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
              />
            </div>
          </div>
        </div>

        {/* Footer (Hidden on print) */}
        <div className="px-6 py-4 border-t border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5] print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCompletePacking}
            disabled={isProcessing}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isProcessing ? 'Updating Status...' : 'Mark Order as Packed & Ready for Pickup'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
