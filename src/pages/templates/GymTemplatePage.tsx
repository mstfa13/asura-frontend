import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Dumbbell, Clock, Plus, Target, Flame } from 'lucide-react';
import Levels from '@/components/Levels';
import { LineChart } from '@mui/x-charts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GymTemplatePage({ slug, name }: { slug: string; name: string }) {
  const [showAddHours, setShowAddHours] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const addCustomHours = useActivityStore((s) => s.addCustomHours);
  const entry = useActivityStore((s) => s.getCustomActivity(slug));
  const data = entry?.data;

  // Weight trend data from custom entry
  const trend = data?.weightTrend ?? [];
  const weightDates = trend.map((p) => p.date);
  const weightValues = trend.map((p) => p.weight);
  const yMin = weightValues.length ? Math.floor(Math.min(...weightValues) - 2) : 0;
  const yMax = weightValues.length ? Math.ceil(Math.max(...weightValues) + 2) : 100;
  const [addWeightOpen, setAddWeightOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const addCustomWeight = useActivityStore((s) => s.addCustomWeight);

  const submitWeight = () => {
    const w = parseFloat(newWeight);
    if (Number.isFinite(w) && w > 0) {
      addCustomWeight(slug, w);
      setNewWeight('');
      setAddWeightOpen(false);
    }
  };

  // Exercise progress
  const exerciseNameMap = (data as any)?.gymExerciseNames ?? {};
  const renameExercise = useActivityStore((s) => s.updateCustomExerciseName);
  const exercises = useMemo(
    () => [
      { id: 'flat-db-press', label: exerciseNameMap['flat-db-press'] || 'Flat DB Press' },
      { id: 'flat-bpress-machine', label: exerciseNameMap['flat-bpress-machine'] || 'Flat B-Press Machine' },
      { id: 'high-low-cable-fly', label: exerciseNameMap['high-low-cable-fly'] || 'High to Low Cable Fly' },
      { id: 'tri-rope-pushdown', label: exerciseNameMap['tri-rope-pushdown'] || 'Tri Rope Pushdown' },
      { id: 'db-lateral-raises', label: exerciseNameMap['db-lateral-raises'] || 'DB Lateral Raises' },
      { id: 'shoulder-press-machine', label: exerciseNameMap['shoulder-press-machine'] || 'Shoulder Press Machine' },
    ],
    [exerciseNameMap]
  );

  const exerciseProgress = (data as any)?.gymExerciseProgress ?? {};
  const [selectedExercise, setSelectedExercise] = useState<string>(exercises[0]?.id ?? 'flat-db-press');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const addGymExerciseWeight = useActivityStore((s) => s.addCustomExerciseWeight);
  const currentSeries = exerciseProgress[selectedExercise] ?? [];
  const exDates = currentSeries.map((p: any) => p.date);
  const exWeights = currentSeries.map((p: any) => p.weight ?? null);
  const exYMin = (() => {
    const vals = exWeights.filter((v: any): v is number => typeof v === 'number');
    return vals.length ? Math.floor(Math.min(...vals) - 2) : 0;
  })();
  const exYMax = (() => {
    const vals = exWeights.filter((v: any): v is number => typeof v === 'number');
    return vals.length ? Math.ceil(Math.max(...vals) + 2) : 10;
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-gray-600 mt-1">Track your strength training</p>
              </div>
            </div>
            <Button className="flex items-center gap-2" onClick={() => setShowAddHours(true)}>
              <Plus className="w-4 h-4" /> Add Hours
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Dumbbell className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.floor(data.totalHours)}h</div>
              <p className="text-xs text-muted-foreground">lifetime training</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.thisWeekSessions}</div>
              <p className="text-xs text-muted-foreground">sessions completed</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
              <Flame className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weightValues[weightValues.length - 1] ?? '--'} kg</div>
              <p className="text-xs text-muted-foreground">most recent</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goal Weight</CardTitle>
              <Target className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">target</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden md:col-span-2 lg:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Weight Trend</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setAddWeightOpen(true)}>Add Weight</Button>
            </CardHeader>
            <CardContent>
              <div className="w-full" style={{ height: 260 }}>
                {weightValues.length > 0 ? (
                  <LineChart
                    xAxis={[{ data: weightDates, scaleType: 'point' }]}
                    series={[{ data: weightValues, label: 'Weight', color: '#3b82f6', showMark: true, curve: 'monotoneX' }]}
                    yAxis={[{ min: yMin, max: yMax }]}
                    grid={{ horizontal: false, vertical: false }}
                    sx={{ '.MuiChartsGrid-line': { display: 'none' }, '.MuiChartsLegend-root': { display: 'none' }, '.MuiLineElement-root': { strokeWidth: 2 } }}
                    height={260}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    No data yet. Click "Add Weight" to start tracking.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="md:col-span-2 lg:col-span-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Levels variant="generic" currentLevel={1} />
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
      {addWeightOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setAddWeightOpen(false)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Add Current Weight</div>
            <Input type="number" step="0.1" placeholder="e.g., 92" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddWeightOpen(false)}>Cancel</Button>
              <Button onClick={submitWeight}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
