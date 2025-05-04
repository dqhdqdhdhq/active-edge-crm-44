
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GymClass } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { ClassCard } from './ClassCard';

interface ClassScheduleProps {
  classes: GymClass[];
  trainers: { id: string; firstName: string; lastName: string; }[];
  onViewClass?: (gymClass: GymClass) => void;
}

export const ClassSchedule = ({ classes, trainers, onViewClass }: ClassScheduleProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('week'); // Added view state
  
  // Calculate the start of the current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  
  // Generate an array of 7 days starting from the week start
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      month: format(date, 'MMM')
    };
  });
  
  // Filter classes for the selected date
  const classesForSelectedDate = classes.filter(cls => {
    const classDate = new Date(cls.date);
    return isSameDay(classDate, selectedDate);
  }).sort((a, b) => {
    // Sort by start time
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Helper to get trainer name
  const getTrainerName = (trainerId: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown';
  };
  
  // Navigation functions
  const previousWeek = () => {
    const newDate = subWeeks(currentDate, 1);
    setCurrentDate(newDate);
  };
  
  const nextWeek = () => {
    const newDate = addWeeks(currentDate, 1);
    setCurrentDate(newDate);
  };
  
  const today = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Helper to determine class type color
  const getClassTypeColor = (type: string) => {
    switch(type) {
      case 'Yoga':
      case 'Pilates':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'Spin':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'HIIT':
      case 'CrossFit':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'Zumba':
        return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'Boxing':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'Strength':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Class Schedule</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={today}>
                Today
              </Button>
              <Button size="sm" variant="outline" onClick={previousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-2">
                <span className="text-sm font-medium">
                  {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {weekDays.map(({ date, dayName, dayNumber, month }) => (
              <Button
                key={dayNumber}
                variant={isSameDay(date, selectedDate) ? "default" : "outline"}
                className={cn(
                  "flex flex-col items-center px-3 h-auto py-2 min-w-[70px]",
                  isSameDay(date, new Date()) && !isSameDay(date, selectedDate) && "border-primary"
                )}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xs font-normal">{dayName}</span>
                <span className={cn(
                  "text-lg",
                  isSameDay(date, selectedDate) ? "text-primary-foreground" : ""
                )}>
                  {dayNumber}
                </span>
                <span className="text-xs font-light">{month}</span>
              </Button>
            ))}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Yoga/Pilates
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Spin
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  HIIT/CrossFit
                </span>
              </div>
            </div>
            
            {classesForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {classesForSelectedDate.map(cls => (
                  <ClassCard 
                    key={cls.id} 
                    gymClass={cls} 
                    trainerName={getTrainerName(cls.trainerId)} 
                    onViewClass={onViewClass}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                No classes scheduled for this day
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
