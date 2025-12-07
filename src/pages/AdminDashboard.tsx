import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Database, BarChart3, LogOut, Eye, RefreshCw, Shield } from 'lucide-react';

interface User {
  id: number;
  username: string;
  created_at: string;
}

interface UserData {
  [key: string]: {
    value: any;
    updated_at: string;
  };
}

interface Stats {
  users: number;
  dataEntries: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check if already authenticated
  useEffect(() => {
    const savedKey = sessionStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadUsers();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'x-admin-key': adminKey }
      });
      
      if (response.ok) {
        sessionStorage.setItem('adminKey', adminKey);
        setIsAuthenticated(true);
      } else {
        setError('Invalid admin key');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    setIsAuthenticated(false);
    setAdminKey('');
    setUsers([]);
    setStats(null);
    setSelectedUser(null);
    setUserData(null);
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'x-admin-key': adminKey }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'x-admin-key': adminKey }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadUserData = async (user: User) => {
    setSelectedUser(user);
    setUserData(null);
    
    try {
      const response = await fetch(`${API_URL}/admin/users/${user.id}/data`, {
        headers: { 'x-admin-key': adminKey }
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const refreshAll = () => {
    loadStats();
    loadUsers();
    if (selectedUser) {
      loadUserData(selectedUser);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Dashboard</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your admin secret key to access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin Secret Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-slate-700 border-slate-600 text-white"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <Button 
              onClick={handleLogin} 
              disabled={isLoading || !adminKey}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Asura Admin</h1>
              <p className="text-slate-400 text-sm">Manage users and data</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshAll} className="border-slate-600 text-slate-300">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-600 text-red-400 hover:bg-red-600/20">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats?.users ?? '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Data Entries</p>
                  <p className="text-3xl font-bold text-white">{stats?.dataEntries ?? '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Avg Data/User</p>
                  <p className="text-3xl font-bold text-white">
                    {stats && stats.users > 0 ? (stats.dataEntries / stats.users).toFixed(1) : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" /> Users
              </CardTitle>
              <CardDescription className="text-slate-400">
                {users.length} registered users
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => loadUserData(user)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id 
                        ? 'bg-purple-600/30 border border-purple-500' 
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{user.username}</p>
                        <p className="text-xs text-slate-400">
                          ID: {user.id} • Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-slate-400 text-center py-8">No users yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Data Viewer */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" /> 
                {selectedUser ? `${selectedUser.username}'s Data` : 'User Data'}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {selectedUser 
                  ? `Viewing data for user ID ${selectedUser.id}` 
                  : 'Select a user to view their data'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedUser ? (
                <div className="text-center py-12 text-slate-400">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a user from the list to view their data</p>
                </div>
              ) : !userData ? (
                <div className="text-center py-12 text-slate-400">
                  <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                  <p>Loading user data...</p>
                </div>
              ) : Object.keys(userData).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>This user has no saved data yet</p>
                </div>
              ) : (
                <Tabs defaultValue={Object.keys(userData)[0]} className="w-full">
                  <TabsList className="bg-slate-700 flex-wrap h-auto gap-1 mb-4">
                    {Object.keys(userData).map((key) => (
                      <TabsTrigger 
                        key={key} 
                        value={key}
                        className="data-[state=active]:bg-purple-600"
                      >
                        {key}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(userData).map(([key, data]) => (
                    <TabsContent key={key} value={key}>
                      <div className="bg-slate-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-purple-400 border-purple-400">
                            {key}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            Updated: {new Date(data.updated_at).toLocaleString()}
                          </span>
                        </div>
                        <pre className="text-sm text-slate-300 overflow-x-auto max-h-[400px] overflow-y-auto">
                          {JSON.stringify(data.value, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
