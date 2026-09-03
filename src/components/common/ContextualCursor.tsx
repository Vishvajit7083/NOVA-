import React, { useEffect, useState, useRef } from 'react';

export const ContextualCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Check if device is fine pointer (desktop mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      isTouchDevice.current = true;
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over element with custom cursor attribute
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor-text]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor-text'));
        setIsHoveringInteractive(true);
      } else {
        const isClickable = target?.closest('button, a, input, select, textarea, [role="button"]');
        setCursorText(null);
        setIsHoveringInteractive(!!isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice.current || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {cursorText ? (
        <div className="flex items-center justify-center px-3 py-1.5 rounded-full bg-[#C5A880] text-black text-[10px] font-mono font-bold tracking-widest uppercase shadow-2xl scale-100 transition-transform">
          {cursorText}
        </div>
      ) : isHoveringInteractive ? (
        <div className="w-8 h-8 rounded-full border border-[#C5A880]/60 bg-[#C5A880]/10 backdrop-blur-xs scale-100 transition-all duration-200" />
      ) : (
        <div className="w-2.5 h-2.5 rounded-full bg-[#C5A880]/50 transition-all duration-150" />
      )}
    </div>
  );
};
