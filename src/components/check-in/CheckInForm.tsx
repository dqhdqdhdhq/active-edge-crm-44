
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
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/lib/types';
import { Search, UserCheck, UserX, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMembershipStatusColor } from '../members/MemberCard';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CheckInFormProps {
  members: Member[];
  onCheckIn: (memberId: string) => void;
}

export const CheckInForm = ({ members, onCheckIn }: CheckInFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toast } = useToast();
  
  // Filter members based on search term
  const filteredMembers = members.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           member.email.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Handle check-in
  const handleCheckIn = () => {
    if (selectedMember) {
      if (selectedMember.membershipStatus !== 'Active') {
        toast({
          variant: "destructive",
          title: "Cannot check in",
          description: `Member status is ${selectedMember.membershipStatus.toLowerCase()}. Please update membership before check-in.`,
        });
        return;
      }
      
      onCheckIn(selectedMember.id);
      toast({
        title: "Member checked in",
        description: `${selectedMember.firstName} ${selectedMember.lastName} has been checked in successfully.`,
      });
      setSelectedMember(null);
      setSearchTerm('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Member Check-In</CardTitle>
        <CardDescription>Search for a member to check in</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-search">Search by name or email</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="member-search"
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedMember(null);
                }}
              />
            </div>
          </div>

          {searchTerm.length > 0 && (
            <div className="border rounded-md overflow-hidden max-h-72 overflow-y-auto">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(member => (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-3 p-3 hover:bg-muted cursor-pointer",
                      selectedMember?.id === member.id && "bg-muted"
                    )}
                    onClick={() => setSelectedMember(member)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.profileImage} />
                      <AvatarFallback>
                        {member.firstName[0]}{member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        getMembershipStatusColor(member.membershipStatus)
                      )} />
                      <span className="text-xs text-muted-foreground">
                        {member.membershipStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No members found
                </div>
              )}
            </div>
          )}

          {selectedMember && (
            <div className="border rounded-md p-4 mt-4 bg-muted/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedMember.profileImage} />
                    <AvatarFallback>
                      {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.email}
                    </p>
                  </div>
                </div>
                <Badge variant={selectedMember.membershipStatus === 'Active' ? 'default' : 'destructive'}>
                  {selectedMember.membershipStatus}
                </Badge>
              </div>
              
              <div className="mt-3">
                <p className="text-sm">
                  <span className="text-muted-foreground">Membership: </span>
                  <span className="font-medium">{selectedMember.membershipType}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          disabled={!selectedMember}
          onClick={handleCheckIn}
        >
          {selectedMember?.membershipStatus === 'Active' ? (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Check In Member
            </>
          ) : (
            <>
              <UserX className="mr-2 h-4 w-4" />
              {selectedMember ? 'Membership Not Active' : 'Select a Member'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
