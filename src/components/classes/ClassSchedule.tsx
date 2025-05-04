
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GymClass } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { ClassCard } from './ClassCard';

interface ClassScheduleProps {
  classes: GymClass[];
  trainers: { id: string; firstName: string; lastName: string; }[];
}

export const ClassSchedule = ({ classes, trainers }: ClassScheduleProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Calculate the start of the current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  
  // Generate an array of 7 days starting from the week start
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd')
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
  
  // Navigate to previous week
  const previousWeek = () => {
    const newDate = addDays(currentDate, -7);
    setCurrentDate(newDate);
  };
  
  // Navigate to next week
  const nextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Class Schedule</CardTitle>
            <div className="flex items-center gap-1">
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
            {weekDays.map(({ date, dayName, dayNumber }) => (
              <Button
                key={dayNumber}
                variant={isSameDay(date, selectedDate) ? "default" : "outline"}
                className={cn(
                  "flex flex-col items-center px-3 h-auto py-2 min-w-[60px]",
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
              </Button>
            ))}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {classesForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {classesForSelectedDate.map(cls => (
                  <ClassCard 
                    key={cls.id} 
                    gymClass={cls} 
                    trainerName={getTrainerName(cls.trainerId)} 
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
