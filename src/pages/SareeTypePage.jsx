import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import SareeCard from '../components/common/SareeCard';
import PreBookingModal from '../components/booking/PreBookingModal';
import TempleBorder from '../components/common/TempleBorder';
import { fetchSareeTypeBySlug, fetchSarees } from '../lib/dataService';

export default function SareeTypePage() {
  const { typeSlug } = useParams();
  const [sareeType, setSareeType] = useState(null);
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSareeForBooking, setSelectedSareeForBooking] = useState(null);
  const [sortOrder, setSortOrder] = useState('featured');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchSareeTypeBySlug(typeSlug),
      fetchSarees({ typeSlug, sort: sortOrder })
    ]).then(([typeData, sareesData]) => {
      if (isMounted) {
        setSareeType(typeData);
        setSarees(sareesData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [typeSlug, sortOrder]);

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
      {/* Category Hero Banner */}
      <div className="relative bg-brand-maroon-dark text-brand-ivory min-h-[40vh] sm:min-h-[48vh] flex items-center justify-center overflow-hidden">
        {sareeType?.cover_image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
            style={{ backgroundImage: `url('${sareeType.cover_image_url}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/75 to-brand-maroon-dark/90" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-14 text-center">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              to="/sarees"
              className="inline-flex items-center gap-1.5 text-xs text-brand-gold-light hover:text-white font-medium"
            >
              <ArrowLeft size={14} />
              <span>Back to All Collections</span>
            </Link>
          </div>

          <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light font-sans inline-flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Master Handloom Heritage</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-gold-light mt-2 drop-shadow">
            {sareeType ? sareeType.name : 'Saree Collection'}
          </h1>

          <div className="w-20 h-0.5 bg-brand-gold mx-auto my-4" />

          <p className="text-xs sm:text-sm text-brand-blush/90 max-w-2xl mx-auto leading-relaxed font-light">
            {sareeType?.description ||
              'Authentic royal drapes woven with master artisan finesse, certified silk mark guarantee, and centuries of South Indian tradition.'}
          </p>
        </div>

        <TempleBorder variant="gold" className="absolute bottom-0 inset-x-0" />
      </div>

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-brand-gold/30">
          <div className="text-xs sm:text-sm text-brand-charcoal/80 font-sans">
            Showing <strong className="text-brand-maroon font-bold">{sarees.length}</strong> master drapes in{' '}
            <span className="font-serif font-bold text-brand-maroon">{sareeType?.name || 'this collection'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-xs sm:text-sm bg-white border border-brand-gold/40 rounded-full px-3 py-1.5 focus:outline-none focus:border-brand-maroon shadow-sm cursor-pointer"
            >
              <option value="featured">Featured &amp; Royal Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Sarees Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-96 animate-pulse border border-brand-gold/20"
                />
              ))}
            </div>
          ) : sarees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {sarees.map((saree) => (
                <SareeCard
                  key={saree.id}
                  saree={saree}
                  onPrebook={(s) => setSelectedSareeForBooking(s)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-brand-gold/30 p-8 shadow-sm">
              <p className="font-serif text-lg font-bold text-brand-maroon-dark">
                New looms currently arriving for {sareeType?.name}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Our master weavers in Rayachoty are crafting fresh collections. Feel free to enquire directly on WhatsApp for upcoming arrivals.
              </p>
              <Link
                to="/sarees"
                className="mt-4 inline-block px-6 py-2 bg-brand-maroon text-brand-gold-light text-xs font-semibold rounded-full"
              >
                Browse Other Collections
              </Link>
            </div>
          )}
        </div>
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
