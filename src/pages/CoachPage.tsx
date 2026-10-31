import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';
import { formatVolume } from '../utils/waterScore';

export const CoachPage: React.FC = () => {
  const { user } = useAuth();
  const {
    coachQuests,
    microHabits,
    toggleHabitDone,
    toggleQuestCompleted,
    waterScore,
  } = useWater();

  const todayUsage = waterScore.totalLoggedTodayLiters;

  // What-If Simulator State
  const [simShowerTime, setSimShowerTime] = useState<number>(5); // minutes
  const [simAeratorRetrofit, setSimAeratorRetrofit] = useState<boolean>(true);
  const [simDishwasherMode, setSimDishwasherMode] = useState<boolean>(true); // Eco mode
  const [simDripGarden, setSimDripGarden] = useState<boolean>(false);

  // Calculate simulated savings
  const calculateSimulatedSavings = () => {
    let litersSavedPerDay = 0;
    // Shower reduction from baseline 8.5 min @ 9L/min
    const showerSavings = Math.max(0, (8.5 - simShowerTime) * 8.5);
    litersSavedPerDay += showerSavings;

    if (simAeratorRetrofit) litersSavedPerDay += 14; // Aerator saves ~14L across hand-wash & teeth
    if (simDishwasherMode) litersSavedPerDay += 18; // Full load eco vs partial handwash
    if (simDripGarden) litersSavedPerDay += 22; // Drip vs hose

    const simulatedDailyTotal = Math.max(30, todayUsage - litersSavedPerDay);
    const target = user?.targetLitersPerDay || 140;
    const projectedScore = Math.min(100, Math.round(100 - (simulatedDailyTotal / target) * 35));

    return {
      litersSavedPerDay: Math.round(litersSavedPerDay),
      projectedScore,
      litersSavedWeekly: Math.round(litersSavedPerDay * 7),
    };
  };

  const simulation = calculateSimulatedSavings();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30353f]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-secondary">
              HYDROLOGIC CONSERVATION INTELLIGENCE ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            Water Saving Coach
          </h1>
          <p className="text-sm text-outline mt-1">
            Personalized behavioral micro-habits, verified retrofit advisories, and predictive scenario modeling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl">verified</span>
            <div>
              <div className="text-[10px] font-mono uppercase text-outline">Coach Protocol</div>
              <div className="text-xs font-semibold text-white">Algorithmic Guidance Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Coach Overview Card */}
      <div className="bg-gradient-to-br from-surface-container via-surface-container-low to-secondary/10 border border-secondary/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-mono uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
              Weekly Conservation Diagnostic
            </div>
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-white">
              Targeting {user?.name || 'Resident'}'s Primary Savings Vector: Bathing & Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-outline leading-relaxed">
              Based on your logged telemetry cycles, <strong className="text-white">62%</strong> of domestic water flow occurs between 07:00 and 09:00. By shortening shower cycles by 2.5 minutes and running dish appliances exclusively at maximum capacity, your household will conserve an estimated <strong className="text-secondary">245 Liters per week</strong>.
            </p>
          </div>

          <div className="md:col-span-4 bg-[#090e17]/80 border border-[#30353f]/60 rounded-xl p-4 text-center">
            <span className="text-[10px] font-mono uppercase text-outline tracking-wider">
              ESTIMATED POTENTIAL SAVINGS
            </span>
            <div className="text-3xl font-mono font-bold text-secondary my-1">
              {formatVolume(245, user?.unitSystem)}
            </div>
            <div className="text-[11px] text-outline font-mono">
              Per week (~{formatVolume(35, user?.unitSystem)}/day)
            </div>
            <div className="mt-3 pt-3 border-t border-[#30353f]/40 flex justify-between text-[11px]">
              <span className="text-outline">Score Lift Potential:</span>
              <span className="text-emerald-400 font-bold font-mono">+12 Pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Daily Micro-Habits & Active Coach Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Micro-Habits Checklist */}
        <div className="lg:col-span-6 bg-surface-container border border-[#30353f]/60 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">fact_check</span>
                  Daily Micro-Habits
                </h3>
                <p className="text-xs text-outline">Complete daily actions to preserve streak and boost score</p>
              </div>
              <span className="text-xs font-mono text-primary font-medium">
                {microHabits.filter((h) => h.isDone).length} / {microHabits.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {microHabits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitDone(habit.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                    habit.isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-surface-container-low border-[#30353f]/40 hover:border-primary/50 text-outline hover:text-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                        habit.isDone
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-[#30353f] group-hover:border-primary'
                      }`}
                    >
                      {habit.isDone && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${habit.isDone ? 'line-through text-outline' : 'text-white'}`}>
                        {habit.title}
                      </div>
                      <div className="text-[11px] text-outline mt-0.5">
                        {habit.statusText}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <span className="text-[11px] font-mono text-primary font-medium">
                      +{habit.savedLitersEst}L
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#30353f]/40 text-[11px] text-outline flex items-center justify-between">
            <span>Micro-habits reset every midnight</span>
            <span className="text-emerald-400 font-mono font-medium">Streak Multiplier: 1.2x</span>
          </div>
        </div>

        {/* Right Column: Active Hydro Quests */}
        <div className="lg:col-span-6 bg-surface-container border border-[#30353f]/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">flag</span>
                Weekly Hydro Quests
              </h3>
              <p className="text-xs text-outline">Multi-day challenges to ingrain conservation protocols</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {coachQuests.map((quest) => (
              <div key={quest.id} className="p-4 rounded-xl bg-surface-container-low border border-[#30353f]/40">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-semibold text-white text-sm">{quest.title}</div>
                  <span className="text-xs font-mono text-secondary font-bold">
                    +{quest.estimatedSavingsLiters}L/wk
                  </span>
                </div>
                <p className="text-xs text-outline leading-relaxed mb-3">{quest.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="font-mono text-outline text-[11px]">
                    Status: <span className="text-white font-bold">{quest.syncLabel}</span>
                  </div>
                  <button
                    onClick={() => toggleQuestCompleted(quest.id)}
                    className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      quest.isCompletedToday
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-secondary/15 hover:bg-secondary/30 text-secondary border border-secondary/30'
                    }`}
                  >
                    {quest.isCompletedToday ? 'Completed' : quest.actionPrimaryText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Scenario Calculator: "What-If" Conservation Simulator */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">tune</span>
              Interactive "What-If" Conservation Simulator
            </h3>
            <p className="text-xs text-outline">
              Simulate fixture retrofits and timing changes to preview your projected Water Score lift.
            </p>
          </div>
          <span className="text-[11px] font-mono text-primary uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20 self-start sm:self-auto">
            PROJECTION SANDBOX
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Shower Duration Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-white font-medium">Shower Duration Target</span>
                <span className="text-primary font-mono font-bold text-sm">{simShowerTime} Minutes</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={simShowerTime}
                onChange={(e) => setSimShowerTime(parseFloat(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-outline font-mono mt-1">
                <span>3m (Ultralight)</span>
                <span>8.5m (Typical)</span>
                <span>12m (Extended)</span>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-[#30353f]/40 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Install Low-Flow Aerators (1.5 GPM)</div>
                  <div className="text-[11px] text-outline">Retrofit kitchen and master vanity faucets</div>
                </div>
                <input
                  type="checkbox"
                  checked={simAeratorRetrofit}
                  onChange={(e) => setSimAeratorRetrofit(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-[#30353f]/40 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Full-Load Eco Dishwasher Mode</div>
                  <div className="text-[11px] text-outline">Eliminate pre-rinsing and run strictly on full capacity</div>
                </div>
                <input
                  type="checkbox"
                  checked={simDishwasherMode}
                  onChange={(e) => setSimDishwasherMode(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-[#30353f]/40 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Drip Irrigation Automation</div>
                  <div className="text-[11px] text-outline">Replace hand-hose spray with timed ground micro-emitters</div>
                </div>
                <input
                  type="checkbox"
                  checked={simDripGarden}
                  onChange={(e) => setSimDripGarden(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Result Output Card */}
          <div className="lg:col-span-5 bg-[#090e17] border border-primary/30 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-mono uppercase text-outline tracking-wider">
              PROJECTED STEWARDSHIP OUTCOME
            </span>

            <div className="flex items-center justify-center gap-6">
              <div>
                <div className="text-3xl font-mono font-bold text-emerald-400">
                  +{simulation.litersSavedPerDay}L
                </div>
                <div className="text-[10px] font-mono text-outline uppercase mt-0.5">
                  Saved / Day
                </div>
              </div>

              <div className="w-px h-10 bg-[#30353f]"></div>

              <div>
                <div className="text-3xl font-mono font-bold text-primary">
                  {simulation.projectedScore}
                </div>
                <div className="text-[10px] font-mono text-outline uppercase mt-0.5">
                  Projected Score
                </div>
              </div>
            </div>

            <p className="text-xs text-outline leading-relaxed pt-2 border-t border-[#30353f]/40">
              Implementing these simulated parameters will save approximately <strong className="text-white">{formatVolume(simulation.litersSavedWeekly, user?.unitSystem)}</strong> of municipal water per week and elevate your hydro standing to <strong className="text-emerald-400">Tier A+ Master Steward</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
