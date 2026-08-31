import React, { useState, useEffect } from 'react';
import {
  Zap,
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  Shield,
  Sparkles,
  Layers,
  Headphones,
  Car,
  Cpu,
  Watch,
  Bell,
  Store,
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
    setIsAuthModalOpen,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessoriesDropdownOpen, setAccessoriesDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    '⚡ FLAGSHIP DROP: NOVA HyperCharge 120W GaN Pro Station is now live with 2-Year Warranty',
    '🚚 Free Express Shipping across India on all orders above ₹999 | No code required',
    '🎁 Use Code "NOVA10" at checkout for Flat 10% Instant Savings on your first purchase',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const handleNavClick = (view: string, params?: any) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
    setAccessoriesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-4 h-4 text-[#EB0029]" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Headphones':
        return <Headphones className="w-4 h-4 text-rose-400" />;
      case 'Watch':
        return <Watch className="w-4 h-4 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Car':
        return <Car className="w-4 h-4 text-blue-400" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        id="announcement-bar"
        className="bg-[#F9FAFB] text-gray-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest py-2 px-6 border-b border-gray-100 relative z-40"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 text-center truncate">
            <span className="inline-block transition-opacity duration-300">
              {announcements[announcementIndex]}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-400 shrink-0 text-[10px] font-bold uppercase tracking-widest">
            <button
              onClick={() => handleNavClick('tracking')}
              className="hover:text-black transition-colors"
            >
              Track Order
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavClick('support')}
              className="hover:text-black transition-colors"
            >
              24-Month Warranty
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3.5'
            : 'bg-white border-b border-gray-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand Wordmark / Logo */}
          <div className="flex items-center space-x-10">
            <button
              id="navbar-brand-logo"
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-sm group-hover:bg-[#EB0028] transition-colors">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tighter text-black">
                  NOVA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] ml-1" />
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <button
                id="nav-link-store"
                onClick={() => handleNavClick('store')}
                className={`py-1 transition-colors ${
                  currentView === 'store'
                    ? 'text-black underline underline-offset-8 decoration-[#EB0028] decoration-2'
                    : 'hover:text-black'
                }`}
              >
                Store
              </button>

              {/* Accessories with Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAccessoriesDropdownOpen(true)}
                onMouseLeave={() => setAccessoriesDropdownOpen(false)}
              >
                <button
                  id="nav-link-accessories-dropdown"
                  onClick={() => handleNavClick('store')}
                  className={`py-1 flex items-center space-x-1 transition-colors ${
                    accessoriesDropdownOpen || currentView === 'store'
                      ? 'text-black underline underline-offset-8 decoration-[#EB0028] decoration-2'
                      : 'hover:text-black'
                  }`}
                >
                  <span>Accessories</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Dropdown Menu */}
                {accessoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-[540px] pt-3 z-50">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl grid grid-cols-2 gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNavClick('store', { category: cat.id })}
                          className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left group"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 border border-gray-200 group-hover:border-[#EB0028]/40 transition-colors shrink-0">
                            {getCategoryIcon(cat.iconName)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-black group-hover:text-[#EB0028] flex items-center">
                              {cat.shortName}
                              <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#EB0028]" />
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 font-normal">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      ))}

                      <div className="col-span-2 pt-3 mt-1 border-t border-gray-100 flex items-center justify-between px-2 text-xs">
                        <button
                          onClick={() => handleNavClick('finder')}
                          className="text-[#EB0028] hover:underline font-bold text-[11px] uppercase tracking-wider flex items-center"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                          Launch Device Matcher
                        </button>
                        <button
                          onClick={() => handleNavClick('store')}
                          className="text-gray-500 hover:text-black font-semibold text-[11px] uppercase tracking-wider"
                        >
                          Browse All Catalog &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                id="nav-link-finder"
                onClick={() => handleNavClick('finder')}
                className={`py-1 flex items-center space-x-1.5 transition-colors ${
                  currentView === 'finder'
                    ? 'text-black underline underline-offset-8 decoration-[#EB0028] decoration-2'
                    : 'hover:text-black'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#EB0028]" />
                <span>Device Matcher</span>
              </button>

              <button
                id="nav-link-offers"
                onClick={() => handleNavClick('offers')}
                className={`py-1 flex items-center space-x-1.5 transition-colors ${
                  currentView === 'offers'
                    ? 'text-black underline underline-offset-8 decoration-[#EB0028] decoration-2'
                    : 'hover:text-black'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028]" />
                <span>Offers</span>
              </button>

              <button
                id="nav-link-comparison"
                onClick={() => handleNavClick('comparison')}
                className={`py-1 transition-colors ${
                  currentView === 'comparison'
                    ? 'text-black underline underline-offset-8 decoration-[#EB0028] decoration-2'
                    : 'hover:text-black'
                }`}
              >
                Compare
                {comparisonItems.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#EB0028] text-white text-[9px] rounded-full font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </button>

              <button
                id="nav-link-seller"
                onClick={() => handleNavClick('seller')}
                className={`py-1 flex items-center space-x-1.5 transition-colors ${
                  currentView === 'seller'
                    ? 'text-black underline underline-offset-8 decoration-[#EB0028] decoration-2'
                    : 'hover:text-black'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#EB0028]" />
                <span>{isSeller ? 'Seller Hub' : 'Sell on NOVA'}</span>
              </button>

              <button
                id="nav-link-support"
                onClick={() => handleNavClick('support')}
                className={`py-1 transition-colors ${
                  currentView === 'support'
                    ? 'text-black underline underline-offset-8 decoration-[#EB0028] decoration-2'
                    : 'hover:text-black'
                }`}
              >
                Support
              </button>

              {isAdmin && (
                <button
                  id="nav-link-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`py-1 flex items-center space-x-1 font-bold text-[#EB0028] transition-colors ${
                    currentView === 'admin'
                      ? 'underline underline-offset-8 decoration-[#EB0028] decoration-2'
                      : 'hover:opacity-80'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-pulse" />
                  <span>Admin Panel</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Button */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors flex items-center space-x-2 group"
              title="Search accessories (Cmd+K)"
            >
              <Search className="w-5 h-5 text-black" />
            </button>

            {/* Notifications Button */}
            <button
              id="navbar-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#EB0028] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              id="navbar-wishlist-btn"
              onClick={() => handleNavClick('wishlist')}
              className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#EB0028] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button
              id="navbar-account-btn"
              onClick={() => handleNavClick('account')}
              className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors relative"
              title={currentUser ? `Account (${currentUser.name})` : 'Account'}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-black hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-black" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#EB0028] text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-black hover:bg-gray-100 transition-colors"
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
            className="lg:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200"
          >
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
              <button
                onClick={() => handleNavClick('store')}
                className="p-3 bg-gray-50 rounded-xl text-left border border-gray-200 hover:border-black"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-black">Store</div>
                <div className="text-[11px] text-gray-500">All Flagship Gear</div>
              </button>
              <button
                onClick={() => handleNavClick('seller')}
                className="p-3 bg-gray-50 rounded-xl text-left border border-gray-200 hover:border-black"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-black flex items-center">
                  <Store className="w-3 h-3 mr-1 text-[#EB0028]" />
                  Seller Hub
                </div>
                <div className="text-[11px] text-gray-500">Partner Portal</div>
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">
                Shop By Category
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleNavClick('store', { category: c.id })}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 text-left"
                  >
                    {getCategoryIcon(c.iconName)}
                    <span className="truncate">{c.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1">
              <button
                onClick={() => handleNavClick('offers')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-black hover:bg-gray-50"
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] mr-2" />
                  Offers & Bundles
                </span>
                <span className="text-[10px] bg-[#EB0028]/10 text-[#EB0028] px-2 py-0.5 rounded font-bold">
                  Up to 40% Off
                </span>
              </button>
              <button
                onClick={() => handleNavClick('comparison')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50"
              >
                <span>Spec Comparison Matrix</span>
                {comparisonItems.length > 0 && (
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsNotificationsOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50"
              >
                <span>Notifications & Alerts</span>
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="text-[10px] bg-[#EB0028] text-white px-2 py-0.5 rounded-full font-bold">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('tracking')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50"
              >
                <span>Order Tracking</span>
              </button>
              <button
                onClick={() => handleNavClick('support')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50"
              >
                <span>Support & Warranty</span>
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50"
              >
                <span>Account Portal</span>
                {currentUser && <span className="text-[10px] text-emerald-600 font-bold">Active</span>}
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
