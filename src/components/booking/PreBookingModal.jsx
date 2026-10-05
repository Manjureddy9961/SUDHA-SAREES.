import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, Phone, User, Mail, MapPin, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createPrebooking, uploadMediaFile } from '../../lib/dataService';

export default function PreBookingModal({
  isOpen,
  onClose,
  saree
}) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    preferred_date: '',
    notes: ''
  });

  const [referenceFile, setReferenceFile] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !saree) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Reference photo should be less than 5MB');
        return;
      }
      setReferenceFile(file);
      const reader = new FileReader();
      reader.onload = () => setReferencePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim() || !formData.customer_phone.trim()) {
      setErrorMsg('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedReferenceUrl = null;
      if (referenceFile) {
        uploadedReferenceUrl = await uploadMediaFile(referenceFile, 'prebooking-references');
      }

      const sareeImage =
        (Array.isArray(saree.images) && saree.images.length > 0
          ? saree.images[0]
          : saree.cover_image_url) || '';

      const bookingRecord = {
        saree_id: saree.id,
        saree_name: saree.name,
        saree_image_url: sareeImage,
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || null,
        customer_address: formData.customer_address.trim() || null,
        preferred_date: formData.preferred_date || null,
        notes: formData.notes.trim() || null,
        reference_image_url: uploadedReferenceUrl
      };

      const result = await createPrebooking(bookingRecord);
      setSubmittedBooking(result);

      // Trigger royal gold & rose celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A24B', '#7B1E3A', '#DFC06C', '#F7E1E7']
      });
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg('Could not submit booking. Please try again or reach us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedBooking(null);
    setFormData({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      customer_address: '',
      preferred_date: '',
      notes: ''
    });
    setReferenceFile(null);
    setReferencePreview(null);
    setErrorMsg('');
    onClose();
  };

  const sareeImage =
    (Array.isArray(saree.images) && saree.images.length > 0
      ? saree.images[0]
      : saree.cover_image_url) || '';

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const confirmationWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Namaste Sudha Sarees, I have submitted a pre-booking request for "${saree.name}" (ID: ${
      submittedBooking?.id || 'New'
    }). My name is ${formData.customer_name}.`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-gold/40 overflow-hidden my-6"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-brand-maroon-dark via-brand-maroon to-brand-maroon-dark text-brand-ivory px-6 py-5 flex items-center justify-between border-b border-brand-gold/40">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-gold-light" />
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-gold-light">
                  Pre-Book This Saree
                </h3>
                <p className="text-xs text-brand-blush/80">
                  Hold at Rayachoty Showroom &bull; Personal Video Consultation Available
                </p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="text-brand-gold-light/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              aria-label="Close dialog"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {submittedBooking ? (
              /* Success Confirmation View */
              <div className="text-center py-8 px-4 space-y-5">
                <div className="w-16 h-16 bg-brand-blush rounded-full mx-auto flex items-center justify-center text-brand-maroon shadow-inner">
                  <CheckCircle size={36} className="text-brand-maroon" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-brand-maroon-dark">
                  Pre-booking Confirmed!
                </h4>
                <p className="text-sm text-brand-charcoal/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-brand-maroon">{submittedBooking.customer_name}</span>.
                  Your request for <span className="font-semibold">{submittedBooking.saree_name}</span> has been
                  received. Our bridal consultant will reach you shortly on{' '}
                  <span className="font-semibold">{submittedBooking.customer_phone}</span> to finalize your viewing date.
                </p>

                <div className="p-4 bg-brand-ivory rounded-2xl border border-brand-gold/30 text-xs text-brand-charcoal/80 max-w-sm mx-auto text-left space-y-1">
                  <div>
                    <span className="text-gray-500">Booking Ref:</span>{' '}
                    <span className="font-mono font-bold text-brand-maroon">{submittedBooking.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Saree:</span> {submittedBooking.saree_name}
                  </div>
                  {submittedBooking.preferred_date && (
                    <div>
                      <span className="text-gray-500">Preferred Date:</span> {submittedBooking.preferred_date}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <a
                    href={confirmationWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 bg-brand-peacock hover:bg-brand-peacock-light text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>Instant WhatsApp Connect</span>
                  </a>
                  <button
                    onClick={handleResetAndClose}
                    className="w-full sm:w-auto px-6 py-2.5 bg-brand-maroon text-brand-gold-light hover:bg-brand-maroon-dark text-xs font-semibold rounded-xl shadow-md transition"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            ) : (
              /* Pre-booking Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Saree Summary Card */}
                <div className="flex items-center gap-4 p-3.5 bg-brand-ivory rounded-2xl border border-brand-gold/30">
                  {sareeImage && (
                    <img
                      src={sareeImage}
                      alt={saree.name}
                      className="w-16 h-20 object-cover rounded-xl border border-brand-gold/20 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-brand-gold-dark uppercase tracking-wider">
                      {saree.fabric}
                    </span>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-brand-maroon-dark truncate">
                      {saree.name}
                    </h4>
                    <p className="text-sm font-bold text-brand-maroon mt-0.5">
                      ₹{Number(saree.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Full Name <span className="text-brand-maroon">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sravani Rao"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      WhatsApp / Mobile <span className="text-brand-maroon">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98480 12345"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        placeholder="e.g. sravani@example.com"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                      Preferred Date for Viewing / Delivery
                    </label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        value={formData.preferred_date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* City / Address */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Your City / Delivery Address
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Rayachoty, Kadapa, or Bangalore"
                      value={formData.customer_address}
                      onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                    />
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Custom Requests &amp; Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Please add zari tassels (kuchu), saree falls & pico, or schedule a live video call."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                  />
                </div>

                {/* Optional Reference Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                    Upload Reference / Blouse Inspiration Photo{' '}
                    <span className="text-gray-400 font-normal">(Optional, max 5MB)</span>
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-3 border-2 border-dashed border-brand-gold/50 rounded-xl hover:bg-brand-blush/20 transition">
                      <Upload size={18} className="text-brand-gold-dark mb-1" />
                      <span className="text-xs text-brand-maroon font-medium">
                        {referenceFile ? referenceFile.name : 'Click to select reference image'}
                      </span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {referencePreview && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-brand-gold/40 flex-shrink-0">
                        <img
                          src={referencePreview}
                          alt="Reference preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setReferenceFile(null);
                            setReferencePreview(null);
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark hover:from-brand-maroon-light hover:to-brand-maroon text-brand-gold-light text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg border border-brand-gold/40 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Confirm Pre-Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
