import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Layers,
  RotateCw,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface HeroSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { open360Viewer, addToCanvas, isInCanvas, addToCart } = useShop();

  // Curated hero showcase pieces
  const heroProducts = [
    PRODUCTS[3], // Milano Wool Tailored Blazer
    PRODUCTS[2], // Mulberry Silk Slip Dress
    PRODUCTS[4], // Cashmere Overcoat
    PRODUCTS[0], // Supima Cotton Oxford Shirt
    PRODUCTS[5], // Tuscan Leather Tote
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = heroProducts[activeIndex] || PRODUCTS[0];
  const onCanvas = isInCanvas(current.id);

  // Auto rotate hero every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  const scrollToStory = () => {
    const el = document.getElementById('editorial-collections-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[700px] lg:min-h-[85vh] bg-[#0A0A0A] text-[#F5F2EB] overflow-hidden flex flex-col justify-between border-b border-[#1A1A1A] select-none"
    >
      {/* Editorial Luxury Ambient Atmospheric Light */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#161616]/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-8 w-full relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          {/* Left Editorial Narrative Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Editorial Capsule Badge */}
            <div className="inline-flex items-center space-x-3 bg-[#141414] border border-[#262626] px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
              <span className="text-[#C5A880] font-mono font-medium uppercase tracking-[0.25em] text-[10px]">
                {current.badge || 'AUTUMN / WINTER RUNWAY'}
              </span>
              <span className="text-[#444]">•</span>
              <span className="text-[#A0988A] uppercase tracking-widest text-[10px] font-mono">
                MILANO / PARIS
              </span>
            </div>

            {/* Headline with smooth crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-[#F5F2EB] leading-[1.08]">
                  {current.name}
                </h1>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-0.5 bg-[#C5A880]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] font-mono font-medium">
                    {current.fabric || current.materials || 'Signature Sustainable Natural Fibers'}
                  </span>
                </div>

                <p className="text-[#999285] text-sm sm:text-base font-normal max-w-xl leading-relaxed">
                  {current.tagline || current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Pricing & Sizing Highlights */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EB] tracking-tight">
                  ₹{current.price.toLocaleString('en-IN')}
                </span>
                {current.originalPrice > current.price && (
                  <span className="text-sm text-[#777] line-through">
                    ₹{current.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {current.discountPercent && (
                  <span className="text-[10px] font-mono font-semibold text-black bg-[#C5A880] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {current.discountPercent}% Off
                  </span>
                )}
              </div>

              <div className="h-5 w-px bg-[#262626] hidden sm:block" />

              <div className="flex items-center space-x-2 text-xs text-[#999285]">
                <span className="font-mono text-[#C5A880]">STOCK:</span>
                <span>{current.stockCount ? `${current.stockCount} Pieces Available` : 'Atelier Small Batch'}</span>
              </div>
            </div>

            {/* Primary Calls to Action */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <button
                id="hero-view-garment-btn"
                onClick={() => onNavigate('product', { id: current.id })}
                className="px-7 py-3.5 bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-serif font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg hover:shadow-[#C5A880]/20 flex items-center space-x-2.5 cursor-pointer"
              >
                <span>Inspect Piece</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-collect-canvas-btn"
                onClick={() => addToCanvas(current)}
                className={`px-5 py-3.5 rounded-xl border text-xs font-serif tracking-widest uppercase transition-all flex items-center space-x-2 cursor-pointer ${
                  onCanvas
                    ? 'bg-[#181818] border-[#C5A880] text-[#C5A880]'
                    : 'bg-[#141414] hover:bg-[#1E1E1E] border-[#2A2A2A] text-[#F5F2EB]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#C5A880]" />
                <span>{onCanvas ? 'Collected on Canvas' : 'Collect to Canvas'}</span>
              </button>

              <button
                id="hero-360-view-btn"
                onClick={() => open360Viewer(current)}
                className="px-4 py-3.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-[#999285] hover:text-[#F5F2EB] text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-2 cursor-pointer"
                title="Open 360 Studio"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="hidden sm:inline">360° Studio</span>
              </button>
            </div>

            {/* Sartorial Attributes Ribbon */}
            <div className="pt-6 border-t border-[#1C1C1C] grid grid-cols-3 gap-4 max-w-lg text-[11px]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777] block">Provenance</span>
                <span className="font-serif font-medium text-[#D8D2C5] mt-0.5 block truncate">
                  {current.countryOfOrigin || 'European Mills'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777] block">Fit Silhouette</span>
                <span className="font-serif font-medium text-[#D8D2C5] mt-0.5 block truncate">
                  {current.fit || 'Tailored Regular'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777] block">Seam Precision</span>
                <span className="font-serif font-medium text-[#D8D2C5] mt-0.5 block truncate">
                  Hand-Finished
                </span>
              </div>
            </div>
          </div>

          {/* Right Runway Editorial Stage Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Circular Backdrop Aura */}
            <div className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-[#C5A880]/15 to-[#161616] border border-[#222222] pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#242424] bg-[#141414] group"
                >
                  <img
                    src={current.images[0]}
                    alt={current.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Secondary Image hover reveal */}
                  {current.images[1] && (
                    <img
                      src={current.images[1]}
                      alt={`${current.name} detail`}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}

                  {/* Subtle Corner Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/80 text-[#C5A880] border border-[#C5A880]/30 backdrop-blur-xs">
                      Atelier Cut #{activeIndex + 1}
                    </span>
                  </div>

                  {/* Bottom Quick Look Bar */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onNavigate('product', { id: current.id })}
                      className="text-xs font-serif font-semibold text-[#F5F2EB] hover:text-[#C5A880] flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Specifications</span>
                    </button>
                    <button
                      onClick={() => addToCart(current)}
                      className="p-2 rounded-lg bg-[#C5A880] text-black hover:bg-[#D4AF37] transition-colors cursor-pointer"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Runway Carousel Indicators */}
              <div className="flex items-center justify-center space-x-2 mt-6">
                {heroProducts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'w-8 bg-[#C5A880]'
                        : 'w-2 bg-[#262626] hover:bg-[#444]'
                    }`}
                    aria-label={`Slide to piece ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Scroll Cue at Bottom */}
      <div className="relative z-10 border-t border-[#161616] py-3.5 px-6 flex items-center justify-between text-xs text-[#777] bg-[#0C0C0C]">
        <div className="flex items-center space-x-4">
          <span className="font-mono text-[11px] text-[#C5A880] uppercase tracking-widest">
            AURELIA MAISON NO. 26
          </span>
          <span className="hidden md:inline text-[#333]">•</span>
          <span className="hidden md:inline text-[11px]">
            Complimentary White-Glove Insured Delivery Across India
          </span>
        </div>

        <button
          onClick={scrollToStory}
          className="inline-flex items-center space-x-1.5 text-[11px] font-mono uppercase tracking-wider text-[#A0988A] hover:text-[#F5F2EB] transition-colors cursor-pointer"
        >
          <span>Scroll to Unfold Atelier Story</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
