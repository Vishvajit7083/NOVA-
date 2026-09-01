import React, { useState } from 'react';
import {
  Search,
  Filter,
  Package,
  Truck,
  Printer,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  CreditCard,
  Banknote,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  Clock,
  Trash2,
} from 'lucide-react';
import { Order, OrderStatus, ShipmentStatus, ShipmentRecord, ShippingConfig } from '../../types';
import { PackingSlipModal } from './PackingSlipModal';
import { CreateShipmentModal } from './CreateShipmentModal';
import { ShippingLabelModal } from './ShippingLabelModal';

interface AdminOrdersTabProps {
  orders: Order[];
  shipments: ShipmentRecord[];
  shippingConfig: ShippingConfig;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onPackOrder: (orderId: string, packDetails: any) => Promise<void>;
  onCreateShipment: (shipmentData: any) => Promise<void>;
  onUpdateShipmentStatus: (shipmentId: string, status: ShipmentStatus, event: any, orderId?: string) => Promise<void>;
  onRefundOrder: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => Promise<void>;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  shipments,
  shippingConfig,
  onUpdateOrderStatus,
  onPackOrder,
  onCreateShipment,
  onUpdateShipmentStatus,
  onRefundOrder,
  onDeleteOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Modal controls
  const [packingOrder, setPackingOrder] = useState<Order | null>(null);
  const [shippingOrder, setShippingOrder] = useState<Order | null>(null);
  const [labelOrder, setLabelOrder] = useState<{ order: Order; shipment: ShipmentRecord | null } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter orders
  const filtered = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(term) ||
      (o.orderNumber && o.orderNumber.toLowerCase().includes(term)) ||
      (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(term)) ||
      (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(term)) ||
      (o.shippingAddress?.pincode && o.shippingAddress.pincode.includes(term)) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'cod' && o.paymentMethod === 'cod') ||
      (paymentFilter === 'prepaid' && o.paymentMethod !== 'cod');

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handlePack = (order: Order) => {
    setPackingOrder(order);
  };

  const handleShip = (order: Order) => {
    setShippingOrder(order);
  };

  const handleShowLabel = (order: Order) => {
    const relatedShipment = shipments.find((s) => s.orderId === order.id || s.awbNumber === order.trackingNumber) || null;
    setLabelOrder({ order, shipment: relatedShipment });
  };

  const handleQuickProgressShipment = async (order: Order, nextStatus: ShipmentStatus) => {
    setIsProcessing(true);
    try {
      const relatedShipment = shipments.find((s) => s.orderId === order.id || s.awbNumber === order.trackingNumber);
      const shipmentId = relatedShipment?.id || `ship_${order.id}`;

      const statusTitleMap: Record<string, string> = {
        picked_up: 'Consignment Handed Over to Logistics Courier',
        in_transit: 'In Transit — Departed Source Air Cargo Hub',
        out_for_delivery: 'Out for Doorstep Fitting & Handover',
        delivered: 'Delivered — Luxury Packaging Intact',
      };

      const event = {
        status: nextStatus as any,
        title: statusTitleMap[nextStatus] || 'Logistics Checkpoint Progression',
        location: `${order.shippingAddress?.city || 'Regional Hub'} Logistics Facility`,
        timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        description: `Shipment advanced to ${nextStatus.replace(/_/g, ' ')} via carrier scan.`,
        completed: true,
        current: true,
      };

      await onUpdateShipmentStatus(shipmentId, nextStatus, event, order.id);
    } catch (err) {
      console.error('Error updating quick shipment progress:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer name, PIN code, city, or AWB tracking #..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden focus:border-stone-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden text-stone-700 shadow-2xs cursor-pointer"
          >
            <option value="all">All Order Statuses ({orders.length})</option>
            <option value="placed">Placed / New</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed & Ready</option>
            <option value="shipped">Shipped (In Transit)</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden text-stone-700 shadow-2xs cursor-pointer"
          >
            <option value="all">All Payment Methods</option>
            <option value="prepaid">Prepaid (Razorpay / Cards / UPI)</option>
            <option value="cod">Cash on Delivery (COD)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <Package className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-stone-700">No matching orders found</p>
            <p className="text-xs text-stone-400 mt-1">Try resetting search filters or place a test order from the store.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-600 border-b border-[#E8E2D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Order & Customer</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Garments Ordered</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Total & Payment</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Logistics & AWB</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Fulfillment Status</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {filtered.map((order) => {
                  const isCOD = order.paymentMethod === 'cod';
                  const isPaid = order.paymentDetails?.paid;
                  const hasAWB = Boolean(order.trackingNumber);

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900">{order.orderNumber || order.id}</div>
                        <div className="font-medium text-stone-800 mt-0.5">{order.shippingAddress?.fullName || 'Customer'}</div>
                        <div className="text-[10px] text-stone-400">
                          {order.shippingAddress?.city}, {order.shippingAddress?.pincode} • {order.shippingAddress?.phone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-900">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</div>
                        <div className="text-[11px] text-stone-500 max-w-[220px] truncate">
                          {order.items?.map((it) => `${it.product?.name || 'Garment'} (${it.selectedSize || 'Std'})`).join(', ')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">₹{(Number(order.total) || 0).toLocaleString('en-IN')}</div>
                        <div className="mt-0.5">
                          {isCOD ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              COD Pending
                            </span>
                          ) : isPaid ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Prepaid Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-100 text-stone-700">
                              Payment Pending
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {hasAWB ? (
                          <div>
                            <div className="font-mono font-bold text-stone-900 flex items-center space-x-1">
                              <Truck className="w-3 h-3 text-[#9A7B38]" />
                              <span>{order.trackingNumber}</span>
                            </div>
                            <div className="text-[10px] text-stone-500">{order.trackingCarrier || 'BlueDart Air'}</div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">No AWB Assigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Packing Action */}
                          {(order.status === 'placed' || order.status === 'confirmed') && (
                            <button
                              onClick={() => handlePack(order)}
                              title="Pack Luxury Garment & QC Sign-off"
                              className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <Package className="w-3.5 h-3.5" />
                              <span>Pack</span>
                            </button>
                          )}

                          {/* Ship & AWB Action */}
                          {order.status === 'packed' && (
                            <button
                              onClick={() => handleShip(order)}
                              title="Create Shipment & Assign Carrier AWB"
                              className="px-2.5 py-1.5 bg-[#9A7B38] hover:bg-[#85682C] text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Ship AWB</span>
                            </button>
                          )}

                          {/* Print Label Action */}
                          {hasAWB && (
                            <button
                              onClick={() => handleShowLabel(order)}
                              title="Print 4x6 Thermal Shipping Label"
                              className="p-1.5 bg-white border border-[#E8E2D9] hover:border-stone-900 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Quick Transit Progress dropdown/button */}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleQuickProgressShipment(order, 'out_for_delivery')}
                              title="Advance to Out for Delivery"
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Out for Delivery
                            </button>
                          )}

                          {order.status === 'out_for_delivery' && (
                            <button
                              onClick={() => handleQuickProgressShipment(order, 'delivered')}
                              title="Mark Delivered"
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Mark Delivered
                            </button>
                          )}

                          {/* View Tracking in Customer Window */}
                          <a
                            href={`#tracking?orderId=${order.orderNumber || order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Customer Tracking Timeline"
                            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {onDeleteOrder && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete order #${order.orderNumber || order.id} from database?`)) {
                                  onDeleteOrder(order.id);
                                }
                              }}
                              title="Delete Order Record"
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Packing Slip & Verification */}
      <PackingSlipModal
        isOpen={Boolean(packingOrder)}
        order={packingOrder}
        onClose={() => setPackingOrder(null)}
        onConfirmPacked={onPackOrder}
        isProcessing={isProcessing}
      />

      {/* MODAL 2: Create Shipment & AWB */}
      <CreateShipmentModal
        isOpen={Boolean(shippingOrder)}
        order={shippingOrder}
        shippingConfig={shippingConfig}
        onClose={() => setShippingOrder(null)}
        onConfirmShipment={onCreateShipment}
        isProcessing={isProcessing}
      />

      {/* MODAL 3: Print Thermal Label */}
      <ShippingLabelModal
        isOpen={Boolean(labelOrder)}
        order={labelOrder?.order || null}
        shipment={labelOrder?.shipment || null}
        shippingConfig={shippingConfig}
        onClose={() => setLabelOrder(null)}
      />
    </div>
  );
};
