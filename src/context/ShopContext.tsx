import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  SavedForLaterItem,
  WishlistItem,
  FashionCanvasItem,
  Order,
  Address,
  Coupon,
  UserProfile,
  ColorOption,
  ProductVariant,
  OrderStatus,
  OrderTrackingEvent,
  ProductQuestion,
  ReturnRequest,
  SellerProfile,
  AppNotification,
  SupportTicket,
} from '../types';
import { PRODUCTS } from '../data/products';
import { VALID_COUPONS } from '../data/faqs';
import {
  auth,
  isUserAdmin,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from '../lib/firebase';
import {
  seedInitialDatabaseIfEmpty,
  getProductsFromDB,
  getProductByIdFromDB,
  saveOrderToDB,
  getUserOrdersFromDB,
  saveUserProfileToDB,
  getUserProfileFromDB,
  saveCartToDB,
  getCartFromDB,
  saveWishlistToDB,
  getWishlistFromDB,
  submitReviewToDB,
  checkUserPurchasedProduct,
  getUserNotificationsFromDB,
  markNotificationReadInDB,
  markAllNotificationsReadInDB,
  createNotificationInDB,
  getUserReturnsFromDB,
  createReturnRequestInDB,
  cancelOrderInDB,
  getSellerProfileFromDB,
  registerSellerInDB,
  submitQuestionToDB,
  upvoteQuestionInDB,
  createSupportTicketInDB,
  getUserSupportTicketsFromDB,
  deleteOrderFromDB,
  clearUserOrdersFromDB,
} from '../lib/db';

interface ToastData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  savedForLater: SavedForLaterItem[];
  wishlist: WishlistItem[];
  comparisonItems: Product[];
  currentUser: UserProfile | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  orders: Order[];
  appliedCoupon: Coupon | null;
  recentlyViewed: Product[];
  recentSearches: string[];
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'forgot';
  quickViewProduct: Product | null;
  imageViewerData: { images: string[]; initialIndex: number } | null;
  viewer360Product: Product | null;
  toast: ToastData | null;
  reducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;

  // Cart actions
  addToCart: (product: Product, selectedColor?: ColorOption, selectedVariant?: ProductVariant, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (itemId: string) => void;
  moveToCartFromSaved: (savedId: string) => void;
  removeSavedForLater: (savedId: string) => void;

  // Calculations
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;

  // Wishlist actions
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  moveAllWishlistToCart: () => void;

  // Comparison actions
  toggleComparison: (product: Product) => void;
  isInComparison: (productId: string) => boolean;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;

  // Fashion Canvas (Digital Wardrobe)
  fashionCanvas: FashionCanvasItem[];
  isCanvasOpen: boolean;
  setIsCanvasOpen: (open: boolean) => void;
  isWardrobeOpen: boolean;
  setIsWardrobeOpen: (open: boolean) => void;
  addToCanvas: (product: Product, selectedColor?: ColorOption, selectedSize?: string) => void;
  removeFromCanvas: (itemId: string) => void;
  reorderCanvas: (startIndex: number, endIndex: number) => void;
  clearCanvas: () => void;
  moveCanvasToCart: () => void;
  isInCanvas: (productId: string) => boolean;

  // Coupons
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  placeOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingHistory'>) => Promise<Order>;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearOrderHistory: () => Promise<void>;

  // Reviews
  submitVerifiedReview: (productId: string, rating: number, title: string, comment: string) => Promise<{ success: boolean; isVerified: boolean; message: string }>;
  checkIsPurchased: (productId: string) => Promise<boolean>;

  // Q&A
  submitProductQuestion: (productId: string, productName: string, question: string) => Promise<{ success: boolean; message: string }>;
  upvoteProductQuestion: (questionId: string) => Promise<void>;

  // Returns & Cancellations
  userReturns: ReturnRequest[];
  refreshReturns: () => Promise<void>;
  requestReturn: (payload: {
    orderId: string;
    orderNumber: string;
    productId: string;
    productName: string;
    productImage: string;
    reason: ReturnRequest['reason'];
    reasonDetails: string;
    images?: string[];
    refundAmount: number;
  }) => Promise<{ success: boolean; returnNumber: string; message: string }>;
  cancelOrderAction: (orderId: string, reason: string) => Promise<{ success: boolean; message: string }>;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Seller Hub
  sellerProfile: SellerProfile | null;
  isSeller: boolean;
  registerSellerAccount: (sellerData: Omit<SellerProfile, 'id' | 'createdAt' | 'status' | 'rating' | 'totalSales' | 'earnings' | 'commissionRate'>) => Promise<{ success: boolean; message: string }>;
  refreshSellerProfile: () => Promise<void>;

  // Support Tickets
  userTickets: SupportTicket[];
  refreshTickets: () => Promise<void>;
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => Promise<{ success: boolean; ticketNumber: string }>;

  // User Auth & Profile
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  // UI state controls
  setIsSearchOpen: (open: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'signin' | 'signup' | 'forgot') => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openImageViewer: (images: string[], initialIndex?: number) => void;
  closeImageViewer: () => void;
  open360Viewer: (product: Product) => void;
  close360Viewer: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;

  // Search history
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Recently Viewed
  addRecentlyViewed: (product: Product) => void;

  // Accessibility
  setReducedMotion: (val: boolean) => void;
  setLargeText: (val: boolean) => void;
  setHighContrast: (val: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state from Firestore
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState<SavedForLaterItem[]>(() => {
    try {
      const saved = localStorage.getItem('nova_saved_for_later');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('nova_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Fashion Canvas (Personal Digital Wardrobe)
  const [fashionCanvas, setFashionCanvas] = useState<FashionCanvasItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurelia_fashion_canvas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('aurelia_fashion_canvas', JSON.stringify(fashionCanvas));
    } catch (e) {
      console.error(e);
    }
  }, [fashionCanvas]);

  // User & Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nova_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Marketplace states
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [userReturns, setUserReturns] = useState<ReturnRequest[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [userTickets, setUserTickets] = useState<SupportTicket[]>([]);

  // UI Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [imageViewerData, setImageViewerData] = useState<{ images: string[]; initialIndex: number } | null>(null);
  const [viewer360Product, setViewer360Product] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Discovery History
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Mulberry Silk Evening Gown',
    'Double-Breasted Wool Coat',
    'Tuscan Leather Tote',
  ]);

  // Accessibility
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // 1. Initialize Database & Products
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      await seedInitialDatabaseIfEmpty();
      const prods = await getProductsFromDB();
      if (prods && prods.length > 0) {
        setProducts(prods);
      }
    } catch (err) {
      console.error('Failed to load products from database:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // 2. Fetch User Orders
  const refreshOrders = useCallback(async () => {
    if (!currentUser) return;
    try {
      const dbOrders = await getUserOrdersFromDB(currentUser.id, currentUser.email);
      setOrders(dbOrders || []);
      localStorage.setItem('nova_orders', JSON.stringify(dbOrders || []));
    } catch (err) {
      console.error('Failed to refresh orders:', err);
    }
  }, [currentUser]);

  // 3. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(true);
      if (fbUser) {
        const userIsAdmin = isUserAdmin(fbUser);
        setIsAdmin(userIsAdmin);

        // Fetch or create profile in Firestore
        let profile = await getUserProfileFromDB(fbUser.uid);
        if (!profile) {
          profile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Flagship Member',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '+91 98765 43210',
            avatarUrl: fbUser.photoURL || undefined,
            joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
            addresses: [
              {
                id: 'addr-default-1',
                fullName: fbUser.displayName || 'Flagship Member',
                phone: '+91 98765 43210',
                street: 'Indiranagar 100ft Road, Phase 2',
                landmark: 'Near Metro Station',
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560038',
                isDefault: true,
                addressType: 'home',
              },
            ],
            role: userIsAdmin ? 'admin' : 'customer',
            membershipTier: userIsAdmin ? 'Nova Prime' : 'Nova Prime',
            novaCoins: 250,
          };
          profile.savedAddresses = profile.addresses;
          await saveUserProfileToDB(profile);
        } else {
          profile.savedAddresses = profile.addresses || [];
          if (userIsAdmin && profile.role !== 'admin') {
            profile.role = 'admin';
            await saveUserProfileToDB(profile);
          }
        }

        setCurrentUser(profile);

        // Sync and load cart from Firestore
        try {
          const dbCart = await getCartFromDB(fbUser.uid);
          if (dbCart && dbCart.length > 0) {
            setCart(dbCart);
          } else if (cart.length > 0) {
            await saveCartToDB(fbUser.uid, cart);
          }
        } catch (err) {
          console.warn('Cart sync error:', err);
        }

        // Sync and load wishlist from Firestore
        try {
          const dbWishlist = await getWishlistFromDB(fbUser.uid);
          if (dbWishlist && dbWishlist.length > 0) {
            setWishlist(dbWishlist);
          } else if (wishlist.length > 0) {
            await saveWishlistToDB(fbUser.uid, wishlist);
          }
        } catch (err) {
          console.warn('Wishlist sync error:', err);
        }

        // Load orders
        try {
          const dbOrders = await getUserOrdersFromDB(fbUser.uid, fbUser.email || '');
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders);
          }
        } catch (err) {
          console.warn('Orders sync error:', err);
        }

        // Load notifications
        try {
          const notifs = await getUserNotificationsFromDB(fbUser.uid);
          setNotifications(notifs);
        } catch (err) {
          console.warn('Notifications sync error:', err);
        }

        // Load returns
        try {
          const returns = await getUserReturnsFromDB(fbUser.uid, fbUser.email || '');
          setUserReturns(returns);
        } catch (err) {
          console.warn('Returns sync error:', err);
        }

        // Load seller profile
        try {
          const seller = await getSellerProfileFromDB(fbUser.uid);
          setSellerProfile(seller);
        } catch (err) {
          console.warn('Seller sync error:', err);
        }

        // Load user support tickets
        try {
          if (fbUser.email) {
            const tickets = await getUserSupportTicketsFromDB(fbUser.email);
            setUserTickets(tickets);
          }
        } catch (err) {
          console.warn('Tickets sync error:', err);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        setNotifications([]);
        setUserReturns([]);
        setSellerProfile(null);
        setUserTickets([]);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save cart to local storage and Firestore on changes
  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
    if (currentUser?.id) {
      saveCartToDB(currentUser.id, cart);
    }
  }, [cart, currentUser]);

  // Save wishlist to local storage and Firestore
  useEffect(() => {
    localStorage.setItem('nova_wishlist', JSON.stringify(wishlist));
    if (currentUser?.id) {
      saveWishlistToDB(currentUser.id, wishlist);
    }
  }, [wishlist, currentUser]);

  useEffect(() => {
    localStorage.setItem('nova_saved_for_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  // Toast Notification helper
  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToast({ id, title, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // ---------------- CART ACTIONS ----------------
  const addToCart = (
    product: Product,
    selectedColor?: ColorOption,
    selectedVariant?: ProductVariant,
    quantity: number = 1,
    selectedSize?: string
  ) => {
    const color = selectedColor || product.colors[0] || { name: 'Standard', hex: '#000000', inStock: true };
    const variant = selectedVariant || (product.variants && product.variants[0]);
    const size = selectedSize || (product.sizes && product.sizes[0]);
    const price = variant ? variant.price : product.price;

    const itemKey = `${product.id}-${color.name}-${size || (variant ? variant.id : 'base')}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === itemKey);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: Math.min(newQty, product.stockCount || 99),
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemKey,
          productId: product.id,
          product,
          selectedColor: color,
          selectedVariant: variant,
          selectedSize: size,
          quantity: Math.min(quantity, product.stockCount || 99),
          price,
        };
        return [newItem, ...prev];
      }
    });

    showToast('Added to Bag', `${product.name} ${size ? `(${size})` : ''} has been added to your shopping bag.`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item Removed', 'The item was removed from your bag.', 'info');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.product.stockCount || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser?.id) {
      saveCartToDB(currentUser.id, []);
    }
  };

  const saveForLater = (itemId: string) => {
    const itemToSave = cart.find((i) => i.id === itemId);
    if (!itemToSave) return;

    setCart((prev) => prev.filter((i) => i.id !== itemId));
    setSavedForLater((prev) => [
      {
        id: `saved-${Date.now()}`,
        cartItem: itemToSave,
        savedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    showToast('Saved for Later', `${itemToSave.product.name} moved to saved items.`);
  };

  const moveToCartFromSaved = (savedId: string) => {
    const saved = savedForLater.find((s) => s.id === savedId);
    if (!saved) return;

    setSavedForLater((prev) => prev.filter((s) => s.id !== savedId));
    addToCart(
      saved.cartItem.product,
      saved.cartItem.selectedColor,
      saved.cartItem.selectedVariant,
      saved.cartItem.quantity
    );
  };

  const removeSavedForLater = (savedId: string) => {
    setSavedForLater((prev) => prev.filter((s) => s.id !== savedId));
    showToast('Removed', 'Item removed from saved list.', 'info');
  };

  // ---------------- CART CALCULATIONS ----------------
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else {
      cartDiscount = Math.min(appliedCoupon.value, cartSubtotal);
    }
  }

  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  const cartShippingFee = cartSubtotal >= freeShippingThreshold || cart.length === 0 ? 0 : 99;
  const cartTax = 0; // Inclusive GST
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // ---------------- WISHLIST ACTIONS ----------------
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.productId === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      showToast('Removed from Wishlist', `${product.name} removed from your saved list.`, 'info');
    } else {
      setWishlist((prev) => [{ productId: product.id, product, addedAt: new Date().toISOString() }, ...prev]);
      showToast('Added to Wishlist', `${product.name} saved to your wishlist.`);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Removed', 'Product removed from wishlist.', 'info');
  };

  const moveAllWishlistToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item.product);
    });
    setWishlist([]);
    showToast('Wishlist Moved', 'All wishlist items added to your shopping bag.');
  };

  // ---------------- COMPARISON ACTIONS ----------------
  const toggleComparison = (product: Product) => {
    const exists = comparisonItems.some((item) => item.id === product.id);
    if (exists) {
      setComparisonItems((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Removed from Comparison', `${product.name} removed from comparison matrix.`, 'info');
    } else {
      if (comparisonItems.length >= 4) {
        showToast('Limit Reached', 'You can compare up to 4 accessories simultaneously.', 'error');
        return;
      }
      setComparisonItems((prev) => [...prev, product]);
      showToast('Added to Comparison', `${product.name} added to hardware comparison.`);
    }
  };

  const isInComparison = (productId: string) => {
    return comparisonItems.some((item) => item.id === productId);
  };

  const removeFromComparison = (productId: string) => {
    setComparisonItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearComparison = () => {
    setComparisonItems([]);
  };

  // ---------------- FASHION CANVAS (DIGITAL WARDROBE) ----------------
  const addToCanvas = (product: Product, selectedColor?: ColorOption, selectedSize?: string) => {
    const exists = fashionCanvas.some((item) => item.product.id === product.id);
    if (exists) {
      showToast('Already on Canvas', `${product.name} is already in your personal look.`, 'info');
      setIsCanvasOpen(true);
      return;
    }

    let slot: FashionCanvasItem['categorySlot'] = 'other';
    const cat = (product.category || '').toLowerCase();
    const sub = (product.subCategory || '').toLowerCase();
    if (cat.includes('outerwear') || sub.includes('jacket') || sub.includes('coat')) {
      slot = 'outerwear';
    } else if (sub.includes('shirt') || sub.includes('top') || sub.includes('tee') || sub.includes('blouse') || sub.includes('knit') || sub.includes('hoodie')) {
      slot = 'top';
    } else if (sub.includes('pant') || sub.includes('trouser') || sub.includes('chino') || sub.includes('denim') || sub.includes('skirt') || sub.includes('cargo')) {
      slot = 'bottom';
    } else if (cat.includes('footwear') || sub.includes('shoe') || sub.includes('boot') || sub.includes('sneaker') || sub.includes('loafer')) {
      slot = 'footwear';
    } else if (cat.includes('bag') || cat.includes('watch') || cat.includes('jewellery') || cat.includes('accessories')) {
      slot = 'accessory';
    }

    const newItem: FashionCanvasItem = {
      id: `canvas-${product.id}-${Date.now()}`,
      product,
      selectedColor: selectedColor || product.colors[0],
      selectedSize: selectedSize || (product.sizes ? product.sizes[0] : undefined),
      addedAt: new Date().toISOString(),
      categorySlot: slot,
    };

    setFashionCanvas((prev) => [newItem, ...prev]);
    showToast('Collected to Canvas', `Added ${product.name} to your evolving look.`, 'success');
  };

  const removeFromCanvas = (itemId: string) => {
    setFashionCanvas((prev) => prev.filter((i) => i.id !== itemId && i.product.id !== itemId));
    showToast('Removed from Canvas', 'Piece removed from your look.', 'info');
  };

  const reorderCanvas = (startIndex: number, endIndex: number) => {
    setFashionCanvas((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearCanvas = () => {
    setFashionCanvas([]);
    showToast('Canvas Cleared', 'Your look canvas is now empty.', 'info');
  };

  const moveCanvasToCart = () => {
    if (fashionCanvas.length === 0) return;
    fashionCanvas.forEach((item) => {
      addToCart(item.product, item.selectedColor, undefined, 1, item.selectedSize);
    });
    showToast('Look Added to Bag', `All ${fashionCanvas.length} ensemble pieces added to your shopping bag.`, 'success');
    setIsCanvasOpen(false);
    setIsCartOpen(true);
  };

  const isInCanvas = (productId: string) => {
    return fashionCanvas.some((item) => item.product.id === productId);
  };

  // ---------------- COUPONS ----------------
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'Invalid promo code. Please verify and try again.' };
    }

    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum bag value of ₹${found.minOrder.toLocaleString('en-IN')} required for code "${found.code}".`,
      };
    }

    setAppliedCoupon(found);
    showToast('Discount Applied!', `Promo code ${found.code} applied successfully.`);
    return { success: true, message: `Promo code ${found.code} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo Removed', 'Coupon removed from your bag.', 'info');
  };

  // ---------------- ORDERS ----------------
  const placeOrder = async (
    orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingHistory'>
  ): Promise<Order> => {
    const timestamp = Date.now();
    const orderId = `AUR-${timestamp.toString().slice(-6)}`;
    const trackingNumber = `BLRDART${Math.floor(100000000 + Math.random() * 900000000)}`;

    const initialTracking: OrderTrackingEvent[] = [
      {
        status: 'placed',
        title: 'Couture Order Confirmed',
        location: 'AURELIA Central Atelier',
        timestamp: 'Just now',
        description: 'Payment authorized. Garment reserved for master tailor inspection.',
        completed: true,
        current: true,
      },
      {
        status: 'confirmed',
        title: 'Master Tailor Quality & Fabric Audit',
        location: 'Atelier Inspection Salon',
        timestamp: 'Pending',
        description: 'Hand inspection of seams, fabric integrity, and numbered atelier certification.',
        completed: false,
      },
      {
        status: 'packed',
        title: 'Luxury Garment Bag & Sealed Box Packaging',
        location: 'Atelier Dispatch Salon',
        timestamp: 'Pending',
        description: 'Enclosed with organic cotton garment cover, scented tissue, and tax invoice.',
        completed: false,
      },
      {
        status: 'shipped',
        title: 'Dispatched with BlueDart Priority Express',
        location: 'Air Cargo Express Facility',
        timestamp: 'Pending',
        description: `AWB Tracking Number: ${trackingNumber}`,
        completed: false,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for White-Glove Doorstep Delivery',
        location: `${orderPayload.shippingAddress.city} Express Courier Hub`,
        timestamp: 'Pending',
        description: 'Courier specialist assigned with secure signature verification.',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        location: `${orderPayload.shippingAddress.street}, ${orderPayload.shippingAddress.city}`,
        timestamp: 'Pending',
        description: 'Delivered with luxury seals intact.',
        completed: false,
      },
    ];

    const newOrder: Order = {
      ...orderPayload,
      id: orderId,
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      status: 'placed',
      trackingCarrier: 'BlueDart Express Air Priority',
      trackingNumber,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      trackingHistory: initialTracking,
    };

    // Save order to Firestore
    await saveOrderToDB(newOrder, currentUser?.id);

    // Update local state
    setOrders((prev) => [newOrder, ...prev]);
    localStorage.setItem('nova_orders', JSON.stringify([newOrder, ...orders]));

    // Clear cart
    clearCart();
    setAppliedCoupon(null);

    // Award NovaCoins
    if (currentUser) {
      const coinsEarned = Math.floor(newOrder.total * 0.05);
      const updatedProfile: UserProfile = {
        ...currentUser,
        novaCoins: (currentUser.novaCoins || 0) + coinsEarned,
      };
      await saveUserProfileToDB(updatedProfile);
      setCurrentUser(updatedProfile);
    }

    showToast('Order Confirmed!', `Order ${newOrder.orderNumber} successfully placed.`);
    return newOrder;
  };

  const getOrderById = (orderIdOrNumber: string): Order | undefined => {
    return orders.find(
      (o) =>
        o.id.toLowerCase() === orderIdOrNumber.toLowerCase() ||
        o.orderNumber.toLowerCase() === orderIdOrNumber.toLowerCase() ||
        o.trackingNumber.toLowerCase() === orderIdOrNumber.toLowerCase()
    );
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteOrderFromDB(orderId);
      setOrders((prev) => {
        const next = prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
        localStorage.setItem('nova_orders', JSON.stringify(next));
        return next;
      });
      showToast('Order Removed', 'Selected order has been removed from your history.', 'info');
    } catch (err) {
      console.error('Failed to delete order:', err);
      showToast('Error', 'Failed to remove order from history.', 'error');
    }
  };

  const clearOrderHistory = async () => {
    try {
      if (currentUser) {
        await clearUserOrdersFromDB(currentUser.id, currentUser.email);
      } else {
        await clearUserOrdersFromDB();
      }
      setOrders([]);
      localStorage.removeItem('nova_orders');
      showToast('History Cleared', 'Your order history and invoices have been cleared.', 'success');
    } catch (err) {
      console.error('Failed to clear order history:', err);
      showToast('Error', 'Failed to clear order history.', 'error');
    }
  };

  // ---------------- VERIFIED REVIEWS ----------------
  const checkIsPurchased = async (productId: string): Promise<boolean> => {
    if (!currentUser) return false;
    return await checkUserPurchasedProduct(currentUser.id, currentUser.email, productId);
  };

  const submitVerifiedReview = async (
    productId: string,
    rating: number,
    title: string,
    comment: string
  ): Promise<{ success: boolean; isVerified: boolean; message: string }> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, isVerified: false, message: 'Please sign in to write a review.' };
    }

    const prod = products.find((p) => p.id === productId);
    const res = await submitReviewToDB({
      productId,
      productName: prod?.name || 'AURELIA Couture Piece',
      author: currentUser.name,
      authorUid: currentUser.id,
      authorEmail: currentUser.email,
      rating,
      title,
      comment,
      avatar: currentUser.avatarUrl,
    });

    if (res.success) {
      showToast(res.isVerified ? 'Verified Review Published!' : 'Review Submitted!', res.message);
      // Refresh products to update aggregate rating
      await refreshProducts();
    } else {
      showToast('Submission Failed', res.message, 'error');
    }

    return res;
  };

  // ---------------- AUTHENTICATION ----------------
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      setIsAuthModalOpen(false);
      showToast('Welcome Back', `Successfully signed in as ${email}.`);
      return { success: true };
    } catch (error: any) {
      console.error('Email sign in error:', error);
      const msg = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password. Please check your credentials.' 
        : error.message || 'Failed to sign in';
      showToast('Sign In Error', msg, 'error');
      return { success: false, error: msg };
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      setIsAuthModalOpen(false);
      showToast('Account Created', `Welcome to AURELIA & CO. Haute Couture, ${name}!`);
      return { success: true };
    } catch (error: any) {
      console.error('Email registration error:', error);
      const msg = error.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists. Please sign in instead.'
        : error.message || 'Failed to register';
      showToast('Registration Error', msg, 'error');
      return { success: false, error: msg };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
      showToast('Google Sign In', 'Successfully authenticated with Google.');
      return { success: true };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      const msg = error.message || 'Google authentication was cancelled or interrupted.';
      showToast('Sign In Failed', msg, 'error');
      return { success: false, error: msg };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast('Password Reset Sent', `Check ${email} for password reset instructions.`);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      const msg = error.message || 'Failed to send reset email.';
      showToast('Reset Failed', msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logoutUser = async (): Promise<void> => {
    await signOut(auth);
    setCurrentUser(null);
    setIsAdmin(false);
    showToast('Signed Out', 'You have been signed out securely.');
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ...updates,
      savedAddresses: updates.addresses || currentUser.addresses,
    };
    setCurrentUser(updated);
    await saveUserProfileToDB(updated);
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const addAddress = async (addr: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    const currentAddresses = currentUser.addresses || [];
    let updatedList = [...currentAddresses];
    if (newAddr.isDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }
    updatedList.push(newAddr);

    await updateUserProfile({ addresses: updatedList });
    showToast('Address Added', 'New delivery address saved.');
  };

  const removeAddress = async (id: string) => {
    if (!currentUser) return;
    const updatedList = (currentUser.addresses || []).filter((a) => a.id !== id);
    await updateUserProfile({ addresses: updatedList });
    showToast('Address Removed', 'Address removed from your address book.', 'info');
  };

  const setDefaultAddress = async (id: string) => {
    if (!currentUser) return;
    const updatedList = (currentUser.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    await updateUserProfile({ addresses: updatedList });
    showToast('Default Address Set', 'Default delivery destination updated.');
  };

  // ---------------- PRODUCT Q&A ----------------
  const submitProductQuestion = async (productId: string, productName: string, questionText: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Please sign in to ask a question.' };
    }
    const res = await submitQuestionToDB({
      productId,
      productName,
      userUid: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      question: questionText,
    });
    if (res.success) {
      showToast('Question Submitted', 'Your question has been posted and will be answered shortly.');
    }
    return { success: res.success, message: res.message };
  };

  const upvoteProductQuestion = async (questionId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const voted = await upvoteQuestionInDB(questionId, currentUser.id);
    showToast(voted ? 'Upvoted' : 'Vote Removed', voted ? 'Thanks for marking this question helpful.' : 'Upvote removed.', 'info');
  };

  // ---------------- RETURNS & CANCELLATIONS ----------------
  const refreshReturns = useCallback(async () => {
    if (!currentUser) return;
    try {
      const list = await getUserReturnsFromDB(currentUser.id, currentUser.email);
      setUserReturns(list);
    } catch (err) {
      console.error('Error refreshing returns:', err);
    }
  }, [currentUser]);

  const requestReturn = async (payload: {
    orderId: string;
    orderNumber: string;
    productId: string;
    productName: string;
    productImage: string;
    reason: ReturnRequest['reason'];
    reasonDetails: string;
    images?: string[];
    refundAmount: number;
  }): Promise<{ success: boolean; returnNumber: string; message: string }> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, returnNumber: '', message: 'Please sign in to request a return.' };
    }
    const res = await createReturnRequestInDB({
      ...payload,
      userUid: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
    });
    if (res.success) {
      showToast('Return Requested', `Return ${res.returnNumber} has been logged. Our courier team will reach out for reverse pickup.`);
      await refreshReturns();
      await refreshOrders();
    }
    return res;
  };

  const cancelOrderAction = async (orderId: string, reason: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Unauthorized' };
    }
    const res = await cancelOrderInDB(orderId, reason, currentUser.id);
    if (res.success) {
      showToast('Order Cancelled', 'Order has been cancelled successfully.');
      await refreshOrders();
    } else {
      showToast('Cancellation Failed', res.message, 'error');
    }
    return res;
  };

  // ---------------- NOTIFICATIONS ----------------
  const refreshNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      const notifs = await getUserNotificationsFromDB(currentUser.id);
      setNotifications(notifs);
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    }
  }, [currentUser]);

  const markNotificationRead = async (id: string) => {
    await markNotificationReadInDB(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    await markAllNotificationsReadInDB(currentUser.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Notifications Cleared', 'All notifications marked as read.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // ---------------- SELLER HUB ----------------
  const refreshSellerProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const profile = await getSellerProfileFromDB(currentUser.id);
      setSellerProfile(profile);
    } catch (err) {
      console.error('Error refreshing seller profile:', err);
    }
  }, [currentUser]);

  const registerSellerAccount = async (sellerData: Omit<SellerProfile, 'id' | 'createdAt' | 'status' | 'rating' | 'totalSales' | 'earnings' | 'commissionRate'>): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Please sign in first.' };
    }
    const res = await registerSellerInDB(sellerData);
    if (res.success) {
      showToast('Partner Store Created', 'Welcome to AURELIA Designer Consignment Hub!');
      await refreshSellerProfile();
      if (currentUser) {
        setCurrentUser({ ...currentUser, role: 'seller', sellerId: res.sellerId });
      }
    }
    return res;
  };

  const isSeller = currentUser?.role === 'seller' || !!sellerProfile;

  // ---------------- SUPPORT TICKETS ----------------
  const refreshTickets = useCallback(async () => {
    if (!currentUser?.email) return;
    try {
      const list = await getUserSupportTicketsFromDB(currentUser.email);
      setUserTickets(list);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  }, [currentUser]);

  const submitSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>): Promise<{ success: boolean; ticketNumber: string }> => {
    const res = await createSupportTicketInDB(ticket);
    if (res.success) {
      showToast('Ticket Created', `Your support ticket #${res.ticketNumber} has been logged.`);
      if (currentUser?.email) {
        await refreshTickets();
      }
    }
    return res;
  };

  // ---------------- UI CONTROLS ----------------
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openImageViewer = (images: string[], initialIndex: number = 0) => {
    setImageViewerData({ images, initialIndex });
  };
  const closeImageViewer = () => setImageViewerData(null);

  const open360Viewer = (product: Product) => setViewer360Product(product);
  const close360Viewer = () => setViewer360Product(null);

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 8));
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 10));
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        refreshProducts,
        cart,
        savedForLater,
        wishlist,
        comparisonItems,
        currentUser,
        isAdmin,
        isAuthLoading,
        orders,
        appliedCoupon,
        recentlyViewed,
        recentSearches,
        isSearchOpen,
        isCartOpen,
        isAuthModalOpen,
        authModalMode,
        quickViewProduct,
        imageViewerData,
        viewer360Product,
        toast,
        reducedMotion,
        largeText,
        highContrast,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCartFromSaved,
        removeSavedForLater,

        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTax,
        cartTotal,
        cartItemCount,
        freeShippingThreshold,
        amountNeededForFreeShipping,

        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveAllWishlistToCart,

        toggleComparison,
        isInComparison,
        removeFromComparison,
        clearComparison,

        // Fashion Canvas
        fashionCanvas,
        isCanvasOpen,
        setIsCanvasOpen,
        isWardrobeOpen,
        setIsWardrobeOpen,
        addToCanvas,
        removeFromCanvas,
        reorderCanvas,
        clearCanvas,
        moveCanvasToCart,
        isInCanvas,

        applyCoupon,
        removeCoupon,

        placeOrder,
        getOrderById,
        refreshOrders,
        deleteOrder,
        clearOrderHistory,

        submitVerifiedReview,
        checkIsPurchased,

        // Q&A
        submitProductQuestion,
        upvoteProductQuestion,

        // Returns & Cancellations
        userReturns,
        refreshReturns,
        requestReturn,
        cancelOrderAction,

        // Notifications
        notifications,
        unreadNotificationsCount,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead,

        // Seller Hub
        sellerProfile,
        isSeller,
        registerSellerAccount,
        refreshSellerProfile,

        // Support Tickets
        userTickets,
        refreshTickets,
        submitSupportTicket,

        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPassword,
        logoutUser,
        updateUserProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,

        setIsSearchOpen,
        setIsCartOpen,
        setIsAuthModalOpen,
        setAuthModalMode,
        openQuickView,
        closeQuickView,
        openImageViewer,
        closeImageViewer,
        open360Viewer,
        close360Viewer,
        showToast,
        hideToast,

        addRecentSearch,
        clearRecentSearches,
        addRecentlyViewed,

        setReducedMotion,
        setLargeText,
        setHighContrast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
