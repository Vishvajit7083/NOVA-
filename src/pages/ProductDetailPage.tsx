import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Maximize2,
  Sparkles,
  Package,
  MapPin,
  ArrowRight,
  Share2,
  Ruler,
  Scissors,
  HelpCircle,
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
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Midnight Charcoal', hex: '#1c1b18' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : 'M');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'qa' | 'care' | 'box'>('specs');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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
    setSelectedSize(product.sizes ? product.sizes[0] : 'M');
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
    addToCart(product, selectedColor, selectedVariant, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedVariant, quantity, selectedSize);
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      showToast('Invalid PIN Code', 'Please enter a valid 6-digit Indian PIN code.', 'error');
      return;
    }

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
    deliveryDate.setDate(deliveryDate.getDate() + (isExpress ? 2 : 4));
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
      showToast('Link Copied', 'Garment link copied to clipboard.');
    }
  };

  // Related companion pieces
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.4)
  ).slice(0, 4);

  return (
    <div id="product-detail-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-stone-900 cursor-pointer">
            Atelier
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('shop')} className="hover:text-stone-900 cursor-pointer">
            Collections
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => onNavigate('shop', { category: product.category })}
            className="hover:text-stone-900 capitalize cursor-pointer"
          >
            {product.category.replace('-', ' & ')}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Hero Section: Gallery (Left) & Atelier Configurator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left: Editorial Fashion Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] bg-[#FAF8F5] border border-[#E8E2D9] rounded-3xl overflow-hidden shadow-xs group flex items-center justify-center">
              {/* Product Main Display */}
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-[10px] font-bold uppercase tracking-widest shadow-xs">
                    {product.badge}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-[#9A7B38] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {product.discountPercent}% Savings
                  </span>
                )}
              </div>

              {/* Gallery Zoom & 360 Studio Buttons */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button
                  onClick={() => open360Viewer(product)}
                  className="px-3.5 py-2 rounded-full bg-white/95 hover:bg-[#111111] hover:text-white border border-[#E0D8C8] backdrop-blur-md text-stone-900 text-xs font-serif font-bold tracking-wider flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                  title="Runway 360° View"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
                  <span>360° Runway</span>
                </button>

                <button
                  onClick={() => openImageViewer(product.images, selectedImageIdx)}
                  className="p-2 rounded-full bg-white/95 hover:bg-[#111111] hover:text-white border border-[#E0D8C8] backdrop-blur-md text-stone-900 transition-all shadow-sm cursor-pointer"
                  title="High-Res Inspection"
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
                    className={`aspect-[3/4] rounded-2xl bg-[#FAF8F5] border-2 transition-all overflow-hidden cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-[#9A7B38] scale-[1.02] shadow-sm'
                        : 'border-[#E8E2D9] opacity-70 hover:opacity-100 hover:border-stone-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
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
                  <span className="font-bold text-[#9A7B38] uppercase tracking-widest text-[10px]">
                    {product.fabric || product.category.replace('-', ' & ')}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-500 font-mono text-[11px]">ATELIER #{product.id.toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white hover:bg-[#111111] text-stone-700 hover:text-white border border-[#E0D8C8] transition-colors cursor-pointer"
                    title="Share garment"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      inWishlist
                        ? 'bg-[#9A7B38] text-white border-[#9A7B38]'
                        : 'bg-white hover:bg-[#111111] text-stone-700 hover:text-white border-[#E0D8C8]'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleComparison(product)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      inCompare
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white hover:bg-[#111111] text-stone-700 hover:text-white border-[#E0D8C8]'
                    }`}
                    title="Add to Comparison"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] tracking-tight mt-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed font-normal">
                {product.tagline || product.description}
              </p>

              {/* Rating score row */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-xs font-bold text-stone-900">{product.rating}</span>
                </div>
                <span className="text-stone-300">•</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-stone-600 hover:text-stone-900 underline cursor-pointer"
                >
                  {product.reviewCount} Verified Client Reviews
                </button>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-emerald-800 font-semibold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  Available in Atelier
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-white border border-[#E8E2D9] rounded-2xl flex items-baseline justify-between shadow-xs">
              <div className="space-y-1">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  {currentOriginalPrice > currentPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{currentOriginalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-[11px] font-bold text-white bg-[#9A7B38] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Save ₹{(currentOriginalPrice - currentPrice).toLocaleString('en-IN')} ({product.discountPercent}%)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500">
                  Inclusive of all taxes & import duties. Free insured delivery & 14-day doorstep size exchange.
                </div>
              </div>
            </div>

            {/* Color Swatch Options */}
            <div className="space-y-2">
              <div className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900">
                Colorway: <span className="text-stone-600 font-sans font-normal">{selectedColor.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all relative cursor-pointer ${
                      selectedColor.name === c.name
                        ? 'border-white ring-2 ring-stone-900 scale-110 shadow-sm'
                        : 'border-stone-300 opacity-80 hover:opacity-100'
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

            {/* Size Selector & Fit Guide Trigger */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-serif font-bold uppercase tracking-wider text-stone-900">
                    Select Size: <span className="text-[#9A7B38] font-sans">{selectedSize}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-semibold text-[#9A7B38] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Bespoke Size & Fit Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                        selectedSize === sz
                          ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                          : 'bg-white border-[#E0D8C8] text-stone-800 hover:border-stone-500'
                      }`}
                    >
                      <span>{sz}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Bag Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white border border-[#E0D8C8] rounded-full p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-3 font-mono text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="product-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag • {selectedSize}</span>
                </button>
              </div>

              <button
                id="product-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-4 rounded-full bg-[#9A7B38] hover:bg-[#B38F43] text-stone-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <span>Express Atelier Checkout • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Indian PIN Code Delivery Checker */}
            <div className="p-5 bg-white border border-[#E8E2D9] rounded-2xl space-y-3 text-xs shadow-xs">
              <div className="flex items-center space-x-2 text-stone-900 font-serif font-bold uppercase tracking-wider text-[11px]">
                <MapPin className="w-4 h-4 text-[#9A7B38]" />
                <span>Estimate Insured Delivery to Your PIN Code</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-Digit PIN (e.g. 110001 or 400001)"
                  className="flex-1 bg-[#FAF8F5] border border-[#E0D8C8] rounded-full px-4 py-2.5 text-stone-900 font-mono text-xs placeholder-stone-400 focus:outline-none focus:border-[#9A7B38]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </form>

              {deliveryResult && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] text-stone-800 space-y-1">
                  <div className="font-serif font-bold flex items-center text-xs text-stone-900">
                    <Truck className="w-3.5 h-3.5 mr-1.5 text-[#9A7B38]" />
                    Insured BlueDart Express to {deliveryResult.city} by {deliveryResult.deliveryDate}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Archival garment packaging with complimentary 14-day doorstep size exchange.
                  </div>
                </div>
              )}
            </div>

            {/* Atelier Trust Guarantee */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex items-center space-x-3 shadow-xs">
                <Scissors className="w-5 h-5 text-[#9A7B38] shrink-0" />
                <div>
                  <div className="font-serif font-bold text-stone-900 uppercase tracking-wider text-[11px]">1-Year Seam Guarantee</div>
                  <div className="text-[10px] text-stone-500">Complimentary atelier repairs</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex items-center space-x-3 shadow-xs">
                <RotateCcw className="w-5 h-5 text-[#9A7B38] shrink-0" />
                <div>
                  <div className="font-serif font-bold text-stone-900 uppercase tracking-wider text-[11px]">14-Day Doorstep Fitting</div>
                  <div className="text-[10px] text-stone-500">Hassle-free size exchanges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Sections */}
        <div className="pt-10 border-t border-[#E0D8C8]">
          <div className="flex items-center space-x-2 border-b border-[#E0D8C8] pb-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'specs', label: 'Tailoring & Fabric Specifications' },
              { id: 'reviews', label: `Verified Client Reviews (${product.reviewCount})` },
              { id: 'qa', label: 'Stylist Questions & Answers' },
              { id: 'care', label: 'Garment Care & Longevity' },
              { id: 'box', label: 'Archival Packaging & Packaging' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white border border-[#E0D8C8] text-stone-600 hover:text-stone-900 hover:border-stone-400'
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
            {activeTab === 'care' && (
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xl font-serif text-stone-900 tracking-tight">
                    Garment Care & Fabric Preservation
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-normal">
                    Crafted with natural unblended fibers requiring gentle care to preserve hand-feel and luster for decades.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-1 text-xs">
                    <div className="font-serif font-bold text-stone-900">Dry Cleaning & Steaming</div>
                    <p className="text-stone-600 leading-relaxed font-normal">
                      Professional eco-friendly dry clean recommended. Use a handheld low-temperature garment steamer instead of direct hot iron plates to preserve the natural fiber crimp.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-1 text-xs">
                    <div className="font-serif font-bold text-stone-900">Archival Storage</div>
                    <p className="text-stone-600 leading-relaxed font-normal">
                      Store on the included contoured cedar wood hanger inside the breathable cotton dust bag. Natural cedar emits aromatic oils that repel moths without chemicals.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'box' && (
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-8 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-xl font-serif text-stone-900 tracking-tight">What's Inside Your Atelier Parcel</h3>
                  <p className="text-xs text-stone-500 mt-1 font-normal">
                    Packaged with 100% recyclable archival luxury unboxing elements.
                  </p>
                </div>

                <div className="space-y-3">
                  {(product.whatsInTheBox || product.inTheBox || [
                    '1x Mastercrafted Garment in Archival Tissue',
                    '1x Breathable Cotton & Silk Garment Dust Bag',
                    '1x Contoured Natural Cedar Wood Atelier Hanger',
                    '1x Certificate of Fiber Authenticity with Serial Number',
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl flex items-center space-x-3 text-xs shadow-xs"
                    >
                      <Package className="w-4 h-4 text-[#9A7B38] shrink-0" />
                      <span className="text-stone-900 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related / Complete The Look Ensembles */}
        <div className="pt-12 border-t border-[#E0D8C8] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#9A7B38] uppercase tracking-[0.25em]">
                Complete The Look
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
                Curated Ensemble Pairings
              </h3>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 flex items-center cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 ml-1 text-[#9A7B38]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>

      {/* Bespoke Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-[#9A7B38]" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Bespoke Sizing & Measurement Guide
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-stone-400 hover:text-stone-900 p-1 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-stone-800 font-serif font-bold">
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest (in)</th>
                    <th className="p-3">Waist (in)</th>
                    <th className="p-3">Shoulder (in)</th>
                    <th className="p-3">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1] text-stone-700">
                  <tr>
                    <td className="p-3 font-bold text-stone-900">XS (36)</td>
                    <td className="p-3">36 - 38</td>
                    <td className="p-3">28 - 30</td>
                    <td className="p-3">16.5</td>
                    <td className="p-3">27.5</td>
                  </tr>
                  <tr className="bg-[#FAF8F5]/50">
                    <td className="p-3 font-bold text-stone-900">S (38)</td>
                    <td className="p-3">38 - 40</td>
                    <td className="p-3">30 - 32</td>
                    <td className="p-3">17.2</td>
                    <td className="p-3">28.5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-stone-900">M (40)</td>
                    <td className="p-3">40 - 42</td>
                    <td className="p-3">32 - 34</td>
                    <td className="p-3">18.0</td>
                    <td className="p-3">29.5</td>
                  </tr>
                  <tr className="bg-[#FAF8F5]/50">
                    <td className="p-3 font-bold text-stone-900">L (42)</td>
                    <td className="p-3">42 - 44</td>
                    <td className="p-3">34 - 36</td>
                    <td className="p-3">18.8</td>
                    <td className="p-3">30.5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-stone-900">XL (44)</td>
                    <td className="p-3">44 - 46</td>
                    <td className="p-3">36 - 38</td>
                    <td className="p-3">19.5</td>
                    <td className="p-3">31.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl space-y-1 text-xs">
              <div className="font-serif font-bold text-stone-900">Doorstep Fitting Guarantee</div>
              <p className="text-stone-600 leading-relaxed font-normal">
                Not sure about your size? We offer complimentary 14-day doorstep size exchanges. Our courier brings the replacement size directly to your door.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
