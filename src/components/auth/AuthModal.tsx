import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ADMIN_EMAIL } from '../../lib/firebase';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    resetPassword,
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg(null);
    setResetSuccess(false);
  };

  const handleModeSwitch = (mode: 'signin' | 'signup' | 'forgot') => {
    setAuthModalMode(mode);
    setErrorMsg(null);
    setResetSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (authModalMode === 'signin') {
        if (!email.trim() || !password) {
          setErrorMsg('Please enter both email and password.');
          setIsLoading(false);
          return;
        }
        const res = await loginWithEmail(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials');
        }
      } else if (authModalMode === 'signup') {
        if (!name.trim() || !email.trim() || !password) {
          setErrorMsg('Please provide your name, email, and password.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }
        const res = await registerWithEmail(name, email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Failed to create account');
        }
      } else if (authModalMode === 'forgot') {
        if (!email.trim()) {
          setErrorMsg('Please enter your registered email address.');
          setIsLoading(false);
          return;
        }
        const res = await resetPassword(email);
        if (res.success) {
          setResetSuccess(true);
        } else {
          setErrorMsg(res.error || 'Failed to send reset link.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setErrorMsg(res.error || 'Google authentication was cancelled.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword('Admin@123456');
    setErrorMsg(null);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="auth-modal-content"
        className="w-full max-w-md bg-white border border-[#E8E2D9] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] mb-3 shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-950 tracking-tight">
            {authModalMode === 'signin' && 'Sign In to AURELIA'}
            {authModalMode === 'signup' && 'Create Atelier Client Profile'}
            {authModalMode === 'forgot' && 'Reset Atelier Password'}
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto font-normal">
            {authModalMode === 'signin' && 'Access your couture orders, bespoke fitting records, and Privilege balance.'}
            {authModalMode === 'signup' && 'Indulge in haute couture to unlock 500 welcome Privilege Credits.'}
            {authModalMode === 'forgot' && 'Enter your client email and we will send a secure password recovery link.'}
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {resetSuccess && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Recovery email dispatched!</p>
              <p className="text-emerald-700 mt-0.5">Please check your inbox at <strong>{email}</strong> for instructions.</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Client Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A7B38]/30 focus:border-[#9A7B38] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@aurelia.couture"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A7B38]/30 focus:border-[#9A7B38] transition-all"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                  Password
                </label>
                {authModalMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot')}
                    className="text-[11px] text-[#9A7B38] hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A7B38]/30 focus:border-[#9A7B38] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {authModalMode === 'signin' && 'Sign In'}
                  {authModalMode === 'signup' && 'Create Atelier Profile'}
                  {authModalMode === 'forgot' && 'Send Recovery Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        {authModalMode !== 'forgot' && (
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE4D8]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-stone-400 bg-white px-2 tracking-widest">
              Or continue with
            </div>
          </div>
        )}

        {/* Google OAuth Button */}
        {authModalMode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E0D8C8] text-stone-800 text-xs font-semibold flex items-center justify-center space-x-3 transition-colors shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {/* Mode Toggle Footer */}
        <div className="mt-6 pt-4 border-t border-[#EAE4D8] text-center text-xs text-stone-500">
          {authModalMode === 'signin' && (
            <p>
              New to AURELIA?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className="font-bold text-stone-950 hover:text-[#9A7B38] transition-colors underline"
              >
                Register client profile
              </button>
            </p>
          )}

          {authModalMode === 'signup' && (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className="font-bold text-stone-950 hover:text-[#9A7B38] transition-colors underline"
              >
                Sign in
              </button>
            </p>
          )}

          {authModalMode === 'forgot' && (
            <button
              type="button"
              onClick={() => handleModeSwitch('signin')}
              className="font-bold text-stone-950 hover:text-[#9A7B38] transition-colors inline-flex items-center space-x-1"
            >
              <span>&larr; Back to sign in</span>
            </button>
          )}
        </div>

        {/* Admin Demo Helper */}
        <div className="mt-4 pt-3 border-t border-dashed border-[#EAE4D8] flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center space-x-1">
            <KeyRound className="w-3 h-3 text-[#9A7B38]" />
            <span>Maison Admin:</span>
          </span>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="text-[10px] text-stone-600 hover:text-black font-mono underline cursor-pointer"
          >
            Auto-fill Admin Email
          </button>
        </div>
      </div>
    </div>
  );
};
