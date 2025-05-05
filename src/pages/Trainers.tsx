
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Mail, 
  Phone, 
  UserPlus, 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon,
  BarChart,
  FileText,
  Users
} from "lucide-react";
import { trainers } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { TrainerProfileDialog } from "@/components/trainers/TrainerProfileDialog";
import { TrainerFormDialog } from "@/components/trainers/TrainerFormDialog";
import { TrainerList } from "@/components/trainers/TrainerList";
import { Trainer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { TrainerPerformanceMetrics } from "@/components/trainers/TrainerPerformanceMetrics";

// Simple function to generate a pseudo-random ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const Trainers = () => {
  const [trainersList, setTrainersList] = useState(trainers);
  const [filteredTrainers, setFilteredTrainers] = useState(trainers);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [addTrainerDialogOpen, setAddTrainerDialogOpen] = useState(false);
  const [editTrainerDialogOpen, setEditTrainerDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);
  
  const { toast } = useToast();

  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setProfileDialogOpen(true);
  };

  const handleEditTrainer = (trainer?: Trainer) => {
    if (trainer) {
      // Direct edit from list view
      setSelectedTrainer(trainer);
      setEditTrainerDialogOpen(true);
    } else if (selectedTrainer) {
      // Edit from profile dialog
      setProfileDialogOpen(false);
      setEditTrainerDialogOpen(true);
    }
  };

  const handleSaveTrainer = (updatedTrainer: Partial<Trainer>) => {
    if (updatedTrainer.id) {
      // Edit existing trainer
      const updatedTrainers = trainersList.map(trainer => 
        trainer.id === updatedTrainer.id ? { ...trainer, ...updatedTrainer } : trainer
      );
      
      setTrainersList(updatedTrainers);
      setFilteredTrainers(
        filteredTrainers.map(trainer => 
          trainer.id === updatedTrainer.id ? { ...trainer, ...updatedTrainer } : trainer
        )
      );
      
      toast({
        title: "Trainer Updated",
        description: "Trainer profile has been updated successfully",
      });
      setEditTrainerDialogOpen(false);
    } else {
      // Add new trainer
      const newTrainer = {
        id: generateId(),
        assignedClasses: [],
        assignedMembers: [],
        ...updatedTrainer,
      } as Trainer;
      
      setTrainersList([...trainersList, newTrainer]);
      setFilteredTrainers([...filteredTrainers, newTrainer]);
      
      toast({
        title: "Trainer Added",
        description: "New trainer has been added successfully",
      });
      setAddTrainerDialogOpen(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterTrainers(query, statusFilter);
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    filterTrainers(searchQuery, status);
  };

  const filterTrainers = (query: string, status: "all" | "active" | "inactive") => {
    let filtered = [...trainersList];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(trainer => {
        const fullName = `${trainer.firstName} ${trainer.lastName}`.toLowerCase();
        const specialtiesMatch = trainer.specialties.some(s => 
          s.toLowerCase().includes(query)
        );
        const certificationsMatch = trainer.certifications.some(c => 
          c.toLowerCase().includes(query)
        );
        
        return fullName.includes(query) || 
               specialtiesMatch || 
               certificationsMatch || 
               trainer.email.toLowerCase().includes(query) || 
               trainer.phone.includes(query);
      });
    }
    
    // Apply status filter
    if (status !== "all") {
      // Note: We'd need to add a status field to the Trainer type
      // This is a placeholder implementation
      filtered = filtered.filter(trainer => {
        if (status === "active") {
          return trainer.assignedClasses.length > 0; // Simple proxy for active status
        } else {
          return trainer.assignedClasses.length === 0; // Simple proxy for inactive status
        }
      });
    }
    
    setFilteredTrainers(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Trainers</h1>
        <div className="flex gap-2">
          {selectedTrainer && (
            <Button 
              variant="outline" 
              onClick={() => setShowPerformanceMetrics(true)}
            >
              <BarChart className="mr-2 h-4 w-4" />
              View Performance
            </Button>
          )}
          <Button onClick={() => setAddTrainerDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Trainer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trainers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e);
              }}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
                All Trainers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("active")}>
                Active Trainers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("inactive")}>
                Inactive Trainers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-none ${viewMode === 'grid' ? 'bg-secondary' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-none ${viewMode === 'list' ? 'bg-secondary' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <Card key={trainer.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewTrainer(trainer)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={trainer.profileImage} alt={trainer.firstName} />
                      <AvatarFallback>{trainer.firstName[0]}{trainer.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{trainer.firstName} {trainer.lastName}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-1 mt-1">
                        {trainer.specialties.map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="font-normal">
                            {specialty}
                          </Badge>
                        ))}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="mt-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                    <TabsTrigger value="schedule" className="flex-1">Schedule</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info">
                    <div className="space-y-3 mt-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{trainer.bio}</p>
                      
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{trainer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{trainer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="schedule">
                    <div className="space-y-3 mt-3">
                      <h4 className="text-sm font-medium">Availability</h4>
                      <div className="space-y-2">
                        {trainer.availability.slice(0, 3).map((slot, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{slot.day}: {slot.startTime} - {slot.endTime}</span>
                          </div>
                        ))}
                        {trainer.availability.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{trainer.availability.length - 3} more days
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <TrainerList 
          trainers={filteredTrainers} 
          onViewTrainer={handleViewTrainer}
          onEditTrainer={handleEditTrainer}
        />
      )}
      
      <TrainerProfileDialog 
        trainer={selectedTrainer} 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen}
        onEditClick={handleEditTrainer}
      />
      
      <TrainerFormDialog 
        open={editTrainerDialogOpen} 
        onOpenChange={setEditTrainerDialogOpen}
        onSave={handleSaveTrainer}
        trainer={selectedTrainer || undefined}
      />
      
      <TrainerFormDialog 
        open={addTrainerDialogOpen} 
        onOpenChange={setAddTrainerDialogOpen}
        onSave={handleSaveTrainer}
      />
      
      <TrainerPerformanceMetrics
        trainer={selectedTrainer}
        open={showPerformanceMetrics}
        onOpenChange={setShowPerformanceMetrics}
      />
    </div>
  );
};

export default Trainers;
