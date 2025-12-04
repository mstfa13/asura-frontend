import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  TrendingUp,
  Dumbbell,
  Zap,
  Settings,
  Menu,
  X,
  Music2,
  Languages,
  Moon,
  Sun,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivityStore } from '@/lib/activityStore';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TemplateSelection, TemplateType } from '@/components/TemplateSelection';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Progress', href: '/dashboard', icon: TrendingUp },
  { name: 'Daily Activities', href: '/daily-activities', icon: Home },
  { name: 'Boxing', href: '/boxing', icon: Zap, key: 'boxing' as const },
  { name: 'Gym', href: '/gym', icon: Dumbbell, key: 'gym' as const },
  { name: 'Oud', href: '/oud', icon: Music2, key: 'oud' as const },
  { name: 'Spanish', href: '/spanish', icon: Languages, key: 'spanish' as const },
  { name: 'German', href: '/german', icon: Languages, key: 'german' as const },
  { name: 'Settings', href: '/settings', icon: Settings },
] as const;

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [showAdd, setShowAdd] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [template, setTemplate] = useState<TemplateType>('none');
  const customMap = useActivityStore((s) => s.customActivities);
  const custom = useMemo(() => Object.entries(customMap).map(([slug, v]) => ({ slug, ...v })), [customMap]);
  const addCustom = useActivityStore((s) => s.addCustomActivity);
  const deleteCustom = useActivityStore((s) => s.deleteCustomActivity);
  const hidden = useActivityStore((s) => s.hiddenActivities);
  const hideCore = useActivityStore((s) => s.hideActivity);
  const restoreCore = useActivityStore((s) => s.restoreActivity);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} className="dark:text-white" /> : <Menu size={20} className="dark:text-white" />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <img
                src="/Asura-png.png"
                alt="App logo"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LifeTracker
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* All activities (core + custom) unified */}
            {navigation
              .filter(item => item.name !== 'Settings' && (!('key' in item) || !hidden[(item as any).key]))
              .map((item) => {
                const href = item.href;
                const isActive = location.pathname === href;
                const Icon = item.icon;
                
                return (
                  <div key={item.name} className="flex items-center justify-between group">
                    <Link
                      to={href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                    {'key' in item && (
                      <button
                        className="ml-2 p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                        title="Delete"
                        onClick={() => {
                          const key = (item as any).key as 'boxing'|'gym'|'oud'|'spanish'|'german';
                          if (!confirm(`Hide activity "${item.name}"? You can restore it later from Add Activity.`)) return;
                          hideCore(key);
                          if (isActive) window.location.href = '/';
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}

            {/* Custom activities mixed with main ones */}
            {custom.map((c) => {
              const href = `/activity/${c.slug}`;
              const isActive = location.pathname === href;
              return (
                <div key={c.slug} className="flex items-center justify-between group">
                  <Link
                    to={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Languages className="w-5 h-5 mr-3" />
                    {c.name}
                  </Link>
                  <button
                    className="ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-500"
                    title="Delete"
                    onClick={() => {
                      if (!confirm(`Delete activity "${c.name}"?`)) return;
                      deleteCustom(c.slug);
                      if (isActive) {
                        window.location.href = '/';
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* Add Activity */}
            <Dialog open={showAdd} onOpenChange={(o) => { setShowAdd(o); if (!o) { setActivityName(''); setTemplate('none'); } }}>
              <DialogTrigger asChild>
                <Button className="w-full mt-2" variant="outline">+ Add Activity</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <div>
                  <label className="text-sm font-medium text-gray-700">Activity name</label>
                  <Input className="mt-1" value={activityName} onChange={(e) => setActivityName(e.target.value)} placeholder="e.g., Reading" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Template</div>
                  <TemplateSelection value={template} onChange={setTemplate} />
                </div>
                {/* Restore hidden core activities */}
                {Object.entries(hidden).filter(([, v]) => v).length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Restore core activities</div>
                    <div className="space-y-2">
                      {navigation.filter((n) => 'key' in n && hidden[(n as any).key]).map((n) => {
                        const Icon = (n as any).icon;
                        const key = (n as any).key as 'boxing'|'gym'|'oud'|'spanish'|'german';
                        return (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <div className="text-gray-700 flex items-center">
                              <Icon className="w-4 h-4 mr-2" />{n.name}
                            </div>
                            <Button size="sm" variant="outline" onClick={() => restoreCore(key)}>Restore</Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    onClick={() => {
                      const raw = activityName.trim();
                      if (!raw) return;
                      const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      addCustom(slug, raw, template);
                      setActivityName('');
                      setTemplate('none');
                      setShowAdd(false);
                      setIsOpen(false);
                      // Navigate via anchor, since sidebar may be outside router hooks
                      window.location.href = `/activity/${slug}`;
                    }}
                  >Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Settings at the bottom */}
            {(() => {
              const settingsItem = navigation.find(item => item.name === 'Settings')!;
              const href = settingsItem.href;
              const isActive = location.pathname === href;
              const Icon = settingsItem.icon;
              
              return (
                <div className="mt-4 pt-4 border-t dark:border-gray-800">
                  <Link
                    to={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {settingsItem.name}
                  </Link>
                </div>
              );
            })()}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-800">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
            
            {/* User Profile & Logout */}
            {user && (
              <div className="border-t dark:border-gray-800 pt-3 mt-3">
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="font-medium truncate">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-600 text-center mt-2">
              Track your life, achieve your goals
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
