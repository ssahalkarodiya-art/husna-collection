import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HusnaLogo } from './HusnaLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please verify your credentials.');
        } else {
          setIsAuthModalOpen(false);
        }
      } else {
        if (!fullName.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        const res = await signUp(email, password, fullName);
        if (!res.success) {
          setError(res.error || 'Registration failed.');
        } else {
          setSuccessNotice(
            isConfigured
              ? 'Account created! If email confirmation is enabled on your Supabase project, please check your inbox.'
              : 'Welcome to Husna Atelier! Your profile has been created.'
          );
          setTimeout(() => {
            setIsAuthModalOpen(false);
          }, 1500);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#171411]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fdf9f3] w-full max-w-md rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#eae5dd] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-6 px-8 text-center flex flex-col items-center border-b border-[#ece7df]">
          <HusnaLogo size={52} showText={false} />
          <h2 className="font-serif text-2xl font-semibold text-[#171411] mt-3">
            {mode === 'signin' ? 'Atelier Client Sign In' : 'Create Atelier Account'}
          </h2>
          <p className="text-xs text-[#7e756f] mt-1 max-w-xs">
            {mode === 'signin'
              ? 'Access your bespoke order history, saved measurements, and VIP wishlist.'
              : 'Join Husna Haute Modesty for complimentary courier tailoring and private seasonal previews.'}
          </p>

          {/* Toggle Pills */}
          <div className="flex bg-[#efebe4] p-1 rounded-full mt-5 w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#171411] shadow-xs'
                  : 'text-[#7e756f] hover:text-[#171411]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#171411] shadow-xs'
                  : 'text-[#7e756f] hover:text-[#171411]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-2.5 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{successNotice}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#171411] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ayesha Khan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6cfc5] bg-white text-xs text-[#171411] placeholder:text-[#9e958e] focus:outline-none focus:border-[#5c6149] focus:ring-1 focus:ring-[#5c6149]"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#171411] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="concierge@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6cfc5] bg-white text-xs text-[#171411] placeholder:text-[#9e958e] focus:outline-none focus:border-[#5c6149] focus:ring-1 focus:ring-[#5c6149]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#171411] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#d6cfc5] bg-white text-xs text-[#171411] placeholder:text-[#9e958e] focus:outline-none focus:border-[#5c6149] focus:ring-1 focus:ring-[#5c6149]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#171411] hover:bg-[#2d2822] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'signin' ? (
              'Sign In to Account'
            ) : (
              'Complete Atelier Registration'
            )}
          </button>

          <p className="text-center text-[10px] text-[#8e857e] mt-4">
            By accessing your account, you agree to Husna Haute Modesty's{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Charter</span>.
          </p>
        </form>
      </div>
    </div>
  );
};
