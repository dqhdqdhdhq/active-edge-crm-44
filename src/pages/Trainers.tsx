
import { useEffect } from "react";
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
import { Calendar, Mail, Phone, UserPlus } from "lucide-react";
import { trainers } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Trainers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Trainers</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Trainer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <Card key={trainer.id}>
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
                    <p className="text-sm text-muted-foreground">{trainer.bio}</p>
                    
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
                    
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-1">
                        {trainer.certifications.map((cert, i) => (
                          <Badge key={i} variant="outline" className="font-normal">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="schedule">
                  <div className="space-y-3 mt-3">
                    <h4 className="text-sm font-medium">Availability</h4>
                    <div className="space-y-2">
                      {trainer.availability.map((slot, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{slot.day}: {slot.startTime} - {slot.endTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Assign Class</Button>
                <Button variant="outline" size="sm" className="flex-1">View Schedule</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Trainers;
