import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCw, MoveHorizontal, Sparkles, Layers, Shield } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Product360Viewer: React.FC = () => {
  const { viewer360Product, close360Viewer } = useShop();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  if (!viewer360Product) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newAngle = (startAngleRef.current + deltaX * 0.8) % 360;
    setRotationAngle(newAngle);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newAngle = (startAngleRef.current + deltaX * 0.8) % 360;
    setRotationAngle(newAngle);
  };

  return (
    <AnimatePresence>
      <div
        id="product-360-viewer-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col items-center"
        >
          {/* Close button */}
          <button
            onClick={close360Viewer}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 border border-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-[#EB0028]/20 text-[#EB0028] text-[11px] font-bold uppercase tracking-wider mb-2">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Interactive 360° Studio View</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-950">{viewer360Product.name}</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Drag horizontally or swipe to spin and inspect all manufacturing tolerances
            </p>
          </div>

          {/* 360 Stage */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`w-full h-72 sm:h-80 relative flex items-center justify-center rounded-2xl bg-[#F8F9FA] border border-zinc-200 cursor-grab ${
              isDragging ? 'cursor-grabbing' : ''
            } overflow-hidden shadow-inner`}
          >
            {/* Tech grid perspective backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
            
            {/* Rotating Product Canvas with smooth CSS 3D transform */}
            <div
              style={{
                transform: `rotateY(${rotationAngle}deg) perspective(1000px)`,
                transformStyle: 'preserve-3d',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
              className="relative w-56 h-56 flex items-center justify-center pointer-events-none"
            >
              <img
                src={viewer360Product.images[0]}
                alt={viewer360Product.name}
                className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)]"
              />

              {/* Spec overlay beacon pins */}
              <div
                style={{ transform: 'translateZ(30px)' }}
                className="absolute -top-2 right-4 px-2.5 py-1 rounded-md bg-[#EB0028] text-white text-[9px] font-bold shadow-md"
              >
                GaN III Core
              </div>
            </div>

            {/* Drag Hint Indicator */}
            <div className="absolute bottom-3 flex items-center space-x-2 text-[11px] text-zinc-700 bg-white/95 px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
              <MoveHorizontal className="w-3.5 h-3.5 text-[#EB0028]" />
              <span>Drag to rotate • Angle: {Math.round(((rotationAngle % 360) + 360) % 360)}°</span>
            </div>
          </div>

          {/* Quick rotation preset buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setRotationAngle(0)}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs text-zinc-700 font-medium transition-colors"
            >
              Front Angle
            </button>
            <button
              onClick={() => setRotationAngle(90)}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs text-zinc-700 font-medium transition-colors"
            >
              Side Profile (90°)
            </button>
            <button
              onClick={() => setRotationAngle(180)}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs text-zinc-700 font-medium transition-colors"
            >
              Rear Ports (180°)
            </button>
            <button
              onClick={() => setRotationAngle(270)}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs text-zinc-700 font-medium transition-colors"
            >
              Opposite (270°)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
