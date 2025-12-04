
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Zap, Award, CalendarDays, Plus, Target } from 'lucide-react';
import { LineChart, PieChart } from '@mui/x-charts';
import Levels from '@/components/Levels';
import { DailyGoalGauge } from '@/components/DailyGoalGauge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Boxing() {
  const [showAddHours, setShowAddHours] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const [showAddTape, setShowAddTape] = useState(false);
  const [boxingTapeToAdd, setBoxingTapeToAdd] = useState('');
  const [kickboxingTapeToAdd, setKickboxingTapeToAdd] = useState('');
  const [mmaTapeToAdd, setMmaTapeToAdd] = useState('');
  const { boxing, addHours, addTapeHours, addBoxingTapeEntry, updateBoxingTapeAt, deleteBoxingTapeAt, resetBoxingTape } = useActivityStore();
  const setActivityTotalHours = useActivityStore((s) => s.setActivityTotalHours);
  const setDailyGoal = useActivityStore((s) => s.setDailyGoal);
  const addTodayMinutes = useActivityStore((s) => s.addTodayMinutes);
  const [editTotalOpen, setEditTotalOpen] = useState(false);
  const [manualTotal, setManualTotal] = useState('');
  const [tapeView, setTapeView] = useState<'chart' | 'table'>('chart');
  const [editTapeIdx, setEditTapeIdx] = useState<number | null>(null);
  const [editBoxing, setEditBoxing] = useState('');
  const [editKick, setEditKick] = useState('');
  const [editMma, setEditMma] = useState('');
  const [editDate, setEditDate] = useState('');

  // Derive current boxing level from hours using boxing thresholds
  const boxingLevel = boxing.totalHours >= 1500
    ? 7
    : boxing.totalHours >= 1000
    ? 7
    : boxing.totalHours >= 600
    ? 6
    : boxing.totalHours >= 300
    ? 5
    : boxing.totalHours >= 150
    ? 4
    : boxing.totalHours >= 80
    ? 3
    : boxing.totalHours >= 20
    ? 2
    : 1;

  // Fitness test trend from store
  const fitnessTrend = boxing.fitnessTestTrend ?? [];
  const monthLabels = fitnessTrend.map((r) => r.date);
  const fitnessScores = fitnessTrend.map((r) => r.score);
  
  // Debug logging
  console.log('Boxing data:', boxing);
  console.log('Fitness trend:', fitnessTrend);
  console.log('Fitness scores:', fitnessScores);
  const [fitnessView, setFitnessView] = useState<'chart' | 'table'>('chart');
  const [showAddFitness, setShowAddFitness] = useState(false);
  const [fitnessToAdd, setFitnessToAdd] = useState('');
  const [editFitnessIdx, setEditFitnessIdx] = useState<number | null>(null);
  const [editFitnessScore, setEditFitnessScore] = useState('');
  const [editFitnessDate, setEditFitnessDate] = useState('');
  const { addFitnessScore, updateFitnessScoreAt, deleteFitnessScoreAt } = useActivityStore();

  const handleAddHours = () => {
    const minutes = parseFloat(hoursToAdd);
    const hours = minutes / 60;
    if (hours > 0) {
      addHours('boxing', hours);
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
    if (boxingH > 0) addTapeHours('boxing', boxingH);
    if (kickH > 0) addTapeHours('kickboxing', kickH);
    if (mmaH > 0) addTapeHours('mma', mmaH);
    if (boxingH > 0 || kickH > 0 || mmaH > 0) {
      addBoxingTapeEntry(boxingH, kickH, mmaH);
    }
    setBoxingTapeToAdd('');
    setKickboxingTapeToAdd('');
    setMmaTapeToAdd('');
    setShowAddTape(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Boxing</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Track your boxing progress</p>
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
                  <DialogTitle>Add Boxing Hours</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Minutes practiced</label>
                    <Input
                      type="number"
                      step="5"
                      placeholder="e.g., 90"
                      value={hoursToAdd}
                      onChange={(e) => setHoursToAdd(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddHours} className="bg-red-600 hover:bg-red-700">Add Hours</Button>
                  <Button variant="outline" onClick={() => setShowAddHours(false)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 4 Simple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Hours */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-red-600" />
                <button
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                  onClick={() => { setManualTotal(String(boxing.totalHours)); setEditTotalOpen(true); }}
                  title="Edit total hours"
                >
                  Edit
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.floor(boxing.totalHours)}h</div>
              <p className="text-xs text-muted-foreground">lifetime training</p>
            </CardContent>
          </Card>

          {/* Card 2: Fitness Test Highest Score */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fitness Test Highest Score</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{boxing.fitnessTestHighest ?? 0}</div>
              <p className="text-xs text-muted-foreground">personal best</p>
            </CardContent>
          </Card>

          {/* Card 3: Fitness Test Score This Month */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-green-500 opacity-5" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fitness Test Score This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{boxing.fitnessTestThisMonth ?? 0}</div>
              <p className="text-xs text-muted-foreground">latest monthly score</p>
            </CardContent>
          </Card>

      {/* Card 4: Current Level (match other pages) */}
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

        {/* Fitness Test Trend (Monthly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Fitness Test Trend (Monthly)</CardTitle>
              <div className="flex items-center gap-2">
                <Dialog open={showAddFitness} onOpenChange={setShowAddFitness}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">Add Score</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Fitness Test Score</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Score</label>
                        <Input type="number" step="1" placeholder="e.g., 320" value={fitnessToAdd} onChange={(e) => setFitnessToAdd(e.target.value)} className="mt-1" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => { const s = parseFloat(fitnessToAdd); if (Number.isFinite(s)) { addFitnessScore(s); setFitnessToAdd(''); setShowAddFitness(false); } }}>Add</Button>
                      <Button variant="outline" onClick={() => setShowAddFitness(false)}>Cancel</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant={fitnessView === 'chart' ? 'default' : 'outline'} size="sm" onClick={() => setFitnessView('chart')}>Chart</Button>
                <Button variant={fitnessView === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setFitnessView('table')}>Table</Button>
              </div>
            </CardHeader>
            <CardContent>
              {fitnessView === 'chart' ? (
                <div className="w-full" style={{ height: 280 }}>
                  {fitnessTrend.length > 0 ? (
                    <LineChart
                      xAxis={[{ data: monthLabels, scaleType: 'point' }]}
                      series={[{
                        data: fitnessScores,
                        label: 'Fitness Score',
                        color: '#3b82f6',
                        showMark: true,
                        curve: 'monotoneX',
                      }]}
                      yAxis={[{ min: 0 }]}
                      grid={{ horizontal: false, vertical: false }}
                      sx={{ '.MuiChartsGrid-line': { display: 'none' }, '.MuiChartsLegend-root': { display: 'none' } }}
                      height={280}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      No fitness scores yet. Click "Add Score" to start tracking.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {fitnessTrend.length > 0 ? (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-2 pr-4">Month</th>
                          <th className="py-2 pr-4">Score</th>
                          <th className="py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fitnessTrend.map((r, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2 pr-4">{r.date}</td>
                            <td className="py-2 pr-4">{r.score}</td>
                            <td className="py-2 flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditFitnessIdx(i); setEditFitnessScore(String(r.score)); setEditFitnessDate(r.date); }}>Edit</Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteFitnessScoreAt(i)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-sm text-gray-500">No scores yet.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tape Watched */}
          <Card className="overflow-hidden md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle> Tape Watched</CardTitle>
              <div className="flex items-center gap-2">
                <Dialog open={showAddTape} onOpenChange={setShowAddTape}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Plus className="w-4 h-4" /> Add Tape Hours
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Tape Hours</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Boxing tape minutes</label>
                        <Input
                          type="number"
                          step="5"
                          placeholder="e.g., 30"
                          value={boxingTapeToAdd}
                          onChange={(e) => setBoxingTapeToAdd(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Kickboxing tape minutes</label>
                        <Input
                          type="number"
                          step="5"
                          placeholder="e.g., 45"
                          value={kickboxingTapeToAdd}
                          onChange={(e) => setKickboxingTapeToAdd(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">MMA tape minutes</label>
                        <Input
                          type="number"
                          step="5"
                          placeholder="e.g., 60"
                          value={mmaTapeToAdd}
                          onChange={(e) => setMmaTapeToAdd(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTape} className="bg-red-600 hover:bg-red-700">Add</Button>
                      <Button variant="outline" onClick={() => setShowAddTape(false)}>Cancel</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => resetBoxingTape()}>Reset</Button>
                <Button variant={tapeView === 'chart' ? 'default' : 'outline'} size="sm" onClick={() => setTapeView('chart')}>Chart</Button>
                <Button variant={tapeView === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setTapeView('table')}>Table</Button>
              </div>
            </CardHeader>
            <CardContent>
              {tapeView === 'chart' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    {((boxing.boxingTapeHours ?? 0) + (boxing.kickboxingTapeHours ?? 0) + (boxing.mmaTapeHours ?? 0)) > 0 ? (
                      <div className="relative" style={{ height: 240, width: 260 }}>
                        <PieChart
                          series={[{
                            data: [
                              { id: 0, value: boxing.boxingTapeHours ?? 0, label: 'Boxing Tape', color: '#f59e0b' },
                              { id: 1, value: boxing.kickboxingTapeHours ?? 0, label: 'Kickboxing Tape', color: '#3b82f6' },
                              { id: 2, value: boxing.mmaTapeHours ?? 0, label: 'MMA Tape', color: '#10b981' },
                            ],
                            innerRadius: 70,
                            paddingAngle: 2,
                          }]}
                          height={240}
                          slotProps={{ legend: { hidden: true } as any }}
                          sx={{
                            '.MuiChartsLegend-root': { display: 'none' },
                            '.MuiChartsTooltip-root': { display: 'none' },
                            '.MuiPieArcLabel-root': { display: 'none' },
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-xl font-bold text-gray-900">
                            {Math.floor((boxing.boxingTapeHours ?? 0) + (boxing.kickboxingTapeHours ?? 0) + (boxing.mmaTapeHours ?? 0))}h
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
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                        <span className="text-sm text-gray-600">Boxing Tape</span>
                      </div>
                      <div className="font-semibold">{Math.floor(boxing.boxingTapeHours ?? 0)}h</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                        <span className="text-sm text-gray-600">Kickboxing Tape</span>
                      </div>
                      <div className="font-semibold">{Math.floor(boxing.kickboxingTapeHours ?? 0)}h</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                        <span className="text-sm text-gray-600">MMA Tape</span>
                      </div>
                      <div className="font-semibold">{Math.floor(boxing.mmaTapeHours ?? 0)}h</div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Tape</span>
                        <span className="font-semibold">{Math.floor((boxing.boxingTapeHours ?? 0) + (boxing.kickboxingTapeHours ?? 0) + (boxing.mmaTapeHours ?? 0))}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {(boxing.boxingTapeTrend ?? []).length > 0 ? (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-2 pr-4">Date</th>
                          <th className="py-2 pr-4">Boxing (h)</th>
                          <th className="py-2 pr-4">Kickboxing (h)</th>
                          <th className="py-2 pr-4">MMA (h)</th>
                          <th className="py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(boxing.boxingTapeTrend ?? []).map((r, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2 pr-4">{r.date}</td>
                            <td className="py-2 pr-4">{r.boxing ?? 0}</td>
                            <td className="py-2 pr-4">{r.kickboxing ?? 0}</td>
                            <td className="py-2 pr-4">{r.mma ?? 0}</td>
                            <td className="py-2 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditTapeIdx(i);
                                  setEditBoxing(String(r.boxing ?? ''));
                                  setEditKick(String(r.kickboxing ?? ''));
                                  setEditMma(String(r.mma ?? ''));
                                  setEditDate(r.date || '');
                                }}
                              >
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteBoxingTapeAt(i)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-sm text-gray-500">No entries yet.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Levels variant="boxing" currentLevel={boxingLevel} />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <DailyGoalGauge
              currentHours={boxing.totalHours}
              dailyGoalMinutes={boxing.dailyGoalMinutes || 30}
              todayMinutes={boxing.todayDate === new Date().toDateString() ? (boxing.todayMinutes || 0) : 0}
              onUpdateDailyGoal={(minutes) => setDailyGoal('boxing', minutes)}
              onUpdateTodayMinutes={(minutes) => addTodayMinutes('boxing', minutes - (boxing.todayDate === new Date().toDateString() ? (boxing.todayMinutes || 0) : 0))}
              variant="boxing"
            />
          </div>
        </div>
      </div>

    {/* Edit tape dialog */}
      <Dialog open={editTapeIdx !== null} onOpenChange={(o) => { if (!o) setEditTapeIdx(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tape Entry</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Boxing (h)</label>
              <Input type="number" step="0.1" value={editBoxing} onChange={(e) => setEditBoxing(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kickboxing (h)</label>
              <Input type="number" step="0.1" value={editKick} onChange={(e) => setEditKick(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">MMA (h)</label>
              <Input type="number" step="0.1" value={editMma} onChange={(e) => setEditMma(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date label</label>
              <Input value={editDate} onChange={(e) => setEditDate(e.target.value)} placeholder="e.g., 9/12" />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (editTapeIdx === null) return;
                const b = parseFloat(editBoxing);
                const k = parseFloat(editKick);
                const m = parseFloat(editMma);
                updateBoxingTapeAt(
                  editTapeIdx,
                  Number.isFinite(b) ? b : undefined,
                  Number.isFinite(k) ? k : undefined,
                  Number.isFinite(m) ? m : undefined,
                  editDate.trim() || undefined
                );
                setEditTapeIdx(null);
                setEditBoxing('');
                setEditKick('');
                setEditMma('');
                setEditDate('');
              }}
            >
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditTapeIdx(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit fitness score dialog */}
      <Dialog open={editFitnessIdx !== null} onOpenChange={(o) => { if (!o) setEditFitnessIdx(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Fitness Score</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Score</label>
              <Input type="number" step="1" value={editFitnessScore} onChange={(e) => setEditFitnessScore(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Month label</label>
              <Input value={editFitnessDate} onChange={(e) => setEditFitnessDate(e.target.value)} placeholder="e.g., Sep" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (editFitnessIdx === null) return; const s = parseFloat(editFitnessScore); updateFitnessScoreAt(editFitnessIdx, Number.isFinite(s) ? s : undefined, editFitnessDate.trim() || undefined); setEditFitnessIdx(null); setEditFitnessScore(''); setEditFitnessDate(''); }}>Save</Button>
            <Button variant="outline" onClick={() => setEditFitnessIdx(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit total hours dialog */}
      <Dialog open={editTotalOpen} onOpenChange={setEditTotalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Total Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Total Hours</label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 96.5"
                value={manualTotal}
                onChange={(e) => setManualTotal(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              const hours = parseFloat(manualTotal);
              if (Number.isFinite(hours) && hours >= 0) {
                setActivityTotalHours('boxing', hours);
                setEditTotalOpen(false);
                setManualTotal('');
              }
            }}>Save</Button>
            <Button variant="outline" onClick={() => setEditTotalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
