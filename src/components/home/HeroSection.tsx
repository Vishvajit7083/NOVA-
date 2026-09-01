import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Star, Shield, Scissors, Compass } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface HeroSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { open360Viewer } = useShop();

  // Curated hero showcase pieces
  const heroProducts = [
    PRODUCTS[3], // Milano Wool Tailored Blazer
    PRODUCTS[2], // Mulberry Silk Slip Dress
    PRODUCTS[4], // Cashmere Overcoat
    PRODUCTS[0], // Supima Cotton Oxford Shirt
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = heroProducts[activeIndex] || PRODUCTS[0];

  // Auto rotate hero every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  return (
    <section id="hero-section" className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[740px] bg-[#FDFBF7] overflow-hidden flex items-center border-b border-[#E8E2D9]">
      {/* Editorial Luxury Ambient Lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#111111]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Editorial Capsule Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-[#E0D8C8] px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#9A7B38]" />
              <span className="text-[#9A7B38] font-bold uppercase tracking-[0.25em] text-[10px]">
                {current.badge || 'AUTUMN / WINTER ATELIER'}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 uppercase tracking-widest text-[10px] font-medium">PARIS / MILANO</span>
            </div>

            {/* Headline with smooth crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-[#111111] leading-[1.08]">
                  {current.name}
                </h1>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-0.5 bg-[#9A7B38]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#9A7B38] font-semibold">
                    {current.fabric || current.materials || 'Signature Sustainable Natural Fibers'}
                  </span>
                </div>

                <p className="text-stone-600 text-sm sm:text-base font-normal max-w-xl leading-relaxed">
                  {current.tagline || current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Pricing & Sizing Highlights */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                  ₹{current.price.toLocaleString('en-IN')}
                </span>
                {current.originalPrice > current.price && (
                  <span className="text-base text-stone-400 line-through">
                    ₹{current.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {current.discountPercent && (
                  <span className="text-[10px] font-bold text-white bg-[#111111] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Save {current.discountPercent}%
                  </span>
                )}
              </div>

              <div className="h-5 w-px bg-[#E5DFD5] hidden sm:block" />

              {/* Available Sizes Pills Preview */}
              {current.sizes && current.sizes.length > 0 && (
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] uppercase font-semibold text-stone-400 mr-1">Sizes:</span>
                  {current.sizes.slice(0, 5).map((size) => (
                    <span key={size} className="text-[11px] font-medium px-2 py-0.5 rounded border border-[#E0D8C8] bg-white text-stone-800">
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="hero-shop-now-btn"
                onClick={() => onNavigate('product-detail', { productId: current.id })}
                className="px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-medium text-xs uppercase tracking-widest shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <span>Discover Garment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-style-btn"
                onClick={() => onNavigate('shop', { category: current.category })}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#111111] hover:text-white border border-[#D5CDBC] hover:border-[#111111] text-[#111111] font-medium text-xs uppercase tracking-widest transition-all shadow-xs"
              >
                View Collection
              </button>

              <button
                onClick={() => open360Viewer(current)}
                className="px-4 py-3 rounded-full text-stone-600 hover:text-[#111111] text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                title="View High Resolution Editorial Gallery"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>360° Atelier View</span>
              </button>
            </div>

            {/* Hero switcher tabs */}
            <div className="pt-4 flex items-center space-x-2">
              {heroProducts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-10 bg-[#111111]' : 'w-3 bg-[#D9D1C2] hover:bg-stone-400'
                  }`}
                  aria-label={`Show ${p.name}`}
                />
              ))}
            </div>
          </div>

          {/* Right Product Editorial Visual & Model Stats */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md aspect-[3/4] rounded-2xl bg-white border border-[#E8E2D9] overflow-hidden shadow-xl group cursor-pointer"
                onClick={() => onNavigate('product-detail', { productId: current.id })}
              >
                {/* Fashion Photography Image */}
                <img
                  src={current.images[0]}
                  alt={current.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Floating Bottom Editorial Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-[#E5DFD5] p-3.5 rounded-xl shadow-lg flex items-center justify-between text-left">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#9A7B38]">
                      {current.fit || 'TAILORED CUT'}
                    </p>
                    <p className="text-xs font-serif font-bold text-stone-900 line-clamp-1">
                      {current.name}
                    </p>
                    {current.modelStats && (
                      <p className="text-[10px] text-stone-500 font-light">
                        Model is {current.modelStats.height}, wearing size {current.modelStats.wearingSize}
                      </p>
                    )}
                  </div>
                  <div className="pl-3 border-l border-stone-200 text-right">
                    <span className="text-xs font-bold text-stone-900">
                      ₹{current.price.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold">
                      In Stock
                    </p>
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                  {current.gender ? `${current.gender.toUpperCase()} COLLECTION` : 'READY TO WEAR'}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
