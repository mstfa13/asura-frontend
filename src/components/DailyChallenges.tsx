import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Flame, 
  Trophy, 
  Repeat,
  ChevronRight
} from "lucide-react";

interface Challenge {
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

interface DailyChallengesProps {
  challenges: Challenge[];
  onCompleteChallenge: (challengeId: string) => void;
  streak: number;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
  hard: 'bg-orange-100 text-orange-800 border-orange-200',
  expert: 'bg-red-100 text-red-800 border-red-200',
};

const categoryIcons = {
  daily: Clock,
  weekly: Target,
  monthly: Trophy,
  special: Flame,
};

export default function DailyChallenges({ 
  challenges, 
  onCompleteChallenge, 
  streak 
}: DailyChallengesProps) {
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const dailyChallenges = challenges.filter(c => c.category === 'daily');
  const otherChallenges = challenges.filter(c => c.category !== 'daily');
  
  const completedToday = dailyChallenges.filter(c => c.isCompleted).length;
  const totalDaily = dailyChallenges.length;

  const renderChallenge = (challenge: Challenge) => {
    const IconComponent = categoryIcons[challenge.category];
    const isExpanded = expandedChallenge === challenge.id;
    const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;

    return (
      <div
        key={challenge.id}
        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer
          ${challenge.isCompleted 
            ? 'bg-green-50 border-green-200' 
            : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        onClick={() => setExpandedChallenge(isExpanded ? null : challenge.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${challenge.isCompleted 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-600'
              }`}>
              {challenge.isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <IconComponent className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium ${
                  challenge.isCompleted ? 'text-green-800' : 'text-gray-900'
                }`}>
                  {challenge.title}
                </h4>
                <Badge className={difficultyColors[challenge.difficulty]}>
                  {challenge.difficulty}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
              
              {!challenge.isCompleted && (
                <div className="space-y-1">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {challenge.progress}/{challenge.maxProgress} completed
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Badge variant="secondary" className="text-xs">
              +{challenge.xpReward} XP
            </Badge>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform
              ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h5>
              <ul className="space-y-1">
                {challenge.requirements.map((req, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            
            {challenge.expiresAt && (() => {
              const exp = new Date(challenge.expiresAt as unknown as string | number | Date);
              return (
              <div className="text-xs text-gray-500">
                Expires: {exp.toLocaleDateString()} at {exp.toLocaleTimeString()}
              </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Daily Challenges
            </span>
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-normal text-gray-600">
                {streak} day streak
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today's Progress</span>
              <span className="text-sm font-medium">
                {completedToday}/{totalDaily} completed
              </span>
            </div>
            <Progress 
              value={(completedToday / totalDaily) * 100} 
              className="h-3"
            />
            {completedToday === totalDaily && (
              <div className="text-center">
                <Badge className="bg-green-500 text-white">
                  🎉 All daily challenges completed!
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      {dailyChallenges.length > 0 && (
        <div className="space-y-3">
          {dailyChallenges.map(renderChallenge)}
        </div>
      )}

      {/* Other Challenges */}
      {otherChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Special Challenges
          </h3>
          <div className="space-y-3">
            {otherChallenges.map(renderChallenge)}
          </div>
        </div>
      )}
    </div>
  );
}
