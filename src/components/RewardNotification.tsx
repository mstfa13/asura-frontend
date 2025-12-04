import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Gift, 
  X, 
  CheckCircle,
  Zap
} from "lucide-react";

export interface Reward {
  id: string;
  type: 'xp' | 'achievement' | 'level_up' | 'streak' | 'challenge';
  title: string;
  description: string;
  value?: number; // XP or level number
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  timestamp: Date;
}

interface RewardNotificationProps {
  reward: Reward;
  onDismiss: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

const getRewardIcon = (type: Reward['type']) => {
  switch (type) {
    case 'xp':
      return <Zap className="w-8 h-8 text-yellow-500" />;
    case 'achievement':
      return <Trophy className="w-8 h-8 text-purple-500" />;
    case 'level_up':
      return <Star className="w-8 h-8 text-blue-500" />;
    case 'streak':
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    case 'challenge':
      return <Gift className="w-8 h-8 text-pink-500" />;
    default:
      return <Trophy className="w-8 h-8 text-gray-500" />;
  }
};

const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-800';
    case 'rare':
      return 'bg-blue-100 text-blue-800';
    case 'epic':
      return 'bg-purple-100 text-purple-800';
    case 'legendary':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RewardNotification({ 
  reward, 
  onDismiss, 
  autoHide = true, 
  hideDelay = 5000 
}: RewardNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const ts = new Date(reward.timestamp as unknown as string | number | Date);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsAnimating(true), 100);

    // Auto-hide after delay
    if (autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out
      ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <Card className="w-80 shadow-2xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getRewardIcon(reward.type)}
              <div>
                <h3 className="font-bold text-lg text-gray-900">{reward.title}</h3>
                <p className="text-sm text-gray-600">{reward.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {reward.value && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {reward.type === 'xp' ? `+${reward.value} XP` : `Level ${reward.value}`}
                </Badge>
              )}
              {reward.rarity && (
                <Badge className={getRarityColor(reward.rarity)}>
                  {reward.rarity.toUpperCase()}
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleDismiss}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
            >
              Awesome!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing multiple reward notifications
export function useRewardNotifications() {
  const [rewards, setRewards] = useState<Reward[]>([]);

  const addReward = (reward: Omit<Reward, 'id' | 'timestamp'>) => {
    const newReward: Reward = {
      ...reward,
      id: `reward_${Date.now()}_${Math.random()}`,
      timestamp: new Date()
    };
    setRewards(prev => [...prev, newReward]);
  };

  const removeReward = (rewardId: string) => {
    setRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  const clearAllRewards = () => {
    setRewards([]);
  };

  return {
    rewards,
    addReward,
    removeReward,
    clearAllRewards
  };
}
