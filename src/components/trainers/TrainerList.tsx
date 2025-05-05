
import { Trainer } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";

interface TrainerListProps {
  trainers: Trainer[];
  onViewTrainer: (trainer: Trainer) => void;
  onEditTrainer?: (trainer: Trainer) => void;
}

export function TrainerList({ trainers, onViewTrainer, onEditTrainer }: TrainerListProps) {
  return (
    <div className="space-y-2 border rounded-md overflow-hidden">
      <div className="bg-muted px-4 py-2 grid grid-cols-12 gap-2 text-sm font-medium">
        <div className="col-span-4">Trainer</div>
        <div className="col-span-3">Specializations</div>
        <div className="col-span-2">Classes</div>
        <div className="col-span-2">Contact</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {trainers.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No trainers found matching your criteria
        </div>
      ) : (
        trainers.map((trainer) => (
          <div 
            key={trainer.id} 
            className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 items-center hover:bg-muted/40"
          >
            <div className="col-span-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={trainer.profileImage} alt={trainer.firstName} />
                <AvatarFallback>{trainer.firstName[0]}{trainer.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{trainer.firstName} {trainer.lastName}</div>
                <div className="text-sm text-muted-foreground">{trainer.certifications[0]}</div>
              </div>
            </div>
            
            <div className="col-span-3 flex flex-wrap gap-1">
              {trainer.specialties.slice(0, 2).map((specialty, i) => (
                <Badge key={i} variant="outline" className="font-normal">
                  {specialty}
                </Badge>
              ))}
              {trainer.specialties.length > 2 && (
                <span className="text-xs text-muted-foreground">+{trainer.specialties.length - 2} more</span>
              )}
            </div>
            
            <div className="col-span-2">
              <div className="text-sm">{trainer.assignedClasses.length} classes</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {trainer.availability.length} days available
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="text-sm flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{trainer.email}</span>
              </div>
            </div>
            
            <div className="col-span-1 flex gap-1 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewTrainer(trainer)}
              >
                View
              </Button>
              {onEditTrainer && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditTrainer(trainer)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
