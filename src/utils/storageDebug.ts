// Utility to inspect localStorage data for debugging
// You can run this in the browser console to see what's stored

export function inspectActivityStorage() {
  const stored = localStorage.getItem('activity-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log('Activity Storage Data:', parsed);
      console.log('Storage Size:', new Blob([stored]).size, 'bytes');
      
      // Show summary of activities
      if (parsed.state) {
        const activities = ['boxing', 'gym', 'oud', 'violin', 'spanish', 'german'];
        console.log('\n=== Core Activities Summary ===');
        activities.forEach(activity => {
          if (parsed.state[activity]) {
            console.log(`${activity}:`, {
              totalHours: parsed.state[activity].totalHours,
              dailyGoalMinutes: parsed.state[activity].dailyGoalMinutes,
              todayMinutes: parsed.state[activity].todayMinutes,
              todayDate: parsed.state[activity].todayDate
            });
          }
        });
        
        console.log('\n=== Custom Activities Summary ===');
        Object.entries(parsed.state.customActivities || {}).forEach(([slug, entry]: [string, any]) => {
          console.log(`${slug} (${entry.name}):`, {
            template: entry.template,
            totalHours: entry.data?.totalHours,
            dailyGoalMinutes: entry.data?.dailyGoalMinutes,
            todayMinutes: entry.data?.todayMinutes,
            todayDate: entry.data?.todayDate
          });
        });
      }
      
      return parsed;
    } catch (error) {
      console.error('Error parsing activity storage:', error);
      return null;
    }
  } else {
    console.log('No activity storage found');
    return null;
  }
}

export function clearActivityStorage() {
  localStorage.removeItem('activity-storage');
  console.log('Activity storage cleared');
}

export function exportActivityData() {
  const data = inspectActivityStorage();
  if (data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Activity data exported');
  }
}

// Make these available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).inspectActivityStorage = inspectActivityStorage;
  (window as any).clearActivityStorage = clearActivityStorage;
  (window as any).exportActivityData = exportActivityData;
}
