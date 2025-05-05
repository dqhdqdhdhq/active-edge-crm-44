
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GymClass } from '@/lib/types';
import { format, parseISO, addDays, isBefore, isToday } from 'date-fns';
import { Calendar, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/pages/Dashboard';

interface UpcomingScheduleProps {
  classes: GymClass[];
  userRole: UserRole;
}

export function UpcomingSchedule({ classes, userRole }: UpcomingScheduleProps) {
  // Filter classes based on role and time
  const getFilteredClasses = () => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    // Filter out past classes and limit to upcoming week
    const upcomingClasses = classes.filter(cls => {
      const classDate = parseISO(cls.date);
      return !isBefore(classDate, today) && isBefore(classDate, nextWeek);
    });
    
    // Sort by date and time
    upcomingClasses.sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    // For trainers, only show their classes
    if (userRole === 'trainer') {
      // In a real app, we'd filter by the logged-in trainer's ID
      // For demo, we'll just filter to the first trainer ID
      return upcomingClasses.filter(cls => cls.trainerId === 'trainer-1').slice(0, 5);
    }
    
    // For others, show all upcoming classes
    return upcomingClasses.slice(0, 5);
  };

  const scheduledClasses = getFilteredClasses();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {userRole === 'trainer' ? 'My Upcoming Classes' : 'Upcoming Classes'}
        </CardTitle>
        <CardDescription>
          {userRole === 'trainer' 
            ? 'Your scheduled sessions for the coming days' 
            : 'Classes scheduled for the next 7 days'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scheduledClasses.length > 0 ? (
          <div className="space-y-4">
            {scheduledClasses.map(cls => (
              <div key={cls.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                <div className="flex flex-col items-center justify-center min-w-14 text-center">
                  <div className="text-sm font-semibold">
                    {format(parseISO(cls.date), 'EEE')}
                  </div>
                  <div className="text-2xl font-bold">
                    {format(parseISO(cls.date), 'd')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(cls.date), 'MMM')}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{cls.name}</h4>
                    {isToday(parseISO(cls.date)) && (
                      <Badge variant="secondary">Today</Badge>
                    )}
                  </div>
                  
                  <div className="mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{cls.startTime} - {cls.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{cls.room}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{cls.attendees.length}/{cls.capacity} attendees</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No upcoming classes scheduled
          </div>
        )}
      </CardContent>
    </Card>
  );
}
