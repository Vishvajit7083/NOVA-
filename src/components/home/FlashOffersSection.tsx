import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, Zap, ShoppingBag, Check, Plus, Tag } from 'lucide-react';
import { BUNDLE_OFFERS } from '../../data/bundles';
import { useShop } from '../../context/ShopContext';

interface FlashOffersSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const FlashOffersSection: React.FC<FlashOffersSectionProps> = ({ onNavigate }) => {
  const { addToCart, showToast } = useShop();

  // Realistic countdown timer until end of day / promo drop
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddBundle = (bundle: typeof BUNDLE_OFFERS[0]) => {
    bundle.products.forEach((p) => {
      addToCart(p, p.colors[0], p.variants ? p.variants[0] : undefined, 1);
    });
    showToast('Bundle Added!', `Added ${bundle.title} (${bundle.products.length} items) to your shopping bag.`);
  };

  return (
    <section id="flash-offers-section" className="py-20 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header with Live Countdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-gray-200 gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#EB0028]" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#EB0028] uppercase">
                Limited Edition Bundles
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight mt-1">
              Curated Power & Armor Kits
            </h2>
          </div>

          {/* Flash Sale Countdown Timer Box */}
          <div className="flex items-center space-x-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm">
            <Timer className="w-5 h-5 text-[#EB0028] shrink-0" />
            <div className="text-left">
              <div className="text-[9px] uppercase font-bold tracking-widest text-gray-400">
                Flash Drop Closes In
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-sm sm:text-base font-bold text-black">
                <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-[#EB0028]">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {BUNDLE_OFFERS.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white border border-gray-200 hover:border-black rounded-2xl overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl space-y-6 group"
            >
              <div>
                {/* Bundle Tag & Discount Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                    {bundle.tag}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EB0028] text-white">
                    SAVE {bundle.discountPercent}%
                  </span>
                </div>

                {/* Bundle Visual Combination */}
                <div className="relative h-44 bg-gray-50 rounded-xl p-4 flex items-center justify-around border border-gray-100 mb-4">
                  {bundle.products.map((p, pIdx) => (
                    <React.Fragment key={p.id}>
                      <div className="w-24 h-24 flex items-center justify-center">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                        />
                      </div>
                      {pIdx < bundle.products.length - 1 && (
                        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-bold shrink-0 shadow-xs">
                          <Plus className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:text-[#EB0028] transition-colors">
                  {bundle.title}
                </h3>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{bundle.subtitle}</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 font-normal">
                  {bundle.description}
                </p>
              </div>

              {/* Pricing & 1-Click Buy */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xl font-black text-black">
                      ₹{bundle.bundlePrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-400 line-through">
                      ₹{bundle.originalTotalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Save ₹{(bundle.originalTotalPrice - bundle.bundlePrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="w-full py-3.5 rounded-full bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest transition-all shadow flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Bundle to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
