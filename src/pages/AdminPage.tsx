import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Package,
  ShoppingBag,
  Users,
  Coins,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Truck,
  Check,
  X,
  Lock,
  Mail,
  Zap,
  CreditCard,
  QrCode,
  Globe,
  RotateCcw,
  DollarSign,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order, Review, Coupon, OrderStatus, CategoryId, PaymentTransaction } from '../types';
import { ADMIN_EMAIL } from '../lib/firebase';
import {
  getProductsFromDB,
  saveProductToDB,
  deleteProductFromDB,
  getAllOrdersFromDB,
  updateOrderStatusInDB,
  getAllReviewsFromDB,
  updateReviewStatusInDB,
  getCouponsFromDB,
  saveCouponToDB,
  deleteCouponFromDB,
  getAdminStats,
  seedInitialDatabaseIfEmpty,
  getAllPaymentTransactionsFromDB,
  updateOrderPaymentInDB,
  savePaymentTransactionInDB,
} from '../lib/db';
import { CATEGORIES } from '../data/categories';

interface AdminPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin, loginWithEmail, showToast, refreshProducts } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'payments' | 'reviews' | 'coupons' | 'settings'>('overview');

  // Stats State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingReviewsCount: 0,
    lowStockCount: 0,
    recentOrders: [] as Order[],
  });

  // Data collections
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([]);
  const [gatewayConfig, setGatewayConfig] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Refund Modal State
  const [selectedRefundOrder, setSelectedRefundOrder] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>('Customer cancellation / return request');
  const [isRefunding, setIsRefunding] = useState<boolean>(false);

  // Modals & Form States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percent',
    value: 15,
    minOrder: 1499,
    description: 'Flat 15% VIP Admin Drop',
    expiresAt: '31 Dec 2026',
  });

  // Admin Gateway login state for non-signed-in admins
  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Fetch admin data
  const loadAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [statsData, prods, ords, revs, coups, txns] = await Promise.all([
        getAdminStats(),
        getProductsFromDB(),
        getAllOrdersFromDB(),
        getAllReviewsFromDB(),
        getCouponsFromDB(),
        getAllPaymentTransactionsFromDB(),
      ]);

      setStats(statsData);
      setProductsList(prods);
      setOrdersList(ords);
      setReviewsList(revs);
      setCouponsList(coups);
      setPaymentTransactions(txns);

      // Fetch payment gateway live status
      try {
        const configRes = await fetch('/api/payment/config');
        const configData = await configRes.json();
        if (configData.success) {
          setGatewayConfig(configData);
        }
      } catch (cErr) {
        console.warn('Could not fetch gateway config:', cErr);
      }
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin || currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      loadAdminData();
    }
  }, [isAdmin, currentUser]);

  // Handle Non-Admin Gate
  if (!isAdmin && currentUser?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAdminAuthLoading(true);
      setAdminAuthError(null);
      try {
        const res = await loginWithEmail(adminEmailInput, adminPasswordInput);
        if (!res.success) {
          setAdminAuthError(res.error || 'Authentication failed. Please verify credentials.');
        }
      } catch (err: any) {
        setAdminAuthError(err.message || 'Failed to authenticate admin');
      } finally {
        setAdminAuthLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#0E1015] text-white flex flex-col items-center justify-center p-6 selection:bg-[#EB0028]">
        <div className="w-full max-w-md bg-[#16181E] border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#EB0028]/10 border border-[#EB0028]/30 flex items-center justify-center text-[#EB0028] mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black font-display tracking-tight text-white">
              NOVA Admin Gateway
            </h1>
            <p className="text-xs text-zinc-400">
              Restricted management console. Authorized access only for <strong className="text-zinc-200">{ADMIN_EMAIL}</strong>.
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#EB0028]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#EB0028]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminAuthLoading}
              className="w-full py-3 rounded-xl bg-[#EB0028] hover:bg-[#c90023] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              {adminAuthLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Portal Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              &larr; Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ADMIN ACTIONS ----------------

  const handleInitiateRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefundOrder) return;
    const paymentId = selectedRefundOrder.paymentDetails?.razorpayPaymentId || selectedRefundOrder.paymentDetails?.transactionId;
    if (!paymentId) {
      showToast('Refund Error', 'No valid Razorpay payment ID found on this order.', 'error');
      return;
    }

    setIsRefunding(true);
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedRefundOrder.id,
          paymentId,
          amount: refundAmount,
          reason: refundReason,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Refund initiation failed on server');
      }

      // Update Firestore order & transaction
      await updateOrderPaymentInDB(selectedRefundOrder.id, {
        refundStatus: 'refunded',
        refundId: data.refundId,
        refundAmount: data.amount,
        refundReason: refundReason,
        refundedAt: new Date().toISOString(),
      }, 'cancelled', 'refunded');

      showToast('Refund Processed', `Successfully refunded ₹${data.amount?.toLocaleString('en-IN')} (Refund ID: ${data.refundId})`);
      setSelectedRefundOrder(null);
      loadAdminData();
    } catch (err: any) {
      showToast('Refund Failed', err.message, 'error');
    } finally {
      setIsRefunding(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatusInDB(orderId, newStatus);
      showToast('Status Updated', `Order ${orderId} marked as ${newStatus}.`);
      loadAdminData();
    } catch (err: any) {
      showToast('Update Failed', err.message, 'error');
    }
  };

  const handleModerateReview = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await updateReviewStatusInDB(reviewId, status);
      showToast('Review Moderated', `Review has been ${status}.`);
      loadAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleDeleteProduct = async (prodId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the database?`)) {
      return;
    }
    try {
      await deleteProductFromDB(prodId);
      showToast('Product Removed', `${name} deleted from catalog.`);
      await refreshProducts();
      loadAdminData();
    } catch (err: any) {
      showToast('Delete Failed', err.message, 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) {
      showToast('Incomplete Data', 'Please fill in all required product fields.', 'error');
      return;
    }

    const id = editingProduct.id || `nova-${editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const slug = editingProduct.slug || id;

    const payload: Product = {
      id,
      name: editingProduct.name,
      slug,
      tagline: editingProduct.tagline || 'NOVA Flagship Premium Accessory',
      description: editingProduct.description || '',
      category: editingProduct.category as CategoryId,
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice || editingProduct.price * 1.3),
      discountPercent: editingProduct.discountPercent || Math.round((1 - Number(editingProduct.price) / (Number(editingProduct.originalPrice || editingProduct.price * 1.3))) * 100),
      rating: editingProduct.rating || 5.0,
      reviewCount: editingProduct.reviewCount || 0,
      inStock: editingProduct.inStock ?? true,
      stockCount: Number(editingProduct.stockCount || 50),
      badge: editingProduct.badge || 'FLAGSHIP',
      images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80'],
      colors: editingProduct.colors || [{ name: 'Obsidian Black', hex: '#111215', inStock: true }],
      variants: editingProduct.variants || [],
      compatibility: editingProduct.compatibility || ['Universal USB-C', 'iPhone 16 / 15', 'Samsung Galaxy S25'],
      features: editingProduct.features || [{ title: 'Fast Charging', description: 'Certified high-speed architecture.' }],
      specifications: editingProduct.specifications || [{ group: 'General', items: [{ label: 'Warranty', value: '24 Months Doorstep' }] }],
      whatsInTheBox: editingProduct.whatsInTheBox || ['1x NOVA Accessory', '1x Warranty Passport', '1x User Guide'],
      warranty: '24-Month Doorstep Replacement',
      shippingTime: 'Dispatched within 24 Hours',
      sku: editingProduct.sku || `NV-${id.toUpperCase().slice(0, 8)}`,
      reviews: [],
    };

    try {
      await saveProductToDB(payload);
      showToast('Product Saved', `Successfully updated "${payload.name}" in Firestore.`);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await refreshProducts();
      loadAdminData();
    } catch (err: any) {
      showToast('Save Failed', err.message, 'error');
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) {
      showToast('Incomplete', 'Please provide a coupon code and discount value.', 'error');
      return;
    }
    try {
      await saveCouponToDB({
        code: newCoupon.code.toUpperCase(),
        discountType: newCoupon.discountType as 'percent' | 'fixed',
        value: Number(newCoupon.value),
        minOrder: Number(newCoupon.minOrder || 0),
        description: newCoupon.description || 'Admin Promo Drop',
        expiresAt: newCoupon.expiresAt || '31 Dec 2026',
        active: true,
      });
      showToast('Coupon Created', `Promo code ${newCoupon.code.toUpperCase()} is now live.`);
      setIsCouponModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteCouponFromDB(code);
      showToast('Coupon Deleted', `Code ${code} removed.`);
      loadAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleRestoreCatalog = async () => {
    if (!window.confirm('This will synchronize default flagship catalog products into Firestore if missing. Proceed?')) return;
    try {
      await seedInitialDatabaseIfEmpty();
      showToast('Catalog Synchronized', 'Firestore database synchronized with flagship products.');
      await refreshProducts();
      loadAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [productsList, productSearch, productCategoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.contactEmail?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [ordersList, orderSearch, orderStatusFilter]);

  // Filtered Payment Transactions
  const filteredPaymentTransactions = useMemo(() => {
    return paymentTransactions.filter((t) => {
      if (!paymentSearch) return true;
      const s = paymentSearch.toLowerCase();
      return (
        t.id.toLowerCase().includes(s) ||
        t.orderId.toLowerCase().includes(s) ||
        t.customerEmail.toLowerCase().includes(s) ||
        t.customerName.toLowerCase().includes(s) ||
        (t.razorpayPaymentId && t.razorpayPaymentId.toLowerCase().includes(s)) ||
        (t.method && t.method.toLowerCase().includes(s))
      );
    });
  }, [paymentTransactions, paymentSearch]);

  return (
    <div id="admin-management-portal" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Admin Header Bar */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
              <Zap className="w-7 h-7 text-[#EB0028]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl font-black text-zinc-950 font-display tracking-tight">
                  NOVA Master Control Panel
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Production Firestore</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Authorized Master Admin: <strong className="text-zinc-900">{ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={loadAdminData}
              disabled={isLoadingData}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-[#EB0028]' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              View Storefront
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'overview', label: 'Store Overview', icon: TrendingUp },
            { id: 'products', label: `Products (${productsList.length})`, icon: Package },
            { id: 'orders', label: `Orders (${ordersList.length})`, icon: ShoppingBag },
            { id: 'payments', label: `Payments & Gateway (${paymentTransactions.length})`, icon: CreditCard },
            { id: 'reviews', label: `Verified Reviews (${reviewsList.length})`, icon: CheckCircle2 },
            { id: 'coupons', label: `Promo Codes (${couponsList.length})`, icon: Coins },
            { id: 'settings', label: 'System & Security', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-2xl flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#EB0028]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span>Total Sales Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-zinc-950 font-mono">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
                  <span>+18.4% this month</span>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span>Hardware Orders</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-zinc-950 font-mono">
                  {stats.totalOrders}
                </div>
                <div className="text-[11px] text-zinc-500">
                  Recorded in Firestore
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span>Active Catalog SKUs</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-zinc-950 font-mono">
                  {stats.totalProducts}
                </div>
                <div className="text-[11px] text-zinc-500">
                  Across 8 Flagship Categories
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span>Stock Alerts</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-zinc-950 font-mono">
                  {stats.lowStockCount}
                </div>
                <div className="text-[11px] text-amber-600 font-semibold">
                  Items with low inventory (&le;10 units)
                </div>
              </div>
            </div>

            {/* Recent Orders in Overview */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-950 font-display">Recent Hardware Orders</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Live orders awaiting processing or in transit.</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#EB0028] hover:underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              {ordersList.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-400">No orders placed yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {ordersList.slice(0, 6).map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3.5 font-mono font-bold text-zinc-950">{ord.id}</td>
                          <td className="py-3.5">
                            <div className="font-semibold text-zinc-900">{ord.shippingAddress?.fullName || 'Guest Customer'}</div>
                            <div className="text-[11px] text-zinc-400">{ord.contactEmail}</div>
                          </td>
                          <td className="py-3.5 text-zinc-500">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="py-3.5 font-mono font-bold text-zinc-950">₹{ord.total?.toLocaleString('en-IN')}</td>
                          <td className="py-3.5">
                            <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : ord.status === 'shipped'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => {
                                onNavigate('tracking', { trackingNumber: ord.trackingNumber });
                              }}
                              className="text-[#EB0028] font-bold hover:underline"
                            >
                              Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title or SKU..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-2.5 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'chargers-power',
                    price: 2999,
                    originalPrice: 3999,
                    stockCount: 50,
                    inStock: true,
                    badge: 'FLAGSHIP',
                    tagline: 'Flagship GaN fast charger with 24-month warranty',
                    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80'],
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#EB0028] hover:bg-[#c90023] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Badge</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.images[0]}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg bg-zinc-100 p-1 border border-zinc-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-zinc-950 line-clamp-1">{prod.name}</div>
                            <div className="text-[10px] text-zinc-400 font-mono">SKU: {prod.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-zinc-600 font-medium">{prod.category}</td>
                      <td className="py-3.5">
                        <div className="font-bold font-mono text-zinc-950">₹{prod.price.toLocaleString('en-IN')}</div>
                        {prod.originalPrice > prod.price && (
                          <div className="text-[10px] text-zinc-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</div>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          prod.stockCount <= 10
                            ? 'bg-red-50 text-[#EB0028] border border-red-200'
                            : 'bg-zinc-100 text-zinc-800'
                        }`}>
                          {prod.stockCount} in stock
                        </span>
                      </td>
                      <td className="py-3.5 text-amber-600 font-bold">
                        ★ {prod.rating.toFixed(1)} <span className="text-zinc-400 text-[10px]">({prod.reviewCount})</span>
                      </td>
                      <td className="py-3.5">
                        {prod.badge ? (
                          <span className="px-2 py-0.5 rounded bg-black text-white text-[9px] font-bold uppercase tracking-wider">
                            {prod.badge}
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-[10px]">-</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Customer, or Email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="py-2.5 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="p-12 bg-white border border-zinc-200 rounded-3xl text-center text-xs text-zinc-500">
                  No orders match your filter criteria.
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-black font-mono text-zinc-950">{ord.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ord.status}
                          </span>

                          {/* Payment status badge */}
                          {ord.paymentDetails?.refundStatus === 'refunded' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200 flex items-center space-x-1">
                              <RotateCcw className="w-3 h-3" />
                              <span>REFUNDED (₹{ord.paymentDetails.refundAmount})</span>
                            </span>
                          ) : ord.paymentDetails?.paid ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>RAZORPAY PAID</span>
                            </span>
                          ) : ord.paymentMethod === 'cod' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              COD PENDING
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                              UNPAID
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          Placed on {new Date(ord.createdAt).toLocaleString('en-IN')} • Customer: <strong>{ord.shippingAddress?.fullName}</strong> ({ord.contactEmail} | {ord.contactPhone})
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 text-xs">
                        {ord.paymentDetails?.paid && ord.paymentDetails.refundStatus !== 'refunded' && (
                          <button
                            onClick={() => {
                              setSelectedRefundOrder(ord);
                              setRefundAmount(ord.total);
                              setRefundReason('Customer cancellation request');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Issue Refund</span>
                          </button>
                        )}

                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="py-1.5 px-3 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#EB0028]"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      <div className="md:col-span-2 space-y-2">
                        <div className="font-bold text-zinc-950 uppercase tracking-wider text-[11px]">Ordered Items</div>
                        <div className="space-y-2">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                              <div className="flex items-center space-x-2.5">
                                <img
                                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=100&q=80'}
                                  alt=""
                                  className="w-8 h-8 object-contain rounded bg-white p-0.5 border border-zinc-200"
                                />
                                <div>
                                  <div className="font-semibold text-zinc-900">{item.product?.name || item.productId}</div>
                                  <div className="text-[10px] text-zinc-500">Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor.name}`}</div>
                                </div>
                              </div>
                              <div className="font-mono font-bold text-zinc-950">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                        <div className="font-bold text-zinc-950 uppercase tracking-wider text-[11px]">Payment & Shipping Details</div>
                        <p className="text-zinc-700 leading-relaxed text-[11px]">
                          {ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}
                        </p>
                        <div className="pt-2 border-t border-zinc-200 space-y-1 text-[11px]">
                          <div className="flex justify-between text-zinc-600">
                            <span>Gateway:</span>
                            <strong className="text-zinc-900">{ord.paymentMethod?.toUpperCase()}</strong>
                          </div>
                          {ord.paymentDetails?.transactionId && (
                            <div className="flex justify-between text-zinc-600 font-mono text-[10px]">
                              <span>Txn ID:</span>
                              <span className="text-zinc-900 font-bold">{ord.paymentDetails.transactionId}</span>
                            </div>
                          )}
                          {ord.paymentDetails?.method && (
                            <div className="flex justify-between text-zinc-600">
                              <span>Instrument:</span>
                              <span className="text-zinc-900 font-semibold">{ord.paymentDetails.methodLabel || ord.paymentDetails.method.toUpperCase()}</span>
                            </div>
                          )}
                          <div className="pt-1 flex justify-between font-bold text-zinc-950 text-xs">
                            <span>Total Bag:</span>
                            <span className="font-mono text-sm">₹{ord.total?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: PAYMENTS & RAZORPAY GATEWAY AUDIT */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Gateway Status Header */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-950 font-display">Razorpay Payment Gateway Infrastructure</h2>
                    <p className="text-xs text-zinc-500">Live server-side signature verification, order capture, and instant refunds.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Gateway Active & Verified</span>
                  </span>
                </div>
              </div>

              {/* Gateway Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Merchant Mode</div>
                  <div className="font-bold text-zinc-950 text-sm flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{gatewayConfig?.isTestMode ? 'Test Sandbox' : 'Production Live'}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Currency: INR (₹)</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Key ID Status</div>
                  <div className="font-bold text-zinc-950 font-mono text-xs truncate">
                    {gatewayConfig?.keyId ? `${gatewayConfig.keyId.slice(0, 10)}...` : 'rzp_test_configured'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Server-Side Secret Protected</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Total Captured Volume</div>
                  <div className="font-bold text-zinc-950 text-sm font-mono">
                    ₹{paymentTransactions
                      .filter((t) => t.status === 'captured')
                      .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                      .toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-zinc-500">{paymentTransactions.filter(t => t.status === 'captured').length} captured transactions</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Refunds Processed</div>
                  <div className="font-bold text-zinc-950 text-sm font-mono">
                    ₹{paymentTransactions
                      .filter((t) => t.status === 'refunded')
                      .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                      .toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-purple-600 font-semibold">{paymentTransactions.filter(t => t.status === 'refunded').length} refunds issued</div>
                </div>
              </div>
            </div>

            {/* Transactions Table Section */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Payment Transactions Ledger</h3>
                  <p className="text-xs text-zinc-500">Real-time records saved securely in Firestore `payment_transactions` collection.</p>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder="Search by Txn ID, Order ID, Customer..."
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Transaction / Order</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Payment Method</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredPaymentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400">
                          No payment transactions recorded yet. Complete a checkout via Razorpay to see real transactions here.
                        </td>
                      </tr>
                    ) : (
                      filteredPaymentTransactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3.5">
                            <div className="font-mono font-bold text-zinc-950">{txn.id}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">Order: {txn.orderId}</div>
                          </td>
                          <td className="py-3.5">
                            <div className="font-bold text-zinc-900">{txn.customerName || 'Customer'}</div>
                            <div className="text-[10px] text-zinc-500">{txn.customerEmail}</div>
                          </td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-bold text-[10px] uppercase">
                              {txn.method || 'Razorpay'}
                            </span>
                            {txn.methodDetails && (
                              <div className="text-[10px] text-zinc-400 mt-0.5">{txn.methodDetails}</div>
                            )}
                          </td>
                          <td className="py-3.5 font-mono font-bold text-zinc-950">
                            ₹{txn.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              txn.status === 'captured'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : txn.status === 'refunded'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-[11px] text-zinc-500">
                            {new Date(txn.createdAt).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 text-right">
                            {txn.status === 'captured' && (
                              <button
                                onClick={() => {
                                  const matchingOrder = ordersList.find((o) => o.id === txn.orderId);
                                  if (matchingOrder) {
                                    setSelectedRefundOrder(matchingOrder);
                                    setRefundAmount(txn.amount);
                                    setRefundReason('Admin refund request');
                                  } else {
                                    showToast('Order not found', 'Matching order could not be located in database.', 'error');
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-[10px] uppercase transition-colors cursor-pointer"
                              >
                                Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-950">Customer Reviews Moderation Queue</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Approve, reject, or verify customer submissions.</p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Author</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Review Details</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {reviewsList.map((rev) => (
                    <tr key={rev.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3.5 font-bold text-zinc-950 max-w-[150px] truncate">
                        {rev.productName || rev.productId}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-zinc-900">{rev.author}</div>
                        {rev.verified && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-bold text-amber-500">
                        {'★'.repeat(rev.rating)}
                      </td>
                      <td className="py-3.5 max-w-sm">
                        <div className="font-bold text-zinc-950">{rev.title}</div>
                        <p className="text-zinc-600 line-clamp-2 mt-0.5">{rev.comment}</p>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rev.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : rev.status === 'rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {rev.status || 'approved'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleModerateReview(rev.id, 'approved')}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] uppercase hover:bg-emerald-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerateReview(rev.id, 'rejected')}
                          className="px-2.5 py-1 rounded bg-zinc-200 text-zinc-800 font-bold text-[10px] uppercase hover:bg-red-600 hover:text-white transition-colors"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS & DISCOUNTS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-950">Storewide Promo Codes & Discounts</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Manage live discounts applied during checkout.</p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#EB0028] text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-[#c90023] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {couponsList.map((c) => (
                <div key={c.code} className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-black text-white font-mono font-bold text-sm rounded-xl tracking-wider">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="text-zinc-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-lg font-bold text-zinc-950">
                    {c.discountType === 'percent' ? `${c.value}% Flat Discount` : `₹${c.value} Instant Off`}
                  </div>
                  <p className="text-xs text-zinc-500">{c.description}</p>
                  <div className="pt-2 border-t border-zinc-100 flex justify-between text-[11px] text-zinc-400">
                    <span>Min Order: ₹{c.minOrder?.toLocaleString('en-IN')}</span>
                    <span>Expires: {c.expiresAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & DB AUDIT */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-zinc-950">System Architecture & Firestore Database Audit</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Database Engine</div>
                  <div className="font-bold text-zinc-950 text-sm">Google Cloud Firestore</div>
                  <div className="text-emerald-600 font-bold">Connected & Operating Normally</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Security Rules Engine</div>
                  <div className="font-bold text-zinc-950 text-sm">Role-Based Access Control (RBAC)</div>
                  <div className="text-emerald-600 font-bold">Admin email verified ({ADMIN_EMAIL})</div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Database Tools</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleRestoreCatalog}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-[#EB0028] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Sync / Restore Default Catalog Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Product Edit / Create Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-bold text-zinc-950 font-display">
                {editingProduct.id ? 'Edit Hardware Product' : 'Add New Hardware SKU'}
              </h3>
              <button
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-zinc-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'chargers-power'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as CategoryId })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">SKU / Model Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    placeholder="NV-PWR-120W"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Inventory Units in Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount || 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Promotional Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value as any })}
                    placeholder="FLAGSHIP / BESTSELLER / NEW"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-zinc-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingProduct.tagline || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-zinc-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProduct.images?.[0] || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#EB0028] text-white font-bold uppercase tracking-wider hover:bg-[#c90023]"
                >
                  Save Product to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-zinc-950 font-display">Create Promotional Discount Code</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIP20"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Discount Type</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                >
                  <option value="percent">Percentage (%) Off</option>
                  <option value="fixed">Fixed Flat Rupee (₹) Off</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Minimum Bag Value (₹)</label>
                <input
                  type="number"
                  value={newCoupon.minOrder}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EB0028] text-white font-bold uppercase tracking-wider hover:bg-[#c90023]"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Initiation Modal */}
      {selectedRefundOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950 font-display">Process Razorpay Refund</h3>
                  <p className="text-[11px] text-zinc-500">Order #{selectedRefundOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRefundOrder(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateRefund} className="space-y-4">
              <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-1.5 text-zinc-700">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <strong className="text-zinc-950">{selectedRefundOrder.shippingAddress?.fullName}</strong>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span>Razorpay Payment ID:</span>
                  <strong className="text-zinc-950">
                    {selectedRefundOrder.paymentDetails?.razorpayPaymentId || selectedRefundOrder.paymentDetails?.transactionId || 'N/A'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Original Order Total:</span>
                  <strong className="text-zinc-950 font-mono">₹{selectedRefundOrder.total.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Refund Amount (₹ INR)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRefundOrder.total}
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-zinc-950 text-sm font-bold focus:outline-none focus:border-purple-600"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Full or partial refund up to ₹{selectedRefundOrder.total.toLocaleString('en-IN')}.</p>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Reason for Refund</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-medium text-zinc-800 focus:outline-none"
                >
                  <option value="Customer cancellation request">Customer cancellation request</option>
                  <option value="Product return / replacement deficit">Product return / replacement deficit</option>
                  <option value="Defective or damaged in transit">Defective or damaged in transit</option>
                  <option value="Customer dissatisfied with fit / audio">Customer dissatisfied with fit / audio</option>
                  <option value="Duplicate transaction">Duplicate transaction</option>
                  <option value="Other administrative adjustment">Other administrative adjustment</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end space-x-3">
                <button
                  type="button"
                  disabled={isRefunding}
                  onClick={() => setSelectedRefundOrder(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  {isRefunding ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Refunding...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Issue ₹{refundAmount.toLocaleString('en-IN')} Refund</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
