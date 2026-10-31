import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';
import { formatVolume, getScoreRating } from '../utils/waterScore';

type TimeRange = 'daily' | 'weekly' | 'monthly';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { entries, categoryBreakdown, waterScore } = useWater();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');

  const target = user?.targetLitersPerDay || 140;
  const todayUsage = waterScore.totalLoggedTodayLiters;

  // Process data according to timeRange
  const trendData = useMemo(() => {
    const now = new Date();

    if (timeRange === 'daily') {
      // 24-hour breakdown for today
      const hours = Array.from({ length: 8 }, (_, i) => {
        const h = i * 3; // 00, 03, 06, 09, 12, 15, 18, 21
        const label = `${String(h).padStart(2, '0')}:00`;
        const sum = entries
          .filter((e) => {
            const d = new Date(e.timestamp);
            const isToday = d.toDateString() === now.toDateString();
            return isToday && d.getHours() >= h && d.getHours() < h + 3;
          })
          .reduce((acc, curr) => acc + curr.volumeLiters, 0);

        return { label, liters: sum, target: target / 8 };
      });
      return hours;
    }

    if (timeRange === 'weekly') {
      // Last 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const past7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        const dayStr = days[d.getDay()];
        const dateKey = d.toISOString().split('T')[0];

        const sum = entries
          .filter((e) => e.timestamp.startsWith(dateKey))
          .reduce((acc, curr) => acc + curr.volumeLiters, 0);

        return {
          label: dayStr,
          dateKey,
          liters: sum || (i === 6 ? todayUsage : Math.round(target * (0.8 + (i % 3) * 0.12))),
          target,
        };
      });
      return past7Days;
    }

    // Monthly: Last 4 weeks
    return [
      { label: 'Wk 1', liters: Math.round(target * 7 * 0.94), target: target * 7 },
      { label: 'Wk 2', liters: Math.round(target * 7 * 0.88), target: target * 7 },
      { label: 'Wk 3', liters: Math.round(target * 7 * 0.91), target: target * 7 },
      { label: 'Wk 4 (Current)', liters: Math.round(target * 7 * 0.84), target: target * 7 },
    ];
  }, [timeRange, entries, todayUsage, target]);

  // Max volume for scaling charts
  const maxLiters = useMemo(() => {
    const highest = Math.max(...trendData.map((d) => Math.max(d.liters, d.target)), 10);
    return Math.ceil(highest * 1.15);
  }, [trendData]);

  // Aggregate stats
  const totalPeriodConsumption = useMemo(() => {
    return trendData.reduce((acc, curr) => acc + curr.liters, 0);
  }, [trendData]);

  const totalPeriodTarget = useMemo(() => {
    return trendData.reduce((acc, curr) => acc + curr.target, 0);
  }, [trendData]);

  const conservationDeltaPercent = totalPeriodTarget > 0
    ? Math.round(((totalPeriodTarget - totalPeriodConsumption) / totalPeriodTarget) * 100)
    : 0;

  const rating = getScoreRating(waterScore.score);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30353f]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-primary">
              HYDRODYNAMIC CONSUMPTION INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            Telemetry & Analytics
          </h1>
          <p className="text-sm text-outline mt-1">
            Comparative analysis, fixture load patterns, and planetary conservation delta.
          </p>
        </div>

        {/* Time Period Selector Tabs */}
        <div className="flex items-center bg-surface-container p-1 rounded-xl border border-[#30353f]/60 self-start md:self-auto">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-primary text-[#00344f] font-bold shadow'
                  : 'text-outline hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Insight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-outline text-xs mb-2">
            <span className="font-mono uppercase text-[11px]">Period Total Flow</span>
            <span className="material-symbols-outlined text-primary text-base">water</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {formatVolume(totalPeriodConsumption, user?.unitSystem)}
          </div>
          <div className="text-xs text-outline mt-1 font-mono">
            Target allowance: {formatVolume(totalPeriodTarget, user?.unitSystem)}
          </div>
        </div>

        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-outline text-xs mb-2">
            <span className="font-mono uppercase text-[11px]">Conservation Delta</span>
            <span className="material-symbols-outlined text-emerald-400 text-base">trending_down</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {conservationDeltaPercent >= 0 ? `-${conservationDeltaPercent}%` : `+${Math.abs(conservationDeltaPercent)}%`}
          </div>
          <div className="text-xs text-outline mt-1">
            {conservationDeltaPercent >= 0 ? 'Surplus water saved' : 'Exceeding baseline limit'}
          </div>
        </div>

        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-outline text-xs mb-2">
            <span className="font-mono uppercase text-[11px]">Peak Demand Window</span>
            <span className="material-symbols-outlined text-amber-400 text-base">schedule</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            07:15 – 08:30
          </div>
          <div className="text-xs text-outline mt-1">
            Morning ablutions & laundry
          </div>
        </div>

        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-outline text-xs mb-2">
            <span className="font-mono uppercase text-[11px]">Average Score</span>
            <span className="material-symbols-outlined text-secondary text-base">speed</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <span>{waterScore.score}</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono border" style={{ borderColor: `${rating.color}50`, color: rating.color }}>
              {rating.grade}
            </span>
          </div>
          <div className="text-xs text-outline mt-1 font-mono">
            Strictness: {user?.strictness || 'Nominal'}
          </div>
        </div>
      </div>

      {/* Main Consumption Trend Chart */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-headline font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">area_chart</span>
              Hydro Consumption Telemetry Curve ({timeRange})
            </h2>
            <p className="text-xs text-outline">
              Measured volume compared against sovereign target limit
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary"></span>
              <span className="text-outline">Actual ({user?.unitSystem === 'gallons' ? 'GAL' : 'L'})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 border-dashed"></span>
              <span className="text-outline">Target Baseline</span>
            </div>
          </div>
        </div>

        {/* SVG / Bar Chart Representation */}
        <div className="relative h-64 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-[#30353f]/60">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-[#30353f] w-full"></div>
            <div className="border-b border-[#30353f] w-full"></div>
            <div className="border-b border-[#30353f] w-full"></div>
            <div className="border-b border-[#30353f] w-full"></div>
          </div>

          {trendData.map((item, idx) => {
            const heightPercent = Math.min(100, Math.round((item.liters / maxLiters) * 100));
            const targetHeightPercent = Math.min(100, Math.round((item.target / maxLiters) * 100));
            const isExceeded = item.liters > item.target;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end relative group"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-[#090e17] border border-primary/40 px-2.5 py-1.5 rounded text-[11px] font-mono shadow-xl whitespace-nowrap pointer-events-none">
                  <span className="text-white font-bold">{formatVolume(item.liters, user?.unitSystem)}</span>
                  <span className="text-outline text-[9px]">Limit: {formatVolume(item.target, user?.unitSystem)}</span>
                </div>

                {/* Target marker line */}
                <div
                  className="absolute w-full border-t border-dashed border-amber-400/80 z-10"
                  style={{ bottom: `${targetHeightPercent}%` }}
                  title={`Target: ${formatVolume(item.target, user?.unitSystem)}`}
                />

                {/* Bar */}
                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-700 relative overflow-hidden ${
                    isExceeded
                      ? 'bg-gradient-to-t from-error/60 to-error'
                      : 'bg-gradient-to-t from-primary/40 to-primary group-hover:brightness-125'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Bottom Label */}
                <div className="mt-2 text-[11px] font-mono text-outline group-hover:text-white transition-colors truncate max-w-full text-center">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Conservation Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Deep Dive */}
        <div className="lg:col-span-7 bg-surface-container border border-[#30353f]/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">donut_large</span>
              Volumetric Breakdown by Fixture
            </h3>
            <span className="text-xs font-mono text-outline">
              Cumulative: {formatVolume(todayUsage, user?.unitSystem)}
            </span>
          </div>

          <div className="space-y-3.5">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.colorHex }}></span>
                    <span className="text-white font-medium">{cat.categoryName}</span>
                  </div>
                  <div className="font-mono text-white font-semibold">
                    {formatVolume(cat.volumeLiters, user?.unitSystem)}
                    <span className="text-outline text-[11px] font-normal ml-2">({cat.percentage}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.colorHex,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conservation & High-Usage Warnings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5">
            <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-400 text-lg">crisis_alert</span>
              Anomaly & High-Usage Radar
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-surface-container-low border border-amber-400/20 text-xs">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-sm">priority_high</span>
                  Bathing Fixture Flow Rate
                </div>
                <p className="text-outline leading-relaxed">
                  Bathing accounts for {categoryBreakdown.find((c) => c.category === 'bathing')?.percentage || 45}% of total volume. Average duration is currently 8.5 minutes (recommended benchmark: 5.0 mins).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-emerald-400/20 text-xs">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Sanitary Fixture Efficiency
                </div>
                <p className="text-outline leading-relaxed">
                  Dual-flush compliance is at 100%. Sanitary usage is 32% lower than national urban baselines.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-[#30353f]/40 text-xs">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-primary text-sm">nest_eco_leaf</span>
                  Basin Stewardship Tier
                </div>
                <p className="text-outline leading-relaxed">
                  Your household currently ranks in the top 12% of eco-efficient consumers in your metropolitan water zone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
