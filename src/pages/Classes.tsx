
import { useState } from 'react';
import { ClassSchedule } from '@/components/classes/ClassSchedule';
import { ClassList } from '@/components/classes/ClassList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Filter, Calendar, List, User, MapPin } from 'lucide-react';
import { gymClasses, trainers } from '@/data/mockData';
import { ClassFilters } from '@/components/classes/ClassFilters';
import { ClassStats } from '@/components/classes/ClassStats';
import { GymClass, ClassType, Room, Trainer } from '@/lib/types';

type ViewType = 'calendar' | 'list' | 'trainer' | 'room';

const Classes = () => {
  const [activeView, setActiveView] = useState<ViewType>('calendar');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { from: new Date(), to: null as Date | null },
    timeOfDay: [] as string[],
    classType: [] as ClassType[],
    trainerId: [] as string[],
    room: [] as Room[],
    availability: [] as string[]
  });
  
  // Filter classes based on current filters
  const filteredClasses = gymClasses.filter((cls) => {
    // Date range filter
    if (filters.dateRange.from) {
      const classDate = new Date(cls.date);
      if (classDate < filters.dateRange.from) return false;
    }
    if (filters.dateRange.to) {
      const classDate = new Date(cls.date);
      if (classDate > filters.dateRange.to) return false;
    }
    
    // Class type filter
    if (filters.classType.length > 0 && !filters.classType.includes(cls.type)) {
      return false;
    }
    
    // Trainer filter
    if (filters.trainerId.length > 0 && !filters.trainerId.includes(cls.trainerId)) {
      return false;
    }
    
    // Room filter
    if (filters.room.length > 0 && !filters.room.includes(cls.room)) {
      return false;
    }
    
    // Availability filter (simplified)
    if (filters.availability.length > 0) {
      const isFull = cls.attendees.length >= cls.capacity;
      if (
        (filters.availability.includes('available') && isFull) ||
        (filters.availability.includes('full') && !isFull)
      ) {
        return false;
      }
    }
    
    return true;
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary" : ""}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <ClassStats classes={filteredClasses} />
      
      {/* Filters */}
      {showFilters && (
        <ClassFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          trainers={trainers}
        />
      )}
      
      {/* View Switcher */}
      <Tabs defaultValue="calendar" value={activeView} onValueChange={(value) => setActiveView(value as ViewType)}>
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="trainer">
            <User className="mr-2 h-4 w-4" />
            Trainer
          </TabsTrigger>
          <TabsTrigger value="room">
            <MapPin className="mr-2 h-4 w-4" />
            Room
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <ClassSchedule 
            classes={filteredClasses} 
            trainers={trainers.map(trainer => ({
              id: trainer.id,
              firstName: trainer.firstName,
              lastName: trainer.lastName
            }))}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <ClassList classes={filteredClasses} trainers={trainers} />
        </TabsContent>
        
        <TabsContent value="trainer" className="mt-4">
          {activeView === "trainer" && (
            <div className="space-y-6">
              {trainers.map(trainer => (
                <div key={trainer.id} className="space-y-2">
                  <h3 className="text-lg font-medium">{trainer.firstName} {trainer.lastName}</h3>
                  <ClassList 
                    classes={filteredClasses.filter(cls => cls.trainerId === trainer.id)} 
                    trainers={[trainer]}
                    compact
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="room" className="mt-4">
          {activeView === "room" && (
            <div className="space-y-6">
              {Array.from(new Set(filteredClasses.map(cls => cls.room))).map(room => (
                <div key={room} className="space-y-2">
                  <h3 className="text-lg font-medium">{room}</h3>
                  <ClassList 
                    classes={filteredClasses.filter(cls => cls.room === room)} 
                    trainers={trainers}
                    compact
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Classes;
