
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, CheckCircle, Clock, Flame, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';

interface ActivityItem { id: string; name: string; category: string }
interface Activity extends ActivityItem { completed: boolean; streak: number; lastCompleted?: string }

const defaultCats = ['Learning','Learning','Music','Health','Health'] as const;

const categoryColors = {
  Learning: 'bg-indigo-100 text-indigo-800',
  Music: 'bg-purple-100 text-purple-800',
  Health: 'bg-red-100 text-red-800',
};

export default function DailyActivities() {
  const list = useActivityStore((s) => s.dailyActivityList);
  const addItem = useActivityStore((s) => s.addDailyActivity);
  const removeItem = useActivityStore((s) => s.removeDailyActivity);
  const renameItem = useActivityStore((s) => s.renameDailyActivity);
  const initialActivities: Activity[] = useMemo(() => (
    list.map((d) => ({ id: d.id, name: d.name, category: d.category, completed: false, streak: 0 }))
  ), [list]);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Learning');

  const handleToggleActivity = (id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id 
        ? { ...activity, completed: !activity.completed }
        : activity
    ));
  };

  const completedCount = activities.filter(a => a.completed).length;
  const totalCount = activities.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  const startEdit = (idx: number, current: string) => {
    setEditingIndex(idx);
    setTempName(current);
  };
  const commitEdit = () => {
    if (editingIndex === null) return;
    const id = activities[editingIndex].id;
    renameItem(id, tempName);
    setActivities((prev) => prev.map((a, i) => i === editingIndex ? { ...a, name: tempName.trim() || a.name } : a));
    setEditingIndex(null);
    setTempName('');
  };
  const handleAdd = () => {
    const nm = newName.trim();
    if (!nm) return;
    addItem(nm, newCategory);
    setNewName('');
  };
  const handleDelete = (id: string, idx: number) => {
    removeItem(id);
    setActivities((prev) => prev.filter((_, i) => i !== idx));
  };
  const cancelEdit = () => {
    setEditingIndex(null);
    setTempName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Activities</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your daily habits and routines</p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
              <div className="text-xs text-muted-foreground">
                {completionRate}% completion rate
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
              <Flame className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...activities.map(a => a.streak))}
              </div>
              <div className="text-xs text-muted-foreground">
                days longest streak
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Investment</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <div className="text-xs text-muted-foreground">
                estimated daily time
              </div>
            </CardContent>
          </Card>
        </div>

  {/* Add New Activity UI removed to keep fixed task list */}

        {/* Add Activity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Add Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Activity name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <select className="border rounded px-3 py-2 text-sm" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                <option>Learning</option>
                <option>Music</option>
                <option>Health</option>
                <option>General</option>
              </select>
              <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    activity.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={activity.completed}
                      onCheckedChange={() => handleToggleActivity(activity.id)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <div>
                      <div className="min-w-0">
                        {editingIndex === idx ? (
                          <Input
                            autoFocus
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            className={`h-8 text-sm ${activity.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                          />
                        ) : (
                          <h3
                            className={`font-medium truncate ${activity.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                            title="Double-click to rename"
                            onDoubleClick={() => startEdit(idx, activity.name)}
                          >
                            {activity.name}
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={categoryColors[activity.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}
                        >
                          {activity.category}
                        </Badge>
                        {activity.streak > 0 && (
                          <div className="flex items-center space-x-1 text-orange-600">
                            <Flame className="w-3 h-3" />
                            <span className="text-xs font-medium">{activity.streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {activity.completed && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <button
                      className="p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                      title="Delete"
                      onClick={() => handleDelete(activity.id, idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
