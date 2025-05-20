import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCheckInForm } from '@/components/check-in/EnhancedCheckInForm';
import { RecentCheckInsList } from '@/components/check-in/RecentCheckInsList';
import { members, recentCheckIns } from '@/data/mockData';
import { CheckIn, Guest, Member } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuestCheckInForm } from '@/components/check-in/GuestCheckInForm';
import { BarcodeScanner } from '@/components/check-in/BarcodeScanner';

const CheckInPage = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(recentCheckIns);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activeTab, setActiveTab] = useState<string>('member');
  const [searchValue, setSearchValue] = useState<string>('');
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

  const handleGuestCheckIn = (guestData: {
    name: string; // This will be split into firstName and lastName
    email?: string;
    phone?: string;
    relatedMemberId?: string;
    waiverSigned: boolean;
  }) => {
    // Split the name into firstName and lastName
    const nameParts = guestData.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Create a new guest record
    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      firstName: firstName,
      lastName: lastName,
      email: guestData.email,
      phone: guestData.phone,
      relatedMemberId: guestData.relatedMemberId,
      waiverSigned: guestData.waiverSigned,
      checkInDateTime: new Date().toISOString(),
      visitPurpose: GuestVisitPurpose.Trial, // Default visit purpose
      status: 'Checked In',
      convertedToMember: false,
      visitHistory: [],
      marketingConsent: false
    };
    
    setGuests([newGuest, ...guests]);
  };

  const handleScan = (value: string) => {
    setSearchValue(value);
    setActiveTab('member');
    
    // Toast to indicate successful scan
    toast({
      title: "Scan successful",
      description: `Scanned value: ${value}`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Member Check-In</h1>
      
      <div className="mb-6">
        <BarcodeScanner onScan={handleScan} />
      </div>
      
      <Tabs defaultValue="member" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="member">Member Check-In</TabsTrigger>
          <TabsTrigger value="guest">Guest Check-In</TabsTrigger>
        </TabsList>
        
        <TabsContent value="member">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <EnhancedCheckInForm 
                members={members} 
                onCheckIn={handleCheckIn}
                initialSearchTerm={searchValue}
              />
            </div>
            
            <RecentCheckInsList checkIns={checkIns} members={members} />
          </div>
        </TabsContent>
        
        <TabsContent value="guest">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <GuestCheckInForm 
                members={members}
                onGuestCheckIn={handleGuestCheckIn}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Guest Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                {guests.length > 0 ? (
                  <div className="space-y-2">
                    {guests.map((guest) => {
                      const relatedMember = guest.relatedMemberId 
                        ? members.find(m => m.id === guest.relatedMemberId)
                        : null;
                      
                      return (
                        <div key={guest.id} className="p-3 border rounded-md">
                          <p className="font-medium">{guest.firstName} {guest.lastName}</p>
                          {guest.email && (
                            <p className="text-sm text-muted-foreground">{guest.email}</p>
                          )}
                          {relatedMember && (
                            <p className="text-xs mt-1">
                              Guest of: {relatedMember.firstName} {relatedMember.lastName}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No recent guest check-ins
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckInPage;
