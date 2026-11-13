import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        if (data.devResetLink) setDevLink(data.devResetLink);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 mb-8 transition">
          <ArrowLeft size={14} />
          <span>Back to Gallerist</span>
        </Link>

        <div className="bg-white rounded-2xl border border-[#ded8cb] shadow-xl overflow-hidden">
          <div className="bg-[#1c1917] px-6 py-5">
            <h1 className="font-serif text-xl font-bold text-white">Reset Your Password</h1>
            <p className="text-xs text-zinc-400 mt-1">Enter your registered email address</p>
          </div>

          <div className="p-6">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#b59677] transition"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8b5e34] hover:bg-[#724a25] text-white font-semibold text-sm py-3 rounded-xl shadow transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <p className="text-center text-xs text-zinc-500">
                  Remember your password?{' '}
                  <Link to="/" className="text-[#8b5e34] font-semibold hover:underline">Sign In</Link>
                </p>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-900">Check Your Email</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    If <strong>{email}</strong> is registered, a password reset link has been sent.
                  </p>
                </div>
                {devLink && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">🔧 Dev Mode — Reset Link:</p>
                    <a
                      href={devLink}
                      className="text-xs text-[#8b5e34] break-all hover:underline font-mono"
                    >
                      {devLink}
                    </a>
                  </div>
                )}
                <Link
                  to="/"
                  className="inline-block bg-[#8b5e34] text-white text-xs font-semibold py-2.5 px-6 rounded-full"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
