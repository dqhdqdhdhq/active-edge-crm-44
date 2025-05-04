
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCheckInForm } from '@/components/check-in/EnhancedCheckInForm';
import { RecentCheckInsList } from '@/components/check-in/RecentCheckInsList';
import { members, recentCheckIns } from '@/data/mockData';
import { CheckIn } from '@/lib/types';
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Member Check-In</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <EnhancedCheckInForm members={members} onCheckIn={handleCheckIn} />
        </div>
        
        <RecentCheckInsList checkIns={checkIns} members={members} />
      </div>
    </div>
  );
};

export default CheckInPage;
