import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Languages, Clock, Plus, Target, Flame, Edit2 } from 'lucide-react';
import Levels from '@/components/Levels';
import { DailyGoalGauge } from '@/components/DailyGoalGauge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function German() {
  const [showAddHours, setShowAddHours] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const [editTotalOpen, setEditTotalOpen] = useState(false);
  const [manualTotal, setManualTotal] = useState('');
  const { german, addHours, setActivityTotalHours } = useActivityStore();
  const setDailyGoal = useActivityStore((s) => s.setDailyGoal);
  const addTodayMinutes = useActivityStore((s) => s.addTodayMinutes);
  // Derive current level from hours using language thresholds similar to Levels component
  const germanLevel = german.totalHours >= 1000
    ? 7
    : german.totalHours >= 600
    ? 5
    : german.totalHours >= 300
    ? 4
    : german.totalHours >= 150
    ? 3
    : german.totalHours >= 50
    ? 2
    : 1;

  const handleAddHours = () => {
    const hours = parseFloat(hoursToAdd);
    if (hours > 0) {
      addHours('german', hours);
      setHoursToAdd('');
      setShowAddHours(false);
    }
  };

  const handleEditTotal = () => {
    const hours = parseFloat(manualTotal);
    if (hours >= 0) {
      setActivityTotalHours('german', hours);
      setEditTotalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-gray-900 rounded-lg flex items-center justify-center">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">German</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Track your German practice</p>
              </div>
            </div>
            <Dialog open={showAddHours} onOpenChange={setShowAddHours}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Hours
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add German Hours</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hours practiced</label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="e.g., 1.5"
                      value={hoursToAdd}
                      onChange={(e) => setHoursToAdd(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddHours} className="bg-slate-700 hover:bg-slate-800">Add Hours</Button>
                  <Button variant="outline" onClick={() => setShowAddHours(false)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-900 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setManualTotal(german.totalHours.toString());
                    setEditTotalOpen(true);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Languages className="h-4 w-4 text-slate-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{german.totalHours}h</div>
              <p className="text-xs text-muted-foreground">lifetime practice</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-700 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-gray-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{german.thisWeekSessions}</div>
              <p className="text-xs text-muted-foreground">sessions completed</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-black opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-slate-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{german.currentStreak}</div>
              <p className="text-xs text-muted-foreground">days consistent</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-gray-700 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Target className="h-4 w-4 text-zinc-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {germanLevel}</div>
              <p className="text-xs text-muted-foreground">as per your leveling template</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Levels and Daily Goal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Levels variant="language" currentLevel={germanLevel} />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <DailyGoalGauge
              currentHours={german.totalHours}
              dailyGoalMinutes={german.dailyGoalMinutes || 30}
              todayMinutes={german.todayDate === new Date().toDateString() ? (german.todayMinutes || 0) : 0}
              onUpdateDailyGoal={(minutes) => setDailyGoal('german', minutes)}
              onUpdateTodayMinutes={(minutes) => addTodayMinutes('german', minutes - (german.todayDate === new Date().toDateString() ? (german.todayMinutes || 0) : 0))}
              variant="language"
            />
          </div>
        </div>
      </div>
      
      {/* Edit Total Hours Dialog */}
      <Dialog open={editTotalOpen} onOpenChange={setEditTotalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Total Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Total Hours</label>
              <Input
                type="number"
                value={manualTotal}
                onChange={(e) => setManualTotal(e.target.value)}
                placeholder="Enter total hours"
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditTotalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTotal}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
