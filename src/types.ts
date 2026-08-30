export type CategoryId = 
  | 'chargers-power'
  | 'cases-protection'
  | 'cables-hubs'
  | 'audio-acoustics'
  | 'wearables-straps'
  | 'smart-accessories'
  | 'car-accessories'
  | 'lifestyle-gear';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
}

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
  inStock?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  sku: string;
  specs?: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  iconName?: string;
}

export interface SpecGroup {
  group: string;
  items: { label: string; value: string }[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  helpfulCount: number;
  userVotedHelpful?: boolean;
  avatar?: string;
  ratingDistribution?: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  category: CategoryId;
  price: number; // in INR
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: 'FLAGSHIP' | 'NEW' | 'BESTSELLER' | 'PRO DROP' | 'LIMITED';
  images: string[];
  colors: ColorOption[];
  variants?: ProductVariant[];
  compatibility: string[];
  features: ProductFeature[];
  specifications: SpecGroup[];
  whatsInTheBox: string[];
  inTheBox?: string[];
  warranty: string;
  shippingTime: string;
  sku: string;
  dimensions?: string;
  weight?: string;
  reviews: Review[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isOfferDeal?: boolean;
}

export interface CartItem {
  id: string; // unique item key combining product id + variant + color
  productId: string;
  product: Product;
  selectedColor: ColorOption;
  selectedVariant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface SavedForLaterItem {
  id: string;
  cartItem: CartItem;
  savedAt: string;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  addressType: 'home' | 'work' | 'other';
}

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface OrderTrackingEvent {
  status: OrderStatus;
  title: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: Address;
  contactEmail: string;
  contactPhone: string;
  deliveryMethod: 'standard' | 'express_priority';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod' | 'wallet';
  paymentDetails: {
    methodLabel: string;
    transactionId: string;
    paid: boolean;
  };
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingCarrier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  trackingHistory: OrderTrackingEvent[];
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
  expiresAt: string;
}

export interface BundleOffer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  products: Product[];
  originalTotalPrice: number;
  bundlePrice: number;
  discountPercent: number;
  tag: string;
  image: string;
}

export interface DeviceModel {
  id: string;
  brand: string;
  name: string;
  category: 'smartphones' | 'tablets' | 'wearables' | 'laptops';
  image: string;
  releaseYear: string;
  connectorType?: string;
  maxChargingWattage?: string;
}

export interface FAQItem {
  id: string;
  category: 'general' | 'shipping' | 'warranty' | 'compatibility' | 'returns' | 'payments';
  question: string;
  answer: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  orderNumber?: string;
  subject: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  joinedDate: string;
  addresses: Address[];
  membershipTier: 'Nova Prime' | 'Nova Club';
  novaCoins: number;
}
