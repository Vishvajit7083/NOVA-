import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  SavedForLaterItem,
  WishlistItem,
  Order,
  Address,
  Coupon,
  UserProfile,
  ColorOption,
  ProductVariant,
} from '../types';
import { PRODUCTS } from '../data/products';
import { VALID_COUPONS } from '../data/faqs';

interface ToastData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  cart: CartItem[];
  savedForLater: SavedForLaterItem[];
  wishlist: WishlistItem[];
  comparisonItems: Product[];
  currentUser: UserProfile | null;
  orders: Order[];
  appliedCoupon: Coupon | null;
  recentlyViewed: Product[];
  recentSearches: string[];
  isSearchOpen: boolean;
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  imageViewerData: { images: string[]; initialIndex: number } | null;
  viewer360Product: Product | null;
  toast: ToastData | null;
  reducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;

  // Cart actions
  addToCart: (product: Product, selectedColor?: ColorOption, selectedVariant?: ProductVariant, quantity?: number) => void;
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

  // Coupons
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  placeOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingHistory'>) => Order;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;

  // User Auth & Profile
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // UI state controls
  setIsSearchOpen: (open: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
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

const INITIAL_DEMO_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Aditya Varma',
    phone: '+91 98765 43210',
    street: 'Flat 402, Prestige Tech Park, Outer Ring Road, Marathahalli',
    landmark: 'Near JP Morgan Tower',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    isDefault: true,
    addressType: 'home',
  },
  {
    id: 'addr-2',
    fullName: 'Aditya Varma',
    phone: '+91 98765 43210',
    street: 'Plot 18, Nova Design Studio, Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    isDefault: false,
    addressType: 'work',
  },
];

const INITIAL_SAMPLE_ORDER: Order = {
  id: 'ord-sample-01',
  orderNumber: 'NV-89241',
  createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  items: [
    {
      id: 'nova-hypercharge-120w-0',
      productId: PRODUCTS[0].id,
      product: PRODUCTS[0],
      selectedColor: PRODUCTS[0].colors[0],
      quantity: 1,
      price: PRODUCTS[0].price,
    },
    {
      id: 'nova-warp-armored-240w-cable-0',
      productId: PRODUCTS[3].id,
      product: PRODUCTS[3],
      selectedColor: PRODUCTS[3].colors[0],
      quantity: 1,
      price: PRODUCTS[3].price,
    },
  ],
  shippingAddress: INITIAL_DEMO_ADDRESSES[0],
  contactEmail: 'aditya.v@example.com',
  contactPhone: '+91 98765 43210',
  deliveryMethod: 'express_priority',
  paymentMethod: 'upi',
  paymentDetails: {
    methodLabel: 'Google Pay UPI (aditya@okaxis)',
    transactionId: 'UPI-TXN-99882211',
    paid: true,
  },
  subtotal: 4398,
  discount: 439,
  couponCode: 'NOVA10',
  shippingFee: 0,
  tax: 0,
  total: 3959,
  status: 'shipped',
  trackingCarrier: 'BlueDart Express Air',
  trackingNumber: 'BD-84729104IN',
  estimatedDeliveryDate: 'Delivering Tomorrow by 2:00 PM',
  trackingHistory: [
    {
      status: 'placed',
      title: 'Order Verified & Approved',
      location: 'Bengaluru Hub',
      timestamp: 'Yesterday, 10:14 AM',
      description: 'Payment successful via Instant UPI. Order assigned to fulfillment line 04.',
      completed: true,
    },
    {
      status: 'confirmed',
      title: 'Packaging & QC Certification',
      location: 'NOVA Central Warehouse, Whitefield',
      timestamp: 'Yesterday, 02:30 PM',
      description: 'Serial numbers registered with 2-Year NovaCare warranty activation.',
      completed: true,
    },
    {
      status: 'packed',
      title: 'Sealed & Handed to Carrier',
      location: 'Bengaluru Sort Facility',
      timestamp: 'Yesterday, 06:45 PM',
      description: 'Tamper-evident security tape applied. AWB BD-84729104IN generated.',
      completed: true,
    },
    {
      status: 'shipped',
      title: 'In Transit via BlueDart Air Cargo',
      location: 'Kempegowda International Airport Air Hub',
      timestamp: 'Today, 04:20 AM',
      description: 'Consignment departed on Flight 6E-284 towards destination delivery hub.',
      completed: true,
      current: true,
    },
    {
      status: 'out_for_delivery',
      title: 'Out for Doorstep Delivery',
      location: 'Local Delivery Station',
      timestamp: 'Expected Tomorrow, 09:30 AM',
      description: 'Delivery associate will contact via OTP verification prior to arrival.',
      completed: false,
    },
    {
      status: 'delivered',
      title: 'Delivered to Customer',
      location: 'Bengaluru',
      timestamp: 'Expected Tomorrow, 02:00 PM',
      description: 'Package handed over with contact-free confirmation.',
      completed: false,
    },
  ],
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart & Saved items
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
      const saved = localStorage.getItem('nova_saved_later');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('nova_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nova_user');
      if (saved) return JSON.parse(saved);
      return {
        id: 'usr-demo-01',
        name: 'Aditya Varma',
        email: 'aditya.v@example.com',
        phone: '+91 98765 43210',
        joinedDate: 'Member since Jan 2025',
        addresses: INITIAL_DEMO_ADDRESSES,
        membershipTier: 'Nova Prime',
        novaCoins: 450,
      };
    } catch {
      return null;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nova_orders');
      return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_ORDER];
    } catch {
      return [INITIAL_SAMPLE_ORDER];
    }
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Recently Viewed & Search History
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nova_recently_viewed');
      return saved ? JSON.parse(saved) : [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];
    } catch {
      return [PRODUCTS[0], PRODUCTS[1]];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova_recent_searches');
      return saved ? JSON.parse(saved) : ['120W GaN Charger', 'Aramid Case', '240W Type C', 'AirPulse Earbuds'];
    } catch {
      return ['120W GaN Charger', 'Aramid Case', 'AirPulse Earbuds'];
    }
  });

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [imageViewerData, setImageViewerData] = useState<{ images: string[]; initialIndex: number } | null>(null);
  const [viewer360Product, setViewer360Product] = useState<Product | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastData | null>(null);

  // Accessibility
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nova_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nova_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('nova_saved_later', JSON.stringify(savedForLater));
    } catch (e) {
      console.error(e);
    }
  }, [savedForLater]);

  useEffect(() => {
    try {
      localStorage.setItem('nova_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nova_user', JSON.stringify(currentUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: Math.random().toString(),
      title,
      message,
      type,
    });
  };

  const hideToast = () => setToast(null);

  // Cart operations
  const addToCart = (
    product: Product,
    selectedColor: ColorOption = product.colors[0],
    selectedVariant?: ProductVariant,
    quantity: number = 1
  ) => {
    const itemPrice = selectedVariant ? selectedVariant.price : product.price;
    const itemKey = `${product.id}-${selectedColor.name}-${selectedVariant?.id || 'std'}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stockCount || 10),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            productId: product.id,
            product,
            selectedColor,
            selectedVariant,
            quantity: Math.min(quantity, product.stockCount || 10),
            price: itemPrice,
          },
        ];
      }
    });

    showToast('Added to Cart', `${product.name} (${selectedColor.name}) has been added to your shopping bag.`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Removed', 'Item was removed from your cart.', 'info');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: Math.min(quantity, item.product.stockCount || 10) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveForLater = (itemId: string) => {
    const itemToSave = cart.find((i) => i.id === itemId);
    if (!itemToSave) return;
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    setSavedForLater((prev) => [
      ...prev.filter((i) => i.id !== itemId),
      {
        id: itemId,
        cartItem: itemToSave,
        savedAt: new Date().toISOString(),
      },
    ]);
    showToast('Saved for Later', `${itemToSave.product.name} moved to saved items.`, 'info');
  };

  const moveToCartFromSaved = (savedId: string) => {
    const saved = savedForLater.find((i) => i.id === savedId);
    if (!saved) return;
    setSavedForLater((prev) => prev.filter((i) => i.id !== savedId));
    setCart((prev) => [...prev, saved.cartItem]);
    showToast('Moved to Cart', `${saved.cartItem.product.name} returned to your cart.`);
  };

  const removeSavedForLater = (savedId: string) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== savedId));
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const cartShippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 99;

  let couponDiscountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percent') {
      couponDiscountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else {
      couponDiscountAmount = appliedCoupon.value;
    }
  }

  const cartDiscount = couponDiscountAmount;
  const cartTax = 0; // GST is already inclusive in Indian retail electronics pricing
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.productId === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      showToast('Removed from Wishlist', `${product.name} was removed from your wishlist.`, 'info');
    } else {
      setWishlist((prev) => [
        ...prev,
        {
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        },
      ]);
      showToast('Saved to Wishlist', `${product.name} added to your personal wishlist.`);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  const moveAllWishlistToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item.product, item.product.colors[0], undefined, 1);
    });
    setWishlist([]);
    showToast('Wishlist Moved', 'All wishlist products added to your bag!');
  };

  // Comparison
  const toggleComparison = (product: Product) => {
    const exists = comparisonItems.some((p) => p.id === product.id);
    if (exists) {
      setComparisonItems((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Comparison', `${product.name} removed from spec comparison.`, 'info');
    } else {
      if (comparisonItems.length >= 4) {
        showToast('Max Comparison Limit', 'You can compare up to 4 accessories at a time.', 'error');
        return;
      }
      setComparisonItems((prev) => [...prev, product]);
      showToast('Added to Compare', `${product.name} added to spec comparison matrix.`);
    }
  };

  const isInComparison = (productId: string) => {
    return comparisonItems.some((p) => p.id === productId);
  };

  const removeFromComparison = (productId: string) => {
    setComparisonItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonItems([]);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try NOVA10 or SUPERCHARGE.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Coupon requires a minimum cart value of ₹${found.minOrder.toLocaleString('en-IN')}`,
      };
    }
    setAppliedCoupon(found);
    showToast('Promo Code Applied!', `Success! ${found.description}`);
    return { success: true, message: `Applied coupon ${cleanCode}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Promotional discount removed.', 'info');
  };

  // Place Order
  const placeOrder = (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingHistory'>): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NV-${randomSuffix}`;
    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'placed',
      trackingCarrier: 'BlueDart Express Air',
      trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      estimatedDeliveryDate: 'Delivered in 2-3 Business Days',
      trackingHistory: [
        {
          status: 'placed',
          title: 'Order Placed & Verified',
          location: 'NOVA Express Server',
          timestamp: 'Just now',
          description: `Order ${orderNumber} placed successfully with ${orderPayload.paymentDetails.methodLabel}.`,
          completed: true,
          current: true,
        },
        {
          status: 'confirmed',
          title: 'Order Confirmed & QC Assigned',
          location: 'NOVA Central Warehouse',
          timestamp: 'Pending Processing',
          description: 'Awaiting barcode scanning and warranty seal.',
          completed: false,
        },
        {
          status: 'packed',
          title: 'Package Sealed with Security Tape',
          location: 'Fulfillment Center',
          timestamp: 'Estimated within 24 hours',
          description: 'Package packaged in shock-absorbent eco-friendly packaging.',
          completed: false,
        },
        {
          status: 'shipped',
          title: 'Handed over to Courier Hub',
          location: 'Air Cargo Facility',
          timestamp: 'Estimated in 24-48 hours',
          description: 'Airway bill registered.',
          completed: false,
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Doorstep Delivery',
          location: 'Destination Station',
          timestamp: 'Estimated Day 3',
          description: 'Courier agent assigned for OTP delivery.',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered Successfully',
          location: orderPayload.shippingAddress.city,
          timestamp: 'Estimated Day 3',
          description: 'Delivery completed.',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    showToast('Order Confirmed!', `Your order ${orderNumber} has been placed successfully.`);
    return newOrder;
  };

  const getOrderById = (orderIdOrNumber: string) => {
    const clean = orderIdOrNumber.trim().toUpperCase();
    return orders.find(
      (o) => o.id === orderIdOrNumber || o.orderNumber.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean
    );
  };

  // Auth / User
  const loginUser = (email: string, name: string = 'Nova Member') => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: '+91 98765 43210',
      joinedDate: 'Member since 2026',
      addresses: INITIAL_DEMO_ADDRESSES,
      membershipTier: 'Nova Prime',
      novaCoins: 300,
    };
    setCurrentUser(user);
    showToast('Welcome back!', `Logged in as ${email}`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser((prev) => (prev ? { ...prev, ...profileUpdate } : null));
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    if (currentUser) {
      const updatedAddresses = addressData.isDefault
        ? [newAddr, ...currentUser.addresses.map((a) => ({ ...a, isDefault: false }))]
        : [...currentUser.addresses, newAddr];
      setCurrentUser({
        ...currentUser,
        addresses: updatedAddresses,
      });
    }
    showToast('Address Saved', 'New delivery address added successfully.');
  };

  const removeAddress = (id: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        addresses: currentUser.addresses.filter((a) => a.id !== id),
      });
      showToast('Address Removed', 'Address deleted.', 'info');
    }
  };

  const setDefaultAddress = (id: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        addresses: currentUser.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        })),
      });
      showToast('Default Address Set', 'Selected address is now your default.');
    }
  };

  // Quick View / Image / 360 viewer
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openImageViewer = (images: string[], initialIndex: number = 0) => {
    setImageViewerData({ images, initialIndex });
  };
  const closeImageViewer = () => setImageViewerData(null);

  const open360Viewer = (product: Product) => setViewer360Product(product);
  const close360Viewer = () => setViewer360Product(null);

  // Search History
  const addRecentSearch = (query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('nova_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('nova_recent_searches');
  };

  // Recently Viewed
  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('nova_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        savedForLater,
        wishlist,
        comparisonItems,
        currentUser,
        orders,
        appliedCoupon,
        recentlyViewed,
        recentSearches,
        isSearchOpen,
        isCartOpen,
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

        applyCoupon,
        removeCoupon,

        placeOrder,
        getOrderById,

        loginUser,
        logoutUser,
        updateUserProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,

        setIsSearchOpen,
        setIsCartOpen,
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
