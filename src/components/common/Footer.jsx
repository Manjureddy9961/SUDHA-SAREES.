import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Clock, Mail, Heart, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';
import TempleBorder from './TempleBorder';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Namaste Sudha Sarees, I would like to inquire about your authentic saree collection.'
  )}`;

  return (
    <footer className="relative bg-brand-maroon-dark text-brand-ivory overflow-hidden mt-16 zari-border-top">
      {/* Traditional Temple Border Top Accent */}
      <TempleBorder variant="gold" className="text-brand-gold opacity-60" />

      {/* Background Royal Motif Watermark */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-20 translate-y-20">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#C9A24B" strokeWidth="2" />
          <path d="M50,10 C60,30 90,50 50,90 C10,50 40,30 50,10 Z" fill="#C9A24B" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Heritage */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs sm:text-sm text-brand-blush/80 leading-relaxed font-light mt-3">
              Weaving dreams and timeless bridal heirlooms since generations. Proudly preserving Andhra’s
              and South India’s rich handloom artistry directly from master weaver looms to your celebrations.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-peacock hover:bg-brand-peacock-light text-white text-xs font-semibold rounded-full shadow-md transition-all transform hover:scale-105"
              >
                <MessageSquare size={14} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-serif font-bold text-brand-gold-light tracking-widest uppercase mb-4 border-b border-brand-gold/30 pb-2">
              Signature Collections
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-ivory/80">
              <li>
                <Link to="/sarees/kanchipuram" className="hover:text-brand-gold-light transition">
                  Kanchipuram Bridal Silks
                </Link>
              </li>
              <li>
                <Link to="/sarees/banarasi" className="hover:text-brand-gold-light transition">
                  Banarasi Katan Brocades
                </Link>
              </li>
              <li>
                <Link to="/sarees/pochampally" className="hover:text-brand-gold-light transition">
                  Pochampally Double Ikkat
                </Link>
              </li>
              <li>
                <Link to="/sarees/dharmavaram" className="hover:text-brand-gold-light transition">
                  Dharmavaram Temple Weaves
                </Link>
              </li>
              <li>
                <Link to="/sarees/gadwal" className="hover:text-brand-gold-light transition">
                  Gadwal Handloom Silks
                </Link>
              </li>
              <li>
                <Link to="/sarees/organza" className="hover:text-brand-gold-light transition">
                  Designer Organza & Tissue
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Showroom Location & Timings */}
          <div>
            <h3 className="text-sm font-serif font-bold text-brand-gold-light tracking-widest uppercase mb-4 border-b border-brand-gold/30 pb-2">
              Rayachoty Showroom
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-brand-ivory/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={17} className="text-brand-gold-light flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Opposite New Police Station, Kadiri Road, Rayachoty, Annamayya District, Andhra Pradesh - 516269
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-brand-gold-light flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-brand-gold-light transition">
                  +91 98765 43210 / 08561-255890
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-brand-gold-light flex-shrink-0 mt-0.5" />
                <span>Mon - Sun: 9:30 AM &ndash; 9:30 PM (All 7 Days)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Silk Mark Guarantee */}
          <div>
            <h3 className="text-sm font-serif font-bold text-brand-gold-light tracking-widest uppercase mb-4 border-b border-brand-gold/30 pb-2">
              Privilege Circle
            </h3>
            <p className="text-xs text-brand-blush/80 mb-3">
              Subscribe to receive exclusive preview invitations for festive arrivals and bridal exhibitions.
            </p>

            {subscribed ? (
              <div className="bg-brand-peacock/60 border border-brand-gold/50 rounded-lg p-3 text-xs text-brand-ivory flex items-center gap-2">
                <CheckCircle2 size={16} className="text-brand-gold-light" />
                <span>Welcome to the Sudha Sarees royal circle!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-brand-gold/70" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-brand-maroon/60 border border-brand-gold/40 rounded-lg text-brand-ivory placeholder-brand-blush/50 focus:outline-none focus:border-brand-gold-light transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-brand-gold-light hover:to-brand-gold text-brand-maroon-dark text-xs font-bold uppercase tracking-wider rounded-lg shadow transition"
                >
                  Join Circle
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-brand-gold/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-brand-gold/60 flex items-center justify-center text-[10px] font-serif font-bold text-brand-gold-light bg-brand-maroon">
                SM
              </div>
              <span className="text-[11px] text-brand-gold-light/90">
                100% Certified Pure Silk & Handloom Authenticity Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-brand-gold/20 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-blush/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Sudha Sarees, Rayachoty. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Handcrafted with</span>
            <Heart size={12} className="text-brand-gold fill-brand-gold inline" />
            <span>for authentic Indian weaves</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
