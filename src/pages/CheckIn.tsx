
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckInForm } from '@/components/check-in/CheckInForm';
import { members, recentCheckIns } from '@/data/mockData';
import { CheckIn } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const CheckInPage = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(recentCheckIns);
  const { toast } = useToast();
  
  const handleCheckIn = (memberId: string) => {
    // Create a new check-in record
    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      memberId,
      dateTime: new Date().toISOString()
    };
    
    setCheckIns([newCheckIn, ...checkIns]);
    
    // In a real app, we would save this to the server
    toast({
      title: "Check-in recorded",
      description: "Member has been checked in successfully.",
    });
  };
  
  // Get recent check-ins with member details
  const recentCheckInsWithDetails = checkIns.slice(0, 10).map(checkIn => {
    const member = members.find(m => m.id === checkIn.memberId);
    return {
      ...checkIn,
      memberName: member ? `${member.firstName} ${member.lastName}` : 'Unknown',
      memberImage: member?.profileImage
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Member Check-In</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckInForm members={members} onCheckIn={handleCheckIn} />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCheckInsWithDetails.length > 0 ? (
              <div className="space-y-4">
                {recentCheckInsWithDetails.map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      {checkIn.memberImage ? (
                        <img
                          src={checkIn.memberImage}
                          alt={checkIn.memberName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {checkIn.memberName.charAt(0)}
                        </div>
                      )}
                      <span>{checkIn.memberName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(checkIn.dateTime), 'h:mm a')}
                    </span>
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
      </div>
    </div>
  );
};

export default CheckInPage;
