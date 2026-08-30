import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ImageViewerModal: React.FC = () => {
  const { imageViewerData, closeImageViewer } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (imageViewerData) {
      setCurrentIndex(imageViewerData.initialIndex || 0);
      setIsZoomed(false);
    }
  }, [imageViewerData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageViewerData) return;
      if (e.key === 'Escape') closeImageViewer();
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % imageViewerData.images.length);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + imageViewerData.images.length) % imageViewerData.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageViewerData, closeImageViewer]);

  if (!imageViewerData) return null;

  const { images } = imageViewerData;
  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      <div id="image-fullscreen-viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl select-none">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-3 text-white">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 transition-colors shadow-lg"
            title="Toggle Zoom"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={closeImageViewer}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 transition-colors shadow-lg"
            title="Close Viewer (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter */}
        <div className="absolute top-5 left-6 z-50 text-xs font-mono text-white bg-black/60 px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-50 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 shadow-xl"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: isZoomed ? 1.4 : 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="max-w-5xl max-h-[85vh] p-4 flex items-center justify-center cursor-zoom-in overflow-hidden"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={currentImage}
            alt="Product Zoom High Resolution"
            className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300 bg-white/5 p-2"
          />
        </motion.div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-50 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 shadow-xl"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-black/70 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all bg-white/10 ${
                  currentIndex === idx
                    ? 'border-[#EB0028] scale-105 ring-2 ring-[#EB0028]/30'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
