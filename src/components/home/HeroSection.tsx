import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight, ShieldCheck, Star, Sparkles, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface HeroSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { addToCart, open360Viewer } = useShop();

  const heroProducts = [
    PRODUCTS[0], // 120W GaN Pro Station
    PRODUCTS[2], // AirPulse Pro Earbuds
    PRODUCTS[1], // Stealth Aramid Case
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = heroProducts[activeIndex];

  // Auto rotate hero every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  return (
    <section id="hero-section" className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] bg-[#FAFAFA] overflow-hidden flex items-center border-b border-gray-200">
      {/* Background subtle geometry */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EB0028]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill / Editorial Kicker */}
            <div className="inline-flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-[#EB0028]" />
              <span className="text-[#EB0028] font-bold uppercase tracking-[0.25em] text-[10px]">
                {current.badge || 'FLAGSHIP RELEASE'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 uppercase tracking-widest text-[10px] font-semibold">ENGINEERED EDITION</span>
            </div>

            {/* Headline with dynamic transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black uppercase leading-[1.05]">
                  {current.name}
                </h1>
                <div className="w-12 h-0.5 bg-[#EB0028]" />
                <p className="text-sm sm:text-base text-gray-600 max-w-xl font-normal leading-relaxed">
                  {current.tagline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Price & Highlight stats */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                  ₹{current.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-gray-400 line-through">
                  ₹{current.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold text-white bg-[#EB0028] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Save {current.discountPercent}%
                </span>
              </div>

              <div className="h-5 w-px bg-gray-200 hidden sm:block" />

              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="font-bold text-black">{current.rating}</span>
                </div>
                <span>({current.reviewCount} Reviews)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                id="hero-shop-now-btn"
                onClick={() => onNavigate('product-detail', { productId: current.id })}
                className="px-8 py-4 rounded-full bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-btn"
                onClick={() => onNavigate('product-detail', { productId: current.id })}
                className="px-7 py-4 rounded-full bg-white hover:bg-black hover:text-white border border-gray-300 hover:border-black text-black font-bold text-xs uppercase tracking-widest transition-all"
              >
                Specifications
              </button>

              <button
                onClick={() => open360Viewer(current)}
                className="px-4 py-3.5 rounded-full bg-transparent hover:bg-gray-100 text-gray-600 hover:text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#EB0028]" />
                <span>360° View</span>
              </button>
            </div>

            {/* Hero switcher tabs */}
            <div className="pt-6 flex items-center space-x-2">
              {heroProducts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-10 bg-black' : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Show ${p.name}`}
                />
              ))}
            </div>
          </div>

          {/* Right Product Cinematic Hero Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md aspect-square rounded-3xl bg-white border border-gray-200 p-8 flex items-center justify-center shadow-xl group overflow-hidden"
              >
                <img
                  src={current.images[0]}
                  alt={current.name}
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Spec Tag */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-gray-200 px-3.5 py-1.5 rounded-full shadow-md flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#EB0028]" />
                  <span>24-Month Warranty</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
