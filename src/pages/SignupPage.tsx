import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const { signup, loginWithGoogleDemo } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState('Dr. Samantha Vance');
  const [email, setEmail] = useState('s.vance@hydro-grid.org');
  const [household, setHousehold] = useState('2-3');
  const [targetAllowance, setTargetAllowance] = useState(135);
  const [password, setPassword] = useState('waterguard2025');
  const [confirmPassword, setConfirmPassword] = useState('waterguard2025');
  const [pledgeChecked, setPledgeChecked] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic formula: lower target yields higher initial score
  const calculateForecastScore = (liters: number) => {
    let score = Math.round(100 - (liters - 50) * 0.28);
    return Math.max(20, Math.min(99, score));
  };

  const currentForecastScore = calculateForecastScore(targetAllowance);

  const handleHouseholdChange = (val: string) => {
    setHousehold(val);
    if (val === '1') setTargetAllowance(110);
    else if (val === '2-3') setTargetAllowance(135);
    else setTargetAllowance(160);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!pledgeChecked) {
      setError('Please agree to the Conservation Pledge and Terms of Service.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        name: fullname,
        email,
        password,
        householdSize: household === '1' ? 1 : household === '2-3' ? 3 : 5,
        targetAllowance,
      });

      if (res.success) {
        navigate('/onboarding');
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch {
      setError('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    await loginWithGoogleDemo();
    setIsLoading(false);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#0e141d] font-['Hanken_Grotesk'] text-[#dee2f0] antialiased flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none"></div>

      <main className="w-full max-w-md bg-[#161c25]/90 backdrop-blur-xl border border-[#30353f]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 my-8">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-16 h-16 mb-3 rounded-2xl bg-[#252a34]/70 border border-[#30353f] shadow-lg flex items-center justify-center p-1">
            <img
              src="/assets/aistudio/Image_1_1a05da32.jpeg"
              alt="Neerwise Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00dbe9] font-['JetBrains_Mono'] text-[11px] mb-2 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span>Hydro Intelligence Platform</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#dee2f0] tracking-tight">
            Join the Water Conservation Movement
          </h1>
          <p className="font-['Hanken_Grotesk'] text-xs text-[#b9cacb] max-w-xs mt-1">
            Pioneer high-precision planetary stewardship. Real-time telemetry, acoustic leak detection, and sovereign water scores.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reg-name" className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[#849495] text-[10px]">VERIFIED ID</span>
            </label>
            <div className="relative flex items-center bg-[#090e17]/80 border border-[#30353f] rounded-lg focus-within:border-[#00f0ff] transition-colors">
              <span className="material-symbols-outlined absolute left-3 text-[#849495] text-[18px]">badge</span>
              <input
                id="reg-name"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Dr. Samantha Vance"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-[#dee2f0] text-sm focus:outline-none placeholder-[#849495]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reg-email" className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[#849495] text-[10px]">COMM LINK</span>
            </label>
            <div className="relative flex items-center bg-[#090e17]/80 border border-[#30353f] rounded-lg focus-within:border-[#00f0ff] transition-colors">
              <span className="material-symbols-outlined absolute left-3 text-[#849495] text-[18px]">mail</span>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="s.vance@hydro-grid.org"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-[#dee2f0] text-sm focus:outline-none placeholder-[#849495]"
              />
            </div>
          </div>

          {/* Household Size & Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-household" className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider flex items-center justify-between">
                <span>Household Size</span>
              </label>
              <select
                id="reg-household"
                value={household}
                onChange={(e) => handleHouseholdChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#090e17]/80 border border-[#30353f] text-[#dee2f0] text-sm rounded-lg focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="1">1 Person (Solo Pod)</option>
                <option value="2-3">2–3 People (Urban Pod)</option>
                <option value="4+">4+ People (Compound)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between relative">
                <label htmlFor="reg-target" className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider flex items-center gap-1">
                  <span>Daily Allowance</span>
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-[#849495] hover:text-[#00f0ff]"
                  >
                    <span className="material-symbols-outlined text-[15px]">info</span>
                  </button>
                </label>
                {showTooltip && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-[#252a34] text-[#dee2f0] rounded-xl shadow-2xl text-xs z-30 border border-[#30353f]">
                    Targeting below the regional mean (&lt;135L) sets your Initial Hydro Score to 88/100, unlocking Tier 1 municipal conservation rebates.
                  </div>
                )}
              </div>
              <div className="relative flex items-center bg-[#090e17]/80 border border-[#30353f] rounded-lg focus-within:border-[#00f0ff]">
                <input
                  id="reg-target"
                  type="number"
                  min="50"
                  max="500"
                  value={targetAllowance}
                  onChange={(e) => setTargetAllowance(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 bg-transparent font-['JetBrains_Mono'] text-sm text-[#00f0ff] font-bold focus:outline-none"
                />
                <span className="absolute right-3 font-['JetBrains_Mono'] text-xs text-[#849495]">L/DAY</span>
              </div>
            </div>
          </div>

          {/* Hydro Score Visual Impact Bar */}
          <div className="p-3 bg-[#090e17]/80 border border-[#30353f]/60 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[11px]">
              <span className="flex items-center gap-1 text-[#00dbe9]">
                <span className="material-symbols-outlined text-[14px]">insights</span>
                INITIAL WATER SCORE FORECAST
              </span>
              <span className="font-['JetBrains_Mono'] text-lg text-[#00f0ff] font-bold">
                {currentForecastScore}
                <span className="text-xs text-[#849495] font-normal">/100</span>
              </span>
            </div>
            <div className="w-full h-2 bg-[#1a2029] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-[#0378b7] via-[#00dbe9] to-[#00f0ff] rounded-full transition-all duration-300"
                style={{ width: `${currentForecastScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#849495]">
              {currentForecastScore >= 85
                ? 'Superior baseline: Maximum conservation tier unlocked.'
                : currentForecastScore >= 70
                ? 'Optimal baseline: WHO recommended urban consumption.'
                : 'Elevated consumption profile: Lower targets yield higher initial ratings.'}
            </p>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-password" className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#090e17]/80 border border-[#30353f] text-[#dee2f0] text-sm rounded-lg focus:outline-none focus:border-[#00f0ff]"
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-confirm" className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
                Confirm
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#090e17]/80 border border-[#30353f] text-[#dee2f0] text-sm rounded-lg focus:outline-none focus:border-[#00f0ff]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Conservation Pledge Agreement */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="pledge"
              type="checkbox"
              checked={pledgeChecked}
              onChange={(e) => setPledgeChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded bg-[#30353f] accent-[#00f0ff] cursor-pointer"
            />
            <label htmlFor="pledge" className="text-xs text-[#b9cacb] select-none cursor-pointer leading-normal">
              I agree to the <span className="text-[#00f0ff] hover:underline">Conservation Pledge</span> and{' '}
              <span className="text-[#00f0ff] hover:underline">Terms of Service</span>.
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 mt-1 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0378b7] text-[#00363a] font-['Space_Grotesk'] font-bold text-sm shadow-lg shadow-[#00f0ff]/20 hover:shadow-[#00f0ff]/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">water</span>
                <span>Create Neerwise Account</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="w-full h-px bg-[#30353f]"></div>
            <span className="absolute bg-[#161c25] px-3 font-['JetBrains_Mono'] text-[10px] text-[#849495] uppercase tracking-widest">
              or authenticate with
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 px-4 rounded-lg bg-[#252a34] hover:bg-[#30353f] border border-[#30353f] text-[#dee2f0] text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="mt-6 text-center pt-2">
          <p className="text-xs text-[#b9cacb]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00f0ff] hover:underline font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
