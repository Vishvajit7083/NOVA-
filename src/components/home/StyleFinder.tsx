import React, { useState, useMemo } from 'react';
import { Sparkles, Check, RotateCcw, ArrowRight, Filter, Shirt, Scissors, Briefcase, Wine, Flame, Coffee, Layers, Sun } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { GENDER_OPTIONS, OCCASIONS, STYLE_AESTHETICS, CLOTHING_TYPES, FITS, BUDGET_TIERS } from '../../data/styleOptions';

interface StyleFinderProps {
  onNavigate: (view: string, params?: any) => void;
}

export const StyleFinder: React.FC<StyleFinderProps> = ({ onNavigate }) => {
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  const getOccasionIcon = (name: string) => {
    switch (name) {
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'Wine': return <Wine className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Sun': return <Sun className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleReset = () => {
    setSelectedGender('all');
    setSelectedOccasion('all');
    setSelectedAesthetic('all');
    setSelectedCategory('all');
    setSelectedFit('all');
    setSelectedBudget('all');
  };

  // Filter products based on selected criteria
  const matchingProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Gender filter
      if (selectedGender !== 'all') {
        if (p.gender && p.gender !== selectedGender && p.gender !== 'unisex') {
          return false;
        }
      }

      // Occasion filter
      if (selectedOccasion !== 'all') {
        const occasionMap: Record<string, string[]> = {
          business: ['Formal', 'Business', 'Cocktail'],
          evening: ['Formal', 'Cocktail', 'Evening'],
          streetwear: ['Streetwear', 'Casual'],
          casual: ['Casual', 'Weekend'],
          outerwear: ['Outerwear', 'Winter', 'Cold Weather'],
          resort: ['Resort', 'Summer', 'Vacation', 'Accessories']
        };
        const validOccasions = occasionMap[selectedOccasion] || [];
        if (p.occasion && !validOccasions.some(o => p.occasion?.toLowerCase().includes(o.toLowerCase()))) {
          // If product category or tag matches occasion
          const matchesTag = p.tags?.some(t => validOccasions.some(o => t.toLowerCase().includes(o.toLowerCase())));
          if (!matchesTag) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const catMap: Record<string, string[]> = {
          shirts: ['men-clothing', 'women-clothing'],
          trousers: ['men-clothing', 'women-clothing'],
          dresses: ['women-clothing'],
          outerwear: ['outerwear-jackets'],
          footwear: ['footwear-shoes'],
          bags: ['leather-bags'],
          accessories: ['fine-jewellery', 'accessories-eyewear']
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
      if (selectedBudget === 'under-4k' && p.price > 4000) return false;
      if (selectedBudget === '4k-8k' && (p.price < 4000 || p.price > 8000)) return false;
      if (selectedBudget === 'luxury' && p.price < 8000) return false;

      return true;
    });
  }, [selectedGender, selectedOccasion, selectedCategory, selectedFit, selectedBudget]);

  return (
    <section id="style-finder-section" className="py-20 bg-[#F7F4EE] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/80 border border-[#E0D8C8] px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
            <span className="text-[#9A7B38] text-[10px] font-bold uppercase tracking-[0.25em]">
              Bespoke Styling Suite
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-tight">
            Find Your Signature Style & Capsule
          </h2>
          
          <p className="text-stone-600 text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed">
            Filter our ready-to-wear atelier by department, occasion, architectural fit, and budget tier for flawlessly coordinated ensembles.
          </p>
        </div>

        {/* Style Controls Card */}
        <div className="bg-white border border-[#E5DFD5] rounded-2xl p-6 sm:p-8 mb-10 shadow-sm space-y-8">
          
          {/* Row 1: Department & Occasion */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-[#EFECE6]">
            
            {/* Department */}
            <div className="lg:col-span-4 space-y-3">
              <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-widest">
                1. Department
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-between cursor-pointer ${
                      selectedGender === g.id
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E8E2D9] text-stone-700 hover:border-stone-400 hover:bg-white'
                    }`}
                  >
                    <span>{g.label}</span>
                    {selectedGender === g.id && <Check className="w-3.5 h-3.5 text-[#9A7B38]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-widest">
                  2. Occasion & Dress Code
                </label>
                {selectedOccasion !== 'all' && (
                  <button 
                    onClick={() => setSelectedOccasion('all')}
                    className="text-[10px] uppercase font-bold text-[#9A7B38] hover:underline"
                  >
                    Clear Occasion
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(selectedOccasion === occ.id ? 'all' : occ.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 cursor-pointer ${
                      selectedOccasion === occ.id
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E8E2D9] text-stone-700 hover:border-stone-400 hover:bg-white'
                    }`}
                  >
                    <span className={`mt-0.5 ${selectedOccasion === occ.id ? 'text-[#9A7B38]' : 'text-stone-400'}`}>
                      {getOccasionIcon(occ.iconName)}
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight line-clamp-1">{occ.name}</p>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold ${selectedOccasion === occ.id ? 'text-stone-300' : 'text-stone-400'}`}>
                        {occ.tag}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Category, Fit, and Budget Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-widest">
                3. Garment Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-4 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#9A7B38]"
              >
                {CLOTHING_TYPES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fit Preference */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-widest">
                4. Silhouette / Fit
              </label>
              <select
                value={selectedFit}
                onChange={(e) => setSelectedFit(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-4 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#9A7B38]"
              >
                {FITS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Tier */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-widest">
                5. Price Tier
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-4 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#9A7B38]"
              >
                {BUDGET_TIERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Capsule Status Bar */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-white border border-[#E0D8C8] text-[#9A7B38]">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-500 font-medium">Curated Results:</span>{' '}
                <strong className="text-stone-900 font-bold">
                  {matchingProducts.length} Atelier {matchingProducts.length === 1 ? 'Piece' : 'Pieces'} Found
                </strong>
                <span className="text-stone-400 ml-2 hidden sm:inline">
                  • 100% Genuine Sustainable Fibers
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-stone-500 hover:text-stone-900 font-bold uppercase text-[10px] tracking-widest flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>

        </div>

        {/* Results Product Grid */}
        {matchingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchingProducts.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#E8E2D9] rounded-2xl p-8 space-y-4">
            <p className="text-base font-serif text-stone-800">No items match your exact combination of criteria.</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try resetting the occasion, silhouette or budget tier to explore our full ready-to-wear runway catalog.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#9A7B38] transition-colors"
            >
              Show All Atelier Items
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export const AccessoriesFinder = StyleFinder;
