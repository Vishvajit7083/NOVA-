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
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface AccountPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { currentUser, orders, wishlist, showToast } = useShop();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'rewards' | 'profile'>('orders');

  return (
    <div id="account-portal-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Hero Bar */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F9FA] border border-zinc-200 flex items-center justify-center text-zinc-900 text-xl font-bold font-display uppercase shadow-inner">
              {currentUser?.name.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-display">
                  {currentUser?.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#EB0028] text-[10px] font-bold uppercase tracking-wider">
                  VIP Flagship Tier
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{currentUser?.email} • {currentUser?.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="p-3 bg-[#F8F9FA] border border-zinc-200 rounded-2xl flex items-center space-x-2.5">
              <Coins className="w-5 h-5 text-amber-500" />
              <div>
                <div className="font-extrabold text-zinc-950 font-mono text-sm">
                  {currentUser?.novaCoins.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">NovaCoins Balance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-1.5 bg-white border border-zinc-200 rounded-2xl p-4 h-fit shadow-sm">
            {[
              { id: 'orders', label: 'My Hardware Orders', icon: Package, count: orders.length },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: currentUser?.savedAddresses.length },
              { id: 'rewards', label: 'NovaCoins & Perks', icon: Coins },
              { id: 'profile', label: 'Profile & Security', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
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
                <h2 className="text-lg font-bold text-zinc-950">Order History & NovaCare Invoices</h2>

                {orders.length === 0 ? (
                  <div className="p-12 bg-white border border-zinc-200 rounded-2xl text-center text-xs text-zinc-500 shadow-sm">
                    No past orders found on this account.
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
                          <div className="text-zinc-950 font-mono font-bold text-sm">
                            {order.id}
                          </div>
                          <div className="text-zinc-500 text-[11px] mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                            {order.status}
                          </span>
                          <button
                            onClick={() => onNavigate('tracking', { trackingNumber: order.trackingNumber })}
                            className="px-3 py-1.5 rounded-xl bg-[#F8F9FA] hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#EB0028]" />
                            <span>Track</span>
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.product.images[0]}
                                alt=""
                                className="w-12 h-12 object-contain rounded-lg bg-[#F8F9FA] p-1 border border-zinc-200 shrink-0"
                              />
                              <div>
                                <h4 className="text-zinc-900 font-bold">{item.product.name}</h4>
                                <div className="text-[11px] text-zinc-500">
                                  Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor.name}`}
                                </div>
                              </div>
                            </div>
                            <div className="font-extrabold text-zinc-950">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer info */}
                      <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="text-zinc-500">
                          Total Amount: <strong className="text-zinc-950 font-bold">₹{order.total.toLocaleString('en-IN')}</strong> ({order.paymentMethod})
                        </div>
                        <div className="text-emerald-600 flex items-center space-x-1 font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          <span>NovaCare™ Doorstep Warranty Active</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-zinc-950">Saved Delivery Addresses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser?.savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-2 text-xs shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-950">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-red-50 text-[#EB0028] border border-red-200 px-2 py-0.5 rounded">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-zinc-500">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REWARDS TAB */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-zinc-950">NovaCoins™ Rewards & Perks</h2>
                <div className="p-6 bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-8 h-8 text-amber-500" />
                    <div>
                      <div className="text-2xl font-extrabold text-zinc-950 font-mono">
                        {currentUser?.novaCoins} Coins Available
                      </div>
                      <div className="text-xs text-amber-700 font-semibold">
                        Equivalent to ₹{currentUser?.novaCoins} Instant Discount on checkout
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
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 text-xs shadow-sm">
                <h2 className="text-lg font-bold text-zinc-950">Profile Details</h2>
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.name}
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">Email</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email}
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">Phone</label>
                    <input
                      type="tel"
                      disabled
                      value={currentUser?.phone}
                      className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl p-3 text-zinc-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
