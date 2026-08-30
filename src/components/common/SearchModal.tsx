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
    '120W GaN Charger',
    'Aramid Fiber Case',
    'AirPulse ANC Earbuds',
    '240W Type-C Cable',
    'MagSafe Power Bank',
    'Cockpit Car Mount',
    'Thunderbolt Hub',
  ];

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults([]);
    }
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
              placeholder="Search accessories, GaN chargers, cables, cases, device model..."
              className="w-full bg-transparent text-zinc-900 text-sm sm:text-base placeholder-zinc-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-zinc-400 hover:text-zinc-700 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-mono rounded border border-zinc-200"
            >
              ESC
            </button>
          </div>

          {/* Body content */}
          <div className="overflow-y-auto p-4 space-y-6 flex-1 no-scrollbar bg-[#FAFAFA]">
            {/* If Query is empty, show Recent & Popular Searches */}
            {!query && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[11px] text-zinc-500 hover:text-[#EB0028] transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectKeyword(s)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 hover:text-zinc-950 transition-colors flex items-center space-x-1.5 shadow-sm"
                        >
                          <span>{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Keywords */}
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#EB0028]" />
                    <span>Trending Now</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularKeywords.map((keyword, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectKeyword(keyword)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 hover:border-[#EB0028]/40 border border-zinc-200 text-xs text-zinc-700 hover:text-[#EB0028] transition-all flex items-center space-x-1.5 group shadow-sm"
                      >
                        <Zap className="w-3 h-3 text-[#EB0028] group-hover:scale-110 transition-transform" />
                        <span>{keyword}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Curated Recommendations */}
                <div>
                  <div className="text-xs font-semibold text-zinc-600 mb-3">
                    Featured Flagship Gear
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRODUCTS.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer transition-all flex items-center space-x-3 group shadow-sm"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-contain rounded-lg bg-[#F8F9FA] p-1 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-[#EB0028] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-semibold">
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
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 mb-3">
                  <span>Found {results.length} results for "{query}"</span>
                  {results.length > 0 && (
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        onNavigate('store', { searchQuery: query });
                      }}
                      className="text-[#EB0028] hover:underline flex items-center font-bold"
                    >
                      View in Store <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  )}
                </div>

                {results.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900">No accessories found</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      We couldn't find matching items for "{query}". Try searching for GaN charger, aramid, cable, or earbuds.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-3 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-[#EB0028]/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-14 h-14 object-contain rounded-lg bg-[#F8F9FA] p-1.5 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                                {product.category}
                              </span>
                              {product.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-[#EB0028]">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-[#EB0028] transition-colors truncate mt-1">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                              {product.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-3">
                          <div className="text-xs sm:text-sm font-extrabold text-zinc-950">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-[10px] text-zinc-400 line-through">
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
          <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Press <strong className="text-zinc-800">ESC</strong> to close</span>
            <span>⚡ Next-Day Dispatch on all orders</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
