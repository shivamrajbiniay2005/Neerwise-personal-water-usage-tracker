export type UnitSystem = 'liters' | 'gallons';
export type StrictnessLevel = 'tolerant' | 'nominal' | 'rigorous';
export type FixtureCategory = 
  | 'bathing' 
  | 'kitchen' 
  | 'laundry' 
  | 'sanitary' 
  | 'garden' 
  | 'cleaning' 
  | 'custom';

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  role: string;
  hardwareNode: string;
  municipalSector: string;
  memberSince: string;
  householdSize: number;
  occupancyDescription: string;
  residenceType: 'apt' | 'single' | 'eco';
  residenceTypeName: string;
  targetLitersPerDay: number;
  unitSystem: UnitSystem;
  strictness: StrictnessLevel;
  climateAutoAdjust: boolean;
  ecoTariffYtd: number;
  streakDays: number;
  activeSensorsCount: number;
  badgesUnlockedCount: number;
  totalSparedVolumeLiters: number;
}

export interface WaterEntry {
  id: string;
  userId: string;
  category: FixtureCategory;
  categoryName: string;
  volumeLiters: number;
  timestamp: string; // ISO string
  locationNode: string;
  locationNodeName: string;
  verificationLevel: 'sensor' | 'manual' | 'appliance' | 'aerator';
  flowRateDuration?: string;
  note?: string;
}

export interface WaterScoreResult {
  score: number;
  grade: string;
  tierRank: string;
  percentileText: string;
  volumetricFactor: number;
  consistencyFactor: number;
  leakRectificationFactor: number;
  isCalibrating: boolean;
  totalLoggedTodayLiters: number;
  dailyTargetLiters: number;
  remainingLiters: number;
  percentUtilized: number;
}

export interface CategoryBreakdown {
  category: FixtureCategory;
  categoryName: string;
  volumeLiters: number;
  percentage: number;
  icon: string;
  colorHex: string;
}

export interface Challenge {
  id: string;
  sprintNumber: string;
  title: string;
  description: string;
  category: string;
  currentDay: number;
  totalDays: number;
  daysMet: number;
  percentage: number;
  status: 'active' | 'upcoming' | 'completed';
  rewardBadge: string;
  scoreBonus: string;
  tariffRebate: string;
  sectorHouseholdCount: number;
  endsInText: string;
}

export interface Badge {
  id: string;
  name: string;
  tier: 'Gold Tier' | 'Platinum Tier' | 'Silver Tier' | 'Bronze Tier' | 'Legendary';
  tierCategory: 'conservation' | 'sensor' | 'community' | 'legendary';
  description: string;
  unlockedAt?: string;
  points: number;
  icon: string;
  status: 'unlocked' | 'in_progress' | 'locked';
  progressPercent?: number;
  progressLabel?: string;
}

export interface CoachQuest {
  id: string;
  title: string;
  category: string;
  impactType: 'high' | 'quick' | 'anomaly';
  impactBadge: string;
  estimatedSavingsLiters: number;
  savingsPeriod: string;
  description: string;
  isCompletedToday: boolean;
  sensorSynced: boolean;
  syncLabel: string;
  actionPrimaryText: string;
  actionSecondaryText?: string;
  priceNote?: string;
}

export interface DailyMicroHabit {
  id: string;
  title: string;
  savedLitersEst: number;
  isDone: boolean;
  statusText: string;
  icon: string;
}
