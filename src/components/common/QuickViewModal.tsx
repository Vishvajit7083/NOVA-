import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Check, ShoppingBag, ArrowRight, Sparkles, Scissors, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ColorOption, ProductVariant } from '../../types';

interface QuickViewModalProps {
  onNavigate: (view: string, params?: any) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const { quickViewProduct, closeQuickView, addToCart } = useShop();

  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Sync defaults whenever quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]);
      setSelectedVariant(quickViewProduct.variants ? quickViewProduct.variants[0] : undefined);
      setSelectedSize(quickViewProduct.sizes?.[0] || 'M');
      setSelectedImageIdx(0);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : quickViewProduct.price;
  const currentOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice || quickViewProduct.originalPrice
    : quickViewProduct.originalPrice;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedColor, selectedVariant, 1, selectedSize);
    closeQuickView();
  };

  const handleFullDetails = () => {
    closeQuickView();
    onNavigate('product-detail', { productId: quickViewProduct.id });
  };

  const availableSizes = quickViewProduct.sizes || ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <AnimatePresence>
      <div id="quickview-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl bg-white border border-[#E8E2D9] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-[#FAF8F5] text-stone-700 hover:text-stone-950 border border-[#E0D8C8] transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery preview */}
          <div className="w-full md:w-1/2 p-6 bg-[#FAF8F5] flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#EAE4D8]">
            <div className="w-full h-60 sm:h-96 relative flex items-center justify-center rounded-2xl overflow-hidden bg-white border border-[#E8E2D9] shadow-xs">
              <img
                src={quickViewProduct.images[selectedImageIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-top"
              />
              {quickViewProduct.badge && (
                <div className="absolute top-3 left-3 bg-[#111111] text-[#D8C7A5] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs border border-[#9A7B38]/30">
                  {quickViewProduct.badge}
                </div>
              )}
            </div>

            {/* Thumbnail dots */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center space-x-2 mt-4 overflow-x-auto no-scrollbar py-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-12 h-16 rounded-xl overflow-hidden border-2 transition-all bg-white shrink-0 ${
                      selectedImageIdx === idx
                        ? 'border-[#9A7B38] scale-105 shadow-xs'
                        : 'border-[#E0D8C8] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-5 no-scrollbar bg-white">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#9A7B38]">
                  {quickViewProduct.category.replace('-', ' & ')}
                </span>
                <span className="text-stone-300">•</span>
                <div className="flex items-center space-x-1 text-[#9A7B38] text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#9A7B38] text-[#9A7B38]" />
                  <span className="font-bold text-stone-900">{quickViewProduct.rating}</span>
                  <span className="text-stone-500 font-normal">({quickViewProduct.reviewCount} client reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif text-stone-900 mt-2 leading-tight">
                {quickViewProduct.name}
              </h2>
              
              <p className="text-xs text-stone-600 mt-1 line-clamp-2 font-normal">
                {quickViewProduct.tagline}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline space-x-3 mt-4">
                <span className="text-2xl font-serif font-bold text-stone-900">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <>
                    <span className="text-sm text-stone-400 line-through">
                      ₹{currentOriginalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {quickViewProduct.discountPercent}% PRIVILEGE SAVINGS
                    </span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-stone-700">
                    Select Size: <strong className="text-stone-950 font-bold">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleFullDetails}
                    className="text-[11px] text-[#9A7B38] hover:underline font-semibold flex items-center space-x-1"
                  >
                    <Scissors className="w-3 h-3" />
                    <span>Bespoke Fitting Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-9 px-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                          : 'bg-[#FAF8F5] text-stone-700 border-[#E0D8C8] hover:border-stone-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="mt-5">
                <div className="text-xs font-semibold text-stone-700 mb-2">
                  Colorway: <span className="text-stone-950 font-bold">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {quickViewProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all relative cursor-pointer ${
                        selectedColor?.name === color.name
                          ? 'border-white ring-2 ring-[#9A7B38] scale-110 shadow-xs'
                          : 'border-stone-300 opacity-80 hover:opacity-100'
                      }`}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Specs Snapshot */}
              {quickViewProduct.specs && quickViewProduct.specs.length > 0 && (
                <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8] text-[11px] text-stone-600 space-y-1">
                  <div className="flex items-center space-x-1.5 font-serif font-bold text-stone-900">
                    <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>Fabric Composition & Craft</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-stone-500 pt-0.5">
                    {quickViewProduct.specs.slice(0, 2).map((s, i) => (
                      <div key={i}>
                        <span className="text-stone-400">{s.label}: </span>
                        <span className="font-medium text-stone-800">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-[#EAE4D8]">
              <button
                id="quickview-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest rounded-full shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag ({selectedSize}) • ₹{currentPrice.toLocaleString('en-IN')}</span>
              </button>

              <button
                onClick={handleFullDetails}
                className="w-full py-3 bg-[#FAF8F5] hover:bg-stone-200 border border-[#E0D8C8] text-stone-900 font-semibold text-xs rounded-full flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Editorial Lookbook & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-1 text-[10px] text-stone-400 flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-3 h-3 text-[#9A7B38]" />
                <span>14-Day Complimentary Doorstep Fitting & Size Exchange</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
