import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CinematicWelcomeProps {
  onComplete?: () => void;
}

export const CinematicWelcome: React.FC<CinematicWelcomeProps> = ({ onComplete }) => {
  const [show, setShow] = useState(() => {
    try {
      const shown = sessionStorage.getItem('aurelia_intro_shown');
      return !shown;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      handleDismiss();
    }, 1800);

    return () => clearTimeout(timer);
  }, [show]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('aurelia_intro_shown', 'true');
    } catch (e) {
      console.error(e);
    }
    setShow(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="cinematic-welcome-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D] text-white select-none overflow-hidden"
        >
          {/* Subtle gold ambient haze */}
          <div className="absolute w-[500px] h-[500px] bg-[#9A7B38]/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            {/* Minimal gold crest icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-14 h-14 rounded-full bg-[#181818] border border-[#9A7B38]/30 flex items-center justify-center mb-6 shadow-2xl relative"
            >
              <Sparkles className="w-6 h-6 text-[#9A7B38]" />
            </motion.div>

            {/* Brand Wordmark with refined serif typography */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center space-x-2"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.25em] text-[#FDFBF7]">
                AURELIA & CO.
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
              className="text-xs sm:text-sm font-medium tracking-[0.35em] uppercase text-[#9A7B38] mt-3"
            >
              Haute Couture & Atelier Accessories
            </motion.p>
          </div>

          {/* Skip button */}
          <motion.button
            id="skip-intro-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleDismiss}
            className="absolute bottom-8 text-[11px] font-semibold tracking-widest text-stone-400 hover:text-white uppercase px-5 py-2 rounded-full border border-stone-800 hover:border-stone-600 transition-colors cursor-pointer"
          >
            Enter Maison
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
