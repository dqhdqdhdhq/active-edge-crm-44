
import { Card, CardContent } from "@/components/ui/card";
import { GymClass } from "@/lib/types";
import { Calendar, Users, CheckCircle, AlertCircle } from "lucide-react";
import { isToday, isThisWeek, parseISO } from "date-fns";

interface ClassStatsProps {
  classes: GymClass[];
}

export const ClassStats = ({ classes }: ClassStatsProps) => {
  // Calculate stats
  const todayClasses = classes.filter(cls => isToday(parseISO(cls.date)));
  const weekClasses = classes.filter(cls => isThisWeek(parseISO(cls.date)));
  
  const totalAttendees = classes.reduce((sum, cls) => sum + cls.attendees.length, 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0);
  const attendanceRate = totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;
  
  const fullClasses = classes.filter(cls => cls.attendees.length >= cls.capacity).length;
  
  const statItems = [
    {
      label: "Today's Classes",
      value: todayClasses.length,
      icon: Calendar,
    },
    {
      label: "This Week",
      value: weekClasses.length,
      icon: Calendar,
    },
    {
      label: "Total Bookings",
      value: totalAttendees,
      icon: Users,
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: CheckCircle,
    },
    {
      label: "Full Classes",
      value: fullClasses,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 mb-2">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
