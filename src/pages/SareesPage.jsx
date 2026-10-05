import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SareeCard from '../components/common/SareeCard';
import PreBookingModal from '../components/booking/PreBookingModal';
import TempleBorder from '../components/common/TempleBorder';
import { fetchSarees, fetchSareeTypes } from '../lib/dataService';

export default function SareesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sarees, setSarees] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSareeForBooking, setSelectedSareeForBooking] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [priceSort, setPriceSort] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(40000);

  // Load types
  useEffect(() => {
    fetchSareeTypes().then((data) => setTypes(data));
  }, []);

  // Sync url param if present
  useEffect(() => {
    const urlType = searchParams.get('type');
    if (urlType) {
      setSelectedType(urlType);
    }
  }, [searchParams]);

  // Load Sarees based on filters
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const typeSlug = selectedType !== 'all' ? selectedType : undefined;

    fetchSarees({
      typeSlug,
      fabric: selectedFabric !== 'all' ? selectedFabric : undefined,
      color: selectedColor !== 'all' ? selectedColor : undefined,
      search: search.trim() || undefined,
      sort: priceSort,
      inStockOnly,
      maxPrice
    }).then((data) => {
      if (isMounted) {
        setSarees(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedType, selectedFabric, selectedColor, search, priceSort, inStockOnly, maxPrice]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedFabric('all');
    setSelectedColor('all');
    setPriceSort('featured');
    setInStockOnly(false);
    setMaxPrice(40000);
    setSearchParams({});
  };

  const fabrics = [
    'Pure Mulberry Silk',
    'Pure Katan Silk',
    'Handloom Pure Silk',
    'Gadwal Mulberry Silk',
    'Dharmavaram Pure Silk',
    'Pure Silk Organza',
    'Pure Chanderi'
  ];

  const colors = [
    'Maroon',
    'Gold',
    'Magenta',
    'Teal',
    'Ivory',
    'Plum',
    'Green',
    'Peach'
  ];

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
      {/* Header Banner */}
      <div className="bg-brand-maroon-dark text-brand-ivory py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light">
            Heirloom Handlooms
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-gold-light mt-1">
            The Saree Collection
          </h1>
          <p className="text-xs sm:text-sm text-brand-blush/80 mt-2 max-w-xl mx-auto">
            Explore authentic handlooms, certified pure silks, and royal bridal weaves curated with love in Rayachoty.
          </p>
        </div>
        <TempleBorder variant="gold" className="absolute bottom-0 inset-x-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Control Bar: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-brand-gold/30">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-brand-gold-dark" />
            <input
              type="text"
              placeholder="Search by saree weave, color, or fabric..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-brand-gold/40 rounded-full focus:outline-none focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon transition shadow-sm"
            />
          </div>

          {/* Right Controls: Sort & Mobile Filter Toggle */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-white border border-brand-gold/40 rounded-full text-xs font-semibold text-brand-maroon shadow-sm"
            >
              <Filter size={14} />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Sort by:</span>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="text-xs sm:text-sm bg-white border border-brand-gold/40 rounded-full px-3 py-1.5 focus:outline-none focus:border-brand-maroon text-brand-charcoal shadow-sm cursor-pointer"
              >
                <option value="featured">Featured &amp; Royal Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area: Filter Sidebar + Products Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-brand-gold/30 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-brand-blush">
                <h3 className="font-serif font-bold text-base text-brand-maroon-dark flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-brand-gold-dark" />
                  <span>Refine Saree Weaves</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-brand-maroon hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Saree Type Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold-dark mb-2">
                  Weave / Category
                </label>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-brand-maroon">
                    <input
                      type="radio"
                      name="sareeType"
                      checked={selectedType === 'all'}
                      onChange={() => setSelectedType('all')}
                      className="accent-brand-maroon"
                    />
                    <span>All Traditions</span>
                  </label>
                  {types.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 cursor-pointer hover:text-brand-maroon"
                    >
                      <input
                        type="radio"
                        name="sareeType"
                        checked={selectedType === t.slug}
                        onChange={() => setSelectedType(t.slug)}
                        className="accent-brand-maroon"
                      />
                      <span>{t.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fabric Filter */}
              <div className="pt-4 border-t border-brand-blush/60">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold-dark mb-2">
                  Fabric Authenticity
                </label>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-brand-maroon">
                    <input
                      type="radio"
                      name="fabric"
                      checked={selectedFabric === 'all'}
                      onChange={() => setSelectedFabric('all')}
                      className="accent-brand-maroon"
                    />
                    <span>All Fabrics</span>
                  </label>
                  {fabrics.map((f) => (
                    <label
                      key={f}
                      className="flex items-center gap-2 cursor-pointer hover:text-brand-maroon"
                    >
                      <input
                        type="radio"
                        name="fabric"
                        checked={selectedFabric === f}
                        onChange={() => setSelectedFabric(f)}
                        className="accent-brand-maroon"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="pt-4 border-t border-brand-blush/60">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold-dark mb-2">
                  Palette Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedColor('all')}
                    className={`px-2.5 py-1 rounded-full text-xs border transition ${
                      selectedColor === 'all'
                        ? 'bg-brand-maroon text-brand-gold-light border-brand-maroon'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-maroon'
                    }`}
                  >
                    All
                  </button>
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition ${
                        selectedColor === c
                          ? 'bg-brand-maroon text-brand-gold-light border-brand-maroon'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-brand-maroon'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-brand-blush/60">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-gold-dark mb-2">
                  <span>Max Price</span>
                  <span className="text-brand-maroon font-sans">
                    ₹{Number(maxPrice).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={45000}
                  step={1000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-maroon cursor-pointer"
                />
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-brand-blush/60">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium hover:text-brand-maroon">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-brand-maroon rounded"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.25 }}
                  className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-serif font-bold text-lg text-brand-maroon-dark">
                      Filter Sarees
                    </h3>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="text-gray-500 font-bold text-sm"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Saree Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold-dark mb-2">
                      Weave / Category
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full text-xs p-2 border rounded-lg"
                    >
                      <option value="all">All Traditions</option>
                      {types.map((t) => (
                        <option key={t.id} value={t.slug}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fabric */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold-dark mb-2">
                      Fabric
                    </label>
                    <select
                      value={selectedFabric}
                      onChange={(e) => setSelectedFabric(e.target.value)}
                      className="w-full text-xs p-2 border rounded-lg"
                    >
                      <option value="all">All Fabrics</option>
                      {fabrics.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Max Price */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Max Price:</span>
                      <span className="font-bold text-brand-maroon">
                        ₹{Number(maxPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={45000}
                      step={1000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-brand-maroon"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={handleResetFilters}
                      className="w-1/2 py-2 border rounded-xl text-xs font-semibold"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="w-1/2 py-2 bg-brand-maroon text-white rounded-xl text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-96 animate-pulse border border-brand-gold/20"
                  />
                ))}
              </div>
            ) : sarees.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4 text-xs text-gray-500 font-sans">
                  <span>
                    Showing <strong className="text-brand-maroon">{sarees.length}</strong> master weaves
                  </span>
                  {selectedType !== 'all' && (
                    <span className="text-brand-gold-dark font-semibold">
                      Filtered by: {types.find((t) => t.slug === selectedType)?.name}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {sarees.map((saree) => (
                    <SareeCard
                      key={saree.id}
                      saree={saree}
                      onPrebook={(s) => setSelectedSareeForBooking(s)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-brand-gold/30 p-8 shadow-sm">
                <Sparkles size={36} className="text-brand-gold mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-brand-maroon-dark">
                  No Sarees Found
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  We couldn't find any sarees matching your selected filter criteria. Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-6 py-2.5 bg-brand-maroon text-brand-gold-light text-xs font-semibold rounded-full shadow hover:bg-brand-maroon-dark transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
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
