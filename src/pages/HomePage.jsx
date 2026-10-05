import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Award, Truck, Check, Star } from 'lucide-react';
import Logo from '../components/common/Logo';
import TempleBorder from '../components/common/TempleBorder';
import FloatingPetals from '../components/common/FloatingPetals';
import SareeCard from '../components/common/SareeCard';
import PreBookingModal from '../components/booking/PreBookingModal';
import { fetchSarees, fetchSareeTypes } from '../lib/dataService';

// Hero slideshow images
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
    title: 'Pure Kanchipuram Bridal Silks',
    subtitle: 'Woven with authentic gold zari & ancient temple artistry'
  },
  {
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=85',
    title: 'Varanasi Brocade Heirlooms',
    subtitle: 'Royal Mughal jaals and timeless kadwa silk craftsmanship'
  },
  {
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=85',
    title: 'Pochampally Double Ikkat',
    subtitle: 'Vibrant geometric poetry woven in pure handloom silk'
  }
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredSarees, setFeaturedSarees] = useState([]);
  const [sareeTypes, setSareeTypes] = useState([]);
  const [selectedSareeForBooking, setSelectedSareeForBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Slideshow automatic timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data
  useEffect(() => {
    fetchSarees({ featuredOnly: true }).then((data) => setFeaturedSarees(data.slice(0, 6)));
    fetchSareeTypes().then((types) => setSareeTypes(types));
  }, []);

  const brandName = "Sudha Sarees";
  const brandLetters = Array.from(brandName);

  const filteredFeatured = activeTab === 'all'
    ? featuredSarees
    : activeTab === 'bridal'
    ? featuredSarees.filter(s => s.attributes?.occasion?.toLowerCase().includes('bridal'))
    : featuredSarees.filter(s => !s.attributes?.occasion?.toLowerCase().includes('bridal'));

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal overflow-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION WITH ANIMATED LOGO, FLOATING PETALS & PARALLAX */}
      {/* ======================================================== */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-brand-maroon-dark overflow-hidden">
        {/* Floating Petals Particle Canvas */}
        <FloatingPetals count={24} />

        {/* Parallax Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.38, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_SLIDES[activeSlide].image}')` }}
            />
          </AnimatePresence>
          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/60 to-brand-maroon-dark/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-brand-maroon-dark/40 to-brand-maroon-dark" />
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center flex flex-col items-center">
          {/* Animated SVG Monogram Logo with Drawing Effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6"
          >
            <Logo size="hero" variant="light" showWordmark={false} animateDraw={true} />
          </motion.div>

          {/* Letter-by-letter Brand Reveal */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3">
            {brandLetters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + index * 0.06,
                  ease: 'easeOut'
                }}
                className={`font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide ${
                  char === ' ' ? 'w-3' : 'gold-gradient-text drop-shadow-[0_4px_12px_rgba(201,162,75,0.4)]'
                }`}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle / Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            className="text-brand-blush/90 text-sm sm:text-lg md:text-xl font-light tracking-widest uppercase max-w-2xl mx-auto font-sans"
          >
            Timeless Bridal Silks &amp; Handloom Weaves &bull; Rayachoty
          </motion.p>

          {/* Dynamic Slide Caption */}
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-brand-gold/30 text-xs sm:text-sm text-brand-gold-light font-serif italic inline-flex items-center gap-2"
          >
            <Sparkles size={13} className="text-brand-gold-light" />
            <span>{HERO_SLIDES[activeSlide].title} &ndash; {HERO_SLIDES[activeSlide].subtitle}</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.6 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              to="/sarees"
              className="relative group overflow-hidden px-8 py-3.5 rounded-full text-brand-maroon-dark bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark font-sans text-xs sm:text-sm font-bold uppercase tracking-widest shadow-gold-glow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-brand-gold-light"
            >
              {/* Shimmer sweep effect */}
              <span className="absolute inset-0 w-full h-full gold-shimmer opacity-40 pointer-events-none" />
              <span className="relative flex items-center gap-2">
                <span>Explore Sarees</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full text-brand-gold-light border-2 border-brand-gold/60 hover:border-brand-gold hover:bg-brand-maroon/60 backdrop-blur-sm font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Visit Rayachoty Showroom
            </Link>
          </motion.div>

          {/* Slide dots */}
          <div className="mt-10 flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeSlide === idx ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-gold/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Temple Border */}
        <div className="absolute bottom-0 inset-x-0">
          <TempleBorder variant="gold" />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. INFINITE MARQUEE OF SAREE WEAVES */}
      {/* ======================================================== */}
      <section className="bg-brand-maroon py-3 border-y border-brand-gold/40 overflow-hidden select-none">
        <div className="flex w-max animate-marquee space-x-8 text-brand-gold-light text-xs sm:text-sm font-serif tracking-widest uppercase">
          {[...sareeTypes, ...sareeTypes, ...sareeTypes].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-8">
              <span>{item.name}</span>
              <span className="text-brand-gold text-xs">&diams;</span>
              <span>100% Pure Mulberry Silk</span>
              <span className="text-brand-gold text-xs">&diams;</span>
              <span>Rayachoty Master Weaves</span>
              <span className="text-brand-gold text-xs">&diams;</span>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED SAREES SECTION */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark font-sans">
            Curated Royal Weaves
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-maroon-dark mt-2">
            Signature Masterpieces
          </h2>
          <div className="w-24 h-0.5 bg-brand-gold mx-auto my-4" />
          <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-light">
            Each drape in our collection is an ode to centuries of artisan dedication, woven with pure silk
            threads and certified zari work for your grandest moments.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 inline-flex p-1 bg-brand-blush/40 rounded-full border border-brand-gold/30">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'all'
                  ? 'bg-brand-maroon text-brand-gold-light shadow'
                  : 'text-brand-maroon hover:text-brand-maroon-dark'
              }`}
            >
              All Masterpieces
            </button>
            <button
              onClick={() => setActiveTab('bridal')}
              className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'bridal'
                  ? 'bg-brand-maroon text-brand-gold-light shadow'
                  : 'text-brand-maroon hover:text-brand-maroon-dark'
              }`}
            >
              Bridal Muhurtham
            </button>
            <button
              onClick={() => setActiveTab('festive')}
              className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'festive'
                  ? 'bg-brand-maroon text-brand-gold-light shadow'
                  : 'text-brand-maroon hover:text-brand-maroon-dark'
              }`}
            >
              Festive &amp; Receptions
            </button>
          </div>
        </div>

        {/* Sarees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFeatured.map((saree) => (
            <SareeCard
              key={saree.id}
              saree={saree}
              onPrebook={(s) => setSelectedSareeForBooking(s)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/sarees"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-ivory border-2 border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-brand-ivory text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full shadow-md transition-all duration-300"
          >
            <span>View Complete Collection</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SHOP BY TYPE / WEAVE SHOWCASE */}
      {/* ======================================================== */}
      <section className="bg-brand-blush-soft py-20 border-y border-brand-gold/30 relative">
        <TempleBorder variant="gold" className="absolute top-0 inset-x-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark font-sans">
              Handloom Varieties
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-maroon-dark mt-2">
              Explore by Tradition &amp; Weave
            </h2>
            <div className="w-24 h-0.5 bg-brand-gold mx-auto my-4" />
            <p className="text-xs sm:text-sm text-brand-charcoal/70">
              From the temple gopurams of Kanchipuram to the geometric ikkat of Pochampally and regal Banarasi jaals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {sareeTypes.map((type) => (
              <Link
                key={type.id}
                to={`/sarees/${type.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-brand-gold/30 aspect-[3/4] flex flex-col justify-end p-4 transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={type.cover_image_url}
                  alt={type.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/40 to-transparent" />

                <div className="relative z-10 text-left">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-gold-light group-hover:text-white transition">
                    {type.name}
                  </h3>
                  <p className="text-[11px] text-brand-blush/80 line-clamp-2 mt-1 font-light">
                    {type.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-gold-light mt-2 group-hover:translate-x-1 transition-transform">
                    <span>Explore Weaves</span>
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <TempleBorder variant="gold" className="absolute bottom-0 inset-x-0" flip={true} />
      </section>

      {/* ======================================================== */}
      {/* 5. WHY CHOOSE SUDHA SAREES & ANIMATED METRICS */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark font-sans">
            The Sudha Distinction
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-maroon-dark mt-2">
            Why Generations Trust Sudha Sarees
          </h2>
          <div className="w-24 h-0.5 bg-brand-gold mx-auto my-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-brand-gold/30 shadow-md text-center hover:border-brand-gold transition duration-300">
            <div className="w-14 h-14 bg-brand-blush rounded-2xl mx-auto flex items-center justify-center text-brand-maroon mb-4">
              <Award size={28} className="text-brand-maroon" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-maroon-dark mb-2">
              100% Certified Silk Mark
            </h3>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed">
              Every pure silk saree is rigorously tested and stamped with authentic Silk Mark certification.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-brand-gold/30 shadow-md text-center hover:border-brand-gold transition duration-300">
            <div className="w-14 h-14 bg-brand-blush rounded-2xl mx-auto flex items-center justify-center text-brand-maroon mb-4">
              <HeartHandshake size={28} className="text-brand-maroon" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-maroon-dark mb-2">
              Direct Weaver Pricing
            </h3>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed">
              Bypassing middlemen to source directly from master handloom cooperatives across South India.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-brand-gold/30 shadow-md text-center hover:border-brand-gold transition duration-300">
            <div className="w-14 h-14 bg-brand-blush rounded-2xl mx-auto flex items-center justify-center text-brand-maroon mb-4">
              <Sparkles size={28} className="text-brand-maroon" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-maroon-dark mb-2">
              Custom Finishing &amp; Kuchu
            </h3>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed">
              Complimentary falls, pico, and hand-knotted bridal zari tassels tailored to your desires.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-brand-gold/30 shadow-md text-center hover:border-brand-gold transition duration-300">
            <div className="w-14 h-14 bg-brand-blush rounded-2xl mx-auto flex items-center justify-center text-brand-maroon mb-4">
              <Truck size={28} className="text-brand-maroon" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-maroon-dark mb-2">
              Rayachoty &amp; Worldwide
            </h3>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed">
              In-person VIP showroom trial, plus insured door-to-door courier delivery worldwide.
            </p>
          </div>
        </div>

        {/* Animated Metrics Bar */}
        <div className="mt-16 bg-gradient-to-r from-brand-maroon-dark via-brand-maroon to-brand-maroon-dark rounded-3xl p-8 text-brand-ivory border border-brand-gold/50 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold-light">35+</div>
            <div className="text-xs uppercase tracking-wider text-brand-blush/80 mt-1">Years of Trust</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold-light">50,000+</div>
            <div className="text-xs uppercase tracking-wider text-brand-blush/80 mt-1">Happy Brides Draped</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold-light">500+</div>
            <div className="text-xs uppercase tracking-wider text-brand-blush/80 mt-1">Master Weaver Looms</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold-light">100%</div>
            <div className="text-xs uppercase tracking-wider text-brand-blush/80 mt-1">Pure Silk Certified</div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TESTIMONIALS & BRIDE STORIES */}
      {/* ======================================================== */}
      <section className="bg-brand-ivory-warm py-20 border-t border-brand-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark font-sans">
              Words of Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-maroon-dark mt-2">
              Stories from Our Brides &amp; Families
            </h2>
            <div className="w-24 h-0.5 bg-brand-gold mx-auto my-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-brand-gold/30 shadow-md relative">
              <div className="flex items-center gap-1 text-brand-gold mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#C9A24B" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed italic font-light">
                &ldquo;We travelled from Kadapa specially to Sudha Sarees in Rayachoty for my wedding muhurtham. The Kanchipuram silk with pure gold zari was truly majestic. Everyone at the wedding asked where we bought it!&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-brand-blush/60">
                <h4 className="font-serif font-bold text-sm text-brand-maroon-dark">Sravani &amp; Rajesh</h4>
                <p className="text-[11px] text-gray-500">Rayachoty, Bridal Muhurtham</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-gold/30 shadow-md relative">
              <div className="flex items-center gap-1 text-brand-gold mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#C9A24B" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed italic font-light">
                &ldquo;The pre-booking option made our shopping experience so effortless. They kept the Banarasi brocade reserved for our family visit, and the staff treated us like royalty. Truly the best saree showroom in Rayachoty.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-brand-blush/60">
                <h4 className="font-serif font-bold text-sm text-brand-maroon-dark">Anuradha Devi</h4>
                <p className="text-[11px] text-gray-500">Madanapalle, Family Function</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-gold/30 shadow-md relative">
              <div className="flex items-center gap-1 text-brand-gold mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#C9A24B" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed italic font-light">
                &ldquo;Their Pochampally ikkat collection has the most vibrant color combinations I have ever seen. Certified pure silk and very reasonable prices compared to big city stores.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-brand-blush/60">
                <h4 className="font-serif font-bold text-sm text-brand-maroon-dark">Haritha V.</h4>
                <p className="text-[11px] text-gray-500">Bangalore (Native of Rayachoty)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. PRE-BOOKING CALL TO ACTION BANNER */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-maroon-dark via-brand-maroon to-brand-maroon-dark p-8 sm:p-12 text-center text-brand-ivory border-2 border-brand-gold/50 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#C9A24B" strokeWidth="4" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/20 text-brand-gold-light text-xs font-semibold uppercase tracking-wider border border-brand-gold/40">
              <Sparkles size={13} />
              <span>Personalized Showroom Experience</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold-light">
              Plan Your Dream Wedding Trousseau
            </h2>
            <p className="text-xs sm:text-sm text-brand-blush/90 leading-relaxed">
              Pre-book your favorite heirloom saree today or schedule a one-on-one bridal styling appointment
              at our Rayachoty showroom. We reserve your selection exclusively for you.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/sarees"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-brand-gold-light hover:to-brand-gold text-brand-maroon-dark text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full shadow-lg transition transform hover:-translate-y-0.5"
              >
                Browse Sarees &amp; Pre-book
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3 border border-brand-gold-light text-brand-gold-light hover:bg-white/10 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full transition"
              >
                Showroom Directions
              </Link>
            </div>
          </div>
        </div>
      </section>

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
