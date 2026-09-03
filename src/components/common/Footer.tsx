import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  ArrowRight,
  Lock,
  Compass,
  Scissors,
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
    showToast('Subscribed!', 'Welcome to the AURELIA Atelier. Your 10% code is ATELIER10.');
    setNewsletterEmail('');
  };

  const handleNav = (view: string, params?: any) => {
    onNavigate(view, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#111111] text-[#A0988A] border-t border-[#2A2A2A] pt-16 pb-12 mt-20">
      {/* Brand Trust Badges Row */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-14 border-b border-[#2A2A2A]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-[#9A7B38] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-white">Insured Global Delivery</h4>
              <p className="text-xs text-[#8A8275] mt-0.5 font-normal">Complimentary on orders above ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-[#9A7B38] shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-white">Atelier Guarantee</h4>
              <p className="text-xs text-[#8A8275] mt-0.5 font-normal">1-Year Stitch & Seam Warranty</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-[#9A7B38] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-white">14-Day Size Exchanges</h4>
              <p className="text-xs text-[#8A8275] mt-0.5 font-normal">Complimentary doorstep fitting service</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-[#9A7B38] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-white">Personal Concierge</h4>
              <p className="text-xs text-[#8A8275] mt-0.5 font-normal">Dedicated styling consultants</p>
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
              <span className="text-2xl font-serif font-bold tracking-[0.2em] text-white">
                AURELIA & CO.
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
            </div>
            <p className="text-xs leading-relaxed text-[#8A8275] max-w-sm">
              An international luxury fashion atelier creating architectural tailoring, pure silk slip dresses, Italian leather accessories, and bespoke contemporary garments with zero synthetic compromise.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8E2D9] block mb-2">
                Join the Haute Couture Circle
              </span>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs text-[#9A7B38] bg-[#1A1A1A] border border-[#9A7B38]/30 p-3 rounded-xl">
                  <Check className="w-4 h-4" />
                  <span>Welcome to the Atelier. Use code ATELIER10 for 10% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-l-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#9A7B38]"
                  />
                  <button
                    type="submit"
                    className="bg-[#9A7B38] hover:bg-[#B38F43] text-stone-900 px-5 py-2.5 rounded-r-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center shrink-0 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="text-[11px] font-serif font-bold tracking-widest uppercase text-white mb-4">
              Atelier Collections
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleNav('shop', { category: cat.id })}
                    className="text-[#8A8275] hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('finder')}
                  className="text-[#9A7B38] hover:underline font-bold text-xs cursor-pointer flex items-center"
                >
                  <Compass className="w-3 h-3 mr-1" />
                  Style & Capsule Finder
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-[11px] font-serif font-bold tracking-widest uppercase text-white mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('tracking')} className="text-[#8A8275] hover:text-white transition-colors cursor-pointer">
                  Track Delivery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('support')} className="text-[#8A8275] hover:text-white transition-colors cursor-pointer">
                  Garment Care & Fabrics
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('support')} className="text-[#8A8275] hover:text-white transition-colors cursor-pointer">
                  Doorstep Size Exchange
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('support')} className="text-[#8A8275] hover:text-white transition-colors cursor-pointer">
                  Bespoke Fitting Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('comparison')} className="text-[#8A8275] hover:text-white transition-colors cursor-pointer">
                  Compare Silhouettes
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Authenticity */}
          <div>
            <h4 className="text-[11px] font-serif font-bold tracking-widest uppercase text-white mb-4">
              Authenticity & Security
            </h4>
            <p className="text-[11px] text-[#8A8275] leading-relaxed mb-3">
              100% Certified natural materials, verified origin certificates, and 256-bit SSL encrypted payments.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#C5A059] bg-[#1A1A1A] p-2.5 rounded-xl border border-[#333333]">
              <Lock className="w-4 h-4 text-[#9A7B38] shrink-0" />
              <span>PCI-DSS Tier 1 Encrypted</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8275] gap-4">
          <div className="flex items-center space-x-2">
            <span>© 2026 AURELIA & CO. Haute Couture & Luxury Fashion. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Currency: <strong className="text-white">INR (₹)</strong></span>
            <button
              onClick={() => {
                sessionStorage.removeItem('aurelia_intro_shown');
                window.dispatchEvent(new CustomEvent('aurelia:replay-intro'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#C5A880] hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center space-x-1"
              title="Experience the signature cloth opening curtain intro"
            >
              <span>✦ Replay Intro</span>
            </button>
            <button onClick={() => handleNav('support')} className="hover:text-white cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('support')} className="hover:text-white cursor-pointer">
              Terms of Sale
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
