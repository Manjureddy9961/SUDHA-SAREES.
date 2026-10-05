import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleWishlistItem, isInWishlist } from '../../lib/dataService';

export default function SareeCard({
  saree,
  onPrebook,
  priority = false
}) {
  const [inWishlist, setInWishlist] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  useEffect(() => {
    setInWishlist(isInWishlist(saree.id));

    const handleWishlistUpdated = (e) => {
      if (e.detail && Array.isArray(e.detail.items)) {
        setInWishlist(e.detail.items.includes(saree.id));
      }
    };
    window.addEventListener('sudha-wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('sudha-wishlist-updated', handleWishlistUpdated);
  }, [saree.id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeartAnimating(true);
    const newState = await toggleWishlistItem(saree.id);
    setInWishlist(newState);
    setTimeout(() => setIsHeartAnimating(false), 500);
  };

  const handlePrebookClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPrebook) {
      onPrebook(saree);
    }
  };

  // Image source: first image in array or cover
  const primaryImage =
    (Array.isArray(saree.images) && saree.images.length > 0
      ? saree.images[0]
      : saree.cover_image_url) ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

  const discountPercent =
    saree.original_price && saree.original_price > saree.price
      ? Math.round(((saree.original_price - saree.price) / saree.original_price) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-brand-gold/30 shadow-md hover:shadow-card-hover hover:border-brand-gold transition-all duration-300 flex flex-col"
    >
      {/* Image Container with Zoom & Wishlist Button */}
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-blush/20">
        <Link to={`/saree/${saree.slug || saree.id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={saree.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Shimmer overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {saree.featured && (
            <span className="inline-flex items-center gap-1 bg-brand-maroon/90 backdrop-blur-sm text-brand-gold-light text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-brand-gold/40 shadow-sm">
              <Sparkles size={11} className="text-brand-gold-light" />
              <span>Royal Pick</span>
            </span>
          )}
          {discountPercent && (
            <span className="bg-brand-peacock text-white text-[10px] font-bold px-2 py-0.5 rounded-full self-start shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-brand-maroon hover:bg-white flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 border border-brand-gold/20"
        >
          <motion.div
            animate={isHeartAnimating ? { scale: [1, 1.4, 0.9, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Heart
              size={18}
              className={`transition-colors ${
                inWishlist
                  ? 'fill-brand-maroon text-brand-maroon'
                  : 'text-brand-maroon hover:text-brand-maroon-dark'
              }`}
            />
          </motion.div>
        </button>

        {/* Quick Pre-Book CTA bar on hover (Desktop) */}
        <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handlePrebookClick}
            className="w-full py-2.5 px-3 bg-brand-maroon/95 hover:bg-brand-maroon text-brand-gold-light text-xs font-semibold uppercase tracking-wider rounded-xl backdrop-blur-md shadow-lg border border-brand-gold/40 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Pre-book This Saree</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Fabric & Origin meta */}
          <div className="flex items-center justify-between text-[11px] text-brand-charcoal/60 mb-1">
            <span className="truncate max-w-[170px] font-medium text-brand-gold-dark">
              {saree.fabric}
            </span>
            <span className="truncate">{saree.color?.split('&')[0]}</span>
          </div>

          {/* Saree Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-maroon-dark hover:text-brand-maroon transition-colors line-clamp-2 leading-snug">
            <Link to={`/saree/${saree.slug || saree.id}`}>
              {saree.name}
            </Link>
          </h3>
        </div>

        {/* Pricing and Action row */}
        <div className="mt-3 pt-3 border-t border-brand-blush/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-brand-maroon-dark font-sans">
                ₹{Number(saree.price).toLocaleString('en-IN')}
              </span>
              {saree.original_price && saree.original_price > saree.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{Number(saree.original_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-green-700 font-medium block">
              {saree.in_stock ? 'In Stock &bull; Free Rayachoty Delivery' : 'Made to Order'}
            </span>
          </div>

          {/* Mobile-friendly Pre-book trigger button */}
          <button
            onClick={handlePrebookClick}
            className="sm:hidden px-3 py-1.5 bg-brand-maroon text-brand-gold-light text-xs font-semibold rounded-lg shadow-sm border border-brand-gold/30 active:scale-95"
          >
            Pre-book
          </button>
        </div>
      </div>
    </motion.div>
  );
}
