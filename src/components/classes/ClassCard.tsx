
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GymClass } from "@/lib/types";
import { Clock, Users, MapPin } from "lucide-react";

interface ClassCardProps {
  gymClass: GymClass;
  trainerName: string;
}

export const ClassCard = ({ gymClass, trainerName }: ClassCardProps) => {
  const { name, type, description, room, startTime, endTime, capacity, attendees } = gymClass;
  
  // Calculate attendance percentage
  const attendancePercentage = (attendees.length / capacity) * 100;
  
  // Determine badge color based on class type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Yoga':
      case 'Pilates':
        return 'secondary';
      case 'HIIT':
      case 'CrossFit':
        return 'destructive';
      case 'Spin':
      case 'Zumba':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base">{name}</h3>
              <Badge variant={getBadgeVariant(type)}>{type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium">{startTime}</div>
            <div className="text-xs text-muted-foreground">-</div>
            <div className="text-lg font-medium">{endTime}</div>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{attendees.length}/{capacity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{trainerName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{room}</span>
          </div>
        </div>
        
        <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              attendancePercentage >= 90 ? 'bg-destructive' : 
              attendancePercentage >= 70 ? 'bg-orange-500' : 
              'bg-primary'
            }`}
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
        
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm">View Details</Button>
          <Button size="sm">Book Class</Button>
        </div>
      </CardContent>
    </Card>
  );
};
