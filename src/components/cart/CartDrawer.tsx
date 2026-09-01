import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Scissors,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface CartDrawerProps {
  onNavigate: (view: string, params?: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Body */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] border-l border-[#E0D8C8] shadow-2xl flex flex-col justify-between text-[#111111]">
          {/* Header */}
          <div className="p-6 border-b border-[#E0D8C8] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#9A7B38]" />
              <h2 className="text-base font-serif font-bold text-stone-900">
                Atelier Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full bg-[#FAF8F5] hover:bg-[#111111] text-stone-600 hover:text-white border border-[#E0D8C8] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-white border-b border-[#EAE4D8] space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center space-x-1.5 text-stone-800">
                <Truck className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>
                  {remainingForFreeShipping > 0
                    ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} for Free Insured Courier`
                    : '✨ Complimentary Insured Courier Unlocked!'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9A7B38] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#FDFBF7]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center text-[#9A7B38]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-base font-serif font-bold text-stone-900">Your shopping bag is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs font-normal">
                  Explore tailored silhouettes, Italian wool outerwear, and pure mulberry silk accessories.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="mt-2 px-6 py-3 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-colors cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border border-[#E8E2D9] rounded-2xl flex space-x-3.5 text-xs relative group shadow-xs"
                >
                  <div className="w-18 h-24 aspect-[3/4] bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#EAE4D8] shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h5 className="font-serif font-bold text-stone-900 truncate">{item.product.name}</h5>
                    
                    <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-1.5">
                      {item.selectedSize && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E0D8C8] text-stone-900 font-bold text-[10px]">
                          Size {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && <span>• {item.selectedColor.name}</span>}
                    </div>

                    <div className="flex items-center justify-between pt-1.5">
                      <div className="flex items-center space-x-2 bg-[#FAF8F5] border border-[#E0D8C8] rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-stone-500 hover:text-stone-900 p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-stone-900 px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-stone-500 hover:text-stone-900 p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-serif font-bold text-stone-900 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-[#EB0028] p-1 self-start transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E0D8C8] bg-white space-y-4 shadow-lg">
              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="p-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl flex items-center justify-between text-xs text-stone-900">
                  <div className="flex items-center space-x-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-[#9A7B38]" />
                    <span>
                      Privilege Code <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.discountPercent}% Off)
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-stone-400 hover:text-stone-800 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Invitation Code (e.g. ATELIER10)"
                    className="flex-1 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl px-3 py-2 text-xs text-stone-900 uppercase placeholder-stone-400 focus:outline-none focus:border-[#9A7B38]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price rows */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-900 font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#9A7B38] font-medium">
                    <span>Privilege Savings</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Express Courier</span>
                  <span className="text-[#9A7B38] font-bold">
                    {cartShippingFee === 0 ? 'COMPLIMENTARY' : `₹${cartShippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE4D8] flex justify-between text-base font-serif font-bold text-stone-900">
                  <span>Estimated Total</span>
                  <span className="text-[#9A7B38]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                id="cart-drawer-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest rounded-full shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Proceed to Atelier Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-stone-500 text-center flex items-center justify-center space-x-2">
                <Scissors className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>1-Year Atelier Guarantee • 14-Day Doorstep Size Exchange</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
