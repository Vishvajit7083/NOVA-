import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Maximize2,
  Sparkles,
  Package,
  Info,
  MapPin,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product, ColorOption, ProductVariant } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductReviews, ProductSpecTable } from '../components/product/ProductReviews';
import { ProductQA } from '../components/product/ProductQA';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (view: string, params?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
}) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleComparison,
    isInComparison,
    openImageViewer,
    open360Viewer,
    showToast,
    setIsCartOpen,
  } = useShop();

  const product = products.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Space Gray', hex: '#333' });
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'qa' | 'compatibility' | 'box'>('specs');

  // PIN Code lookup state
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<{
    city?: string;
    deliveryDate?: string;
    isExpress?: boolean;
  } | null>(null);

  // Sync state if product changes
  useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedColor(product.colors[0]);
    setSelectedVariant(product.variants ? product.variants[0] : undefined);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInComparison(product.id);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice || product.originalPrice
    : product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedVariant, quantity);
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      showToast('Invalid PIN Code', 'Please enter a valid 6-digit Indian PIN code.', 'error');
      return;
    }

    const pinNum = parseInt(pincode, 10);
    let city = 'Metro Region';
    let isExpress = true;

    if (pincode.startsWith('560')) city = 'Bengaluru, KA';
    else if (pincode.startsWith('110')) city = 'Delhi NCR';
    else if (pincode.startsWith('400')) city = 'Mumbai, MH';
    else if (pincode.startsWith('500')) city = 'Hyderabad, TS';
    else if (pincode.startsWith('600')) city = 'Chennai, TN';
    else if (pincode.startsWith('700')) city = 'Kolkata, WB';
    else if (pincode.startsWith('411')) city = 'Pune, MH';
    else if (pincode.startsWith('380')) city = 'Ahmedabad, GJ';

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (isExpress ? 1 : 3));
    const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setDeliveryResult({
      city,
      deliveryDate: formattedDate,
      isExpress,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard.');
    }
  };

  // Related companion accessories
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.4)
  ).slice(0, 4);

  return (
    <div id="product-detail-page" className="min-h-screen bg-white text-black py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-black cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('store')} className="hover:text-black cursor-pointer">
            Store
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => onNavigate('store', { category: product.category })}
            className="hover:text-black capitalize cursor-pointer"
          >
            {product.category.replace('-', ' & ')}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Hero Section: Gallery (Left) & Configurator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Interactive Media Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#F8F9FA] border border-gray-200 rounded-3xl p-8 flex items-center justify-center overflow-hidden shadow-xs group">
              {/* Product Main Display */}
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-[#EB0028] text-white text-[10px] font-bold uppercase tracking-widest shadow-xs">
                    {product.badge}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                    {product.discountPercent}% Savings
                  </span>
                )}
              </div>

              {/* Gallery Zoom & 360 Buttons */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button
                  onClick={() => open360Viewer(product)}
                  className="px-3.5 py-2 rounded-full bg-white/90 hover:bg-black hover:text-white border border-gray-200 backdrop-blur-md text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                  title="Interactive 360° View"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#EB0028]" />
                  <span>360° Studio</span>
                </button>

                <button
                  onClick={() => openImageViewer(product.images, selectedImageIdx)}
                  className="p-2 rounded-full bg-white/90 hover:bg-black hover:text-white border border-gray-200 backdrop-blur-md text-black transition-all shadow-sm cursor-pointer"
                  title="Fullscreen Zoom Viewer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`aspect-square rounded-2xl p-2 bg-[#F8F9FA] border-2 transition-all overflow-hidden cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-black scale-[1.02] shadow-sm'
                        : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Configurator */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top metadata */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-[#EB0028] uppercase tracking-widest text-[10px]">
                    {product.category.replace('-', ' & ')}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400 font-mono text-[11px]">SKU: {product.id.toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 hover:bg-black text-gray-600 hover:text-white border border-gray-200 transition-colors cursor-pointer"
                    title="Share accessory"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      inWishlist
                        ? 'bg-[#EB0028] text-white border-[#EB0028]'
                        : 'bg-gray-100 hover:bg-black text-gray-600 hover:text-white border-gray-200'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleComparison(product)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      inCompare
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 hover:bg-black text-gray-600 hover:text-white border-gray-200'
                    }`}
                    title="Add to Compare"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight mt-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed font-normal">
                {product.tagline}
              </p>

              {/* Rating score row */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-xs font-black text-black">{product.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-gray-500 hover:text-black underline cursor-pointer"
                >
                  {product.reviewCount} Verified Reviews
                </button>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-emerald-700 font-bold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  In Stock
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-baseline justify-between">
              <div className="space-y-1">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  {currentOriginalPrice > currentPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{currentOriginalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-[11px] font-bold text-white bg-[#EB0028] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Save ₹{(currentOriginalPrice - currentPrice).toLocaleString('en-IN')} ({product.discountPercent}%)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500">
                  Inclusive of all taxes & GST. Free express delivery on orders over ₹999.
                </div>
              </div>
            </div>

            {/* Color Swatch Options */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                Finish: <span className="text-gray-600 font-normal">{selectedColor.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all relative cursor-pointer ${
                      selectedColor.name === c.name
                        ? 'border-white ring-2 ring-black scale-110'
                        : 'border-gray-300 opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant selector (if applicable) */}
            {product.variants && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-black">Configuration:</div>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl text-left border text-xs font-medium transition-all cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold uppercase tracking-wider">{v.name}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">₹{v.price.toLocaleString('en-IN')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-gray-500 hover:text-black rounded-full cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black px-3 font-mono text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-gray-500 hover:text-black rounded-full cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="product-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-full bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                id="product-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-4 rounded-full bg-[#EB0028] hover:bg-black text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <span>Express Buy Now • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Indian PIN Code Delivery Checker */}
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-black font-bold uppercase tracking-wider text-[11px]">
                <MapPin className="w-4 h-4 text-[#EB0028]" />
                <span>Estimate Delivery Time to Your PIN Code</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-Digit PIN (e.g. 560001)"
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-black font-mono text-xs placeholder-gray-400 focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-[#EB0028] text-white font-bold rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>

              {deliveryResult && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center text-xs">
                    <Truck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Guaranteed Delivery to {deliveryResult.city} by {deliveryResult.deliveryDate}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Dispatched from Bengaluru Fulfilment Center via BlueDart Air Express.
                  </div>
                </div>
              )}
            </div>

            {/* NovaCare Trust Guarantee */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-black uppercase tracking-wider text-[11px]">2-Year NovaCare™</div>
                  <div className="text-[10px] text-gray-500">Direct doorstep replacement</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-black uppercase tracking-wider text-[11px]">7-Day Return Policy</div>
                  <div className="text-[10px] text-gray-500">100% money back guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Sections: Specs, Reviews, Compatibility, In The Box */}
        <div className="pt-10 border-t border-gray-200">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'reviews', label: `Verified Reviews (${product.reviewCount})` },
              { id: 'qa', label: 'Questions & Answers' },
              { id: 'compatibility', label: 'Certified Compatibility' },
              { id: 'box', label: 'In The Box & Warranty' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-8">
            {activeTab === 'specs' && <ProductSpecTable product={product} />}
            {activeTab === 'reviews' && <ProductReviews product={product} />}
            {activeTab === 'qa' && <ProductQA product={product} />}
            {activeTab === 'compatibility' && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-black tracking-tight">
                    Guaranteed Device Compatibility
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-normal">
                    Lab-tested for maximum power delivery, thermal stability, and exact dimensional fit.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {product.compatibility.map((device, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl border border-gray-200 flex items-center space-x-2.5 text-xs shadow-xs"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-black font-bold">{device}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'box' && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-black tracking-tight">What's Inside the Box</h3>
                  <p className="text-xs text-gray-500 mt-1 font-normal">
                    Packaged with 100% recyclable aerospace-grade unboxing materials.
                  </p>
                </div>

                <div className="space-y-3">
                  {(product.whatsInTheBox || product.inTheBox || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-gray-200 rounded-xl flex items-center space-x-3 text-xs shadow-xs"
                    >
                      <Package className="w-4 h-4 text-[#EB0028] shrink-0" />
                      <span className="text-black font-bold">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-xl bg-white border border-gray-200 flex items-start space-x-3 text-xs shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-black uppercase tracking-wider text-xs">NovaCare™ 2-Year Direct Warranty Included</h4>
                    <p className="text-gray-500 mt-1 font-normal leading-relaxed">
                      No tedious service center visits. If any hardware defect occurs, our courier will collect and replace the unit at your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related / Frequently Paired Products */}
        <div className="pt-12 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#EB0028] uppercase tracking-[0.25em]">
                Frequently Paired Together
              </span>
              <h3 className="text-2xl font-black uppercase text-black tracking-tight mt-1">
                Complete Your Flagship Setup
              </h3>
            </div>
            <button
              onClick={() => onNavigate('store')}
              className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black flex items-center cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 ml-1 text-[#EB0028]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
