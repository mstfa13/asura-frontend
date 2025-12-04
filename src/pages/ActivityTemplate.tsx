import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Target, Plus, Flame, Clock } from 'lucide-react';
import Levels from '@/components/Levels';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Props {
  slug: string;
  name: string;
}

export default function ActivityTemplate({ slug, name }: Props) {
  const [showAddHours, setShowAddHours] = useState(false);
  const [minutesToAdd, setMinutesToAdd] = useState('');
  const { getCustomActivity, addCustomHours } = useActivityStore();
  const entry = getCustomActivity(slug);
  const data = entry?.data;

  const level = useMemo(() => {
    const h = data?.totalHours ?? 0;
    return h >= 1000 ? 7 : h >= 600 ? 5 : h >= 300 ? 4 : h >= 150 ? 3 : h >= 50 ? 2 : 1;
  }, [data?.totalHours]);

  const handleAdd = () => {
    const minutes = parseFloat(minutesToAdd);
    const hours = minutes / 60;
    if (hours > 0) {
      addCustomHours(slug, hours);
      setMinutesToAdd('');
      setShowAddHours(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Activity not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              <p className="text-gray-600 mt-1">Track your {name} practice</p>
            </div>
            <Dialog open={showAddHours} onOpenChange={setShowAddHours}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Minutes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add {name} Minutes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Minutes</label>
                    <Input
                      type="number"
                      step="5"
                      placeholder="e.g., 45"
                      value={minutesToAdd}
                      onChange={(e) => setMinutesToAdd(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAdd}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 4 Cards template */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.floor(data.totalHours)}h</div>
              <p className="text-xs text-muted-foreground">lifetime practice</p>
            </CardContent>
          </Card>

          {/* This Week Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> {data.thisWeekSessions}
              </div>
              <p className="text-xs text-muted-foreground">sessions completed</p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card>
            <CardHeader>
              <CardTitle>Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Flame className="w-4 h-4" /> {data.currentStreak}
              </div>
              <p className="text-xs text-muted-foreground">days consistent</p>
            </CardContent>
          </Card>

          {/* Current Level */}
          <Card>
            <CardHeader>
              <CardTitle>Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-4 h-4" /> Level {level}
              </div>
              <p className="text-xs text-muted-foreground">derived from total hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Levels variant="language" currentLevel={level} />
          </div>
        </div>
      </div>
    </div>
  );
}
