import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
  History,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Product, ProductVariant, InventoryAuditLog, InventoryAdjustmentReason } from '../../types';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { adjustVariantStockInDB, getInventoryAuditLogsFromDB } from '../../lib/db';

interface AdminInventoryTabProps {
  products: Product[];
  onRefreshProducts: () => Promise<void>;
}

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({
  products,
  onRefreshProducts,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'logs'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<InventoryAuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    if (activeSubTab === 'logs') {
      fetchLogs();
    }
  }, [activeSubTab]);

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await getInventoryAuditLogsFromDB();
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load inventory logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Compute metrics across all products and variants
  let totalUnits = 0;
  let totalVariantCombos = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach((p) => {
    if (p.variants && p.variants.length > 0) {
      totalVariantCombos += p.variants.length;
      p.variants.forEach((v) => {
        const qty = v.stockCount || 0;
        const threshold = v.lowStockThreshold || p.lowStockThreshold || 3;
        totalUnits += qty;
        if (qty === 0) outOfStockCount++;
        else if (qty <= threshold) lowStockCount++;
      });
    } else {
      totalVariantCombos += 1;
      const qty = p.stockCount || 0;
      const threshold = p.lowStockThreshold || 5;
      totalUnits += qty;
      if (qty === 0) outOfStockCount++;
      else if (qty <= threshold) lowStockCount++;
    }
  });

  const handleOpenAdjust = (prod: Product, variant: ProductVariant | null) => {
    setSelectedProduct(prod);
    setSelectedVariant(variant);
    setIsModalOpen(true);
  };

  const handleConfirmAdjust = async (
    productId: string,
    variantId: string | undefined,
    adjustmentQty: number,
    reason: InventoryAdjustmentReason,
    notes: string
  ) => {
    setIsProcessing(true);
    try {
      await adjustVariantStockInDB(
        productId,
        variantId,
        adjustmentQty,
        reason,
        notes,
        'admin@aureliacouture.com',
        'Store Admin'
      );
      await onRefreshProducts();
      if (activeSubTab === 'logs') {
        await fetchLogs();
      }
    } catch (err) {
      console.error('Error committing stock adjustment:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter matrix items
  const flattenedVariants: {
    product: Product;
    variant: ProductVariant | null;
    key: string;
    name: string;
    sku: string;
    barcode: string;
    size: string;
    color: string;
    stock: number;
    threshold: number;
  }[] = [];

  products.forEach((p) => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v) => {
        flattenedVariants.push({
          product: p,
          variant: v,
          key: `${p.id}-${v.id || v.sku}`,
          name: p.name,
          sku: v.sku || p.sku || 'SKU-PENDING',
          barcode: v.barcode || p.barcode || '-',
          size: v.size || 'Standard',
          color: v.color || 'Base',
          stock: v.stockCount || 0,
          threshold: v.lowStockThreshold || p.lowStockThreshold || 3,
        });
      });
    } else {
      flattenedVariants.push({
        product: p,
        variant: null,
        key: p.id,
        name: p.name,
        sku: p.sku || 'SKU-PENDING',
        barcode: p.barcode || '-',
        size: p.sizes?.join(', ') || 'All Sizes',
        color: p.colors?.[0]?.name || 'Standard',
        stock: p.stockCount || 0,
        threshold: p.lowStockThreshold || 5,
      });
    }
  });

  const filteredItems = flattenedVariants.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.size.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'out' && item.stock === 0) ||
      (statusFilter === 'low' && item.stock > 0 && item.stock <= item.threshold);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Total Warehouse Stock</span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">{totalUnits.toLocaleString('en-IN')} units</div>
          <span className="text-[10px] text-stone-400">Across {totalVariantCombos} SKU variants</span>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Active Garment SKUs</span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">{products.length} garments</div>
          <span className="text-[10px] text-stone-400">{totalVariantCombos} size/color variants</span>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">Low Stock Variants</span>
          <div className="text-2xl font-serif font-bold text-amber-900 mt-1">{lowStockCount}</div>
          <span className="text-[10px] text-amber-600">Stock ≤ threshold</span>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">Sold Out / Zero Stock</span>
          <div className="text-2xl font-serif font-bold text-rose-900 mt-1">{outOfStockCount}</div>
          <span className="text-[10px] text-rose-500">Disabled from checkout</span>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex border-b border-[#E8E2D9] gap-4 bg-white px-5 rounded-t-2xl pt-2">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'matrix'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Real-time Variant Stock Matrix ({flattenedVariants.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'logs'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Inventory Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: LIVE INVENTORY MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search variant SKU, garment name, size (e.g. XL), or color (e.g. Black)..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden focus:border-stone-900 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden text-stone-700 shadow-2xs cursor-pointer"
              >
                <option value="all">All Stock Statuses</option>
                <option value="low">Low Stock Alerts Only</option>
                <option value="out">Sold Out (0 Units)</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-600 border-b border-[#E8E2D9]">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase tracking-wider">Garment Product</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase tracking-wider">Variant SKU</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase tracking-wider">Color & Size</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase tracking-wider">Available Qty</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase tracking-wider text-right">Stock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1]">
                  {filteredItems.map((item) => (
                    <tr key={item.key} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-stone-900">{item.name}</div>
                        <div className="text-[10px] text-stone-400 capitalize">{item.product.category.replace('-', ' ')}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-stone-700">
                        {item.sku}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-stone-900">{item.color}</span>
                        <span className="text-stone-400 mx-1.5">•</span>
                        <span className="font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">{item.size}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-bold text-stone-900">{item.stock}</span>
                        <span className="text-[10px] text-stone-400 ml-1">units</span>
                      </td>
                      <td className="py-3 px-4">
                        {item.stock === 0 ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            Out of Stock
                          </span>
                        ) : item.stock <= item.threshold ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Low Stock ({item.stock})
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(item.product, item.variant)}
                          className="px-3 py-1.5 bg-white border border-[#E8E2D9] hover:border-stone-900 text-stone-800 hover:text-stone-900 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STOCK AUDIT TRAIL */}
      {activeSubTab === 'logs' && (
        <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E8E2D9] bg-[#FAF8F5] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-stone-900">Historical Inventory Audit Trail</h3>
              <p className="text-xs text-stone-500">Immutable log of every physical stock addition, deduction, customer return restock, or count correction.</p>
            </div>
            <button
              onClick={fetchLogs}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {auditLogs.length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <History className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-semibold text-stone-700">No stock adjustment logs recorded yet</p>
              <p className="text-xs text-stone-400 mt-1">When you adjust variant stock or process return restocks, audit trail records appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-600 border-b border-[#E8E2D9]">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Timestamp</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Garment & Variant</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">SKU</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Adjustment Details</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reason Code</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Staff Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-4 text-stone-500">
                        {new Date(log.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-900">
                        {log.productName} {log.size || log.color ? `(${log.color} / ${log.size})` : ''}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        {log.sku}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1 font-bold">
                          <span className="text-stone-500">{log.previousStock}</span>
                          <span className="text-stone-400">→</span>
                          <span className={log.adjustedQuantity >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                            {log.adjustedQuantity > 0 ? `+${log.adjustedQuantity}` : log.adjustedQuantity}
                          </span>
                          <span className="text-stone-400">=</span>
                          <span className="text-stone-900">{log.newStock} units</span>
                        </div>
                        {log.notes && <div className="text-[10px] text-stone-400 italic mt-0.5">{log.notes}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 uppercase">
                          {log.reason.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {log.adminEmail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isModalOpen}
        product={selectedProduct}
        variant={selectedVariant}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAdjust}
        isProcessing={isProcessing}
      />
    </div>
  );
};
