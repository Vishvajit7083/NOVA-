import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryCarousel } from '../components/home/CategoryCarousel';
import { FlashOffersSection } from '../components/home/FlashOffersSection';
import { StyleFinder } from '../components/home/StyleFinder';
import { TechInnovationSection } from '../components/home/TechInnovationSection';
import { ProductCard } from '../components/product/ProductCard';
import { PRODUCTS } from '../data/products';
import { ArrowRight, Star, Sparkles, CheckCircle2, Scissors, Compass } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filterCategories = [
    { id: 'all', label: 'All Ready-to-Wear' },
    { id: 'men-clothing', label: "Men's Atelier" },
    { id: 'women-clothing', label: "Women's Runway" },
    { id: 'outerwear-jackets', label: 'Outerwear & Coats' },
    { id: 'footwear-shoes', label: 'Footwear & Boots' },
    { id: 'leather-bags', label: 'Tuscan Leather' },
    { id: 'fine-jewellery', label: 'Fine Jewellery & Watches' },
  ];

  const filteredProducts =
    activeTab === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <div id="home-page" className="min-h-screen bg-[#FDFBF7] text-[#111111]">
      
      {/* 1. Cinematic Editorial Runway Hero Showcase */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Curated Departements Carousel */}
      <CategoryCarousel onNavigate={onNavigate} />

      {/* 3. Featured Atelier Ready-to-Wear Section with Filter Tabs */}
      <section id="featured-products-section" className="py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 pb-5 border-b border-[#E0D8C8] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#9A7B38] uppercase">
                Autumn / Winter Atelier
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#111111] tracking-tight mt-1.5">
              Curated Garments & Accessories
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {filterCategories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white border border-[#E0D8C8] text-stone-600 hover:text-[#111111] hover:border-stone-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>

        {/* View full collection CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="px-9 py-4 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-medium text-xs uppercase tracking-widest transition-all shadow-md hover:scale-105 inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Explore Full {PRODUCTS.length}+ Piece Atelier Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Interactive Bespoke Style & Capsule Finder */}
      <StyleFinder onNavigate={onNavigate} />

      {/* 5. Shop The Look & Limited Runway Outfits */}
      <FlashOffersSection onNavigate={onNavigate} />

      {/* 6. Generational Craftsmanship & Sustainable Materials */}
      <TechInnovationSection onNavigate={onNavigate} />

      {/* 7. Editorial VIP Reviews & Client Testimonials */}
      <section className="py-24 bg-white border-t border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-stone-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#9A7B38]" />
            <span>Over 45,000+ Discerning Clients Dressed Globally</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-tight">
            Client Voices & Editorial Acclaim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 text-left">
            <div className="p-7 bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl space-y-4 shadow-xs">
              <div className="flex text-amber-500 space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                "The Milano Tailored Wool Blazer fits as though crafted by a bespoke Savile Row tailor. The Super 120s drape and floating canvas construction are extraordinary."
              </p>
              <div className="text-xs font-serif font-bold text-stone-900 pt-3 border-t border-[#EAE4D8]">
                Devika Singhania <span className="text-stone-500 font-normal font-sans">• Mumbai, MH</span>
              </div>
            </div>

            <div className="p-7 bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl space-y-4 shadow-xs">
              <div className="flex text-amber-500 space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                "The 22 Momme silk slip dress is liquid poetry. Flawless French seams, zero synthetic cling, and arrived in archival packaging within 48 hours."
              </p>
              <div className="text-xs font-serif font-bold text-stone-900 pt-3 border-t border-[#EAE4D8]">
                Priyanka Sen <span className="text-stone-500 font-normal font-sans">• New Delhi</span>
              </div>
            </div>

            <div className="p-7 bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl space-y-4 shadow-xs">
              <div className="flex text-amber-500 space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                "The Goodyear welted Chelsea boots and the Tuscan leather tote are pure heirloom tier. The 14-day doorstep size exchange was effortless."
              </p>
              <div className="text-xs font-serif font-bold text-stone-900 pt-3 border-t border-[#EAE4D8]">
                Arjun K. Varma <span className="text-stone-500 font-normal font-sans">• Bengaluru, KA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
