import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Zap, Award, CalendarDays, Plus, Target } from 'lucide-react';
import { LineChart, PieChart } from '@mui/x-charts';
import Levels from '@/components/Levels';
import { DailyGoalGauge } from '@/components/DailyGoalGauge';

export default function BoxingTemplatePage({ slug, name }: { slug: string; name: string }) {
  const [showAddHours, setShowAddHours] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const [showAddTape, setShowAddTape] = useState(false);
  const [boxingTapeToAdd, setBoxingTapeToAdd] = useState('');
  const [kickboxingTapeToAdd, setKickboxingTapeToAdd] = useState('');
  const [mmaTapeToAdd, setMmaTapeToAdd] = useState('');

  const entry = useActivityStore((s) => s.getCustomActivity(slug));
  const addCustomHours = useActivityStore((s) => s.addCustomHours);
  const addCustomTapeHours = useActivityStore((s) => s.addCustomTapeHours);
  const setCustomDailyGoal = useActivityStore((s) => s.setCustomDailyGoal);
  const addCustomTodayMinutes = useActivityStore((s) => s.addCustomTodayMinutes);
  const data = entry?.data;

  const boxingLevel = (data?.totalHours ?? 0) >= 1500
    ? 7
    : (data?.totalHours ?? 0) >= 1000
    ? 7
    : (data?.totalHours ?? 0) >= 600
    ? 6
    : (data?.totalHours ?? 0) >= 300
    ? 5
    : (data?.totalHours ?? 0) >= 150
    ? 4
    : (data?.totalHours ?? 0) >= 80
    ? 3
    : (data?.totalHours ?? 0) >= 20
    ? 2
    : 1;

  const fitnessScores = [139, 264, 286, 213, 256, 317, 342];
  const monthLabels = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(d.toLocaleString(undefined, { month: 'short' }));
    }
    return labels;
  }, []);

  const handleAddHours = () => {
    const minutes = parseFloat(hoursToAdd);
    const hours = minutes / 60;
    if (hours > 0) {
      addCustomHours(slug, hours);
      setHoursToAdd('');
      setShowAddHours(false);
    }
  };

  const handleAddTape = () => {
    const boxingMinutes = parseFloat(boxingTapeToAdd);
    const kickMinutes = parseFloat(kickboxingTapeToAdd);
    const mmaMinutes = parseFloat(mmaTapeToAdd);
    const boxingH = boxingMinutes / 60;
    const kickH = kickMinutes / 60;
    const mmaH = mmaMinutes / 60;
    if (boxingH > 0) addCustomTapeHours(slug, 'boxing', boxingH);
    if (kickH > 0) addCustomTapeHours(slug, 'kickboxing', kickH);
    if (mmaH > 0) addCustomTapeHours(slug, 'mma', mmaH);
    setBoxingTapeToAdd('');
    setKickboxingTapeToAdd('');
    setMmaTapeToAdd('');
    setShowAddTape(false);
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-gray-600 mt-1">Track your {name} progress</p>
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
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Zap className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.floor(data.totalHours)}h</div>
              <p className="text-xs text-muted-foreground">lifetime training</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fitness Test Highest Score</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.fitnessTestHighest ?? 0}</div>
              <p className="text-xs text-muted-foreground">personal best</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-green-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fitness Test Score This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.fitnessTestThisMonth ?? 0}</div>
              <p className="text-xs text-muted-foreground">latest monthly score</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {boxingLevel}</div>
              <p className="text-xs text-muted-foreground">as per your leveling template</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Fitness Test Trend (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full" style={{ height: 280 }}>
                <LineChart
                  xAxis={[{ data: monthLabels, scaleType: 'point' }]}
                  series={[{ data: fitnessScores, label: 'Fitness Score', color: '#3b82f6', showMark: true, curve: 'monotoneX' }]}
                  yAxis={[{ min: 0 }]}
                  grid={{ horizontal: false, vertical: false }}
                  sx={{ '.MuiChartsGrid-line': { display: 'none' }, '.MuiChartsLegend-root': { display: 'none' } }}
                  height={280}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden md:col-span-2 lg:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Tape Watched</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowAddTape(true)}><Plus className="w-4 h-4" /> Add Tape</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">
                  {((data.boxingTapeHours ?? 0) + (data.kickboxingTapeHours ?? 0) + (data.mmaTapeHours ?? 0)) > 0 ? (
                    <div className="relative" style={{ height: 240, width: 260 }}>
                      <PieChart
                        series={[{
                          data: [
                            { id: 0, value: data.boxingTapeHours ?? 0, label: 'Boxing Tape', color: '#f59e0b' },
                            { id: 1, value: data.kickboxingTapeHours ?? 0, label: 'Kickboxing Tape', color: '#3b82f6' },
                            { id: 2, value: data.mmaTapeHours ?? 0, label: 'MMA Tape', color: '#10b981' },
                          ],
                          innerRadius: 70,
                          paddingAngle: 2,
                        }]}
                        height={240}
                        slotProps={{ legend: { hidden: true } as any }}
                        sx={{ '.MuiChartsLegend-root': { display: 'none' }, '.MuiChartsTooltip-root': { display: 'none' }, '.MuiPieArcLabel-root': { display: 'none' } }}
                      />
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-xl font-bold text-gray-900">
                          {Math.floor((data.boxingTapeHours ?? 0) + (data.kickboxingTapeHours ?? 0) + (data.mmaTapeHours ?? 0))}h
                        </div>
                        <div className="text-xs text-gray-500">total</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No tape hours yet</div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} /> <span className="text-sm text-gray-600">Boxing Tape</span></div>
                    <div className="font-semibold">{Math.floor(data.boxingTapeHours ?? 0)}h</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} /> <span className="text-sm text-gray-600">Kickboxing Tape</span></div>
                    <div className="font-semibold">{Math.floor(data.kickboxingTapeHours ?? 0)}h</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} /> <span className="text-sm text-gray-600">MMA Tape</span></div>
                    <div className="font-semibold">{Math.floor(data.mmaTapeHours ?? 0)}h</div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Tape</span>
                      <span className="font-semibold">{Math.floor((data.boxingTapeHours ?? 0) + (data.kickboxingTapeHours ?? 0) + (data.mmaTapeHours ?? 0))}h</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Levels variant="boxing" currentLevel={boxingLevel} />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <DailyGoalGauge
              currentHours={data?.totalHours || 0}
              dailyGoalMinutes={data?.dailyGoalMinutes || 30}
              todayMinutes={data?.todayDate === new Date().toDateString() ? (data?.todayMinutes || 0) : 0}
              onUpdateDailyGoal={(minutes) => setCustomDailyGoal(slug, minutes)}
              onUpdateTodayMinutes={(minutes) => addCustomTodayMinutes(slug, minutes - (data?.todayDate === new Date().toDateString() ? (data?.todayMinutes || 0) : 0))}
              variant="boxing"
            />
          </div>
        </div>
      </div>

      {/* Simple modals */}
      {showAddHours && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddHours(false)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Add {name} Minutes</div>
            <Input type="number" step="5" placeholder="e.g., 90" value={hoursToAdd} onChange={(e) => setHoursToAdd(e.target.value)} />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddHours(false)}>Cancel</Button>
              <Button onClick={handleAddHours}>Add</Button>
            </div>
          </div>
        </div>
      )}
      {showAddTape && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddTape(false)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Add Tape Minutes</div>
            <div className="space-y-2">
              <Input type="number" step="5" placeholder="Boxing e.g., 30" value={boxingTapeToAdd} onChange={(e) => setBoxingTapeToAdd(e.target.value)} />
              <Input type="number" step="5" placeholder="Kickboxing e.g., 45" value={kickboxingTapeToAdd} onChange={(e) => setKickboxingTapeToAdd(e.target.value)} />
              <Input type="number" step="5" placeholder="MMA e.g., 60" value={mmaTapeToAdd} onChange={(e) => setMmaTapeToAdd(e.target.value)} />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddTape(false)}>Cancel</Button>
              <Button onClick={handleAddTape}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
