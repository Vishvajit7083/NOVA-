import React from 'react';
import { Tag, Copy, Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { VALID_COUPONS } from '../data/faqs';
import { BUNDLE_OFFERS } from '../data/bundles';
import { FlashOffersSection } from '../components/home/FlashOffersSection';
import { useShop } from '../context/ShopContext';

interface OffersPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate }) => {
  const { showToast, applyCoupon, setIsCartOpen } = useShop();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    showToast('Promo Code Copied & Applied!', `Code ${code} will be applied at checkout.`);
  };

  return (
    <div id="offers-promotions-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#EB0028] text-[11px] font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Official Savings & VIP Drops</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-display">
            Exclusive Deals & Bundles
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Combine official instant discount vouchers with zero-cost express shipping across India.
          </p>
        </div>

        {/* Active Voucher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALID_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="p-5 bg-white border border-zinc-200 hover:border-[#EB0028]/60 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm group transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-zinc-950 font-display">
                    {coupon.discountType === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-50 text-[#EB0028] border border-red-200">
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{coupon.description}</p>
                <p className="text-[11px] text-zinc-400">
                  Min order: ₹{coupon.minOrder.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-900 bg-[#F8F9FA] px-3 py-1.5 rounded-lg border border-zinc-200">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-[#EB0028] text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Flash Drop & Bundles Showcase */}
        <FlashOffersSection onNavigate={onNavigate} />

        {/* Corporate & Student Perks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#EB0028]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950">Student & Developer Program</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Verified university students and certified software developers get a lifetime flat 12% discount on all power hardware.
            </p>
            <button
              onClick={() => onNavigate('support')}
              className="text-xs font-bold text-[#EB0028] hover:underline pt-2 flex items-center"
            >
              Verify via GitHub Student Pack &rarr;
            </button>
          </div>

          <div className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950">Corporate & Bulk B2B Invoicing</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Equip your entire startup or engineering team with customized GaN hubs and multi-port charging stations with full GST input tax credit.
            </p>
            <button
              onClick={() => onNavigate('support')}
              className="text-xs font-bold text-emerald-600 hover:underline pt-2 flex items-center"
            >
              Contact Enterprise Desk &rarr;
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
    <div id="wishlist-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-display">
              Saved Accessories Wishlist
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              You have <strong>{wishlist.length}</strong> items saved to your personal shortlist.
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="p-16 bg-white border border-zinc-200 rounded-3xl text-center space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-950">Your wishlist is empty</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Click the heart icon on any accessory to save it for later review.
            </p>
            <button
              onClick={() => onNavigate('store')}
              className="px-6 py-3 bg-[#EB0028] text-white font-bold text-xs rounded-xl shadow-md transition-colors hover:bg-[#c90023]"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div
                  onClick={() => onNavigate('product-detail', { productId: item.product.id })}
                  className="cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-full h-44 object-contain bg-[#F8F9FA] rounded-xl p-2 mb-3 border border-zinc-100"
                  />
                  <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{item.product.name}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{item.product.tagline}</p>
                  <div className="text-base font-extrabold text-zinc-950 mt-2">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      addToCart(item.product, item.product.colors[0], item.product.variants ? item.product.variants[0] : undefined, 1);
                    }}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-[#EB0028] text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Move to Shopping Bag
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="w-full py-1.5 text-zinc-400 hover:text-[#EB0028] text-[11px] font-semibold transition-colors"
                  >
                    Remove
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
