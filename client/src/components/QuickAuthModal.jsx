import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function QuickAuthModal() {
  const { authModalOpen, authMode, setAuthMode, closeAuth, login, register, quickLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (authMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      const res = await register({ name, email, password, phone });
      if (!res.success) {
        setError(res.error);
      }
    }
    setLoading(false);
  };

  const handleDemo = async (role) => {
    setError('');
    setLoading(true);
    const res = await quickLogin(role);
    if (!res.success) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#ded8cb] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#f0ebe1] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-zinc-900">
              {authMode === 'login' ? 'Welcome to Gallerist' : 'Create Collector Account'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {authMode === 'login' 
                ? 'Sign in to access your collection, certificates, and orders' 
                : 'Join our certified art collector network'}
            </p>
          </div>
          <button
            onClick={closeAuth}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Demo Switcher Section */}
        <div className="p-6 bg-[#faf7f2] border-b border-[#f0ebe1] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b5e34] flex items-center gap-1">
              <Sparkles size={13} className="text-[#c59b27]" /> Instant 1-Click Demo Testing
            </span>
            <span className="text-[10px] text-zinc-400">Pre-seeded credentials</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="bg-[#2a2624] hover:bg-black text-white p-2.5 rounded-xl text-left border border-[#443e39] transition group shadow-sm"
            >
              <div className="font-semibold text-xs text-amber-300 flex items-center gap-1">
                <span>👑 Gallery Admin</span>
              </div>
              <p className="text-[10px] text-zinc-300 mt-0.5 leading-tight">
                Can upload artwork, manage orders & pricing
              </p>
            </button>

            <button
              onClick={() => handleDemo('buyer')}
              disabled={loading}
              className="bg-white hover:bg-zinc-50 text-zinc-800 p-2.5 rounded-xl text-left border border-[#ded8cb] transition group shadow-sm"
            >
              <div className="font-semibold text-xs text-[#8b5e34] flex items-center gap-1">
                <span>🎨 Art Collector</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                Can browse, buy paintings & view certificates
              </p>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#b59677] transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="collector@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#b59677] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#b59677] transition"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Phone Number (for shipping updates)
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="tel"
                  placeholder="+91 98000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#b59677] transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b5e34] hover:bg-[#724a25] text-white font-semibold text-sm py-3 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Gallerist' : 'Register Collector Profile'}
          </button>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-zinc-500">
            {authMode === 'login' ? (
              <p>
                New collector?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthMode('register');
                  }}
                  className="text-[#8b5e34] font-semibold hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthMode('login');
                  }}
                  className="text-[#8b5e34] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-start gap-2 text-[11px] text-zinc-400">
            <CheckCircle2 size={13} className="text-[#8b5e34] shrink-0 mt-0.5" />
            <span>
              <strong>Authenticity Assurance:</strong> Only verified gallery curators hold uploading permissions. Collectors enjoy curated buying with 100% money-back guarantee.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
