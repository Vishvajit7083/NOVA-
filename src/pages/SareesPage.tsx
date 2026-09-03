import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Search,
  Filter,
  Check,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Scissors,
  Layers,
  Star,
} from 'lucide-react';
import { PRODUCTS, SAREE_COLLECTIONS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';

interface SareesPageProps {
  initialCollection?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const SareesPage: React.FC<SareesPageProps> = ({
  initialCollection = 'all',
  onNavigate,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [showDrapeGuideModal, setShowDrapeGuideModal] = useState<boolean>(false);

  // All saree products
  const sareeProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === 'sarees');
  }, []);

  // Unique fabrics in sarees
  const fabrics = useMemo(() => {
    const list = new Set<string>();
    sareeProducts.forEach((p) => {
      if (p.fabric) {
        if (p.fabric.toLowerCase().includes('silk')) list.add('Pure Silk');
        if (p.fabric.toLowerCase().includes('cotton')) list.add('Handloom Cotton');
        if (p.fabric.toLowerCase().includes('linen')) list.add('Pure Linen');
        if (p.fabric.toLowerCase().includes('organza')) list.add('Silk Organza');
        if (p.fabric.toLowerCase().includes('tussar')) list.add('Wild Tussar');
      }
    });
    return Array.from(list);
  }, [sareeProducts]);

  // Filtered sarees
  const filteredSarees = useMemo(() => {
    return sareeProducts.filter((product) => {
      // Collection Filter
      if (selectedCollection !== 'all') {
        const matchesCollection =
          product.collection === selectedCollection ||
          product.subCategory === selectedCollection ||
          product.collectionType === selectedCollection ||
          (selectedCollection === 'Paithani Collection' && (product.sareeType === 'Paithani' || product.name.includes('Paithani'))) ||
          (selectedCollection === 'Traditional Sarees' && (product.subCategory === 'Traditional Sarees' || product.sareeType === 'Traditional Maharashtrian')) ||
          (selectedCollection === 'Maharashtrian Sarees' && (product.category === 'sarees' || product.sareeType === 'Nauvari')) ||
          (selectedCollection === 'Silk Sarees' && product.fabric?.toLowerCase().includes('silk')) ||
          (selectedCollection === 'Cotton Sarees' && product.fabric?.toLowerCase().includes('cotton')) ||
          (selectedCollection === 'Wedding Sarees' && (product.occasion === 'Wedding' || product.collection === 'Wedding Sarees')) ||
          (selectedCollection === 'Festive Sarees' && (product.occasion === 'Festive' || product.collection === 'Festive Sarees')) ||
          (selectedCollection === 'Daily Wear Sarees' && (product.occasion === 'Daily Wear' || product.collection === 'Daily Wear Sarees')) ||
          (selectedCollection === 'Designer Sarees' && (product.subCategory === 'Designer Sarees' || product.sareeType === 'Designer' || product.sareeType === 'Linen')) ||
          (selectedCollection === 'Printed Sarees' && (product.subCategory === 'Printed Sarees' || product.sareeType === 'Printed')) ||
          (selectedCollection === 'Konkan Edit' && (product.collection === 'Konkan Edit' || product.originRegion?.includes('Sindhudurg')));

        if (!matchesCollection) return false;
      }

      // Fabric Filter
      if (selectedFabric !== 'all') {
        if (selectedFabric === 'Pure Silk' && !product.fabric?.toLowerCase().includes('silk')) return false;
        if (selectedFabric === 'Handloom Cotton' && !product.fabric?.toLowerCase().includes('cotton')) return false;
        if (selectedFabric === 'Pure Linen' && !product.fabric?.toLowerCase().includes('linen')) return false;
        if (selectedFabric === 'Silk Organza' && !product.fabric?.toLowerCase().includes('organza')) return false;
        if (selectedFabric === 'Wild Tussar' && !product.fabric?.toLowerCase().includes('tussar')) return false;
      }

      // Price Filter
      if (product.price > priceRange) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.tagline?.toLowerCase().includes(q) ||
          product.sareeType?.toLowerCase().includes(q) ||
          product.weaveType?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
      return 0;
    });
  }, [sareeProducts, selectedCollection, selectedFabric, priceRange, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCollection('all');
    setSelectedFabric('all');
    setSearchQuery('');
    setPriceRange(30000);
    setSortBy('featured');
  };

  return (
    <div id="sarees-heritage-page" className="min-h-screen bg-[#0E0D0C] text-[#F5F2EB] py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hero Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C5A880]/30 bg-gradient-to-r from-[#141210] via-[#1A1815] to-[#141210] p-8 sm:p-12 shadow-2xl">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#C5A880] text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SINDHUDURG GARMENTS • SAREE ATELIER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F5F2EB] tracking-tight leading-tight">
              Authentic Maharashtrian & Konkan Sarees
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              From pure Paithani gold zari heirlooms and royal 9-yard Nauvari drapes to breathable Malvani handloom cotton and breezy coastal tussar silks. Handcrafted by master weavers with Silk Mark authenticity.
            </p>

            {/* Quick Guarantees / Action Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#C5A880]">
              <div className="flex items-center space-x-1.5 bg-black/40 border border-[#C5A880]/30 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>100% Tested Gold Zari & Silk Mark</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/40 border border-[#C5A880]/30 px-3 py-1.5 rounded-xl">
                <Scissors className="w-4 h-4 text-[#C5A880]" />
                <span>Complimentary 0.8m Blouse Piece</span>
              </div>
              <button
                onClick={() => setShowDrapeGuideModal(true)}
                className="flex items-center space-x-1.5 bg-[#C5A880]/20 hover:bg-[#C5A880]/30 border border-[#C5A880]/60 px-3 py-1.5 rounded-xl text-white font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#C5A880]" />
                <span>View Nauvari & 6-Yard Drape Guide</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collection Filter Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C5A880] flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Curated Saree Collections ({sareeProducts.length} Heirloom Pieces)</span>
            </span>

            {(selectedCollection !== 'all' || selectedFabric !== 'all' || searchQuery || priceRange < 30000) && (
              <button
                onClick={resetFilters}
                className="text-xs text-stone-400 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {SAREE_COLLECTIONS.map((col) => {
              const isActive = selectedCollection === col.id || (col.id === 'all' && selectedCollection === 'all');
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#C5A880] text-black border-[#C5A880] shadow-[0_0_15px_rgba(197,168,128,0.3)]'
                      : 'bg-[#181614] text-stone-300 border-[#2A2622] hover:border-[#C5A880]/60 hover:text-white'
                  }`}
                >
                  {col.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="bg-[#141210] border border-[#24201C] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Paithani, Nauvari, Zari, Silk..."
              className="w-full bg-[#1C1A17] border border-[#2F2B26] rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#C5A880]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick Fabric Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Fabric:</span>
            </span>
            <button
              onClick={() => setSelectedFabric('all')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                selectedFabric === 'all'
                  ? 'bg-[#C5A880]/20 text-[#C5A880] border-[#C5A880]/50'
                  : 'bg-[#1C1A17] text-stone-400 border-[#2F2B26] hover:text-stone-200'
              }`}
            >
              All
            </button>
            {fabrics.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFabric(f)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                  selectedFabric === f
                    ? 'bg-[#C5A880]/20 text-[#C5A880] border-[#C5A880]/50'
                    : 'bg-[#1C1A17] text-stone-400 border-[#2F2B26] hover:text-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1C1A17] border border-[#2F2B26] rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A880] cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredSarees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredSarees.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#141210] border border-[#24201C] rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1C1A17] flex items-center justify-center mx-auto text-[#C5A880]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">No Sarees Found</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              We couldn't find any sarees matching your selected filters. Try clearing your filters or search keywords.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#C5A880] text-black font-semibold text-xs rounded-xl hover:bg-[#D4B890] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Drape Guide Modal */}
        {showDrapeGuideModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#161412] border border-[#C5A880]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#2A2622] pb-4">
                <div className="flex items-center space-x-2 text-[#C5A880]">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="text-lg font-serif font-bold text-white">Maharashtrian Saree Draping Guide</h3>
                </div>
                <button
                  onClick={() => setShowDrapeGuideModal(false)}
                  className="w-8 h-8 rounded-full bg-[#24201C] flex items-center justify-center text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
                <div className="p-4 bg-[#1F1C18] rounded-2xl border border-[#3A332B] space-y-2">
                  <h4 className="font-bold text-[#C5A880] text-sm">1. Nauvari (9-Yard Kashta Style)</h4>
                  <p>
                    The iconic royal warrior drape of Maharashtra. Knot at center front, bring the left pallu section between legs to tuck securely in back center (Kashta pleats), forming trouser-like freedom with breathtaking majesty.
                  </p>
                </div>

                <div className="p-4 bg-[#1F1C18] rounded-2xl border border-[#3A332B] space-y-2">
                  <h4 className="font-bold text-[#C5A880] text-sm">2. Classic 6-Yard Royal Nivi with Broad Pallu</h4>
                  <p>
                    Tuck around waist, create 6–7 neat pleats facing left, drape over left shoulder allowing the rich peacock or gold zari pallu to cascade gracefully down the arm.
                  </p>
                </div>

                <div className="p-4 bg-[#1F1C18] rounded-2xl border border-[#3A332B] space-y-2">
                  <h4 className="font-bold text-[#C5A880] text-sm">3. Karvati Kinara & Temple Border Styling</h4>
                  <p>
                    Ensure the distinctive saw-tooth woven edge is crisp and parallel along the bottom hem. Style with heirloom Kolhapuri Saaj gold necklaces and fresh mogra gajra flowers.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowDrapeGuideModal(false)}
                  className="px-6 py-2 bg-[#C5A880] text-black font-bold text-xs rounded-xl hover:bg-[#D4B890] transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
