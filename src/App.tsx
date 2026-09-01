import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShopProvider, useShop } from './context/ShopContext';
import { CinematicWelcome } from './components/common/CinematicWelcome';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ImageViewerModal } from './components/common/ImageViewerModal';
import { Product360Viewer } from './components/common/Product360Viewer';
import { ToastContainer } from './components/common/ToastContainer';
import { AccessibilityControls } from './components/common/AccessibilityControls';
import { CartDrawer } from './components/cart/CartDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { SupportPage } from './pages/SupportPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { OffersPage, WishlistPage } from './pages/OffersPage';
import { AdminPage } from './pages/AdminPage';
import { SellerPortalPage } from './pages/SellerPortalPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { StyleFinderPage } from './pages/StyleFinderPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthModal } from './components/auth/AuthModal';

import {
  SlidersHorizontal,
  ArrowUp,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { comparisonItems } = useShop();

  const handleNavigate = (view: string, params: any = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
      case 'landing':
        return <HomePage onNavigate={handleNavigate} />;

      case 'collections':
        if (viewParams?.category) {
          return (
            <StorePage
              initialCategory={viewParams.category}
              initialDeviceFilter={viewParams.device}
              initialSearch={viewParams.search}
              onNavigate={handleNavigate}
            />
          );
        }
        return <CollectionsPage onNavigate={handleNavigate} />;

      case 'store':
      case 'shop':
      case 'products':
      case 'catalog':
      case 'ready-to-wear':
      case 'atelier':
        return (
          <StorePage
            initialCategory={viewParams.category}
            initialDeviceFilter={viewParams.device}
            initialSearch={viewParams.search}
            onNavigate={handleNavigate}
          />
        );

      case 'men':
      case 'men-apparel':
        return <StorePage initialCategory="men-apparel" onNavigate={handleNavigate} />;

      case 'women':
      case 'women-apparel':
        return <StorePage initialCategory="women-apparel" onNavigate={handleNavigate} />;

      case 'outerwear':
      case 'outerwear-jackets':
        return <StorePage initialCategory="outerwear-jackets" onNavigate={handleNavigate} />;

      case 'footwear':
      case 'footwear-shoes':
        return <StorePage initialCategory="footwear" onNavigate={handleNavigate} />;

      case 'bags':
      case 'bags-leather':
        return <StorePage initialCategory="bags-leather" onNavigate={handleNavigate} />;

      case 'watches':
      case 'watches-timepieces':
        return <StorePage initialCategory="watches-timepieces" onNavigate={handleNavigate} />;

      case 'jewellery':
      case 'jewellery-accessories':
        return <StorePage initialCategory="jewellery-accessories" onNavigate={handleNavigate} />;

      case 'streetwear':
      case 'streetwear-unisex':
        return <StorePage initialCategory="streetwear-unisex" onNavigate={handleNavigate} />;

      case 'product-detail':
      case 'product':
        return (
          <ProductDetailPage
            productId={viewParams.productId || 'nov-m-oxford-01'}
            onNavigate={handleNavigate}
          />
        );

      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;

      case 'order-confirmation':
        return (
          <OrderConfirmationPage
            orderId={viewParams.orderId}
            onNavigate={handleNavigate}
          />
        );

      case 'tracking':
      case 'track-order':
      case 'orders-tracking':
        return (
          <OrderTrackingPage
            trackingNumber={viewParams.trackingNumber}
            onNavigate={handleNavigate}
          />
        );

      case 'account':
      case 'profile':
      case 'orders':
        return <AccountPage onNavigate={handleNavigate} />;

      case 'support':
      case 'concierge':
      case 'care':
      case 'help':
        return <SupportPage onNavigate={handleNavigate} />;

      case 'compare':
      case 'comparison':
        return <ComparisonPage onNavigate={handleNavigate} />;

      case 'offers':
      case 'shop-the-look':
      case 'ensembles':
      case 'promotions':
        return <OffersPage onNavigate={handleNavigate} />;

      case 'wishlist':
      case 'shortlist':
        return <WishlistPage onNavigate={handleNavigate} />;

      case 'finder':
      case 'style-finder':
      case 'capsule-finder':
        return <StyleFinderPage onNavigate={handleNavigate} />;

      case 'designer-hub':
      case 'seller':
      case 'partners':
        return (
          <SellerPortalPage
            onNavigate={handleNavigate}
            onNavigateProduct={(pId) => handleNavigate('product-detail', { productId: pId })}
          />
        );

      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;

      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col selection:bg-[#9A7B38] selection:text-white font-sans antialiased">
      {/* Intro Overlay */}
      <CinematicWelcome />

      {/* Global Navigation Header */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Body View Switcher */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (viewParams?.productId ? `-${viewParams.productId}` : '') + (viewParams?.category ? `-${viewParams.category}` : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1"
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals and Portals */}
      <AuthModal onNavigate={handleNavigate} />
      <CartDrawer onNavigate={handleNavigate} />
      <SearchModal onNavigate={handleNavigate} />
      <QuickViewModal onNavigate={handleNavigate} />
      <ImageViewerModal />
      <Product360Viewer />
      <AccessibilityControls />
      <ToastContainer />

      {/* Floating Quick Action Badge Hub */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2.5">
        {/* Spec Comparison Quick Pill */}
        {comparisonItems.length > 0 && (
          <button
            onClick={() => handleNavigate('compare')}
            className="px-4 py-2.5 rounded-full bg-[#111111] text-white hover:bg-[#9A7B38] border border-[#333333] shadow-xl text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9A7B38]" />
            <span>Compare</span>
            <span className="w-5 h-5 rounded-full bg-[#9A7B38] text-white text-[10px] flex items-center justify-center font-bold">
              {comparisonItems.length}
            </span>
          </button>
        )}

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white text-stone-900 hover:bg-[#111111] hover:text-white border border-[#E0D8C8] shadow-xl transition-all hover:scale-105 cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
