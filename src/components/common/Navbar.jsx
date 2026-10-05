import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { fetchSareeTypes, getWishlist } from '../../lib/dataService';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [types, setTypes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();

  // Handle shrink on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch saree types for dropdown
  useEffect(() => {
    let isMounted = true;
    fetchSareeTypes().then((data) => {
      if (isMounted && data) setTypes(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Initial and reactive wishlist count
  useEffect(() => {
    getWishlist().then((list) => {
      if (list) setWishlistCount(list.length);
    });

    const handleWishlistUpdated = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setWishlistCount(e.detail.count);
      }
    };

    window.addEventListener('sudha-wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('sudha-wishlist-updated', handleWishlistUpdated);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-brand-maroon font-semibold'
        : 'text-brand-charcoal/80 hover:text-brand-maroon'
    }`;

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-brand-maroon-dark via-brand-maroon to-brand-maroon-dark text-brand-gold-light py-1.5 px-4 text-xs tracking-widest uppercase text-center font-medium border-b border-brand-gold/30">
        <span className="inline-flex items-center gap-2">
          <Sparkles size={13} className="text-brand-gold-light animate-pulse" />
          <span>Authentic Handloom Silks Direct from Master Weavers &bull; Rayachoty Showroom</span>
          <Sparkles size={13} className="text-brand-gold-light animate-pulse" />
        </span>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? 'glass-ivory shadow-lg py-2.5 border-b border-brand-gold/40'
            : 'bg-brand-ivory/95 py-4 border-b border-brand-gold/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <Logo size={isScrolled ? 'sm' : 'md'} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {/* Sarees Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <NavLink
                to="/sarees"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 ${navLinkClass({ isActive })}`
                }
              >
                <span>Sarees</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-brand-maroon' : 'text-gray-500'
                  }`}
                />
              </NavLink>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 mt-1 w-64 rounded-xl bg-white/95 backdrop-blur-md shadow-2xl border border-brand-gold/30 p-2 z-50 divide-y divide-brand-blush/40"
                  >
                    <div className="px-3 py-2 text-xs font-serif font-bold text-brand-maroon tracking-wider uppercase">
                      Shop by Weave & Tradition
                    </div>
                    <div className="py-1">
                      <Link
                        to="/sarees"
                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-brand-maroon hover:bg-brand-blush/40 rounded-lg transition"
                      >
                        <span>View All Sarees</span>
                        <span className="text-[10px] text-brand-gold-dark font-mono">EXPLORE</span>
                      </Link>
                      {types.map((type) => (
                        <Link
                          key={type.id}
                          to={`/sarees/${type.slug}`}
                          className="flex items-center justify-between px-3 py-2 text-xs text-brand-charcoal hover:text-brand-maroon hover:bg-brand-blush/30 rounded-lg transition"
                        >
                          <span>{type.name}</span>
                          <span className="text-[10px] text-gray-400 group-hover:text-brand-gold">
                            &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full text-brand-maroon hover:bg-brand-blush/50 transition-colors"
              title="Saved Sarees"
              aria-label="Wishlist"
            >
              <Heart size={21} className="stroke-[2]" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-brand-maroon text-brand-gold-light text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-ivory shadow-sm"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Pre-book CTA button (desktop) */}
            <Link
              to="/sarees"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-ivory bg-gradient-to-r from-brand-maroon to-brand-maroon-dark hover:from-brand-maroon-light hover:to-brand-maroon rounded-full shadow-md transition-all duration-300 hover:shadow-maroon-glow transform hover:-translate-y-0.5 border border-brand-gold/40"
            >
              <span>Explore Collection</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-brand-maroon hover:bg-brand-blush/50 rounded-lg transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-brand-ivory border-b border-brand-gold/30 shadow-2xl overflow-hidden z-30"
          >
            <div className="px-5 py-4 space-y-3">
              <Link
                to="/"
                className="block text-base font-medium text-brand-charcoal hover:text-brand-maroon"
              >
                Home
              </Link>
              <div>
                <Link
                  to="/sarees"
                  className="block text-base font-semibold text-brand-maroon"
                >
                  All Sarees & Weaves
                </Link>
                <div className="pl-4 mt-2 grid grid-cols-2 gap-2 border-l-2 border-brand-gold/30">
                  {types.map((type) => (
                    <Link
                      key={type.id}
                      to={`/sarees/${type.slug}`}
                      className="text-xs text-brand-charcoal/80 hover:text-brand-maroon py-1"
                    >
                      {type.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/about"
                className="block text-base font-medium text-brand-charcoal hover:text-brand-maroon"
              >
                About Our Heritage
              </Link>
              <Link
                to="/contact"
                className="block text-base font-medium text-brand-charcoal hover:text-brand-maroon"
              >
                Rayachoty Showroom & Contact
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-2 text-base font-medium text-brand-maroon pt-2 border-t border-brand-blush"
              >
                <Heart size={18} />
                <span>My Wishlist ({wishlistCount})</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
