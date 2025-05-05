
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users } from 'lucide-react';
import { GymClass } from '@/lib/types';
import { format } from 'date-fns';

interface MyScheduleProps {
  classes: GymClass[];
  userRole: 'admin' | 'front-desk' | 'trainer';
}

export function MySchedule({ classes, userRole }: MyScheduleProps) {
  // For demo, filter to today's classes
  // In a real app, would filter to the logged-in user's classes only
  const todayClasses = classes
    .filter(c => {
      // Filter classes for today
      const classDate = new Date(c.date);
      const today = new Date();
      return (
        classDate.getDate() === today.getDate() &&
        classDate.getMonth() === today.getMonth() &&
        classDate.getFullYear() === today.getFullYear()
      );
    })
    .slice(0, 4);

  const title = userRole === 'trainer' ? 'My Classes Today' : 'Today\'s Schedule';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {todayClasses.length > 0 ? (
          <div className="space-y-4">
            {todayClasses.map((cls) => (
              <div key={cls.id} className="flex items-start space-x-3 border-b pb-3 last:border-0 last:pb-0">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{cls.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {cls.startTime} - {cls.endTime} • {cls.room}
                    </p>
                    <p className="text-xs flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>
                        {cls.attendees.length}/{cls.capacity}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No classes scheduled for today
          </div>
        )}
        
        <div className="mt-4">
          <a href="/classes" className="text-sm text-primary hover:underline">
            View full schedule
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
