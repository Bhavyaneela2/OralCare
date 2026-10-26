import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ToothLogo } from '../common/ToothLogo';
import { User, UserRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToRoleSelect: () => void;
  availableUsers: User[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToForgotPassword,
  onNavigateToRoleSelect,
  availableUsers
}) => {
  const [email, setEmail] = useState('bhavyasrineela11@gmail.com');
  const [password, setPassword] = useState('oralcare123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const matched = availableUsers.find(
        (u) => u.email.toLowerCase() === trimmedEmail || u.phone.includes(trimmedEmail)
      );

      if (matched) {
        if (matched.status === 'inactive') {
          setError('This account has been deactivated by the hospital administrator.');
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        onLoginSuccess(matched);
      } else {
        // If demo email wasn't found in initial list, log in as patient or default
        const defaultUser = availableUsers[0];
        setIsLoading(false);
        onLoginSuccess(defaultUser);
      }
    }, 400);
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = availableUsers.find((u) => u.role === role);
    if (user) {
      onLoginSuccess(user);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { signInWithGoogle } = await import('../../firebase');
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        const loggedUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          email: fbUser.email || email,
          phone: fbUser.phoneNumber || '+91 9006480779',
          role: 'patient',
          avatar: fbUser.photoURL || undefined,
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setIsLoading(false);
        onLoginSuccess(loggedUser);
        return;
      }
    } catch (err: any) {
      console.warn('Firebase popup sign-in fallback to verified local profile:', err);
      // Fallback to primary demo patient
      handleQuickLogin('patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Brand Visual Illustration (matching screenshot) */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-sky-100/80 via-teal-50 to-blue-50 border-r border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <ToothLogo size={42} />
          </div>

          {/* Stylized Dental Graphic */}
          <div className="relative z-10 my-auto flex flex-col items-center text-center py-8">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer soft glowing halo */}
              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-2xl animate-pulse" />
              
              {/* Center 3D-styled tooth container */}
              <div className="relative w-32 h-32 rounded-3xl bg-white shadow-xl shadow-teal-500/10 flex items-center justify-center border border-teal-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="url(#toothGrad)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-20 h-20 drop-shadow-md"
                >
                  <defs>
                    <linearGradient id="toothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#0D9488" />
                    </linearGradient>
                  </defs>
                  <path d="M7 3C4.2 3 2 5.2 2 8c0 3.3 1.5 6.5 2.5 10 .8 2.8 2.5 4 4.5 4 1.8 0 2.5-1.5 3-3 .5 1.5 1.2 3 3 3 2 0 3.7-1.2 4.5-4 1-3.5 2.5-6.7 2.5-10 0-2.8-2.2-5-5-5-2.2 0-3.5 1.2-5 1.2S9.2 3 7 3z" />
                  <path d="M9 10c.8.6 1.8 1 3 1s2.2-.4 3-1" />
                </svg>
              </div>

              {/* Surrounding mini badges */}
              <div className="absolute -top-1 -right-1 p-2 bg-white rounded-xl shadow-md border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
              </div>
              <div className="absolute -bottom-1 -left-1 p-2 bg-white rounded-xl shadow-md border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-6 tracking-tight">
              Healthy Smiles,
            </h3>
            <p className="text-sm font-semibold text-teal-700">
              Better Tomorrow
            </p>
            <p className="text-xs text-slate-500 max-w-xs mt-2">
              Neural Semantic Modeling for Unstructured Dental Clinical Text & Diagnostic Radiographs
            </p>
          </div>

          {/* Footer note */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>HIPAA-Inspired Security</span>
            <span>Made for Indian Healthcare</span>
          </div>
        </div>

        {/* Right Side: Form (Exact match to screenshot) */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or phone
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or phone"
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white text-sm font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs md:text-sm font-semibold transition-colors flex items-center justify-center gap-3 shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>G Google</span>
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
              <span>Quick Demo One-Click Access:</span>
              <button
                type="button"
                onClick={onNavigateToRoleSelect}
                className="text-teal-600 font-semibold hover:underline"
              >
                Role Portal
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('patient')}
                className="py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold rounded-lg border border-sky-100 transition-colors"
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('doctor')}
                className="py-1.5 px-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-semibold rounded-lg border border-teal-100 transition-colors"
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center mt-5 text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
