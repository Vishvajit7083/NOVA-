import React, { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Grid3X3,
  Grid2X2,
  ChevronDown,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/product/ProductCard';
import { Product } from '../types';

interface StorePageProps {
  initialCategory?: string;
  initialSearch?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  initialCategory,
  initialSearch = '',
  onNavigate,
}) => {
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    initialCategory ? [initialCategory] : []
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedWattages, setSelectedWattages] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  // Sync if props change
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const materialsList = [
    'Aramid Fiber',
    'Anodized Aluminum',
    'GaN Semiconductor',
    'Braided Kevlar',
    'Titanium Alloy',
    'Liquid Silicone',
    'Tempered 9H Glass',
  ];

  const wattageList = ['30W', '65W', '100W', '120W', '240W'];

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const toggleWattage = (w: string) => {
    setSelectedWattages((prev) =>
      prev.includes(w) ? prev.filter((item) => item !== w) : [...prev, w]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setMaxPrice(10000);
    setSelectedMaterials([]);
    setSelectedWattages([]);
    setOnlyInStock(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    searchQuery.trim() !== '' ||
    maxPrice < 10000 ||
    selectedMaterials.length > 0 ||
    selectedWattages.length > 0 ||
    onlyInStock;

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchTag = product.tagline.toLowerCase().includes(q);
        const matchCompat = product.compatibility.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchTag && !matchCompat) return false;
      }

      // Price filter
      if (product.price > maxPrice) return false;

      // In Stock filter
      if (onlyInStock && !product.inStock) return false;

      // Material filter
      if (selectedMaterials.length > 0) {
        const materialSpec = product.specifications
          .find((g) => g.group.toLowerCase().includes('materials') || g.group.toLowerCase().includes('build'))
          ?.items.map((i) => i.value.toLowerCase())
          .join(' ');
        const matchesAnyMat = selectedMaterials.some(
          (m) =>
            materialSpec?.includes(m.toLowerCase()) ||
            product.description.toLowerCase().includes(m.toLowerCase())
        );
        if (!matchesAnyMat) return false;
      }

      // Wattage filter
      if (selectedWattages.length > 0) {
        const matchesWatt = selectedWattages.some(
          (w) =>
            product.name.includes(w) ||
            product.tagline.includes(w) ||
            product.description.includes(w)
        );
        if (!matchesWatt) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return 0; // featured default
    });
  }, [
    selectedCategories,
    searchQuery,
    maxPrice,
    onlyInStock,
    selectedMaterials,
    selectedWattages,
    sortBy,
  ]);

  return (
    <div id="store-catalog-page" className="min-h-screen bg-white text-black py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="pb-8 mb-8 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold text-[#EB0028] uppercase tracking-[0.25em]">
              Precision Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight mt-1">
              All Accessories
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Showing <strong>{filteredProducts.length}</strong> precision-engineered hardware pieces
            </p>
          </div>

          {/* Quick Search bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, spec, device..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-8 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Top Controls Bar: Mobile Filter Button, Active Pills, Layout Toggles & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
          <div className="flex items-center space-x-2">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#EB0028]" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            {/* Clear Filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Grid column toggles on desktop */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-full border border-gray-200">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  gridCols === 3 ? 'bg-white text-black shadow-xs' : 'text-gray-400 hover:text-black'
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  gridCols === 4 ? 'bg-white text-black shadow-xs' : 'text-gray-400 hover:text-black'
                }`}
                title="4 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 text-black text-xs font-bold uppercase tracking-wider rounded-full px-4 py-2 focus:outline-none focus:border-black cursor-pointer shadow-xs"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pb-6">
            {selectedCategories.map((c) => {
              const catObj = CATEGORIES.find((item) => item.id === c);
              return (
                <span
                  key={c}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-black text-xs font-bold uppercase tracking-wider"
                >
                  <span>Category: {catObj?.shortName || c}</span>
                  <button onClick={() => toggleCategory(c)} className="cursor-pointer">
                    <X className="w-3 h-3 text-[#EB0028]" />
                  </button>
                </span>
              );
            })}
            {selectedMaterials.map((m) => (
              <span
                key={m}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-black text-xs font-bold uppercase tracking-wider"
              >
                <span>Material: {m}</span>
                <button onClick={() => toggleMaterial(m)} className="cursor-pointer">
                  <X className="w-3 h-3 text-[#EB0028]" />
                </button>
              </span>
            ))}
            {selectedWattages.map((w) => (
              <span
                key={w}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-black text-xs font-bold uppercase tracking-wider"
              >
                <span>Wattage: {w}</span>
                <button onClick={() => toggleWattage(w)} className="cursor-pointer">
                  <X className="w-3 h-3 text-[#EB0028]" />
                </button>
              </span>
            ))}
            {maxPrice < 10000 && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-black text-xs font-bold uppercase tracking-wider">
                <span>Under ₹{maxPrice.toLocaleString('en-IN')}</span>
                <button onClick={() => setMaxPrice(10000)} className="cursor-pointer">
                  <X className="w-3 h-3 text-[#EB0028]" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Main Body: Desktop Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-gray-50 border border-gray-200 rounded-2xl p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-black">
                <SlidersHorizontal className="w-4 h-4 text-[#EB0028]" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-[#EB0028] hover:underline cursor-pointer uppercase tracking-wider"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter Group */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-black text-black uppercase tracking-widest">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedCategories.includes(cat.id)
                        ? 'bg-black text-white font-bold'
                        : 'hover:bg-white text-gray-600 hover:text-black'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono opacity-60">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-black uppercase tracking-widest text-[11px]">Max Price</span>
                <span className="font-extrabold text-black font-mono">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="499"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#EB0028] bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>₹499</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Wattage Filter */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <label className="block text-[11px] font-black text-black uppercase tracking-widest">
                Power Wattage
              </label>
              <div className="flex flex-wrap gap-1.5">
                {wattageList.map((w) => (
                  <button
                    key={w}
                    onClick={() => toggleWattage(w)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedWattages.includes(w)
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-gray-200 text-gray-600 hover:text-black hover:border-gray-400'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Materials Filter */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <label className="block text-[11px] font-black text-black uppercase tracking-widest">
                Aerospace Material
              </label>
              <div className="space-y-1">
                {materialsList.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleMaterial(m)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedMaterials.includes(m)
                        ? 'text-black font-bold bg-white shadow-xs border border-gray-200'
                        : 'text-gray-600 hover:bg-white hover:text-black'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedMaterials.includes(m) && <Check className="w-3.5 h-3.5 text-[#EB0028]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock toggle */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center justify-between cursor-pointer group text-xs">
                <span className="text-gray-600 group-hover:text-black font-bold uppercase tracking-wider text-[11px]">In Stock Items Only</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-gray-300 text-[#EB0028] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Product Grid Section */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400 shadow-sm">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black uppercase text-black tracking-tight">No accessories match your filter</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto font-normal">
                  Try widening your price range or resetting selected categories to view our full lineup.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 rounded-full bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridCols === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
                } gap-6`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-white border-l border-gray-200 p-6 h-full overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="text-sm font-black text-black uppercase tracking-wider">
                  Filter Products
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-gray-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="text-xs font-black text-black uppercase tracking-widest">Categories</div>
                <div className="space-y-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCategory(c.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer ${
                        selectedCategories.includes(c.id)
                          ? 'bg-black text-white font-bold'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div className="space-y-2">
                <div className="text-xs font-black text-black uppercase tracking-widest">
                  Max Price: ₹{maxPrice.toLocaleString('en-IN')}
                </div>
                <input
                  type="range"
                  min="499"
                  max="10000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#EB0028]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3.5 bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-md cursor-pointer"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-3 bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gray-200 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
