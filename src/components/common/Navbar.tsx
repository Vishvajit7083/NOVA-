import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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

  // Navigation rail scroll & drag states
  const navRailRef = useRef<HTMLDivElement | null>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const dragDistanceRef = useRef(0);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 16, top: 64 });

  const announcements = [
    '✦ SINDHUDURG GARMENTS: Pure Silk Sarees, Linen Shirts & 240 GSM Heavyweight T-Shirts',
    '🚚 Complimentary Insured Delivery on orders above ₹1,999 • 14-Day Doorstep Size Exchanges',
    '🎁 Welcome Offer: Use code "SINDHUDURG10" at checkout for 10% savings on your first order',
  ];

  // Rotate announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [announcements.length]);

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

  // Check scroll boundary state for fade indicators
  const updateScrollIndicators = useCallback(() => {
    const rail = navRailRef.current;
    if (!rail) return;
    const { scrollLeft, scrollWidth, clientWidth } = rail;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const rail = navRailRef.current;
    if (!rail) return;

    updateScrollIndicators();
    const handleResize = () => updateScrollIndicators();
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      updateScrollIndicators();
    });
    resizeObserver.observe(rail);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [updateScrollIndicators]);

  // Handle smooth scroll by arrow buttons
  const scrollByAmount = (amount: number) => {
    if (!navRailRef.current) return;
    navRailRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRailRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - navRailRef.current.offsetLeft);
    setScrollStart(navRailRef.current.scrollLeft);
    dragDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !navRailRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRailRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    dragDistanceRef.current += Math.abs(walk);
    navRailRef.current.scrollLeft = scrollStart - walk;
    updateScrollIndicators();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Slight delay to distinguish between drag and clean click
    setTimeout(() => {
      dragDistanceRef.current = 0;
    }, 60);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!navRailRef.current) return;
    // Support trackpad horizontal and regular mouse vertical wheel / Shift+wheel
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta !== 0) {
      navRailRef.current.scrollLeft += delta;
      updateScrollIndicators();
    }
  };

  const handleItemClick = (action: () => void) => {
    if (dragDistanceRef.current > 8) {
      return; // Suppress action if user was dragging
    }
    action();
  };

  const handleNavClick = (view: string, params?: any) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dropdown opening positioning
  const openDropdown = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      const idealLeft = Math.max(12, Math.min(rect.left - 40, window.innerWidth - 600));
      setDropdownPos({
        left: idealLeft,
        top: rect.bottom + 8,
      });
    }
    setCategoriesDropdownOpen(true);
  };

  const closeDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCategoriesDropdownOpen(false);
    }, 150);
  };

  // Keyboard navigation on nav rail
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!navRailRef.current) return;
    if (e.key === 'ArrowRight') {
      navRailRef.current.scrollBy({ left: 120, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      navRailRef.current.scrollBy({ left: -120, behavior: 'smooth' });
    }
  };

  const handleItemFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
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
        className="bg-[#111111] text-[#E8E2D9] text-[10px] sm:text-[11px] font-medium tracking-widest py-2 px-4 sm:px-6 border-b border-[#2A2A2A] relative z-40"
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 text-center truncate pr-2">
            <span className="inline-block transition-opacity duration-300">
              {announcements[announcementIndex]}
            </span>
          </div>
          <div className="hidden lg:flex items-center space-x-6 text-[#A0988A] shrink-0 text-[10px] uppercase font-semibold tracking-widest">
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
              Style Concierge
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header with Horizontal Scroll Rail */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-30 transition-all duration-300 w-full max-w-full overflow-x-clip ${
          isScrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1F1F1F] shadow-lg py-2 sm:py-3.5'
            : 'bg-[#0A0A0A] border-b border-[#1F1F1F] py-2.5 sm:py-4'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Brand Wordmark / Fixed Logo on the left */}
          <div className="shrink-0 flex items-center min-w-0">
            <button
              id="navbar-brand-logo"
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-1.5 text-left group focus:outline-none cursor-pointer min-w-0"
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center min-w-0">
                  <span className="text-[13px] xs:text-sm sm:text-lg lg:text-2xl font-serif font-bold tracking-[0.06em] sm:tracking-[0.14em] text-[#F5F2EB] whitespace-nowrap">
                    SINDHUDURG GARMENTS
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] ml-1 mb-0.5 shrink-0" />
                </div>
                <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-[#C5A880] -mt-0.5 font-semibold">
                  सिंधुदुर्ग • KONKAN
                </span>
              </div>
            </button>
          </div>

          {/* Horizontal Scrollable Navigation Rail - Visible on lg and above */}
          <div
            id="navbar-nav-rail-wrapper"
            className="hidden lg:flex flex-1 min-w-0 relative px-1 sm:px-2 mx-1 sm:mx-3 items-center overflow-hidden group/rail"
          >
            {/* Left Fade Indicator with Click Arrow */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-8 lg:w-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent flex items-center justify-start z-10 pointer-events-none transition-opacity duration-200 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={() => scrollByAmount(-220)}
                className="pointer-events-auto ml-0.5 p-1 rounded-full bg-[#181818]/90 text-[#C5A880] hover:text-white hover:bg-[#282828] border border-[#2F2F2F] shadow-lg transition-all cursor-pointer flex items-center justify-center"
                title="Scroll Left"
                aria-label="Scroll left in navigation"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Track */}
            <nav
              ref={navRailRef}
              id="navbar-scrollable-track"
              onScroll={updateScrollIndicators}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              aria-label="Atelier Navigation Categories"
              className={`w-full overflow-x-auto no-scrollbar flex items-center space-x-5 sm:space-x-7 text-[11px] font-semibold uppercase tracking-widest text-stone-300 py-1 select-none scroll-smooth focus:outline-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* 1. Sarees */}
              <button
                id="nav-link-sarees"
                onClick={() => handleItemClick(() => handleNavClick('sarees'))}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  currentView === 'sarees'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2 font-bold'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <span>Sarees</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#C5A880]/20 text-[#C5A880] tracking-normal border border-[#C5A880]/40">
                  NEW
                </span>
              </button>

              {/* 2. Shirts */}
              <button
                id="nav-link-shirts"
                onClick={() => handleItemClick(() => handleNavClick('shop', { category: 'shirts' }))}
                onFocus={handleItemFocus}
                className="shrink-0 py-1 transition-colors cursor-pointer hover:text-[#C5A880] whitespace-nowrap"
              >
                Shirts
              </button>

              {/* 3. T-Shirts */}
              <button
                id="nav-link-tees"
                onClick={() => handleItemClick(() => handleNavClick('shop', { category: 'kokani-tshirts' }))}
                onFocus={handleItemFocus}
                className="shrink-0 py-1 transition-colors cursor-pointer hover:text-[#C5A880] whitespace-nowrap"
              >
                T-Shirts
              </button>

              {/* 4. Collections */}
              <button
                id="nav-link-store"
                onClick={() => handleItemClick(() => handleNavClick('shop'))}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                  currentView === 'store' || currentView === 'shop'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                Collections
              </button>

              {/* 5. Collections Dropdown Button */}
              <button
                ref={dropdownButtonRef}
                id="nav-link-categories-dropdown"
                onClick={() => {
                  if (dragDistanceRef.current > 8) return;
                  if (categoriesDropdownOpen) {
                    setCategoriesDropdownOpen(false);
                  } else {
                    openDropdown();
                  }
                }}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 flex items-center space-x-1 transition-colors cursor-pointer whitespace-nowrap ${
                  categoriesDropdownOpen
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* 6. Style Studio */}
              <button
                id="nav-link-canvas"
                onClick={() => handleItemClick(() => setIsCanvasOpen(true))}
                onFocus={handleItemFocus}
                className="shrink-0 py-1 flex items-center space-x-1.5 text-stone-300 hover:text-[#C5A880] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Style Studio</span>
                {fashionCanvas.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#C5A880] text-black text-[9px] rounded-full font-bold">
                    {fashionCanvas.length}
                  </span>
                )}
              </button>

              {/* 7. Style Finder */}
              <button
                id="nav-link-finder"
                onClick={() => handleItemClick(() => handleNavClick('finder'))}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  currentView === 'finder'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Style Finder</span>
              </button>

              {/* 8. Shop The Look */}
              <button
                id="nav-link-offers"
                onClick={() => handleItemClick(() => handleNavClick('offers'))}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  currentView === 'offers'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                <span>Shop The Look</span>
              </button>

              {/* 9. Compare */}
              <button
                id="nav-link-comparison"
                onClick={() => handleItemClick(() => handleNavClick('comparison'))}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                  currentView === 'comparison'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <span>Compare</span>
                {comparisonItems.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#C5A880] text-black text-[9px] rounded-full font-bold">
                    {comparisonItems.length}
                  </span>
                )}
              </button>

              {/* 10. Partner Hub */}
              <button
                id="nav-link-seller"
                onClick={() => handleItemClick(() => handleNavClick('seller'))}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  currentView === 'seller'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isSeller ? 'Artisan Hub' : 'Partner Hub'}</span>
              </button>

              {/* 11. Style Concierge */}
              <button
                id="nav-link-support"
                onClick={() => handleItemClick(() => handleNavClick('support'))}
                onFocus={handleItemFocus}
                className={`shrink-0 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                  currentView === 'support'
                    ? 'text-[#C5A880] underline underline-offset-8 decoration-[#C5A880] decoration-2'
                    : 'hover:text-[#C5A880]'
                }`}
              >
                Style Concierge
              </button>

              {/* 12. Admin Suite */}
              {isAdmin && (
                <button
                  id="nav-link-admin"
                  onClick={() => handleItemClick(() => handleNavClick('admin'))}
                  onFocus={handleItemFocus}
                  className={`shrink-0 py-1 flex items-center space-x-1 font-bold text-[#C5A880] transition-colors cursor-pointer whitespace-nowrap ${
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

            {/* Right Fade Indicator with Click Arrow */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-8 lg:w-10 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent flex items-center justify-end z-10 pointer-events-none transition-opacity duration-200 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={() => scrollByAmount(220)}
                className="pointer-events-auto mr-0.5 p-1 rounded-full bg-[#181818]/90 text-[#C5A880] hover:text-white hover:bg-[#282828] border border-[#2F2F2F] shadow-lg transition-all cursor-pointer flex items-center justify-center"
                title="Scroll Right"
                aria-label="Scroll right in navigation"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Action Icons */}
          {/* Right Action Icons Cluster */}
          <div className="shrink-0 flex items-center space-x-0.5 sm:space-x-2">
            {/* Search Button */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors flex items-center space-x-2 group cursor-pointer"
              title="Search collection (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Button - Desktop/Tablet */}
            <button
              id="navbar-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
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
              className="p-1.5 sm:p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
              title="Saved Pieces (Wishlist)"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#C5A880] text-black text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Fashion Canvas Button - Desktop/Tablet */}
            <button
              id="navbar-canvas-btn"
              onClick={() => setIsCanvasOpen(true)}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-full text-[#C5A880] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
              title="Fashion Canvas (Digital Wardrobe)"
            >
              <Layers className="w-4 h-4" />
              {fashionCanvas.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#C5A880] text-black text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {fashionCanvas.length}
                </span>
              )}
            </button>

            {/* Account Button - Desktop/Tablet */}
            <button
              id="navbar-account-btn"
              onClick={() => handleNavClick('account')}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-full text-[#A0988A] hover:text-[#F5F2EB] hover:bg-[#1A1A1A] transition-colors relative cursor-pointer"
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
              className="relative p-1.5 sm:p-2.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black transition-colors flex items-center justify-center cursor-pointer shadow-md"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-[#C5A880] text-[9px] font-mono flex items-center justify-center rounded-full font-bold border border-[#C5A880]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile/Tablet Menu Toggle Button */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-stone-300 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Floating Atelier Departments Mega Dropdown */}
        {categoriesDropdownOpen && (
          <div
            ref={dropdownMenuRef}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
            style={{
              position: 'fixed',
              top: `${dropdownPos.top}px`,
              left: `${dropdownPos.left}px`,
            }}
            className="w-[92vw] max-w-[580px] z-50 pt-2 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-5 shadow-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 backdrop-blur-xl">
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

              <div className="sm:col-span-2 pt-3 mt-1 border-t border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2 text-xs">
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

        {/* Mobile & Tablet Slide-down Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-drawer-menu"
            className="mobile-nav-drawer lg:hidden bg-[#0A0A0A] border-b border-[#1F1F1F] px-6 py-6 space-y-4 shadow-2xl h-[100dvh] max-h-[calc(100dvh-4.5rem)] overflow-y-auto [overscroll-behavior-y:contain]"
          >
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#1F1F1F]">
              <button
                onClick={() => handleNavClick('sarees')}
                className="p-2.5 bg-[#1A1815] rounded-xl text-left border border-[#C5A880]/50 hover:border-[#C5A880] relative"
              >
                <div className="text-xs font-serif font-bold text-[#C5A880] flex items-center justify-between">
                  <span>Sarees</span>
                  <span className="px-1.5 py-0.2 bg-[#C5A880] text-black text-[9px] rounded-full font-bold">
                    HOT
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">Paithani & Silk</div>
              </button>
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
                    Style Studio
                  </span>
                  {fashionCanvas.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#C5A880] text-black text-[9px] rounded-full font-bold">
                      {fashionCanvas.length}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-stone-400">Curate Looks</div>
              </button>
              <button
                onClick={() => handleNavClick('finder')}
                className="p-2.5 bg-[#121212] rounded-xl text-left border border-[#222222] hover:border-[#C5A880]"
              >
                <div className="text-xs font-serif font-bold text-[#F5F2EB] flex items-center">
                  <Compass className="w-3 h-3 mr-1 text-[#C5A880]" />
                  Style Finder
                </div>
                <div className="text-[10px] text-stone-400">Styling Assistant</div>
              </button>
              <button
                onClick={() => handleNavClick('seller')}
                className="p-2.5 bg-[#121212] rounded-xl text-left border border-[#222222] hover:border-[#C5A880]"
              >
                <div className="text-xs font-serif font-bold text-[#F5F2EB] flex items-center">
                  <Store className="w-3 h-3 mr-1 text-[#C5A880]" />
                  Partner Hub
                </div>
                <div className="text-[10px] text-stone-400">Artisan Weavers</div>
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-2 mb-1">
                Collections
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
                <span>Style Concierge & Help</span>
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#C5A880] hover:bg-[#121212]"
              >
                <span>My Account</span>
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
