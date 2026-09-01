export type CategoryId = 
  | 'men-apparel'
  | 'women-apparel'
  | 'outerwear-jackets'
  | 'footwear'
  | 'bags-leather'
  | 'watches-timepieces'
  | 'jewellery-accessories'
  | 'streetwear-unisex'
  | 'dresses-gowns'
  | 'shirts-tops'
  | 'denim-trousers'
  | 'evening-wear'
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
  featuredSubcategories?: string[];
}

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
  inStock?: boolean;
}

export interface SizeGuideRow {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
  shoulder?: string;
  inseam?: string;
  ukSize?: string;
  usSize?: string;
  euSize?: string;
}

export interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  unit?: 'cm' | 'in';
}

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  inStock: boolean;
  sku: string;
  barcode?: string;
  specs?: string;
  size?: string;
  color?: string;
  stockCount: number;
  reservedCount?: number;
  lowStockThreshold?: number;
  image?: string; // color-specific image URL
  weightGrams?: number;
  dimensions?: PackageDimensions;
}

export interface ColorGalleryItem {
  colorName: string;
  hex: string;
  images: string[];
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
  fitFeedback?: 'true_to_size' | 'runs_small' | 'runs_large';
  purchasedSize?: string;
  purchasedColor?: string;
  ratingDistribution?: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export interface ModelStats {
  height: string;
  chest?: string;
  waist?: string;
  wearingSize: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  tagline: string;
  description?: string;
  category: CategoryId;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  subCategory?: string;
  price: number; // in INR
  originalPrice: number;
  salePrice?: number;
  discountPercent: number;
  taxRate?: number; // e.g. 5, 12, 18% GST
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  lowStockThreshold?: number;
  badge?: 'FLAGSHIP' | 'NEW' | 'BESTSELLER' | 'PRO DROP' | 'LIMITED' | 'HAUTE' | 'RUNWAY' | 'EXCLUSIVE' | 'ATELIER EXCLUSIVE';
  status?: ProductStatus;
  sku: string;
  barcode?: string;
  weightGrams?: number;
  packageDimensions?: PackageDimensions;
  images: string[];
  hoverImage?: string;
  colors: ColorOption[];
  colorGalleries?: ColorGalleryItem[];
  sizes?: string[]; // e.g. ["XS", "S", "M", "L", "XL", "XXL"] or ["UK 7", "UK 8", "UK 9"]
  variants?: ProductVariant[];
  fabric?: string; // e.g. "100% Organic Egyptian Cotton (280 GSM)"
  material?: string;
  materials?: string[] | string;
  tags?: string[];
  fit?: 'Slim Fit' | 'Tailored Fit' | 'Relaxed Fit' | 'Oversized' | 'Classic Fit' | 'Regular Fit' | string;
  pattern?: string; // e.g. "Solid", "Houndstooth", "Striped", "Textured Weave"
  occasion?: 'Casual' | 'Formal' | 'Business' | 'Evening & Gala' | 'Streetwear' | 'Resort & Vacation' | 'Festive' | 'Smart Casual' | string;
  season?: 'Spring/Summer' | 'Autumn/Winter' | 'All-Season' | 'Resort' | string;
  careInstructions?: string[];
  sizeGuide?: SizeGuideRow[];
  returnPolicyDays?: number;
  returnPolicyText?: string;
  shippingInformation?: string;
  countryOfOrigin?: string;
  modelStats?: ModelStats;
  compatibility?: string[]; // compatible style items / styling pairings
  features: ProductFeature[];
  specifications: SpecGroup[];
  whatsInTheBox: string[];
  inTheBox?: string[];
  warranty: string;
  shippingTime: string;
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
  outfitPairings?: string[]; // IDs of items that complete this outfit
}

export interface CartItem {
  id: string; // unique item key combining product id + variant + color + size
  productId: string;
  product: Product;
  selectedColor: ColorOption;
  selectedVariant?: ProductVariant;
  selectedSize?: string;
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

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type ShipmentStatus =
  | 'shipment_created'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'in_transit'
  | 'reached_destination_hub'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_attempted'
  | 'failed_delivery'
  | 'returned_to_origin'
  | 'cancelled';

export interface OrderTrackingEvent {
  status: OrderStatus | ShipmentStatus;
  title: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  provider: 'manual' | 'shiprocket' | 'delhivery' | 'dtdc' | 'bluedart' | 'other';
  courierName: string;
  awbNumber: string;
  trackingNumber?: string;
  shipmentId?: string;
  packageWeightGrams: number;
  packageDimensions: PackageDimensions;
  pickupAddress?: Address;
  deliveryAddress?: Address;
  status: ShipmentStatus;
  trackingUrl?: string;
  labelUrl?: string;
  manifestUrl?: string;
  isManualEntry: boolean;
  shippingCharge?: number;
  events: OrderTrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAdjustmentReasonItem {
  key: InventoryAdjustmentReason;
  label: string;
}

export type InventoryAdjustmentReason =
  | 'restock'
  | 'damage'
  | 'return_restock'
  | 'inventory_count_correction'
  | 'promotion_allocation'
  | 'order_fulfillment'
  | 'order_cancellation'
  | 'shrinkage'
  | 'other';

export interface InventoryAuditLog {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  size?: string;
  color?: string;
  previousStock: number;
  adjustedQuantity: number;
  newStock: number;
  reason: InventoryAdjustmentReason;
  notes?: string;
  adminEmail: string;
  adminName: string;
  timestamp: string;
}

export interface ShippingConfig {
  pickupWarehouse: {
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  connectedProvider: 'manual' | 'shiprocket' | 'delhivery';
  providerStatus: {
    configured: boolean;
    mode: 'manual' | 'live';
    providerName: string;
    lastSyncAt?: string;
  };
  packageDefaults: {
    defaultWeightGrams: number;
    defaultDimensions: PackageDimensions;
    defaultBoxType: string;
  };
  shippingRules: {
    standardShippingFee: number;
    freeShippingThreshold: number;
    expressShippingFee: number;
    codAvailable: boolean;
    codExtraFee: number;
    enableServiceabilityCheck: boolean;
    defaultTransitDays: number;
  };
  serviceableZones?: {
    name: string;
    pincodePrefixes: string[];
    transitDays: number;
    codAvailable: boolean;
  }[];
  returnPolicy: {
    returnWindowDays: number;
    exchangesAllowed: boolean;
    returnFee: number;
    terms: string;
  };
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
  fulfillmentStatus?: OrderStatus;
  trackingCarrier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  trackingHistory: OrderTrackingEvent[];
  shipment?: ShipmentRecord;
  packingDetails?: {
    packedAt?: string;
    packedBy?: string;
    boxType?: string;
    notes?: string;
    verifiedItemIds?: string[];
  };
  codDetails?: {
    codAmount: number;
    collected: boolean;
    collectedAt?: string;
    remarks?: string;
  };
  userUid?: string;
  cancelReason?: string;
  cancelledAt?: string;
  returnStatus?: 'none' | 'requested' | 'approved' | 'pickup_initiated' | 'item_received' | 'refunded' | 'exchanged' | 'rejected';
  sellerId?: string;
}

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'pickup_initiated'
  | 'item_received'
  | 'inspected_passed'
  | 'refund_processed'
  | 'exchange_dispatched'
  | 'rejected';

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  selectedSize?: string;
  selectedColor?: string;
  variantId?: string;
  quantity?: number;
  requestType?: 'return' | 'exchange';
  exchangeSizeRequested?: string;
  exchangeColorRequested?: string;
  userUid: string;
  userEmail: string;
  userName: string;
  paymentMethod?: string;
  paymentId?: string;
  reason: 'size_exchange' | 'wrong_fit' | 'color_mismatch' | 'fabric_dislike' | 'damaged_item' | 'wrong_item_delivered' | 'defective_quality' | 'not_as_described' | 'buyer_remorse';
  reasonDetails: string;
  images?: string[];
  refundAmount: number;
  refundMethod?: 'razorpay' | 'cod_bank_transfer' | 'store_credit';
  refundStatus?: string;
  refundId?: string;
  refundedAt?: string;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  status: ReturnStatus;
  statusHistory: { status: string; timestamp: string; note: string }[];
  reverseAwbNumber?: string;
  reverseCourier?: string;
  reverseCarrier?: string;
  pickupScheduledDate?: string;
  inspectionNotes?: string;
  inspectionResult?: 'passed_restocked' | 'damaged_rejected' | 'partial';
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

export interface OutfitLook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  occasion: string;
  style: string;
  gender: 'men' | 'women' | 'unisex';
  heroImage: string;
  itemIds: string[];
  tag: string;
}

export interface StyleFilterCriteria {
  gender?: 'men' | 'women' | 'unisex' | 'all';
  occasion?: string;
  styleAesthetic?: string;
  clothingType?: string;
  size?: string;
  fit?: string;
  season?: string;
  maxBudget?: number;
  color?: string;
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
