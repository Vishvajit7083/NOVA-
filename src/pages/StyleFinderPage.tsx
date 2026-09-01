import React, { useState, useMemo } from 'react';
import { Sparkles, Check, RotateCcw, ArrowRight, Filter, Briefcase, Wine, Flame, Coffee, Layers, Sun } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import { GENDER_OPTIONS, OCCASIONS, CLOTHING_TYPES, FITS } from '../data/styleOptions';
import { Product } from '../types';

interface StyleFinderPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const StyleFinderPage: React.FC<StyleFinderPageProps> = ({ onNavigate }) => {
  const { products } = useShop();
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');

  const handleReset = () => {
    setSelectedGender('all');
    setSelectedOccasion('all');
    setSelectedCategory('all');
    setSelectedFit('all');
    setSelectedBudget('all');
    setSelectedColor('all');
  };

  // Color options extracted dynamically or standard luxury tones
  const colorOptions = [
    { id: 'all', label: 'All Colors' },
    { id: 'black', label: 'Noir Black' },
    { id: 'white', label: 'Ivory / White' },
    { id: 'navy', label: 'Midnight Navy' },
    { id: 'camel', label: 'Camel / Beige' },
    { id: 'gold', label: 'Champagne / Gold' },
  ];

  // Budget options
  const budgetTiers = [
    { id: 'all', label: 'All Price Tiers' },
    { id: 'under-5k', label: 'Under ₹5,000' },
    { id: '5k-10k', label: '₹5,000 - ₹10,000' },
    { id: '10k-20k', label: '₹10,000 - ₹20,000' },
    { id: 'above-20k', label: 'Above ₹20,000' },
  ];

  // Filter matching products
  const matchingProducts = useMemo(() => {
    return products.filter((p) => {
      // Gender filter
      if (selectedGender !== 'all') {
        if (p.gender && p.gender !== selectedGender && p.gender !== 'unisex') {
          return false;
        }
      }

      // Occasion filter
      if (selectedOccasion !== 'all') {
        const occasionMap: Record<string, string[]> = {
          business: ['Formal', 'Business', 'Cocktail', 'Office'],
          evening: ['Formal', 'Cocktail', 'Evening', 'Gala'],
          streetwear: ['Streetwear', 'Casual', 'Urban'],
          casual: ['Casual', 'Weekend', 'Resort'],
          outerwear: ['Outerwear', 'Winter', 'Cold Weather'],
          resort: ['Resort', 'Summer', 'Vacation', 'Accessories'],
        };
        const validOccasions = occasionMap[selectedOccasion] || [];
        const matchOccasion = p.occasion && validOccasions.some((o) => p.occasion?.toLowerCase().includes(o.toLowerCase()));
        const matchTag = p.tags?.some((t) => validOccasions.some((o) => t.toLowerCase().includes(o.toLowerCase())));
        if (!matchOccasion && !matchTag) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const catMap: Record<string, string[]> = {
          shirts: ['men-apparel', 'women-apparel'],
          trousers: ['men-apparel', 'women-apparel'],
          dresses: ['women-apparel'],
          outerwear: ['outerwear-jackets'],
          footwear: ['footwear'],
          bags: ['bags-leather'],
          accessories: ['jewellery-accessories', 'watches-timepieces'],
        };
        const allowedCats = catMap[selectedCategory] || [];
        if (!allowedCats.includes(p.category) && !p.category.includes(selectedCategory)) {
          return false;
        }
      }

      // Fit filter
      if (selectedFit !== 'all') {
        if (p.fit && p.fit !== selectedFit) {
          return false;
        }
      }

      // Budget filter
      if (selectedBudget === 'under-5k' && p.price > 5000) return false;
      if (selectedBudget === '5k-10k' && (p.price < 5000 || p.price > 10000)) return false;
      if (selectedBudget === '10k-20k' && (p.price < 10000 || p.price > 20000)) return false;
      if (selectedBudget === 'above-20k' && p.price < 20000) return false;

      // Color filter
      if (selectedColor !== 'all') {
        const matchColor = p.colors.some((c) => c.name.toLowerCase().includes(selectedColor) || c.colorCode.toLowerCase().includes(selectedColor));
        if (!matchColor) return false;
      }

      return true;
    });
  }, [products, selectedGender, selectedOccasion, selectedCategory, selectedFit, selectedBudget, selectedColor]);

  // Broader recommendation fallback if no exact matches
  const alternativeProducts = useMemo(() => {
    if (matchingProducts.length > 0) return [];
    return products.slice(0, 4);
  }, [products, matchingProducts.length]);

  return (
    <div id="style-finder-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Interactive Curation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] tracking-tight">
            Style & Capsule Finder
          </h1>

          <div className="w-12 h-0.5 bg-[#9A7B38] mx-auto mt-2" />

          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-normal leading-relaxed">
            Select your desired occasion, department, silhouette fit, color preference, and price range to discover curated atelier ensembles.
          </p>
        </div>

        {/* Filter Selection Panel */}
        <div className="bg-white border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8]">
            <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-stone-900 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#9A7B38]" />
              <span>Capsule Filter Parameters</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-stone-500 hover:text-[#9A7B38] flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Selections</span>
            </button>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* 1. Department */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-800 uppercase tracking-widest block">
                1. Department
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#9A7B38]"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Occasion */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-800 uppercase tracking-widest block">
                2. Occasion
              </label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#9A7B38]"
              >
                <option value="all">All Occasions</option>
                {OCCASIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name || o.tag}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Category */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-800 uppercase tracking-widest block">
                3. Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#9A7B38]"
              >
                <option value="all">All Categories</option>
                {CLOTHING_TYPES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Fit */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-800 uppercase tracking-widest block">
                4. Fit & Cut
              </label>
              <select
                value={selectedFit}
                onChange={(e) => setSelectedFit(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#9A7B38]"
              >
                <option value="all">All Fits</option>
                {FITS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Budget */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-800 uppercase tracking-widest block">
                5. Budget Range
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#9A7B38]"
              >
                {budgetTiers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Color */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-stone-800 uppercase tracking-widest block">
                6. Palette
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#9A7B38]"
              >
                {colorOptions.map((co) => (
                  <option key={co.id} value={co.id}>
                    {co.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0D8C8]">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold">
              Matching Atelier Pieces ({matchingProducts.length})
            </h2>
          </div>

          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {matchingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white border border-[#E8E2D9] rounded-3xl text-center space-y-4 shadow-xs">
              <Sparkles className="w-10 h-10 text-[#9A7B38] mx-auto opacity-60" />
              <h3 className="text-xl font-serif font-bold text-stone-900">No exact matches found</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No garments matched all specific filters simultaneously. Try widening your price tier or occasion selection, or explore these signature atelier recommendations:
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Clear Filters
              </button>

              {/* Broader Alternatives */}
              <div className="pt-8 space-y-4 text-left">
                <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-stone-800 border-b border-[#EAE4D8] pb-2">
                  Featured Atelier Alternatives
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {alternativeProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
