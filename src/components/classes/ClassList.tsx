
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GymClass, Trainer } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Eye } from "lucide-react";

interface ClassListProps {
  classes: GymClass[];
  trainers: Trainer[];
  compact?: boolean;
}

export const ClassList = ({ classes, trainers, compact = false }: ClassListProps) => {
  // Helper to get trainer name
  const getTrainerName = (trainerId: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown';
  };
  
  // Helper to determine badge variant for class types
  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'Yoga':
      case 'Pilates':
        return 'secondary';
      case 'HIIT':
      case 'CrossFit':
      case 'Boxing':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Sort classes by date and time
  const sortedClasses = [...classes].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  if (classes.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-muted/30">
        <p className="text-muted-foreground">No classes found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Class</TableHead>
              {!compact && <TableHead>Type</TableHead>}
              <TableHead>Trainer</TableHead>
              {!compact && <TableHead>Room</TableHead>}
              <TableHead className="text-right">Capacity</TableHead>
              {!compact && <TableHead className="text-right">Status</TableHead>}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClasses.map((cls) => {
              const isFull = cls.attendees.length >= cls.capacity;
              const hasWaitlist = cls.attendees.length > cls.capacity;
              
              return (
                <TableRow key={cls.id}>
                  <TableCell>
                    {format(parseISO(cls.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {cls.startTime} - {cls.endTime}
                  </TableCell>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  {!compact && (
                    <TableCell>
                      <Badge variant={getBadgeVariant(cls.type)}>{cls.type}</Badge>
                    </TableCell>
                  )}
                  <TableCell>{getTrainerName(cls.trainerId)}</TableCell>
                  {!compact && <TableCell>{cls.room}</TableCell>}
                  <TableCell className="text-right">
                    {cls.attendees.length}/{cls.capacity}
                  </TableCell>
                  {!compact && (
                    <TableCell className="text-right">
                      {isFull ? (
                        hasWaitlist ? (
                          <Badge variant="outline">Waitlist</Badge>
                        ) : (
                          <Badge variant="destructive">Full</Badge>
                        )
                      ) : (
                        <Badge variant="outline">Available</Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
