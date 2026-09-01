import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Coins,
  Heart,
  ShieldCheck,
  CreditCard,
  LogOut,
  ChevronRight,
  ExternalLink,
  Truck,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Edit3,
  Star,
  FileText,
  RotateCcw,
  Bell,
  HelpCircle,
  XCircle,
  Clock,
  ArrowRight,
  Store,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, Order, CartItem, ReturnRequest, SupportTicket } from '../types';
import { OrderInvoiceModal } from '../components/common/OrderInvoiceModal';
import { ReturnRequestModal } from '../components/common/ReturnRequestModal';
import { openRazorpayCheckout, safeFetchJson } from '../lib/razorpay';
import { updateOrderPaymentInDB, savePaymentTransactionInDB } from '../lib/db';

interface AccountPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    isAdmin,
    isSeller,
    orders,
    userReturns,
    notifications,
    userTickets,
    cancelOrderAction,
    submitSupportTicket,
    markNotificationRead,
    markAllNotificationsRead,
    showToast,
    setIsAuthModalOpen,
    logoutUser,
    updateUserProfile,
    addAddress,
    removeAddress,
    setDefaultAddress,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'returns' | 'notifications' | 'support' | 'addresses' | 'rewards' | 'profile'>('orders');

  // Modals state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [returnModalData, setReturnModalData] = useState<{ order: Order; item: CartItem } | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Found better alternative or price');
  const [isCancelling, setIsCancelling] = useState(false);

  // New Support Ticket form state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('order');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('medium');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Retrying payment state
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);

  // Edit Profile form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');

  // Add Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrFullName, setNewAddrFullName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('Karnataka');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrType, setNewAddrType] = useState<'home' | 'work' | 'other'>('home');

  if (!currentUser) {
    return (
      <div id="account-login-prompt" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-20 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mx-auto shadow-inner">
            <User className="w-8 h-8 text-[#EB0028]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-950 font-display">Sign In to Your Account</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Access your order history, verified reviews, address book, and NovaCoins rewards.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Sign In or Register
            </button>
            <button
              onClick={() => onNavigate('store')}
              className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Explore Store Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Error', 'Name cannot be empty.', 'error');
      return;
    }
    await updateUserProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
    });
    setIsEditingProfile(false);
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrFullName || !newAddrPhone || !newAddrStreet || !newAddrCity || newAddrPincode.length !== 6) {
      showToast('Missing Details', 'Please fill in all address fields correctly.', 'error');
      return;
    }

    await addAddress({
      fullName: newAddrFullName,
      phone: newAddrPhone,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      pincode: newAddrPincode,
      addressType: newAddrType,
      isDefault: (currentUser.addresses?.length || 0) === 0,
    });

    setIsAddAddressOpen(false);
    setNewAddrFullName('');
    setNewAddrPhone('');
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrPincode('');
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    try {
      await cancelOrderAction(cancelModalOrder.id, cancelReason);
      setCancelModalOrder(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Incomplete Ticket', 'Please fill in the subject and message.', 'error');
      return;
    }
    setIsSubmittingTicket(true);
    try {
      await submitSupportTicket({
        userEmail: currentUser.email,
        userName: currentUser.name,
        subject: ticketSubject.trim(),
        category: ticketCategory,
        message: ticketMessage.trim(),
        priority: ticketPriority,
      });
      setIsTicketModalOpen(false);
      setTicketSubject('');
      setTicketMessage('');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleRetryPayment = async (order: Order) => {
    setRetryingOrderId(order.id);
    try {
      showToast('Connecting', 'Initializing Razorpay secure gateway...', 'info');

      // 1. Create order on backend
      const data = await safeFetchJson('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: order.items.map((i) => ({
            productId: i.productId,
            name: i.product?.name || i.productId,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingFee: order.shippingFee || 0,
          couponCode: order.couponCode,
          deliveryMethod: order.deliveryMethod,
          shippingAddress: order.shippingAddress,
          contactEmail: order.contactEmail || currentUser.email,
          contactPhone: order.contactPhone || currentUser.phone || '',
          orderId: order.id,
          orderNumber: order.orderNumber,
          userUid: currentUser.id,
        }),
      });

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment gateway.');
      }

      // 2. Open Razorpay modal
      await openRazorpayCheckout(
        {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: 'NOVA Flagship Electronics',
          description: `Payment for Order ${order.orderNumber || order.id}`,
          order_id: data.razorpayOrderId,
          prefill: {
            name: order.shippingAddress?.fullName || currentUser.name,
            email: order.contactEmail || currentUser.email,
            contact: order.contactPhone || currentUser.phone || '',
          },
          notes: {
            orderId: order.id,
            orderNumber: order.orderNumber,
          },
          theme: {
            color: '#EB0028',
          },
          modal: {
            ondismiss: () => {
              setRetryingOrderId(null);
              showToast('Payment Cancelled', 'Payment modal was closed.', 'info');
            },
          },
          handler: async (response) => {
            try {
              // 3. Verify signature on backend
              const verifyData = await safeFetchJson('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order.id,
                  orderNumber: order.orderNumber,
                  userUid: currentUser.id,
                  userEmail: currentUser.email,
                }),
              });

              if (!verifyData.success || !verifyData.verified) {
                throw new Error(verifyData.error || 'Payment verification failed on server.');
              }

              // Update order in Firestore
              await updateOrderPaymentInDB(order.id, {
                paid: true,
                transactionId: response.razorpay_payment_id,
                gateway: 'razorpay',
                methodLabel: 'Razorpay Instant Verified',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paidAt: new Date().toISOString(),
              });

              await savePaymentTransactionInDB({
                id: `txn_${response.razorpay_payment_id}`,
                orderId: order.id,
                orderNumber: order.orderNumber,
                gateway: 'razorpay',
                gatewayOrderId: response.razorpay_order_id,
                gatewayPaymentId: response.razorpay_payment_id,
                amount: order.total,
                currency: 'INR',
                method: 'razorpay',
                status: 'captured',
                userUid: currentUser.id,
                userEmail: currentUser.email,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });

              showToast('Payment Verified!', `Payment ID ${response.razorpay_payment_id} captured successfully.`, 'success');
              // Reload page or let realtime sync update order
              window.location.reload();
            } catch (verErr: any) {
              showToast('Verification Failed', verErr.message, 'error');
            } finally {
              setRetryingOrderId(null);
            }
          },
        },
        (failed) => {
          setRetryingOrderId(null);
          showToast('Payment Failed', failed?.description || 'Declined by bank.', 'error');
        }
      );
    } catch (err: any) {
      setRetryingOrderId(null);
      showToast('Payment Error', err.message, 'error');
    }
  };

  const savedAddressesList = currentUser.addresses || currentUser.savedAddresses || [];

  return (
    <div id="account-portal-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Hero Bar */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F9FA] border border-zinc-200 flex items-center justify-center text-zinc-900 text-xl font-bold font-display uppercase shadow-inner">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-display">
                  {currentUser?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#EB0028] text-[10px] font-bold uppercase tracking-wider">
                  {isAdmin ? 'Master Store Admin' : isSeller ? 'Verified Seller' : 'VIP Flagship Tier'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{currentUser?.email} • {currentUser?.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="p-3 bg-black hover:bg-[#EB0028] text-white rounded-2xl flex items-center space-x-2 font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-[#EB0028]" />
                <span>Admin Console</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('seller')}
              className="p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-2xl text-zinc-900 font-bold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#EB0028]" />
              <span>{isSeller ? 'Seller Hub' : 'Sell on NOVA'}</span>
            </button>

            <div className="p-3 bg-[#F8F9FA] border border-zinc-200 rounded-2xl flex items-center space-x-2.5">
              <Coins className="w-5 h-5 text-amber-500" />
              <div>
                <div className="font-extrabold text-zinc-950 font-mono text-sm">
                  {currentUser?.novaCoins?.toLocaleString('en-IN') || 250}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">NovaCoins Balance</div>
              </div>
            </div>

            <button
              onClick={() => logoutUser()}
              className="p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-2xl text-zinc-700 font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-1.5 bg-white border border-zinc-200 rounded-2xl p-4 h-fit shadow-sm">
            {[
              { id: 'orders', label: 'My Hardware Orders', icon: Package, count: orders.length },
              { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, count: userReturns.length },
              { id: 'notifications', label: 'Alerts & Messages', icon: Bell, count: notifications.filter((n) => !n.isRead).length },
              { id: 'support', label: 'Support Desk', icon: HelpCircle, count: userTickets.length },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: savedAddressesList.length },
              { id: 'rewards', label: 'NovaCoins & Perks', icon: Coins },
              { id: 'profile', label: 'Profile & Security', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#EB0028] text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      activeTab === tab.id ? 'bg-black/20 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="lg:col-span-9">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-950 font-display">Order History & Invoices</h2>
                  <p className="text-xs text-gray-500">{orders.length} total orders recorded</p>
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 bg-white border border-zinc-200 rounded-2xl text-center text-xs text-zinc-500 shadow-sm space-y-3">
                    <Package className="w-8 h-8 text-zinc-300 mx-auto" />
                    <p>No past orders found on this account.</p>
                    <button
                      onClick={() => onNavigate('store')}
                      className="px-4 py-2 rounded-xl bg-black hover:bg-[#EB0028] text-white font-bold text-xs transition-colors"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4 text-xs">
                        <div>
                          <div className="text-zinc-950 font-mono font-bold text-sm flex items-center space-x-2">
                            <span>#{order.orderNumber || order.id.slice(0, 8)}</span>
                            {order.trackingNumber && (
                              <span className="text-[11px] font-normal text-gray-500 font-sans">
                                (AWB: {order.trackingNumber})
                              </span>
                            )}
                          </div>
                          <div className="text-zinc-500 text-[11px] mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Payment status badge */}
                          {order.paymentDetails?.paid ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>PAID {order.paymentDetails.transactionId ? `(${order.paymentDetails.transactionId.slice(-8)})` : ''}</span>
                            </span>
                          ) : order.paymentMethod === 'cod' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-700">
                              COD PENDING
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 border border-rose-200 text-rose-700">
                              PAYMENT DUE
                            </span>
                          )}

                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 border border-blue-200 text-blue-700'
                              : order.status === 'cancelled'
                              ? 'bg-rose-50 border border-rose-200 text-rose-700'
                              : 'bg-amber-50 border border-amber-200 text-amber-700'
                          }`}>
                            {order.status}
                          </span>

                          {/* Retry payment button if unpaid and not COD and not cancelled */}
                          {!order.paymentDetails?.paid && order.paymentMethod !== 'cod' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleRetryPayment(order)}
                              disabled={retryingOrderId === order.id}
                              className="px-3 py-1.5 rounded-xl bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>{retryingOrderId === order.id ? 'Connecting...' : 'Pay with Razorpay'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-semibold flex items-center space-x-1 transition-colors"
                            title="Download Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-gray-600" />
                            <span>Tax Invoice</span>
                          </button>

                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => onNavigate('tracking', { trackingNumber: order.trackingNumber || order.id })}
                              className="px-3 py-1.5 rounded-xl bg-[#F8F9FA] hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5 text-[#EB0028]" />
                              <span>Track Live</span>
                            </button>
                          )}

                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                              onClick={() => setCancelModalOrder(order)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold flex items-center space-x-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-gray-50/50 p-3 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=100&q=80'}
                                alt=""
                                className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-zinc-200 shrink-0"
                              />
                              <div>
                                <h4 className="text-zinc-900 font-bold">{item.product?.name || item.productId}</h4>
                                <div className="text-[11px] text-zinc-500">
                                  Qty: {item.quantity} {item.selectedColor && `• Color: ${item.selectedColor.name}`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                              <div className="text-left sm:text-right">
                                <div className="font-extrabold text-zinc-950">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {(order.status === 'delivered' || order.status === 'shipped') && (
                                  <button
                                    onClick={() => setReturnModalData({ order, item })}
                                    className="px-2.5 py-1 bg-white border border-gray-200 hover:border-black rounded-lg text-[11px] font-bold text-gray-700 hover:text-black flex items-center space-x-1"
                                  >
                                    <RotateCcw className="w-3 h-3 text-[#EB0028]" />
                                    <span>Return / Replace</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => onNavigate('product-detail', { productId: item.productId })}
                                  className="text-[11px] text-[#EB0028] hover:underline font-bold"
                                >
                                  Reviews
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer info */}
                      <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="text-zinc-500">
                          Total Amount: <strong className="text-zinc-950 font-bold">₹{order.total.toLocaleString('en-IN')}</strong> ({order.paymentMethod.toUpperCase()})
                        </div>
                        <div className="text-emerald-600 flex items-center space-x-1 font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          <span>NovaCare™ 1-Year Pan-India Warranty Active</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* RETURNS & REFUNDS TAB */}
            {activeTab === 'returns' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-950 font-display">Reverse Logistics & Refunds</h2>
                  <p className="text-xs text-gray-500">7-Day Doorstep Replacement Guarantee</p>
                </div>

                {userReturns.length === 0 ? (
                  <div className="p-12 bg-white border border-zinc-200 rounded-2xl text-center text-xs text-zinc-500 shadow-sm space-y-3">
                    <RotateCcw className="w-8 h-8 text-zinc-300 mx-auto" />
                    <p>No active return or replacement requests.</p>
                    <p className="text-[11px] text-gray-400">
                      You can initiate a return from any delivered order in the "My Hardware Orders" tab.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReturns.map((ret) => (
                      <div key={ret.id} className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 text-xs">
                          <div>
                            <span className="font-bold text-gray-900 font-mono text-sm">Return #{ret.returnNumber}</span>
                            <p className="text-gray-500 text-[11px]">
                              For Order #{ret.orderNumber} • Initiated on {new Date(ret.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            ret.status === 'refunded'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ret.status === 'approved'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : ret.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ret.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                          {ret.productImage && (
                            <img src={ret.productImage} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                          )}
                          <div>
                            <p className="font-bold text-gray-900">{ret.productName}</p>
                            <p className="text-gray-500 text-[11px]">
                              Reason: <strong className="capitalize text-gray-800">{ret.reason.replace('_', ' ')}</strong> — "{ret.reasonDetails}"
                            </p>
                            <p className="font-bold text-gray-900 mt-1">Refund Amount: ₹{ret.refundAmount.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        {ret.refundTransactionId && (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                            <strong>Refund Processed:</strong> Bank Transaction Reference ID: <span className="font-mono font-bold">{ret.refundTransactionId}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-950 font-display">Notification Center</h2>
                  {notifications.some((n) => !n.isRead) && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-xs font-bold text-[#EB0028] hover:underline"
                    >
                      Mark All as Read
                    </button>
                  )}
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-4 transition-colors cursor-pointer ${
                          n.isRead ? 'bg-white' : 'bg-red-50/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold text-gray-900">{n.title}</p>
                          <span className="text-[10px] text-gray-400">
                            {new Date(n.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-gray-400">
                      No notifications available right now.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUPPORT DESK TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-950 font-display">24/7 Hardware Support Desk</h2>
                    <p className="text-xs text-gray-500">Fast response directly from official NOVA engineering staff.</p>
                  </div>
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 bg-[#EB0028] hover:bg-[#c80022] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Ticket</span>
                  </button>
                </div>

                {userTickets.length === 0 ? (
                  <div className="p-12 bg-white border border-zinc-200 rounded-2xl text-center text-xs text-zinc-500 shadow-sm space-y-3">
                    <HelpCircle className="w-8 h-8 text-zinc-300 mx-auto" />
                    <p>No support tickets logged yet.</p>
                    <p className="text-[11px] text-gray-400">
                      Need help with shipping, warranty claims, or product compatibility? Create a ticket above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTickets.map((t) => (
                      <div key={t.id} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 shadow-sm text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-sm">Ticket #{t.ticketNumber}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            t.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : t.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {t.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="font-bold text-gray-800">{t.subject}</p>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{t.message}</p>
                        <div className="text-[10px] text-gray-400">
                          Category: <strong className="capitalize">{t.category}</strong> • Priority: <strong className="capitalize">{t.priority}</strong> • Created: {new Date(t.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-950 font-display">Saved Delivery Addresses</h2>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-[#EB0028] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddressesList.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-3 text-xs shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-950 text-sm">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-red-50 text-[#EB0028] border border-red-200 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-700 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-zinc-500">Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] text-zinc-600 hover:text-black font-semibold underline"
                          >
                            Set as default
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold">Primary Address</span>
                        )}
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-zinc-400 hover:text-red-600 p-1"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REWARDS TAB */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-zinc-950 font-display">NovaCoins™ Rewards & Perks</h2>
                <div className="p-6 bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-8 h-8 text-amber-500" />
                    <div>
                      <div className="text-2xl font-extrabold text-zinc-950 font-mono">
                        {currentUser?.novaCoins || 250} Coins Available
                      </div>
                      <div className="text-xs text-amber-700 font-semibold">
                        Equivalent to ₹{currentUser?.novaCoins || 250} Instant Discount on checkout
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed pt-2">
                    Earn 50 NovaCoins for every verified review and 5% back on every flagship accessory purchase.
                  </p>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 text-xs shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-950 font-display">Profile & Account Security</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Manage your personal details and authentication status.</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setProfileName(currentUser.name);
                        setProfilePhone(currentUser.phone);
                        setIsEditingProfile(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-zinc-700 font-semibold block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-700 font-semibold block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#EB0028] text-white font-bold uppercase tracking-wider hover:bg-[#c90023]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-zinc-500 font-semibold block mb-1">Full Name</label>
                      <div className="font-bold text-zinc-950 text-sm p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                        {currentUser?.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-500 font-semibold block mb-1">Email Address</label>
                      <div className="font-bold text-zinc-950 text-sm p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                        {currentUser?.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-500 font-semibold block mb-1">Phone Number</label>
                      <div className="font-bold text-zinc-950 text-sm p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
                        {currentUser?.phone || 'Not provided'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <OrderInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Return Request Modal */}
      {returnModalData && (
        <ReturnRequestModal
          order={returnModalData.order}
          item={returnModalData.item}
          onClose={() => setReturnModalData(null)}
          onSuccess={() => setActiveTab('returns')}
        />
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-gray-900">Cancel Order #{cancelModalOrder.orderNumber || cancelModalOrder.id.slice(0, 8)}</h3>
            <p className="text-gray-500">
              Are you sure you want to cancel this order? If already paid, the refund of ₹{cancelModalOrder.total.toLocaleString('en-IN')} will be initiated back to your original payment method.
            </p>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
              >
                <option value="Found better alternative or price">Found better alternative or price</option>
                <option value="Order created by mistake">Order created by mistake</option>
                <option value="Need to change delivery address or contact">Need to change delivery address or contact</option>
                <option value="Delivery timeline too long">Delivery timeline too long</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-gray-900">Create Support Ticket</h3>
            <form onSubmit={handleSubmitTicket} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Issue with GaN Charger 120W heating on MacBook Pro 16"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="order">Order & Shipping</option>
                    <option value="warranty">Warranty & Replacement</option>
                    <option value="product">Hardware Technical Query</option>
                    <option value="seller">Merchant / Partner Inquiry</option>
                    <option value="other">General / Payment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Provide all details including order numbers, error behaviors, or courier issues..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="px-5 py-2 rounded-xl bg-[#EB0028] text-white font-bold disabled:opacity-50"
                >
                  {isSubmittingTicket ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-zinc-950 font-display">Add New Delivery Address</h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddrFullName}
                  onChange={(e) => setNewAddrFullName(e.target.value)}
                  placeholder="e.g. Vishvajit Pawar"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={newAddrPhone}
                  onChange={(e) => setNewAddrPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Flat / Street / Landmark</label>
                <input
                  type="text"
                  required
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="Apartment 4B, 100ft Road"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    placeholder="560038"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EB0028] text-white font-bold uppercase tracking-wider hover:bg-[#c90023]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
