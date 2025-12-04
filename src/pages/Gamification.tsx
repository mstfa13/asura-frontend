import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import XPSystem from "@/components/XPSystem";
import AchievementGallery from "@/components/AchievementGallery";
import DailyChallenges from "@/components/DailyChallenges";
import Leaderboard from "@/components/Leaderboard";
import RewardNotification from "@/components/RewardNotification";
import { useGamificationStore } from "@/hooks/useGamification";
import { Trophy, Target, Users, Award, Plus } from "lucide-react";

export default function Gamification() {  const {
    currentXP,
    currentLevel,
    recentXPGains,
    achievements,
    challenges,
    dailyStreak,
    leaderboard,
    currentUserId,
    pendingRewards,
    addXP,
    unlockAchievement,
    completeChallenge,
    updateStreak,
    initializeDefaultData,
    removeReward,
    getXPToNextLevel,
    getTotalXPForCurrentLevel,
    getUnlockedAchievementCount
  } = useGamificationStore();

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Initialize default data if needed
    if (achievements.length === 0) {
      initializeDefaultData();
    }
  }, []);

  const handleTestXP = () => {
    addXP("Test Activity", 50);
  };

  const handleTestAchievement = () => {
    const lockedAchievements = achievements.filter(a => !a.isUnlocked);
    if (lockedAchievements.length > 0) {
      unlockAchievement(lockedAchievements[0].id);
    }
  };

  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
  };

  const unlockedCount = getUnlockedAchievementCount();
  const totalAchievements = achievements.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gamification Dashboard</h1>
        <p className="text-gray-600">Track your progress, unlock achievements, and compete with others!</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* XP System */}
            <XPSystem
              currentXP={currentXP}
              currentLevel={currentLevel}
              xpToNextLevel={getXPToNextLevel()}
              totalXPForNextLevel={getTotalXPForCurrentLevel()}
              recentXPGains={recentXPGains}
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dailyStreak}</div>
                    <div className="text-sm text-blue-700">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{unlockedCount}</div>
                    <div className="text-sm text-green-700">Achievements</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Collection Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {unlockedCount}/{totalAchievements} achievements unlocked
                  </div>
                </div>

                {/* Test Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="text-sm font-medium text-gray-700">Test Features:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={handleTestXP} size="sm" variant="outline">
                      <Plus className="w-3 h-3 mr-1" />
                      Add XP
                    </Button>
                    <Button onClick={handleTestAchievement} size="sm" variant="outline">
                      <Award className="w-3 h-3 mr-1" />
                      Unlock Achievement
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentXPGains.length > 0 ? (
                <div className="space-y-3">
                  {recentXPGains.slice(0, 5).map((gain, index) => {
                    const ts = new Date(gain.timestamp as unknown as string | number | Date);
                    return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{gain.activity}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600">+{gain.xp} XP</span>
                        <span className="text-xs text-gray-500">
                          {ts.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity yet.</p>
                  <p className="text-sm">Complete some activities to see your progress here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementGallery
            achievements={achievements}
            unlockedCount={unlockedCount}
            totalCount={totalAchievements}
          />
        </TabsContent>

        <TabsContent value="challenges">
          <DailyChallenges
            challenges={challenges}
            onCompleteChallenge={handleCompleteChallenge}
            streak={dailyStreak}
          />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard
            entries={leaderboard}
            timeframe="weekly"
            currentUserId={currentUserId}
          />        </TabsContent>
      </Tabs>
      
      {/* Reward Notifications */}
      {pendingRewards.map((reward, index) => (
        <RewardNotification
          key={reward.id}
          reward={reward}
          onDismiss={() => removeReward(reward.id)}
          autoHide={true}
          hideDelay={4000 + index * 1000} // Stagger notifications
        />
      ))}
    </div>
  );
}
