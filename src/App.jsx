import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';

import HomePage from './pages/HomePage';
import SareesPage from './pages/SareesPage';
import SareeTypePage from './pages/SareeTypePage';
import SareeDetailPage from './pages/SareeDetailPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Route transition animation definition
const pageVariants = {
  initial: {
    opacity: 0,
    y: 12
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

function AnimatedRouteWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 w-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-brand-ivory text-brand-charcoal selection:bg-brand-gold selection:text-brand-maroon-dark">
      <ScrollToTop />

      {/* Show standard public navbar on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      {/* Main Animated Viewport */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedRouteWrapper>
                  <HomePage />
                </AnimatedRouteWrapper>
              }
            />
            <Route
              path="/sarees"
              element={
                <AnimatedRouteWrapper>
                  <SareesPage />
                </AnimatedRouteWrapper>
              }
            />
            <Route
              path="/sarees/:typeSlug"
              element={
                <AnimatedRouteWrapper>
                  <SareeTypePage />
                </AnimatedRouteWrapper>
              }
            />
            <Route
              path="/saree/:sareeId"
              element={
                <AnimatedRouteWrapper>
                  <SareeDetailPage />
                </AnimatedRouteWrapper>
              }
            />
            <Route
              path="/wishlist"
              element={
                <AnimatedRouteWrapper>
                  <WishlistPage />
                </AnimatedRouteWrapper>
              }
            />
            <Route
              path="/about"
              element={
                <AnimatedRouteWrapper>
                  <AboutPage />
                </AnimatedRouteWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <AnimatedRouteWrapper>
                  <ContactPage />
                </AnimatedRouteWrapper>
              }
            />
            <Route
              path="/admin"
              element={
                <AnimatedRouteWrapper>
                  <AdminDashboardPage />
                </AnimatedRouteWrapper>
              }
            />
            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <AnimatedRouteWrapper>
                  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                    <h2 className="font-serif text-3xl font-bold text-brand-maroon-dark">
                      Page Not Found
                    </h2>
                    <p className="text-xs text-gray-500 mt-2">
                      The drape you are seeking may have moved to a different loom.
                    </p>
                    <a
                      href="/"
                      className="mt-4 px-6 py-2 bg-brand-maroon text-brand-gold-light text-xs font-semibold rounded-full shadow"
                    >
                      Return Home
                    </a>
                  </div>
                </AnimatedRouteWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Show standard public footer on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
