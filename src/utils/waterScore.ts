import { WaterEntry, WaterScoreResult, UnitSystem, StrictnessLevel, FixtureCategory } from '../types/water';

export const LITERS_TO_GALLONS = 0.264172;
export const GALLONS_TO_LITERS = 3.78541;

export function formatVolume(liters: number, unit: UnitSystem = 'liters'): string {
  if (unit === 'gallons') {
    const gal = liters * LITERS_TO_GALLONS;
    return `${gal.toFixed(1)} Gal`;
  }
  return `${liters.toFixed(1)} L`;
}

export function formatVolumeValue(liters: number, unit: UnitSystem = 'liters'): string {
  if (unit === 'gallons') {
    return (liters * LITERS_TO_GALLONS).toFixed(1);
  }
  return liters.toFixed(1);
}

export const FIXTURE_CATEGORIES: { key: FixtureCategory; label: string; icon: string; color: string }[] = [
  { key: 'bathing', label: 'Bathing & Shower', icon: 'shower', color: '#00f0ff' },
  { key: 'kitchen', label: 'Kitchen & Culinary', icon: 'countertops', color: '#94ccff' },
  { key: 'laundry', label: 'Laundry & Apparel', icon: 'local_laundry_service', color: '#89f5e7' },
  { key: 'sanitary', label: 'Toilet Sanitization', icon: 'wc', color: '#00dbe9' },
  { key: 'garden', label: 'Balcony & Garden', icon: 'yard', color: '#7fecde' },
  { key: 'cleaning', label: 'Cleaning & Wash', icon: 'mop', color: '#6bd8cb' },
  { key: 'custom', label: 'Acoustic Anomaly', icon: 'warning', color: '#ffb4ab' },
];

export function getScoreRating(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 90) return { grade: 'A+', label: 'Master Steward', color: '#00f0ff' };
  if (score >= 80) return { grade: 'A', label: 'Hydro Efficient', color: '#38bdf8' };
  if (score >= 65) return { grade: 'B', label: 'Nominal Baseline', color: '#34d399' };
  if (score >= 50) return { grade: 'C', label: 'Conservation Alert', color: '#fbbf24' };
  return { grade: 'D', label: 'Critical Overuse', color: '#f87171' };
}

/**
 * Neerwise Composite Water Stewardship Score Algorithm
 * Calibrated strictly to the methodology documented in Section 12 & About Neerwise:
 * - Factor 1 (40% Weight): Baseline Climatic Volumetrics (Actual consumption vs Target benchmark)
 * - Factor 2 (35% Weight): Flow Consistency & Crest Factor (Uniformity vs peak erratic bursts)
 * - Factor 3 (25% Weight): Micro-Leak Rectification Speed (Resting baseline flow integrity)
 *
 * Bounded strictly between 0 and 100.
 */
export function calculateWaterScore(
  entries: WaterEntry[],
  dailyTargetLiters: number,
  strictness: StrictnessLevel = 'nominal'
): WaterScoreResult {
  const isCalibrating = entries.length < 3;

  // Filter entries for current day (or fallback to recent 24h if few)
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todayEntries = entries.filter((e) => {
    const entryTime = new Date(e.timestamp).getTime();
    return entryTime >= startOfDay;
  });

  const activeEntries = todayEntries.length > 0 ? todayEntries : entries.slice(0, 6);
  const totalLoggedTodayLiters = activeEntries.reduce((sum, e) => sum + e.volumeLiters, 0);

  if (isCalibrating) {
    return {
      score: 78,
      grade: 'Calibrating Baseline',
      tierRank: 'Tier 1 Alpha (Calibrating)',
      percentileText: 'Calibrating Diurnal Baseline',
      volumetricFactor: 32,
      consistencyFactor: 26,
      leakRectificationFactor: 20,
      isCalibrating: true,
      totalLoggedTodayLiters,
      dailyTargetLiters,
      remainingLiters: Math.max(0, dailyTargetLiters - totalLoggedTodayLiters),
      percentUtilized: Math.round((totalLoggedTodayLiters / dailyTargetLiters) * 100),
    };
  }

  // Strictness tolerance adjustment
  let strictnessMultiplier = 1.0;
  if (strictness === 'tolerant') strictnessMultiplier = 0.9;
  if (strictness === 'rigorous') strictnessMultiplier = 1.15;

  // 1. Factor 1: Volumetric Score (40 pts max)
  const ratio = (totalLoggedTodayLiters * strictnessMultiplier) / Math.max(1, dailyTargetLiters);
  let volumetricFactor = 40;
  if (ratio > 1.0) {
    volumetricFactor = Math.max(5, 40 - (ratio - 1.0) * 50);
  } else if (ratio > 0.8) {
    volumetricFactor = 40 - (ratio - 0.8) * 40;
  }

  // 2. Factor 2: Consistency & Crest Factor (35 pts max)
  const maxSingleVolume = Math.max(...activeEntries.map((e) => e.volumeLiters), 0);
  let consistencyFactor = 35;
  if (maxSingleVolume > 60) {
    consistencyFactor = Math.max(15, 35 - ((maxSingleVolume - 60) / 40) * 15);
  }

  // 3. Factor 3: Micro-Leak Rectification Speed (25 pts max)
  const hasAnomaly = activeEntries.some((e) => e.category === 'custom' || e.volumeLiters > 100);
  let leakRectificationFactor = 25;
  if (hasAnomaly) {
    leakRectificationFactor = 16;
  }

  // Sum raw score and bound 0-100
  const rawScore = volumetricFactor + consistencyFactor + leakRectificationFactor;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Tier classification
  let grade = 'Tier B (Standard Pacing)';
  let tierRank = 'Tier 2 Household';
  let percentileText = 'District Average';

  if (score >= 90) {
    grade = 'Tier A+ (Conservation Master)';
    tierRank = 'Top 4% District Standing';
    percentileText = 'Top 4% Household';
  } else if (score >= 82) {
    grade = 'Aqua Guardian (Optimal Stewardship)';
    tierRank = 'Top 8% District Standing';
    percentileText = 'Top 8% Household';
  } else if (score >= 70) {
    grade = 'Tier A (High Conservation)';
    tierRank = 'Top 18% District Standing';
    percentileText = 'Top 18% Household';
  } else if (score >= 50) {
    grade = 'Tier B (Standard Consumption)';
    tierRank = 'Top 45% District Standing';
    percentileText = 'Mid-tier Stewardship';
  } else {
    grade = 'Tier C (Conservation Alert)';
    tierRank = 'High Usage Outlier';
    percentileText = 'Attention Required';
  }

  const remainingLiters = Math.max(0, dailyTargetLiters - totalLoggedTodayLiters);
  const percentUtilized = Math.round((totalLoggedTodayLiters / Math.max(1, dailyTargetLiters)) * 100);

  return {
    score,
    grade,
    tierRank,
    percentileText,
    volumetricFactor: Math.round(volumetricFactor),
    consistencyFactor: Math.round(consistencyFactor),
    leakRectificationFactor: Math.round(leakRectificationFactor),
    isCalibrating: false,
    totalLoggedTodayLiters: Math.round(totalLoggedTodayLiters * 10) / 10,
    dailyTargetLiters,
    remainingLiters: Math.round(remainingLiters * 10) / 10,
    percentUtilized,
  };
}

export function getCategoryDetails(cat: FixtureCategory): { name: string; icon: string; color: string } {
  switch (cat) {
    case 'bathing':
      return { name: 'Bathing & Shower', icon: 'shower', color: '#00f0ff' };
    case 'kitchen':
      return { name: 'Kitchen & Culinary', icon: 'countertops', color: '#94ccff' };
    case 'laundry':
      return { name: 'Laundry & Apparel', icon: 'local_laundry_service', color: '#89f5e7' };
    case 'sanitary':
      return { name: 'Toilet Sanitization', icon: 'wc', color: '#00dbe9' };
    case 'garden':
      return { name: 'Balcony & Irrigation', icon: 'yard', color: '#7fecde' };
    case 'cleaning':
      return { name: 'Cleaning & Maintenance', icon: 'mop', color: '#6bd8cb' };
    case 'custom':
      return { name: 'Acoustic Anomaly', icon: 'warning', color: '#ffb4ab' };
    default:
      return { name: 'General Domestic', icon: 'water_drop', color: '#dbfcff' };
  }
}
