import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { useActivityStore } from '@/lib/activityStore';

// Keys for different data stores
const DATA_KEYS = {
  ACTIVITY: 'activity-store',
  GAMIFICATION: 'gamification-store',
} as const;

export function useDataSync() {
  const { isAuthenticated, user } = useAuth();
  const lastSyncRef = useRef<number>(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef<boolean>(false);

  // Debounced save function
  const debouncedSave = useCallback(async (key: string, data: unknown) => {
    if (!isAuthenticated) return;
    
    // Don't save until we've loaded from backend first
    if (!hasLoadedRef.current) return;
    
    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    // Debounce saves to avoid hammering the backend
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await apiClient.saveData(key, data);
        lastSyncRef.current = Date.now();
        console.log(`[DataSync] Saved ${key} to backend`);
      } catch (error) {
        console.error(`[DataSync] Failed to save ${key}:`, error);
      }
    }, 1000); // 1 second debounce
  }, [isAuthenticated]);

  // Load data from backend on login
  const loadFromBackend = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      console.log('[DataSync] Loading data from backend for user:', user?.username);
      
      // Load activity data
      const activityData = await apiClient.getData<Record<string, unknown>>(DATA_KEYS.ACTIVITY);
      if (activityData && Object.keys(activityData).length > 0) {
        // Replace data fields with backend data (keeping store functions intact)
        useActivityStore.setState(activityData as Partial<ReturnType<typeof useActivityStore.getState>>);
        console.log('[DataSync] Loaded activity data from backend');
      } else {
        console.log('[DataSync] No activity data on backend - user has fresh state');
      }

      // Load gamification data
      const gamificationData = await apiClient.getData<Record<string, unknown>>(DATA_KEYS.GAMIFICATION);
      if (gamificationData && Object.keys(gamificationData).length > 0) {
        // Store in localStorage for the gamification hook to pick up
        localStorage.setItem('gamification-store', JSON.stringify({ state: gamificationData }));
        console.log('[DataSync] Loaded gamification data from backend');
      } else {
        console.log('[DataSync] No gamification data on backend - user has fresh state');
      }

      lastSyncRef.current = Date.now();
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('[DataSync] Failed to load from backend:', error);
      // Still mark as loaded so we can start saving
      hasLoadedRef.current = true;
    }
  }, [isAuthenticated, user]);

  // Reset loaded flag when user changes (logout/login)
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [user?.id]);

  // Initial load when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFromBackend();
    }
  }, [isAuthenticated, user, loadFromBackend]);

  // Subscribe to store changes and sync to backend
  useEffect(() => {
    if (!isAuthenticated) return;

    // Subscribe to activity store changes
    const unsubscribeActivity = useActivityStore.subscribe((state) => {
      // Extract only the data we want to sync (not functions)
      const dataToSync = {
        boxing: state.boxing,
        gym: state.gym,
        oud: state.oud,
        violin: state.violin,
        spanish: state.spanish,
        german: state.german,
        customActivities: state.customActivities,
        hiddenActivities: state.hiddenActivities,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        dailyActivityNames: state.dailyActivityNames,
        dailyActivityList: state.dailyActivityList,
        gymExerciseNames: state.gymExerciseNames,
        gymExerciseCategories: state.gymExerciseCategories,
        gymExerciseProgress: state.gymExerciseProgress,
      };
      debouncedSave(DATA_KEYS.ACTIVITY, dataToSync);
    });

    return () => {
      unsubscribeActivity();
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isAuthenticated, debouncedSave]);

  // Manual sync function
  const syncNow = useCallback(async () => {
    if (!isAuthenticated) return;
    
    const state = useActivityStore.getState();
    const dataToSync = {
      boxing: state.boxing,
      gym: state.gym,
      oud: state.oud,
      violin: state.violin,
      spanish: state.spanish,
      german: state.german,
      customActivities: state.customActivities,
      hiddenActivities: state.hiddenActivities,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
      dailyActivityNames: state.dailyActivityNames,
      dailyActivityList: state.dailyActivityList,
      gymExerciseNames: state.gymExerciseNames,
      gymExerciseCategories: state.gymExerciseCategories,
      gymExerciseProgress: state.gymExerciseProgress,
    };
    
    try {
      await apiClient.saveData(DATA_KEYS.ACTIVITY, dataToSync);
      lastSyncRef.current = Date.now();
      console.log('[DataSync] Manual sync completed');
    } catch (error) {
      console.error('[DataSync] Manual sync failed:', error);
      throw error;
    }
  }, [isAuthenticated]);

  return {
    syncNow,
    lastSync: lastSyncRef.current,
    loadFromBackend,
  };
}
