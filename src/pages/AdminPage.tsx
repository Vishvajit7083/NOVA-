import React, { useState, useEffect } from 'react';
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
  Boxes,
  Sliders,
  Tag,
  Star,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  Product,
  Order,
  Review,
  Coupon,
  OrderStatus,
  ShipmentStatus,
  ShipmentRecord,
  ShippingConfig,
  ReturnRequest,
  PaymentTransaction,
} from '../types';
import { ADMIN_EMAIL } from '../lib/firebase';
import { safeFetchJson } from '../lib/razorpay';
import {
  getProductsFromDB,
  saveProductToDB,
  deleteProductFromDB,
  getAllOrdersFromDB,
  deleteOrderFromDB,
  updateOrderStatusInDB,
  getAllReviewsFromDB,
  updateReviewStatusInDB,
  getCouponsFromDB,
  saveCouponToDB,
  deleteCouponFromDB,
  getAdminStats,
  getAllPaymentTransactionsFromDB,
  getShippingConfigFromDB,
  saveShippingConfigToDB,
  getAllShipmentsFromDB,
  saveShipmentToDB,
  updateShipmentStatusInDB,
  packOrderInDB,
  getAllReturnsFromDB,
} from '../lib/db';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminProductFormModal } from '../components/admin/AdminProductFormModal';
import { AdminInventoryTab } from '../components/admin/AdminInventoryTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminReturnsTab } from '../components/admin/AdminReturnsTab';
import { AdminShippingSettingsTab } from '../components/admin/AdminShippingSettingsTab';

interface AdminPageProps {
  onNavigate: (view: string, params?: any) => void;
}

type AdminTab = 'overview' | 'products' | 'inventory' | 'orders' | 'returns' | 'shipping_settings' | 'coupons' | 'reviews';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin, loginWithEmail, showToast, refreshProducts } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Primary data states
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [shipmentsList, setShipmentsList] = useState<ShipmentRecord[]>([]);
  const [returnsList, setReturnsList] = useState<ReturnRequest[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([]);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>({
    pickupWarehouse: {
      companyName: 'AURELIA & CO. Atelier Logistics Hub',
      contactName: 'Master Tailor Logistics Director',
      phone: '+91 80 4968 3300',
      email: 'atelier-logistics@aureliacouture.com',
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
      defaultDimensions: { length: 38, width: 28, height: 10, unit: 'cm' },
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
  });

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Coupon modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percent',
    value: 15,
    minOrder: 1499,
    description: 'Flat 15% Atelier Privilege Drop',
    expiresAt: '31 Dec 2026',
    active: true,
  });

  // Admin Gateway login state for non-signed-in admins
  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  const loadAllAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [prods, ords, ships, rets, revs, coups, txns, shipCfg] = await Promise.all([
        getProductsFromDB(),
        getAllOrdersFromDB(),
        getAllShipmentsFromDB(),
        getAllReturnsFromDB(),
        getAllReviewsFromDB(),
        getCouponsFromDB(),
        getAllPaymentTransactionsFromDB(),
        getShippingConfigFromDB(),
      ]);

      setProductsList(prods);
      setOrdersList(ords);
      setShipmentsList(ships);
      setReturnsList(rets);
      setReviewsList(revs);
      setCouponsList(coups);
      setPaymentTransactions(txns);
      if (shipCfg) setShippingConfig(shipCfg);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin || currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      loadAllAdminData();
    }
  }, [isAdmin, currentUser]);

  // Product CRUD Handlers
  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    setIsSavingProduct(true);
    try {
      await saveProductToDB(productData);
      showToast('Product successfully saved to store catalog!', 'success');
      setIsProductModalOpen(false);
      await loadAllAdminData();
      await refreshProducts();
    } catch (err: any) {
      console.error('Error saving product:', err);
      showToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to remove this garment from the store catalog?')) {
      return;
    }
    try {
      await deleteProductFromDB(productId);
      showToast('Product deleted from catalog.', 'info');
      await loadAllAdminData();
      await refreshProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      showToast(err.message || 'Failed to delete product.', 'error');
    }
  };

  // Order Fulfillment Handlers
  const handleDeleteOrderAdmin = async (orderId: string) => {
    try {
      await deleteOrderFromDB(orderId);
      showToast('Order record removed from database.', 'info');
      await loadAllAdminData();
    } catch (err: any) {
      console.error('Error deleting order:', err);
      showToast(err.message || 'Failed to delete order record.', 'error');
    }
  };

  const handlePackOrder = async (orderId: string, packDetails: any) => {
    try {
      await packOrderInDB(orderId, packDetails);
      showToast('Order packed and marked ready for courier pickup!', 'success');
      await loadAllAdminData();
    } catch (err: any) {
      console.error('Error packing order:', err);
      showToast(err.message || 'Failed to pack order.', 'error');
    }
  };

  const handleCreateShipment = async (shipmentData: any) => {
    try {
      // Call server shipping endpoint to register shipment & generate AWB
      const res = await fetch('/api/shipping/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipmentData),
      });
      const data = await res.json();

      if (data.success && data.shipment) {
        await saveShipmentToDB(data.shipment);
        showToast(`Shipment created with AWB: ${data.awbNumber}`, 'success');
      } else {
        // Fallback direct DB save
        const fallbackShipment: ShipmentRecord = {
          id: `ship_${Date.now()}`,
          orderId: shipmentData.orderId,
          orderNumber: shipmentData.orderNumber,
          provider: 'manual',
          courierName: shipmentData.courierName,
          awbNumber: shipmentData.awbNumber,
          packageWeightGrams: shipmentData.packageWeightGrams,
          packageDimensions: shipmentData.packageDimensions,
          status: 'shipment_created',
          isManualEntry: true,
          events: [
            {
              status: 'shipment_created',
              title: 'Shipment Manifest Created & AWB Assigned',
              location: `${shippingConfig.pickupWarehouse.city} Atelier Logistics Center`,
              timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
              description: `AWB ${shipmentData.awbNumber} generated with carrier ${shipmentData.courierName}.`,
              completed: true,
              current: true,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveShipmentToDB(fallbackShipment);
        showToast(`Shipment created with AWB: ${shipmentData.awbNumber}`, 'success');
      }

      await loadAllAdminData();
    } catch (err: any) {
      console.error('Error creating shipment:', err);
      showToast(err.message || 'Failed to create shipment.', 'error');
    }
  };

  const handleUpdateShipmentStatus = async (
    shipmentId: string,
    status: ShipmentStatus,
    event: any,
    orderId?: string
  ) => {
    try {
      await updateShipmentStatusInDB(shipmentId, status, event, orderId);
      showToast(`Shipment progressed to ${status.replace(/_/g, ' ')}`, 'success');
      await loadAllAdminData();
    } catch (err: any) {
      console.error('Error updating shipment status:', err);
      showToast(err.message || 'Failed to update shipment status.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatusInDB(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      await loadAllAdminData();
    } catch (err: any) {
      console.error('Error updating order status:', err);
      showToast(err.message || 'Failed to update order status.', 'error');
    }
  };

  // Shipping Config Handler
  const handleSaveShippingConfig = async (newConfig: ShippingConfig): Promise<boolean> => {
    setIsSavingConfig(true);
    try {
      const ok = await saveShippingConfigToDB(newConfig);
      if (ok) {
        setShippingConfig(newConfig);
        showToast('Shipping & warehouse settings saved!', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error saving shipping config:', err);
      showToast(err.message || 'Failed to save shipping settings.', 'error');
      return false;
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Coupon Handlers
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code?.trim()) return;

    try {
      await saveCouponToDB(newCoupon as Coupon);
      showToast(`Coupon ${newCoupon.code.toUpperCase()} published!`, 'success');
      setIsCouponModalOpen(false);
      setNewCoupon({
        code: '',
        discountType: 'percent',
        value: 15,
        minOrder: 1499,
        description: 'Flat 15% VIP Admin Drop',
        expiresAt: '31 Dec 2026',
        active: true,
      });
      await loadAllAdminData();
    } catch (err: any) {
      console.error('Error saving coupon:', err);
      showToast(err.message || 'Failed to save coupon.', 'error');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      await deleteCouponFromDB(code);
      showToast(`Coupon ${code} removed.`, 'info');
      await loadAllAdminData();
    } catch (err: any) {
      console.error('Error deleting coupon:', err);
      showToast(err.message || 'Failed to delete coupon.', 'error');
    }
  };

  // Review Moderation
  const handleApproveReview = async (reviewId: string) => {
    try {
      await updateReviewStatusInDB(reviewId, 'approved');
      showToast('Customer review approved and published live.', 'success');
      await loadAllAdminData();
    } catch (err: any) {
      showToast('Error approving review', 'error');
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      await updateReviewStatusInDB(reviewId, 'rejected');
      showToast('Review rejected.', 'info');
      await loadAllAdminData();
    } catch (err: any) {
      showToast('Error rejecting review', 'error');
    }
  };

  // Gate Check: If not logged in as Admin
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
      <div className="min-h-screen bg-[#0E1015] text-white flex flex-col items-center justify-center p-6 selection:bg-[#9A7B38]">
        <div className="w-full max-w-md bg-[#16181E] border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#9A7B38]/10 border border-[#9A7B38]/30 flex items-center justify-center text-[#9A7B38] mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-white">
              AURELIA & CO. Maison Admin Gateway
            </h1>
            <p className="text-xs text-stone-400">
              Restricted couture management console. Authorized access only for <strong className="text-stone-200">{ADMIN_EMAIL}</strong>.
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
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-[#9A7B38]"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-[#9A7B38]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminAuthLoading}
              className="w-full py-3 rounded-xl bg-[#9A7B38] hover:bg-[#85682C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
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
              className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              &larr; Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Admin Console
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-20">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-[#E5D7B7] flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-sm tracking-tight text-stone-900">AURELIA & CO.</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[10px] font-bold text-[#9A7B38] uppercase">
                  Merchant Console
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Logged in as <span className="font-semibold text-stone-700">{currentUser?.email || ADMIN_EMAIL}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadAllAdminData}
              title="Refresh Store Data"
              className="p-2 text-stone-500 hover:text-stone-900 bg-[#FAF8F5] hover:bg-stone-200 border border-[#E8E2D9] rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b border-[#E8E2D9] scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Store Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'products'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Garment Products ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'inventory'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Variant Inventory Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Dispatch ({ordersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'returns'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Returns & Exchanges ({returnsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping_settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'shipping_settings'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Warehouse & Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'coupons'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({couponsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'reviews'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviewsList.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <AdminOverviewTab
            orders={ordersList}
            products={productsList}
            returns={returnsList}
            shipments={shipmentsList}
            onSelectOrder={(order) => {
              setActiveTab('orders');
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <AdminProductsTab
            products={productsList}
            onAddNew={handleAddNewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === 'inventory' && (
          <AdminInventoryTab
            products={productsList}
            onRefreshProducts={loadAllAdminData}
          />
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={ordersList}
            shipments={shipmentsList}
            shippingConfig={shippingConfig}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onPackOrder={handlePackOrder}
            onCreateShipment={handleCreateShipment}
            onUpdateShipmentStatus={handleUpdateShipmentStatus}
            onRefundOrder={() => {}}
            onDeleteOrder={handleDeleteOrderAdmin}
          />
        )}

        {/* TAB 5: RETURNS */}
        {activeTab === 'returns' && (
          <AdminReturnsTab
            returns={returnsList}
            products={productsList}
            onRefreshReturns={loadAllAdminData}
            onRefreshProducts={loadAllAdminData}
          />
        )}

        {/* TAB 6: SHIPPING & RATES SETTINGS */}
        {activeTab === 'shipping_settings' && (
          <AdminShippingSettingsTab
            initialConfig={shippingConfig}
            onSaveConfig={handleSaveShippingConfig}
            isSaving={isSavingConfig}
          />
        )}

        {/* TAB 7: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">Promotions & VIP Coupons</h2>
                <p className="text-xs text-stone-500 mt-0.5">Manage discounts, percentage reductions, and minimum spend rules.</p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {couponsList.map((coup) => (
                <div key={coup.code} className="bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm bg-stone-100 text-stone-900 px-2.5 py-1 rounded-md border border-[#E8E2D9]">
                        {coup.code}
                      </span>
                      <p className="text-xs text-stone-600 mt-2">{coup.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(coup.code)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs text-stone-500">
                    <div>
                      Discount:{' '}
                      <span className="font-bold text-stone-900">
                        {coup.discountType === 'percent' ? `${coup.value}%` : `₹${coup.value}`}
                      </span>
                    </div>
                    <div>Min Order: ₹{coup.minOrder}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">Customer Reviews & Moderation</h2>
              <p className="text-xs text-stone-500 mt-0.5">Approve verified customer reviews before publishing live on garment pages.</p>
            </div>

            {reviewsList.length === 0 ? (
              <div className="py-12 text-center text-stone-400">
                <Star className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
                <p className="text-sm font-semibold text-stone-700">No reviews submitted yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0EBE1]">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 text-xs">{rev.author}</span>
                        <div className="flex text-amber-500 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400">for {rev.productName || 'Garment'}</span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-800">{rev.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleRejectReview(rev.id)}
                          className="px-3 py-1.5 border border-[#E8E2D9] text-stone-700 hover:text-rose-600 rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      <AdminProductFormModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        isSaving={isSavingProduct}
      />

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
              <h3 className="text-sm font-serif font-bold text-stone-900">Create New Coupon</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. AURELIA15"
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Min Order Total (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={newCoupon.minOrder}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="e.g. Flat 15% VIP discount on evening wear"
                  className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs font-semibold text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 cursor-pointer"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
