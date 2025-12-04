import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Award, Zap } from "lucide-react";

interface XPSystemProps {
  currentXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalXPForNextLevel: number;
  recentXPGains?: Array<{
    activity: string;
    xp: number;
    timestamp: Date;
  }>;
}

export default function XPSystem({
  currentXP,
  currentLevel,
  xpToNextLevel,
  totalXPForNextLevel,
  recentXPGains = []
}: XPSystemProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const progressPercentage = ((totalXPForNextLevel - xpToNextLevel) / totalXPForNextLevel) * 100;
  
  const getLevelColor = (level: number) => {
    if (level < 10) return "bg-gradient-to-r from-green-400 to-green-500";
    if (level < 25) return "bg-gradient-to-r from-blue-400 to-blue-500";
    if (level < 50) return "bg-gradient-to-r from-purple-400 to-purple-500";
    return "bg-gradient-to-r from-yellow-400 to-orange-500";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full ${getLevelColor(currentLevel)} 
              flex items-center justify-center shadow-lg`}>
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">Level {currentLevel}</div>
              <div className="text-sm text-gray-500">{currentXP.toLocaleString()} Total XP</div>
            </div>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Details
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress to Level {currentLevel + 1}</span>
              <span className="font-medium">
                {(totalXPForNextLevel - xpToNextLevel).toLocaleString()} / {totalXPForNextLevel.toLocaleString()} XP
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-xs text-gray-500 text-center">
              {xpToNextLevel.toLocaleString()} XP needed
            </div>
          </div>

          {/* Recent XP Gains */}
          {showDetails && recentXPGains.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Recent XP Gains
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recentXPGains.slice(0, 5).map((gain, index) => {
                  const ts = new Date(gain.timestamp as unknown as string | number | Date);
                  return (
                  <div key={index} className="flex items-center justify-between text-sm 
                    bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-600">{gain.activity}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        +{gain.xp} XP
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {ts.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Level Rewards Preview */}
          {showDetails && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Award className="w-4 h-4" />
                Next Level Rewards
              </div>
              <div className="text-xs text-gray-600 bg-blue-50 rounded-lg p-2">
                • New achievement badge unlocked
                • +1 daily challenge unlock
                • Special profile decoration
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
