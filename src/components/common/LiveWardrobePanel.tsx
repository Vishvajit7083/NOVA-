import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Heart,
  History,
  X,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface LiveWardrobePanelProps {
  onNavigate: (view: string, params?: any) => void;
}

export const LiveWardrobePanel: React.FC<LiveWardrobePanelProps> = ({ onNavigate }) => {
  const {
    fashionCanvas,
    setIsCanvasOpen,
    wishlist,
    recentlyViewed,
    isWardrobeOpen,
    setIsWardrobeOpen,
    addToCart,
    addToCanvas,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'canvas' | 'wishlist' | 'recent'>('canvas');

  const totalItemsCount = fashionCanvas.length + wishlist.length + recentlyViewed.length;
  if (totalItemsCount === 0) return null;

  return (
    <>
      {/* Subtle Floating Trigger Pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          id="live-wardrobe-trigger-btn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsWardrobeOpen(!isWardrobeOpen)}
          className="flex items-center space-x-2.5 px-3.5 py-2 rounded-full bg-[#141414]/90 hover:bg-[#1C1C1C] border border-[#2E2E2E] hover:border-[#C5A880]/50 shadow-xl backdrop-blur-md text-[#F5F2EB] transition-all cursor-pointer group"
          aria-label="Toggle Live Wardrobe"
        >
          <div className="relative flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#C5A880] group-hover:rotate-12 transition-transform duration-300" />
            {fashionCanvas.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
            )}
          </div>
          <span className="text-xs font-serif font-medium tracking-wide">Live Wardrobe</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#222222] text-[#C5A880] border border-[#333333]">
            {fashionCanvas.length + wishlist.length}
          </span>
        </motion.button>
      </div>

      {/* Slide-Up / Slide-Out Panel */}
      <AnimatePresence>
        {isWardrobeOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-3 sm:left-6 z-40 w-96 max-w-[calc(100vw-1.5rem)] bg-[#121212]/95 backdrop-blur-xl border border-[#282828] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#222222] flex items-center justify-between bg-[#161616]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-xs font-serif font-bold text-[#F5F2EB] tracking-wide">
                  Active Session Wardrobe
                </span>
              </div>
              <button
                onClick={() => setIsWardrobeOpen(false)}
                className="p-1 rounded-full text-[#888] hover:text-white hover:bg-[#222222] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tabs */}
            <div className="grid grid-cols-3 p-1.5 bg-[#0E0E0E] border-b border-[#222222] gap-1 text-[11px] font-medium">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                  activeTab === 'canvas'
                    ? 'bg-[#1F1F1F] text-[#C5A880] shadow-sm font-semibold'
                    : 'text-[#888] hover:text-[#D4AF37]'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Canvas ({fashionCanvas.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                  activeTab === 'wishlist'
                    ? 'bg-[#1F1F1F] text-[#C5A880] shadow-sm font-semibold'
                    : 'text-[#888] hover:text-[#D4AF37]'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span>Saved ({wishlist.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('recent')}
                className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                  activeTab === 'recent'
                    ? 'bg-[#1F1F1F] text-[#C5A880] shadow-sm font-semibold'
                    : 'text-[#888] hover:text-[#D4AF37]'
                }`}
              >
                <History className="w-3 h-3" />
                <span>Recent ({recentlyViewed.length})</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-3 overflow-y-auto max-h-72 space-y-2 no-scrollbar bg-[#121212]">
              {activeTab === 'canvas' && (
                <>
                  {fashionCanvas.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#888] space-y-2">
                      <p>Your Fashion Canvas is currently empty.</p>
                      <button
                        onClick={() => {
                          setIsWardrobeOpen(false);
                          setIsCanvasOpen(true);
                        }}
                        className="text-[#C5A880] hover:underline cursor-pointer"
                      >
                        Open Full Canvas Editor
                      </button>
                    </div>
                  ) : (
                    fashionCanvas.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#181818] border border-[#242424] hover:border-[#333] transition-colors"
                      >
                        <div
                          onClick={() => {
                            setIsWardrobeOpen(false);
                            onNavigate('product', { id: item.product.id });
                          }}
                          className="flex items-center space-x-2.5 cursor-pointer min-w-0"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-12 object-cover rounded-md bg-[#222]"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-serif font-semibold text-[#F5F2EB] truncate">
                              {item.product.name}
                            </h5>
                            <span className="text-[10px] text-[#C5A880] font-mono">
                              ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item.product, item.selectedColor, undefined, 1, item.selectedSize)}
                          className="p-1.5 rounded-lg bg-[#222222] hover:bg-[#C5A880] text-[#D8D2C5] hover:text-black transition-colors cursor-pointer"
                          title="Add to Shopping Bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'wishlist' && (
                <>
                  {wishlist.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#888]">
                      No items saved in your wishlist yet.
                    </div>
                  ) : (
                    wishlist.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#181818] border border-[#242424]"
                      >
                        <div
                          onClick={() => {
                            setIsWardrobeOpen(false);
                            onNavigate('product', { id: item.product.id });
                          }}
                          className="flex items-center space-x-2.5 cursor-pointer min-w-0"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-12 object-cover rounded-md bg-[#222]"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-serif font-semibold text-[#F5F2EB] truncate">
                              {item.product.name}
                            </h5>
                            <span className="text-[10px] text-[#C5A880] font-mono">
                              ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => addToCanvas(item.product)}
                            className="p-1.5 rounded-lg bg-[#222] hover:bg-[#C5A880] text-[#D8D2C5] hover:text-black transition-colors cursor-pointer"
                            title="Collect to Canvas"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => addToCart(item.product)}
                            className="p-1.5 rounded-lg bg-[#222] hover:bg-[#C5A880] text-[#D8D2C5] hover:text-black transition-colors cursor-pointer"
                            title="Add to Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'recent' && (
                <>
                  {recentlyViewed.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#888]">
                      Browse the collections to see your viewing history here.
                    </div>
                  ) : (
                    recentlyViewed.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#181818] border border-[#242424]"
                      >
                        <div
                          onClick={() => {
                            setIsWardrobeOpen(false);
                            onNavigate('product', { id: prod.id });
                          }}
                          className="flex items-center space-x-2.5 cursor-pointer min-w-0"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-12 object-cover rounded-md bg-[#222]"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-serif font-semibold text-[#F5F2EB] truncate">
                              {prod.name}
                            </h5>
                            <span className="text-[10px] text-[#C5A880] font-mono">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCanvas(prod)}
                          className="p-1.5 rounded-lg bg-[#222] hover:bg-[#C5A880] text-[#D8D2C5] hover:text-black transition-colors cursor-pointer"
                          title="Collect to Canvas"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-3 border-t border-[#222222] bg-[#141414] flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setIsWardrobeOpen(false);
                  setIsCanvasOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 text-[#C5A880] hover:text-[#E8D4A8] font-medium transition-colors cursor-pointer"
              >
                <span>Open Fashion Canvas</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsWardrobeOpen(false);
                  onNavigate('wishlist');
                }}
                className="text-[#888] hover:text-white transition-colors cursor-pointer"
              >
                View Wishlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
