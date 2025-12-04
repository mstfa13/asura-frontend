import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Music2, Clock, Plus, Target, Flame } from 'lucide-react';
import Levels from '@/components/Levels';
import { DailyGoalGauge } from '@/components/DailyGoalGauge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function MusicTemplatePage({ slug, name }: { slug: string; name: string }) {
  const [showAddHours, setShowAddHours] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const addCustomHours = useActivityStore((s) => s.addCustomHours);
  const entry = useActivityStore((s) => s.getCustomActivity(slug));
  const setCustomDailyGoal = useActivityStore((s) => s.setCustomDailyGoal);
  const addCustomTodayMinutes = useActivityStore((s) => s.addCustomTodayMinutes);
  const data = entry?.data;

  const level = (() => {
    const h = data?.totalHours ?? 0;
    return h >= 1500 ? 7 : h >= 1000 ? 6 : h >= 600 ? 5 : h >= 300 ? 4 : h >= 150 ? 3 : h >= 60 ? 2 : 1;
  })();

  const handleAddHours = () => {
    const hours = parseFloat(hoursToAdd);
    if (hours > 0) {
      addCustomHours(slug, hours);
      setHoursToAdd('');
      setShowAddHours(false);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-gray-600 mt-1">Track your music practice</p>
              </div>
            </div>
            <Dialog open={showAddHours} onOpenChange={setShowAddHours}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Hours
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add {name} Hours</DialogTitle>
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
                  <Button onClick={handleAddHours} className="bg-purple-600 hover:bg-purple-700">Add Hours</Button>
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Music2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.floor(data.totalHours)}h</div>
              <p className="text-xs text-muted-foreground">lifetime practice</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.thisWeekSessions}</div>
              <p className="text-xs text-muted-foreground">sessions completed</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.currentStreak}</div>
              <p className="text-xs text-muted-foreground">days consistent</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Concerts</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalConcerts ?? 0}</div>
              <p className="text-xs text-muted-foreground">performed so far</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Levels variant="oud" currentLevel={level} />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <DailyGoalGauge
              currentHours={data?.totalHours || 0}
              dailyGoalMinutes={data?.dailyGoalMinutes || 30}
              todayMinutes={data?.todayDate === new Date().toDateString() ? (data?.todayMinutes || 0) : 0}
              onUpdateDailyGoal={(minutes) => setCustomDailyGoal(slug, minutes)}
              onUpdateTodayMinutes={(minutes) => addCustomTodayMinutes(slug, minutes - (data?.todayDate === new Date().toDateString() ? (data?.todayMinutes || 0) : 0))}
              variant="music"
            />
          </div>
        </div>
      </div>

      {showAddHours && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddHours(false)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Add {name} Hours</div>
            <Input type="number" step="0.5" placeholder="e.g., 1.5" value={hoursToAdd} onChange={(e) => setHoursToAdd(e.target.value)} />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddHours(false)}>Cancel</Button>
              <Button onClick={handleAddHours}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
