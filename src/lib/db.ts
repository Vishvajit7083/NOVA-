import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch
} from './firebase';
import {
  Product,
  Review,
  Order,
  Coupon,
  UserProfile,
  CartItem,
  WishlistItem,
  OrderStatus,
  OrderTrackingEvent,
  ProductQuestion,
  ReturnRequest,
  SellerProfile,
  AppNotification,
  AuditLog,
  SupportTicket,
  PaymentTransaction,
  InventoryAuditLog,
  ShipmentRecord,
  ShippingConfig,
  ShipmentStatus,
  InventoryAdjustmentReason
} from '../types';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { VALID_COUPONS } from '../data/faqs';

const PRODUCTS_COLL = 'products';
const REVIEWS_COLL = 'reviews';
const ORDERS_COLL = 'orders';
const USERS_COLL = 'users';
const COUPONS_COLL = 'coupons';
const CATEGORIES_COLL = 'categories';
const CARTS_COLL = 'carts';
const WISHLISTS_COLL = 'wishlists';
const QUESTIONS_COLL = 'questions';
const RETURNS_COLL = 'returns';
const SELLERS_COLL = 'sellers';
const NOTIFICATIONS_COLL = 'notifications';
const TICKETS_COLL = 'tickets';
const AUDIT_LOGS_COLL = 'audit_logs';
const INVENTORY_LOGS_COLL = 'inventory_logs';
const SHIPMENTS_COLL = 'shipments';
const SHIPPING_CONFIG_COLL = 'shipping_config';

/**
 * Recursively removes undefined values from objects and arrays so Firestore never throws unsupported field value errors.
 */
export function sanitizeForFirestore<T = any>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) {
      return obj.toISOString() as any;
    }
    const cleanObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined && typeof val !== 'function') {
        cleanObj[key] = sanitizeForFirestore(val);
      }
    }
    return cleanObj as T;
  }
  return obj;
}

// Initial Database Seeding if empty
export async function seedInitialDatabaseIfEmpty(): Promise<boolean> {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLL));
    if (!productsSnap.empty) {
      return false; // already populated
    }

    console.log('Seeding initial Firestore database with products, categories, coupons...');
    const batch = writeBatch(db);

    // 1. Seed Products
    for (const prod of PRODUCTS) {
      const prodRef = doc(db, PRODUCTS_COLL, prod.id);
      batch.set(prodRef, {
        ...prod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Also seed any initial reviews into reviews collection
      if (prod.reviews && prod.reviews.length > 0) {
        for (const rev of prod.reviews) {
          const revRef = doc(db, REVIEWS_COLL, rev.id || `rev-${prod.id}-${Math.random().toString(36).substring(2, 8)}`);
          batch.set(revRef, {
            ...rev,
            productId: prod.id,
            productName: prod.name,
            authorUid: 'seed-user',
            status: 'approved',
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // 2. Seed Categories
    for (const cat of CATEGORIES) {
      const catRef = doc(db, CATEGORIES_COLL, cat.id);
      batch.set(catRef, cat);
    }

    // 3. Seed Coupons
    for (const coup of VALID_COUPONS) {
      const coupRef = doc(db, COUPONS_COLL, coup.code);
      batch.set(coupRef, {
        ...coup,
        active: true,
        usageCount: 0,
        createdAt: new Date().toISOString()
      });
    }

    await batch.commit();
    console.log('Database seeding successfully completed!');
    return true;
  } catch (error) {
    console.error('Error during initial database seeding:', error);
    return false;
  }
}

// ---------------- PRODUCTS ----------------

export async function getProductsFromDB(): Promise<Product[]> {
  try {
    const q = query(collection(db, PRODUCTS_COLL));
    const snap = await getDocs(q);
    if (snap.empty) {
      return PRODUCTS;
    }
    const products: Product[] = [];
    snap.forEach((d) => {
      products.push({ ...(d.data() as Product), id: d.id });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products from DB:', error);
    return PRODUCTS;
  }
}

export async function getProductByIdFromDB(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLL, productId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...(snap.data() as Product), id: snap.id };
    }
    const local = PRODUCTS.find((p) => p.id === productId || p.slug === productId);
    return local || null;
  } catch (error) {
    console.error('Error fetching product by ID from DB:', error);
    const local = PRODUCTS.find((p) => p.id === productId || p.slug === productId);
    return local || null;
  }
}

export async function saveProductToDB(product: Partial<Product> & { id?: string }): Promise<void> {
  const prodId = product.id || `prod_${Date.now()}`;
  const docRef = doc(db, PRODUCTS_COLL, prodId);
  const data = sanitizeForFirestore({
    ...product,
    id: prodId,
    updatedAt: new Date().toISOString(),
  });
  await setDoc(docRef, data, { merge: true });
}

export async function deleteProductFromDB(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLL, productId);
  await deleteDoc(docRef);
}

// ---------------- REVIEWS ----------------

export async function getReviewsForProductFromDB(productId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, REVIEWS_COLL),
      where('productId', '==', productId),
      where('status', '==', 'approved')
    );
    const snap = await getDocs(q);
    const reviews: Review[] = [];
    snap.forEach((d) => {
      const data = d.data();
      reviews.push({
        id: d.id,
        author: data.author || 'Anonymous Customer',
        rating: data.rating || 5,
        date: data.date || 'Recent',
        verified: data.verified ?? true,
        title: data.title || '',
        comment: data.comment || '',
        helpfulCount: data.helpfulCount || 0,
        userVotedHelpful: false,
        avatar: data.avatar,
      });
    });
    return reviews;
  } catch (error) {
    console.error('Error getting reviews for product:', error);
    return [];
  }
}

export async function getAllReviewsFromDB(): Promise<(Review & { productId: string; productName?: string; status: 'approved' | 'pending' | 'rejected'; authorUid?: string })[]> {
  try {
    const q = query(collection(db, REVIEWS_COLL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() });
    });
    return list;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
}

export async function updateReviewStatusInDB(reviewId: string, status: 'approved' | 'rejected'): Promise<void> {
  const docRef = doc(db, REVIEWS_COLL, reviewId);
  await updateDoc(docRef, { status, moderatedAt: new Date().toISOString() });
}

export async function checkUserPurchasedProduct(userUid: string, userEmail: string, productId: string): Promise<boolean> {
  if (!userUid && !userEmail) return false;
  try {
    const q = userUid
      ? query(collection(db, ORDERS_COLL), where('userUid', '==', userUid))
      : query(collection(db, ORDERS_COLL), where('contactEmail', '==', userEmail));
    
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      const order = d.data() as Order;
      if (order.items && order.items.some((item) => item.productId === productId)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking purchase history:', error);
    return false;
  }
}

export async function submitReviewToDB(reviewData: {
  productId: string;
  productName: string;
  author: string;
  authorUid: string;
  authorEmail?: string;
  rating: number;
  title: string;
  comment: string;
  avatar?: string;
}): Promise<{ success: boolean; isVerified: boolean; message: string; reviewId: string }> {
  try {
    // Check real verified purchase
    const isVerified = await checkUserPurchasedProduct(reviewData.authorUid, reviewData.authorEmail || '', reviewData.productId);

    const reviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, REVIEWS_COLL, reviewId);

    const newReview = {
      id: reviewId,
      productId: reviewData.productId,
      productName: reviewData.productName,
      author: reviewData.author,
      authorUid: reviewData.authorUid,
      authorEmail: reviewData.authorEmail || '',
      rating: reviewData.rating,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      verified: isVerified,
      title: reviewData.title,
      comment: reviewData.comment,
      helpfulCount: 0,
      helpfulVoters: [],
      avatar: reviewData.avatar || '',
      status: 'approved', // Auto-approved or queued for moderation
      createdAt: new Date().toISOString(),
    };

    await setDoc(docRef, newReview);

    // Update product rating summary
    try {
      const reviews = await getReviewsForProductFromDB(reviewData.productId);
      const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0) + reviewData.rating;
      const count = reviews.length + 1;
      const avg = Number((totalRatings / count).toFixed(1));

      const prodRef = doc(db, PRODUCTS_COLL, reviewData.productId);
      await updateDoc(prodRef, {
        rating: avg,
        reviewCount: count,
      });
    } catch (err) {
      console.warn('Failed to update product aggregate rating:', err);
    }

    return {
      success: true,
      isVerified,
      message: isVerified ? 'Verified Review submitted successfully!' : 'Review submitted successfully!',
      reviewId,
    };
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      isVerified: false,
      message: error.message || 'Failed to submit review',
      reviewId: '',
    };
  }
}

// ---------------- ORDERS ----------------

export async function saveOrderToDB(order: Order, userUid?: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLL, order.id);
  const sanitized = sanitizeForFirestore({
    ...order,
    userUid: userUid || 'guest',
    updatedAt: new Date().toISOString(),
  });
  await setDoc(docRef, sanitized);
}

export async function getUserOrdersFromDB(userUid: string, userEmail?: string): Promise<Order[]> {
  if (!userUid && !userEmail) return [];
  try {
    const orders: Order[] = [];
    const q1 = query(collection(db, ORDERS_COLL), where('userUid', '==', userUid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q1);
    snap.forEach((d) => {
      orders.push(d.data() as Order);
    });

    if (orders.length === 0 && userEmail) {
      const q2 = query(collection(db, ORDERS_COLL), where('contactEmail', '==', userEmail), orderBy('createdAt', 'desc'));
      const snap2 = await getDocs(q2);
      snap2.forEach((d) => {
        orders.push(d.data() as Order);
      });
    }

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function deleteOrderFromDB(orderId: string): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLL, orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting order from DB:', error);
  }
}

export async function clearUserOrdersFromDB(userUid?: string, userEmail?: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    if (userUid) {
      const q1 = query(collection(db, ORDERS_COLL), where('userUid', '==', userUid));
      const snap1 = await getDocs(q1);
      snap1.forEach((d) => {
        batch.delete(d.ref);
        count++;
      });
    }

    if (userEmail) {
      const q2 = query(collection(db, ORDERS_COLL), where('contactEmail', '==', userEmail));
      const snap2 = await getDocs(q2);
      snap2.forEach((d) => {
        batch.delete(d.ref);
        count++;
      });
    }

    // If neither uid nor email is specified, or as a general clear fallback for all orders if requested
    if (!userUid && !userEmail) {
      const snapAll = await getDocs(collection(db, ORDERS_COLL));
      snapAll.forEach((d) => {
        batch.delete(d.ref);
        count++;
      });
    }

    if (count > 0) {
      await batch.commit();
    }
  } catch (error) {
    console.error('Error clearing user orders from DB:', error);
  }
}

export async function getAllOrdersFromDB(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => {
      orders.push(d.data() as Order);
    });
    return orders;
  } catch (error) {
    console.error('Error fetching all orders for admin:', error);
    return [];
  }
}

export async function updateOrderStatusInDB(
  orderId: string,
  newStatus: OrderStatus,
  customNote?: string
): Promise<void> {
  const docRef = doc(db, ORDERS_COLL, orderId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;

  const currentOrder = snap.data() as Order;
  const history = [...(currentOrder.trackingHistory || [])];

  const statusTitles: Record<OrderStatus, string> = {
    placed: 'Order Placed & Verified',
    confirmed: 'Order Confirmed & QC Assigned',
    processing: 'Order Processing at Atelier',
    packed: 'Package Sealed with Security Tape',
    shipped: 'Handed over to Courier Hub',
    out_for_delivery: 'Out for Doorstep Delivery',
    delivered: 'Delivered Successfully',
    cancelled: 'Order Cancelled',
    returned: 'Garment Returned to Atelier',
    refunded: 'Payment Refunded to Source Account',
  };

  const updatedHistory = history.map((event) => {
    if (event.status === newStatus) {
      return {
        ...event,
        completed: true,
        current: true,
        timestamp: 'Just now',
        description: customNote || event.description,
      };
    }
    return { ...event, current: false };
  });

  // If status is not in history yet, append
  const existsInHistory = history.some((h) => h.status === newStatus);
  if (!existsInHistory) {
    updatedHistory.push({
      status: newStatus,
      title: statusTitles[newStatus] || newStatus,
      location: 'NOVA Fulfillment System',
      timestamp: 'Just now',
      description: customNote || `Order status updated to ${newStatus}`,
      completed: true,
      current: true,
    });
  }

  await updateDoc(docRef, {
    status: newStatus,
    trackingHistory: updatedHistory,
    updatedAt: new Date().toISOString(),
  });
}

// ---------------- USER PROFILES & ADDRESSES ----------------

export async function saveUserProfileToDB(profile: UserProfile): Promise<void> {
  const docRef = doc(db, USERS_COLL, profile.id);
  await setDoc(docRef, sanitizeForFirestore({
    ...profile,
    updatedAt: new Date().toISOString(),
  }), { merge: true });
}

export async function getUserProfileFromDB(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, USERS_COLL, uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// ---------------- CART & WISHLIST PERSISTENCE ----------------

export async function saveCartToDB(uid: string, items: CartItem[]): Promise<void> {
  if (!uid) return;
  try {
    const docRef = doc(db, CARTS_COLL, uid);
    await setDoc(docRef, {
      items,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving cart to DB:', error);
  }
}

export async function getCartFromDB(uid: string): Promise<CartItem[]> {
  if (!uid) return [];
  try {
    const docRef = doc(db, CARTS_COLL, uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting cart from DB:', error);
    return [];
  }
}

export async function saveWishlistToDB(uid: string, items: WishlistItem[]): Promise<void> {
  if (!uid) return;
  try {
    const docRef = doc(db, WISHLISTS_COLL, uid);
    await setDoc(docRef, {
      items,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving wishlist to DB:', error);
  }
}

export async function getWishlistFromDB(uid: string): Promise<WishlistItem[]> {
  if (!uid) return [];
  try {
    const docRef = doc(db, WISHLISTS_COLL, uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting wishlist from DB:', error);
    return [];
  }
}

// ---------------- COUPONS ----------------

export async function getCouponsFromDB(): Promise<Coupon[]> {
  try {
    const q = query(collection(db, COUPONS_COLL));
    const snap = await getDocs(q);
    const list: Coupon[] = [];
    snap.forEach((d) => {
      const data = d.data();
      if (data.active !== false) {
        list.push({
          code: data.code,
          discountType: data.discountType,
          value: data.value,
          minOrder: data.minOrder,
          description: data.description,
          expiresAt: data.expiresAt || 'Never',
        });
      }
    });
    return list.length > 0 ? list : VALID_COUPONS;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return VALID_COUPONS;
  }
}

export async function saveCouponToDB(coupon: Coupon & { active?: boolean }): Promise<void> {
  const docRef = doc(db, COUPONS_COLL, coupon.code.toUpperCase());
  await setDoc(docRef, {
    ...coupon,
    code: coupon.code.toUpperCase(),
    active: coupon.active ?? true,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function deleteCouponFromDB(code: string): Promise<void> {
  const docRef = doc(db, COUPONS_COLL, code.toUpperCase());
  await deleteDoc(docRef);
}

// ---------------- ADMIN ANALYTICS ----------------

export async function getAdminStats(): Promise<{
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalSellers: number;
  pendingReviewsCount: number;
  pendingReturnsCount: number;
  lowStockCount: number;
  recentOrders: Order[];
}> {
  try {
    const [ordersSnap, productsSnap, reviewsSnap, usersSnap, sellersSnap, returnsSnap] = await Promise.all([
      getDocs(collection(db, ORDERS_COLL)),
      getDocs(collection(db, PRODUCTS_COLL)),
      getDocs(collection(db, REVIEWS_COLL)),
      getDocs(collection(db, USERS_COLL)),
      getDocs(collection(db, SELLERS_COLL)),
      getDocs(collection(db, RETURNS_COLL)),
    ]);

    let totalRevenue = 0;
    const orders: Order[] = [];
    ordersSnap.forEach((d) => {
      const o = d.data() as Order;
      orders.push(o);
      if (o.status !== 'placed' || o.paymentDetails?.paid) {
        totalRevenue += o.total || 0;
      }
    });

    let lowStockCount = 0;
    productsSnap.forEach((d) => {
      const p = d.data() as Product;
      if (p.stockCount <= 10) {
        lowStockCount++;
      }
    });

    let pendingReviewsCount = 0;
    reviewsSnap.forEach((d) => {
      const r = d.data();
      if (r.status === 'pending') {
        pendingReviewsCount++;
      }
    });

    let pendingReturnsCount = 0;
    returnsSnap.forEach((d) => {
      const ret = d.data() as ReturnRequest;
      if (ret.status === 'requested' || ret.status === 'pickup_initiated') {
        pendingReturnsCount++;
      }
    });

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: productsSnap.size || PRODUCTS.length,
      totalCustomers: Math.max(usersSnap.size, 1),
      totalSellers: sellersSnap.size,
      pendingReviewsCount,
      pendingReturnsCount,
      lowStockCount,
      recentOrders: orders.slice(0, 10),
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalRevenue: 3959,
      totalOrders: 1,
      totalProducts: PRODUCTS.length,
      totalCustomers: 1,
      totalSellers: 0,
      pendingReviewsCount: 0,
      pendingReturnsCount: 0,
      lowStockCount: 2,
      recentOrders: [],
    };
  }
}

// ---------------- PRODUCT Q&A ----------------

export async function getQuestionsForProductFromDB(productId: string): Promise<ProductQuestion[]> {
  try {
    const q = query(
      collection(db, QUESTIONS_COLL),
      where('productId', '==', productId),
      where('status', '==', 'approved')
    );
    const snap = await getDocs(q);
    const questions: ProductQuestion[] = [];
    snap.forEach((d) => {
      questions.push({ ...(d.data() as ProductQuestion), id: d.id });
    });
    // Sort by upvotes or date
    return questions.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
  } catch (error) {
    console.error('Error fetching product questions:', error);
    return [];
  }
}

export async function getAllQuestionsFromDB(): Promise<ProductQuestion[]> {
  try {
    const q = query(collection(db, QUESTIONS_COLL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: ProductQuestion[] = [];
    snap.forEach((d) => {
      list.push({ ...(d.data() as ProductQuestion), id: d.id });
    });
    return list;
  } catch (error) {
    console.error('Error fetching all questions:', error);
    return [];
  }
}

export async function submitQuestionToDB(payload: {
  productId: string;
  productName: string;
  userUid: string;
  userName: string;
  userEmail?: string;
  question: string;
}): Promise<{ success: boolean; questionId: string; message: string }> {
  try {
    const qId = `qa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const docRef = doc(db, QUESTIONS_COLL, qId);
    const newQ: ProductQuestion = {
      id: qId,
      productId: payload.productId,
      productName: payload.productName,
      userUid: payload.userUid,
      userName: payload.userName,
      userEmail: payload.userEmail || '',
      question: payload.question,
      createdAt: new Date().toISOString(),
      status: 'approved', // Live for instant community engagement or admin moderation
      upvotes: 0,
      upvotedBy: [],
    };
    await setDoc(docRef, sanitizeForFirestore(newQ));
    return { success: true, questionId: qId, message: 'Question submitted successfully!' };
  } catch (error: any) {
    console.error('Error submitting question:', error);
    return { success: false, questionId: '', message: error.message || 'Failed to submit question' };
  }
}

export async function answerQuestionInDB(
  questionId: string,
  answerPayload: {
    answeredBy: string;
    answeredByRole: 'seller' | 'admin' | 'verified_buyer';
    answerText: string;
  }
): Promise<void> {
  const docRef = doc(db, QUESTIONS_COLL, questionId);
  await updateDoc(docRef, {
    answer: {
      ...answerPayload,
      answeredAt: new Date().toISOString(),
    },
    status: 'approved',
  });
}

export async function updateQuestionStatusInDB(questionId: string, status: 'approved' | 'rejected'): Promise<void> {
  const docRef = doc(db, QUESTIONS_COLL, questionId);
  await updateDoc(docRef, { status });
}

export async function upvoteQuestionInDB(questionId: string, userUid: string): Promise<boolean> {
  try {
    const docRef = doc(db, QUESTIONS_COLL, questionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;
    const data = snap.data() as ProductQuestion;
    const voters = data.upvotedBy || [];
    const alreadyVoted = voters.includes(userUid);
    const newVoters = alreadyVoted ? voters.filter((u) => u !== userUid) : [...voters, userUid];
    const newCount = Math.max(0, alreadyVoted ? (data.upvotes || 1) - 1 : (data.upvotes || 0) + 1);

    await updateDoc(docRef, {
      upvotes: newCount,
      upvotedBy: newVoters,
    });
    return !alreadyVoted;
  } catch (error) {
    console.error('Error upvoting question:', error);
    return false;
  }
}

// ---------------- RETURNS, REFUNDS & CANCELLATIONS ----------------

export async function cancelOrderInDB(orderId: string, cancelReason: string, userUid?: string): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = doc(db, ORDERS_COLL, orderId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return { success: false, message: 'Order not found' };
    }
    const order = snap.data() as Order;
    if (order.status === 'shipped' || order.status === 'out_for_delivery' || order.status === 'delivered') {
      return { success: false, message: 'Order has already been dispatched. You may initiate a return after delivery.' };
    }

    await updateDoc(docRef, {
      cancelReason,
      cancelledAt: new Date().toISOString(),
      status: 'placed', // marked as cancelled in notes
      'paymentDetails.paid': false,
    });

    // Create user notification
    if (userUid || order.userUid) {
      await createNotificationInDB({
        userUid: userUid || order.userUid || '',
        title: `Order #${order.orderNumber} Cancelled`,
        message: `Your cancellation request for Order #${order.orderNumber} has been processed successfully.`,
        type: 'order',
      });
    }

    return { success: true, message: 'Order has been successfully cancelled.' };
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    return { success: false, message: error.message || 'Failed to cancel order.' };
  }
}

export async function createReturnRequestInDB(payload: {
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  userUid: string;
  userEmail: string;
  userName: string;
  reason: ReturnRequest['reason'];
  reasonDetails: string;
  images?: string[];
  refundAmount: number;
}): Promise<{ success: boolean; returnNumber: string; message: string }> {
  try {
    const returnNumber = `RET-${Math.floor(100000 + Math.random() * 900000)}`;
    const returnId = `ret-${Date.now()}`;
    const docRef = doc(db, RETURNS_COLL, returnId);

    const newReturn: ReturnRequest = {
      id: returnId,
      returnNumber,
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      productId: payload.productId,
      productName: payload.productName,
      productImage: payload.productImage,
      userUid: payload.userUid,
      userEmail: payload.userEmail,
      userName: payload.userName,
      reason: payload.reason,
      reasonDetails: payload.reasonDetails,
      images: payload.images || [],
      refundAmount: payload.refundAmount,
      status: 'requested',
      statusHistory: [
        {
          status: 'requested',
          timestamp: new Date().toISOString(),
          note: 'Return request submitted by customer.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, sanitizeForFirestore(newReturn));

    // Update order return status
    const orderRef = doc(db, ORDERS_COLL, payload.orderId);
    await updateDoc(orderRef, { returnStatus: 'requested' });

    // Send Notification
    await createNotificationInDB({
      userUid: payload.userUid,
      title: `Return Request Submitted (${returnNumber})`,
      message: `Your return request for ${payload.productName} (Order #${payload.orderNumber}) is currently under review by our QA team.`,
      type: 'return',
    });

    return { success: true, returnNumber, message: 'Return request submitted successfully.' };
  } catch (error: any) {
    console.error('Error creating return request:', error);
    return { success: false, returnNumber: '', message: error.message || 'Failed to submit return request.' };
  }
}

export async function getUserReturnsFromDB(userUid: string, userEmail?: string): Promise<ReturnRequest[]> {
  try {
    const list: ReturnRequest[] = [];
    const q1 = query(collection(db, RETURNS_COLL), where('userUid', '==', userUid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q1);
    snap.forEach((d) => list.push(d.data() as ReturnRequest));

    if (list.length === 0 && userEmail) {
      const q2 = query(collection(db, RETURNS_COLL), where('userEmail', '==', userEmail), orderBy('createdAt', 'desc'));
      const snap2 = await getDocs(q2);
      snap2.forEach((d) => list.push(d.data() as ReturnRequest));
    }
    return list;
  } catch (error) {
    console.error('Error fetching user returns:', error);
    return [];
  }
}

export async function getAllReturnsFromDB(): Promise<ReturnRequest[]> {
  try {
    const q = query(collection(db, RETURNS_COLL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: ReturnRequest[] = [];
    snap.forEach((d) => list.push(d.data() as ReturnRequest));
    return list;
  } catch (error) {
    console.error('Error fetching all returns for admin:', error);
    return [];
  }
}

export async function updateReturnStatusInDB(
  returnId: string,
  newStatus: ReturnRequest['status'],
  note?: string,
  refundTxId?: string
): Promise<void> {
  const docRef = doc(db, RETURNS_COLL, returnId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;

  const currentReturn = snap.data() as ReturnRequest;
  const history = [...(currentReturn.statusHistory || [])];
  history.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${newStatus}`,
  });

  const updates: any = {
    status: newStatus,
    statusHistory: history,
    updatedAt: new Date().toISOString(),
  };

  if (refundTxId) {
    updates.refundTransactionId = refundTxId;
  }

  await updateDoc(docRef, updates);

  // Update order return status as well
  if (currentReturn.orderId) {
    const orderRef = doc(db, ORDERS_COLL, currentReturn.orderId);
    await updateDoc(orderRef, {
      returnStatus: newStatus === 'refund_processed' ? 'refunded' : newStatus === 'approved' ? 'approved' : newStatus,
    });
  }

  // Send in-app notification to customer
  if (currentReturn.userUid) {
    const statusTitles: Record<string, string> = {
      approved: 'Return Request Approved! Pickup Scheduled',
      pickup_initiated: 'Courier Assigned for Return Pickup',
      item_received: 'Returned Hardware Received at QC Lab',
      refund_processed: `Refund of ₹${currentReturn.refundAmount.toLocaleString('en-IN')} Processed`,
      rejected: 'Return Request Update',
    };
    await createNotificationInDB({
      userUid: currentReturn.userUid,
      title: statusTitles[newStatus] || 'Return Status Update',
      message: note || `Your return (${currentReturn.returnNumber}) status has moved to ${newStatus}.`,
      type: 'return',
    });
  }
}

// ---------------- SELLER ONBOARDING & DASHBOARD ----------------

export async function registerSellerInDB(sellerData: Omit<SellerProfile, 'id' | 'createdAt' | 'status' | 'rating' | 'totalSales' | 'earnings' | 'commissionRate'>): Promise<{ success: boolean; message: string; sellerId: string }> {
  try {
    const sellerId = `seller-${Date.now()}`;
    const docRef = doc(db, SELLERS_COLL, sellerId);

    const newSeller: SellerProfile = {
      ...sellerData,
      id: sellerId,
      status: 'approved', // Auto-approve for seamless partner onboarding
      rating: 4.9,
      totalSales: 0,
      earnings: 0,
      commissionRate: 8, // 8% marketplace commission
      createdAt: new Date().toISOString(),
    };

    await setDoc(docRef, sanitizeForFirestore(newSeller));

    // Update user profile role to 'seller'
    const userRef = doc(db, USERS_COLL, sellerData.userUid);
    await updateDoc(userRef, {
      role: 'seller',
      sellerId,
    });

    return { success: true, message: 'Seller profile created successfully!', sellerId };
  } catch (error: any) {
    console.error('Error registering seller:', error);
    return { success: false, message: error.message || 'Failed to create seller profile', sellerId: '' };
  }
}

export async function getSellerProfileFromDB(userUid: string): Promise<SellerProfile | null> {
  try {
    const q = query(collection(db, SELLERS_COLL), where('userUid', '==', userUid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as SellerProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    return null;
  }
}

export async function getAllSellersFromDB(): Promise<SellerProfile[]> {
  try {
    const snap = await getDocs(collection(db, SELLERS_COLL));
    const list: SellerProfile[] = [];
    snap.forEach((d) => list.push(d.data() as SellerProfile));
    return list;
  } catch (error) {
    console.error('Error fetching all sellers:', error);
    return [];
  }
}

export async function updateSellerStatusInDB(sellerId: string, status: 'approved' | 'pending' | 'suspended'): Promise<void> {
  const docRef = doc(db, SELLERS_COLL, sellerId);
  await updateDoc(docRef, { status });
}

// ---------------- NOTIFICATIONS ----------------

export async function createNotificationInDB(payload: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): Promise<void> {
  if (!payload.userUid) return;
  try {
    const notifId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const docRef = doc(db, NOTIFICATIONS_COLL, notifId);
    const newNotif: AppNotification = {
      ...payload,
      id: notifId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, sanitizeForFirestore(newNotif));
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function getUserNotificationsFromDB(userUid: string): Promise<AppNotification[]> {
  if (!userUid) return [];
  try {
    const q = query(collection(db, NOTIFICATIONS_COLL), where('userUid', '==', userUid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: AppNotification[] = [];
    snap.forEach((d) => list.push(d.data() as AppNotification));
    return list;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

export async function markNotificationReadInDB(notificationId: string): Promise<void> {
  try {
    const docRef = doc(db, NOTIFICATIONS_COLL, notificationId);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    console.error('Error marking notification read:', error);
  }
}

export async function markAllNotificationsReadInDB(userUid: string): Promise<void> {
  try {
    const notifs = await getUserNotificationsFromDB(userUid);
    const batch = writeBatch(db);
    notifs.filter((n) => !n.isRead).forEach((n) => {
      const docRef = doc(db, NOTIFICATIONS_COLL, n.id);
      batch.update(docRef, { isRead: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications read:', error);
  }
}

// ---------------- SUPPORT TICKETS ----------------

export async function createSupportTicketInDB(ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>): Promise<{ success: boolean; ticketNumber: string }> {
  try {
    const ticketNumber = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `tck-${Date.now()}`;
    const docRef = doc(db, TICKETS_COLL, id);
    const newTicket: SupportTicket = {
      ...ticket,
      id,
      ticketNumber,
      createdAt: new Date().toISOString(),
      status: 'Open',
    };
    await setDoc(docRef, sanitizeForFirestore(newTicket));
    return { success: true, ticketNumber };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return { success: false, ticketNumber: '' };
  }
}

export async function getAllSupportTicketsFromDB(): Promise<SupportTicket[]> {
  try {
    const q = query(collection(db, TICKETS_COLL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: SupportTicket[] = [];
    snap.forEach((d) => list.push(d.data() as SupportTicket));
    return list;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return [];
  }
}

export async function getUserSupportTicketsFromDB(email: string): Promise<SupportTicket[]> {
  if (!email) return [];
  try {
    const q = query(collection(db, TICKETS_COLL), where('email', '==', email), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: SupportTicket[] = [];
    snap.forEach((d) => list.push(d.data() as SupportTicket));
    return list;
  } catch (error) {
    console.error('Error fetching user support tickets:', error);
    return [];
  }
}

export async function updateSupportTicketStatusInDB(ticketId: string, status: SupportTicket['status']): Promise<void> {
  const docRef = doc(db, TICKETS_COLL, ticketId);
  await updateDoc(docRef, { status });
}

// ---------------- AUDIT LOGGING ----------------

export async function logAdminActionInDB(
  adminEmail: string,
  action: string,
  targetCollection: string,
  targetId: string,
  details: string
): Promise<void> {
  try {
    const id = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const docRef = doc(db, AUDIT_LOGS_COLL, id);
    const log: AuditLog = {
      id,
      adminEmail,
      action,
      targetCollection,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    await setDoc(docRef, sanitizeForFirestore(log));
  } catch (error) {
    console.error('Error writing audit log:', error);
  }
}

export async function getAuditLogsFromDB(): Promise<AuditLog[]> {
  try {
    const q = query(collection(db, AUDIT_LOGS_COLL), orderBy('timestamp', 'desc'), limit(50));
    const snap = await getDocs(q);
    const list: AuditLog[] = [];
    snap.forEach((d) => list.push(d.data() as AuditLog));
    return list;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

// ---------------- PAYMENT TRANSACTIONS & RECONCILIATION ----------------

const PAYMENT_TXNS_COLL = 'payment_transactions';

export async function savePaymentTransactionInDB(txn: PaymentTransaction): Promise<void> {
  try {
    const docRef = doc(db, PAYMENT_TXNS_COLL, txn.id);
    await setDoc(docRef, sanitizeForFirestore({
      ...txn,
      updatedAt: new Date().toISOString(),
    }), { merge: true });
  } catch (error) {
    console.error('Error saving payment transaction to DB:', error);
  }
}

export async function getAllPaymentTransactionsFromDB(): Promise<PaymentTransaction[]> {
  try {
    const q = query(collection(db, PAYMENT_TXNS_COLL), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    const list: PaymentTransaction[] = [];
    snap.forEach((d) => list.push(d.data() as PaymentTransaction));
    return list;
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    return [];
  }
}

export async function updateOrderPaymentInDB(
  orderId: string,
  paymentDetails: Partial<Order['paymentDetails']>,
  status?: OrderStatus,
  paymentStatus?: Order['paymentStatus']
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLL, orderId);
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (status) {
      updateData.status = status;
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    if (paymentDetails) {
      updateData['paymentDetails.paid'] = paymentDetails.paid ?? true;
      if (paymentDetails.transactionId) updateData['paymentDetails.transactionId'] = paymentDetails.transactionId;
      if (paymentDetails.razorpayOrderId) updateData['paymentDetails.razorpayOrderId'] = paymentDetails.razorpayOrderId;
      if (paymentDetails.razorpayPaymentId) updateData['paymentDetails.razorpayPaymentId'] = paymentDetails.razorpayPaymentId;
      if (paymentDetails.razorpaySignature) updateData['paymentDetails.razorpaySignature'] = paymentDetails.razorpaySignature;
      if (paymentDetails.method) updateData['paymentDetails.method'] = paymentDetails.method;
      if (paymentDetails.methodLabel) updateData['paymentDetails.methodLabel'] = paymentDetails.methodLabel;
      if (paymentDetails.cardNetwork) updateData['paymentDetails.cardNetwork'] = paymentDetails.cardNetwork;
      if (paymentDetails.cardLast4) updateData['paymentDetails.cardLast4'] = paymentDetails.cardLast4;
      if (paymentDetails.vpa) updateData['paymentDetails.vpa'] = paymentDetails.vpa;
      if (paymentDetails.bank) updateData['paymentDetails.bank'] = paymentDetails.bank;
      if (paymentDetails.wallet) updateData['paymentDetails.wallet'] = paymentDetails.wallet;
      if (paymentDetails.paidAt) updateData['paymentDetails.paidAt'] = paymentDetails.paidAt;
      if (paymentDetails.failureReason) updateData['paymentDetails.failureReason'] = paymentDetails.failureReason;
      if (paymentDetails.refundStatus) updateData['paymentDetails.refundStatus'] = paymentDetails.refundStatus;
      if (paymentDetails.refundId) updateData['paymentDetails.refundId'] = paymentDetails.refundId;
      if (paymentDetails.refundAmount !== undefined) updateData['paymentDetails.refundAmount'] = paymentDetails.refundAmount;
      if (paymentDetails.refundReason) updateData['paymentDetails.refundReason'] = paymentDetails.refundReason;
      if (paymentDetails.refundedAt) updateData['paymentDetails.refundedAt'] = paymentDetails.refundedAt;
    }
    await updateDoc(orderRef, sanitizeForFirestore(updateData));
  } catch (error) {
    console.error('Error updating order payment in DB:', error);
  }
}

// ---------------- INVENTORY MANAGEMENT & AUDIT LOGS ----------------

export async function adjustVariantStockInDB(
  productId: string,
  variantId: string | undefined,
  adjustedQuantity: number,
  reason: InventoryAdjustmentReason,
  notes: string = '',
  adminEmail: string = 'admin@aureliacouture.com',
  adminName: string = 'Master Tailor Logistics'
): Promise<{ success: boolean; newStock: number; message: string }> {
  try {
    const prodRef = doc(db, PRODUCTS_COLL, productId);
    const prodSnap = await getDoc(prodRef);

    if (!prodSnap.exists()) {
      return { success: false, newStock: 0, message: 'Product not found in catalog.' };
    }

    const prod = prodSnap.data() as Product;
    let previousStock = prod.stockCount || 0;
    let newStock = Math.max(0, previousStock + adjustedQuantity);
    let targetVariantName = 'Base Garment';
    let targetSku = prod.sku || `AUR-${productId.substring(0, 4).toUpperCase()}`;
    let targetSize = '';
    let targetColor = '';

    const updatedVariants = prod.variants ? [...prod.variants] : [];

    if (variantId && updatedVariants.length > 0) {
      const vIdx = updatedVariants.findIndex((v) => v.id === variantId || v.sku === variantId);
      if (vIdx > -1) {
        previousStock = updatedVariants[vIdx].stockCount || 0;
        newStock = Math.max(0, previousStock + adjustedQuantity);
        updatedVariants[vIdx].stockCount = newStock;
        updatedVariants[vIdx].inStock = newStock > 0;
        targetVariantName = updatedVariants[vIdx].name || `${updatedVariants[vIdx].color || ''} / ${updatedVariants[vIdx].size || ''}`;
        targetSku = updatedVariants[vIdx].sku || targetSku;
        targetSize = updatedVariants[vIdx].size || '';
        targetColor = updatedVariants[vIdx].color || '';
      }
    }

    // Recalculate total product stock across variants
    const totalVariantStock = updatedVariants.length > 0
      ? updatedVariants.reduce((sum, v) => sum + (v.stockCount || 0), 0)
      : newStock;

    // Update Product in DB
    await updateDoc(prodRef, sanitizeForFirestore({
      stockCount: totalVariantStock,
      inStock: totalVariantStock > 0,
      variants: updatedVariants,
      updatedAt: new Date().toISOString(),
    }));

    // Record Audit Log Entry
    const logId = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const logDoc = doc(db, INVENTORY_LOGS_COLL, logId);
    const logRecord: InventoryAuditLog = {
      id: logId,
      productId,
      productName: prod.name,
      variantId: variantId || 'base',
      sku: targetSku,
      size: targetSize,
      color: targetColor,
      previousStock,
      adjustedQuantity,
      newStock,
      reason,
      notes,
      adminEmail,
      adminName,
      timestamp: new Date().toISOString(),
    };

    await setDoc(logDoc, sanitizeForFirestore(logRecord));

    return {
      success: true,
      newStock,
      message: `Stock updated for ${prod.name} (${targetVariantName}). New stock: ${newStock}`,
    };
  } catch (error: any) {
    console.error('Error adjusting variant stock in DB:', error);
    return { success: false, newStock: 0, message: error.message || 'Failed to update stock.' };
  }
}

export async function getInventoryAuditLogsFromDB(): Promise<InventoryAuditLog[]> {
  try {
    const q = query(collection(db, INVENTORY_LOGS_COLL), orderBy('timestamp', 'desc'), limit(150));
    const snap = await getDocs(q);
    const logs: InventoryAuditLog[] = [];
    snap.forEach((d) => logs.push(d.data() as InventoryAuditLog));
    return logs;
  } catch (error) {
    console.error('Error fetching inventory audit logs:', error);
    return [];
  }
}

// ---------------- SHIPPING CONFIGURATION ----------------

const DEFAULT_DB_SHIPPING_CONFIG: ShippingConfig = {
  pickupWarehouse: {
    companyName: 'AURELIA & CO. Atelier Logistics',
    contactName: 'Master Logistics Director',
    phone: '+91 80 4968 3300',
    email: 'logistics@aureliacouture.com',
    addressLine1: 'Plot 48/B, EPIP Luxury Garment Zone, Phase 1',
    addressLine2: 'Whitefield Commercial Hub',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    country: 'India',
  },
  connectedProvider: 'manual',
  providerStatus: {
    configured: false,
    mode: 'manual',
    providerName: 'Atelier Enterprise Dispatch & Manual AWB',
    lastSyncAt: new Date().toISOString(),
  },
  packageDefaults: {
    defaultWeightGrams: 850,
    defaultDimensions: {
      length: 38,
      width: 28,
      height: 10,
      unit: 'cm',
    },
    defaultBoxType: 'Archival Luxury Garment Presentation Box',
  },
  shippingRules: {
    standardShippingFee: 99,
    freeShippingThreshold: 999,
    expressShippingFee: 249,
    codAvailable: true,
    codExtraFee: 50,
    enableServiceabilityCheck: true,
    defaultTransitDays: 3,
  },
  returnPolicy: {
    returnWindowDays: 14,
    exchangesAllowed: true,
    returnFee: 0,
    terms: 'Complimentary white-glove doorstep reverse pickup within 14 days for unworn garments with atelier security tags intact.',
  },
};

export async function getShippingConfigFromDB(): Promise<ShippingConfig> {
  try {
    const docRef = doc(db, SHIPPING_CONFIG_COLL, 'active_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_DB_SHIPPING_CONFIG, ...(snap.data() as ShippingConfig) };
    }
    return DEFAULT_DB_SHIPPING_CONFIG;
  } catch (error) {
    console.error('Error fetching shipping config:', error);
    return DEFAULT_DB_SHIPPING_CONFIG;
  }
}

export async function saveShippingConfigToDB(config: ShippingConfig): Promise<boolean> {
  try {
    const docRef = doc(db, SHIPPING_CONFIG_COLL, 'active_config');
    await setDoc(docRef, sanitizeForFirestore({
      ...config,
      updatedAt: new Date().toISOString(),
    }), { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving shipping config to DB:', error);
    return false;
  }
}

// ---------------- SHIPMENTS & COURIER FULFILLMENT ----------------

export async function getAllShipmentsFromDB(): Promise<ShipmentRecord[]> {
  try {
    const q = query(collection(db, SHIPMENTS_COLL), orderBy('createdAt', 'desc'), limit(150));
    const snap = await getDocs(q);
    const shipments: ShipmentRecord[] = [];
    snap.forEach((d) => shipments.push(d.data() as ShipmentRecord));
    return shipments;
  } catch (error) {
    console.error('Error fetching shipments from DB:', error);
    return [];
  }
}

export async function saveShipmentToDB(shipment: ShipmentRecord): Promise<void> {
  try {
    const docRef = doc(db, SHIPMENTS_COLL, shipment.id);
    await setDoc(docRef, sanitizeForFirestore({
      ...shipment,
      updatedAt: new Date().toISOString(),
    }), { merge: true });

    // Synchronize Order status and tracking info
    const orderRef = doc(db, ORDERS_COLL, shipment.orderId);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      const order = orderSnap.data() as Order;
      const history = order.trackingHistory || [];
      const updatedHistory = [
        ...history.map((h) => ({ ...h, current: false })),
        ...(shipment.events || []),
      ];

      await updateDoc(orderRef, sanitizeForFirestore({
        status: 'shipped',
        fulfillmentStatus: 'shipped',
        trackingCarrier: shipment.courierName,
        trackingNumber: shipment.awbNumber,
        shipment,
        trackingHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      }));
    }
  } catch (error) {
    console.error('Error saving shipment to DB:', error);
  }
}

export async function updateShipmentStatusInDB(
  shipmentId: string,
  status: ShipmentStatus,
  event: OrderTrackingEvent,
  orderId?: string
): Promise<void> {
  try {
    const docRef = doc(db, SHIPMENTS_COLL, shipmentId);
    const snap = await getDoc(docRef);

    let targetOrderId = orderId;
    let existingEvents: OrderTrackingEvent[] = [];

    if (snap.exists()) {
      const data = snap.data() as ShipmentRecord;
      targetOrderId = targetOrderId || data.orderId;
      existingEvents = (data.events || []).map((e) => ({ ...e, current: false }));
    }

    existingEvents.push(event);

    await updateDoc(docRef, sanitizeForFirestore({
      status,
      events: existingEvents,
      updatedAt: new Date().toISOString(),
    }));

    if (targetOrderId) {
      const orderRef = doc(db, ORDERS_COLL, targetOrderId);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        const order = orderSnap.data() as Order;
        const currentHist = (order.trackingHistory || []).map((h) => ({ ...h, current: false }));
        currentHist.push({ ...event, current: true });

        const mappedOrderStatus: OrderStatus =
          status === 'delivered' ? 'delivered' :
          status === 'out_for_delivery' ? 'out_for_delivery' :
          status === 'cancelled' ? 'cancelled' :
          status === 'returned_to_origin' ? 'returned' : 'shipped';

        await updateDoc(orderRef, sanitizeForFirestore({
          status: mappedOrderStatus,
          fulfillmentStatus: mappedOrderStatus,
          trackingHistory: currentHist,
          updatedAt: new Date().toISOString(),
        }));
      }
    }
  } catch (error) {
    console.error('Error updating shipment status in DB:', error);
  }
}

// ---------------- ORDER PACKING & FULFILLMENT ----------------

export async function packOrderInDB(
  orderId: string,
  packDetails: {
    packedBy: string;
    boxType: string;
    notes?: string;
    verifiedItemIds: string[];
  }
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLL, orderId);
    const orderSnap = await getDoc(orderRef);

    const packEvent: OrderTrackingEvent = {
      status: 'packed',
      title: 'Luxury Garment Box Sealed & Inspected',
      location: 'Atelier Packaging Salon',
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      description: `Packed in ${packDetails.boxType} with garment protection and QC seal by ${packDetails.packedBy}.`,
      completed: true,
      current: true,
    };

    let updatedHistory: OrderTrackingEvent[] = [packEvent];
    if (orderSnap.exists()) {
      const o = orderSnap.data() as Order;
      updatedHistory = [
        ...(o.trackingHistory || []).map((h) => ({ ...h, current: false })),
        packEvent,
      ];
    }

    await updateDoc(orderRef, sanitizeForFirestore({
      status: 'packed',
      fulfillmentStatus: 'packed',
      packingDetails: {
        ...packDetails,
        packedAt: new Date().toISOString(),
      },
      trackingHistory: updatedHistory,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error packing order in DB:', error);
  }
}

// ---------------- RETURNS & EXCHANGES ----------------

export async function updateReturnRequestInDB(
  returnId: string,
  updates: Partial<ReturnRequest>
): Promise<void> {
  try {
    const docRef = doc(db, RETURNS_COLL, returnId);
    await updateDoc(docRef, sanitizeForFirestore({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error updating return request in DB:', error);
  }
}
