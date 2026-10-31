import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useWater();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [residence, setResidence] = useState<'apt' | 'single' | 'eco'>('single');
  const [fixtures, setFixtures] = useState({
    shower: true,
    dish: true,
    rainwater: false,
    garden: false,
  });
  const [targetLiters, setTargetLiters] = useState(120);

  // Dynamic score calculator
  let baseScore = 78;
  if (residence === 'eco') baseScore += 8;
  if (residence === 'apt') baseScore += 4;
  if (fixtures.shower) baseScore += 6;
  if (fixtures.dish) baseScore += 4;
  if (fixtures.rainwater) baseScore += 8;
  if (fixtures.garden) baseScore -= 3;
  baseScore += Math.round((140 - targetLiters) * 0.25);
  const projectedScore = Math.min(99, Math.max(35, baseScore));

  const handleComplete = () => {
    updateUser({
      residenceType: residence,
      residenceTypeName:
        residence === 'eco'
          ? 'Certified Eco-Dwelling'
          : residence === 'apt'
          ? 'Urban Apartment / Flat'
          : 'Single Family Residence',
      targetLitersPerDay: targetLiters,
    });
    showToast('Onboarding Calibrated', 'Baseline synced with local hydro-telemetry grid.', 'success', 'verified');
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0e141d] font-['Hanken_Grotesk'] text-[#dee2f0] antialiased flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none"></div>

      <main className="w-full max-w-md bg-[#161c25]/95 backdrop-blur-xl border border-[#30353f]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 my-8">
        {/* Header Emblem */}
        <header className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="relative p-1 rounded-full bg-[#252a34] border border-[#30353f] shadow-md">
            <img
              src="/assets/aistudio/Image_1_1a05da32.jpeg"
              alt="Neerwise Water Intelligence Emblem"
              className="w-14 h-14 object-cover rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00f0ff] rounded-full ring-2 ring-[#0e141d] animate-pulse"></span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1a2029] text-[#00f0ff] font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span>Baseline Calibration Protocol</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-2xl font-semibold text-[#dbfcff] tracking-tight">
            Welcome to Neerwise, {user?.name?.split(' ')[0] || 'Explorer'}!
          </h1>
          <p className="font-['Hanken_Grotesk'] text-xs text-[#b9cacb] max-w-xs">
            Let's calibrate your environmental baseline for precision resource monitoring.
          </p>
        </header>

        {/* Stepper Navigation */}
        <nav aria-label="Calibration Steps" className="w-full flex items-center justify-between mb-6 px-1">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div
              className={`w-7 h-7 rounded-full font-['JetBrains_Mono'] text-xs flex items-center justify-center font-bold transition-all ${
                currentStep >= 1 ? 'bg-[#00f0ff] text-[#00363a]' : 'bg-[#252a34] text-[#b9cacb]'
              }`}
            >
              01
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#00f0ff] leading-none">STAGE 1</span>
              <span className="text-[11px] text-[#dee2f0] font-medium">Profile</span>
            </div>
          </button>

          <div className="flex-1 h-0.5 mx-2 bg-[#30353f] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00f0ff] transition-all duration-300"
              style={{ width: currentStep >= 2 ? '100%' : '50%' }}
            ></div>
          </div>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div
              className={`w-7 h-7 rounded-full font-['JetBrains_Mono'] text-xs flex items-center justify-center font-bold transition-all ${
                currentStep >= 2 ? 'bg-[#00f0ff] text-[#00363a]' : 'bg-[#252a34] text-[#b9cacb]'
              }`}
            >
              02
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cacb] leading-none">STAGE 2</span>
              <span className="text-[11px] text-[#b9cacb]">Fixtures</span>
            </div>
          </button>

          <div className="flex-1 h-0.5 mx-2 bg-[#30353f] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00f0ff] transition-all duration-300"
              style={{ width: currentStep >= 3 ? '100%' : '0%' }}
            ></div>
          </div>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div
              className={`w-7 h-7 rounded-full font-['JetBrains_Mono'] text-xs flex items-center justify-center font-bold transition-all ${
                currentStep >= 3 ? 'bg-[#00f0ff] text-[#00363a]' : 'bg-[#252a34] text-[#b9cacb]'
              }`}
            >
              03
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cacb] leading-none">STAGE 3</span>
              <span className="text-[11px] text-[#b9cacb]">Targets</span>
            </div>
          </button>
        </nav>

        {/* Dynamic Projected Score Dial Preview */}
        <section className="w-full bg-[#1a2029] border border-[#30353f]/60 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#0378b7]/15 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex flex-col">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#94ccff] uppercase tracking-wider mb-0.5">
              Projected Water Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-['JetBrains_Mono'] text-2xl font-bold text-[#dbfcff]">
                {projectedScore}
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#849495]">/ 100</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-[#7fecde]">trending_up</span>
              <span className="text-xs text-[#7fecde]">
                {projectedScore >= 85 ? 'Super-Conserver Trajectory' : 'High Conservation Efficiency'}
              </span>
            </div>
          </div>

          {/* Mini Radial SVG */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#30353f]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              ></path>
              <path
                className="text-[#00f0ff] transition-all duration-500 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${projectedScore}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
              ></path>
            </svg>
            <span className="material-symbols-outlined absolute text-[#00f0ff] text-xl">water_drop</span>
          </div>
        </section>

        {/* Step 1: Residence Classification */}
        {currentStep === 1 && (
          <section className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <h2 className="font-['Space_Grotesk'] text-base font-semibold text-[#dee2f0]">
                Residence Classification
              </h2>
              <p className="text-xs text-[#b9cacb]">
                Calibrate structural parameters for standard footprint scaling.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { id: 'apt', title: 'Urban Apartment / Flat', desc: 'Shared piping infrastructure', icon: 'apartment' },
                { id: 'single', title: 'Single Family Residence', desc: 'Dedicated utility metering', icon: 'home' },
                { id: 'eco', title: 'Certified Eco-Dwelling', desc: 'Passive micro-plumbing systems', icon: 'eco' },
              ].map((res) => {
                const isSelected = residence === res.id;
                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setResidence(res.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0378b7]/25 border-[#00f0ff] text-[#dbfcff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'bg-[#1a2029] border-[#30353f]/60 hover:bg-[#252a34] text-[#dee2f0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${isSelected ? 'text-[#00f0ff]' : 'text-[#849495]'}`}>
                        {res.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-['Space_Grotesk'] text-sm font-medium">{res.title}</span>
                        <span className="text-xs text-[#849495]">{res.desc}</span>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-[#00f0ff]' : 'text-[#849495]'}`}>
                      {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-lg bg-[#252a34] hover:bg-[#343944] text-[#00f0ff] font-['Space_Grotesk'] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Next: Fixtures & Habits</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Fixtures & Infrastructure */}
        {currentStep === 2 && (
          <section className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <h2 className="font-['Space_Grotesk'] text-base font-semibold text-[#dee2f0]">
                Fixtures & Infrastructure
              </h2>
              <p className="text-xs text-[#b9cacb]">
                Activate components to adjust dynamic consumption multipliers.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                {
                  key: 'shower' as const,
                  title: 'Low-flow Showerheads',
                  desc: '< 7.5L/min aerated fixtures',
                  icon: 'shower',
                },
                {
                  key: 'dish' as const,
                  title: 'Energy Star Dishwasher',
                  desc: 'Eco-cycle washing algorithm',
                  icon: 'countertops',
                },
                {
                  key: 'rainwater' as const,
                  title: 'Rainwater Harvesting System',
                  desc: 'Runoff recovery storage',
                  icon: 'water',
                },
                {
                  key: 'garden' as const,
                  title: 'Automated Garden Irrigation',
                  desc: 'Drip or rotor landscape lines',
                  icon: 'yard',
                },
              ].map((fix) => {
                const checked = fixtures[fix.key];
                return (
                  <label
                    key={fix.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1a2029] border border-[#30353f]/60 hover:bg-[#252a34] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-xl ${checked ? 'text-[#00f0ff]' : 'text-[#849495]'}`}>
                        {fix.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#dee2f0]">{fix.title}</span>
                        <span className="text-xs text-[#849495]">{fix.desc}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setFixtures({ ...fixtures, [fix.key]: e.target.checked })}
                      className="w-4 h-4 rounded bg-[#30353f] accent-[#00f0ff] cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-lg bg-[#1a2029] text-[#b9cacb] hover:text-[#dee2f0] text-xs transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-lg bg-[#252a34] hover:bg-[#343944] text-[#00f0ff] font-['Space_Grotesk'] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Next: Goal Calibration</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Goal Calibration */}
        {currentStep === 3 && (
          <section className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <h2 className="font-['Space_Grotesk'] text-base font-semibold text-[#dee2f0]">
                Target Benchmark
              </h2>
              <p className="text-xs text-[#b9cacb]">
                Set an ambitious per capita volumetric allowance.
              </p>
            </div>

            <div className="bg-[#1a2029] border border-[#30353f]/60 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase">
                    DAILY PER CAPITA GOAL
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-['JetBrains_Mono'] text-2xl font-bold text-[#00f0ff]">
                      {targetLiters}
                    </span>
                    <span className="text-xs text-[#849495]">Liters / day</span>
                  </div>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-[#94ccff] bg-[#252a34] px-2.5 py-1 rounded-md">
                  Standard: 140L
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="range"
                  min="80"
                  max="200"
                  step="5"
                  value={targetLiters}
                  onChange={(e) => setTargetLiters(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#30353f] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
                <div className="flex justify-between font-['JetBrains_Mono'] text-[10px] text-[#849495] px-1">
                  <span>80L (Extreme)</span>
                  <span>140L (Regional Avg)</span>
                  <span>200L (Unrestricted)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#252a34]/60 border border-[#30353f]/40 rounded-xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#00f0ff] text-base mt-0.5">thermostat</span>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Target auto-indexed against temperate climate zone with seasonal drought mitigation buffers.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-lg bg-[#1a2029] text-[#b9cacb] hover:text-[#dee2f0] text-xs transition-all cursor-pointer"
              >
                Back
              </button>
            </div>
          </section>
        )}

        {/* Educational Callout */}
        <div className="w-full p-3 bg-[#1a2029] border border-[#30353f]/40 rounded-xl my-4 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#94ccff] text-base mt-0.5">info</span>
          <div className="flex flex-col">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#94ccff] font-medium">WHY WATER SCORE?</span>
            <p className="text-xs text-[#b9cacb] mt-0.5 leading-snug">
              A transparent, data-driven index balancing usage against local climate and household targets.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <footer className="w-full flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={handleComplete}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0378b7] text-[#00363a] font-['Space_Grotesk'] text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#00f0ff]/20 hover:shadow-[#00f0ff]/40 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Complete Setup & Enter Dashboard</span>
            <span className="material-symbols-outlined text-base">dashboard</span>
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2 text-xs text-[#b9cacb] hover:text-[#00f0ff] transition-colors text-center cursor-pointer"
          >
            Skip calibration for now
          </button>
        </footer>
      </main>
    </div>
  );
};
