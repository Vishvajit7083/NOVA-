import React from 'react';
import { Bell, CheckCheck, X, Package, ShieldCheck, Tag, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateOrders?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, onNavigateOrders }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useShop();

  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'return':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-[#EB0028]" />;
      case 'account':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-end p-4 sm:p-6 animate-in fade-in duration-100">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mt-12 sm:mt-16 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#EB0028] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <p className="text-[11px] text-gray-500">
                {notifications.filter((n) => !n.isRead).length} unread updates
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={() => markAllNotificationsRead()}
                className="text-[11px] font-semibold text-gray-600 hover:text-[#EB0028] px-2 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto divide-y divide-gray-100 p-2 flex-1">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.isRead) markNotificationRead(n.id);
                  if (n.link && onNavigateOrders) {
                    onNavigateOrders();
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  n.isRead ? 'bg-transparent hover:bg-gray-50 opacity-75' : 'bg-red-50/40 hover:bg-red-50/70 border border-red-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-white shadow-2xs border border-gray-100 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-900">{n.title}</p>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#EB0028] shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-gray-400">
                      <span>{new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {n.link && (
                        <span className="text-[#EB0028] font-bold flex items-center space-x-0.5">
                          <span>View Details</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700">All caught up!</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                You will receive real-time alerts on your orders, tracking, refunds, and flash sales here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
