import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryCarousel } from '../components/home/CategoryCarousel';
import { FlashOffersSection } from '../components/home/FlashOffersSection';
import { AccessoriesFinder } from '../components/home/AccessoriesFinder';
import { TechInnovationSection } from '../components/home/TechInnovationSection';
import { ProductCard } from '../components/product/ProductCard';
import { PRODUCTS } from '../data/products';
import { ArrowRight, Star, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filterCategories = [
    { id: 'all', label: 'All Flagships' },
    { id: 'chargers-power', label: 'GaN Power' },
    { id: 'cases-protection', label: 'Aramid Cases' },
    { id: 'audio', label: 'Spatial Audio' },
    { id: 'cables-connectors', label: 'Ultra Cables' },
  ];

  const filteredProducts =
    activeTab === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <div id="home-page" className="min-h-screen bg-white text-black">
      {/* 1. Cinematic Hero Flagship Showcase */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Curated Categories Carousel */}
      <CategoryCarousel onNavigate={onNavigate} />

      {/* 3. Featured Flagship Products Section with Filter Tabs */}
      <section id="featured-products-section" className="py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 pb-4 border-b border-gray-100 gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#EB0028] uppercase">
              Precision Hardware
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight mt-1">
              Flagship Accessories
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {filterCategories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-gray-400'
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

        {/* View full store CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onNavigate('store')}
            className="px-8 py-4 rounded-full bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:scale-105 inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Explore Complete {PRODUCTS.length}+ Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Interactive 3-Step Device Matcher Engine */}
      <AccessoriesFinder onNavigate={onNavigate} />

      {/* 5. Live Flash Offers & Bundles */}
      <FlashOffersSection onNavigate={onNavigate} />

      {/* 6. Deep Tech & Materials Innovation Section */}
      <TechInnovationSection onNavigate={onNavigate} />

      {/* 7. Community & Verified Reviews Banner */}
      <section className="py-20 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Over 150,000+ Flagship Enthusiasts Powered Across India</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
            Built for Power Users Who Demand Perfection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
            <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-sm">
              <div className="flex text-amber-500 space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                "The 120W GaN Station charges my laptop, OnePlus 12, and earbuds at maximum peak speed simultaneously. Pure industrial art."
              </p>
              <div className="text-xs font-bold text-black pt-2 border-t border-gray-100">
                Vikramaditya S. <span className="text-gray-400 font-normal">• Verified Tech Creator</span>
              </div>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-sm">
              <div className="flex text-amber-500 space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                "The 1500D Aramid case feels incredible in hand. Precise cutouts, zero bulk, and the subtle weave texture gives solid grip."
              </p>
              <div className="text-xs font-bold text-black pt-2 border-t border-gray-100">
                Rohan Deshmukh <span className="text-gray-400 font-normal">• Pune, MH</span>
              </div>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-sm">
              <div className="flex text-amber-500 space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                "Super fast next-day delivery to Bengaluru. NovaCare 2-year replacement gives me absolute peace of mind."
              </p>
              <div className="text-xs font-bold text-black pt-2 border-t border-gray-100">
                Ananya Roy <span className="text-gray-400 font-normal">• Bengaluru, KA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
