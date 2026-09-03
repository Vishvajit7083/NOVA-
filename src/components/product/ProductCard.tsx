import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check, Layers, SlidersHorizontal } from 'lucide-react';
import { Product, ColorOption } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../common/ProductImage';

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
    addToCanvas,
    isInCanvas,
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Standard', hex: '#111111' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInComparison(product.id);
  const onCanvas = isInCanvas(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
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

  const factualAttribute =
    product.fabric ||
    product.materials ||
    (product.fabricGsm ? `${product.fabricGsm} GSM Combed Cotton` : null) ||
    product.fit ||
    product.pattern;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
      className="group relative bg-[#121212] border border-[#222222] hover:border-[#C5A880]/60 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      {/* Top Floating Badges & Action Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Real Discount or Badge */}
        <div className="flex flex-col gap-1 items-start pointer-events-auto">
          {product.originalPrice > product.price && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#9A7B38] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-[#C5A880] border border-[#333333] text-[8px] font-bold tracking-widest uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Right Wishlist & Comparison Icons */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCanvas(product, selectedColor, selectedSize);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 shadow-xs cursor-pointer ${
              onCanvas
                ? 'bg-[#C5A880] text-black border-[#C5A880]'
                : 'bg-black/70 hover:bg-[#C5A880] hover:text-black text-stone-300 border-[#222222]'
            }`}
            title={onCanvas ? 'Wardrobe Canvas' : 'Collect to Canvas'}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 shadow-xs cursor-pointer ${
              inWishlist
                ? 'bg-[#C5A880] text-black border-[#C5A880]'
                : 'bg-black/70 hover:bg-[#C5A880] hover:text-black text-stone-300 border-[#222222]'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${inWishlist ? 'fill-black' : ''}`} />
          </button>
        </div>
      </div>

      {/* Verified Clothing-Only Image Frame (3:4 ratio) */}
      <div className="relative w-full aspect-[3/4] bg-[#161616] overflow-hidden flex items-center justify-center">
        <ProductImage
          product={product}
          isHovered={isHovered}
          selectedImageUrl={selectedColor?.image}
          alt={product.name}
          aspectRatio="aspect-[3/4]"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center space-x-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-black/85 hover:bg-[#202020] text-stone-200 hover:text-white text-[10px] font-bold uppercase tracking-wider border border-[#222222] backdrop-blur-md flex items-center justify-center space-x-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Quick Look</span>
          </button>
        </div>

        {/* Quick Size Selection Overlay */}
        {showQuickSizes && product.sizes && (
          <div className="absolute inset-x-3 bottom-12 z-30 bg-[#121212]/95 backdrop-blur-md border border-[#222222] rounded-xl p-2.5 shadow-2xl animate-in fade-in duration-150">
            <div className="text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 text-center">
              Select Size
            </div>
            <div className="grid grid-cols-4 gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => handleQuickAdd(e, sz)}
                  className="py-1 text-[11px] font-bold rounded border border-[#222222] hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-black text-stone-300 transition-colors cursor-pointer"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-[#121212]">
        <div>
          {/* Brand & Real Rating */}
          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
            <span className="text-[#C5A880]">{product.brand || 'SINDHUDURG GARMENTS'}</span>
            {product.rating && product.reviewCount > 0 ? (
              <div className="flex items-center space-x-1 text-[#C5A880]">
                <Star className="w-3 h-3 fill-[#C5A880] stroke-[#C5A880]" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-stone-400 font-normal">({product.reviewCount})</span>
              </div>
            ) : null}
          </div>

          {/* Product Title (Amazon / Myntra standard clear format) */}
          <h3 className="text-sm sm:text-base font-serif font-bold text-[#F5F2EB] group-hover:text-[#C5A880] transition-colors line-clamp-2 mt-1 leading-snug">
            {product.name}
          </h3>

          {/* Short Factual Attribute Line */}
          {factualAttribute && (
            <p className="text-xs text-stone-400 line-clamp-1 mt-1 font-normal">
              {factualAttribute}
            </p>
          )}

          {/* Colour Swatches & Size Preview */}
          <div className="flex items-center justify-between pt-2">
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
                        ? 'ring-2 ring-[#C5A880] ring-offset-1 ring-offset-[#121212] border-transparent scale-110'
                        : 'border-[#333333] opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center space-x-1 text-[9px] text-stone-400 font-medium">
                {product.sizes.slice(0, 3).map((sz) => (
                  <span key={sz} className="px-1.5 py-0.5 rounded border border-[#222222] bg-[#161616]">
                    {sz}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-stone-500">+{product.sizes.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Add to Bag Footer */}
        <div className="pt-2.5 border-t border-[#222222] flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] text-stone-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              if (product.sizes && product.sizes.length > 1) {
                e.stopPropagation();
                setShowQuickSizes(!showQuickSizes);
              } else {
                handleQuickAdd(e);
              }
            }}
            className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md ${
              isAddedAnim
                ? 'bg-emerald-700 text-white scale-110'
                : 'bg-[#1a1a1a] border border-[#222222] hover:bg-[#C5A880] hover:text-black text-[#C5A880] hover:scale-105'
            }`}
            title="Add to Shopping Bag"
          >
            {isAddedAnim ? <Check className="w-4 h-4 text-white" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
