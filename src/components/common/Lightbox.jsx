import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Lightbox({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onIndexChange
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onIndexChange(currentIndex + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) onIndexChange(currentIndex - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50"
          aria-label="Close lightbox"
        >
          <X size={24} />
        </button>

        {/* Previous Button */}
        {images.length > 1 && currentIndex > 0 && (
          <button
            onClick={() => onIndexChange(currentIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && currentIndex < images.length - 1 && (
          <button
            onClick={() => onIndexChange(currentIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Main Image Display */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center select-none"
        >
          <img
            src={images[currentIndex]}
            alt={`Saree zoom view ${currentIndex + 1}`}
            className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
          />

          {/* Counter indicator */}
          <div className="mt-3 px-4 py-1 rounded-full bg-black/60 text-white/90 text-xs font-mono">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
