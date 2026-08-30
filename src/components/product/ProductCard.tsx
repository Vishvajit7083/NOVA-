import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap, Check, SlidersHorizontal } from 'lucide-react';
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

  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInComparison(product.id);

  // Active image: if hovered and second image exists, crossfade
  const activeImage =
    isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigating if clicking buttons or color swatches
    if ((e.target as HTMLElement).closest('button')) return;
    onNavigate('product-detail', { productId: product.id });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, product.variants ? product.variants[0] : undefined, 1);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white border border-gray-200 hover:border-black rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col cursor-pointer"
    >
      {/* Top badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#EB0028] text-white text-[9px] font-bold tracking-widest uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[9px] font-bold uppercase tracking-wider">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleComparison(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              inCompare
                ? 'bg-black text-white border-black'
                : 'bg-white/90 hover:bg-black hover:text-white text-gray-600 border-gray-200 shadow-xs'
            }`}
            title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              inWishlist
                ? 'bg-[#EB0028] text-white border-[#EB0028]'
                : 'bg-white/90 hover:bg-black hover:text-white text-gray-600 border-gray-200 shadow-xs'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image Stage */}
      <div className="relative w-full h-56 sm:h-64 bg-[#F8F9FA] p-6 flex items-center justify-center overflow-hidden">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openQuickView(product);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 px-4 py-1.5 rounded-full bg-black/90 hover:bg-[#EB0028] text-white text-[11px] font-bold uppercase tracking-wider border border-black backdrop-blur-md flex items-center space-x-1.5 shadow-md"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="font-black text-black">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
            {product.inStock ? (
              <span className="text-emerald-700">In Stock</span>
            ) : (
              <span className="text-gray-400">Backorder</span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-black group-hover:text-[#EB0028] transition-colors line-clamp-1 mt-1">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-normal">
            {product.tagline}
          </p>

          {/* Color swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center space-x-1.5 mt-2.5">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c);
                  }}
                  style={{ backgroundColor: c.hex }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor.name === c.name
                      ? 'ring-2 ring-black border-white scale-110'
                      : 'border-gray-300 opacity-80 hover:opacity-100'
                  }`}
                  title={c.name}
                />
              ))}
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">
                {product.colors.length} colors
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-black text-black tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`p-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
              isAddedAnim
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-black hover:bg-[#EB0028] text-white shadow-sm hover:scale-105'
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
