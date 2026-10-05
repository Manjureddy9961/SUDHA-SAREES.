import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SareeCard from '../components/common/SareeCard';
import PreBookingModal from '../components/booking/PreBookingModal';
import TempleBorder from '../components/common/TempleBorder';
import { getWishlist, fetchSarees, toggleWishlistItem } from '../lib/dataService';

export default function WishlistPage() {
  const [wishlistSarees, setWishlistSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSareeForBooking, setSelectedSareeForBooking] = useState(null);

  const loadWishlist = async () => {
    setLoading(true);
    const savedIds = await getWishlist();
    if (savedIds && savedIds.length > 0) {
      const all = await fetchSarees();
      const filtered = all.filter((s) => savedIds.includes(s.id));
      setWishlistSarees(filtered);
    } else {
      setWishlistSarees([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdated = () => {
      loadWishlist();
    };
    window.addEventListener('sudha-wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('sudha-wishlist-updated', handleWishlistUpdated);
  }, []);

  const handleRemove = async (sareeId) => {
    await toggleWishlistItem(sareeId);
    setWishlistSarees((prev) => prev.filter((s) => s.id !== sareeId));
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
      {/* Banner */}
      <div className="bg-brand-maroon-dark text-brand-ivory py-12 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-brand-gold-light uppercase tracking-widest font-semibold mb-2">
            <Heart size={14} className="fill-brand-gold-light" />
            <span>Saved Heirlooms</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-gold-light">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-brand-blush/80 mt-2">
            Your saved favorites are securely stored and synced across visits.
          </p>
        </div>
        <TempleBorder variant="gold" className="absolute bottom-0 inset-x-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-96 animate-pulse border border-brand-gold/20"
              />
            ))}
          </div>
        ) : wishlistSarees.length > 0 ? (
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-brand-gold/30 mb-8">
              <span className="text-xs sm:text-sm text-brand-charcoal/80 font-sans">
                You have <strong className="text-brand-maroon">{wishlistSarees.length}</strong> saved saree
                {wishlistSarees.length > 1 ? 's' : ''} in your wishlist.
              </span>
              <Link
                to="/sarees"
                className="text-xs text-brand-maroon hover:underline font-semibold flex items-center gap-1"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {wishlistSarees.map((saree) => (
                <div key={saree.id} className="relative group">
                  <SareeCard
                    saree={saree}
                    onPrebook={(s) => setSelectedSareeForBooking(s)}
                  />
                  {/* Dedicated Remove from Wishlist Badge */}
                  <button
                    onClick={() => handleRemove(saree.id)}
                    className="mt-2 w-full py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 size={13} />
                    <span>Remove from Saved</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-20 px-6 bg-white rounded-3xl border border-brand-gold/30 shadow-md">
            <div className="w-16 h-16 bg-brand-blush rounded-full flex items-center justify-center text-brand-maroon mx-auto mb-4">
              <Heart size={30} className="text-brand-maroon" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-maroon-dark">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-brand-charcoal/70 mt-2 leading-relaxed">
              Explore our handcrafted Kanchipuram, Banarasi, Pochampally, and bridal silks, and tap the heart icon to save your favorites.
            </p>
            <Link
              to="/sarees"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-gold-light text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition"
            >
              <ShoppingBag size={14} />
              <span>Explore Saree Collection</span>
            </Link>
          </div>
        )}
      </div>

      {/* Pre-Booking Modal */}
      {selectedSareeForBooking && (
        <PreBookingModal
          isOpen={Boolean(selectedSareeForBooking)}
          onClose={() => setSelectedSareeForBooking(null)}
          saree={selectedSareeForBooking}
        />
      )}
    </div>
  );
}
