import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, TrendingUp, Medal, Crown } from "lucide-react";

interface LeaderboardEntry {
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

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  timeframe: 'weekly' | 'monthly' | 'allTime';
  currentUserId: string;
}

export default function Leaderboard({ entries, timeframe, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const currentUser = entries.find(entry => entry.id === currentUserId);
  const topEntries = entries.slice(0, 10);

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      case 'allTime':
        return 'All Time';
    }
  };

  const getRelevantXP = (entry: LeaderboardEntry) => {
    switch (timeframe) {
      case 'weekly':
        return entry.weeklyXP;
      case 'monthly':
        return entry.weeklyXP * 4; // Approximate monthly
      case 'allTime':
        return entry.totalXP;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </span>
          <Badge variant="outline">
            {getTimeframeLabel()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Current User Position (if not in top 10) */}
        {currentUser && currentUser.rank > 10 && (
          <div className="px-6 py-3 bg-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">#{currentUser.rank}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">You</div>
                    <div className="text-xs text-gray-500">Level {currentUser.level}</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">{getRelevantXP(currentUser).toLocaleString()} XP</div>
                <div className="text-xs text-gray-500">{currentUser.achievements} achievements</div>
              </div>
            </div>
          </div>
        )}

        {/* Top Rankings */}
        <div className="divide-y divide-gray-100">
          {topEntries.map((entry) => (
            <div
              key={entry.id}
              className={`px-6 py-4 transition-colors ${
                entry.id === currentUserId 
                  ? 'bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full
                    ${getRankBadgeColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {entry.id === currentUserId ? 'You' : entry.name}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Level {entry.level}</span>
                        {entry.rank <= 3 && (
                          <Badge variant="secondary" className="text-xs">
                            Top {entry.rank}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {getRelevantXP(entry).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.achievements} achievements
                  </div>
                  {timeframe === 'weekly' && entry.weeklyXP > 0 && (
                    <div className="flex items-center justify-end text-xs text-green-600 mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{entry.weeklyXP} this week
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No rankings available yet.</p>
            <p className="text-sm">Complete some activities to appear on the leaderboard!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
