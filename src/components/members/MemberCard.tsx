
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Member } from "@/lib/types";
import { format, parseISO, differenceInDays, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const getMembershipStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500';
    case 'Frozen':
      return 'bg-blue-500';
    case 'Expired':
      return 'bg-red-500';
    case 'Inactive':
      return 'bg-orange-500';
    case 'Pending':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

interface MemberCardProps {
  member: Member;
  onView: () => void;
}

export const MemberCard = ({ member, onView }: MemberCardProps) => {
  // Safely parse the expiry date
  const expiryDate = parseISO(member.membershipEndDate);
  const daysUntilExpiry = isValid(expiryDate) ? 
    differenceInDays(expiryDate, new Date()) : 
    0;
  
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  const isExpired = daysUntilExpiry <= 0;
  
  // Safe formatting function that handles invalid dates
  const formatSafeDate = (dateString: string, formatString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, formatString);
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get the last check-in date safely
  const getLastCheckInDate = () => {
    if (member.checkIns.length === 0) return 'Never';
    
    try {
      const lastCheckIn = new Date(member.checkIns[0].dateTime);
      if (!isValid(lastCheckIn)) return 'Invalid date';
      return format(lastCheckIn, 'MMM d');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0 h-2">
        <div 
          className={cn(
            "h-full w-full", 
            getMembershipStatusColor(member.membershipStatus)
          )}
        />
      </CardHeader>
      <CardContent className="pt-4 pb-3">
        <div className="flex justify-between">
          <div className="flex gap-3 mb-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-base">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Membership</span>
            <span className="font-medium">{member.membershipType}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={member.membershipStatus === 'Active' ? 'default' : 'outline'}>
              {member.membershipStatus}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expiry</span>
            <span className={cn(
              "font-medium",
              isExpired ? "text-destructive" : 
              isExpiringSoon ? "text-orange-500" : ""
            )}>
              {formatSafeDate(member.membershipEndDate, 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last visit</span>
            <span className="font-medium">
              {getLastCheckInDate()}
            </span>
          </div>
        </div>
        
        <div className="mt-3 flex gap-2">
          {member.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" size="sm" className="w-full" onClick={onView}>
            <Edit className="mr-2 h-3.5 w-3.5" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
