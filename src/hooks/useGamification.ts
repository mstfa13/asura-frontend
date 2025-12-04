import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'progress' | 'streak' | 'milestone' | 'social' | 'challenge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  icon?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  xpReward: number;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  expiresAt?: Date;
  requirements: string[];
}

export interface XPGain {
  activity: string;
  xp: number;
  timestamp: Date;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  rank: number;
  achievements: number;
  isCurrentUser?: boolean;
}

export interface Reward {
  id: string;
  type: 'xp' | 'achievement' | 'level_up' | 'streak' | 'challenge';
  title: string;
  description: string;
  value?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  timestamp: Date;
}

interface GamificationState {
  // XP and Leveling
  currentXP: number;
  currentLevel: number;
  recentXPGains: XPGain[];
  
  // Achievements
  achievements: Achievement[];
  unlockedAchievements: string[];
  
  // Challenges
  challenges: Challenge[];
  dailyStreak: number;
  lastActivityDate: string;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
  
  // Rewards/Notifications
  pendingRewards: Reward[];
  
  // Actions
  addXP: (activity: string, amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  updateStreak: () => void;
  initializeDefaultData: () => void;
  addReward: (reward: Omit<Reward, 'id' | 'timestamp'>) => void;
  removeReward: (rewardId: string) => void;
  clearAllRewards: () => void;
  
  // Computed values
  getXPToNextLevel: () => number;
  getTotalXPForCurrentLevel: () => number;
  getUnlockedAchievementCount: () => number;
}

// XP calculation functions
const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const calculateLevelFromXP = (xp: number): number => {
  let level = 1;
  let totalXP = 0;
  
  while (totalXP <= xp) {
    totalXP += calculateXPForLevel(level);
    if (totalXP <= xp) level++;
  }
  
  return level;
};

// Default achievements
const defaultAchievements: Achievement[] = [
  // Progress Achievements
  {
    id: 'first_hour',
    title: 'First Steps',
    description: 'Complete your first hour of any activity',
    category: 'progress',
    rarity: 'common',
    points: 10,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
    icon: 'award'
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Reach 100 total hours across all activities',
    category: 'milestone',
    rarity: 'rare',
    points: 100,
    isUnlocked: false,
    progress: 0,
    maxProgress: 100,
    icon: 'trophy'
  },
  {
    id: 'language_level_5',
    title: 'Polyglot',
    description: 'Reach Level 5 in Language Learning',
    category: 'milestone',
    rarity: 'epic',
    points: 250,
    isUnlocked: false,
    progress: 0,
    maxProgress: 5,
    icon: 'star'
  },
  {
    id: 'boxing_level_4',
    title: 'Fighter',
    description: 'Reach Level 4 in Boxing',
    category: 'milestone',
    rarity: 'epic',
    points: 200,
    isUnlocked: false,
    progress: 0,
    maxProgress: 4,
    icon: 'zap'
  },
  
  // Streak Achievements
  {
    id: 'week_streak',
    title: 'Consistent Learner',
    description: 'Maintain a 7-day streak',
    category: 'streak',
    rarity: 'common',
    points: 50,
    isUnlocked: false,
    progress: 0,
    maxProgress: 7,
    icon: 'calendar'
  },
  {
    id: 'month_streak',
    title: 'Dedication Master',
    description: 'Maintain a 30-day streak',
    category: 'streak',
    rarity: 'rare',
    points: 200,
    isUnlocked: false,
    progress: 0,
    maxProgress: 30,
    icon: 'calendar'
  },
  {
    id: 'hundred_day_streak',
    title: 'Legendary Persistence',
    description: 'Maintain a 100-day streak',
    category: 'streak',
    rarity: 'legendary',
    points: 1000,
    isUnlocked: false,
    progress: 0,
    maxProgress: 100,
    icon: 'calendar'
  },
  
  // Challenge Achievements
  {
    id: 'daily_champion',
    title: 'Daily Champion',
    description: 'Complete all daily challenges in one day',
    category: 'challenge',
    rarity: 'rare',
    points: 75,
    isUnlocked: false,
    icon: 'target'
  },
  {
    id: 'challenge_master',
    title: 'Challenge Master',
    description: 'Complete 50 challenges',
    category: 'challenge',
    rarity: 'epic',
    points: 300,
    isUnlocked: false,
    progress: 0,
    maxProgress: 50,
    icon: 'target'
  }
];

// Default challenges
const defaultChallenges: Challenge[] = [
  {
    id: 'daily_language_1',
    title: 'Language Focus',
    description: 'Spend 30 minutes on language learning',
    category: 'daily',
    difficulty: 'easy',
    xpReward: 25,
    progress: 0,
    maxProgress: 30,
    isCompleted: false,
    requirements: ['Complete 30 minutes of language learning']
  },
  {
    id: 'daily_boxing_1',
    title: 'Boxing Session',
    description: 'Complete a 45-minute boxing session',
    category: 'daily',
    difficulty: 'medium',
    xpReward: 35,
    progress: 0,
    maxProgress: 45,
    isCompleted: false,
    requirements: ['Complete 45 minutes of boxing training']
  },
  {
    id: 'daily_gym_1',
    title: 'Fitness Goal',
    description: 'Complete 1 hour at the gym',
    category: 'daily',
    difficulty: 'medium',
    xpReward: 40,
    progress: 0,
    maxProgress: 60,
    isCompleted: false,
    requirements: ['Complete 60 minutes of gym workout']
  },
  {
    id: 'weekly_consistency',
    title: 'Weekly Consistency',
    description: 'Be active for 5 days this week',
    category: 'weekly',
    difficulty: 'hard',
    xpReward: 100,
    progress: 0,
    maxProgress: 5,
    isCompleted: false,
    requirements: ['Be active for 5 different days this week']
  }
];

export const useGamificationStore = create<GamificationState>()(
  persist(    (set, get) => ({
      // Initial state
      currentXP: 0,
      currentLevel: 1,
      recentXPGains: [],
      achievements: defaultAchievements,
      unlockedAchievements: [],
      challenges: defaultChallenges,
      dailyStreak: 0,
      lastActivityDate: '',
      leaderboard: [],      currentUserId: 'user1',
      pendingRewards: [],
      
      // Actions
      addXP: (activity: string, amount: number) => {
        set((state) => {
          const newXP = state.currentXP + amount;
          const newLevel = calculateLevelFromXP(newXP);
          const leveledUp = newLevel > state.currentLevel;
          
          const newXPGain: XPGain = {
            activity,
            xp: amount,
            timestamp: new Date()
          };
          
          // Create rewards
          const newRewards: Reward[] = [];
          
          // XP reward
          newRewards.push({
            id: `xp_${Date.now()}`,
            type: 'xp',
            title: 'XP Gained!',
            description: `Great job on ${activity}!`,
            value: amount,
            timestamp: new Date()
          });
          
          // Level up reward
          if (leveledUp) {
            newRewards.push({
              id: `level_${Date.now()}`,
              type: 'level_up',
              title: 'Level Up!',
              description: `Congratulations! You've reached Level ${newLevel}!`,
              value: newLevel,
              rarity: 'epic',
              timestamp: new Date()
            });
          }
          
          return {
            currentXP: newXP,
            currentLevel: newLevel,
            recentXPGains: [newXPGain, ...state.recentXPGains.slice(0, 9)],
            pendingRewards: [...state.pendingRewards, ...newRewards]
          };
        });
      },
        unlockAchievement: (achievementId: string) => {
        set((state) => {
          if (state.unlockedAchievements.includes(achievementId)) return state;
          
          const achievement = state.achievements.find(a => a.id === achievementId);
          if (!achievement) return state;
          
          const updatedAchievements = state.achievements.map(a =>
            a.id === achievementId 
              ? { ...a, isUnlocked: true, unlockedAt: new Date() }
              : a
          );
          
          // Add XP for unlocking achievement
          const newXP = state.currentXP + achievement.points;
          const newLevel = calculateLevelFromXP(newXP);
          
          const newXPGain: XPGain = {
            activity: `Achievement: ${achievement.title}`,
            xp: achievement.points,
            timestamp: new Date()
          };
          
          // Create achievement reward
          const achievementReward: Reward = {
            id: `achievement_${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            description: achievement.title,
            value: achievement.points,
            rarity: achievement.rarity,
            timestamp: new Date()
          };
          
          return {
            achievements: updatedAchievements,
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
            currentXP: newXP,
            currentLevel: newLevel,
            recentXPGains: [newXPGain, ...state.recentXPGains.slice(0, 9)],
            pendingRewards: [...state.pendingRewards, achievementReward]
          };
        });
      },
      
      updateChallengeProgress: (challengeId: string, progress: number) => {
        set((state) => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId 
              ? { ...c, progress: Math.min(progress, c.maxProgress) }
              : c
          )
        }));
      },
      
      completeChallenge: (challengeId: string) => {
        set((state) => {
          const challenge = state.challenges.find(c => c.id === challengeId);
          if (!challenge || challenge.isCompleted) return state;
          
          const updatedChallenges = state.challenges.map(c =>
            c.id === challengeId 
              ? { ...c, isCompleted: true, progress: c.maxProgress }
              : c
          );
          
          // Add XP for completing challenge
          const newXP = state.currentXP + challenge.xpReward;
          const newLevel = calculateLevelFromXP(newXP);
          
          const newXPGain: XPGain = {
            activity: `Challenge: ${challenge.title}`,
            xp: challenge.xpReward,
            timestamp: new Date()
          };
          
          return {
            challenges: updatedChallenges,
            currentXP: newXP,
            currentLevel: newLevel,
            recentXPGains: [newXPGain, ...state.recentXPGains.slice(0, 9)]
          };
        });
      },
      
      updateStreak: () => {
        set((state) => {
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          
          if (state.lastActivityDate === today) {
            return state; // Already updated today
          }
          
          let newStreak = state.dailyStreak;
          
          if (state.lastActivityDate === yesterday) {
            newStreak += 1; // Continue streak
          } else if (state.lastActivityDate !== today) {
            newStreak = 1; // Start new streak or reset
          }
          
          return {
            dailyStreak: newStreak,
            lastActivityDate: today
          };
        });
      },
      
      initializeDefaultData: () => {
        set((state) => ({
          achievements: defaultAchievements,
          challenges: defaultChallenges,
          leaderboard: [
            {
              id: 'user1',
              name: 'You',
              level: state.currentLevel,
              totalXP: state.currentXP,
              weeklyXP: 150,
              rank: 1,
              achievements: state.unlockedAchievements.length,
              isCurrentUser: true
            },
            {
              id: 'user2',
              name: 'Alex Johnson',
              level: 8,
              totalXP: 2450,
              weeklyXP: 320,
              rank: 2,
              achievements: 12
            },
            {
              id: 'user3',
              name: 'Sarah Chen',
              level: 6,
              totalXP: 1890,
              weeklyXP: 280,
              rank: 3,
              achievements: 9
            },
            {
              id: 'user4',
              name: 'Mike Wilson',
              level: 5,
              totalXP: 1250,
              weeklyXP: 120,
              rank: 4,
              achievements: 7
            }
          ]        }));
      },
      
      // Reward Management
      addReward: (reward: Omit<Reward, 'id' | 'timestamp'>) => {
        set((state) => {
          const newReward: Reward = {
            ...reward,
            id: `reward_${Date.now()}_${Math.random()}`,
            timestamp: new Date()
          };
          return {
            pendingRewards: [...state.pendingRewards, newReward]
          };
        });
      },
      
      removeReward: (rewardId: string) => {
        set((state) => ({
          pendingRewards: state.pendingRewards.filter(r => r.id !== rewardId)
        }));
      },
      
      clearAllRewards: () => {
        set(() => ({
          pendingRewards: []
        }));
      },
      
      // Computed values
      getXPToNextLevel: () => {
        const state = get();
        let totalXPForCurrentLevel = 0;
        for (let i = 1; i < state.currentLevel; i++) {
          totalXPForCurrentLevel += calculateXPForLevel(i);
        }
        const xpForNextLevel = calculateXPForLevel(state.currentLevel);
        const currentLevelProgress = state.currentXP - totalXPForCurrentLevel;
        return xpForNextLevel - currentLevelProgress;
      },
      
      getTotalXPForCurrentLevel: () => {
        const state = get();
        return calculateXPForLevel(state.currentLevel);
      },
      
      getUnlockedAchievementCount: () => {
        const state = get();
        return state.achievements.filter(a => a.isUnlocked).length;
      }
    }),
    {
      name: 'gamification-store',
      version: 1
    }
  )
);
