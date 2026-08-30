import React, { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

interface OrderTrackingPageProps {
  trackingNumber?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  trackingNumber = '',
  onNavigate,
}) => {
  const { orders } = useShop();
  const [query, setQuery] = useState(trackingNumber || (orders[0]?.trackingNumber ?? 'BD-88492019IN'));
  const [trackedOrder, setTrackedOrder] = useState<Order | undefined>(() => {
    return orders.find((o) => o.trackingNumber === query || o.orderNumber === query || o.id === query) || orders[0];
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.trackingNumber.toLowerCase() === query.toLowerCase().trim() ||
        o.orderNumber.toLowerCase() === query.toLowerCase().trim() ||
        o.id.toLowerCase() === query.toLowerCase().trim()
    );
    if (found) {
      setTrackedOrder(found);
    } else if (orders[0]) {
      setTrackedOrder({
        ...orders[0],
        trackingNumber: query,
      });
    }
  };

  const checkpoints = [
    {
      title: 'Order Verified & Security Cleared',
      location: 'NOVA Bengaluru Robotics Hub',
      time: 'Yesterday, 02:40 PM',
      done: true,
    },
    {
      title: 'Package Sealed & Handed to BlueDart Air Cargo',
      location: 'Kempegowda International Airport (BLR)',
      time: 'Yesterday, 08:15 PM',
      done: true,
    },
    {
      title: 'Sorted at Destination Metro Hub',
      location: 'North Transit Logistics Gateway',
      time: 'Today, 06:30 AM',
      done: true,
    },
    {
      title: 'Out for Doorstep Delivery with OTP',
      location: 'Local Delivery Van (Courier: Ramesh K.)',
      time: 'Expected by 04:00 PM',
      done: false,
    },
  ];

  return (
    <div id="order-tracking-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Lookup Form */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#EB0028] text-[11px] font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>BlueDart Live Radar Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-display">
            Track Your Hardware Consignment
          </h1>
          <p className="text-xs text-zinc-500">
            Enter your Order Number (e.g. NV-12345) or BlueDart AWB number.
          </p>

          <form onSubmit={handleSearch} className="flex space-x-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID or Tracking Number"
                className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-3 py-3 text-xs text-zinc-900 font-mono focus:outline-none focus:border-[#EB0028] shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Tracking Information Box */}
        {trackedOrder && (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider">
                  In Transit • Priority Express
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-display mt-0.5">
                  Arriving {trackedOrder.estimatedDeliveryDate}
                </h2>
                <div className="text-xs text-zinc-500 mt-1 flex items-center space-x-2 font-mono">
                  <span>AWB: {trackedOrder.trackingNumber}</span>
                  <span>•</span>
                  <span>Order: {trackedOrder.orderNumber || trackedOrder.id}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#F8F9FA] border border-zinc-200 text-xs font-semibold text-zinc-700">
                  Carrier: {trackedOrder.trackingCarrier || 'BlueDart Air'}
                </span>
              </div>
            </div>

            {/* Checkpoints Timeline */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-3">
                Live Transit History
              </h3>

              <div className="space-y-6 relative pl-6 border-l-2 border-zinc-200">
                {checkpoints.map((cp, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        cp.done
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'bg-white border-zinc-300 text-zinc-400'
                      }`}
                    >
                      {cp.done && <CheckCircle2 className="w-3 h-3 text-white stroke-[3]" />}
                    </div>

                    <div>
                      <div className={`text-xs sm:text-sm font-bold ${cp.done ? 'text-zinc-950' : 'text-zinc-400'}`}>
                        {cp.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-[#EB0028]" />
                        <span>{cp.location}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{cp.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consignment Items */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-3">
                Package Contents ({trackedOrder.items.length} Accessories)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trackedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8F9FA] rounded-xl border border-zinc-200 flex items-center space-x-3 text-xs"
                  >
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-zinc-200"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-900 truncate">{item.product.name}</div>
                      <div className="text-[11px] text-zinc-500">
                        Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor.name}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
