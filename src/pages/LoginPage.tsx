import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogleDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('chief.operator@facility.eco');
  const [password, setPassword] = useState('waterguard2025');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password, remember);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    await loginWithGoogleDemo();
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0e141d] font-['Hanken_Grotesk'] text-[#dee2f0] antialiased flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Ambient Hydro Lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-36 -right-28 w-80 h-80 bg-[#0378b7]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Ambient Hydro Ripples SVG Graphic Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="w-full h-full" fill="none" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="180" r="90" stroke="#00dbe9" strokeDasharray="4 6" strokeWidth="0.75"></circle>
          <circle cx="200" cy="180" r="150" stroke="#00dbe9" opacity="0.6" strokeWidth="0.5"></circle>
          <circle cx="200" cy="180" r="220" stroke="#94ccff" opacity="0.3" strokeDasharray="2 8" strokeWidth="0.5"></circle>
        </svg>
      </div>

      <main className="w-full max-w-md bg-[#161c25]/90 backdrop-blur-xl border border-[#30353f]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand Crest & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative flex items-center justify-center w-20 h-20 mb-3 rounded-2xl bg-[#252a34]/70 border border-[#30353f] shadow-xl p-1.5">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#00f0ff]/30 to-[#94ccff]/10 blur-sm pointer-events-none"></div>
            <img
              src="/assets/aistudio/Image_1_1a05da32.jpeg"
              alt="Neerwise Logo"
              className="relative z-10 w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#30353f]/60 text-[#94ccff] font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span>Acoustic IoT Gateway</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#dbfcff] tracking-tight">
            Sign In to Neerwise
          </h1>
          <p className="font-['Hanken_Grotesk'] text-xs text-[#b9cacb] max-w-xs mt-1">
            Track your personal water score & conservation impact
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="font-['JetBrains_Mono'] text-[11px] uppercase text-[#b9cacb] flex items-center justify-between">
              <span>Telemetry ID / Email</span>
              <span className="text-[#94ccff]">Node #842</span>
            </label>
            <div className="relative flex items-center rounded-lg bg-[#090e17]/80 border border-[#30353f] focus-within:border-[#00f0ff] transition-colors">
              <span className="material-symbols-outlined text-[#849495] ml-3 select-none text-[18px]">water_drop</span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chief.operator@facility.eco"
                required
                className="w-full bg-transparent px-3 py-2.5 text-[#dee2f0] text-sm placeholder:text-[#3b494b] focus:outline-none focus:text-[#dbfcff]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="font-['JetBrains_Mono'] text-[11px] uppercase text-[#b9cacb] flex items-center justify-between">
              <span>Security Token / Password</span>
              <span className="text-[#94ccff] text-[10px] font-mono">Encrypted SHA-256</span>
            </label>
            <div className="relative flex items-center rounded-lg bg-[#090e17]/80 border border-[#30353f] focus-within:border-[#00f0ff] transition-colors">
              <span className="material-symbols-outlined text-[#849495] ml-3 select-none text-[18px]">lock</span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-transparent px-3 py-2.5 text-[#dee2f0] text-sm placeholder:text-[#3b494b] focus:outline-none focus:text-[#dbfcff]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="px-3 text-[#849495] hover:text-[#dbfcff] transition-colors focus:outline-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg select-none">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded bg-[#30353f] accent-[#00f0ff] cursor-pointer"
              />
              <span className="text-xs text-[#b9cacb] group-hover:text-[#dee2f0] transition-colors">
                Remember 30 days
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#94ccff] hover:text-[#00f0ff] transition-colors underline-offset-4 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-2.5 px-4 rounded-lg font-['Space_Grotesk'] text-sm text-[#00363a] font-bold bg-gradient-to-r from-[#00f0ff] via-[#7df4ff] to-[#0378b7] shadow-[0_0_24px_rgba(0,240,255,0.35)] hover:shadow-[0_0_32px_rgba(0,240,255,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
            ) : (
              <>
                <span>Sign In to Hydro-Telemetry</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="w-full h-px bg-[#30353f]"></div>
            <span className="absolute bg-[#161c25] px-3 font-['JetBrains_Mono'] text-[10px] text-[#849495] uppercase tracking-widest">
              or continue with
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#252a34]/80 hover:bg-[#30353f] border border-[#30353f] text-[#dee2f0] text-sm shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
            </svg>
            <span className="group-hover:text-[#dbfcff] transition-colors">Continue with Google (Demo Mode)</span>
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#b9cacb]">
              New to Neerwise?{' '}
              <Link to="/signup" className="text-[#00dbe9] hover:text-[#00f0ff] font-semibold underline-offset-4 hover:underline transition-colors ml-1">
                Create an Account
              </Link>
            </p>
          </div>

          {/* Demo notice pill */}
          <div className="mt-1 pt-2 flex items-center justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#30353f]/40 backdrop-blur-sm text-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6bd8cb]"></span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#849495] tracking-tight">
                Simulated Demo Auth Mode - Firebase/Supabase ready
              </span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
