import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

interface CinematicWelcomeProps {
  onComplete?: () => void;
}

export const CinematicWelcome: React.FC<CinematicWelcomeProps> = ({ onComplete }) => {
  const [show, setShow] = useState(() => {
    // Only show once per browser session unless reset
    try {
      const shown = sessionStorage.getItem('nova_intro_shown');
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
      sessionStorage.setItem('nova_intro_shown', 'true');
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
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080A] text-white select-none overflow-hidden"
        >
          {/* Ambient red tech glow background */}
          <div className="absolute w-[600px] h-[600px] bg-[#EB0029]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#1E232D_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            {/* Minimal glowing icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-14 h-14 rounded-2xl bg-[#14171D] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative group"
            >
              <div className="absolute inset-0 bg-[#EB0029]/20 rounded-2xl blur-lg" />
              <Zap className="w-7 h-7 text-[#EB0029] relative z-10" />
            </motion.div>

            {/* Brand Wordmark with scale & blur-to-sharp */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center space-x-2"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[0.25em] font-display text-white">
                NOVA
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-[#EB0029] shadow-[0_0_12px_#EB0029]" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
              className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-zinc-400 mt-3"
            >
              Engineering Flagship Accessories
            </motion.p>
          </div>

          {/* Skip button */}
          <motion.button
            id="skip-intro-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleDismiss}
            className="absolute bottom-8 text-xs font-semibold tracking-wider text-zinc-300 hover:text-white uppercase px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-colors"
          >
            Skip Intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
