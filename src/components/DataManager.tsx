import { useActivityStore } from '@/lib/activityStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, Database, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function DataManager() {
  const [importMessage, setImportMessage] = useState('');

  const exportData = () => {
    try {
      const stored = localStorage.getItem('activity-storage');
      if (!stored) {
        alert('No data to export');
        return;
      }

      const data = JSON.parse(stored);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `asura-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting data: ' + error);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate the data structure
        if (!data.state || !data.version) {
          throw new Error('Invalid backup file format');
        }

        // Backup current data first
        const currentData = localStorage.getItem('activity-storage');
        if (currentData) {
          localStorage.setItem('activity-storage-backup-' + Date.now(), currentData);
        }

        // Import new data
        localStorage.setItem('activity-storage', JSON.stringify(data));
        setImportMessage('Data imported successfully! Please refresh the page.');
        
        // Auto refresh after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        alert('Error importing data: ' + error);
      }
    };
    reader.readAsText(file);
    
    // Clear the input
    event.target.value = '';
  };

  const getStorageInfo = () => {
    const stored = localStorage.getItem('activity-storage');
    if (!stored) return { size: '0 KB', activities: 0, customActivities: 0 };

    try {
      const data = JSON.parse(stored);
      const size = new Blob([stored]).size;
      const sizeKB = (size / 1024).toFixed(1);
      
      const activities = ['boxing', 'gym', 'oud', 'violin', 'spanish', 'german'].filter(
        activity => data.state && data.state[activity]
      ).length;
      
      const customActivities = Object.keys(data.state?.customActivities || {}).length;
      
      return {
        size: `${sizeKB} KB`,
        activities,
        customActivities,
        lastUpdated: data.state ? 'Recently' : 'Unknown'
      };
    } catch {
      return { size: 'Error', activities: 0, customActivities: 0 };
    }
  };

  const info = getStorageInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Storage Information</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>Storage size: {info.size}</div>
            <div>Core activities: {info.activities}/6</div>
            <div>Custom activities: {info.customActivities}</div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">Data is stored locally in your browser</p>
              <p>Make regular backups to prevent data loss from browser issues or device changes.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Backup
          </Button>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
              id="import-file"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('import-file')?.click()}
              className="flex items-center gap-2 w-full"
            >
              <Upload className="h-4 w-4" />
              Import Backup
            </Button>
          </div>
        </div>

        {importMessage && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm text-green-800">{importMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
