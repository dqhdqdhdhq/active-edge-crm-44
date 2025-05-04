
import { useState } from 'react';
import { ClassSchedule } from '@/components/classes/ClassSchedule';
import { ClassList } from '@/components/classes/ClassList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Filter, Calendar, List, User } from 'lucide-react';
import { gymClasses, trainers } from '@/data/mockData';
import { ClassFilters } from '@/components/classes/ClassFilters';
import { ClassStats } from '@/components/classes/ClassStats';
import { GymClass, ClassType, Room, Trainer } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type ViewType = 'calendar' | 'list' | 'trainer';

const Classes = () => {
  const [activeView, setActiveView] = useState<ViewType>('calendar');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
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

  const form = useForm({
    defaultValues: {
      name: "",
      type: "Yoga" as ClassType,
      trainer: "",
      room: "Studio A" as Room,
      date: "",
      startTime: "",
      endTime: "",
      capacity: "20",
      description: ""
    }
  });

  const handleViewClass = (gymClass: GymClass) => {
    setSelectedClass(gymClass);
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
              </DialogHeader>
              <form className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Class Name</Label>
                    <Input id="name" placeholder="HIIT Training" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Class Type</Label>
                    <select 
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="Yoga">Yoga</option>
                      <option value="Spin">Spin</option>
                      <option value="HIIT">HIIT</option>
                      <option value="Pilates">Pilates</option>
                      <option value="Zumba">Zumba</option>
                      <option value="Boxing">Boxing</option>
                      <option value="CrossFit">CrossFit</option>
                      <option value="Strength">Strength</option>
                      <option value="Cardio">Cardio</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainer">Trainer</Label>
                    <select 
                      id="trainer"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      {trainers.map(trainer => (
                        <option key={trainer.id} value={trainer.id}>
                          {trainer.firstName} {trainer.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <select 
                      id="room"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="Studio A">Studio A</option>
                      <option value="Studio B">Studio B</option>
                      <option value="Main Floor">Main Floor</option>
                      <option value="Spin Room">Spin Room</option>
                      <option value="Yoga Studio">Yoga Studio</option>
                      <option value="Pool">Pool</option>
                      <option value="Outdoor">Outdoor</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" min="1" placeholder="20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="A brief description of the class" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Class</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <ClassSchedule 
            classes={filteredClasses} 
            trainers={trainers.map(trainer => ({
              id: trainer.id,
              firstName: trainer.firstName,
              lastName: trainer.lastName
            }))}
            onViewClass={handleViewClass}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <ClassList 
            classes={filteredClasses} 
            trainers={trainers} 
            onViewClass={handleViewClass}
          />
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
                    onViewClass={handleViewClass}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Class Details Dialog */}
      <Dialog open={!!selectedClass} onOpenChange={(open) => !open && setSelectedClass(null)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{selectedClass?.name}</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Class Type</p>
                  <p>{selectedClass.type}</p>
                </div>
                <div>
                  <p className="font-medium">Room</p>
                  <p>{selectedClass.room}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Date</p>
                  <p>{new Date(selectedClass.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Time</p>
                  <p>{selectedClass.startTime} - {selectedClass.endTime}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium">Trainer</p>
                <p>{trainers.find(t => t.id === selectedClass.trainerId)?.firstName} {trainers.find(t => t.id === selectedClass.trainerId)?.lastName}</p>
              </div>
              
              <div>
                <p className="font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{selectedClass.description}</p>
              </div>
              
              <div>
                <p className="font-medium">Availability</p>
                <p>{selectedClass.attendees.length} / {selectedClass.capacity} spots filled</p>
                <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (selectedClass.attendees.length / selectedClass.capacity) >= 0.9 ? 'bg-destructive' : 
                      (selectedClass.attendees.length / selectedClass.capacity) >= 0.7 ? 'bg-orange-500' : 
                      'bg-primary'
                    }`}
                    style={{ width: `${(selectedClass.attendees.length / selectedClass.capacity) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full">Book This Class</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
