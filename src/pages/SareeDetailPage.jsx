import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ShieldCheck, Share2, MessageSquare, ArrowLeft, Check, Clock, Truck, ZoomIn, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Lightbox from '../components/common/Lightbox';
import PreBookingModal from '../components/booking/PreBookingModal';
import SareeCard from '../components/common/SareeCard';
import TempleBorder from '../components/common/TempleBorder';
import { fetchSareeByIdOrSlug, fetchSarees, toggleWishlistItem, isInWishlist } from '../lib/dataService';

export default function SareeDetailPage() {
  const { sareeId } = useParams();
  const navigate = useNavigate();

  const [saree, setSaree] = useState(null);
  const [relatedSarees, setRelatedSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPrebookingOpen, setIsPrebookingOpen] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setActiveImageIndex(0);

    fetchSareeByIdOrSlug(sareeId).then((data) => {
      if (!isMounted) return;
      if (data) {
        setSaree(data);
        setInWishlist(isInWishlist(data.id));

        // Fetch related sarees
        fetchSarees({ inStockOnly: true }).then((all) => {
          if (!isMounted) return;
          const related = all.filter((s) => s.id !== data.id && (s.type_id === data.type_id || s.fabric === data.fabric));
          setRelatedSarees(related.slice(0, 3));
        });
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [sareeId]);

  const handleWishlistToggle = async () => {
    if (!saree) return;
    const newState = await toggleWishlistItem(saree.id);
    setInWishlist(newState);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${saree.name} | Sudha Sarees`,
        text: `Check out this authentic handloom saree at Sudha Sarees, Rayachoty: ${saree.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-maroon border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-brand-maroon">Unfolding Handloom Saree...</p>
        </div>
      </div>
    );
  }

  if (!saree) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-maroon-dark">Saree Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">The drape you are looking for may have been archived or moved.</p>
        <Link
          to="/sarees"
          className="mt-4 px-6 py-2 bg-brand-maroon text-brand-gold-light text-xs font-semibold rounded-full"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = Array.isArray(saree.images) && saree.images.length > 0
    ? saree.images
    : saree.cover_image_url
    ? [saree.cover_image_url]
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'];

  const discountPercent =
    saree.original_price && saree.original_price > saree.price
      ? Math.round(((saree.original_price - saree.price) / saree.original_price) * 100)
      : null;

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Namaste Sudha Sarees, I am inquiring about "${saree.name}" (Price: ₹${Number(saree.price).toLocaleString('en-IN')}). Can you share a live video preview or hold this for showroom viewing? Link: ${window.location.href}`
  )}`;

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-brand-charcoal/60 mb-6">
          <Link to="/" className="hover:text-brand-maroon">Home</Link>
          <span>/</span>
          <Link to="/sarees" className="hover:text-brand-maroon">Sarees</Link>
          <span>/</span>
          <span className="text-brand-maroon font-semibold truncate max-w-[200px] sm:max-w-none">{saree.name}</span>
        </div>

        {/* Product Hero Grid: Gallery (Left) & Specifications/Actions (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ======================================================== */}
          {/* IMAGE GALLERY COLUMN (LG: 7 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image with Zoom Trigger */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-brand-gold/30 shadow-lg cursor-zoom-in group"
            >
              <img
                src={images[activeImageIndex]}
                alt={`${saree.name} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Zoom overlay badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition shadow">
                <ZoomIn size={14} />
                <span>Tap to Zoom Fullscreen</span>
              </div>

              {/* Silk Mark Seal Badge */}
              <div className="absolute top-4 left-4 bg-brand-maroon/90 backdrop-blur-md text-brand-gold-light text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-gold/40 shadow flex items-center gap-1.5">
                <Sparkles size={12} className="text-brand-gold-light" />
                <span>Certified Pure Silk Mark</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-brand-maroon shadow-md scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* PRODUCT SPECS & ACTION COLUMN (LG: 5 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Origin Tag */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-gold-dark font-sans">
                  {saree.fabric}
                </span>
                <button
                  onClick={handleShare}
                  className="text-xs text-brand-maroon hover:text-brand-maroon-dark flex items-center gap-1 p-1"
                  title="Share this saree"
                >
                  <Share2 size={15} />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Saree Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon-dark mt-2 leading-tight">
                {saree.name}
              </h1>

              {/* Price & Savings Row */}
              <div className="mt-4 p-4 bg-white rounded-2xl border border-brand-gold/30 shadow-sm flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-brand-maroon-dark font-sans">
                      ₹{Number(saree.price).toLocaleString('en-IN')}
                    </span>
                    {saree.original_price && saree.original_price > saree.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{Number(saree.original_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Inclusive of all taxes &bull; Includes Unstitched Blouse Piece
                  </span>
                </div>

                {discountPercent && (
                  <span className="bg-brand-peacock text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-emerald-800">
                  {saree.in_stock ? 'Available at Rayachoty Showroom & Ready for Dispatch' : 'Made to Order Loom'}
                </span>
              </div>

              {/* Story & Description */}
              <div className="mt-5">
                <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-brand-maroon-dark mb-2">
                  The Weaver's Craft
                </h3>
                <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
                  {saree.description}
                </p>
              </div>

              {/* Key Attributes & Weave Specifications */}
              <div className="mt-6 bg-white rounded-2xl p-4 border border-brand-gold/30 shadow-sm divide-y divide-brand-blush/60 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500">Pure Fabric</span>
                  <span className="font-semibold text-brand-maroon-dark text-right">{saree.fabric}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500">Color Palette</span>
                  <span className="font-semibold text-brand-maroon-dark text-right">{saree.color}</span>
                </div>
                {saree.attributes?.zari_type && (
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Zari Specification</span>
                    <span className="font-semibold text-brand-maroon-dark text-right">{saree.attributes.zari_type}</span>
                  </div>
                )}
                {saree.attributes?.occasion && (
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Best Suited For</span>
                    <span className="font-semibold text-brand-maroon-dark text-right">{saree.attributes.occasion}</span>
                  </div>
                )}
                {saree.attributes?.origin && (
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Handloom Origin</span>
                    <span className="font-semibold text-brand-maroon-dark text-right">{saree.attributes.origin}</span>
                  </div>
                )}
                {saree.attributes?.blouse_included && (
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Blouse Piece</span>
                    <span className="font-semibold text-brand-maroon-dark text-right">{saree.attributes.blouse_included}</span>
                  </div>
                )}
                {saree.attributes?.care && (
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Wash &amp; Care</span>
                    <span className="font-semibold text-brand-maroon-dark text-right">{saree.attributes.care}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-brand-gold/30">
              <div className="flex gap-3">
                {/* Pre-book button */}
                <button
                  onClick={() => setIsPrebookingOpen(true)}
                  className="flex-1 py-3.5 px-6 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark hover:from-brand-maroon-light hover:to-brand-maroon text-brand-gold-light text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl shadow-lg border border-brand-gold/40 transition transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Pre-Book This Saree</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                    inWishlist
                      ? 'bg-brand-blush border-brand-maroon text-brand-maroon'
                      : 'bg-white border-brand-gold/40 text-brand-maroon hover:bg-brand-blush/30'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={20} className={inWishlist ? 'fill-brand-maroon' : ''} />
                </button>
              </div>

              {/* Direct WhatsApp Consultation */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-brand-peacock hover:bg-brand-peacock-light text-white text-xs sm:text-sm font-semibold rounded-2xl shadow transition flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Enquire &amp; Video Call on WhatsApp</span>
              </a>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-gray-500">
                <div className="p-2 bg-white rounded-xl border border-brand-gold/20 flex flex-col items-center justify-center">
                  <ShieldCheck size={16} className="text-brand-gold-dark mb-1" />
                  <span>Silk Mark Certified</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-brand-gold/20 flex flex-col items-center justify-center">
                  <Truck size={16} className="text-brand-gold-dark mb-1" />
                  <span>Insured Shipping</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-brand-gold/20 flex flex-col items-center justify-center">
                  <Clock size={16} className="text-brand-gold-dark mb-1" />
                  <span>Showroom Hold</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Sarees Section */}
        {relatedSarees.length > 0 && (
          <div className="mt-20 pt-10 border-t border-brand-gold/30">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon-dark mt-1">
                You May Also Adore
              </h2>
              <div className="w-16 h-0.5 bg-brand-gold mx-auto my-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedSarees.map((item) => (
                <SareeCard
                  key={item.id}
                  saree={item}
                  onPrebook={(s) => {
                    setSaree(s);
                    setIsPrebookingOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        currentIndex={activeImageIndex}
        onIndexChange={setActiveImageIndex}
      />

      {/* Pre-Booking Modal */}
      <PreBookingModal
        isOpen={isPrebookingOpen}
        onClose={() => setIsPrebookingOpen(false)}
        saree={saree}
      />
    </div>
  );
}
