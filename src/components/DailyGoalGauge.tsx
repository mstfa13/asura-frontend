import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Target } from 'lucide-react';
import { PieChart } from '@mui/x-charts/PieChart';

interface DailyGoalGaugeProps {
  currentHours: number;
  dailyGoalMinutes: number;
  todayMinutes: number;
  onUpdateDailyGoal: (minutes: number) => void;
  onUpdateTodayMinutes: (minutes: number) => void;
  variant: 'language' | 'music' | 'boxing';
}

export function DailyGoalGauge({
  currentHours,
  dailyGoalMinutes,
  todayMinutes,
  onUpdateDailyGoal,
  onUpdateTodayMinutes,
  variant
}: DailyGoalGaugeProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [newGoal, setNewGoal] = useState(dailyGoalMinutes.toString());
  const [showAddTime, setShowAddTime] = useState(false);
  const [timeToAdd, setTimeToAdd] = useState('');

  // Define level thresholds based on variant
  const getLevelThresholds = () => {
    if (variant === 'language') {
      return [
        { level: 1, hours: 0 },
        { level: 2, hours: 50 },
        { level: 3, hours: 150 },
        { level: 4, hours: 300 },
        { level: 5, hours: 600 },
        { level: 6, hours: 1000 },
        { level: 7, hours: 1500 },
      ];
    } else if (variant === 'boxing') {
      return [
        { level: 1, hours: 0 },
        { level: 2, hours: 20 },
        { level: 3, hours: 80 },
        { level: 4, hours: 150 },
        { level: 5, hours: 300 },
        { level: 6, hours: 600 },
        { level: 7, hours: 1500 },
      ];
    } else { // music (oud)
      return [
        { level: 1, hours: 0 },
        { level: 2, hours: 20 },
        { level: 3, hours: 60 },
        { level: 4, hours: 150 },
        { level: 5, hours: 300 },
        { level: 6, hours: 600 },
        { level: 7, hours: 1000 },
      ];
    }
  };

  const levelThresholds = getLevelThresholds();
  const currentLevel = (() => {
    let level = 1;
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (currentHours >= levelThresholds[i].hours) {
        level = levelThresholds[i].level;
        break;
      }
    }
    return level;
  })();
  
  // Calculate days remaining to reach each level
  const getDaysToLevel = (targetHours: number) => {
    if (currentHours >= targetHours) return 0;
    const remainingHours = targetHours - currentHours;
    const dailyHours = dailyGoalMinutes / 60;
    return Math.ceil(remainingHours / dailyHours);
  };

  // Gauge progress (0-100)
  const progress = Math.min((todayMinutes / dailyGoalMinutes) * 100, 100);
  const remaining = Math.max(dailyGoalMinutes - todayMinutes, 0);

  const handleUpdateGoal = () => {
    const goal = parseInt(newGoal);
    if (goal > 0) {
      onUpdateDailyGoal(goal);
      setShowSettings(false);
    }
  };

  const handleAddTime = () => {
    const minutes = parseInt(timeToAdd);
    if (minutes > 0) {
      onUpdateTodayMinutes(todayMinutes + minutes);
      setTimeToAdd('');
      setShowAddTime(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Goal Gauge */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daily Goal</CardTitle>
          <div className="flex gap-2">
            <Dialog open={showAddTime} onOpenChange={setShowAddTime}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-1" />
                  Add Time
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Practice Time</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Minutes practiced today</label>
                    <Input
                      type="number"
                      value={timeToAdd}
                      onChange={(e) => setTimeToAdd(e.target.value)}
                      placeholder="e.g., 30"
                      min="1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddTime(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTime}>Add Time</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Daily Goal Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Daily goal (minutes)</label>
                    <Input
                      type="number"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="e.g., 30"
                      min="1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateGoal}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: progress, color: progress >= 100 ? '#10b981' : '#3b82f6' },
                      { id: 1, value: 100 - progress, color: '#f3f4f6' },
                    ],
                    innerRadius: 60,
                    outerRadius: 90,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 270,
                  },
                ]}
                width={192}
                height={192}
                slotProps={{ legend: { display: false } }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {todayMinutes}m / {dailyGoalMinutes}m
                </div>
                {remaining > 0 && (
                  <div className="text-xs text-gray-400">
                    {remaining}m left
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress with Days Remaining */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {levelThresholds.slice(1).map(({ level, hours }) => {
              const daysRemaining = getDaysToLevel(hours);
              const isReached = currentHours >= hours;
              
              return (
                <div
                  key={level}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isReached 
                      ? 'bg-green-50 border-green-200' 
                      : level === currentLevel + 1 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isReached 
                        ? 'bg-green-500 text-white' 
                        : level === currentLevel + 1 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {level}
                    </div>
                    <div>
                      <div className="font-medium text-sm">Level {level}</div>
                      <div className="text-xs text-gray-600">{hours}+ hours</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {isReached ? (
                      <span className="text-sm font-medium text-green-600">Reached</span>
                    ) : (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                        </div>
                        <div className="text-xs text-gray-500">
                          at {dailyGoalMinutes}m/day
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
