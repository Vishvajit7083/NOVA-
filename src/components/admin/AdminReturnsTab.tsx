import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Truck,
  DollarSign,
  AlertTriangle,
  Boxes,
  Eye,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { ReturnRequest, ReturnStatus, Product } from '../../types';
import { updateReturnRequestInDB, adjustVariantStockInDB } from '../../lib/db';

interface AdminReturnsTabProps {
  returns: ReturnRequest[];
  products: Product[];
  onRefreshReturns: () => Promise<void>;
  onRefreshProducts: () => Promise<void>;
}

export const AdminReturnsTab: React.FC<AdminReturnsTabProps> = ({
  returns,
  products,
  onRefreshReturns,
  onRefreshProducts,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);

  const filtered = returns.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const handleApprovePickup = async (ret: ReturnRequest) => {
    setIsProcessing(true);
    try {
      const reverseAwb = `RET-BLU-${Date.now().toString().slice(-6)}`;
      await updateReturnRequestInDB(ret.id, {
        status: 'pickup_initiated',
        reverseAwbNumber: reverseAwb,
        reverseCarrier: 'BlueDart Reverse Air Priority',
        pickupScheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      });
      await onRefreshReturns();
    } catch (err) {
      console.error('Error approving return pickup:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInspectAndRestock = async (ret: ReturnRequest) => {
    setIsProcessing(true);
    try {
      // 1. Update Return status to inspected_passed
      await updateReturnRequestInDB(ret.id, {
        status: 'inspected_passed',
        inspectionNotes: 'Garment inspected at Atelier Hub. Security seal intact, fabric pristine. Approved for restock.',
      });

      // 2. Automatically restock variant inventory if productId is present
      if (ret.productId) {
        await adjustVariantStockInDB(
          ret.productId,
          ret.variantId || undefined,
          ret.quantity || 1,
          'return_restock',
          `Restocked from approved return #${ret.id} (Order ${ret.orderNumber || ret.orderId})`,
          'admin@sindhura.in',
          'Atelier QC Manager'
        );
        await onRefreshProducts();
      }

      await onRefreshReturns();
    } catch (err) {
      console.error('Error inspecting & restocking:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessRefund = async (ret: ReturnRequest) => {
    setIsProcessing(true);
    try {
      // Trigger server refund if prepaid
      let refundId = `rfnd_man_${Date.now()}`;
      if (ret.paymentMethod !== 'cod' && ret.paymentId) {
        try {
          const res = await fetch('/api/admin/refund', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: ret.paymentId,
              amount: ret.refundAmount,
              reason: `Return refund for order ${ret.orderNumber || ret.orderId}`,
              orderId: ret.orderId,
            }),
          });
          const data = await res.json();
          if (data.success && data.refundId) {
            refundId = data.refundId;
          }
        } catch (e) {
          console.warn('Server gateway refund warning:', e);
        }
      }

      await updateReturnRequestInDB(ret.id, {
        status: 'refund_processed',
        refundStatus: 'processed',
        refundId,
        refundedAt: new Date().toISOString(),
      });

      await onRefreshReturns();
    } catch (err) {
      console.error('Error completing refund:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">Returns & Doorstep Exchanges</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage customer reverse pickups, atelier QC inspections, variant restocks, and gateway refunds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-white border border-[#E8E2D9] rounded-xl text-xs font-semibold focus:outline-hidden text-stone-700 shadow-2xs cursor-pointer"
          >
            <option value="all">All Return Requests ({returns.length})</option>
            <option value="requested">Pending Review</option>
            <option value="pickup_initiated">Reverse Pickup Scheduled</option>
            <option value="received_at_hub">Received at Hub</option>
            <option value="inspected_passed">QC Passed (Ready for Refund)</option>
            <option value="refund_processed">Refund Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={onRefreshReturns}
            className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            title="Refresh Returns"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <RotateCcw className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-stone-700">No return requests found</p>
            <p className="text-xs text-stone-400 mt-1">When customers submit 14-day return or exchange requests, they appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-600 border-b border-[#E8E2D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase">Request / Order</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase">Customer & City</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase">Garment & Reason</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase">Refund Amount</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase">Reverse AWB</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {filtered.map((ret) => (
                  <tr key={ret.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-stone-900">{ret.id}</div>
                      <div className="text-[10px] text-stone-400">Order: {ret.orderNumber || ret.orderId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{ret.customerName}</div>
                      <div className="text-[10px] text-stone-500">{ret.customerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{ret.productName}</div>
                      <div className="text-[10px] text-stone-500 italic max-w-[200px] truncate">
                        "{ret.reasonText || ret.reason.replace(/_/g, ' ')}"
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      ₹{(Number(ret.refundAmount) || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      {ret.reverseAwbNumber ? (
                        <div>
                          <div className="font-mono font-bold text-stone-900">{ret.reverseAwbNumber}</div>
                          <div className="text-[10px] text-stone-400">{ret.reverseCarrier}</div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Not Scheduled</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ret.status === 'refund_processed' ? 'bg-emerald-100 text-emerald-800' :
                        ret.status === 'inspected_passed' ? 'bg-indigo-100 text-indigo-800' :
                        ret.status === 'pickup_initiated' ? 'bg-blue-100 text-blue-800' :
                        ret.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ret.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {ret.status === 'requested' && (
                          <button
                            onClick={() => handleApprovePickup(ret)}
                            disabled={isProcessing}
                            className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Approve Pickup
                          </button>
                        )}

                        {ret.status === 'pickup_initiated' && (
                          <button
                            onClick={() => handleInspectAndRestock(ret)}
                            disabled={isProcessing}
                            className="px-2.5 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            QC & Restock
                          </button>
                        )}

                        {ret.status === 'inspected_passed' && (
                          <button
                            onClick={() => handleProcessRefund(ret)}
                            disabled={isProcessing}
                            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold cursor-pointer flex items-center space-x-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Issue Refund</span>
                          </button>
                        )}

                        {ret.status === 'refund_processed' && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Settled</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
