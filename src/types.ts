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
  sellerId?: string;
  sellerName?: string;
  warehouseLocation?: string;
  questionsCount?: number;
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

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderTrackingEvent {
  status: OrderStatus;
  title: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderPaymentDetails {
  methodLabel: string;
  transactionId: string;
  paid: boolean;
  gateway?: 'razorpay' | 'cod';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  method?: string;
  cardNetwork?: string;
  cardLast4?: string;
  vpa?: string;
  bank?: string;
  wallet?: string;
  paidAt?: string;
  failureReason?: string;
  refundStatus?: 'none' | 'refunded' | 'partially_refunded';
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  gateway: 'razorpay' | 'cod';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amount: number; // in INR
  currency: string;
  method: string;
  methodDetails?: {
    vpa?: string;
    cardNetwork?: string;
    cardLast4?: string;
    bank?: string;
    wallet?: string;
    international?: boolean;
  };
  status: 'created' | 'pending' | 'captured' | 'failed' | 'refunded' | 'partially_refunded';
  failureReason?: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  userUid?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
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
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod' | 'wallet' | 'international_card';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentDetails: OrderPaymentDetails;
  currency?: string;
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
  userUid?: string;
  cancelReason?: string;
  cancelledAt?: string;
  returnStatus?: 'none' | 'requested' | 'approved' | 'pickup_initiated' | 'refunded' | 'rejected';
  sellerId?: string;
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  userUid: string;
  userEmail: string;
  userName: string;
  reason: 'damaged_item' | 'wrong_item_delivered' | 'defective_quality' | 'performance_issue' | 'not_as_described' | 'buyer_remorse';
  reasonDetails: string;
  images?: string[];
  refundAmount: number;
  status: 'requested' | 'approved' | 'pickup_initiated' | 'item_received' | 'refund_processed' | 'rejected';
  statusHistory: { status: string; timestamp: string; note: string }[];
  refundTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  productName: string;
  userUid: string;
  userName: string;
  userEmail?: string;
  question: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  upvotes: number;
  upvotedBy?: string[];
  answer?: {
    answeredBy: string;
    answeredByRole: 'seller' | 'admin' | 'verified_buyer';
    answerText: string;
    answeredAt: string;
  };
}

export interface SellerProfile {
  id: string;
  userUid: string;
  storeName: string;
  storeSlug: string;
  email: string;
  phone: string;
  gstin?: string;
  pickupAddress: string;
  city: string;
  state: string;
  pincode: string;
  bankAccount: string;
  ifsc: string;
  status: 'pending' | 'approved' | 'suspended';
  rating: number;
  totalSales: number;
  earnings: number;
  commissionRate: number; // e.g. 8%
  createdAt: string;
  description?: string;
  bannerUrl?: string;
  logoUrl?: string;
}

export interface AppNotification {
  id: string;
  userUid: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'return' | 'deal' | 'support' | 'seller' | 'promo' | 'account';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetCollection: string;
  targetId: string;
  details: string;
  timestamp: string;
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
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'open' | 'in_progress' | 'resolved' | 'Open' | 'In Progress' | 'Resolved';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  joinedDate: string;
  addresses: Address[];
  savedAddresses?: Address[];
  role?: 'customer' | 'seller' | 'admin';
  sellerId?: string;
  membershipTier: 'Nova Prime' | 'Nova Club';
  novaCoins: number;
}
