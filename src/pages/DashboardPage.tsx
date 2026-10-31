import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';
import { formatVolume, getScoreRating } from '../utils/waterScore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    entries,
    waterScore,
    categoryBreakdown,
    deleteEntry,
    setQuickLogModalOpen,
    coachQuests,
    badges,
  } = useWater();

  const target = user?.targetLitersPerDay || 140;
  const todayUsage = waterScore.totalLoggedTodayLiters;
  const remaining = Math.max(0, target - todayUsage);
  const percentUsed = Math.min(100, Math.round((todayUsage / target) * 100));
  const isOverBudget = todayUsage > target;
  const rating = getScoreRating(waterScore.score);

  // Recent entries (limit 5)
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Greeting & Operational State */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30353f]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400">
              TELEMETRY LIVE • {user?.residenceTypeName || 'URBAN'} GRID
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user?.name || 'Water Steward'}</span>
          </h1>
          <p className="text-sm text-outline mt-1 font-sans">
            {formattedDate} — Tracking against baseline target of <span className="text-white font-medium">{formatVolume(target, user?.unitSystem)}</span>/day.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuickLogModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-container text-[#00344f] font-semibold text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Log Water Event</span>
          </button>
          <Link
            to="/analytics"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-surface-container border border-[#30353f]/60 text-on-surface hover:text-white hover:border-primary/40 text-sm font-medium transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">monitoring</span>
            <span className="hidden sm:inline">Telemetry</span>
          </Link>
        </div>
      </div>

      {/* Hero Overview Grid: Water Score Gauge & Daily Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Water Score Widget */}
        <div className="lg:col-span-5 bg-surface-container border border-[#30353f]/60 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-mono tracking-wider text-outline uppercase">COMPOSITE HYDRO METRIC</span>
              <h2 className="text-lg font-headline font-semibold text-white">Daily Water Score</h2>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded font-mono font-medium border"
              style={{
                borderColor: `${rating.color}40`,
                backgroundColor: `${rating.color}15`,
                color: rating.color,
              }}
            >
              {rating.grade} • {rating.label.toUpperCase()}
            </span>
          </div>

          {/* Circular Score Visualizer */}
          <div className="my-auto flex flex-col items-center justify-center py-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer SVG Gauge */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-surface-container-highest"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="transition-all duration-1000 ease-out"
                  stroke={rating.color}
                  strokeWidth="8"
                  strokeDasharray={263.89}
                  strokeDashoffset={263.89 - (263.89 * waterScore.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inner Stats */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tighter">
                  {waterScore.score}
                </span>
                <span className="text-[11px] font-mono text-outline tracking-wider uppercase mt-1">
                  OUT OF 100 PTS
                </span>
                <span className="text-xs text-primary/80 font-medium mt-1">
                  {waterScore.tierRank}
                </span>
              </div>
            </div>

            {/* Sub-breakdown: Efficiency & Consistency */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-4 border-t border-[#30353f]/40 text-center">
              <div>
                <div className="text-[11px] font-mono text-outline uppercase">Target Delta</div>
                <div className={`text-base font-semibold font-mono ${todayUsage <= target ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {todayUsage <= target ? `${(target - todayUsage).toFixed(1)}L under` : `+${(todayUsage - target).toFixed(1)}L over`}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-outline uppercase">Active Streak</div>
                <div className="text-base font-semibold font-mono text-white flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-amber-400 text-sm">local_fire_department</span>
                  <span>{user?.streakDays || 14} Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-outline/80 flex items-center justify-between pt-3 border-t border-[#30353f]/30">
            <span>Dynamic algorithm v2.4</span>
            <Link to="/about" className="text-primary hover:underline flex items-center gap-1">
              Methodology <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Daily Target & Consumption Stats */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Quick Metrics 3-Card Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4.5">
              <div className="flex items-center justify-between text-outline text-xs mb-2">
                <span className="font-mono uppercase text-[11px]">Today Consumed</span>
                <span className="material-symbols-outlined text-primary text-base">water_drop</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {formatVolume(todayUsage, user?.unitSystem)}
              </div>
              <div className="text-xs text-outline mt-1">
                {percentUsed}% of daily budget
              </div>
            </div>

            <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4.5">
              <div className="flex items-center justify-between text-outline text-xs mb-2">
                <span className="font-mono uppercase text-[11px]">Daily Allowance</span>
                <span className="material-symbols-outlined text-secondary text-base">flag</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {formatVolume(target, user?.unitSystem)}
              </div>
              <div className="text-xs text-outline mt-1">
                Target for {user?.householdSize || 2} occupants
              </div>
            </div>

            <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4.5">
              <div className="flex items-center justify-between text-outline text-xs mb-2">
                <span className="font-mono uppercase text-[11px]">Allowance Left</span>
                <span className={`material-symbols-outlined text-base ${isOverBudget ? 'text-error' : 'text-emerald-400'}`}>
                  {isOverBudget ? 'warning' : 'hourglass_bottom'}
                </span>
              </div>
              <div className={`text-2xl font-mono font-bold ${isOverBudget ? 'text-error' : 'text-emerald-400'}`}>
                {isOverBudget ? `-${formatVolume(todayUsage - target, user?.unitSystem)}` : formatVolume(remaining, user?.unitSystem)}
              </div>
              <div className="text-xs text-outline mt-1">
                {isOverBudget ? 'Budget exceeded' : 'Remaining capacity'}
              </div>
            </div>
          </div>

          {/* Category-Wise Progress Breakdown */}
          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-headline font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">pie_chart</span>
                Category-Wise Distribution
              </h3>
              <Link to="/tracker" className="text-xs text-primary hover:underline">
                View detailed logs
              </Link>
            </div>

            {/* Horizontal Segmented Bar */}
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden flex mb-4">
              {categoryBreakdown.map((cat) => (
                <div
                  key={cat.category}
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.colorHex,
                  }}
                  className="h-full transition-all duration-500 hover:brightness-125"
                  title={`${cat.categoryName}: ${cat.volumeLiters.toFixed(1)}L (${cat.percentage}%)`}
                />
              ))}
            </div>

            {/* Category Grid Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categoryBreakdown.slice(0, 4).map((cat) => (
                <div key={cat.category} className="bg-surface-container-low p-2.5 rounded-lg border border-[#30353f]/40">
                  <div className="flex items-center gap-1.5 text-xs mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.colorHex }} />
                    <span className="text-outline truncate">{cat.categoryName}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-white">
                    {formatVolume(cat.volumeLiters, user?.unitSystem)}
                  </div>
                  <div className="text-[10px] text-outline/80 font-mono">
                    {cat.percentage}% share
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hydro Conservation Tip of the Day */}
          <div className="bg-gradient-to-r from-primary/10 via-surface-container to-secondary/10 border border-primary/30 rounded-xl p-4.5 flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-headline font-semibold text-white">
                  Hydrologic Coach Insight
                </h4>
                <span className="text-[10px] font-mono text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                  TODAY'S TIP
                </span>
              </div>
              <p className="text-xs text-outline mt-1 leading-relaxed">
                {waterScore.score >= 80
                  ? 'Excellent stewardship! Your morning fixtures maintain peak hydro-efficiency. Consider aerator retrofits for utility sinks to lock in your score above 90.'
                  : 'Bathing and laundry fixtures account for your highest flow volume today. Reducing average shower duration by 2 minutes preserves ~18L per cycle.'}
              </p>
            </div>
            <Link
              to="/coach"
              className="self-center px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs text-primary font-medium border border-primary/20 whitespace-nowrap transition-colors"
            >
              Consult Coach
            </Link>
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Logs & Active Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Water Entries (Tracker Preview) */}
        <div className="lg:col-span-7 bg-surface-container border border-[#30353f]/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">history</span>
                Recent Hydrologic Entries
              </h3>
              <p className="text-xs text-outline">Real-time meter records and user logged events</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuickLogModalOpen(true)}
                className="text-xs font-semibold text-primary hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add Entry
              </button>
              <Link to="/tracker" className="text-xs text-outline hover:text-white ml-2">
                View All ({entries.length})
              </Link>
            </div>
          </div>

          {recentEntries.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[#30353f]/60 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">water_drop</span>
              <p className="text-sm text-outline">No water events logged yet today.</p>
              <button
                onClick={() => setQuickLogModalOpen(true)}
                className="mt-3 text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                Log your first consumption event
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#30353f]/40">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="py-3 flex items-center justify-between hover:bg-surface-container-low/50 px-2 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary border border-[#30353f]/60">
                      <span className="material-symbols-outlined text-lg">
                        {entry.category === 'bathing' ? 'shower' :
                         entry.category === 'kitchen' ? 'countertops' :
                         entry.category === 'laundry' ? 'local_laundry_service' :
                         entry.category === 'sanitary' ? 'wc' :
                         entry.category === 'garden' ? 'yard' : 'water_drop'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        <span>{entry.categoryName}</span>
                        {entry.verificationLevel === 'sensor' && (
                          <span className="text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded uppercase">
                            Sensor
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-outline flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{entry.locationNodeName}</span>
                        <span>•</span>
                        <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {entry.note && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{entry.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-white">
                        {formatVolume(entry.volumeLiters, user?.unitSystem)}
                      </div>
                      <div className="text-[10px] text-outline font-mono">
                        {entry.flowRateDuration || 'Standard draw'}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-error transition-opacity cursor-pointer"
                      title="Delete entry"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coach Quests & Navigation Quicklinks */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Quests Preview */}
          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">task_alt</span>
                Active Hydro Quests
              </h3>
              <Link to="/coach" className="text-xs text-secondary hover:underline">
                View All Quests
              </Link>
            </div>

            <div className="space-y-3">
              {coachQuests.slice(0, 2).map((quest) => (
                <div key={quest.id} className="bg-surface-container-low p-3.5 rounded-lg border border-[#30353f]/40">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-white">{quest.title}</span>
                    <span className="text-[11px] font-mono text-secondary">+{quest.estimatedSavingsLiters}L/wk</span>
                  </div>
                  <p className="text-xs text-outline line-clamp-1 mb-2.5">{quest.description}</p>
                  
                  <div className="flex justify-between items-center text-[10px] font-mono text-outline">
                    <span>{quest.impactBadge}</span>
                    <span className="text-secondary">{quest.syncLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Quick Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/tracker"
              className="p-3.5 rounded-xl bg-surface-container-low border border-[#30353f]/40 hover:border-primary/50 transition-all group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Water Tracker</div>
                <div className="text-xs text-outline mt-0.5">Filter, edit & log entries</div>
              </div>
            </Link>

            <Link
              to="/challenges"
              className="p-3.5 rounded-xl bg-surface-container-low border border-[#30353f]/40 hover:border-secondary/50 transition-all group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-lg">emoji_events</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-secondary transition-colors">Challenges</div>
                <div className="text-xs text-outline mt-0.5">{badges.filter((b) => b.status === 'unlocked').length} badges unlocked</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
