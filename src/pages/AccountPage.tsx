import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Coins,
  ShieldCheck,
  CreditCard,
  LogOut,
  Truck,
  Trash2,
  ShieldAlert,
  Edit3,
  FileText,
  RotateCcw,
  Bell,
  HelpCircle,
  XCircle,
  Store,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, CartItem, SupportTicket } from '../types';
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
    deleteOrder,
    clearOrderHistory,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'returns' | 'notifications' | 'support' | 'addresses' | 'rewards' | 'profile'>('orders');

  // Modals state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [returnModalData, setReturnModalData] = useState<{ order: Order; item: CartItem } | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Changed styling preference');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

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
      <div id="account-login-prompt" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-20 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#E8E2D9] rounded-3xl p-8 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center text-[#9A7B38] mx-auto shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">Sign In to Your Atelier Account</h1>
            <p className="text-xs text-stone-500 mt-1 font-normal">
              Access your couture orders, bespoke fitting requests, client addresses, and Privilege Credits.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-widest transition-colors shadow-md cursor-pointer"
            >
              Sign In or Register
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="w-full py-3 rounded-full bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              Explore Runway Catalog
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

      await openRazorpayCheckout(
        {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: 'AURELIA & CO. Haute Couture',
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
            color: '#9A7B38',
          },
          modal: {
            ondismiss: () => {
              setRetryingOrderId(null);
              showToast('Payment Cancelled', 'Payment modal was closed.', 'info');
            },
          },
          handler: async (response) => {
            try {
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
    <div id="account-portal-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">
        
        {/* User Hero Bar */}
        <div className="bg-white border border-[#E8E2D9] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center text-[#9A7B38] text-2xl font-serif font-bold uppercase shadow-inner">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  {currentUser?.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-bold uppercase tracking-wider">
                  {isAdmin ? 'Maison Admin' : isSeller ? 'Verified Designer' : 'Haute Couture Circle'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{currentUser?.email} • {currentUser?.phone || '+91 Client'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="p-3 bg-[#111111] hover:bg-[#9A7B38] text-white rounded-full flex items-center space-x-2 font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-[#9A7B38]" />
                <span>Admin Console</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('seller')}
              className="p-3 bg-[#FAF8F5] hover:bg-stone-200 border border-[#E0D8C8] rounded-full text-stone-900 font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#9A7B38]" />
              <span>{isSeller ? 'Designer Studio' : 'Partner with AURELIA'}</span>
            </button>

            <div className="p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-full flex items-center space-x-2.5 px-4">
              <Sparkles className="w-4 h-4 text-[#9A7B38]" />
              <div>
                <div className="font-bold text-stone-900 font-serif text-sm">
                  {currentUser?.novaCoins?.toLocaleString('en-IN') || 500} Credits
                </div>
                <div className="text-[10px] text-stone-500 uppercase font-semibold tracking-wider">Privilege Balance</div>
              </div>
            </div>

            <button
              onClick={() => logoutUser()}
              className="p-3 bg-[#FAF8F5] hover:bg-stone-200 border border-[#E0D8C8] rounded-full text-stone-700 font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
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
          <div className="lg:col-span-3 space-y-1.5 bg-white border border-[#E8E2D9] rounded-2xl p-4 h-fit shadow-xs">
            {[
              { id: 'orders', label: 'My Couture Orders', icon: Package, count: orders.length },
              { id: 'returns', label: 'Returns & Fitting Exchanges', icon: RotateCcw, count: userReturns.length },
              { id: 'notifications', label: 'Atelier Alerts', icon: Bell, count: notifications.filter((n) => !n.isRead).length },
              { id: 'support', label: 'Concierge Desk', icon: HelpCircle, count: userTickets.length },
              { id: 'addresses', label: 'Client Delivery Addresses', icon: MapPin, count: savedAddressesList.length },
              { id: 'rewards', label: 'Privilege Credits & Tier', icon: Sparkles },
              { id: 'profile', label: 'Profile & Bespoke Sizing', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      activeTab === tab.id ? 'bg-[#9A7B38] text-white' : 'bg-stone-100 text-stone-600'
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">Order History & Invoices</h2>
                    <p className="text-xs text-stone-500">{orders.length} total orders recorded</p>
                  </div>

                  {orders.length > 0 && (
                    <button
                      onClick={() => setIsClearModalOpen(true)}
                      className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Clear entire order history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear History</span>
                    </button>
                  )}
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 bg-white border border-[#E8E2D9] rounded-2xl text-center text-xs text-stone-500 shadow-xs space-y-3">
                    <Package className="w-8 h-8 text-stone-300 mx-auto" />
                    <p>No past couture orders found on this client profile.</p>
                    <button
                      onClick={() => onNavigate('shop')}
                      className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                    >
                      Browse Runway Collections
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4 shadow-xs"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE4D8] pb-4 text-xs">
                        <div>
                          <div className="text-stone-900 font-mono font-bold text-sm flex items-center space-x-2">
                            <span>#{order.orderNumber || order.id.slice(0, 8)}</span>
                            {order.trackingNumber && (
                              <span className="text-[11px] font-normal text-stone-500 font-sans">
                                (AWB: {order.trackingNumber})
                              </span>
                            )}
                          </div>
                          <div className="text-stone-500 text-[11px] mt-0.5">
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
                          {order.paymentDetails?.paid ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>PAID {order.paymentDetails.transactionId ? `(${order.paymentDetails.transactionId.slice(-8)})` : ''}</span>
                            </span>
                          ) : order.paymentMethod === 'cod' ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-800">
                              COD PENDING
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 border border-rose-200 text-rose-700">
                              PAYMENT DUE
                            </span>
                          )}

                          <span className={`px-3 py-1 rounded-full text-xs font-serif font-bold uppercase ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 border border-blue-200 text-blue-800'
                              : order.status === 'cancelled'
                              ? 'bg-rose-50 border border-rose-200 text-rose-700'
                              : 'bg-amber-50 border border-amber-200 text-amber-800'
                          }`}>
                            {order.status}
                          </span>

                          {!order.paymentDetails?.paid && order.paymentMethod !== 'cod' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleRetryPayment(order)}
                              disabled={retryingOrderId === order.id}
                              className="px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>{retryingOrderId === order.id ? 'Connecting...' : 'Authorize with Razorpay'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-stone-200 border border-[#E0D8C8] text-stone-800 font-semibold flex items-center space-x-1 transition-colors"
                            title="Download Atelier Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-stone-600" />
                            <span>Tax Invoice</span>
                          </button>

                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => onNavigate('tracking', { trackingNumber: order.trackingNumber || order.id })}
                              className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-stone-200 border border-[#E0D8C8] text-stone-900 font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5 text-[#9A7B38]" />
                              <span>Track Live</span>
                            </button>
                          )}

                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                              onClick={() => setCancelModalOrder(order)}
                              className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold flex items-center space-x-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm(`Remove order #${order.orderNumber || order.id} from your history?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="Remove from Order History"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE4D8]">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-16 aspect-[3/4] rounded-lg overflow-hidden bg-white border border-[#E8E2D9] shrink-0">
                                <img
                                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'}
                                  alt=""
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div>
                                <h4 className="text-stone-900 font-serif font-bold">{item.product?.name || item.productId}</h4>
                                <div className="text-[11px] text-stone-500">
                                  Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor.name}`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                              <div className="text-left sm:text-right">
                                <div className="font-bold text-stone-900 font-serif">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {(order.status === 'delivered' || order.status === 'shipped') && (
                                  <button
                                    onClick={() => setReturnModalData({ order, item })}
                                    className="px-3 py-1 bg-white border border-[#E0D8C8] hover:border-black rounded-full text-[11px] font-semibold text-stone-700 hover:text-black flex items-center space-x-1"
                                  >
                                    <RotateCcw className="w-3 h-3 text-[#9A7B38]" />
                                    <span>Exchange / Return</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => onNavigate('product-detail', { productId: item.productId })}
                                  className="text-[11px] text-[#9A7B38] hover:underline font-semibold"
                                >
                                  View Item
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer info */}
                      <div className="pt-3 border-t border-[#EAE4D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="text-stone-500">
                          Total Amount: <strong className="text-stone-950 font-serif font-bold">₹{order.total.toLocaleString('en-IN')}</strong> ({order.paymentMethod.toUpperCase()})
                        </div>
                        <div className="text-[#9A7B38] flex items-center space-x-1.5 font-medium">
                          <Scissors className="w-3.5 h-3.5" />
                          <span>1-Year Atelier Craftsmanship Warranty & 14-Day Fitting Guarantee</span>
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
                  <h2 className="text-xl font-serif font-bold text-stone-900">Fitting Exchanges & Returns</h2>
                  <p className="text-xs text-stone-500">14-Day Doorstep Complimentary Fitting Service</p>
                </div>

                {userReturns.length === 0 ? (
                  <div className="p-12 bg-white border border-[#E8E2D9] rounded-2xl text-center text-xs text-stone-500 shadow-xs space-y-3">
                    <RotateCcw className="w-8 h-8 text-stone-300 mx-auto" />
                    <p>No active return or alteration requests.</p>
                    <p className="text-[11px] text-stone-400">
                      You can initiate a size exchange from any delivered order in the "My Couture Orders" tab.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReturns.map((ret) => (
                      <div key={ret.id} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-4 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE4D8] pb-3 text-xs">
                          <div>
                            <span className="font-bold text-stone-900 font-mono text-sm">Exchange #{ret.returnNumber}</span>
                            <p className="text-stone-500 text-[11px]">
                              For Order #{ret.orderNumber} • Requested on {new Date(ret.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider ${
                            ret.status === 'refunded'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : ret.status === 'approved'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : ret.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {ret.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                          {ret.productImage && (
                            <img src={ret.productImage} alt="" className="w-12 h-16 object-cover rounded-lg border border-[#E8E2D9]" />
                          )}
                          <div>
                            <p className="font-serif font-bold text-stone-900">{ret.productName}</p>
                            <p className="text-stone-500 text-[11px]">
                              Reason: <strong className="capitalize text-stone-800">{ret.reason.replace('_', ' ')}</strong> — "{ret.reasonDetails}"
                            </p>
                            <p className="font-bold text-stone-900 mt-1 font-serif">Refund / Credit Value: ₹{ret.refundAmount.toLocaleString('en-IN')}</p>
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
                  <h2 className="text-xl font-serif font-bold text-stone-900">Atelier Notification Center</h2>
                  {notifications.some((n) => !n.isRead) && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-xs font-semibold text-[#9A7B38] hover:underline cursor-pointer"
                    >
                      Mark All as Read
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-2xl border transition-all text-xs flex items-start justify-between gap-4 cursor-pointer ${
                        notif.isRead
                          ? 'bg-white border-[#E8E2D9] text-stone-600'
                          : 'bg-[#FAF8F5] border-[#9A7B38] text-stone-900 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-sm text-stone-900">{notif.title}</h4>
                        <p className="text-stone-600 leading-relaxed font-normal">{notif.message}</p>
                        <span className="text-[10px] text-stone-400 block pt-1 font-mono">
                          {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#9A7B38] shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUPPORT DESK TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">Client Concierge & Support</h2>
                    <p className="text-xs text-stone-500">Direct assistance for bespoke orders and runway inquiries.</p>
                  </div>
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="px-4 py-2 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
                  >
                    Open New Request
                  </button>
                </div>

                {userTickets.length === 0 ? (
                  <div className="p-12 bg-white border border-[#E8E2D9] rounded-2xl text-center text-xs text-stone-500 shadow-xs space-y-3">
                    <HelpCircle className="w-8 h-8 text-stone-300 mx-auto" />
                    <p>No active concierge requests. Our styling team is here whenever you need assistance.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userTickets.map((t) => (
                      <div key={t.id} className="p-5 bg-white border border-[#E8E2D9] rounded-2xl space-y-2 text-xs shadow-xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-stone-900 text-sm">{t.subject}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                            t.status === 'resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-stone-600 font-normal">{t.message}</p>
                        <div className="text-[11px] text-stone-400 pt-1 flex items-center space-x-3">
                          <span>Category: <strong className="capitalize text-stone-700">{t.category}</strong></span>
                          <span>•</span>
                          <span>Priority: <strong className="capitalize text-stone-700">{t.priority}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold text-stone-900">Client Delivery Addresses</h2>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-4 py-2 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
                  >
                    Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddressesList.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 bg-white border border-[#E8E2D9] rounded-2xl space-y-3 text-xs shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-stone-950 text-sm">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#9A7B38] border border-[#E0D8C8] px-2 py-0.5 rounded-full">
                              Default Destination
                            </span>
                          )}
                        </div>
                        <p className="text-stone-700 leading-relaxed font-normal">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-stone-500">Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] text-stone-600 hover:text-black font-semibold underline"
                          >
                            Set as default
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-800 font-bold">Primary Address</span>
                        )}
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
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
                <h2 className="text-xl font-serif font-bold text-stone-900">Atelier Privilege Credits & Tier</h2>
                <div className="p-6 bg-gradient-to-br from-[#FAF8F5] to-white border border-[#E0D8C8] rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-8 h-8 text-[#9A7B38]" />
                    <div>
                      <div className="text-2xl font-serif font-bold text-stone-900">
                        {currentUser?.novaCoins || 500} Credits Available
                      </div>
                      <div className="text-xs text-[#9A7B38] font-semibold">
                        Equivalent to ₹{currentUser?.novaCoins || 500} Instant Savings on your next atelier order
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pt-2 font-normal">
                    Earn 100 Privilege Credits for every verified garment review, bespoke size profile completion, and 5% back on every haute couture order.
                  </p>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-6 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">Client Profile & Bespoke Measurements</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Manage your personal credentials and tailored preferences.</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setProfileName(currentUser.name);
                        setProfilePhone(currentUser.phone);
                        setIsEditingProfile(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-stone-200 text-stone-800 font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-stone-700 font-semibold block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                      />
                    </div>
                    <div>
                      <label className="text-stone-700 font-semibold block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl p-3 text-stone-900 focus:outline-none focus:border-[#9A7B38]"
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 rounded-full bg-[#FAF8F5] text-stone-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold uppercase tracking-wider"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-stone-500 font-semibold block mb-1">Client Name</label>
                      <div className="font-serif font-bold text-stone-950 text-sm p-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl">
                        {currentUser?.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-stone-500 font-semibold block mb-1">Email Address</label>
                      <div className="font-serif font-bold text-stone-950 text-sm p-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl">
                        {currentUser?.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-stone-500 font-semibold block mb-1">Phone Number</label>
                      <div className="font-serif font-bold text-stone-950 text-sm p-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl">
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
            <h3 className="text-base font-serif font-bold text-stone-900">Cancel Atelier Order #{cancelModalOrder.orderNumber || cancelModalOrder.id.slice(0, 8)}</h3>
            <p className="text-stone-500 font-normal">
              Are you sure you want to cancel this order? If already paid, the full refund of ₹{cancelModalOrder.total.toLocaleString('en-IN')} will be initiated back to your original payment method.
            </p>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl font-medium"
              >
                <option value="Changed styling preference">Changed styling preference</option>
                <option value="Need to change sizing / fit details">Need to change sizing / fit details</option>
                <option value="Need to change delivery address or contact">Need to change delivery address or contact</option>
                <option value="Found alternative couture piece">Found alternative couture piece</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-full text-stone-600 hover:bg-[#FAF8F5] font-semibold"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancelOrder}
                disabled={isCancelling}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold disabled:opacity-50"
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
            <h3 className="text-base font-serif font-bold text-stone-900">Contact Atelier Concierge</h3>
            <form onSubmit={handleSubmitTicket} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Sizing inquiry regarding Mulberry Silk Evening Gown"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                  >
                    <option value="order">Order & Insured Dispatch</option>
                    <option value="warranty">Bespoke Alteration & Fitting</option>
                    <option value="product">Fabric & Sizing Guidance</option>
                    <option value="seller">Designer Studio Inquiry</option>
                    <option value="other">General / Payment Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                  >
                    <option value="low">Standard</option>
                    <option value="medium">Priority</option>
                    <option value="high">Urgent Event / Handover</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Please describe your styling request, order numbers, or measurement questions..."
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 rounded-full text-stone-600 hover:bg-[#FAF8F5] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="px-6 py-2 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold disabled:opacity-50"
                >
                  {isSubmittingTicket ? 'Submitting...' : 'Submit to Concierge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D9] max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-serif font-bold text-stone-900">Add New Delivery Destination</h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddrFullName}
                  onChange={(e) => setNewAddrFullName(e.target.value)}
                  placeholder="e.g. Vishwajit Pawar"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={newAddrPhone}
                  onChange={(e) => setNewAddrPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Flat / Villa / Street / Landmark</label>
                <input
                  type="text"
                  required
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="Villa 4B, Palm Avenue, Koramangala"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    placeholder="560034"
                    className="w-full p-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#FAF8F5] text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Clear History Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D9] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-stone-900">Clear Order History?</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Are you sure you want to permanently clear all recorded orders and tax invoices from your account profile? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                disabled={isClearing}
                className="flex-1 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsClearing(true);
                  try {
                    await clearOrderHistory();
                    setIsClearModalOpen(false);
                  } finally {
                    setIsClearing(false);
                  }
                }}
                disabled={isClearing}
                className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {isClearing ? 'Clearing...' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
