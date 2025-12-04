import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { sampleActivities } from '@/lib/personalTracking';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasActivity: boolean;
  isRestDay: boolean;
  isToday: boolean;
  activities: string[];
}

export default function SimpleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 15)); // September 2025
  
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the first day of the week for the calendar grid
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const dateString = date.toISOString().split('T')[0];
      
      // Check if this date has activities
      const dayActivities = sampleActivities
        .filter(activity => activity.date === dateString && activity.completed)
        .map(activity => activity.name);
      
      const isRestDay = date.getDay() === 0; // Sunday as rest day
      const isToday = date.toDateString() === today.toDateString();
      
      days.push({
        date: date.getDate(),
        isCurrentMonth,
        hasActivity: dayActivities.length > 0,
        isRestDay: isRestDay && dayActivities.length === 0,
        isToday,
        activities: dayActivities
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                ${day.isToday ? 'ring-2 ring-blue-500 font-bold' : ''}
                ${day.hasActivity 
                  ? 'bg-green-100 text-green-800 font-medium hover:bg-green-200' 
                  : day.isRestDay 
                    ? 'bg-gray-100 text-gray-500'
                    : 'hover:bg-gray-50'
                }
              `}
              title={day.activities.length > 0 ? `Activities: ${day.activities.join(', ')}` : undefined}
            >
              {day.date}
              {day.hasActivity && (
                <div className="absolute w-1.5 h-1.5 bg-green-500 rounded-full mt-4"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded border border-green-200"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded border border-gray-200"></div>
            <span>Rest Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white rounded border border-gray-300"></div>
            <span>Missed</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          🌟 Consistency creates momentum!
        </p>
      </CardContent>
    </Card>
  );
}
