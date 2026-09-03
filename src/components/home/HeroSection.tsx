import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Layers,
  RotateCw,
  Eye,
  ShoppingBag,
  Compass,
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface HeroSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

type TrailerStage = 'light' | 'visual' | 'headline' | 'statement' | 'cta' | 'complete';

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { open360Viewer, addToCanvas, isInCanvas, addToCart } = useShop();

  // Authentic flagship pieces from Aurelia's actual collection
  const heroProducts = [
    PRODUCTS.find((p) => p.id === 'nov-w-blazer-01') || PRODUCTS[0],
    PRODUCTS.find((p) => p.id === 'nov-w-silk-dress-01') || PRODUCTS[1],
    PRODUCTS.find((p) => p.id === 'nov-out-coat-01') || PRODUCTS[2],
    PRODUCTS.find((p) => p.id === 'nov-m-trouser-01') || PRODUCTS[3],
    PRODUCTS.find((p) => p.id === 'nov-m-oxford-01') || PRODUCTS[4],
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = heroProducts[activeIndex] || heroProducts[0];
  const onCanvas = isInCanvas(current.id);

  // Stage 2 Cinematic Trailer progressive state
  const [stage, setStage] = useState<TrailerStage>(() => {
    try {
      if (typeof window === 'undefined') return 'complete';
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return 'complete';
      const shown = sessionStorage.getItem('aurelia_intro_shown');
      return shown ? 'complete' : 'light';
    } catch {
      return 'complete';
    }
  });

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const completeTrailer = useCallback(() => {
    clearAllTimers();
    setStage('complete');
    try {
      sessionStorage.setItem('aurelia_intro_shown', 'true');
    } catch {}
  }, [clearAllTimers]);

  // Progressive Stage 2 reveal choreography (coordinated with Stage 1 cloth opening)
  const startTrailerSequence = useCallback(() => {
    clearAllTimers();
    setStage('light');

    // Timeline:
    // 0.0s - 2.6s: Phase 1 — Deep obsidian background & atmospheric light (visible through the parting cloth)
    // 2.6s - 5.2s: Phase 2 — Main fashion visual reveals with slow zoom and campaign light/shadow sweep
    // 5.2s - 7.6s: Phase 3 — Aurelia Haute Couture headline fades in moving upward
    // 7.6s - 10.0s: Phase 4 — Refined brand statement appears
    // 10.0s - 12.2s: Phase 5 — Primary EXPLORE COLLECTION CTA blooms with micro-animation
    // 12.2s+: Phase 6 — Full interactive steady state, carousel active

    const t1 = setTimeout(() => {
      setStage('visual');
    }, 2600);

    const t2 = setTimeout(() => {
      setStage('headline');
    }, 5200);

    const t3 = setTimeout(() => {
      setStage('statement');
    }, 7600);

    const t4 = setTimeout(() => {
      setStage('cta');
    }, 10000);

    const t5 = setTimeout(() => {
      completeTrailer();
    }, 12200);

    timersRef.current = [t1, t2, t3, t4, t5];
  }, [clearAllTimers, completeTrailer]);

  // Listen to external triggers (Replay from footer, skip from cloth intro)
  useEffect(() => {
    const handleReplay = () => {
      setActiveIndex(0);
      startTrailerSequence();
    };

    const handleSkip = () => {
      completeTrailer();
    };

    window.addEventListener('aurelia:replay-intro', handleReplay);
    window.addEventListener('aurelia:skip-trailer', handleSkip);

    return () => {
      window.removeEventListener('aurelia:replay-intro', handleReplay);
      window.removeEventListener('aurelia:skip-trailer', handleSkip);
    };
  }, [startTrailerSequence, completeTrailer]);

  // Initial mount trigger if intro not yet shown
  useEffect(() => {
    if (stage === 'light') {
      startTrailerSequence();
    }
    return () => clearAllTimers();
  }, []);

  // Auto-rotate hero pieces once in full interactive mode
  useEffect(() => {
    if (stage !== 'complete') return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [stage, heroProducts.length]);

  // Subtle pointer parallax across the desktop editorial stage
  const handlePointerMove = (e: React.MouseEvent<HTMLElement>) => {
    if (stage !== 'complete') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMouseOffset({ x, y });
  };

  const scrollToStory = () => {
    const el = document.getElementById('editorial-collections-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper flags for progressive disclosure
  const isVisualVisible = stage !== 'light';
  const isHeadlineVisible = stage !== 'light' && stage !== 'visual';
  const isStatementVisible = isHeadlineVisible && stage !== 'headline';
  const isCtaVisible = isStatementVisible && stage !== 'statement';
  const isFullyComplete = stage === 'complete';

  return (
    <section
      id="hero-section"
      ref={heroContainerRef}
      onMouseMove={handlePointerMove}
      className="relative min-h-[720px] lg:min-h-[88vh] bg-[#0A0A0A] text-[#F5F2EB] overflow-hidden flex flex-col justify-between border-b border-[#1A1A1A] select-none"
      aria-label="Aurelia Haute Couture Autumn / Winter Runway Campaign"
    >
      {/* 1. ATMOSPHERIC LIGHT: Ambient golden aura breathing continuously (Continuous from Stage 1 cloth parting) */}
      <div
        className="absolute top-1/3 right-1/4 w-[620px] h-[620px] bg-[#C5A880]/12 rounded-full blur-[160px] pointer-events-none animate-atmosphere-breathe"
        style={{
          transform: `translate(${mouseOffset.x * -0.5}px, ${mouseOffset.y * -0.5}px)`,
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#141414]/60 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle film grain texture overlay for cinematic runway depth */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* In-trailer quick skip control (active during Stage 2 reveal) */}
      {!isFullyComplete && (
        <div className="absolute top-4 right-6 z-30 pointer-events-auto">
          <button
            id="hero-skip-stage2-btn"
            onClick={completeTrailer}
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-[#121110]/85 hover:bg-[#C5A880] text-[#A0988A] hover:text-black border border-[#2B2824] hover:border-[#C5A880] text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer backdrop-blur-md shadow-md"
            title="Skip sequence to view full collection directly"
          >
            <span>Skip Sequence →</span>
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* DESKTOP EDITORIAL ASYMMETRIC COMPOSITION (lg: and above)     */}
      {/* ============================================================ */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-8 lg:px-12 pt-16 pb-10 w-full relative z-10 flex-1 items-center">
        <div className="grid grid-cols-12 gap-12 xl:gap-16 items-center w-full">
          {/* Left Column: Haute Couture Narrative & Actions (7 columns) */}
          <div className="col-span-7 space-y-6 text-left">
            {/* Atelier Capsule Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHeadlineVisible ? 1 : 0, y: isHeadlineVisible ? 0 : 10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center space-x-3 bg-[#121212] border border-[#262626] px-3.5 py-1.5 rounded-full shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
              <span className="text-[#C5A880] font-mono font-medium uppercase tracking-[0.25em] text-[10px]">
                {current.badge || 'AUTUMN / WINTER ATELIER'}
              </span>
              <span className="text-[#444]">•</span>
              <span className="text-[#A0988A] uppercase tracking-widest text-[10px] font-mono">
                MAISON NO. 26 • MILANO / PARIS
              </span>
            </motion.div>

            {/* 3. HEADLINE: Aurelia Haute Couture with upward fade-in */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: isHeadlineVisible ? 1 : 0, y: isHeadlineVisible ? 0 : 18 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="text-[11px] font-mono uppercase tracking-[0.42em] text-[#C5A880] font-medium">
                Haute Couture Runway Showcase
              </div>

              <h1 className="text-5xl xl:text-6xl font-serif tracking-tight text-[#F5F2EB] leading-[1.06]">
                Aurelia Haute Couture
              </h1>

              {/* Active Curated Garment Name */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="text-xl xl:text-2xl font-serif text-[#D4CEBF] font-light tracking-wide"
                >
                  {current.name}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* 4. BRAND STATEMENT: Refined poetic couture manifesto */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: isStatementVisible ? 1 : 0, y: isStatementVisible ? 0 : 14 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 pt-1"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-0.5 bg-[#C5A880]" />
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#C5A880] font-mono font-medium">
                  {current.fabric || 'Super 120s Virgin Wool & Pure Mulberry Silk'}
                </span>
              </div>

              <p className="text-[#A0988A] text-base font-normal max-w-xl leading-relaxed">
                Sculpted silhouettes born from Italian looms and Parisian ateliers. Where classical
                draping meets timeless modern poise.
              </p>
            </motion.div>

            {/* Pricing & Availability Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isCtaVisible ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-6 pt-1"
            >
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl xl:text-4xl font-serif font-bold text-[#F5F2EB] tracking-tight">
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

              <div className="h-5 w-px bg-[#262626]" />

              <div className="flex items-center space-x-2 text-xs text-[#999285]">
                <span className="font-mono text-[#C5A880]">ATELIER:</span>
                <span>
                  {current.stockCount ? `${current.stockCount} Pieces Available` : 'Small Batch Tailoring'}
                </span>
              </div>
            </motion.div>

            {/* 5. PRIMARY EXPLORE COLLECTION CTA WITH MICRO-ANIMATION & ACTIONS */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{
                opacity: isCtaVisible ? 1 : 0,
                y: isCtaVisible ? 0 : 12,
                scale: isCtaVisible ? 1 : 0.97,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {/* Primary EXPLORE COLLECTION CTA with shimmering border glint */}
              <button
                id="hero-explore-collection-cta"
                onClick={() => onNavigate('shop')}
                type="button"
                className="group relative px-8 py-4 bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-serif font-bold tracking-[0.2em] uppercase rounded-xl transition-all shadow-[0_0_28px_rgba(197,168,128,0.22)] hover:shadow-[0_0_38px_rgba(197,168,128,0.4)] flex items-center space-x-3 cursor-pointer overflow-hidden active:scale-95"
              >
                {/* Sophisticated micro-shimmer glint moving across button */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  <div className="w-12 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 animate-cta-glint" />
                </div>

                <Compass className="w-4 h-4 text-black group-hover:rotate-45 transition-transform duration-300" />
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Inspect Piece Button */}
              <button
                id="hero-view-garment-btn"
                onClick={() => onNavigate('product', { id: current.id })}
                type="button"
                className="px-6 py-4 bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#C5A880]/60 text-[#F5F2EB] text-xs font-serif tracking-widest uppercase rounded-xl transition-all flex items-center space-x-2.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Inspect Piece</span>
                <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>

              {/* Collect to Fashion Canvas */}
              <button
                id="hero-collect-canvas-btn"
                onClick={() => addToCanvas(current)}
                type="button"
                className={`px-5 py-4 rounded-xl border text-xs font-serif tracking-widest uppercase transition-all flex items-center space-x-2 cursor-pointer active:scale-95 ${
                  onCanvas
                    ? 'bg-[#181818] border-[#C5A880] text-[#C5A880]'
                    : 'bg-[#141414] hover:bg-[#1E1E1E] border-[#2A2A2A] text-[#F5F2EB]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#C5A880]" />
                <span>{onCanvas ? 'Collected' : 'Collect to Canvas'}</span>
              </button>

              {/* 360 Studio */}
              <button
                id="hero-360-view-btn"
                onClick={() => open360Viewer(current)}
                type="button"
                className="px-4 py-4 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-[#999285] hover:text-[#F5F2EB] text-xs font-mono tracking-wider uppercase transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                title="Open 360 Studio"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>360° Studio</span>
              </button>
            </motion.div>

            {/* Sartorial Attributes Ribbon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isCtaVisible ? 1 : 0 }}
              transition={{ duration: 1.0 }}
              className="pt-6 border-t border-[#1C1C1C] grid grid-cols-3 gap-6 max-w-lg text-[11px]"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777] block">Provenance</span>
                <span className="font-serif font-medium text-[#D8D2C5] mt-0.5 block truncate">
                  {current.countryOfOrigin || 'Milan & Biella Mills'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777] block">Fit Silhouette</span>
                <span className="font-serif font-medium text-[#D8D2C5] mt-0.5 block truncate">
                  {current.fit || 'Sculpted Regular'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777] block">Seam Precision</span>
                <span className="font-serif font-medium text-[#D8D2C5] mt-0.5 block truncate">
                  Hand-Finished Stitch
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 2. MAIN FASHION COLLECTION VISUAL with moving light/shadow (5 columns) */}
          <div className="col-span-5 relative flex justify-center items-center">
            {/* Ambient Circular Aura */}
            <div
              className="absolute w-84 sm:w-96 h-84 sm:h-96 rounded-full bg-gradient-to-tr from-[#C5A880]/15 to-[#161616] border border-[#222222] pointer-events-none blur-sm"
              style={{
                transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`,
                transition: 'transform 0.4s ease-out',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{
                opacity: isVisualVisible ? 1 : 0,
                scale: isVisualVisible ? 1 : 1.08,
              }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md"
              style={{
                transform: `translate(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px)`,
                transition: 'transform 0.4s ease-out',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#242424] bg-[#141414] group"
                >
                  {/* High Resolution Couture Photography with subtle slow zoom */}
                  <img
                    src={current.images[0]}
                    alt={current.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    style={{ willChange: 'transform' }}
                  />

                  {/* Secondary Image hover reveal */}
                  {current.images[1] && (
                    <img
                      src={current.images[1]}
                      alt={`${current.name} detail view`}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}

                  {/* CAMPAIGN STUDIO KEY-LIGHT / MOVING SHADOW SWEEP */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    {/* Sweeping Diffused Key-Light Beam */}
                    <div
                      className="absolute -inset-full w-[300%] h-[300%] pointer-events-none mix-blend-soft-light animate-studio-light-sweep"
                      style={{
                        background:
                          'linear-gradient(115deg, transparent 32%, rgba(255,245,230,0.42) 48%, rgba(197,168,128,0.5) 52%, transparent 68%)',
                      }}
                    />
                    {/* Studio Flag Shadow Vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-50 mix-blend-multiply"
                      style={{
                        background:
                          'radial-gradient(ellipse at 70% 30%, transparent 40%, rgba(10,10,10,0.65) 95%)',
                      }}
                    />
                  </div>

                  {/* Floating Atelier Cut Pill */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest bg-black/85 text-[#C5A880] border border-[#C5A880]/40 backdrop-blur-md shadow-md">
                      Atelier Cut #{activeIndex + 1}
                    </span>
                  </div>

                  {/* Bottom Quick Look Bar */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                      onClick={() => onNavigate('product', { id: current.id })}
                      type="button"
                      className="text-xs font-serif font-semibold text-[#F5F2EB] hover:text-[#C5A880] flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Specifications</span>
                    </button>
                    <button
                      onClick={() => addToCart(current)}
                      type="button"
                      className="p-2.5 rounded-lg bg-[#C5A880] text-black hover:bg-[#D4AF37] transition-colors cursor-pointer shadow-md"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
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
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex
                        ? 'w-8 bg-[#C5A880] shadow-[0_0_10px_rgba(197,168,128,0.5)]'
                        : 'w-2 bg-[#262626] hover:bg-[#444]'
                    }`}
                    aria-label={`Slide to piece ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE RECOMPOSED PORTRAIT VIEWING (< lg)                    */}
      {/* ============================================================ */}
      <div className="flex lg:hidden flex-col justify-center px-5 sm:px-8 pt-8 pb-10 w-full relative z-10 flex-1">
        {/* Top Maison Capsule */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: isHeadlineVisible ? 1 : 0, y: isHeadlineVisible ? 0 : -6 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-4"
        >
          <div className="inline-flex items-center space-x-2.5 bg-[#121212] border border-[#262626] px-3.5 py-1 rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
            <span className="text-[#C5A880] font-mono font-medium uppercase tracking-[0.2em] text-[10px]">
              AURELIA MAISON NO. 26
            </span>
          </div>
        </motion.div>

        {/* 2. MOBILE FASHION CAMPAIGN VISUAL (Heroic Portrait Centerpiece) */}
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{
            opacity: isVisualVisible ? 1 : 0,
            scale: isVisualVisible ? 1 : 1.06,
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xs sm:max-w-sm mx-auto mb-6"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#242424] bg-[#141414] shadow-2xl">
            <img
              src={current.images[0]}
              alt={current.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Campaign Studio Light & Shadow Sweep */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute -inset-full w-[300%] h-[300%] pointer-events-none mix-blend-soft-light animate-studio-light-sweep"
                style={{
                  background:
                    'linear-gradient(115deg, transparent 35%, rgba(255,245,230,0.4) 48%, rgba(197,168,128,0.5) 52%, transparent 65%)',
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,10,10,0.7) 100%)',
                }}
              />
            </div>

            {/* Atelier Cut Pill */}
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest bg-black/85 text-[#C5A880] border border-[#C5A880]/30 backdrop-blur-xs">
                Piece {activeIndex + 1}/5
              </span>
            </div>
          </div>

          {/* Carousel indicators for mobile */}
          <div className="flex items-center justify-center space-x-1.5 mt-3">
            {heroProducts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(idx)}
                className={`h-1 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex ? 'w-6 bg-[#C5A880]' : 'w-1.5 bg-[#333]'
                }`}
                aria-label={`Slide to garment ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* 3. MOBILE HEADLINE: Aurelia Haute Couture */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: isHeadlineVisible ? 1 : 0, y: isHeadlineVisible ? 0 : 14 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-1.5 mb-3"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
            Haute Couture Atelier
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-[#F5F2EB] leading-tight">
            Aurelia Haute Couture
          </h1>
          <p className="text-base font-serif text-[#C5A880] font-light">{current.name}</p>
        </motion.div>

        {/* 4. MOBILE BRAND STATEMENT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isStatementVisible ? 1 : 0, y: isStatementVisible ? 0 : 10 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-sm mx-auto mb-4"
        >
          <p className="text-xs sm:text-sm text-[#999285] leading-relaxed">
            Sculpted silhouettes born from Italian looms and Parisian ateliers. Where classical
            draping meets timeless modern poise.
          </p>

          <div className="mt-2.5 flex items-center justify-center space-x-3 text-sm font-serif font-bold text-[#F5F2EB]">
            <span>₹{current.price.toLocaleString('en-IN')}</span>
            {current.discountPercent && (
              <span className="text-[10px] font-mono text-black bg-[#C5A880] px-2 py-0.5 rounded-full uppercase">
                {current.discountPercent}% Off
              </span>
            )}
          </div>
        </motion.div>

        {/* 5. MOBILE PRIMARY EXPLORE COLLECTION CTA & SECONDARY ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{
            opacity: isCtaVisible ? 1 : 0,
            y: isCtaVisible ? 0 : 10,
            scale: isCtaVisible ? 1 : 0.98,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2.5 max-w-xs sm:max-w-sm mx-auto w-full"
        >
          {/* Primary CTA (Min 48px height for touch target) */}
          <button
            id="hero-mobile-explore-cta"
            onClick={() => onNavigate('shop')}
            type="button"
            className="group relative w-full py-4 bg-[#C5A880] active:bg-[#D4AF37] text-black text-xs font-serif font-bold tracking-[0.2em] uppercase rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="w-12 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 animate-cta-glint" />
            </div>
            <Compass className="w-4 h-4 text-black" />
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate('product', { id: current.id })}
              type="button"
              className="py-3 bg-[#141414] border border-[#282828] text-[#F5F2EB] text-[11px] font-serif tracking-wider uppercase rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Inspect Piece</span>
            </button>
            <button
              onClick={() => open360Viewer(current)}
              type="button"
              className="py-3 bg-[#141414] border border-[#282828] text-[#999285] text-[11px] font-mono tracking-wider uppercase rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>360° View</span>
            </button>
          </div>
        </motion.div>
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
          type="button"
          className="inline-flex items-center space-x-1.5 text-[11px] font-mono uppercase tracking-wider text-[#A0988A] hover:text-[#F5F2EB] transition-colors cursor-pointer"
        >
          <span>Scroll to Unfold Atelier Story</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
