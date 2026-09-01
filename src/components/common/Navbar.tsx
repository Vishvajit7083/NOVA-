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
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-sm py-3.5'
            : 'bg-[#FDFBF7] border-b border-[#E8E2D9] py-4'
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
                  <span className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.18em] text-[#111111]">
                    AURELIA
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38] ml-1.5 mb-1" />
                </div>
                <span className="text-[8px] uppercase tracking-[0.35em] text-[#9A7B38] -mt-1 font-semibold">
                  HAUTE COUTURE
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-semibold uppercase tracking-widest text-stone-600">
              
              <button
                id="nav-link-store"
                onClick={() => handleNavClick('shop')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentView === 'store' || currentView === 'shop'
                    ? 'text-[#111111] underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                    : 'hover:text-[#111111]'
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
                      ? 'text-[#111111] underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                      : 'hover:text-[#111111]'
                  }`}
                >
                  <span>Atelier Departments</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {/* Dropdown Menu */}
                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-[580px] pt-3 z-50">
                    <div className="bg-white border border-[#E5DFD5] rounded-2xl p-5 shadow-2xl grid grid-cols-2 gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNavClick('shop', { category: cat.id })}
                          className="flex items-start space-x-3 p-3 rounded-xl hover:bg-[#FAF8F5] transition-all text-left group cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-[#F5F2EB] border border-[#E8E2D9] group-hover:border-[#9A7B38] transition-colors shrink-0">
                            {getCategoryIcon(cat.iconName)}
                          </div>
                          <div>
                            <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#9A7B38] flex items-center">
                              {cat.shortName}
                              <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#9A7B38]" />
                            </div>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-normal">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      ))}

                      <div className="col-span-2 pt-3 mt-1 border-t border-[#F0EBE1] flex items-center justify-between px-2 text-xs">
                        <button
                          onClick={() => handleNavClick('finder')}
                          className="text-[#9A7B38] hover:underline font-bold text-[11px] uppercase tracking-wider flex items-center cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 mr-1.5" />
                          Launch Style & Capsule Finder
                        </button>
                        <button
                          onClick={() => handleNavClick('shop')}
                          className="text-stone-500 hover:text-stone-900 font-semibold text-[11px] uppercase tracking-wider cursor-pointer"
                        >
                          All Ready-To-Wear &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                id="nav-link-finder"
                onClick={() => handleNavClick('finder')}
                className={`py-1 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  currentView === 'finder'
                    ? 'text-[#111111] underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>Style Finder</span>
              </button>

              <button
                id="nav-link-offers"
                onClick={() => handleNavClick('offers')}
                className={`py-1 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  currentView === 'offers'
                    ? 'text-[#111111] underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                    : 'hover:text-[#111111]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
                <span>Shop The Look</span>
              </button>

              <button
                id="nav-link-comparison"
                onClick={() => handleNavClick('comparison')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentView === 'comparison'
                    ? 'text-[#111111] underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                    : 'hover:text-[#111111]'
                }`}
              >
                Compare
                {comparisonItems.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#9A7B38] text-white text-[9px] rounded-full font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </button>

              <button
                id="nav-link-seller"
                onClick={() => handleNavClick('seller')}
                className={`py-1 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  currentView === 'seller'
                    ? 'text-[#111111] underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                    : 'hover:text-[#111111]'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#9A7B38]" />
                <span>{isSeller ? 'Designer Hub' : 'Partner Atelier'}</span>
              </button>

              <button
                id="nav-link-support"
                onClick={() => handleNavClick('support')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentView === 'support'
                    ? 'text-[#111111] underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                    : 'hover:text-[#111111]'
                }`}
              >
                Concierge
              </button>

              {isAdmin && (
                <button
                  id="nav-link-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`py-1 flex items-center space-x-1 font-bold text-[#9A7B38] transition-colors cursor-pointer ${
                    currentView === 'admin'
                      ? 'underline underline-offset-8 decoration-[#9A7B38] decoration-2'
                      : 'hover:opacity-80'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38] animate-pulse" />
                  <span>Admin Suite</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4">
            
            {/* Search Button */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-stone-800 hover:bg-[#F0EBE1] transition-colors flex items-center space-x-2 group cursor-pointer"
              title="Search collection (Cmd+K)"
            >
              <Search className="w-5 h-5 text-stone-800" />
            </button>

            {/* Notifications Button */}
            <button
              id="navbar-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-full text-stone-800 hover:bg-[#F0EBE1] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#9A7B38] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              id="navbar-wishlist-btn"
              onClick={() => handleNavClick('wishlist')}
              className="p-2 rounded-full text-stone-800 hover:bg-[#F0EBE1] transition-colors relative cursor-pointer"
              title="Saved Pieces (Wishlist)"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#9A7B38] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button
              id="navbar-account-btn"
              onClick={() => handleNavClick('account')}
              className="p-2 rounded-full text-stone-800 hover:bg-[#F0EBE1] transition-colors relative cursor-pointer"
              title={currentUser ? `Account (${currentUser.name})` : 'Account'}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#9A7B38] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-800 hover:bg-[#F0EBE1] transition-colors"
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
            className="mobile-nav-drawer lg:hidden bg-white border-b border-[#E8E2D9] px-6 py-6 space-y-4 shadow-xl h-[100dvh] max-h-[calc(100dvh-4.5rem)] overflow-y-auto [overscroll-behavior-y:contain]"
          >
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#F0EBE1]">
              <button
                onClick={() => handleNavClick('shop')}
                className="p-3 bg-[#FAF8F5] rounded-xl text-left border border-[#E8E2D9] hover:border-[#111111]"
              >
                <div className="text-xs font-serif font-bold text-stone-900">Collections</div>
                <div className="text-[11px] text-stone-500">All Ready-to-Wear</div>
              </button>
              <button
                onClick={() => handleNavClick('seller')}
                className="p-3 bg-[#FAF8F5] rounded-xl text-left border border-[#E8E2D9] hover:border-[#111111]"
              >
                <div className="text-xs font-serif font-bold text-stone-900 flex items-center">
                  <Store className="w-3 h-3 mr-1 text-[#9A7B38]" />
                  Designer Hub
                </div>
                <div className="text-[11px] text-stone-500">Partner Atelier</div>
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2 mb-1">
                Atelier Departments
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleNavClick('shop', { category: c.id })}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-800 hover:bg-[#FAF8F5] text-left"
                  >
                    {getCategoryIcon(c.iconName)}
                    <span className="truncate">{c.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] space-y-1">
              <button
                onClick={() => handleNavClick('finder')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-900 hover:bg-[#FAF8F5]"
              >
                <span className="flex items-center">
                  <Compass className="w-4 h-4 text-[#9A7B38] mr-2" />
                  Style & Capsule Finder
                </span>
                <span className="text-[10px] bg-[#9A7B38]/15 text-[#9A7B38] px-2 py-0.5 rounded font-bold">
                  Bespoke
                </span>
              </button>
              <button
                onClick={() => handleNavClick('offers')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-900 hover:bg-[#FAF8F5]"
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38] mr-2" />
                  Shop The Look Ensembles
                </span>
                <span className="text-[10px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-bold">
                  Capsules
                </span>
              </button>
              <button
                onClick={() => handleNavClick('comparison')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF8F5]"
              >
                <span>Compare Garments</span>
                {comparisonItems.length > 0 && (
                  <span className="text-[10px] bg-[#111111] text-white px-2 py-0.5 rounded font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsNotificationsOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF8F5]"
              >
                <span>Notifications & Alerts</span>
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="text-[10px] bg-[#9A7B38] text-white px-2 py-0.5 rounded-full font-bold">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('tracking')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF8F5]"
              >
                <span>Track Order</span>
              </button>
              <button
                onClick={() => handleNavClick('support')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF8F5]"
              >
                <span>Atelier Concierge & Care</span>
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF8F5]"
              >
                <span>Client Account Portal</span>
                {currentUser && <span className="text-[10px] text-emerald-700 font-bold">Active</span>}
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
