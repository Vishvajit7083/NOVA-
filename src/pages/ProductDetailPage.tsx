import React, { useState, useEffect, useRef } from 'react';
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
  Layers,
  Camera,
  RotateCw,
  Compass,
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
    showToast,
    setIsCartOpen,
    addToCanvas,
    isInCanvas,
    setIsCanvasOpen,
  } = useShop();

  const product =
    products.find((p) => p.id === productId) ||
    PRODUCTS.find((p) => p.id === productId) ||
    PRODUCTS[0];

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors[0] || { name: 'Midnight Charcoal', hex: '#1c1b18' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes ? product.sizes[0] : 'M'
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'qa' | 'care' | 'box'>('specs');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // 4-View Perspective Switcher
  const [perspective, setPerspective] = useState<'standard' | 'editorial' | 'macro' | 'studio360'>('standard');

  // Floating Bar Visibility
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);

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
    setPerspective('standard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  useEffect(() => {
    if (isSizeGuideOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSizeGuideOpen]);

  // Floating buy bar scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      setShowFloatingBar(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInComparison(product.id);
  const onCanvas = isInCanvas(product.id);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice || product.originalPrice
    : product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedVariant, quantity, selectedSize);
    showToast('Piece Added to Bag', `${product.name} (${selectedSize}) is in your shopping bag.`, 'success');
  };

  const handleCollectToCanvas = () => {
    addToCanvas(product, selectedColor, selectedSize);
    showToast('Garment Added to Canvas', `${product.name} collected to your digital wardrobe.`, 'success');
    setIsCanvasOpen(true);
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
    <div id="product-detail-page" className="min-h-screen bg-[#0A0A0A] text-[#F5F2EB] py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C867B] font-mono">
          <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer transition-colors">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-[#444]" />
          <button onClick={() => onNavigate('shop')} className="hover:text-white cursor-pointer transition-colors">
            Collections
          </button>
          <ChevronRight className="w-3 h-3 text-[#444]" />
          <button
            onClick={() => onNavigate('shop', { category: product.category })}
            className="hover:text-white capitalize cursor-pointer transition-colors"
          >
            {product.category.replace('-', ' & ')}
          </button>
          <ChevronRight className="w-3 h-3 text-[#444]" />
          <span className="text-[#C5A880] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Perspective Switcher: "See It Differently" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121212] border border-[#222222]">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#C5A880]" />
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#F5F2EB]">
              See It Differently
            </span>
            <span className="text-[#444] text-xs">•</span>
            <span className="text-[11px] text-[#8C867B]">Select inspection perspective</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-wrap">
            {[
              { id: 'standard', label: 'Lookbook View' },
              { id: 'editorial', label: 'Editorial Drape' },
              { id: 'macro', label: 'Macro Weave & Texture' },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setPerspective(view.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  perspective === view.id
                    ? 'bg-[#C5A880] text-black font-bold shadow-md'
                    : 'bg-[#181818] text-[#8C867B] hover:text-[#F5F2EB] border border-[#2B2B2B]'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Hero Section: Gallery (Left) & Atelier Configurator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Editorial Fashion Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] bg-[#121212] border border-[#222222] rounded-3xl overflow-hidden shadow-2xl group flex items-center justify-center">
              {/* Product Main Display */}
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                  perspective === 'macro' ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105'
                }`}
                onClick={() => {
                  if (perspective === 'macro') setPerspective('standard');
                  else openImageViewer(product.images, selectedImageIdx);
                }}
              />

              {/* Editorial Mode Overlay Text */}
              {perspective === 'editorial' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-left pointer-events-none">
                  <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest">
                    Authentic Handcraft • Maharashtra Heritage
                  </span>
                  <p className="text-xl sm:text-2xl font-serif text-[#F5F2EB] italic mt-1 leading-snug">
                    "{product.tagline || 'Sculptural elegance engineered for effortless natural drape.'}"
                  </p>
                  <p className="text-xs text-[#A0988A] mt-2 font-mono">
                    Fabric: {product.fabric || product.material} • Handcrafted in {product.countryOfOrigin || 'Sindhudurg, Maharashtra, India'}
                  </p>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-[#C5A880] text-black text-[10px] font-bold uppercase tracking-widest shadow-md">
                    {product.badge}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-[#9A7B38] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {product.discountPercent}% Savings
                  </span>
                )}
              </div>

              {/* Gallery High-Res Inspection Button */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button
                  onClick={() => openImageViewer(product.images, selectedImageIdx)}
                  className="px-3.5 py-2 rounded-full bg-black/85 hover:bg-[#C5A880] hover:text-black border border-[#222222] backdrop-blur-md text-stone-200 text-xs font-serif font-bold tracking-wider flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                  title="High-Res Fabric Inspection"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect Fabric</span>
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
                    className={`aspect-[3/4] rounded-2xl bg-[#121212] border-2 transition-all overflow-hidden cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-[#C5A880] scale-[1.02] shadow-md'
                        : 'border-[#222222] opacity-70 hover:opacity-100 hover:border-[#C5A880]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Configurator */}
          <div ref={buyBoxRef} className="lg:col-span-6 space-y-6">
            {/* Top metadata */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-[#C5A880] uppercase tracking-widest text-[10px] font-mono">
                    {product.fabric || product.category.replace('-', ' & ')}
                  </span>
                  <span className="text-[#333]">•</span>
                  <span className="text-[#8C867B] font-mono text-[11px]">ATELIER #{product.id.toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-[#121212] hover:bg-[#C5A880] text-[#A0988A] hover:text-black border border-[#222222] transition-colors cursor-pointer"
                    title="Share garment"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      inWishlist
                        ? 'bg-[#C5A880] text-black border-[#C5A880]'
                        : 'bg-[#121212] hover:bg-[#C5A880] text-[#A0988A] hover:text-black border border-[#222222]'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-black' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleComparison(product)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      inCompare
                        ? 'bg-[#C5A880] text-black border-[#C5A880]'
                        : 'bg-[#121212] hover:bg-[#C5A880] text-[#A0988A] hover:text-black border border-[#222222]'
                    }`}
                    title="Add to Comparison"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EB] tracking-tight mt-2">
                {product.name}
              </h1>

              <div className="flex items-center space-x-3 mt-2.5">
                <div className="flex items-center space-x-1 text-[#C5A880]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(product.rating)
                          ? 'fill-[#C5A880] stroke-[#C5A880]'
                          : 'stroke-stone-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#F5F2EB] font-mono">{product.rating}</span>
                <span className="text-xs text-[#8C867B]">({product.reviewCount} Reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#222222] flex items-baseline justify-between">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-serif font-bold text-[#F5F2EB] tracking-tight">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-sm text-[#777] line-through">
                    ₹{currentOriginalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-[10px] font-mono font-bold text-black bg-[#C5A880] px-2 py-0.5 rounded-full uppercase">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              <span className="text-[11px] text-[#8C867B] font-mono">
                Tax Included • Fully Insured
              </span>
            </div>

            {/* Short Tagline Description */}
            <p className="text-xs sm:text-sm text-[#A0988A] leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Color Swatch Selector */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#A0988A]">
                Colorway: <span className="text-[#F5F2EB] font-sans">{selectedColor.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all relative cursor-pointer ${
                      selectedColor.name === c.name
                        ? 'ring-2 ring-[#C5A880] ring-offset-2 ring-offset-[#0A0A0A] border-white scale-110'
                        : 'border-[#333] opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && (
                      <Check className="w-4 h-4 text-black absolute inset-0 m-auto stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector & Fit Guide Trigger */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#A0988A]">
                    Select Size: <span className="text-[#C5A880] font-mono">{selectedSize}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-semibold text-[#C5A880] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Bespoke Size & Fit Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                        selectedSize === sz
                          ? 'bg-[#C5A880] text-black border-[#C5A880] shadow-md'
                          : 'bg-[#121212] border-[#222222] text-[#A0988A] hover:border-[#C5A880] hover:text-white'
                      }`}
                    >
                      <span>{sz}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Authentic Konkan & Textile Provenance Card */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-serif font-bold uppercase tracking-wider text-[#C5A880]">
                <span>Provenance & Textile Architecture</span>
                <span className="text-[10px] font-mono font-normal text-[#8C867B]">{product.originRegion || 'Sindhudurg, Maharashtra'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.sareeLength && (
                  <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                    <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Saree Length</span>
                    <span className="font-medium text-[#F5F2EB]">{product.sareeLength}</span>
                  </div>
                )}
                {product.blousePiece && (
                  <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                    <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Blouse Piece</span>
                    <span className="font-medium text-[#F5F2EB]">{product.blousePiece}</span>
                  </div>
                )}
                {product.weaveType && (
                  <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                    <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Weave / Knit</span>
                    <span className="font-medium text-[#F5F2EB]">{product.weaveType}</span>
                  </div>
                )}
                {product.fabricGsm && (
                  <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                    <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Fabric Weight</span>
                    <span className="font-medium text-[#F5F2EB]">{product.fabricGsm}</span>
                  </div>
                )}
                {product.borderDetail && (
                  <div className="col-span-2 p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                    <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Zari & Border Architecture</span>
                    <span className="font-medium text-[#F5F2EB]">{product.borderDetail}</span>
                  </div>
                )}
                {product.palluDetail && (
                  <div className="col-span-2 p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F]">
                    <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Pallu Craftsmanship</span>
                    <span className="font-medium text-[#F5F2EB]">{product.palluDetail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Stepper, Add to Bag & Fashion Canvas Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-[#121212] border border-[#222222] rounded-full p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-stone-400 hover:text-white rounded-full cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-3 font-mono text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-full cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="product-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag • {selectedSize}</span>
                </button>
              </div>

              {/* Secondary Actions: Collect to Canvas & Instant Checkout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="product-collect-canvas-btn"
                  onClick={handleCollectToCanvas}
                  className={`py-3.5 px-4 rounded-xl border text-xs font-serif font-medium tracking-wide uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    onCanvas
                      ? 'bg-[#1C1C1C] border-[#C5A880] text-[#C5A880]'
                      : 'bg-[#141414] hover:bg-[#1E1E1E] border-[#2B2B2B] text-[#F5F2EB]'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#C5A880]" />
                  <span>{onCanvas ? 'Garment in Canvas' : 'Collect to Fashion Canvas'}</span>
                </button>

                <button
                  id="product-buy-now-btn"
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl bg-[#141414] border border-[#2B2B2B] hover:bg-[#1E1E1E] text-white font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </button>
              </div>
            </div>

            {/* Indian PIN Code Delivery Checker */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#222222] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold uppercase tracking-wider text-[#A0988A]">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Estimate Express Doorstep Delivery</span>
              </div>

              <form onSubmit={handlePincodeCheck} className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code (e.g. 400001)"
                  className="flex-1 px-4 py-2 text-xs rounded-xl bg-[#181818] border border-[#262626] text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C5A880] text-black font-bold text-xs uppercase cursor-pointer hover:bg-[#D4AF37] transition-colors"
                >
                  Verify
                </button>
              </form>

              {deliveryResult && (
                <div className="p-3 bg-[#181818] border border-[#242424] rounded-xl text-xs space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Complimentary Express Delivery to {deliveryResult.city}</span>
                  </div>
                  <p className="text-[#8C867B] text-[11px]">
                    Expected delivery by <strong className="text-white">{deliveryResult.deliveryDate}</strong> with secure tamper-evident packaging.
                  </p>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-[#8C867B]">
              <div className="p-3 rounded-xl bg-[#121212] border border-[#222222] flex flex-col items-center justify-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span className="font-bold text-white text-[11px]">100% Authentic</span>
                <span className="text-[10px]">Verified Origin</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#222222] flex flex-col items-center justify-center space-y-1">
                <Truck className="w-4 h-4 text-[#C5A880]" />
                <span className="font-bold text-white text-[11px]">Free Shipping</span>
                <span className="text-[10px]">Across India</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#222222] flex flex-col items-center justify-center space-y-1">
                <RotateCcw className="w-4 h-4 text-[#C5A880]" />
                <span className="font-bold text-white text-[11px]">Doorstep Return</span>
                <span className="text-[10px]">14-Day Exchanges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Tabs Section: Specs, Reviews, Q&A, Box Contents */}
        <div className="pt-10 border-t border-[#1C1C1C]">
          <div className="flex items-center space-x-4 border-b border-[#222222] overflow-x-auto no-scrollbar">
            {[
              { id: 'specs', label: 'Garment Specifications' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewCount})` },
              { id: 'qa', label: 'Questions & Answers' },
              { id: 'care', label: 'Fabric & Care Guide' },
              { id: 'box', label: "What's in the Box" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs font-serif uppercase tracking-widest border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#C5A880] text-[#C5A880] font-bold'
                    : 'border-transparent text-[#8C867B] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'specs' && <ProductSpecTable product={product} />}
            {activeTab === 'reviews' && <ProductReviews product={product} />}
            {activeTab === 'qa' && <ProductQA product={product} />}
            {activeTab === 'care' && (
              <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] space-y-4 max-w-2xl text-xs text-[#A0988A]">
                <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                  Care & Fabric Preservation Guidelines
                </h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Specialist dry cleaning recommended for pure silk, Paithani, and Chanderi sarees.</li>
                  <li>Store in breathable cotton garment bag provided with your order.</li>
                  <li>Use wide-shoulder hangers for shirts to preserve collar and shoulder shape.</li>
                  <li>Steam gently from a 6-inch distance; avoid direct high-heat iron pressure on zari.</li>
                </ul>
              </div>
            )}
            {activeTab === 'box' && (
              <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] space-y-4 max-w-2xl text-xs text-[#A0988A]">
                <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                  Package Inclusions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] space-y-1">
                    <span className="font-serif font-bold text-white block">1. SINDHUDURG GARMENTS Box</span>
                    <span className="text-[11px] text-[#8C867B]">Rigid presentation storage box.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] space-y-1">
                    <span className="font-serif font-bold text-white block">2. Dust Garment Bag</span>
                    <span className="text-[11px] text-[#8C867B]">Organic unbleached muslin protection cover.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] space-y-1">
                    <span className="font-serif font-bold text-white block">3. Certificate of Authenticity</span>
                    <span className="text-[11px] text-[#8C867B]">Numbered handloom verification card.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] space-y-1">
                    <span className="font-serif font-bold text-white block">4. Care & Styling Leaflet</span>
                    <span className="text-[11px] text-[#8C867B]">Draping guidelines and preservation tips.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Curated Ensemble Pairings: Complete The Look */}
        <div className="pt-12 border-t border-[#1C1C1C] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-[0.25em]">
                Complete The Look
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB] tracking-tight mt-1">
                Curated Ensemble Pairings
              </h3>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-mono uppercase tracking-wider text-[#A0988A] hover:text-white flex items-center cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 ml-1 text-[#C5A880]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Intelligent Buy Bar */}
      {showFloatingBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-md border-t border-[#262626] px-6 py-3 shadow-2xl transition-all animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img
                src={product.images[0]}
                alt=""
                className="w-11 h-11 object-cover rounded-lg border border-[#2B2B2B]"
              />
              <div className="hidden sm:block">
                <h4 className="text-xs font-serif font-bold text-[#F5F2EB] truncate max-w-xs">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-2 text-[11px] text-[#8C867B]">
                  <span>Size: {selectedSize}</span>
                  <span>•</span>
                  <span>{selectedColor.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm sm:text-base font-serif font-bold text-[#F5F2EB]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>

              <button
                onClick={handleCollectToCanvas}
                className="p-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#333] text-[#C5A880] cursor-pointer"
                title="Collect to Canvas"
              >
                <Layers className="w-4 h-4" />
              </button>

              <button
                onClick={handleAddToCart}
                className="px-5 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-serif font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bespoke Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-[#C5A880]" />
                <h3 className="text-lg font-serif font-bold text-[#F5F2EB]">
                  Bespoke Sizing & Measurement Guide
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-[#777] hover:text-white p-1 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#1A1A1A] border-b border-[#262626] text-[#F5F2EB] font-serif font-bold">
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest (in)</th>
                    <th className="p-3">Waist (in)</th>
                    <th className="p-3">Shoulder (in)</th>
                    <th className="p-3">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222] text-[#A0988A]">
                  <tr>
                    <td className="p-3 font-bold text-white">XS (36)</td>
                    <td className="p-3">36 - 38</td>
                    <td className="p-3">28 - 30</td>
                    <td className="p-3">16.5</td>
                    <td className="p-3">27.5</td>
                  </tr>
                  <tr className="bg-[#181818]">
                    <td className="p-3 font-bold text-white">S (38)</td>
                    <td className="p-3">38 - 40</td>
                    <td className="p-3">30 - 32</td>
                    <td className="p-3">17.2</td>
                    <td className="p-3">28.5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">M (40)</td>
                    <td className="p-3">40 - 42</td>
                    <td className="p-3">32 - 34</td>
                    <td className="p-3">18.0</td>
                    <td className="p-3">29.5</td>
                  </tr>
                  <tr className="bg-[#181818]">
                    <td className="p-3 font-bold text-white">L (42)</td>
                    <td className="p-3">42 - 44</td>
                    <td className="p-3">34 - 36</td>
                    <td className="p-3">18.8</td>
                    <td className="p-3">30.5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">XL (44)</td>
                    <td className="p-3">44 - 46</td>
                    <td className="p-3">36 - 38</td>
                    <td className="p-3">19.5</td>
                    <td className="p-3">31.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#181818] border border-[#282828] rounded-2xl space-y-1 text-xs">
              <div className="font-serif font-bold text-[#F5F2EB]">Doorstep Fitting Guarantee</div>
              <p className="text-[#8C867B] leading-relaxed font-normal">
                Not sure about your size? We offer complimentary 14-day doorstep size exchanges. Our courier brings the replacement size directly to your door.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-serif font-bold uppercase tracking-wider cursor-pointer"
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
