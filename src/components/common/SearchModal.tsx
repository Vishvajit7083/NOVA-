import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, TrendingUp, Clock, ArrowRight, Zap, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types';

interface SearchModalProps {
  onNavigate: (view: string, params?: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate }) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    addToCart,
  } = useShop();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularKeywords = [
    'Silk Evening Gown',
    'Double-Breasted Wool Coat',
    'Cashmere Knitwear',
    'Tuscan Leather Tote',
    'Bespoke Tailored Blazer',
    '925 Silver Cuff',
    'Pleated Runway Skirt',
  ];

  // Focus input on open & lock body scroll
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Global keydown for Cmd+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Filter products on query change
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    const filtered = PRODUCTS.filter((product) => {
      const matchName = product.name.toLowerCase().includes(q);
      const matchTagline = product.tagline.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchCompat = product.compatibility.some((c) => c.toLowerCase().includes(q));
      const matchFeatures = product.features.some((f) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
      return matchName || matchTagline || matchCat || matchCompat || matchFeatures;
    });

    setResults(filtered);
  }, [query]);

  const handleSelectKeyword = (keyword: string) => {
    setQuery(keyword);
    addRecentSearch(keyword);
  };

  const handleSelectProduct = (product: Product) => {
    addRecentSearch(product.name);
    setIsSearchOpen(false);
    onNavigate('product-detail', { productId: product.id });
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div id="search-modal-overlay" className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Top Search Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 relative bg-white">
            <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search evening gowns, cashmere coats, artisanal leather, tailoring..."
              className="w-full bg-transparent text-stone-900 text-sm sm:text-base placeholder-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-stone-400 hover:text-stone-700 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-mono rounded border border-stone-200"
            >
              ESC
            </button>
          </div>

          {/* Body content */}
          <div className="overflow-y-auto p-4 space-y-6 flex-1 no-scrollbar bg-[#FAF8F5]">
            {/* If Query is empty, show Recent & Popular Searches */}
            {!query && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[11px] text-stone-500 hover:text-[#9A7B38] transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectKeyword(s)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-xs text-stone-700 hover:text-stone-950 transition-colors flex items-center space-x-1.5 shadow-xs"
                        >
                          <span>{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Keywords */}
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-600 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Trending Silhouettes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularKeywords.map((keyword, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectKeyword(keyword)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50/50 hover:border-[#9A7B38]/40 border border-stone-200 text-xs text-stone-700 hover:text-[#9A7B38] transition-all flex items-center space-x-1.5 group shadow-xs"
                      >
                        <Zap className="w-3 h-3 text-[#9A7B38] group-hover:scale-110 transition-transform" />
                        <span>{keyword}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Curated Recommendations */}
                <div>
                  <div className="text-xs font-semibold text-stone-600 mb-3">
                    Featured Haute Pieces
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRODUCTS.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl cursor-pointer transition-all flex items-center space-x-3 group shadow-xs"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-16 object-cover object-top rounded-lg bg-[#FAF8F5] p-0.5 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-serif font-bold text-stone-900 truncate group-hover:text-[#9A7B38] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5 font-serif font-semibold">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* If Query has input */}
            {query && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-3">
                  <span>Found {results.length} results for "{query}"</span>
                  {results.length > 0 && (
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        onNavigate('store', { searchQuery: query });
                      }}
                      className="text-[#9A7B38] hover:underline flex items-center font-bold"
                    >
                      View in Salon <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  )}
                </div>

                {results.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-serif font-bold text-stone-900">No couture garments found</h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      We couldn't find matching creations for "{query}". Try searching for evening gown, cashmere, blazer, or leather.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-3 bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#9A7B38]/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-xs"
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-16 object-cover object-top rounded-lg bg-[#FAF8F5] p-0.5 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                                {product.category}
                              </span>
                              {product.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-[#9A7B38]">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900 group-hover:text-[#9A7B38] transition-colors truncate mt-1">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {product.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-3">
                          <div className="text-xs sm:text-sm font-bold text-stone-950 font-serif">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-[10px] text-stone-400 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer of modal */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Press <strong className="text-stone-800">ESC</strong> to close</span>
            <span>✦ Complimentary White-Glove Courier & Atelier Fitting</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
