import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <AlertCircle size={40} className="text-rose-500 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-zinc-900">Invalid Reset Link</h2>
          <p className="text-xs text-zinc-500">This link is invalid or has expired.</p>
          <Link to="/forgot-password" className="inline-block bg-[#8b5e34] text-white text-xs font-semibold py-2.5 px-6 rounded-full">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.error || 'Reset failed. Link may have expired.');
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
            <h1 className="font-serif text-xl font-bold text-white">Set New Password</h1>
            <p className="text-xs text-zinc-400 mt-1">Choose a strong password for your account</p>
          </div>
          <div className="p-6">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-9 pr-10 py-2.5 outline-none focus:border-[#b59677] transition"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full bg-[#fcfaf7] border border-[#ded8cb] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#b59677] transition"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8b5e34] hover:bg-[#724a25] text-white font-semibold text-sm py-3 rounded-xl shadow transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Set New Password'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} className="text-emerald-600" />
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900">Password Updated!</h3>
                <p className="text-xs text-zinc-500">Redirecting you to login in 3 seconds...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
