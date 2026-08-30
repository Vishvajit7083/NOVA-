import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Zap, Shield, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ColorOption, ProductVariant } from '../../types';

interface QuickViewModalProps {
  onNavigate: (view: string, params?: any) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const { quickViewProduct, closeQuickView, addToCart } = useShop();

  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Sync defaults whenever quickViewProduct changes
  React.useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]);
      setSelectedVariant(quickViewProduct.variants ? quickViewProduct.variants[0] : undefined);
      setSelectedImageIdx(0);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : quickViewProduct.price;
  const currentOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice || quickViewProduct.originalPrice
    : quickViewProduct.originalPrice;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedColor, selectedVariant, 1);
    closeQuickView();
  };

  const handleFullDetails = () => {
    closeQuickView();
    onNavigate('product-detail', { productId: quickViewProduct.id });
  };

  return (
    <AnimatePresence>
      <div id="quickview-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-3xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 border border-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery preview */}
          <div className="w-full md:w-1/2 p-6 bg-[#F8F9FA] flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-zinc-200">
            <div className="w-full h-64 sm:h-72 relative flex items-center justify-center rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm">
              <img
                src={quickViewProduct.images[selectedImageIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain p-4"
              />
              {quickViewProduct.badge && (
                <div className="absolute top-3 left-3 bg-[#EB0028] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  {quickViewProduct.badge}
                </div>
              )}
            </div>

            {/* Thumbnail dots */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center space-x-2 mt-4">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                      selectedImageIdx === idx
                        ? 'border-[#EB0028] scale-105 shadow-sm'
                        : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-5 no-scrollbar bg-white">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#EB0028]">
                  {quickViewProduct.category.replace('-', ' & ')}
                </span>
                <span className="text-zinc-300">•</span>
                <div className="flex items-center space-x-1 text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-zinc-900">{quickViewProduct.rating}</span>
                  <span className="text-zinc-500">({quickViewProduct.reviewCount})</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-zinc-950 mt-1.5 leading-snug">
                {quickViewProduct.name}
              </h2>
              <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                {quickViewProduct.tagline}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline space-x-3 mt-3">
                <span className="text-2xl font-extrabold text-zinc-950 font-display">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <>
                    <span className="text-sm text-zinc-400 line-through">
                      ₹{currentOriginalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {quickViewProduct.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Color Swatches */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-zinc-700 mb-2">
                  Color: <span className="text-zinc-950 font-bold">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {quickViewProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all relative ${
                        selectedColor?.name === color.name
                          ? 'border-white ring-2 ring-[#EB0028] scale-110 shadow-sm'
                          : 'border-zinc-300 opacity-80 hover:opacity-100'
                      }`}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variants Selector (if any) */}
              {quickViewProduct.variants && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-zinc-700 mb-2">Options:</div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {quickViewProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-xl text-left border text-xs font-medium flex items-center justify-between transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-red-50 border-[#EB0028] text-[#EB0028]'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className="font-bold">₹{v.price.toLocaleString('en-IN')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-zinc-200">
              <button
                id="quickview-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full py-3 bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag • ₹{currentPrice.toLocaleString('en-IN')}</span>
              </button>

              <button
                onClick={handleFullDetails}
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 hover:text-zinc-950 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>View Full Tech Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
