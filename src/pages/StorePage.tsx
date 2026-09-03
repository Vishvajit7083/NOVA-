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
  Sparkles,
  Scissors,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/product/ProductCard';

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
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
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

  const fabricsList = [
    'Pure Mulberry Silk',
    'Handloom Cotton',
    'European Flax Linen',
    '240 GSM Combed Cotton',
    'Wild Tussar Silk',
    'Pure Silk Organza',
    'Malvani Khadi',
  ];

  const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '39', '40', '41', '42', '43', '44'];

  const fitsList = ['Tailored Slim', 'Relaxed Drape', 'Architectural Oversized', 'Classic Regular', 'Bias Cut'];

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((m) => m !== fabric) : [...prev, fabric]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleFit = (fit: string) => {
    setSelectedFits((prev) =>
      prev.includes(fit) ? prev.filter((f) => f !== fit) : [...prev, fit]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setMaxPrice(35000);
    setSelectedFabrics([]);
    setSelectedSizes([]);
    setSelectedFits([]);
    setOnlyInStock(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    searchQuery.trim() !== '' ||
    maxPrice < 35000 ||
    selectedFabrics.length > 0 ||
    selectedSizes.length > 0 ||
    selectedFits.length > 0 ||
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
        const matchTag = product.tagline?.toLowerCase().includes(q) || false;
        const matchFabric = (product.fabric || '').toLowerCase().includes(q);
        const materialsStr = Array.isArray(product.materials) ? product.materials.join(' ') : (product.materials || '');
        const matchMaterials = materialsStr.toLowerCase().includes(q);
        const matchFit = (product.fit || '').toLowerCase().includes(q);
        if (!matchName && !matchTag && !matchFabric && !matchMaterials && !matchFit) return false;
      }

      // Price filter
      if (product.price > maxPrice) return false;

      // In Stock filter
      if (onlyInStock && !product.inStock) return false;

      // Fabric filter
      if (selectedFabrics.length > 0) {
        const matStr = Array.isArray(product.materials) ? product.materials.join(' ') : (product.materials || '');
        const prodFabric = (product.fabric || matStr).toLowerCase();
        const matchesAnyFabric = selectedFabrics.some((f) =>
          prodFabric.includes(f.toLowerCase())
        );
        if (!matchesAnyFabric) return false;
      }

      // Size filter
      if (selectedSizes.length > 0 && product.sizes) {
        const matchesAnySize = selectedSizes.some((s) => product.sizes?.includes(s));
        if (!matchesAnySize) return false;
      }

      // Fit filter
      if (selectedFits.length > 0 && product.fit) {
        const matchesAnyFit = selectedFits.some((f) =>
          product.fit?.toLowerCase().includes(f.toLowerCase())
        );
        if (!matchesAnyFit) return false;
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
    selectedFabrics,
    selectedSizes,
    selectedFits,
    sortBy,
  ]);

  return (
    <div id="store-catalog-page" className="min-h-screen bg-[#0A0A0A] text-[#F5F2EB] py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Page Header */}
        <div className="pb-8 mb-8 border-b border-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-[0.25em]">
                Atelier Catalog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F2EB] tracking-tight mt-1.5">
              Ready-To-Wear & Accessories
            </h1>
            <p className="text-xs text-[#A0988A] mt-1.5">
              Curated collection of <strong className="text-[#F5F2EB]">{filteredProducts.length}</strong> mastercrafted garments and handcrafted accessories
            </p>
          </div>

          {/* Quick Search bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-[#736E65] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garments, silk, virgin wool, leather..."
              className="w-full bg-[#141414] border border-[#262626] rounded-full pl-10 pr-8 py-2.5 text-xs text-[#F5F2EB] placeholder-[#736E65] focus:outline-none focus:border-[#C5A880] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736E65] hover:text-[#F5F2EB] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
          <div className="flex items-center space-x-2">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-[#141414] border border-[#2B2B2B] text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#C5A880]" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            {/* Clear Filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3.5 py-2 rounded-full bg-[#161616] hover:bg-[#202020] border border-[#2B2B2B] text-xs font-semibold uppercase tracking-wider text-[#A0988A] hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Grid column toggles on desktop */}
            <div className="hidden md:flex items-center space-x-1 bg-[#141414] p-1 rounded-full border border-[#262626]">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  gridCols === 3 ? 'bg-[#C5A880] text-black shadow-xs' : 'text-[#736E65] hover:text-[#F5F2EB]'
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  gridCols === 4 ? 'bg-[#C5A880] text-black shadow-xs' : 'text-[#736E65] hover:text-[#F5F2EB]'
                }`}
                title="4 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-[#736E65] font-semibold uppercase tracking-wider text-[10px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#141414] border border-[#262626] text-[#F5F2EB] text-xs font-semibold uppercase tracking-wider rounded-full px-4 py-2 focus:outline-none focus:border-[#C5A880] cursor-pointer shadow-xs"
              >
                <option value="featured" className="bg-[#141414] text-[#F5F2EB]">Editorial Picks</option>
                <option value="price-low" className="bg-[#141414] text-[#F5F2EB]">Price: Low to High</option>
                <option value="price-high" className="bg-[#141414] text-[#F5F2EB]">Price: High to Low</option>
                <option value="rating" className="bg-[#141414] text-[#F5F2EB]">Top Client Rated</option>
                <option value="discount" className="bg-[#141414] text-[#F5F2EB]">Special Atelier Offer</option>
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
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#161616] border border-[#2B2B2B] text-[#F5F2EB] text-xs font-semibold uppercase tracking-wider"
                >
                  <span>Category: {catObj?.shortName || c}</span>
                  <button onClick={() => toggleCategory(c)} className="cursor-pointer">
                    <X className="w-3 h-3 text-[#C5A880]" />
                  </button>
                </span>
              );
            })}
            {selectedFabrics.map((m) => (
              <span
                key={m}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#161616] border border-[#2B2B2B] text-[#F5F2EB] text-xs font-semibold uppercase tracking-wider"
              >
                <span>Fabric: {m}</span>
                <button onClick={() => toggleFabric(m)} className="cursor-pointer">
                  <X className="w-3 h-3 text-[#C5A880]" />
                </button>
              </span>
            ))}
            {selectedSizes.map((s) => (
              <span
                key={s}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#161616] border border-[#2B2B2B] text-[#F5F2EB] text-xs font-semibold uppercase tracking-wider"
              >
                <span>Size: {s}</span>
                <button onClick={() => toggleSize(s)} className="cursor-pointer">
                  <X className="w-3 h-3 text-[#C5A880]" />
                </button>
              </span>
            ))}
            {maxPrice < 35000 && (
              <span
                key="price"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#161616] border border-[#2B2B2B] text-[#F5F2EB] text-xs font-semibold uppercase tracking-wider"
              >
                <span>Under ₹{maxPrice.toLocaleString('en-IN')}</span>
                <button onClick={() => setMaxPrice(35000)} className="cursor-pointer">
                  <X className="w-3 h-3 text-[#C5A880]" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Main Body: Desktop Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-[#121212] border border-[#222222] rounded-2xl p-6 h-fit sticky top-24 shadow-md">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold tracking-wider text-[#F5F2EB]">
                <SlidersHorizontal className="w-4 h-4 text-[#C5A880]" />
                <span>Atelier Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold text-[#C5A880] hover:underline cursor-pointer uppercase tracking-wider"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter Group */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-serif font-bold text-[#F5F2EB] uppercase tracking-widest">
                Department
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedCategories.includes(cat.id)
                        ? 'bg-[#C5A880] text-black font-bold'
                        : 'hover:bg-[#1A1A1A] text-[#A0988A] hover:text-[#F5F2EB]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-60">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="space-y-2 pt-4 border-t border-[#262626]">
              <label className="block text-[11px] font-serif font-bold text-[#F5F2EB] uppercase tracking-widest">
                Size Filter
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sizesList.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedSizes.includes(s)
                        ? 'bg-[#C5A880] text-black border-[#C5A880]'
                        : 'bg-[#181818] border-[#2B2B2B] text-[#A0988A] hover:text-[#F5F2EB] hover:border-[#3D3D3D]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric / Materials Filter */}
            <div className="space-y-2 pt-4 border-t border-[#262626]">
              <label className="block text-[11px] font-serif font-bold text-[#F5F2EB] uppercase tracking-widest">
                Heritage Fabrics
              </label>
              <div className="space-y-1">
                {fabricsList.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleFabric(m)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedFabrics.includes(m)
                        ? 'text-[#C5A880] font-bold bg-[#1C1C1C] border border-[#333333]'
                        : 'text-[#A0988A] hover:bg-[#1A1A1A] hover:text-[#F5F2EB]'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedFabrics.includes(m) && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3 pt-4 border-t border-[#262626]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-[#F5F2EB] uppercase tracking-widest text-[11px]">Max Budget</span>
                <span className="font-mono font-bold text-[#C5A880]">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="999"
                max="35000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C5A880] bg-[#222222] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#736E65] font-mono">
                <span>₹999</span>
                <span>₹35,000</span>
              </div>
            </div>

            {/* In Stock toggle */}
            <div className="pt-4 border-t border-[#262626]">
              <label className="flex items-center justify-between cursor-pointer group text-xs">
                <span className="text-[#A0988A] group-hover:text-[#F5F2EB] font-semibold uppercase tracking-wider text-[11px]">In Stock Garments</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-[#333333] text-[#C5A880] focus:ring-0 cursor-pointer bg-[#181818]"
                />
              </label>
            </div>
          </aside>

          {/* Product Grid Section */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#121212] border border-[#222222] rounded-2xl p-16 text-center space-y-4 shadow-md">
                <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2B2B2B] flex items-center justify-center mx-auto text-[#736E65]">
                  <Search className="w-8 h-8 text-[#C5A880]" />
                </div>
                <h3 className="text-xl font-serif text-[#F5F2EB] tracking-tight">No garments match your filters</h3>
                <p className="text-xs text-[#A0988A] max-w-sm mx-auto font-normal">
                  Try adjusting your selected sizes, fabrics, or price ceiling to view our full atelier collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-7 py-3 rounded-full bg-[#C5A880] hover:bg-[#D4AF37] text-black font-medium text-xs uppercase tracking-widest shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridCols === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
                } gap-3.5 sm:gap-6`}
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
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-[#141414] border-l border-[#2B2B2B] p-6 h-full overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                <div className="text-sm font-serif font-bold text-[#F5F2EB] uppercase tracking-wider">
                  Filter Garments
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-[#736E65] hover:text-[#F5F2EB] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="text-xs font-serif font-bold text-[#F5F2EB] uppercase tracking-widest">Departments</div>
                <div className="space-y-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCategory(c.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer ${
                        selectedCategories.includes(c.id)
                          ? 'bg-[#C5A880] text-black font-bold'
                          : 'bg-[#181818] text-[#A0988A] hover:bg-[#202020]'
                      }`}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div className="space-y-2">
                <div className="text-xs font-serif font-bold text-[#F5F2EB] uppercase tracking-widest">
                  Max Budget: ₹{maxPrice.toLocaleString('en-IN')}
                </div>
                <input
                  type="range"
                  min="999"
                  max="35000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C5A880]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#262626] space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3.5 bg-[#C5A880] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest rounded-full shadow-md cursor-pointer"
              >
                Apply Filters ({filteredProducts.length} Pieces)
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-3 bg-[#181818] text-[#A0988A] font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-[#222222] cursor-pointer"
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
