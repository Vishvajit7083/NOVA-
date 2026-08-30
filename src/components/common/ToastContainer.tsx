import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toast, hideToast } = useShop();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#EB0029] shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          className="pointer-events-auto bg-[#14161B]/95 backdrop-blur-md border border-white/15 text-white p-4 rounded-2xl shadow-2xl flex items-start space-x-3"
        >
          {getIcon()}
          <div className="flex-1">
            <div className="text-xs font-bold text-white">{toast.title}</div>
            <p className="text-xs text-zinc-300 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={hideToast}
            className="text-zinc-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
