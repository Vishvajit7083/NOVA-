import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Heart,
  Eye,
  Layers,
  BookmarkCheck,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { FashionCanvasItem } from '../../types';

interface FashionCanvasDrawerProps {
  onNavigate: (view: string, params?: any) => void;
}

export const FashionCanvasDrawer: React.FC<FashionCanvasDrawerProps> = ({ onNavigate }) => {
  const {
    fashionCanvas,
    isCanvasOpen,
    setIsCanvasOpen,
    removeFromCanvas,
    reorderCanvas,
    clearCanvas,
    moveCanvasToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useShop();

  const [savedLookName, setSavedLookName] = useState('');
  const [isSavingLook, setIsSavingLook] = useState(false);
  const [savedLooks, setSavedLooks] = useState<{ id: string; name: string; date: string; count: number }[]>(() => {
    try {
      const saved = localStorage.getItem('aurelia_saved_curations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (!isCanvasOpen) return null;

  const totalLookValue = fashionCanvas.reduce((sum, item) => sum + item.product.price, 0);

  const handleSaveLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedLookName.trim()) return;
    const newLook = {
      id: `look-${Date.now()}`,
      name: savedLookName.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      count: fashionCanvas.length,
    };
    const updated = [newLook, ...savedLooks];
    setSavedLooks(updated);
    try {
      localStorage.setItem('sindhura_saved_curations', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setSavedLookName('');
    setIsSavingLook(false);
    showToast('Look Archived', `"${newLook.name}" saved to your styling lookbook.`, 'success');
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderCanvas(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fashionCanvas.length - 1) {
      reorderCanvas(index, index + 1);
    }
  };

  const getSlotLabel = (slot?: FashionCanvasItem['categorySlot']) => {
    switch (slot) {
      case 'outerwear':
        return 'Tailored Outerwear';
      case 'top':
        return 'Shirt & Knitwear';
      case 'bottom':
        return 'Trousers & Denim';
      case 'footwear':
        return 'Atelier Footwear';
      case 'accessory':
        return 'Leather & Accessories';
      default:
        return 'Editorial Piece';
    }
  };

  return (
    <div id="fashion-canvas-drawer-root" className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCanvasOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="w-full sm:w-screen max-w-lg bg-[#0E0E0E] text-[#F5F2EB] border-l border-[#242424] shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#222222] bg-[#121212]/90 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#181818] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-serif font-bold tracking-wide text-[#F5F2EB]">
                    Fashion Canvas
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#1F1F1F] text-[#C5A880] border border-[#C5A880]/20">
                    {fashionCanvas.length} {fashionCanvas.length === 1 ? 'PIECE' : 'PIECES'}
                  </span>
                </div>
                <p className="text-[11px] text-[#A0988A] tracking-wider uppercase">
                  Personal Digital Wardrobe & Curated Look
                </p>
              </div>
            </div>

            <button
              id="close-fashion-canvas-btn"
              onClick={() => setIsCanvasOpen(false)}
              className="p-2 rounded-full bg-[#1A1A1A] hover:bg-[#252525] text-[#A0988A] hover:text-white border border-[#2E2E2E] transition-colors cursor-pointer"
              aria-label="Close Canvas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Look Valuation Bar */}
          {fashionCanvas.length > 0 && (
            <div className="px-6 py-3 bg-[#161616] border-b border-[#222222] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-[#A0988A]">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-[11px] uppercase tracking-wider">Ensemble Valuation</span>
              </div>
              <div className="text-sm font-serif font-bold text-[#C5A880]">
                ₹{totalLookValue.toLocaleString('en-IN')}
              </div>
            </div>
          )}

          {/* Canvas Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#0E0E0E]">
            {fashionCanvas.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-16 px-4">
                <div className="w-18 h-18 rounded-2xl bg-[#161616] border border-[#2A2A2A] flex items-center justify-center text-[#C5A880]">
                  <Layers className="w-8 h-8 opacity-70" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="text-lg font-serif font-bold text-[#F5F2EB]">Your Canvas is Unwritten</h4>
                  <p className="text-xs text-[#999285] leading-relaxed font-normal">
                    Collect tailoring, fluid silk dresses, Tuscan leather bags, and handcrafted boots as you explore.
                    Compose complete looks and order the entire ensemble seamlessly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-3 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsCanvasOpen(false);
                      onNavigate('shop');
                    }}
                    className="w-full py-2.5 px-4 bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Explore Atelier
                  </button>
                  <button
                    onClick={() => {
                      setIsCanvasOpen(false);
                      onNavigate('home');
                      setTimeout(() => {
                        const el = document.getElementById('explore-textures-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full py-2.5 px-4 bg-[#181818] hover:bg-[#222222] text-[#F5F2EB] border border-[#2E2E2E] text-xs font-medium uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Filter by Fabric
                  </button>
                </div>

                {/* Previously Saved Curations */}
                {savedLooks.length > 0 && (
                  <div className="w-full pt-6 border-t border-[#1F1F1F] text-left">
                    <p className="text-[11px] uppercase tracking-widest text-[#A0988A] mb-2 font-mono">
                      Archived Styling Looks
                    </p>
                    <div className="space-y-1.5">
                      {savedLooks.map((look) => (
                        <div
                          key={look.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#141414] border border-[#222222] text-xs"
                        >
                          <span className="font-serif font-semibold text-[#F5F2EB]">{look.name}</span>
                          <span className="text-[10px] text-[#A0988A]">
                            {look.count} items • {look.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3.5">
                {fashionCanvas.map((item, index) => {
                  const inWish = isInWishlist(item.product.id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 rounded-xl bg-[#141414] border border-[#242424] hover:border-[#383838] transition-all flex gap-3.5 group relative"
                    >
                      {/* Left: Product Thumbnail with Slot Label */}
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] shrink-0">
                        <img
                          src={item.selectedColor?.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-1 left-1">
                          <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/80 text-[#C5A880] uppercase tracking-tighter">
                            #{index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-widest font-mono text-[#A0988A]">
                              {getSlotLabel(item.categorySlot)}
                            </span>
                            <span className="text-xs font-serif font-bold text-[#C5A880]">
                              ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <h4
                            onClick={() => {
                              setIsCanvasOpen(false);
                              onNavigate('product', { id: item.product.id });
                            }}
                            className="text-xs font-serif font-semibold text-[#F5F2EB] truncate hover:text-[#C5A880] cursor-pointer transition-colors mt-0.5"
                          >
                            {item.product.name}
                          </h4>

                          <p className="text-[10px] text-[#8C867B] truncate mt-0.5">
                            {item.product.fabric || item.product.material || item.product.category}
                          </p>
                        </div>

                        {/* Badges & Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F]">
                          <div className="flex items-center space-x-1.5 text-[10px]">
                            {item.selectedSize && (
                              <span className="px-1.5 py-0.5 rounded bg-[#1C1C1C] border border-[#2E2E2E] text-[#D8D2C5]">
                                {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#1C1C1C] border border-[#2E2E2E] text-[#D8D2C5]">
                                <span
                                  className="w-2 h-2 rounded-full inline-block border border-white/20"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span className="truncate max-w-[60px]">{item.selectedColor.name}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1">
                            {/* Reorder buttons */}
                            <button
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="p-1 rounded text-[#888] hover:text-[#F5F2EB] disabled:opacity-20 cursor-pointer"
                              title="Move layer up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(index)}
                              disabled={index === fashionCanvas.length - 1}
                              className="p-1 rounded text-[#888] hover:text-[#F5F2EB] disabled:opacity-20 cursor-pointer"
                              title="Move layer down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Wishlist toggle */}
                            <button
                              onClick={() => toggleWishlist(item.product)}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                inWish ? 'text-red-400' : 'text-[#888] hover:text-[#F5F2EB]'
                              }`}
                              title={inWish ? 'Saved in Wishlist' : 'Add to Wishlist'}
                            >
                              <Heart className="w-3.5 h-3.5" fill={inWish ? 'currentColor' : 'none'} />
                            </button>

                            {/* View detail */}
                            <button
                              onClick={() => {
                                setIsCanvasOpen(false);
                                onNavigate('product', { id: item.product.id });
                              }}
                              className="p-1 rounded text-[#888] hover:text-[#F5F2EB] transition-colors cursor-pointer"
                              title="View Atelier Specs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Remove */}
                            <button
                              onClick={() => removeFromCanvas(item.id)}
                              className="p-1 rounded text-[#888] hover:text-red-400 transition-colors cursor-pointer"
                              title="Remove from Canvas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Save Look Expandable Form */}
                <div className="pt-2">
                  {!isSavingLook ? (
                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        onClick={() => setIsSavingLook(true)}
                        className="inline-flex items-center space-x-1.5 text-[11px] text-[#C5A880] hover:text-[#E8D4A8] cursor-pointer transition-colors font-medium"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>Archive Look in Styling Book</span>
                      </button>
                      <button
                        onClick={clearCanvas}
                        className="text-[11px] text-[#888] hover:text-red-400 cursor-pointer transition-colors"
                      >
                        Reset Canvas
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveLook} className="p-3 rounded-xl bg-[#161616] border border-[#2E2E2E] space-y-2">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-[#A0988A]">
                        Name this Ensembled Look
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={savedLookName}
                          onChange={(e) => setSavedLookName(e.target.value)}
                          placeholder="e.g. Milan Evening Tailoring"
                          className="flex-1 bg-[#0E0E0E] border border-[#2E2E2E] focus:border-[#C5A880] rounded-lg px-3 py-1.5 text-xs text-[#F5F2EB] outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSavingLook(false)}
                          className="px-2 py-1.5 bg-[#1F1F1F] text-[#888] hover:text-[#F5F2EB] text-xs rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {fashionCanvas.length > 0 && (
            <div className="p-6 border-t border-[#222222] bg-[#121212]/95 backdrop-blur-md space-y-3">
              <button
                id="add-entire-look-to-cart-btn"
                onClick={moveCanvasToCart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-[#C5A880]/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Entire Look to Shopping Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#888] pt-1">
                <span>Free white-glove doorstep delivery included</span>
                <button
                  onClick={() => {
                    setIsCanvasOpen(false);
                    onNavigate('shop');
                  }}
                  className="hover:text-[#C5A880] transition-colors underline cursor-pointer"
                >
                  Continue exploring
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
