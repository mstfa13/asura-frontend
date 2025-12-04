import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityStore } from '@/lib/activityStore';
import { TrendingUp, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function Progress() {
  const { boxing, gym, oud, spanish, german, customActivities, setActivityTotalHours, setCustomActivityTotalHours, hiddenActivities } = useActivityStore();
  const [editTarget, setEditTarget] = React.useState<{ type: 'core' | 'custom'; key: string } | null>(null);
  const [manualTotal, setManualTotal] = React.useState('');
  const customs = React.useMemo(() => Object.entries(customActivities).map(([slug, v]) => ({ slug, ...v })), [customActivities]);

  // Level helpers (keep consistent with individual pages)
  const getBoxingLevel = (h: number) =>
    h >= 1500 ? 7 : h >= 1000 ? 7 : h >= 600 ? 6 : h >= 300 ? 5 : h >= 150 ? 4 : h >= 80 ? 3 : h >= 20 ? 2 : 1;
  const getLanguageLevel = (h: number) =>
    h >= 1000 ? 7 : h >= 600 ? 5 : h >= 300 ? 4 : h >= 150 ? 3 : h >= 50 ? 2 : 1;
  const getOudLevel = (h: number) =>
    h >= 1500 ? 7 : h >= 1000 ? 6 : h >= 600 ? 5 : h >= 300 ? 4 : h >= 150 ? 3 : h >= 60 ? 2 : 1;
  // Gym: derive level from power lifts + bodyweight (mirrors Gym page logic)
  const gymPower = gym?.powerLiftWeights ?? [0, 0, 0, 0];
  const squat = gymPower[0] ?? 0;
  const bench = gymPower[1] ?? 0;
  const hip = gymPower[3] ?? 0;
  const bodyweight = (() => {
    const trend = gym?.weightTrend ?? [];
    return trend.length ? (trend[trend.length - 1].weight ?? 87) : 87;
  })();
  const ratio = (x: number) => (bodyweight > 0 ? x / bodyweight : 0);
  const gymLevelFromLifts = (() => {
    if (bench >= 1.75 * bodyweight && ratio(squat) >= 2.25 && ratio(hip) >= 3.5) return 7;
    if (bench >= 1.5 * bodyweight && ratio(squat) >= 2.0 && ratio(hip) >= 3.0) return 6;
    if (bench >= 120 && ratio(squat) >= 1.75 && ratio(hip) >= 2.5) return 5;
    if (bench >= 100 && ratio(squat) >= 1.5 && ratio(hip) >= 2.0) return 4;
    if (bench >= 80 && ratio(squat) >= 1.25 && ratio(hip) >= 1.5) return 3;
    if (bench >= 60 && ratio(squat) >= 1.0 && ratio(hip) >= 1.0) return 2;
    return 1;
  })();
  // Use actual gym.totalHours for radar chart
  const gymRadarHours = Number.isFinite(gym?.totalHours) ? gym.totalHours : 0;

  const boxingLevel = getBoxingLevel(boxing.totalHours);
  const gymLevel = gymLevelFromLifts;
  const oudLevel = getOudLevel(oud.totalHours);
  const spanishLevel = getLanguageLevel(spanish.totalHours);
  const germanLevel = getLanguageLevel(german.totalHours);

  // Prepare MUI RadarChart data (defensive against undefined/NaN) - exclude hidden activities
  const toNum = (n: unknown) => {
    const x = Number(n);
    return Number.isFinite(x) ? x : 0;
  };
  
  // Build categories and hours arrays, filtering out hidden activities
  const coreActivities = [
    { name: 'Boxing', key: 'boxing', hours: toNum(boxing?.totalHours) },
    { name: 'Gym', key: 'gym', hours: toNum(gymRadarHours) },
    { name: 'Oud', key: 'oud', hours: toNum(oud?.totalHours) },
    { name: 'Spanish', key: 'spanish', hours: toNum(spanish?.totalHours) },
    { name: 'German', key: 'german', hours: toNum(german?.totalHours) },
  ].filter(activity => !hiddenActivities[activity.key]);
  
  const allActivities = [
    ...coreActivities,
    ...customs.map((c) => ({ name: c.name, hours: toNum(c.data.totalHours) })),
  ];
  
  const categories = allActivities.map(a => a.name);
  const hoursSeries = allActivities.map(a => a.hours);
  const hasAnyData = hoursSeries.some((v) => v > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Overview</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your activity progress across all areas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Activity Progress Radar
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Visual comparison of total hours across activities
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {hasAnyData ? (
                  <RadarChart
                    height={320}
                    series={[{ data: hoursSeries, label: 'Hours', color: '#3b82f6', fillArea: true }]}
                    radar={{ metrics: categories, max: Math.max(10, ...hoursSeries) }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-600">
                    No data yet. Add hours on activity pages to see your radar.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Unified activities list - core activities (excluding hidden) + custom activities */}
                {allActivities.map((activity, index) => {
                  // Find if this is a core activity
                  const coreActivity = coreActivities.find(c => c.name === activity.name);
                  const isCore = !!coreActivity;
                  
                  // Get styling based on activity type
                  const getActivityStyle = (name: string, isCore: boolean) => {
                    if (isCore) {
                      switch (name) {
                        case 'Boxing': return { bg: 'bg-red-50', text: 'text-red-900', boldText: 'text-red-700', badge: 'bg-red-100 text-red-800' };
                        case 'Gym': return { bg: 'bg-green-50', text: 'text-green-900', boldText: 'text-green-700', badge: 'bg-green-100 text-green-800' };
                        case 'Oud': return { bg: 'bg-purple-50', text: 'text-purple-900', boldText: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' };
                        case 'Spanish': return { bg: 'bg-yellow-50', text: 'text-yellow-900', boldText: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' };
                        case 'German': return { bg: 'bg-slate-50', text: 'text-slate-900', boldText: 'text-slate-700', badge: 'bg-slate-200 text-slate-800' };
                        default: return { bg: 'bg-indigo-50', text: 'text-indigo-900', boldText: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' };
                      }
                    }
                    return { bg: 'bg-indigo-50', text: 'text-indigo-900', boldText: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' };
                  };

                  const style = getActivityStyle(activity.name, isCore);
                  
                  // Calculate level based on activity type
                  let level = 1;
                  if (isCore) {
                    switch (activity.name) {
                      case 'Boxing': level = boxingLevel; break;
                      case 'Gym': level = gymLevel; break;
                      case 'Oud': level = oudLevel; break;
                      case 'Spanish': level = spanishLevel; break;
                      case 'German': level = germanLevel; break;
                    }
                  } else {
                    // Custom activity - find template and calculate level
                    const customActivity = customs.find(c => c.name === activity.name);
                    if (customActivity) {
                      const t = (customActivity as any).template as 'boxing' | 'gym' | 'music' | 'language' | 'none' | undefined;
                      level = 
                        t === 'boxing' ? getBoxingLevel(activity.hours) :
                        t === 'language' ? getLanguageLevel(activity.hours) :
                        t === 'music' ? getOudLevel(activity.hours) :
                        t === 'gym' ? getOudLevel(activity.hours) : 1;
                    }
                  }
                  
                  return (
                    <div key={`${isCore ? 'core' : 'custom'}-${activity.name}`} className={`flex justify-between items-center p-3 ${style.bg} rounded-lg`}>
                      <span className={`font-medium ${style.text}`}>{activity.name}</span>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          aria-label={`Edit ${activity.name} hours`} 
                          title="Edit total hours" 
                          onClick={() => {
                            if (isCore) {
                              const key = coreActivity!.key;
                              setEditTarget({ type: 'core', key });
                              setManualTotal(activity.hours.toString());
                            } else {
                              const customActivity = customs.find(c => c.name === activity.name);
                              if (customActivity) {
                                setEditTarget({ type: 'custom', key: customActivity.slug });
                                setManualTotal(activity.hours.toString());
                              }
                            }
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <span className={`text-xl font-bold ${style.boldText}`}>{activity.hours}h</span>
                        <span className={`inline-flex items-center rounded-full ${style.badge} px-2.5 py-0.5 text-xs font-medium`}>Level {level}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {allActivities.reduce((total, activity) => total + activity.hours, 0)}h
                  </div>
                  <p className="text-gray-600 mt-2">Total hours across all activities</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Most Active</span>
                      <span className="font-medium">
                        {allActivities.length > 0 
                          ? allActivities.reduce((a, b) => (b.hours > a.hours ? b : a)).name
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average per Activity</span>
                      <span className="font-medium">
                        {allActivities.length > 0 
                          ? Math.round(allActivities.reduce((total, activity) => total + activity.hours, 0) / allActivities.length)
                          : 0}h
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Edit total hours dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Total Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hours</label>
              <Input type="number" value={manualTotal} onChange={(e) => setManualTotal(e.target.value)} min={0} step="0.01" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
              <Button onClick={() => {
                const val = parseFloat(manualTotal);
                if (Number.isFinite(val) && val >= 0 && editTarget) {
                  if (editTarget.type === 'core') setActivityTotalHours(editTarget.key as any, val);
                  else setCustomActivityTotalHours(editTarget.key, val);
                  setEditTarget(null);
                }
              }}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
