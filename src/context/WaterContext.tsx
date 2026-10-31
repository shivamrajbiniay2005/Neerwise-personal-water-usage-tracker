import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  WaterEntry,
  WaterScoreResult,
  CategoryBreakdown,
  Challenge,
  Badge,
  CoachQuest,
  DailyMicroHabit,
  FixtureCategory,
} from '../types/water';
import { useAuth } from './AuthContext';
import {
  INITIAL_WATER_ENTRIES,
  INITIAL_CHALLENGES,
  INITIAL_BADGES,
  INITIAL_COACH_QUESTS,
  INITIAL_MICRO_HABITS,
} from '../data/mockData';
import { calculateWaterScore, getCategoryDetails } from '../utils/waterScore';

interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
}

interface WaterContextType {
  entries: WaterEntry[];
  addEntry: (entry: Omit<WaterEntry, 'id' | 'userId'>) => void;
  updateEntry: (id: string, updates: Partial<WaterEntry>) => void;
  deleteEntry: (id: string) => void;
  batchDeleteEntries: (ids: string[]) => void;
  waterScore: WaterScoreResult;
  categoryBreakdown: CategoryBreakdown[];
  challenges: Challenge[];
  completeChallengeStep: (challengeId: string) => void;
  badges: Badge[];
  coachQuests: CoachQuest[];
  toggleQuestCompleted: (questId: string) => void;
  microHabits: DailyMicroHabit[];
  toggleHabitDone: (habitId: string) => void;
  quickLogModalOpen: boolean;
  setQuickLogModalOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: string) => void;
  removeToast: (id: string) => void;
  recalculateIndex: () => void;
  resetToDefaults: () => void;
  exportCsv: () => void;
}

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const storageKey = `neerwise_entries_${userId}`;
  const challengesKey = `neerwise_challenges_${userId}`;
  const questsKey = `neerwise_quests_${userId}`;
  const habitsKey = `neerwise_habits_${userId}`;

  // Water entries state
  const [entries, setEntries] = useState<WaterEntry[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_WATER_ENTRIES;
  });

  // Challenges state
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem(challengesKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CHALLENGES;
  });

  // Badges state
  const [badges] = useState<Badge[]>(INITIAL_BADGES);

  // Coach quests state
  const [coachQuests, setCoachQuests] = useState<CoachQuest[]>(() => {
    try {
      const saved = localStorage.getItem(questsKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COACH_QUESTS;
  });

  // Micro-habits state
  const [microHabits, setMicroHabits] = useState<DailyMicroHabit[]>(() => {
    try {
      const saved = localStorage.getItem(habitsKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MICRO_HABITS;
  });

  // UI state
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (userId) {
      localStorage.setItem(storageKey, JSON.stringify(entries));
    }
  }, [entries, storageKey, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(challengesKey, JSON.stringify(challenges));
    }
  }, [challenges, challengesKey, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(questsKey, JSON.stringify(coachQuests));
    }
  }, [coachQuests, questsKey, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(habitsKey, JSON.stringify(microHabits));
    }
  }, [microHabits, habitsKey, userId]);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success',
    icon = 'verified'
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: Toast = { id, title, message, type, icon };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addEntry = (entryData: Omit<WaterEntry, 'id' | 'userId'>) => {
    const newEntry: WaterEntry = {
      ...entryData,
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
    };
    setEntries((prev) => [newEntry, ...prev]);
    showToast(
      'Telemetry Recorded',
      `Logged ${entryData.volumeLiters.toFixed(1)}L under ${entryData.categoryName}. Water score refreshed.`,
      'success',
      'water_drop'
    );
  };

  const updateEntry = (id: string, updates: Partial<WaterEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    showToast('Entry Updated', 'Telemetry record parameters adjusted successfully.', 'info', 'tune');
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showToast('Record Purged', 'Telemetry entry expunged from local ledger.', 'warning', 'delete');
  };

  const batchDeleteEntries = (ids: string[]) => {
    setEntries((prev) => prev.filter((e) => !ids.includes(e.id)));
    showToast('Batch Cleared', `${ids.length} selected events cleared from ledger.`, 'warning', 'playlist_remove');
  };

  // Water score calculation derived from records
  const targetLiters = user?.targetLitersPerDay || 135;
  const strictness = user?.strictness || 'nominal';

  const waterScore = useMemo(() => {
    return calculateWaterScore(entries, targetLiters, strictness);
  }, [entries, targetLiters, strictness]);

  // Category breakdown calculation
  const categoryBreakdown = useMemo((): CategoryBreakdown[] => {
    const totals: Record<FixtureCategory, number> = {
      bathing: 0,
      kitchen: 0,
      laundry: 0,
      sanitary: 0,
      garden: 0,
      cleaning: 0,
      custom: 0,
    };

    entries.forEach((e) => {
      const cat = e.category in totals ? e.category : 'custom';
      totals[cat] += e.volumeLiters;
    });

    const sumTotal = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

    return (Object.keys(totals) as FixtureCategory[]).map((cat) => {
      const details = getCategoryDetails(cat);
      const volumeLiters = Math.round(totals[cat] * 10) / 10;
      const percentage = Math.round((totals[cat] / sumTotal) * 100);
      return {
        category: cat,
        categoryName: details.name,
        volumeLiters,
        percentage,
        icon: details.icon,
        colorHex: details.color,
      };
    });
  }, [entries]);

  const completeChallengeStep = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          const nextDays = Math.min(c.totalDays, c.daysMet + 1);
          const nextPercent = Math.round((nextDays / c.totalDays) * 1000) / 10;
          return {
            ...c,
            daysMet: nextDays,
            percentage: nextPercent,
            status: nextDays >= c.totalDays ? 'completed' : 'active',
          };
        }
        return c;
      })
    );
    showToast(
      'Challenge Progress Synced',
      'Today shower time verified under 4 minutes! Streak advancement registered.',
      'success',
      'timer'
    );
  };

  const toggleQuestCompleted = (questId: string) => {
    setCoachQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const next = !q.isCompletedToday;
          return { ...q, isCompletedToday: next };
        }
        return q;
      })
    );
    showToast('Coach Quest Updated', 'Conservation quest status recorded.', 'info', 'smart_toy');
  };

  const toggleHabitDone = (habitId: string) => {
    setMicroHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const next = !h.isDone;
          return { ...h, isDone: next };
        }
        return h;
      })
    );
    showToast('Micro-Habit Logged', 'Conservation habit status updated (+1 pt)', 'success', 'done');
  };

  const recalculateIndex = () => {
    showToast('Index Recalibrated', 'Hydro-telemetry index re-synchronized across connected fixtures.', 'info', 'sync');
  };

  const resetToDefaults = () => {
    setEntries(INITIAL_WATER_ENTRIES);
    setChallenges(INITIAL_CHALLENGES);
    setCoachQuests(INITIAL_COACH_QUESTS);
    setMicroHabits(INITIAL_MICRO_HABITS);
    showToast('Factory Calibration Restored', 'Reset local ledger to standard baseline sample events.', 'info', 'restart_alt');
  };

  const exportCsv = () => {
    if (entries.length === 0) {
      showToast('No Records', 'No telemetry entries available to export.', 'warning', 'info');
      return;
    }
    const headers = ['ID', 'Timestamp', 'Activity', 'Category', 'Volume (L)', 'Location Node', 'Verification'];
    const rows = entries.map((e) => [
      e.id,
      `"${e.timestamp}"`,
      `"${e.categoryName}"`,
      e.category,
      e.volumeLiters,
      `"${e.locationNodeName}"`,
      e.verificationLevel,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `neerwise_water_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Export Ready', 'Downloaded continuous water telemetry ledger.', 'success', 'download');
  };

  return (
    <WaterContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        batchDeleteEntries,
        waterScore,
        categoryBreakdown,
        challenges,
        completeChallengeStep,
        badges,
        coachQuests,
        toggleQuestCompleted,
        microHabits,
        toggleHabitDone,
        quickLogModalOpen,
        setQuickLogModalOpen,
        toasts,
        showToast,
        removeToast,
        recalculateIndex,
        resetToDefaults,
        exportCsv,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
};
