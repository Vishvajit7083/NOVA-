import React from 'react';
import { Tag, Copy, Sparkles, Shield, ArrowRight, Heart, ShoppingBag, Scissors } from 'lucide-react';
import { VALID_COUPONS } from '../data/faqs';
import { FlashOffersSection } from '../components/home/FlashOffersSection';
import { useShop } from '../context/ShopContext';

interface OffersPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate }) => {
  const { showToast, applyCoupon } = useShop();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    showToast('Promo Code Copied & Applied!', `Code ${code} will be applied at checkout.`);
  };

  return (
    <div id="offers-promotions-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-bold uppercase tracking-[0.25em]">
            <Tag className="w-3 h-3" />
            <span>VIP Client Privileges</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] tracking-tight">
            Atelier Privileges & Capsule Sets
          </h1>
          
          <div className="w-12 h-0.5 bg-[#9A7B38] mx-auto mt-2" />
          
          <p className="text-xs sm:text-sm text-stone-600 font-normal">
            Apply exclusive client invitations and redeem seasonal capsule wardrobe savings with insured doorstep delivery.
          </p>
        </div>

        {/* Active Voucher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALID_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="p-6 bg-white border border-[#E8E2D9] hover:border-[#9A7B38] rounded-2xl flex flex-col justify-between space-y-4 shadow-xs group transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif font-bold text-stone-900">
                    {coupon.discountType === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </span>
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#9A7B38] border border-[#E0D8C8]">
                    Active
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">{coupon.description}</p>
                <p className="text-[11px] text-stone-400">
                  Min order: ₹{coupon.minOrder.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-900 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E0D8C8]">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Redeem</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Shop The Look & Capsule Showcase */}
        <FlashOffersSection onNavigate={onNavigate} />

        {/* Bespoke Programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white border border-[#E8E2D9] rounded-3xl space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center text-[#9A7B38]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">Styling Consultation & VIP Fitting</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Book a complimentary one-on-one virtual or in-studio private styling session with our senior atelier master tailors.
            </p>
            <button
              onClick={() => onNavigate('support')}
              className="text-xs font-semibold text-[#9A7B38] hover:underline pt-2 flex items-center cursor-pointer"
            >
              Book Concierge Fitting &rarr;
            </button>
          </div>

          <div className="p-8 bg-white border border-[#E8E2D9] rounded-3xl space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center text-[#9A7B38]">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">Corporate & Bridal Bespoke Ensembles</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Commission coordinated custom silhouettes, tailored Italian wool blazers, or pure mulberry silk bridal party ensembles with personalized monogram embroidery.
            </p>
            <button
              onClick={() => onNavigate('support')}
              className="text-xs font-semibold text-[#9A7B38] hover:underline pt-2 flex items-center cursor-pointer"
            >
              Contact Atelier Bespoke Desk &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WishlistPage: React.FC<{ onNavigate: (view: string, params?: any) => void }> = ({
  onNavigate,
}) => {
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  return (
    <div id="wishlist-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[#E0D8C8]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
              <span className="text-[10px] font-bold text-[#9A7B38] uppercase tracking-[0.25em]">
                Saved Atelier Pieces
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight mt-1">
              Your Curated Shortlist
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              You have <strong>{wishlist.length}</strong> mastercrafted pieces saved.
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="p-16 bg-white border border-[#E8E2D9] rounded-3xl text-center space-y-4 shadow-xs">
            <Heart className="w-10 h-10 text-[#9A7B38] mx-auto opacity-50" />
            <h3 className="text-xl font-serif text-stone-900">Your wishlist is currently empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-normal">
              Click the heart icon on any runway garment or handcrafted accessory to save it to your personal shortlist.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="px-7 py-3.5 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest rounded-full shadow-md transition-colors cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div
                  onClick={() => onNavigate('product-detail', { productId: item.product.id })}
                  className="cursor-pointer"
                >
                  <div className="w-full aspect-[3/4] bg-[#FAF8F5] rounded-xl overflow-hidden mb-3 border border-[#EAE4D8]">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 line-clamp-1">{item.product.name}</h4>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 font-normal">{item.product.tagline || item.product.fabric}</p>
                  <div className="text-base font-bold text-stone-900 mt-2">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      addToCart(
                        item.product,
                        item.product.colors[0],
                        item.product.variants ? item.product.variants[0] : undefined,
                        1,
                        item.product.sizes ? item.product.sizes[0] : undefined
                      );
                    }}
                    className="w-full py-2.5 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="w-full py-1.5 text-stone-400 hover:text-[#EB0028] text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Remove from Shortlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
