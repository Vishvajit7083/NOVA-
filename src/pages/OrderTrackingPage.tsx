import React, { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
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
      title: 'Order Verified & Quality Inspected by Master Tailor',
      location: 'AURELIA Bengaluru Atelier & Design Studio',
      time: 'Yesterday, 02:40 PM',
      done: true,
    },
    {
      title: 'Steam-Finished & Sealed in Archival Garment Box',
      location: 'Bengaluru Fulfillment Facility',
      time: 'Yesterday, 08:15 PM',
      done: true,
    },
    {
      title: 'Sorted at Destination Metro Logistics Hub',
      location: 'North Transit Logistics Gateway',
      time: 'Today, 06:30 AM',
      done: true,
    },
    {
      title: 'Out for Doorstep Fitting & Handover',
      location: 'Local Delivery Van (Courier: Ramesh K.)',
      time: 'Expected by 04:00 PM',
      done: false,
    },
  ];

  return (
    <div id="order-tracking-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-8">
        
        {/* Header & Lookup Form */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[11px] font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>BlueDart Insured Air Logistics</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight">
            Track Consignment
          </h1>
          
          <p className="text-xs text-stone-500 font-normal">
            Enter your Atelier Order Reference (e.g. AT-123456) or BlueDart AWB number.
          </p>

          <form onSubmit={handleSearch} className="flex space-x-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID or AWB Tracking Number"
                className="w-full bg-white border border-[#E0D8C8] rounded-full pl-10 pr-4 py-3 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#9A7B38] shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-wider rounded-full shadow-xs transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {/* Tracking Information Box */}
        {trackedOrder && (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-mono text-[#9A7B38] font-bold uppercase tracking-wider">
                  In Transit • Insured Priority Express
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-0.5">
                  Arriving {trackedOrder.estimatedDeliveryDate}
                </h2>
                <div className="text-xs text-stone-500 mt-1 flex items-center space-x-2 font-mono">
                  <span>AWB: {trackedOrder.trackingNumber}</span>
                  <span>•</span>
                  <span>Order: {trackedOrder.orderNumber || trackedOrder.id}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-xs font-semibold text-stone-700">
                  Carrier: {trackedOrder.trackingCarrier || 'BlueDart Luxury Air'}
                </span>
              </div>
            </div>

            {/* Checkpoints Timeline */}
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-[#EAE4D8] pb-3">
                Transit Milestones
              </h3>

              <div className="space-y-6 relative pl-6 border-l-2 border-[#EAE4D8]">
                {checkpoints.map((cp, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        cp.done
                          ? 'bg-[#9A7B38] border-[#9A7B38] text-white'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      {cp.done && <CheckCircle2 className="w-3 h-3 text-white stroke-[3]" />}
                    </div>

                    <div>
                      <div className={`text-xs sm:text-sm font-serif font-bold ${cp.done ? 'text-stone-950' : 'text-stone-400'}`}>
                        {cp.title}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center space-x-2 font-normal">
                        <MapPin className="w-3 h-3 text-[#9A7B38]" />
                        <span>{cp.location}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{cp.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consignment Items */}
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900 border-b border-[#EAE4D8] pb-3">
                Package Contents ({trackedOrder.items.length} Atelier Items)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trackedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] flex items-center space-x-3 text-xs"
                  >
                    <div className="w-12 h-16 aspect-[3/4] rounded-lg overflow-hidden bg-white border border-[#E0D8C8] shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-stone-900 truncate">{item.product.name}</div>
                      <div className="text-[11px] text-stone-500">
                        Qty: {item.quantity} {item.selectedSize && `• Size ${item.selectedSize}`} {item.selectedColor && `• ${item.selectedColor.name}`}
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
