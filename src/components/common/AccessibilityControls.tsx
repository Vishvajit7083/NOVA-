import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Eye, Type, Sparkles, X, Sun, Moon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AccessibilityControls: React.FC = () => {
  const {
    reducedMotion,
    setReducedMotion,
    largeText,
    setLargeText,
    highContrast,
    setHighContrast,
  } = useShop();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="accessibility-widget" className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 w-64 bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-950">
                <Sliders className="w-4 h-4 text-[#EB0028]" />
                <span>Accessibility & Display</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 p-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Reduced motion */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-zinc-600 group-hover:text-zinc-950">Reduced Motion</span>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="rounded border-zinc-300 text-[#EB0028] focus:ring-0"
                />
              </label>

              {/* Large typography */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-zinc-600 group-hover:text-zinc-950">Larger UI Text</span>
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  className="rounded border-zinc-300 text-[#EB0028] focus:ring-0"
                />
              </label>

              {/* High Contrast */}
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-zinc-600 group-hover:text-zinc-950">High Contrast Mode</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="rounded border-zinc-300 text-[#EB0028] focus:ring-0"
                />
              </label>
            </div>

            <div className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-100">
              Optimized for WCAG 2.1 AA Standards
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-950 flex items-center justify-center shadow-md transition-all"
        title="Accessibility Settings"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );
};
