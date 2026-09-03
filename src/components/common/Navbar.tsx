import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
  Shirt,
  Scissors,
  Footprints,
  Watch,
  Eye,
  Bell,
  Store,
  Compass,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';
import { NotificationsModal } from './NotificationsModal';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const {
    cartItemCount,
    wishlist,
    comparisonItems,
    fashionCanvas,
    setIsCanvasOpen,
    notifications,
    setIsSearchOpen,
    setIsCartOpen,
    currentUser,
    isAdmin,
    isSeller,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    '✦ AUTUMN / WINTER ATELIER: The Milano Virgin Wool & 22 Momme Silk Edit is now live',
    '🚚 Complimentary Insured Delivery on orders above ₹1,999 • 14-Day Doorstep Size Exchanges',
    '🎁 Welcome Gift: Use code "ATELIER10" at checkout for 10% savings on your first order',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (view: string, params?: any) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
      case 'Scissors':
        return <Shirt className="w-4 h-4 text-[#9A7B38]" />;
      case 'Footprints':
        return <Footprints className="w-4 h-4 text-[#9A7B38]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-[#9A7B38]" />;
      case 'Watch':
        return <Watch className="w-4 h-4 text-[#9A7B38]" />;
      case 'Eye':
        return <Eye className="w-4 h-4 text-[#9A7B38]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#9A7B38]" />;
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        id="announcement-bar"
        className="bg-[#111111] text-[#E8E2D9] text-[10px] sm:text-[11px] font-medium tracking-widest py-2 px-6 border-b border-[#2A2A2A] relative z-40"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 text-center truncate">
            <span className="inline-block transition-opacity duration-300">
              {announcements[announcementIndex]}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-[#A0988A] shrink-0 text-[10px] uppercase font-semibold tracking-widest">
            <button
              onClick={() => handleNavClick('tracking')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavClick('support')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Atelier Concierge
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1F1F1F] shadow-sm py-3.5'
            : 'bg-[#0A0A0A] border-b border-[#1F1F1F] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Brand Wordmark / Logo */}
          <div className="flex items-center space-x-10">
            <button
              id="navbar-brand-logo"
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 text-left group focus:outline-none cursor-pointer"
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.18em] text-[#F5F2EB]">
                    AURELIA
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] ml-1.5 mb-1" />
                </div>
                <span className="text-[8px] uppercase tracking-[0.35em] text-[#C5A880] -mt-1 font-semibold">
                  HAUTE COUTURE
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-semibold uppercase tracking-widest text-stone-300">
              
              <button
                id="nav-link-store"
                onClick={() => handleNavClick('shop')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentView === 'store' || currentView === 'shop'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                Collections
              </button>

              {/* Atelier Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  id="nav-link-categories-dropdown"
                  onClick={() => handleNavClick('shop')}
                  className={`py-1 flex items-center space-x-1 transition-colors cursor-pointer ${
                    categoriesDropdownOpen
                      ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                      : 'hover:text-[#C5A880]'
                  }`}
                >
                  <span>Atelier Departments</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {/* Dropdown Menu */}
                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-[580px] pt-3 z-50">
                    <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-5 shadow-2xl grid grid-cols-2 gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNavClick('shop', { category: cat.id })}
                          className="flex items-start space-x-3 p-3 rounded-xl hover:bg-[#1C1C1C] transition-all text-left group cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-[#181818] border border-[#262626] group-hover:border-[#C5A880] transition-colors shrink-0">
                            {getCategoryIcon(cat.iconName)}
                          </div>
                          <div>
                            <div className="text-xs font-serif font-bold text-[#F5F2EB] group-hover:text-[#C5A880] flex items-center">
                              {cat.shortName}
                              <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#C5A880]" />
                            </div>
                            <p className="text-[11px] text-[#8C867B] line-clamp-1 mt-0.5 font-normal">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      ))}

                      <div className="col-span-2 pt-3 mt-1 border-t border-[#222222] flex items-center justify-between px-2 text-xs">
                        <button
                          onClick={() => handleNavClick('finder')}
                          className="text-[#C5A880] hover:underline font-bold text-[11px] uppercase tracking-wider flex items-center cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 mr-1.5" />
                          Launch Style & Capsule Finder
                        </button>
                        <button
                          onClick={() => handleNavClick('shop')}
                          className="text-[#A0988A] hover:text-white font-semibold text-[11px] uppercase tracking-wider cursor-pointer"
                        >
                          All Ready-To-Wear &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                id="nav-link-canvas"
                onClick={() => setIsCanvasOpen(true)}
                className="py-1 flex items-center space-x-1.5 text-stone-300 hover:text-[#C5A880] transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Fashion Canvas</span>
                {fashionCanvas.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#C5A880] text-black text-[9px] rounded-full font-bold">
                    {fashionCanvas.length}
                  </span>
                )}
              </button>

              <button
                id="nav-link-finder"
                onClick={() => handleNavClick('finder')}
                className={`py-1 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  currentView === 'finder'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Style Finder</span>
              </button>

              <button
                id="nav-link-offers"
                onClick={() => handleNavClick('offers')}
                className={`py-1 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  currentView === 'offers'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                <span>Shop The Look</span>
              </button>

              <button
                id="nav-link-comparison"
                onClick={() => handleNavClick('comparison')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentView === 'comparison'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                Compare
                {comparisonItems.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#C5A880] text-black text-[9px] rounded-full font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </button>

              <button
                id="nav-link-seller"
                onClick={() => handleNavClick('seller')}
                className={`py-1 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  currentView === 'seller'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isSeller ? 'Designer Hub' : 'Partner Atelier'}</span>
              </button>

              <button
                id="nav-link-support"
                onClick={() => handleNavClick('support')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentView === 'support'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                Concierge
              </button>

              {isAdmin && (
                <button
                  id="nav-link-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`py-1 flex items-center space-x-1 font-bold text-[#C5A880] transition-colors cursor-pointer ${
                    currentView === 'admin'
                      ? 'underline underline-offset-8 decoration-[#C5A880] decoration-2'
                      : 'hover:opacity-80'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                  <span>Admin Suite</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {/* Search Button */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors flex items-center space-x-2 group cursor-pointer"
              title="Search collection (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Button */}
            <button
              id="navbar-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#C5A880] text-black text-[9px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              id="navbar-wishlist-btn"
              onClick={() => handleNavClick('wishlist')}
              className="p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
              title="Saved Pieces (Wishlist)"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#C5A880] text-black text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Fashion Canvas Button */}
            <button
              id="navbar-canvas-btn"
              onClick={() => setIsCanvasOpen(true)}
              className="p-2 rounded-full text-[#C5A880] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
              title="Fashion Canvas (Digital Wardrobe)"
            >
              <Layers className="w-4 h-4" />
              {fashionCanvas.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#C5A880] text-black text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {fashionCanvas.length}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button
              id="navbar-account-btn"
              onClick={() => handleNavClick('account')}
              className="p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
              title={currentUser ? `Account (${currentUser.name})` : 'Account'}
            >
              <User className="w-4 h-4" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-black" />
              )}
            </button>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black transition-colors flex items-center justify-center cursor-pointer shadow-md"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-[#C5A880] text-[9px] font-mono flex items-center justify-center rounded-full font-bold border border-[#C5A880]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-300 hover:bg-[#1A1A1A] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-drawer-menu"
            className="mobile-nav-drawer lg:hidden bg-[#0A0A0A] border-b border-[#1F1F1F] px-6 py-6 space-y-4 shadow-2xl h-[100dvh] max-h-[calc(100dvh-4.5rem)] overflow-y-auto [overscroll-behavior-y:contain]"
          >
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#1F1F1F]">
              <button
                onClick={() => handleNavClick('shop')}
                className="p-2.5 bg-[#121212] rounded-xl text-left border border-[#222222] hover:border-[#C5A880]"
              >
                <div className="text-xs font-serif font-bold text-[#F5F2EB]">Collections</div>
                <div className="text-[10px] text-stone-400">Ready-to-Wear</div>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCanvasOpen(true);
                }}
                className="p-2.5 bg-[#121212] rounded-xl text-left border border-[#222222] hover:border-[#C5A880] relative"
              >
                <div className="text-xs font-serif font-bold text-[#C5A880] flex items-center justify-between">
                  <span className="flex items-center">
                    <Layers className="w-3 h-3 mr-1" />
                    Canvas
                  </span>
                  {fashionCanvas.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#C5A880] text-black text-[9px] rounded-full font-bold">
                      {fashionCanvas.length}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-stone-400">Digital Wardrobe</div>
              </button>
              <button
                onClick={() => handleNavClick('finder')}
                className="p-2.5 bg-[#121212] rounded-xl text-left border border-[#222222] hover:border-[#C5A880]"
              >
                <div className="text-xs font-serif font-bold text-[#F5F2EB] flex items-center">
                  <Compass className="w-3 h-3 mr-1 text-[#C5A880]" />
                  Style Finder
                </div>
                <div className="text-[10px] text-stone-400">Capsule AI</div>
              </button>
              <button
                onClick={() => handleNavClick('seller')}
                className="p-2.5 bg-[#121212] rounded-xl text-left border border-[#222222] hover:border-[#C5A880]"
              >
                <div className="text-xs font-serif font-bold text-[#F5F2EB] flex items-center">
                  <Store className="w-3 h-3 mr-1 text-[#C5A880]" />
                  Designer Hub
                </div>
                <div className="text-[10px] text-stone-400">Atelier Partners</div>
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-2 mb-1">
                Atelier Departments
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleNavClick('shop', { category: c.id })}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:bg-[#121212] text-left"
                  >
                    {getCategoryIcon(c.iconName)}
                    <span className="truncate">{c.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F1F1F] space-y-1">
              <button
                onClick={() => handleNavClick('finder')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#C5A880] bg-[#121212] border border-[#222222] hover:border-[#C5A880]"
              >
                <span className="flex items-center">
                  <Compass className="w-4 h-4 text-[#C5A880] mr-2" />
                  Style & Capsule Finder
                </span>
                <span className="text-[10px] bg-[#C5A880]/20 text-[#C5A880] px-2 py-0.5 rounded font-bold">
                  AI STYLIST
                </span>
              </button>
              <button
                onClick={() => handleNavClick('offers')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#F5F2EB] hover:bg-[#121212]"
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] mr-2" />
                  Shop The Look Ensembles
                </span>
                <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-bold">
                  Capsules
                </span>
              </button>
              <button
                onClick={() => handleNavClick('comparison')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#C5A880] hover:bg-[#121212]"
              >
                <span>Compare Garments</span>
                {comparisonItems.length > 0 && (
                  <span className="text-[10px] bg-[#C5A880] text-black px-2 py-0.5 rounded font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsNotificationsOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#C5A880] hover:bg-[#121212]"
              >
                <span>Notifications & Alerts</span>
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="text-[10px] bg-[#C5A880] text-black px-2 py-0.5 rounded-full font-bold">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('tracking')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#C5A880] hover:bg-[#121212]"
              >
                <span>Track Order</span>
              </button>
              <button
                onClick={() => handleNavClick('support')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#C5A880] hover:bg-[#121212]"
              >
                <span>Atelier Concierge & Care</span>
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#C5A880] hover:bg-[#121212]"
              >
                <span>Client Account Portal</span>
                {currentUser && <span className="text-[10px] text-emerald-400 font-bold">Active</span>}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateOrders={() => handleNavClick('account')}
      />
    </>
  );
};
