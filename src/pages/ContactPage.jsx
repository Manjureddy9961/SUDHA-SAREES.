import React, { useState, useRef } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Mail, Send, CheckCircle2, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import TempleBorder from '../components/common/TempleBorder';
import AdminLoginModal from '../components/admin/AdminLoginModal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Showroom Visit & Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // ========================================================
  // HIDDEN ADMIN LONG-PRESS LOGIC (2 SECONDS HOLD)
  // Mouse & Touch events on the "Send Message" button or Heritage Seal
  // ========================================================
  const [pressProgress, setPressProgress] = useState(0);
  const pressTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const startLongPress = () => {
    setPressProgress(0);
    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPressProgress(progress);
    }, 50);

    pressTimerRef.current = setTimeout(() => {
      clearInterval(progressIntervalRef.current);
      setPressProgress(0);
      if (navigator.vibrate) navigator.vibrate(50);
      setIsAdminModalOpen(true);
    }, duration);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setPressProgress(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Showroom Visit & Inquiry',
        message: ''
      });
    }, 6000);
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Namaste Sudha Sarees, I would like to enquire about your handloom saree collection and visit the Rayachoty showroom.'
  )}`;

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
      {/* Banner */}
      <div className="bg-brand-maroon-dark text-brand-ivory py-12 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light font-sans inline-flex items-center gap-1.5">
            <MapPin size={13} />
            <span>Rayachoty Landmark</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-gold-light mt-1">
            Visit Our Showroom &amp; Connect
          </h1>
          <p className="text-xs sm:text-sm text-brand-blush/80 mt-2 max-w-xl mx-auto">
            Experience the grandeur of handloom silks in person. We are located right in the heart of Rayachoty.
          </p>
        </div>
        <TempleBorder variant="gold" className="absolute bottom-0 inset-x-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ======================================================== */}
          {/* LEFT: STORE DETAILS & GOOGLE MAPS (LG: 7 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Showroom Information Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-brand-blush/80 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-maroon-dark">
                    Sudha Sarees Showroom
                  </h2>
                  <p className="text-xs text-brand-gold-dark font-medium">
                    Annamayya District Handloom Boutique
                  </p>
                </div>

                {/* Secret Long-Press Seal: Administrator Entrance */}
                <div
                  onMouseDown={startLongPress}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                  onTouchStart={startLongPress}
                  onTouchEnd={cancelLongPress}
                  className="relative group cursor-pointer select-none"
                  title="Seal of Authenticity"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-ivory border-2 border-brand-gold/60 flex items-center justify-center text-brand-maroon shadow-inner hover:scale-105 transition-transform">
                    <Shield size={22} className="text-brand-gold-dark" />
                  </div>
                  {/* Circular progress reveal ring for admin */}
                  {pressProgress > 0 && (
                    <svg className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none">
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="#C9A24B"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={138}
                        strokeDashoffset={138 - (138 * pressProgress) / 100}
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal/80">
                {/* Physical Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-blush flex items-center justify-center text-brand-maroon flex-shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-maroon-dark text-sm">Physical Address</h3>
                    <p className="mt-0.5 text-gray-700 leading-relaxed font-light">
                      Sudha Sarees, Opposite New Police Station,<br />
                      Kadiri Road, Rayachoty,<br />
                      Annamayya District, Andhra Pradesh &ndash; 516269
                    </p>
                  </div>
                </div>

                {/* Phone & Direct Calling */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-blush flex items-center justify-center text-brand-maroon flex-shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-maroon-dark text-sm">Direct Phone Enquiries</h3>
                    <p className="mt-0.5 text-gray-700">
                      <a href="tel:+919876543210" className="hover:text-brand-maroon font-medium">
                        +91 98765 43210
                      </a>
                      {' '}&bull;{' '}
                      <a href="tel:08561255890" className="hover:text-brand-maroon font-medium">
                        08561-255890
                      </a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp Click-to-Chat */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-maroon-dark text-sm">WhatsApp Video &amp; Orders</h3>
                    <p className="mt-0.5 text-gray-700">Instant video consultations and order inquiries.</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-peacock hover:bg-brand-peacock-light text-white text-xs font-semibold rounded-full shadow transition"
                    >
                      <span>Chat Directly on WhatsApp</span>
                      &rarr;
                    </a>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-blush flex items-center justify-center text-brand-maroon flex-shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-maroon-dark text-sm">Showroom Timings</h3>
                    <p className="mt-0.5 text-gray-700">
                      Open 7 Days a Week: <strong>9:30 AM &ndash; 9:30 PM</strong>
                    </p>
                    <p className="text-[11px] text-gray-500">Bridal appointments available on request.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-3xl overflow-hidden border border-brand-gold/30 shadow-md">
              <div className="p-4 bg-brand-ivory border-b border-brand-gold/20 flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-brand-maroon-dark">
                  Rayachoty Showroom Location Map
                </span>
                <a
                  href="https://maps.google.com/?q=Rayachoty+Kadiri+Road+Opposite+New+Police+Station"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-maroon hover:underline font-semibold"
                >
                  Open in Google Maps &rarr;
                </a>
              </div>
              <div className="aspect-[16/9] w-full bg-gray-100">
                <iframe
                  title="Sudha Sarees Rayachoty Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15478.718012435773!2d78.74088926977538!3d14.053229600000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb396e95aa0bfa1%3A0x6b6c0852e698ea06!2sRayachoty%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: MESSAGE ENQUIRY FORM (LG: 5 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-md">
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark font-sans">
                Get in Touch
              </span>
              <h2 className="font-serif text-2xl font-bold text-brand-maroon-dark mt-1">
                Send Us a Message
              </h2>
              <p className="text-xs text-brand-charcoal/70 mt-1 mb-6">
                Have questions about specific weaves, custom kuchu work, or trousseau appointments? Send a note to our team.
              </p>

              {submitted ? (
                <div className="bg-brand-ivory rounded-2xl p-6 border border-brand-gold/40 text-center space-y-3">
                  <div className="w-12 h-12 bg-brand-blush rounded-full flex items-center justify-center text-brand-maroon mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-maroon-dark">
                    Message Received!
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Thank you for writing to Sudha Sarees. Our customer support consultant in Rayachoty will respond to you shortly via phone or WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Your Name <span className="text-brand-maroon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Devi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Phone Number <span className="text-brand-maroon">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 94400 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. radhika@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Enquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition bg-white"
                    >
                      <option value="Showroom Visit & Inquiry">Showroom Visit &amp; Inquiry</option>
                      <option value="Bridal Muhurtham Trousseau">Bridal Muhurtham Trousseau</option>
                      <option value="Pre-Booking Question">Pre-Booking Question</option>
                      <option value="Custom Kuchu & Blouse Stitching">Custom Kuchu &amp; Blouse Stitching</option>
                      <option value="Courier / Outstation Delivery">Courier / Outstation Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Your Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="How can we assist you with your saree choices?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                    />
                  </div>

                  {/* Send Button: Also configured with 2-second hold trigger for Admin */}
                  <div className="pt-2 relative">
                    <button
                      type="submit"
                      onMouseDown={startLongPress}
                      onMouseUp={cancelLongPress}
                      onMouseLeave={cancelLongPress}
                      onTouchStart={startLongPress}
                      onTouchEnd={cancelLongPress}
                      className="relative overflow-hidden w-full py-3 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark hover:from-brand-maroon-light hover:to-brand-maroon text-brand-gold-light text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg border border-brand-gold/40 transition flex items-center justify-center gap-2 select-none"
                    >
                      {/* Visual progress overlay when holding down */}
                      {pressProgress > 0 && (
                        <div
                          className="absolute inset-0 bg-brand-gold/40 transition-all duration-75"
                          style={{ width: `${pressProgress}%` }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        <Send size={14} />
                        <span>Send Message</span>
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Modal (Triggered by 2-second long press) */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
