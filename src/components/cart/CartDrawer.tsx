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
  Sparkles,
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
    showToast,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Body */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between text-zinc-900">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#EB0028]" />
              <h2 className="text-base font-bold font-display text-zinc-950">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 border border-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F8F9FA] border-b border-zinc-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center space-x-1.5 text-zinc-700">
                <Truck className="w-3.5 h-3.5 text-[#EB0028]" />
                <span>
                  {remainingForFreeShipping > 0
                    ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} for Free Express Delivery`
                    : '🎉 Free Express Delivery Unlocked!'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EB0028] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#FAFAFA]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Your bag is empty</h4>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Discover flagship GaN chargers, braided cables, and aramid cases built for performance.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('store');
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#EB0028] hover:bg-[#c90023] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Explore Store
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white border border-zinc-200 rounded-2xl flex space-x-3 text-xs relative group shadow-sm"
                >
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-16 h-16 object-contain bg-[#F8F9FA] rounded-xl p-1.5 border border-zinc-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h5 className="font-bold text-zinc-900 truncate">{item.product.name}</h5>
                    <div className="text-[11px] text-zinc-500 flex items-center space-x-2">
                      {item.selectedColor && <span>{item.selectedColor.name}</span>}
                      {item.selectedVariant && <span>• {item.selectedVariant.name}</span>}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2 bg-zinc-100 border border-zinc-200 rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-zinc-500 hover:text-zinc-900 p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-zinc-900 px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-zinc-500 hover:text-zinc-900 p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-bold text-zinc-950 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-400 hover:text-[#EB0028] p-1 self-start transition-colors"
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
            <div className="p-6 border-t border-zinc-200 bg-white space-y-4 shadow-lg">
              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.discountPercent}% Off)
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-zinc-400 hover:text-zinc-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. NOVA10)"
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 uppercase placeholder-zinc-400 focus:outline-none focus:border-[#EB0028]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price rows */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-600 font-bold">
                    {cartShippingFee === 0 ? 'FREE' : `₹${cartShippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex justify-between text-base font-extrabold text-zinc-950">
                  <span>Estimated Total</span>
                  <span className="font-display text-[#EB0028]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                id="cart-drawer-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-zinc-500 text-center flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>2-Year Direct Replacement Warranty & 7-Day Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
