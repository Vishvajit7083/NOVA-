import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryCarousel } from '../components/home/CategoryCarousel';
import { ExploreByTexture } from '../components/home/ExploreByTexture';
import { BuildYourLook } from '../components/home/BuildYourLook';
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
    <div id="home-page" className="min-h-screen bg-[#0A0A0A] text-[#F5F2EB]">
      {/* 1. Cinematic Editorial Runway Hero Showcase */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Curated Departements Carousel */}
      <div id="editorial-collections-section">
        <CategoryCarousel onNavigate={onNavigate} />
      </div>

      {/* 3. Explore by Texture & Weave */}
      <ExploreByTexture onNavigate={onNavigate} />

      {/* 4. Build Your Look (Intelligent Mood Curator) */}
      <BuildYourLook onNavigate={onNavigate} />

      {/* 5. Featured Atelier Ready-to-Wear Section with Filter Tabs */}
      <section id="featured-products-section" className="py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 pb-5 border-b border-[#1F1F1F] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
                Autumn / Winter Atelier
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F5F2EB] tracking-tight mt-1.5">
              Curated Garments & Accessories
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {filterCategories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-serif uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#C5A880] text-black shadow-md font-bold'
                    : 'bg-[#121212] border border-[#222222] text-[#A0988A] hover:text-white hover:border-[#C5A880]'
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
            className="px-9 py-4 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:scale-105 inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Explore Full {PRODUCTS.length}+ Piece Atelier Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Interactive Bespoke Style & Capsule Finder */}
      <StyleFinder onNavigate={onNavigate} />

      {/* 7. Shop The Look & Limited Runway Outfits */}
      <FlashOffersSection onNavigate={onNavigate} />

      {/* 8. Generational Craftsmanship & Sustainable Materials */}
      <TechInnovationSection onNavigate={onNavigate} />

      {/* 7. Editorial VIP Reviews & Client Testimonials */}
      <section className="py-24 bg-[#0A0A0A] border-t border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#121212] border border-[#222222] text-stone-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
            <span>Over 45,000+ Discerning Clients Dressed Globally</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F2EB] tracking-tight">
            Client Voices & Editorial Acclaim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 text-left">
            <div className="p-7 bg-[#121212] border border-[#222222] rounded-2xl space-y-4 shadow-xl">
              <div className="flex text-[#C5A880] space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#C5A880] stroke-[#C5A880]" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                "The Milano Tailored Wool Blazer fits as though crafted by a bespoke Savile Row tailor. The Super 120s drape and floating canvas construction are extraordinary."
              </p>
              <div className="text-xs font-serif font-bold text-[#F5F2EB] pt-3 border-t border-[#222222]">
                Devika Singhania <span className="text-stone-400 font-normal font-sans">• Mumbai, MH</span>
              </div>
            </div>

            <div className="p-7 bg-[#121212] border border-[#222222] rounded-2xl space-y-4 shadow-xl">
              <div className="flex text-[#C5A880] space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#C5A880] stroke-[#C5A880]" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                "The 22 Momme silk slip dress is liquid poetry. Flawless French seams, zero synthetic cling, and arrived in archival packaging within 48 hours."
              </p>
              <div className="text-xs font-serif font-bold text-[#F5F2EB] pt-3 border-t border-[#222222]">
                Priyanka Sen <span className="text-stone-400 font-normal font-sans">• New Delhi</span>
              </div>
            </div>

            <div className="p-7 bg-[#121212] border border-[#222222] rounded-2xl space-y-4 shadow-xl">
              <div className="flex text-[#C5A880] space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#C5A880] stroke-[#C5A880]" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                "The Goodyear welted Chelsea boots and the Tuscan leather tote are pure heirloom tier. The 14-day doorstep size exchange was effortless."
              </p>
              <div className="text-xs font-serif font-bold text-[#F5F2EB] pt-3 border-t border-[#222222]">
                Arjun K. Varma <span className="text-stone-400 font-normal font-sans">• Bengaluru, KA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
