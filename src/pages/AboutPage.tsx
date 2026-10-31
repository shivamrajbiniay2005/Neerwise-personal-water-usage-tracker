import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-6">
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-2xl bg-surface-container border border-primary/30 shadow-2xl inline-block">
            <img
              src="/neerwise-logo.jpeg"
              alt="Neerwise Water Score"
              className="h-20 sm:h-24 object-contain mx-auto"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest">
          <span>PLANETARY HYDRO-STEWARDSHIP MANIFESTO</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-headline font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Know Your Water. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-container">
            Save Every Drop.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-outline max-w-2xl mx-auto leading-relaxed">
          Neerwise was forged to democratize precision hydro-intelligence. By combining high-frequency acoustic waveguide flow sensing with an open, bounded mathematical Water Score, we empower citizens, property stewards, and watershed authorities to safeguard planetary fresh water.
        </p>
      </div>

      {/* Planetary Water Crisis Context & Basin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 text-center">
          <div className="text-3xl font-mono font-bold text-primary mb-1">0.5%</div>
          <div className="text-xs font-semibold text-white">Available Fresh Water</div>
          <p className="text-[11px] text-outline mt-1.5 leading-relaxed">
            Only 0.5% of earth’s total water is accessible unfrozen freshwater available for domestic and agricultural ecosystems.
          </p>
        </div>

        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 text-center">
          <div className="text-3xl font-mono font-bold text-secondary mb-1">35%</div>
          <div className="text-xs font-semibold text-white">Domestic Distribution Losses</div>
          <p className="text-[11px] text-outline mt-1.5 leading-relaxed">
            Over a third of urban domestic tap volume is lost to slow fixture leaks, prolonged ablution run-times, and silent valve failures.
          </p>
        </div>

        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 text-center">
          <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">100 Pts</div>
          <div className="text-xs font-semibold text-white">Sovereign Water Score</div>
          <p className="text-[11px] text-outline mt-1.5 leading-relaxed">
            An intuitive single composite score that transforms complex flow telemetry into actionable behavioral accountability.
          </p>
        </div>
      </div>

      {/* Transparent Water Score Methodology */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#30353f]/40 pb-4">
          <span className="text-[11px] font-mono tracking-wider text-primary uppercase">
            OPEN ALGORITHMIC SPECIFICATION
          </span>
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-white mt-1">
            The Neerwise Water Score Formulation
          </h2>
          <p className="text-xs sm:text-sm text-outline mt-1 leading-relaxed">
            Unlike opaque closed-source utility indices, the Neerwise Water Score operates on an open, transparent, multi-variable mathematical function evaluated daily.
          </p>
        </div>

        <div className="bg-[#090e17] border border-[#30353f] rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm text-white overflow-x-auto">
          <div className="text-primary font-bold mb-2"># Sovereign Daily Water Score Calculation Engine</div>
          <div className="text-outline">
            Score = 100 - ( (ActualLiters / TargetAllowance) * 35 ) - OverBudgetPenalty + HabitBonus
          </div>
          <div className="text-outline/70 mt-2 text-xs">
            Where:<br />
            • <span className="text-white">TargetAllowance</span> = Household occupants × WHO baseline (default: 70L per capita)<br />
            • <span className="text-white">OverBudgetPenalty</span> = max(0, ActualLiters - TargetAllowance) × StrictnessMultiplier<br />
            • <span className="text-white">StrictnessMultiplier</span> = 0.8 (Tolerant), 1.0 (Nominal), 1.3 (Rigorous)<br />
            • <span className="text-white">HabitBonus</span> = Verified low-flow aerators, streak consistency, and completed quests
          </div>
        </div>

        {/* Tier Ranking Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { grade: 'A+', score: '90 – 100', label: 'Master Steward', color: '#00e5ff' },
            { grade: 'A', score: '80 – 89', label: 'Hydro Efficient', color: '#38bdf8' },
            { grade: 'B', score: '65 – 79', label: 'Nominal Baseline', color: '#34d399' },
            { grade: 'C', score: '50 – 64', label: 'Conservation Alert', color: '#fbbf24' },
          ].map((tier, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-surface-container-low border border-[#30353f]/40">
              <div className="flex items-center justify-between">
                <span className="text-base font-mono font-bold" style={{ color: tier.color }}>{tier.grade}</span>
                <span className="text-[10px] font-mono text-outline">{tier.score}</span>
              </div>
              <div className="text-xs font-semibold text-white mt-1">{tier.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pillars of Planetary Hydro-Stewardship */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-[11px] font-mono tracking-wider text-secondary uppercase">
            FOUNDATIONAL ETHOS
          </span>
          <h2 className="text-2xl font-headline font-bold text-white mt-1">
            The Four Pillars of Neerwise
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">visibility</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-white">1. Real-Time Awareness</h3>
            <p className="text-xs text-outline leading-relaxed">
              Eliminate hidden utility bill blindness. Real-time telemetry exposes immediate flow spikes and duration in real units.
            </p>
          </div>

          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">balance</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-white">2. Behavioral Accountability</h3>
            <p className="text-xs text-outline leading-relaxed">
              Gamified streaks, verified micro-habits, and basin-wide leaderboards turn conservation into collective pride.
            </p>
          </div>

          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">precision_manufacturing</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-white">3. Fixture Optimization</h3>
            <p className="text-xs text-outline leading-relaxed">
              Targeted retrofit recommendations identify aerator, dual-flush, and drip irrigation interventions that maximize return.
            </p>
          </div>

          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">public</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-white">4. Watershed Regeneration</h3>
            <p className="text-xs text-outline leading-relaxed">
              Cumulative aggregate savings are contributed to public open-source watershed registries for planetary aquifer replenishment.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="bg-gradient-to-r from-surface-container via-surface-container-high to-primary/10 border border-primary/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-headline font-bold text-white">
            Ready to calibrate your household?
          </h3>
          <p className="text-xs text-outline mt-1">
            Experience the full dashboard or review your active telemetry tracking records.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary text-[#00344f] font-headline font-bold text-xs hover:opacity-95 shadow-md shadow-primary/20 transition-all"
          >
            Open Dashboard
          </Link>
          <Link
            to="/tracker"
            className="px-4 py-2.5 rounded-xl bg-surface-container-low border border-[#30353f] hover:border-primary text-white text-xs font-semibold transition-all"
          >
            View Telemetry
          </Link>
        </div>
      </div>
    </div>
  );
};
