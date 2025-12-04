import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementBadge, { Achievement } from "./AchievementBadge";
import { Filter, Search, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AchievementGalleryProps {
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
}

export default function AchievementGallery({ 
  achievements, 
  unlockedCount, 
  totalCount 
}: AchievementGalleryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'progress', 'streak', 'milestone', 'social', 'challenge'];
  
  const filteredAchievements = achievements.filter(achievement => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'unlocked' && achievement.isUnlocked) ||
      (activeTab === 'locked' && !achievement.isUnlocked);
    
    const matchesCategory = 
      selectedCategory === 'all' || achievement.category === selectedCategory;
    
    const matchesSearch = 
      searchQuery === '' || 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
  });

  const groupedByRarity = filteredAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.rarity]) {
      acc[achievement.rarity] = [];
    }
    acc[achievement.rarity].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const rarityOrder: Array<keyof typeof groupedByRarity> = ['legendary', 'epic', 'rare', 'common'];

  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievement Gallery
            </span>
            <Badge variant="outline" className="text-sm">
              {unlockedCount}/{totalCount} Unlocked ({Math.round(progressPercentage)}%)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Collection Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({achievements.length})</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({unlockedCount})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({totalCount - unlockedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredAchievements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No achievements found matching your criteria.</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="mt-2"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {rarityOrder.map(rarity => {
                const achievementsForRarity = groupedByRarity[rarity];
                if (!achievementsForRarity?.length) return null;

                return (
                  <div key={rarity}>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold capitalize text-gray-900">
                        {rarity} Achievements
                      </h3>
                      <Badge variant="secondary">
                        {achievementsForRarity.length}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {achievementsForRarity.map(achievement => (
                        <div key={achievement.id} className="flex justify-center">
                          <AchievementBadge 
                            achievement={achievement} 
                            size="lg"
                            showProgress={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
