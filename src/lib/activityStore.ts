// Simple activity tracking store - focused and clean
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActivityData {
  totalHours: number;
  thisWeekSessions: number;
  currentStreak: number;
  lastSession: string | null;
  // Optional activity-specific fields
  fitnessTestHighest?: number;
  fitnessTestThisMonth?: number;
  // Fitness test monthly trend
  fitnessTestTrend?: Array<{ date: string; score: number; ts?: number }>;
  // Boxing tape tracking
  boxingTapeHours?: number;
  kickboxingTapeHours?: number;
  mmaTapeHours?: number;
  // Optional time-series for tape watched (weekly progression)
  boxingTapeTrend?: Array<{ date: string; ts?: number; boxing?: number; kickboxing?: number; mma?: number }>;
  // Gym-specific optional fields
  powerLiftNames?: string[]; // e.g., ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts']
  powerLiftWeights?: number[]; // e.g., [100, 50, 50, 50]
  // User body weight tracking (for trend chart)
  weightTrend?: Array<{ date: string; weight: number; ts?: number }>; // chronological order; ts=epoch ms
  // Goal weight for gym
  goalWeight?: number;
  // Boxing-specific optional fields
  totalFights?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  // Oud-specific optional fields
  totalConcerts?: number;
  // Daily goal tracking
  dailyGoalMinutes?: number;
  todayMinutes?: number;
  todayDate?: string;
  // Language-specific: number of books read
  booksRead?: number;
}

interface ActivityStore {
  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  loadTemplate: (templateName: 'personal-dev' | 'athlete' | 'polyglot' | 'fitness' | 'blank') => void;
  
  // Language books read
  setBooksRead: (activity: 'spanish' | 'german', count: number) => void;
  setCustomBooksRead: (slug: string, count: number) => void;
  boxing: ActivityData;
  gym: ActivityData;
  oud: ActivityData;
  violin: ActivityData;
  spanish: ActivityData;
  german: ActivityData;
  customActivities: Record<string, { name: string; template?: 'none'|'boxing'|'gym'|'music'|'language'; data: ActivityData }>;

  addHours: (activity: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german', hours: number) => void;
  getActivityData: (activity: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german') => ActivityData;
  recordBoxingFight: (result: 'win' | 'loss' | 'draw') => void;
  addConcert: () => void;
  setTotalConcerts: (activity: 'oud' | 'violin', count: number) => void;
  addTapeHours: (kind: 'boxing' | 'kickboxing' | 'mma', hours: number) => void;
  addBoxingTapeEntry: (boxingH: number, kickH: number, mmaH: number, dateLabel?: string) => void;
  updateBoxingTapeAt: (index: number, boxingH?: number, kickH?: number, mmaH?: number, dateLabel?: string) => void;
  deleteBoxingTapeAt: (index: number) => void;
  resetBoxingTape: () => void;
  // Fitness trend CRUD
  addFitnessScore: (score: number, dateLabel?: string) => void;
  updateFitnessScoreAt: (index: number, score?: number, dateLabel?: string) => void;
  deleteFitnessScoreAt: (index: number) => void;
  // Custom activities API
  addCustomActivity: (slug: string, name: string, template?: 'none'|'boxing'|'gym'|'music'|'language') => void;
  addCustomHours: (slug: string, hours: number) => void;
  getCustomActivity: (slug: string) => { name: string; data: ActivityData } | undefined;
  listCustomActivities: () => Array<{ slug: string; name: string; data: ActivityData }>;
  deleteCustomActivity: (slug: string) => void;
  // Custom template helpers (mirror core where needed)
  addCustomTapeHours: (slug: string, kind: 'boxing' | 'kickboxing' | 'mma', hours: number) => void;
  updateCustomPowerLiftName: (slug: string, index: number, name: string) => void;
  updateCustomPowerLiftWeight: (slug: string, index: number, weight: number) => void;
  addCustomWeight: (slug: string, weight: number, dateLabel?: string) => void;
  updateCustomExerciseName: (slug: string, id: string, name: string) => void;
  addCustomExerciseWeight: (slug: string, id: string, weight: number, reps?: number | null, dateLabel?: string) => void;
  // Gym
  updateGymPowerLiftName: (index: number, name: string) => void;
  updateGymPowerLiftWeight: (index: number, weight: number) => void;
  addGymPowerLift: (name: string, weight?: number) => void;
  removeGymPowerLift: (index: number) => void;
  addGymWeight: (weight: number, dateLabel?: string) => void;
  updateGymWeightAt: (index: number, weight?: number, dateLabel?: string) => void;
  deleteGymWeightAt: (index: number) => void;
  setGymGoalWeight: (weight: number) => void;
  // Daily activities
  dailyActivityNames: string[];
  updateDailyActivityName: (index: number, name: string) => void;
  // Daily Activities list (add/delete/rename)
  dailyActivityList: Array<{ id: string; name: string; category: string }>;
  addDailyActivity: (name: string, category: string) => void;
  removeDailyActivity: (id: string) => void;
  renameDailyActivity: (id: string, name: string) => void;
  // Gym Exercise names (for progress selector)
  gymExerciseNames: Record<string, string>;
  updateGymExerciseName: (id: string, name: string) => void;
  // Gym Exercise categories and CRUD
  gymExerciseCategories: Record<string, 'push' | 'pull' | 'legs' | 'other'>;
  addGymExercise: (name: string, category: 'push' | 'pull' | 'legs' | 'other') => string;
  removeGymExercise: (id: string) => void;
  // Optional: update category later
  updateGymExerciseCategory?: (id: string, category: 'push' | 'pull' | 'legs' | 'other') => void;
  // Gym Exercise progress (weights timeline)
  gymExerciseProgress: Record<string, Array<{ date: string; weight: number; reps?: number | null; ts?: number }>>;
  addGymExerciseWeight: (id: string, weight: number, reps?: number | null, dateLabel?: string) => void;
  // Core activity visibility
  hiddenActivities: Record<string, boolean>;
  hideActivity: (key: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german') => void;
  restoreActivity: (key: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german') => void;
  // Manual edits
  setActivityTotalHours: (activity: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german', hours: number) => void;
  setCustomActivityTotalHours: (slug: string, hours: number) => void;
  // Daily goal methods
  setDailyGoal: (activity: 'boxing' | 'oud' | 'violin' | 'spanish' | 'german', minutes: number) => void;
  setCustomDailyGoal: (slug: string, minutes: number) => void;
  addTodayMinutes: (activity: 'boxing' | 'oud' | 'violin' | 'spanish' | 'german', minutes: number) => void;
  addCustomTodayMinutes: (slug: string, minutes: number) => void;
}

const initialActivityData: ActivityData = {
  totalHours: 0,
  thisWeekSessions: 0,
  currentStreak: 0,
  lastSession: null,
  dailyGoalMinutes: 30, // Default 30 minutes
  todayMinutes: 0,
  todayDate: new Date().toDateString(),
};

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
  customActivities: {},
  hiddenActivities: {},
      hasCompletedOnboarding: false,
      dailyActivityNames: [],
      dailyActivityList: [],
      gymExerciseNames: {},
      gymExerciseCategories: {},
      gymExerciseProgress: {},
      boxing: { 
        ...initialActivityData,
        fitnessTestTrend: [],
        boxingTapeHours: 0,
        kickboxingTapeHours: 0,
        mmaTapeHours: 0,
        boxingTapeTrend: [],
        totalFights: 0,
        wins: 0,
        losses: 0,
        draws: 0,
      },
      gym: { 
        ...initialActivityData,
        powerLiftNames: ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'],
        powerLiftWeights: [0, 0, 0, 0],
        weightTrend: [],
      },
      oud: { ...initialActivityData, totalConcerts: 0 },
      violin: { ...initialActivityData, totalConcerts: 0 },
      spanish: { ...initialActivityData, booksRead: 0 },
      german: { ...initialActivityData, booksRead: 0 },
      
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      
      loadTemplate: (templateName) => {
        const templates = {
          'personal-dev': {
            boxing: { ...initialActivityData, totalHours: 50, thisWeekSessions: 3, currentStreak: 5, fitnessTestTrend: [], boxingTapeTrend: [], totalFights: 0, wins: 0, losses: 0, draws: 0 },
            gym: { ...initialActivityData, totalHours: 30, powerLiftNames: ['Squats','Bench Press','Rows','Hip Thrusts'], powerLiftWeights: [60, 40, 40, 40], weightTrend: [] },
            spanish: { ...initialActivityData, totalHours: 100, booksRead: 2 },
            oud: { ...initialActivityData, totalHours: 25, totalConcerts: 0 },
            dailyActivityList: [
              { id: '1', name: 'Spanish practice', category: 'Learning' },
              { id: '2', name: 'Oud 15 min', category: 'Music' },
              { id: '3', name: 'Gym session', category: 'Fitness' },
            ],
          },
          'athlete': {
            boxing: { ...initialActivityData, totalHours: 150, thisWeekSessions: 5, currentStreak: 10, totalFights: 3, wins: 2, losses: 1, fitnessTestTrend: [], boxingTapeTrend: [] },
            gym: { ...initialActivityData, totalHours: 200, powerLiftNames: ['Squats','Bench Press','Deadlift','Overhead Press'], powerLiftWeights: [100, 80, 120, 50], weightTrend: [{ date: 'Week 1', weight: 85, ts: Date.now() - 604800000 }] },
            dailyActivityList: [
              { id: '1', name: 'Morning cardio', category: 'Fitness' },
              { id: '2', name: 'Strength training', category: 'Fitness' },
              { id: '3', name: 'Boxing practice', category: 'Combat' },
              { id: '4', name: 'Meal prep', category: 'Health' },
            ],
          },
          'polyglot': {
            spanish: { ...initialActivityData, totalHours: 300, booksRead: 5, thisWeekSessions: 4, currentStreak: 15 },
            german: { ...initialActivityData, totalHours: 200, booksRead: 3, thisWeekSessions: 4, currentStreak: 12 },
            dailyActivityList: [
              { id: '1', name: 'Spanish writing', category: 'Learning' },
              { id: '2', name: 'German writing', category: 'Learning' },
              { id: '3', name: 'Language exchange', category: 'Social' },
              { id: '4', name: 'Watch foreign films', category: 'Entertainment' },
            ],
          },
          'fitness': {
            gym: { ...initialActivityData, totalHours: 250, powerLiftNames: ['Squats','Bench Press','Rows','Hip Thrusts'], powerLiftWeights: [120, 90, 80, 100], weightTrend: [{ date: 'Month 1', weight: 80, ts: Date.now() - 2592000000 }, { date: 'Now', weight: 85, ts: Date.now() }] },
            dailyActivityList: [
              { id: '1', name: 'Morning workout', category: 'Fitness' },
              { id: '2', name: 'Protein shake', category: 'Health' },
              { id: '3', name: 'Track calories', category: 'Health' },
              { id: '4', name: 'Stretch routine', category: 'Recovery' },
            ],
          },
          'blank': {
            boxing: { ...initialActivityData, fitnessTestTrend: [], boxingTapeTrend: [], totalFights: 0, wins: 0, losses: 0, draws: 0 },
            gym: { ...initialActivityData, powerLiftNames: ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'], powerLiftWeights: [0, 0, 0, 0], weightTrend: [] },
            oud: { ...initialActivityData, totalConcerts: 0 },
            spanish: { ...initialActivityData, booksRead: 0 },
            german: { ...initialActivityData, booksRead: 0 },
            dailyActivityList: [],
          }
        };
        
        const template = templates[templateName];
        if (!template) return;
        
        set((state) => ({
          ...state,
          boxing: template.boxing || state.boxing,
          gym: template.gym || state.gym,
          oud: template.oud || state.oud,
          violin: template.violin || state.violin,
          spanish: template.spanish || state.spanish,
          german: template.german || state.german,
          dailyActivityList: template.dailyActivityList || [],
          hasCompletedOnboarding: true,
        }));
      },
      
  setBooksRead: (activity, count) => {
    set((state) => ({
      ...state,
      [activity]: {
        ...state[activity],
        booksRead: Math.max(0, Math.floor(count)),
      },
    }));
  },
  setCustomBooksRead: (slug, count) => {
    set((state) => {
      const entry = state.customActivities[slug];
      if (!entry) return state;
      return {
        ...state,
        customActivities: {
          ...state.customActivities,
          [slug]: {
            ...entry,
            data: {
              ...entry.data,
              booksRead: Math.max(0, Math.floor(count)),
            },
          },
        },
      };
    });
  },
      
  addHours: (activity, hours) => {
        set((state) => {
          const currentData = state[activity];
          const today = new Date().toDateString();
          
          return {
            ...state,
            [activity]: {
              ...currentData,
              totalHours: Math.round((currentData.totalHours + hours) * 100) / 100,
              thisWeekSessions: currentData.thisWeekSessions + 1,
              currentStreak: currentData.lastSession !== today ? currentData.currentStreak + 1 : currentData.currentStreak,
              lastSession: today,
            },
          };
        });
      },

      recordBoxingFight: (result) => {
        set((state) => {
          const today = new Date().toDateString();
          const b = state.boxing;
          return {
            ...state,
            boxing: {
              ...b,
              totalFights: (b.totalFights ?? 0) + 1,
              wins: (b.wins ?? 0) + (result === 'win' ? 1 : 0),
              losses: (b.losses ?? 0) + (result === 'loss' ? 1 : 0),
              draws: (b.draws ?? 0) + (result === 'draw' ? 1 : 0),
              lastSession: today,
            },
          };
        });
      },

      addConcert: () => {
        set((state) => {
          const today = new Date().toDateString();
          const o = state.oud;
          return {
            ...state,
            oud: {
              ...o,
              totalConcerts: (o.totalConcerts ?? 0) + 1,
              lastSession: today,
            },
          };
        });
      },

      setTotalConcerts: (activity, count) => {
        set((state) => ({
          ...state,
          [activity]: {
            ...state[activity],
            totalConcerts: Math.max(0, Math.round(count)),
          },
        }));
      },

  addTapeHours: (kind, hours) => {
        if (hours <= 0) return;
        set((state) => ({
          ...state,
          boxing: {
            ...state.boxing,
    boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) + (kind === 'boxing' ? hours : 0),
    kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) + (kind === 'kickboxing' ? hours : 0),
    mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) + (kind === 'mma' ? hours : 0),
          },
        }));
      },

      addBoxingTapeEntry: (boxingH, kickH, mmaH, dateLabel) => {
        const bH = Number.isFinite(boxingH) && boxingH > 0 ? boxingH : 0;
        const kH = Number.isFinite(kickH) && kickH > 0 ? kickH : 0;
        const mH = Number.isFinite(mmaH) && mmaH > 0 ? mmaH : 0;
        if (bH + kH + mH <= 0) return;
        set((state) => {
          const trend = state.boxing.boxingTapeTrend ?? [];
          const last = trend[trend.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + weekMs;
          else {
            const parsed = Date.parse((last.date || '').replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const next = [...trend, { date: label, ts: baseTs, boxing: bH || undefined, kickboxing: kH || undefined, mma: mH || undefined }];
          return {
            ...state,
            boxing: {
              ...state.boxing,
              boxingTapeTrend: next,
              boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) + bH,
              kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) + kH,
              mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) + mH,
            },
          };
        });
      },

      // Fitness test monthly trend
      addFitnessScore: (score, dateLabel) => {
        if (!Number.isFinite(score) || score < 0) return;
        set((state) => {
          const trend = state.boxing.fitnessTestTrend ?? [];
          const last = trend[trend.length - 1];
          const monthMs = 30 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + monthMs;
          else baseTs = Date.now();
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleString(undefined, { month: 'short' });
          const next = [...trend, { date: label, score: Math.round(score), ts: baseTs }];
          const highest = Math.max(state.boxing.fitnessTestHighest ?? 0, Math.round(score));
          return {
            ...state,
            boxing: { ...state.boxing, fitnessTestTrend: next, fitnessTestThisMonth: Math.round(score), fitnessTestHighest: highest },
          };
        });
      },
      updateFitnessScoreAt: (index, score, dateLabel) => {
        set((state) => {
          const trend = state.boxing.fitnessTestTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = [...trend];
          const cur = next[index];
          next[index] = { ...cur, score: Number.isFinite(score as number) && (score as number) >= 0 ? Math.round(score as number) : cur.score, date: (dateLabel && dateLabel.trim()) || cur.date };
          const newHighest = next.reduce((m, r) => Math.max(m, r.score), 0);
          const lastScore = next.length ? next[next.length - 1].score : 0;
          return { ...state, boxing: { ...state.boxing, fitnessTestTrend: next, fitnessTestHighest: newHighest, fitnessTestThisMonth: lastScore } };
        });
      },
      deleteFitnessScoreAt: (index) => {
        set((state) => {
          const trend = state.boxing.fitnessTestTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = trend.filter((_, i) => i !== index);
          const newHighest = next.reduce((m, r) => Math.max(m, r.score), 0);
          const lastScore = next.length ? next[next.length - 1].score : 0;
          return { ...state, boxing: { ...state.boxing, fitnessTestTrend: next, fitnessTestHighest: newHighest, fitnessTestThisMonth: lastScore } };
        });
      },

      updateBoxingTapeAt: (index, boxingH, kickH, mmaH, dateLabel) => {
        set((state) => {
          const trend = state.boxing.boxingTapeTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const current = trend[index];
          const oldB = current.boxing ?? 0;
          const oldK = current.kickboxing ?? 0;
          const oldM = current.mma ?? 0;
          const nextB = Number.isFinite(boxingH as number) && (boxingH as number) >= 0 ? (boxingH as number) : oldB;
          const nextK = Number.isFinite(kickH as number) && (kickH as number) >= 0 ? (kickH as number) : oldK;
          const nextM = Number.isFinite(mmaH as number) && (mmaH as number) >= 0 ? (mmaH as number) : oldM;
          const next = [...trend];
          next[index] = {
            ...current,
            date: (dateLabel && dateLabel.trim()) || current.date,
            boxing: nextB || undefined,
            kickboxing: nextK || undefined,
            mma: nextM || undefined,
          };
          return {
            ...state,
            boxing: {
              ...state.boxing,
              boxingTapeTrend: next,
              boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) + (nextB - oldB),
              kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) + (nextK - oldK),
              mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) + (nextM - oldM),
            },
          };
        });
      },

      deleteBoxingTapeAt: (index) => {
        set((state) => {
          const trend = state.boxing.boxingTapeTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const current = trend[index];
          const oldB = current.boxing ?? 0;
          const oldK = current.kickboxing ?? 0;
          const oldM = current.mma ?? 0;
          const next = trend.filter((_, i) => i !== index);
          return {
            ...state,
            boxing: {
              ...state.boxing,
              boxingTapeTrend: next,
              boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) - oldB,
              kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) - oldK,
              mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) - oldM,
            },
          };
        });
      },

      resetBoxingTape: () => {
        set((state) => ({
          ...state,
          boxing: {
            ...state.boxing,
            boxingTapeHours: 0,
            kickboxingTapeHours: 0,
            mmaTapeHours: 0,
            boxingTapeTrend: [],
          },
        }));
      },
      
      getActivityData: (activity) => get()[activity],

      // Custom activities
  addCustomActivity: (slug, name, template = 'none') => {
        set((state) => {
          if (state.customActivities[slug]) return state;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
      [slug]: { name, template, data: { ...initialActivityData } },
            },
          };
        });
      },

      addCustomHours: (slug, hours) => {
        if (hours <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const today = new Date().toDateString();
          const d = entry.data;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: {
                ...entry,
                data: {
                  ...d,
                  totalHours: Math.round((d.totalHours + hours) * 100) / 100,
                  thisWeekSessions: d.thisWeekSessions + 1,
                  currentStreak: d.lastSession !== today ? d.currentStreak + 1 : d.currentStreak,
                  lastSession: today,
                },
              },
            },
          };
        });
      },

      getCustomActivity: (slug) => get().customActivities[slug],
      listCustomActivities: () => Object.entries(get().customActivities).map(([slug, v]) => ({ slug, ...v })),
      deleteCustomActivity: (slug) => {
        set((state) => {
          if (!state.customActivities[slug]) return state;
          const { [slug]: _removed, ...rest } = state.customActivities;
          return { ...state, customActivities: rest };
        });
      },

      // Custom template helpers
      addCustomTapeHours: (slug, kind, hours) => {
        if (hours <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const d = entry.data;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: {
                ...entry,
                data: {
                  ...d,
                  boxingTapeHours: (d.boxingTapeHours ?? 0) + (kind === 'boxing' ? hours : 0),
                  kickboxingTapeHours: (d.kickboxingTapeHours ?? 0) + (kind === 'kickboxing' ? hours : 0),
                  mmaTapeHours: (d.mmaTapeHours ?? 0) + (kind === 'mma' ? hours : 0),
                },
              },
            },
          };
        });
      },

      updateCustomPowerLiftName: (slug, index, name) => {
        if (index < 0 || index > 3) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const names = entry.data.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          const next = [...names];
          next[index] = name.trim() || names[index];
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, powerLiftNames: next } },
            },
          };
        });
      },

      updateCustomPowerLiftWeight: (slug, index, weight) => {
        if (index < 0 || index > 3) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const current = entry.data.powerLiftWeights ?? [100, 50, 50, 50];
          const next = [...current];
          const safe = Number.isFinite(weight) && weight > 0 ? Math.round(weight * 100) / 100 : current[index];
          next[index] = safe;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, powerLiftWeights: next } },
            },
          };
        });
      },

      addCustomWeight: (slug, weight, dateLabel) => {
        if (!Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const trend = entry.data.weightTrend ?? [];
          const last = trend[trend.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + weekMs;
          else {
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const next = [
            ...trend,
            { date: label, weight: Math.round(weight * 100) / 100, ts: baseTs },
          ];
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, weightTrend: next } },
            },
          };
        });
      },

      updateCustomExerciseName: (slug, id, name) => {
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const map = entry.data as any;
          const gymExerciseNames = map.gymExerciseNames ?? {};
          const trimmed = name.trim();
          if (!trimmed) return state;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, gymExerciseNames: { ...gymExerciseNames, [id]: trimmed } } as any },
            },
          };
        });
      },

      addCustomExerciseWeight: (slug, id, weight, reps, dateLabel) => {
        if (!id || !Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const all = (entry.data as any).gymExerciseProgress ?? {};
          const series = all[id] ?? [];
          const last = series[series.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + weekMs;
          else {
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const rounded = Math.round(weight * 100) / 100;
          const nextAll = { ...all, [id]: [...series, { date: label, weight: rounded, reps: reps ?? null, ts: baseTs }] };
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, gymExerciseProgress: nextAll } as any },
            },
          };
        });
      },

      updateGymPowerLiftName: (index, name) => {
        if (index < 0 || index > 5) return; // Support up to 6 lifts
        set((state) => {
          const names = state.gym.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          if (index >= names.length) return state;
          const next = [...names];
          next[index] = name.trim() || names[index];
          return {
            ...state,
            gym: {
              ...state.gym,
              powerLiftNames: next,
            },
          };
        });
      },

      updateGymPowerLiftWeight: (index, weight) => {
        if (index < 0 || index > 5) return; // Support up to 6 lifts
        set((state) => {
          const current = state.gym.powerLiftWeights ?? [100, 50, 50, 50];
          const next = [...current];
          const safe = Number.isFinite(weight) && weight > 0 ? Math.round(weight * 100) / 100 : current[index];
          next[index] = safe;
          return {
            ...state,
            gym: {
              ...state.gym,
              powerLiftWeights: next,
            },
          };
        });
      },

      addGymPowerLift: (name, weight = 0) => {
        set((state) => {
          const names = state.gym.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          const weights = state.gym.powerLiftWeights ?? [100, 50, 50, 50];
          if (names.length >= 6) return state; // Max 6 lifts
          return {
            ...state,
            gym: {
              ...state.gym,
              powerLiftNames: [...names, name.trim() || 'New Lift'],
              powerLiftWeights: [...weights, weight],
            },
          };
        });
      },

      removeGymPowerLift: (index) => {
        set((state) => {
          const names = state.gym.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          const weights = state.gym.powerLiftWeights ?? [100, 50, 50, 50];
          if (names.length <= 3) return state; // Min 3 lifts
          if (index < 0 || index >= names.length) return state;
          const nextNames = names.filter((_, i) => i !== index);
          const nextWeights = weights.filter((_, i) => i !== index);
          return {
            ...state,
            gym: {
              ...state.gym,
              powerLiftNames: nextNames,
              powerLiftWeights: nextWeights,
            },
          };
        });
      },

      addGymWeight: (weight, dateLabel) => {
        if (!Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const trend = state.gym.weightTrend ?? [];
          const last = trend[trend.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          // Determine base timestamp
          let baseTs: number;
          if (!last) {
            baseTs = Date.now();
          } else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) {
            baseTs = last.ts + weekMs;
          } else {
            // Try to parse last.date if ts missing
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          // If a dateLabel is provided, allow overriding the label only; ts remains weekly progression
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const next = [
            ...trend,
            { date: label, weight: Math.round(weight * 100) / 100, ts: baseTs },
          ];
          return {
            ...state,
            gym: {
              ...state.gym,
              weightTrend: next,
            },
          };
        });
      },

      updateGymWeightAt: (index, weight, dateLabel) => {
        set((state) => {
          const trend = state.gym.weightTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = [...trend];
          const current = next[index];
          const updated = {
            ...current,
            weight: Number.isFinite(weight as number) && (weight as number) > 0 ? Math.round((weight as number) * 100) / 100 : current.weight,
            date: (dateLabel && dateLabel.trim()) || current.date,
          };
          next[index] = updated;
          return { ...state, gym: { ...state.gym, weightTrend: next } };
        });
      },

      deleteGymWeightAt: (index) => {
        set((state) => {
          const trend = state.gym.weightTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = trend.filter((_, i) => i !== index);
          return { ...state, gym: { ...state.gym, weightTrend: next } };
        });
      },

      setGymGoalWeight: (weight) => {
        set((state) => ({
          ...state,
          gym: {
            ...state.gym,
            goalWeight: Math.round(weight * 100) / 100,
          },
        }));
      },

      updateDailyActivityName: (index, name) => {
        set((state) => {
          if (index < 0 || index >= state.dailyActivityNames.length) return state;
          const next = [...state.dailyActivityNames];
          next[index] = name.trim() || state.dailyActivityNames[index];
          return { ...state, dailyActivityNames: next };
        });
      },

      addDailyActivity: (name, category) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => {
          const id = (Date.now() + Math.random()).toString(36);
          return {
            ...state,
            dailyActivityList: [...state.dailyActivityList, { id, name: trimmed, category }],
          };
        });
      },
      removeDailyActivity: (id) => {
        set((state) => ({
          ...state,
          dailyActivityList: state.dailyActivityList.filter((a) => a.id !== id),
        }));
      },
      renameDailyActivity: (id, name) => {
        set((state) => ({
          ...state,
          dailyActivityList: state.dailyActivityList.map((a) => a.id === id ? { ...a, name: name.trim() || a.name } : a),
        }));
      },

      updateGymExerciseName: (id, name) => {
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed) return state;
          return {
            ...state,
            gymExerciseNames: {
              ...state.gymExerciseNames,
              [id]: trimmed,
            },
          };
        });
      },

      addGymExercise: (name, category) => {
        const trimmed = (name || '').trim();
        if (!trimmed) return '';
        const base = trimmed
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 40);
        const id = `${base || 'exercise'}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          ...state,
          gymExerciseNames: { ...state.gymExerciseNames, [id]: trimmed },
          gymExerciseCategories: { ...state.gymExerciseCategories, [id]: category },
          // progress series starts empty; add key when first weight is added
        }));
        return id;
      },

      removeGymExercise: (id) => {
        if (!id) return;
        set((state) => {
          const { [id]: _name, ...restNames } = state.gymExerciseNames;
          const { [id]: _cat, ...restCats } = state.gymExerciseCategories;
          const { [id]: _progress, ...restProgress } = state.gymExerciseProgress ?? {};
          return {
            ...state,
            gymExerciseNames: restNames,
            gymExerciseCategories: restCats,
            gymExerciseProgress: restProgress,
          };
        });
      },

      addGymExerciseWeight: (id, weight, reps, dateLabel) => {
        if (!id || !Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const all = state.gymExerciseProgress ?? {};
          const series = all[id] ?? [];
          const last = series[series.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) {
            baseTs = Date.now();
          } else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) {
            baseTs = last.ts + weekMs;
          } else {
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const rounded = Math.round(weight * 100) / 100;
          return {
            ...state,
            gymExerciseProgress: {
              ...all,
              [id]: [...series, { date: label, weight: rounded, reps: reps ?? null, ts: baseTs }],
            },
          };
        });
      },

      hideActivity: (key) => set((state) => ({ ...state, hiddenActivities: { ...state.hiddenActivities, [key]: true } })),
      restoreActivity: (key) => set((state) => {
        const { [key]: _removed, ...rest } = state.hiddenActivities;
        return { ...state, hiddenActivities: rest };
      }),

      setActivityTotalHours: (activity, hours) => {
        set((state) => {
          const current = state[activity];
          if (!current) return state as any;
          const safe = Number.isFinite(hours) && hours >= 0 ? Math.round(hours * 100) / 100 : current.totalHours;
          return {
            ...state,
            [activity]: {
              ...current,
              totalHours: safe,
            },
          } as any;
        });
      },
      setCustomActivityTotalHours: (slug, hours) => {
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
            const safe = Number.isFinite(hours) && hours >= 0 ? Math.round(hours * 100) / 100 : entry.data.totalHours;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, totalHours: safe } },
            },
          };
        });
      },

      // Daily goal methods
      setDailyGoal: (activity, minutes) => {
        set((state) => {
          const current = state[activity];
          if (!current) return state as any;
          const safe = Number.isFinite(minutes) && minutes > 0 ? minutes : 30; // Default to 30 minutes
          return {
            ...state,
            [activity]: {
              ...current,
              dailyGoalMinutes: safe,
            },
          } as any;
        });
      },

      setCustomDailyGoal: (slug, minutes) => {
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const safe = Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, dailyGoalMinutes: safe } },
            },
          };
        });
      },

      addTodayMinutes: (activity, minutes) => {
        set((state) => {
          const current = state[activity];
          if (!current) return state as any;
          const today = new Date().toDateString();
          const isToday = current.todayDate === today;
          const currentMinutes = isToday ? (current.todayMinutes || 0) : 0;
          const newMinutes = currentMinutes + minutes;
          
          return {
            ...state,
            [activity]: {
              ...current,
              todayMinutes: newMinutes,
              todayDate: today,
            },
          } as any;
        });
      },

      addCustomTodayMinutes: (slug, minutes) => {
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const today = new Date().toDateString();
          const isToday = entry.data.todayDate === today;
          const currentMinutes = isToday ? (entry.data.todayMinutes || 0) : 0;
          const newMinutes = currentMinutes + minutes;
          
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { 
                ...entry, 
                data: { 
                  ...entry.data, 
                  todayMinutes: newMinutes, 
                  todayDate: today 
                } 
              },
            },
          };
        });
      },
    }),
    {
    name: 'activity-storage',
  version: 13,
      // Basic migration to ensure optional fields exist and update defaults
      migrate: (persistedState: any, _version: number) => {
        if (!persistedState) return persistedState;
        const state = { ...persistedState };
        state.customActivities = state.customActivities ?? {};
        if (state.boxing) {
          state.boxing.fitnessTestHighest = state.boxing.fitnessTestHighest ?? 342;
          state.boxing.fitnessTestThisMonth = state.boxing.fitnessTestThisMonth ?? 0;
          // Seed fitness trend if missing
          if (!state.boxing.fitnessTestTrend || !Array.isArray(state.boxing.fitnessTestTrend) || state.boxing.fitnessTestTrend.length === 0) {
            const scores = [139, 264, 286, 213, 256, 317, 342];
            const now = new Date();
            const arr: Array<{ date: string; score: number; ts: number }> = [];
            for (let i = 6; i >= 0; i--) {
              const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
              arr.push({ date: d.toLocaleString(undefined, { month: 'short' }), score: scores[i], ts: d.getTime() });
            }
            state.boxing.fitnessTestTrend = arr;
          }
          // Tape defaults and rename migration: fightTapeHours -> mmaTapeHours
          state.boxing.boxingTapeHours = state.boxing.boxingTapeHours ?? 0;
          if (state.boxing.mmaTapeHours === undefined && state.boxing.fightTapeHours !== undefined) {
            state.boxing.mmaTapeHours = state.boxing.fightTapeHours;
            delete (state.boxing as any).fightTapeHours;
          }
          state.boxing.mmaTapeHours = state.boxing.mmaTapeHours ?? 0;
          state.boxing.kickboxingTapeHours = state.boxing.kickboxingTapeHours ?? 0;
          state.boxing.boxingTapeTrend = state.boxing.boxingTapeTrend ?? [];
          if (typeof state.boxing.totalHours === 'number' && state.boxing.totalHours < 96) {
            state.boxing.totalHours = 96;
          }
          state.boxing.totalFights = state.boxing.totalFights ?? 1;
          state.boxing.wins = state.boxing.wins ?? 0;
          state.boxing.losses = state.boxing.losses ?? 1;
          state.boxing.draws = state.boxing.draws ?? 0;
          // Ensure highest/thisMonth derived from trend if present
          if (state.boxing.fitnessTestTrend && state.boxing.fitnessTestTrend.length > 0) {
            const highest = state.boxing.fitnessTestTrend.reduce((m: number, r: any) => Math.max(m, r.score), 0);
            const lastScore = state.boxing.fitnessTestTrend[state.boxing.fitnessTestTrend.length - 1].score;
            state.boxing.fitnessTestHighest = Math.max(state.boxing.fitnessTestHighest ?? 0, highest);
            state.boxing.fitnessTestThisMonth = lastScore;
          }
        }
        if (state.gym) {
          state.gym.powerLiftNames = state.gym.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          state.gym.powerLiftWeights = state.gym.powerLiftWeights ?? [100, 50, 50, 50];
          state.gym.weightTrend = state.gym.weightTrend ?? [];
          // Set minimum total hours to 24 if lower or uninitialized
          if (typeof state.gym.totalHours !== 'number' || state.gym.totalHours < 24) {
            state.gym.totalHours = 24;
          }
        }
        state.dailyActivityNames = state.dailyActivityNames ?? [
          'Spanish writing',
          'German writing',
          'Oud 15 min',
          'Minoxidil',
          'Creatine',
        ];
        // Seed dailyActivityList from names if missing
        if (!state.dailyActivityList) {
          const cats = ['Learning','Learning','Music','Health','Health'];
          state.dailyActivityList = (state.dailyActivityNames as string[]).map((n, i) => ({ id: String(i+1), name: n, category: cats[i] || 'General' }));
        }
        // Initialize gym exercises (unified system)
        state.gymExerciseNames = state.gymExerciseNames ?? {};
        state.gymExerciseCategories = state.gymExerciseCategories ?? {};
        state.gymExerciseProgress = state.gymExerciseProgress ?? {};
        
        // Define default exercises (always merge to ensure they exist)
        // Push exercises
        const pushExercises = [
          ['flat-db-press', 'Flat DB Press'],
          ['flat-bpress-machine', 'Flat B-Press Machine'],
          ['incline-db-press', 'Incline DB Press'],
          ['incline-bpress-machine', 'Incline B-Press Machine'],
          ['high-low-cable-fly', 'High to Low Cable Fly'],
          ['tri-rope-pushdown', 'Tri Rope Pushdown'],
          ['overhead-cable-bar-extensions', 'Overhead Cable Bar Extensions'],
          ['db-lateral-raises', 'DB Lateral Raises'],
          ['cable-lateral-raises', 'Cable Lateral Raises'],
          ['shoulder-press-machine', 'Shoulder Press Machine'],
        ];
        // Pull exercises
        const pullExercises = [
          ['wide-lat-pulldown', 'Wide Lat Pulldown'],
          ['narrow-seated-rows', 'Narrow Seated Rows'],
          ['wide-seated-rows', 'Wide Seated Rows'],
          ['rope-face-pulls', 'Rope Face Pulls'],
          ['sa-cable-rear-delt-fly', 'SA Cable Rear Delt Fly'],
          ['bar-curls', 'Bar Curls'],
          ['db-preacher-curl', 'DB Preacher Curl'],
          ['behind-back-cable-curls', 'Behind Back Cable Curls'],
          ['rope-bicep-curl', 'Rope Bicep Curl'],
          ['cable-bar-shrugs', 'Cable Bar Shrugs'],
        ];
        // Leg exercises
        const legExercises = [
          ['romanian-deadlift', 'Romanian Deadlift'],
          ['bar-squat', 'Bar Squat'],
          ['hack-squat', 'Hack Squat'],
          ['single-leg-press', 'Single Leg Press'],
          ['leg-extensions', 'Leg Extensions'],
          ['seated-leg-curls', 'Seated Leg Curls'],
          ['bar-hip-thrust', 'Bar Hip Thrust'],
          ['seated-adduction-machine', 'Seated Adduction Machine'],
        ];
        
        // Merge default exercises (only add if not already present)
        [...pushExercises.map(e => [...e, 'push']), 
         ...pullExercises.map(e => [...e, 'pull']), 
         ...legExercises.map(e => [...e, 'legs'])].forEach(([id, name, cat]) => {
          if (!state.gymExerciseNames[id]) {
            state.gymExerciseNames[id] = name;
            state.gymExerciseCategories[id] = cat;
          }
        });
        
        // Add sample session data only if exercises have no progress data
        if (Object.keys(state.gymExerciseProgress).length === 0) {
          // Add session data from your workout
          const sessionData = [
            ['flat-db-press', 25, 8],
            ['flat-bpress-machine', 50, 9],
            ['incline-db-press', 25, 8],
            ['incline-bpress-machine', 55, 10],
            ['high-low-cable-fly', 25, 9],
            ['tri-rope-pushdown', 45, 9],
            ['overhead-cable-bar-extensions', 40, 9],
            ['db-lateral-raises', 10, 10],
            ['cable-lateral-raises', 10, 8],
            ['shoulder-press-machine', 25, 8],
            ['wide-lat-pulldown', 54, 10],
            ['narrow-seated-rows', 60, 7],
            ['wide-seated-rows', 80, 7],
            ['rope-face-pulls', 60, 8],
            ['bar-curls', 20, 9],
            ['db-preacher-curl', 10, 7],
            ['behind-back-cable-curls', 50, 10],
            ['rope-bicep-curl', 25, 10],
            ['cable-bar-shrugs', 50, 10],
            ['bar-squat', 100, 9],
            ['hack-squat', 70, 10],
            ['single-leg-press', 40, 10],
            ['leg-extensions', 75, 10],
            ['seated-leg-curls', 35, 10],
            ['bar-hip-thrust', 35, 12],
            ['seated-adduction-machine', 100, 10],
          ];
          
          sessionData.forEach(([id, weight, reps]) => {
            if (state.gymExerciseNames[id]) {
              state.gymExerciseProgress[id] = [{ date: '9/26', weight, reps, ts: Date.now() }];
            }
          });
        }
        state.hiddenActivities = state.hiddenActivities ?? {};
        if (state.oud) {
          if (typeof state.oud.totalHours === 'number' && state.oud.totalHours < 16) {
            state.oud.totalHours = 16;
          }
          // Ensure at least 1 concert if tracked
          if (typeof state.oud.totalConcerts !== 'number' || state.oud.totalConcerts < 1) {
            state.oud.totalConcerts = 1;
          }
        }
        if (!state.violin) {
          state.violin = { ...initialActivityData, totalHours: 780, thisWeekSessions: 1, currentStreak: 2, totalConcerts: 5 };
        } else {
          state.violin.totalConcerts = state.violin.totalConcerts ?? 5;
          if (typeof state.violin.totalHours === 'number' && state.violin.totalHours < 780) {
            state.violin.totalHours = 780;
          }
        }
        if (!state.spanish) {
          state.spanish = { ...initialActivityData, totalHours: 393, thisWeekSessions: 2, currentStreak: 2 };
        } else if (typeof state.spanish.totalHours !== 'number' || state.spanish.totalHours < 393) {
          state.spanish.totalHours = 393;
        }
        if (!state.german) {
          state.german = { ...initialActivityData, totalHours: 556, thisWeekSessions: 1, currentStreak: 1 };
        } else if (typeof state.german.totalHours !== 'number' || state.german.totalHours < 556) {
          state.german.totalHours = 556;
        }

        // Migration for daily goal fields (added in version 13)
        const today = new Date().toDateString();
        const addDailyGoalDefaults = (activity: any) => {
          if (activity) {
            activity.dailyGoalMinutes = activity.dailyGoalMinutes ?? 30;
            activity.todayMinutes = activity.todayMinutes ?? 0;
            activity.todayDate = activity.todayDate ?? today;
          }
        };

        // Add daily goal defaults to all core activities
        addDailyGoalDefaults(state.boxing);
        addDailyGoalDefaults(state.gym);
        addDailyGoalDefaults(state.oud);
        addDailyGoalDefaults(state.violin);
        addDailyGoalDefaults(state.spanish);
        addDailyGoalDefaults(state.german);

        // Add daily goal defaults to all custom activities
        Object.values(state.customActivities || {}).forEach((entry: any) => {
          if (entry?.data) {
            addDailyGoalDefaults(entry.data);
          }
        });

        // Initialize hasCompletedOnboarding if it doesn't exist
        if (typeof state.hasCompletedOnboarding !== 'boolean') {
          state.hasCompletedOnboarding = false;
        }

        return state;
      },
    }
  )
);

