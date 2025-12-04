import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Music2, Clock, Plus, Target, Flame, Edit2 } from 'lucide-react';
import Levels from '@/components/Levels';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Violin() {
  const [showAddHours, setShowAddHours] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const [editTotalOpen, setEditTotalOpen] = useState(false);
  const [manualTotal, setManualTotal] = useState('');
  const { violin, addHours, setActivityTotalHours } = useActivityStore();

  // Derive level using provided violin thresholds
  const violinLevel =
    violin.totalHours >= 1000 ? 7 :
    violin.totalHours >= 700 ? 6 :
    violin.totalHours >= 400 ? 5 :
    violin.totalHours >= 200 ? 4 :
    violin.totalHours >= 80 ? 3 :
    violin.totalHours >= 20 ? 2 :
    1;

  const handleAddHours = () => {
    const hours = parseFloat(hoursToAdd);
    if (hours > 0) {
      addHours('violin', hours);
      setHoursToAdd('');
      setShowAddHours(false);
    }
  };

  const handleEditTotal = () => {
    const hours = parseFloat(manualTotal);
    if (hours >= 0) {
      setActivityTotalHours('violin', hours);
      setEditTotalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Violin</h1>
                <p className="text-gray-600 mt-1">Track your music practice</p>
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
                  <DialogTitle>Add Violin Practice Hours</DialogTitle>
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
                  <Button onClick={handleAddHours} className="bg-violet-600 hover:bg-violet-700">Add Hours</Button>
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
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setManualTotal(violin.totalHours.toString());
                    setEditTotalOpen(true);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Music2 className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{violin.totalHours}h</div>
              <p className="text-xs text-muted-foreground">lifetime practice</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{violin.thisWeekSessions}</div>
              <p className="text-xs text-muted-foreground">sessions completed</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{violin.currentStreak}</div>
              <p className="text-xs text-muted-foreground">days consistent</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Concerts</CardTitle>
              <Target className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{violin.totalConcerts ?? 0}</div>
              <p className="text-xs text-muted-foreground">performed so far</p>
            </CardContent>
          </Card>
        </div>

        {/* Levels - Oud variant for violin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Levels variant="violin" currentLevel={violinLevel} />
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
