import React from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  RotateCcw,
  Coins,
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Banknote,
  Send,
  Boxes,
} from 'lucide-react';
import { Order, Product, ReturnRequest, ShipmentRecord } from '../../types';

interface AdminOverviewTabProps {
  orders: Order[];
  products: Product[];
  returns: ReturnRequest[];
  shipments: ShipmentRecord[];
  onSelectOrder: (order: Order) => void;
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  orders,
  products,
  returns,
  shipments,
  onSelectOrder,
  onNavigateTab,
}) => {
  // Real calculations only - zero state if no data
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt && o.createdAt.startsWith(todayStr));
  const todayRevenue = todayOrders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'placed' || o.status === 'confirmed');
  const packedAwaitingPickup = orders.filter((o) => o.status === 'packed');
  const inTransitOrders = orders.filter((o) => o.status === 'shipped' || o.status === 'out_for_delivery');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const codOrders = orders.filter((o) => o.paymentMethod === 'cod');
  const prepaidOrders = orders.filter((o) => o.paymentMethod !== 'cod' && o.paymentDetails?.paid);
  const pendingReturns = returns.filter((r) => r.status === 'requested' || r.status === 'approved' || r.status === 'pickup_initiated');

  // Variant-level low stock calculation
  let lowStockCount = 0;
  let outOfStockCount = 0;
  products.forEach((p) => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v) => {
        const qty = v.stockCount ?? 0;
        const threshold = v.lowStockThreshold ?? p.lowStockThreshold ?? 5;
        if (qty === 0) outOfStockCount++;
        else if (qty <= threshold) lowStockCount++;
      });
    } else {
      const qty = p.stockCount ?? 0;
      const threshold = p.lowStockThreshold ?? 5;
      if (qty === 0) outOfStockCount++;
      else if (qty <= threshold) lowStockCount++;
    }
  });

  return (
    <div className="space-y-8">
      {/* Top Level Financial & Volume Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Gross Store Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#9A7B38]">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-stone-400 mt-1">
              Today: <span className="text-stone-700 font-semibold">₹{todayRevenue.toLocaleString('en-IN')}</span> ({todayOrders.length} orders)
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold text-amber-900">
              {pendingOrders.length}
            </h3>
            <p className="text-[11px] text-stone-400 mt-1">
              Orders requiring QC inspection & packing
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Active Shipments</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold text-blue-950">
              {inTransitOrders.length + packedAwaitingPickup.length}
            </h3>
            <p className="text-[11px] text-stone-400 mt-1">
              {packedAwaitingPickup.length} awaiting pickup • {inTransitOrders.length} in transit
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Inventory Attention</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-serif font-bold text-rose-900">
              {lowStockCount + outOfStockCount}
            </h3>
            <p className="text-[11px] text-stone-400 mt-1">
              {outOfStockCount} sold out • {lowStockCount} low stock variants
            </p>
          </div>
        </div>
      </div>

      {/* Operational Dispatch Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onNavigateTab('orders')}
          className="p-4 bg-white border border-[#E8E2D9] rounded-xl hover:border-stone-900 transition-colors text-left flex flex-col justify-between group cursor-pointer"
        >
          <span className="text-[11px] font-medium text-stone-500">Paid Prepaid</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-stone-900">{prepaidOrders.length}</span>
            <CreditCard className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="p-4 bg-white border border-[#E8E2D9] rounded-xl hover:border-stone-900 transition-colors text-left flex flex-col justify-between group cursor-pointer"
        >
          <span className="text-[11px] font-medium text-stone-500">Cash on Delivery</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-stone-900">{codOrders.length}</span>
            <Banknote className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="p-4 bg-white border border-[#E8E2D9] rounded-xl hover:border-stone-900 transition-colors text-left flex flex-col justify-between group cursor-pointer"
        >
          <span className="text-[11px] font-medium text-stone-500">Awaiting Pickup</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-stone-900">{packedAwaitingPickup.length}</span>
            <Package className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="p-4 bg-white border border-[#E8E2D9] rounded-xl hover:border-stone-900 transition-colors text-left flex flex-col justify-between group cursor-pointer"
        >
          <span className="text-[11px] font-medium text-stone-500">Delivered Total</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-stone-900">{deliveredOrders.length}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('returns')}
          className="p-4 bg-white border border-[#E8E2D9] rounded-xl hover:border-stone-900 transition-colors text-left flex flex-col justify-between group cursor-pointer"
        >
          <span className="text-[11px] font-medium text-stone-500">Returns & Exchanges</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-stone-900">{pendingReturns.length}</span>
            <RotateCcw className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('inventory')}
          className="p-4 bg-white border border-[#E8E2D9] rounded-xl hover:border-stone-900 transition-colors text-left flex flex-col justify-between group cursor-pointer"
        >
          <span className="text-[11px] font-medium text-stone-500">Catalog SKUs</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-stone-900">{products.length}</span>
            <Boxes className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
        </button>
      </div>

      {/* Recent Operational Orders Activity */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">Recent Customer Orders</h2>
            <p className="text-xs text-stone-500 mt-0.5">Real-time live transactions from your customer store</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-stone-900 hover:text-[#9A7B38] flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-stone-400 border border-dashed border-[#E8E2D9] rounded-xl">
            <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-stone-600">No customer orders recorded yet</p>
            <p className="text-xs text-stone-400 mt-1">When customers place orders, real-time items, sizes, and shipping manifests appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-500 border-b border-[#E8E2D9]">
                <tr>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Order Ref</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Customer & Destination</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Garments & Variants</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Total Amount</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Payment</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Fulfillment Status</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {orders.slice(0, 8).map((order) => {
                  const isCOD = order.paymentMethod === 'cod';
                  const isPaid = order.paymentDetails?.paid;

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900">{order.orderNumber || order.id}</div>
                        <div className="text-[10px] text-stone-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-900">{order.shippingAddress?.fullName || 'Guest Customer'}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[180px]">
                          {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-900">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                          {order.items?.map((it) => `${it.product?.name || 'Garment'} (${it.selectedSize || 'Standard'}/${it.selectedColor?.name || 'Color'})`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        ₹{(Number(order.total) || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        {isCOD ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            COD Pending
                          </span>
                        ) : isPaid ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Prepaid Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'shipped' || order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'packed' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'cancelled' || order.status === 'refunded' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
