import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, ShoppingBag, Plus, Sparkles, Check, Scissors } from 'lucide-react';
import { BUNDLE_OFFERS } from '../../data/bundles';
import { useShop } from '../../context/ShopContext';

interface FlashOffersSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const FlashOffersSection: React.FC<FlashOffersSectionProps> = ({ onNavigate }) => {
  const { addToCart, showToast } = useShop();

  // Limited Capsule countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddBundle = (bundle: typeof BUNDLE_OFFERS[0]) => {
    bundle.products.forEach((p) => {
      const defaultColor = p.colors[0];
      const defaultSize = p.sizes ? p.sizes[0] : undefined;
      const defaultVariant = p.variants ? p.variants[0] : undefined;
      addToCart(p, defaultColor, defaultVariant, 1, defaultSize);
    });
    showToast('Outfit Added to Bag!', `Added complete look: ${bundle.title} (${bundle.products.length} garments).`);
  };

  return (
    <section id="shop-the-look-section" className="py-20 bg-[#FDFBF7] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header with Live Runway Capsule Countdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-[#E0D8C8] gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#9A7B38] uppercase">
                Shop The Look & Complete Ensembles
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#111111] tracking-tight mt-1.5">
              Curated Runway Capsules
            </h2>
          </div>

          {/* Capsule Drop Timer Box */}
          <div className="flex items-center space-x-3 bg-white border border-[#E0D8C8] px-5 py-3 rounded-2xl shadow-xs">
            <Timer className="w-4 h-4 text-[#9A7B38] shrink-0" />
            <div className="text-left">
              <div className="text-[9px] uppercase font-bold tracking-widest text-stone-400">
                Seasonal Capsule Window
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-sm sm:text-base font-bold text-stone-900">
                <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D9]">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D9]">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D9] text-[#9A7B38]">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {BUNDLE_OFFERS.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white border border-[#E8E2D9] hover:border-[#9A7B38] rounded-2xl overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl space-y-6 group"
            >
              <div>
                {/* Bundle Tag & Discount Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#FAF8F5] text-stone-800 border border-[#E0D8C8]">
                    {bundle.tag}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#111111] text-white">
                    SAVE {bundle.discountPercent}%
                  </span>
                </div>

                {/* Bundle Visual Combination */}
                <div className="relative h-48 bg-[#FAF8F5] rounded-xl p-3 flex items-center justify-around border border-[#EFECE6] mb-5 overflow-hidden">
                  {bundle.products.map((p, pIdx) => (
                    <React.Fragment key={p.id}>
                      <div 
                        onClick={() => onNavigate('product-detail', { productId: p.id })}
                        className="w-24 h-36 rounded-lg overflow-hidden border border-[#E0D8C8] bg-white cursor-pointer hover:scale-105 transition-transform shadow-xs relative group/item"
                        title={p.name}
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-1">
                          <span className="text-[8px] font-bold text-white uppercase tracking-tight truncate bg-black/60 px-1 rounded">
                            {p.sizes ? p.sizes[0] : 'One Size'}
                          </span>
                        </div>
                      </div>
                      {pIdx < bundle.products.length - 1 && (
                        <div className="w-6 h-6 rounded-full bg-white border border-[#E0D8C8] flex items-center justify-center text-stone-400 font-bold shrink-0 shadow-xs">
                          <Plus className="w-3.5 h-3.5 text-stone-800" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#9A7B38] transition-colors leading-snug">
                  {bundle.title}
                </h3>
                <p className="text-xs font-medium text-stone-500 mt-1">{bundle.subtitle}</p>
                <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-2 font-normal">
                  {bundle.description}
                </p>

                {/* Items in Look bullet list */}
                <div className="mt-4 pt-3 border-t border-[#F0EBE1] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Included Garments:</span>
                  {bundle.products.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs text-stone-700">
                      <span className="truncate pr-2">• {item.name}</span>
                      <span className="font-semibold text-stone-900 shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & 1-Click Buy */}
              <div className="pt-4 border-t border-[#EFECE6] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xl font-extrabold text-stone-900">
                      ₹{bundle.bundlePrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-stone-400 line-through">
                      ₹{bundle.originalTotalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Save ₹{(bundle.originalTotalPrice - bundle.bundlePrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="w-full py-3.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Outfit to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
