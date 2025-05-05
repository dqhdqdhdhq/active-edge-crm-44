
import { Trainer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Phone, Users, User, Clock, Briefcase, Award, Calendar as CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrainerProfileDialogProps {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick: () => void;
}

export function TrainerProfileDialog({ 
  trainer, 
  open, 
  onOpenChange, 
  onEditClick 
}: TrainerProfileDialogProps) {
  if (!trainer) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6 space-y-0">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={trainer.profileImage} />
                <AvatarFallback>{trainer.firstName[0]}{trainer.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">
                  {trainer.firstName} {trainer.lastName}
                </DialogTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {trainer.specialties.map((specialty, i) => (
                    <Badge key={i} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <Button variant="outline" size="sm" onClick={onEditClick}>
                Edit Profile
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="mt-2">
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="max-h-[60vh] mt-2">
            <TabsContent value="info" className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{trainer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{trainer.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Administrative</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Status: <Badge variant="outline">Active</Badge></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>Role: Trainer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Hire Date: 2023-05-15</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-1">
                      {trainer.certifications.map((cert, i) => (
                        <Badge key={i} variant="outline" className="font-normal">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Summary</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Classes</div>
                          <div className="text-xl font-bold">{trainer.assignedClasses.length}</div>
                        </div>
                        <div className="border rounded-md p-2">
                          <div className="text-xs text-muted-foreground">Clients</div>
                          <div className="text-xl font-bold">{trainer.assignedMembers.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                <p className="text-sm">{trainer.bio}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="px-6 py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Regular Availability</h3>
                <div className="grid gap-2">
                  {trainer.availability.map((slot, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 border rounded-md">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{slot.day}:</span>
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-sm font-medium pt-4">Upcoming Schedule</h3>
                <div className="grid gap-2">
                  <div className="p-3 border rounded-md bg-muted/50">
                    <div className="font-medium">No upcoming sessions</div>
                    <div className="text-sm text-muted-foreground">No scheduled sessions found for this trainer</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="clients" className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Assigned Clients</h3>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" /> Assign Client
                  </Button>
                </div>
                
                {trainer.assignedMembers.length > 0 ? (
                  <div className="grid gap-2">
                    {/* This would be populated with actual client data */}
                    <div className="p-3 border rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-muted-foreground">Last Session: 2023-06-15</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border rounded-md bg-muted/50">
                    <div className="font-medium">No clients assigned</div>
                    <div className="text-sm text-muted-foreground">This trainer doesn't have any clients assigned yet</div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="classes" className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Assigned Classes</h3>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" /> Assign Class
                  </Button>
                </div>
                
                {trainer.assignedClasses.length > 0 ? (
                  <div className="grid gap-2">
                    {/* This would be populated with actual class data */}
                    <div className="p-3 border rounded-md flex items-center justify-between">
                      <div>
                        <div className="font-medium">Yoga Fundamentals</div>
                        <div className="text-sm text-muted-foreground">Monday, 10:00 AM - 11:00 AM</div>
                      </div>
                      <Badge>12 attendees</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border rounded-md bg-muted/50">
                    <div className="font-medium">No classes assigned</div>
                    <div className="text-sm text-muted-foreground">This trainer isn't teaching any classes yet</div>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center gap-x-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
