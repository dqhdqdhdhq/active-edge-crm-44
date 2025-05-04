
import { ClassSchedule } from '@/components/classes/ClassSchedule';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { gymClasses, trainers } from '@/data/mockData';

const Classes = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>
      
      <ClassSchedule 
        classes={gymClasses} 
        trainers={trainers.map(trainer => ({
          id: trainer.id,
          firstName: trainer.firstName,
          lastName: trainer.lastName
        }))}
      />
    </div>
  );
};

export default Classes;
