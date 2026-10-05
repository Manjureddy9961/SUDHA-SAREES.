import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, KeyRound, X, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../../lib/dataService';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function AdminLoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await loginAdmin(email.trim(), password);
      onClose();
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = () => {
    setEmail('admin@sudhasarees.com');
    setPassword('admin123');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-gold/50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-maroon-dark via-brand-maroon to-brand-maroon-dark text-brand-ivory px-6 py-5 flex items-center justify-between border-b border-brand-gold/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold-light border border-brand-gold/40">
                <Lock size={16} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-gold-light">
                  Sudha Sarees Portal
                </h3>
                <p className="text-[11px] text-brand-blush/80">Authorized Staff &amp; Administrator Access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-brand-gold-light/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Status notice */}
            {!isSupabaseConfigured() && (
              <div className="bg-brand-ivory border border-brand-gold/40 rounded-xl p-3 text-xs text-brand-charcoal">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-brand-maroon flex items-center gap-1">
                    <ShieldCheck size={14} className="text-brand-gold-dark" />
                    Preview Demo Mode Active
                  </span>
                  <button
                    type="button"
                    onClick={useDemoCredentials}
                    className="text-[10px] text-brand-maroon underline font-semibold hover:text-brand-maroon-dark"
                  >
                    Auto-Fill Demo
                  </button>
                </div>
                <p className="text-gray-600 text-[11px]">
                  Supabase keys not yet configured in <code className="bg-white px-1 py-0.5 rounded border text-[10px]">.env</code>. You can test the admin panel using demo credentials:
                </p>
                <div className="mt-1 font-mono text-[11px] text-brand-gold-dark">
                  admin@sudhasarees.com / admin123
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="admin@sudhasarees.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-brand-maroon focus:ring-1 focus:ring-brand-maroon outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark hover:from-brand-maroon-light hover:to-brand-maroon text-brand-gold-light text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg border border-brand-gold/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Authenticate &amp; Enter Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
