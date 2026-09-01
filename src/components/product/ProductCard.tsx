import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product, ColorOption } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: string, params?: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    toggleComparison,
    isInComparison,
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Default', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInComparison(product.id);

  const hasSecondaryImage = product.images && product.images.length > 1;
  const primaryImg = product.images && product.images[0] ? product.images[0] : '';
  const secondaryImg = hasSecondaryImage ? product.images[1] : primaryImg;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigating if clicking buttons or size selectors
    if ((e.target as HTMLElement).closest('button')) return;
    onNavigate('product-detail', { productId: product.id });
  };

  const handleQuickAdd = (e: React.MouseEvent, chosenSize?: string) => {
    e.stopPropagation();
    const sizeToUse = chosenSize || selectedSize || (product.sizes ? product.sizes[0] : undefined);
    addToCart(
      product,
      selectedColor,
      product.variants ? product.variants[0] : undefined,
      1,
      sizeToUse
    );
    setIsAddedAnim(true);
    setShowQuickSizes(false);
    setTimeout(() => setIsAddedAnim(false), 1400);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
      className="group relative bg-white border border-[#EAE6DF] hover:border-[#9A7B38]/60 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      {/* Top Floating Badges & Action Toolbar */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Badges */}
        <div className="flex flex-col gap-1 items-start pointer-events-auto">
          {product.badge && (
            <span className="px-3 py-1 rounded-full bg-[#111111]/90 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.18em] uppercase shadow-sm border border-stone-800">
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#9A7B38] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Right Action Icons (Wishlist & Comparison) */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleComparison(product);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xs cursor-pointer ${
              inCompare
                ? 'bg-[#111111] text-white border-[#111111] scale-105'
                : 'bg-white/85 hover:bg-[#111111] hover:text-white text-stone-700 border-stone-200/80 hover:border-[#111111]'
            }`}
            title={inCompare ? 'Remove from Comparison' : 'Add to Comparison'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xs cursor-pointer ${
              inWishlist
                ? 'bg-[#9A7B38] text-white border-[#9A7B38] scale-105'
                : 'bg-white/85 hover:bg-[#9A7B38] hover:text-white text-stone-700 border-stone-200/80 hover:border-[#9A7B38]'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${inWishlist ? 'fill-white scale-110' : ''}`} />
          </button>
        </div>
      </div>

      {/* Editorial Photography Canvas (3:4 Ratio with Dual Layer Crossfade) */}
      <div className="relative w-full aspect-[3/4] bg-[#F7F5F0] overflow-hidden flex items-center justify-center">
        {/* Primary Image Layer */}
        <img
          src={primaryImg}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
            hasSecondaryImage && isHovered
              ? 'opacity-0 scale-105'
              : 'opacity-100 group-hover:scale-105'
          }`}
        />

        {/* Secondary Editorial Lookbook Image Layer (Smooth Crossfade on Hover) */}
        {hasSecondaryImage && (
          <img
            src={secondaryImg}
            alt={`${product.name} editorial angle`}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Ambient Gradient Vignette on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Floating Fabric/Atelier Label */}
        {product.fabric && (
          <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest font-semibold text-stone-800 border border-stone-200/80 pointer-events-none line-clamp-1 max-w-[65%] shadow-xs">
            {product.fabric}
          </div>
        )}

        {/* Slide-Up Quick Action Floating Overlay */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/90 hover:bg-[#111111] text-stone-900 hover:text-white text-[10px] font-bold uppercase tracking-widest border border-stone-200 backdrop-blur-md flex items-center justify-center space-x-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Look</span>
          </button>

          {product.sizes && product.sizes.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickSizes(!showQuickSizes);
              }}
              className="py-2.5 px-3.5 rounded-xl bg-[#111111] hover:bg-[#9A7B38] text-white text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow-lg cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Select Size</span>
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="py-2.5 px-3.5 rounded-xl bg-[#111111] hover:bg-[#9A7B38] text-white text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1.5 transition-all shadow-lg cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Quick Size Selector Dropdown Overlay */}
        {showQuickSizes && product.sizes && (
          <div className="absolute inset-x-3 bottom-14 z-30 bg-white/95 backdrop-blur-md border border-[#E0D8C8] rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2 text-center">
              Choose Garment Size
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => handleQuickAdd(e, sz)}
                  className="py-1.5 text-xs font-bold rounded-lg border border-stone-200 hover:border-[#9A7B38] hover:bg-[#9A7B38] hover:text-white text-stone-800 transition-colors cursor-pointer"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Information Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Eyebrow Collection Label & Rating */}
          <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.18em] uppercase">
            <span className="text-[#9A7B38]">
              {product.fit || (product.gender ? `${product.gender} COLLECTION` : 'ATELIER')}
            </span>
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              <span className="font-bold text-stone-900">{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-[#9A7B38] transition-colors line-clamp-1 mt-1">
            {product.name}
          </h3>

          {/* Tagline / Materials */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-normal tracking-wide">
            {product.tagline || product.materials}
          </p>

          {/* Color & Size Swatches Bar */}
          <div className="flex items-center justify-between pt-3">
            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center space-x-1.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c);
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                      selectedColor.name === c.name
                        ? 'ring-2 ring-[#9A7B38] ring-offset-1 border-white scale-110'
                        : 'border-stone-300 opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            )}

            {/* Sizes Preview */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center space-x-1">
                {product.sizes.slice(0, 4).map((size) => (
                  <span
                    key={size}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                      selectedSize === size
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-[#FAF8F5] text-stone-600 border-[#E5DFD5]'
                    }`}
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-[9px] text-stone-400 font-medium">+{product.sizes.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Add to Bag Footer */}
        <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
          <div>
            <div className="text-lg sm:text-xl font-serif font-bold text-stone-900 tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md ${
              isAddedAnim
                ? 'bg-emerald-700 text-white scale-110'
                : 'bg-[#111111] hover:bg-[#9A7B38] text-white hover:scale-105'
            }`}
            title="Add to Shopping Bag"
          >
            {isAddedAnim ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
