
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Member } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Mock type for scheduled classes
interface ScheduledClass {
  id: string;
  className: string;
  time: string;
  room: string;
}

interface ClassScheduleProps {
  member: Member;
}

export const ClassSchedule = ({ member }: ClassScheduleProps) => {
  const { toast } = useToast();

  // Mock data for scheduled classes
  const todaysClasses: ScheduledClass[] = [
    {
      id: 'class1',
      className: 'Yoga Flow',
      time: '10:00 AM',
      room: 'Studio A'
    }
  ];

  const handleClassCheckIn = (classItem: ScheduledClass) => {
    // In a real implementation, this would mark attendance for the class
    toast({
      title: "Class check-in",
      description: `${member.firstName} has been checked in for ${classItem.className}`,
    });
  };

  if (todaysClasses.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 border rounded-md bg-muted/30">
      <h4 className="font-medium flex items-center mb-2">
        <Calendar className="h-4 w-4 mr-2" />
        Today's Schedule
      </h4>
      
      <div className="space-y-2">
        {todaysClasses.map((classItem) => (
          <div 
            key={classItem.id}
            className="flex items-center justify-between rounded-md p-2 bg-background"
          >
            <div>
              <p className="font-medium">{classItem.className}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {classItem.time} • {classItem.room}
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleClassCheckIn(classItem)}
            >
              Check In for Class
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
