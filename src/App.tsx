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

import {
  SlidersHorizontal,
  Heart,
  Headphones,
  ArrowUp,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { comparisonItems, wishlist } = useShop();

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

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col selection:bg-[#EB0028] selection:text-white font-sans antialiased">
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
            {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}

            {currentView === 'store' && (
              <StorePage
                initialCategory={viewParams.category}
                initialDeviceFilter={viewParams.device}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'product-detail' && (
              <ProductDetailPage
                productId={viewParams.productId || 'nova-hypercharge-120w'}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}

            {currentView === 'order-confirmation' && (
              <OrderConfirmationPage
                orderId={viewParams.orderId}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'tracking' && (
              <OrderTrackingPage
                trackingNumber={viewParams.trackingNumber}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'account' && <AccountPage onNavigate={handleNavigate} />}

            {currentView === 'support' && <SupportPage onNavigate={handleNavigate} />}

            {currentView === 'compare' && <ComparisonPage onNavigate={handleNavigate} />}

            {currentView === 'offers' && <OffersPage onNavigate={handleNavigate} />}

            {currentView === 'wishlist' && <WishlistPage onNavigate={handleNavigate} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals and Portals */}
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
            className="px-4 py-2.5 rounded-full bg-black text-white hover:bg-[#EB0028] border border-gray-200 shadow-xl text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all hover:scale-105"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#EB0028]" />
            <span>Compare</span>
            <span className="w-5 h-5 rounded-full bg-[#EB0028] text-white text-[10px] flex items-center justify-center font-bold">
              {comparisonItems.length}
            </span>
          </button>
        )}

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white text-black hover:bg-black hover:text-white border border-gray-200 shadow-xl transition-all hover:scale-105"
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
