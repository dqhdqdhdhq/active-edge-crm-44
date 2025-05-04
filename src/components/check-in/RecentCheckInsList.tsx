
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CheckIn, Member } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RecentCheckInsListProps {
  checkIns: CheckIn[];
  members: Member[];
}

export const RecentCheckInsList = ({ checkIns, members }: RecentCheckInsListProps) => {
  // Get recent check-ins with member details
  const recentCheckInsWithDetails = checkIns.slice(0, 10).map(checkIn => {
    const member = members.find(m => m.id === checkIn.memberId);
    return {
      ...checkIn,
      memberName: member ? `${member.firstName} ${member.lastName}` : 'Unknown',
      memberImage: member?.profileImage,
      membershipType: member?.membershipType,
      checkInTime: format(new Date(checkIn.dateTime), 'h:mm a'),
      checkInDate: format(new Date(checkIn.dateTime), 'EEE, MMM d')
    };
  });

  // Group check-ins by date
  const groupedCheckIns = recentCheckInsWithDetails.reduce((acc, checkIn) => {
    const date = checkIn.checkInDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(checkIn);
    return acc;
  }, {} as Record<string, typeof recentCheckInsWithDetails>);

  // Get sorted dates
  const sortedDates = Object.keys(groupedCheckIns).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Check-ins</CardTitle>
      </CardHeader>
      <CardContent>
        {recentCheckInsWithDetails.length > 0 ? (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">{date}</h3>
                </div>
                
                <div className="space-y-2">
                  {groupedCheckIns[date].map((checkIn) => (
                    <div key={checkIn.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={checkIn.memberImage} alt={checkIn.memberName} />
                          <AvatarFallback>
                            {checkIn.memberName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{checkIn.memberName}</p>
                          {checkIn.membershipType && (
                            <Badge variant="outline" className="text-xs font-normal">
                              {checkIn.membershipType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {checkIn.checkInTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No recent check-ins
          </div>
        )}
      </CardContent>
    </Card>
  );
};
