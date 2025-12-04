import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target, Award, Calendar } from "lucide-react";

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

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  award: Award,
  calendar: Calendar,
};

const rarityColors = {
  common: 'bg-gradient-to-r from-gray-400 to-gray-500',
  rare: 'bg-gradient-to-r from-blue-400 to-blue-500',
  epic: 'bg-gradient-to-r from-purple-400 to-purple-500',
  legendary: 'bg-gradient-to-r from-yellow-400 to-orange-500',
};

const rarityBorders = {
  common: 'border-gray-300',
  rare: 'border-blue-300',
  epic: 'border-purple-300',
  legendary: 'border-yellow-300',
};

export default function AchievementBadge({ 
  achievement, 
  size = 'md', 
  showProgress = true 
}: AchievementBadgeProps) {
  // Handle Date persisted as string safely
  const unlockedDate = achievement.unlockedAt
    ? new Date(achievement.unlockedAt as unknown as string | number | Date)
    : null;
  const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Award;
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`relative group cursor-pointer transition-all duration-200 hover:scale-105 ${
      achievement.isUnlocked ? '' : 'opacity-50 grayscale'
    }`}>
      <div className={`${sizeClasses[size]} rounded-full ${rarityColors[achievement.rarity]} 
        flex items-center justify-center border-4 ${rarityBorders[achievement.rarity]} 
        shadow-lg relative overflow-hidden`}>
        
        {/* Shine effect for unlocked achievements */}
        {achievement.isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
            opacity-20 transform -skew-x-12 animate-pulse" />
        )}
        
        <IconComponent className={`${iconSizes[size]} text-white z-10`} />
        
        {/* Progress indicator for partially completed achievements */}
        {!achievement.isUnlocked && achievement.progress !== undefined && achievement.maxProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
            <div 
              className="h-full bg-white bg-opacity-60 transition-all duration-300"
              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg p-3 max-w-48 text-center shadow-xl">
          <div className="font-semibold mb-1">{achievement.title}</div>
          <div className="text-gray-300 mb-2">{achievement.description}</div>
          <div className="flex items-center justify-between text-xs">
            <Badge variant="secondary" className="text-xs">
              {achievement.rarity.toUpperCase()}
            </Badge>
            <span className="text-yellow-400">+{achievement.points} XP</span>
          </div>
          {showProgress && !achievement.isUnlocked && achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-2 text-xs text-gray-400">
              Progress: {achievement.progress}/{achievement.maxProgress}
            </div>
          )}
      {unlockedDate && (
            <div className="mt-1 text-xs text-green-400">
        Unlocked: {unlockedDate.toLocaleDateString()}
            </div>
          )}
        </div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 
          border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
