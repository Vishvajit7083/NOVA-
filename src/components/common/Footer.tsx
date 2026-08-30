import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Check,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed!', 'Welcome to the NOVA VIP Club. Check your inbox for your 15% code.');
    setNewsletterEmail('');
  };

  const handleNav = (view: string, params?: any) => {
    onNavigate(view, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-white text-gray-500 border-t border-gray-100 pt-16 pb-12 mt-20">
      {/* Brand Trust Badges Row */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-14 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-[#EB0028] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">Free Express Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5 font-normal">Across India on orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">24-Month Warranty</h4>
              <p className="text-xs text-gray-500 mt-0.5 font-normal">Direct doorstep replacement policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-amber-600 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">7-Day Easy Returns</h4>
              <p className="text-xs text-gray-500 mt-0.5 font-normal">Hassle-free replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-cyan-600 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">Dedicated Support</h4>
              <p className="text-xs text-gray-500 mt-0.5 font-normal">Expert gear engineers ready to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white font-bold">
                <Zap className="w-4 h-4 text-[#EB0028]" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black">
                NOVA
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-600 max-w-sm">
              We design and engineer uncompromising consumer electronics accessories with aerospace materials, next-generation GaN silicon, and refined industrial aesthetics.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black block mb-2">
                Join the NOVA VIP Community
              </span>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <Check className="w-4 h-4" />
                  <span>You're subscribed! Use code FIRSTDROP for 15% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-l-xl px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-[#EB0028] text-white px-5 py-2.5 rounded-r-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center shrink-0"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-4">
              Flagship Gear
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleNav('store', { category: cat.id })}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('finder')}
                  className="text-[#EB0028] hover:underline font-bold text-xs"
                >
                  Device Matcher
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-4">
              Help & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('tracking')} className="text-gray-500 hover:text-black transition-colors">
                  Track Consignment
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('support')} className="text-gray-500 hover:text-black transition-colors">
                  Warranty Verification
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('support')} className="text-gray-500 hover:text-black transition-colors">
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('support')} className="text-gray-500 hover:text-black transition-colors">
                  Technical Specifications FAQs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('comparison')} className="text-gray-500 hover:text-black transition-colors">
                  Spec Comparison Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-4">
              Security & Payment
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
              All transactions encrypted with 256-bit SSL. Supported UPI, RuPay, Visa, Mastercard, NetBanking & COD.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>PCI-DSS Level 1 Secure Checkouts</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-2">
            <span>© 2026 NOVA Technologies Private Limited. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Currency: <strong className="text-black">INR (₹)</strong></span>
            <button onClick={() => handleNav('support')} className="hover:text-black">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('support')} className="hover:text-black">
              Terms of Sale
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
