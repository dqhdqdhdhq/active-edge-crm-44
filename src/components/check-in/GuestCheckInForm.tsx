
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, UserCheck } from 'lucide-react';
import { Member } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface GuestCheckInFormProps {
  members: Member[];
  onGuestCheckIn: (guestData: {
    name: string;
    email?: string;
    phone?: string;
    relatedMemberId?: string;
    waiverSigned: boolean;
  }) => void;
}

export const GuestCheckInForm = ({ members, onGuestCheckIn }: GuestCheckInFormProps) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [waiverSigned, setWaiverSigned] = useState(false);
  const [relatedMemberId, setRelatedMemberId] = useState('');
  const [showRelatedMember, setShowRelatedMember] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName) {
      toast({
        title: "Name required",
        description: "Please enter the guest's name",
        variant: "destructive",
      });
      return;
    }
    
    if (!waiverSigned) {
      toast({
        title: "Waiver required",
        description: "The waiver must be signed before check-in",
        variant: "destructive",
      });
      return;
    }
    
    onGuestCheckIn({
      name: guestName,
      email: guestEmail || undefined,
      phone: guestPhone || undefined,
      relatedMemberId: relatedMemberId || undefined,
      waiverSigned
    });
    
    // Reset form
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setWaiverSigned(false);
    setRelatedMemberId('');
    setShowRelatedMember(false);
    
    toast({
      title: "Guest checked in",
      description: `${guestName} has been checked in as a guest`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Check-In</CardTitle>
        <CardDescription>Register a guest visitor</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name *</Label>
            <Input 
              id="guestName" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email (Optional)</Label>
              <Input 
                id="guestEmail" 
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone (Optional)</Label>
              <Input 
                id="guestPhone" 
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="relatedMember" 
              checked={showRelatedMember}
              onCheckedChange={(checked) => {
                setShowRelatedMember(checked === true);
                if (checked === false) {
                  setRelatedMemberId('');
                }
              }}
            />
            <Label htmlFor="relatedMember" className="cursor-pointer">
              Guest of an existing member
            </Label>
          </div>
          
          {showRelatedMember && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="relatedMemberId">Related Member</Label>
              <select
                id="relatedMemberId"
                value={relatedMemberId}
                onChange={(e) => setRelatedMemberId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">-- Select Member --</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="waiver" 
              checked={waiverSigned}
              onCheckedChange={(checked) => setWaiverSigned(checked === true)}
              required
            />
            <Label htmlFor="waiver" className="font-medium">
              Waiver has been signed *
            </Label>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Check In Guest
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
