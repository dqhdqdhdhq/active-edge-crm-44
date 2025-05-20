
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Guest } from "@/lib/types";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const getGuestStatusColor = (status: string) => {
  switch (status) {
    case 'Checked In':
      return 'bg-green-500';
    case 'Checked Out':
      return 'bg-blue-500';
    case 'Scheduled':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

export const getVisitPurposeColor = (purpose: string) => {
  switch (purpose) {
    case 'Trial':
      return 'bg-purple-100 text-purple-800';
    case 'Day Pass':
      return 'bg-blue-100 text-blue-800';
    case 'Tour':
      return 'bg-amber-100 text-amber-800';
    case 'Event':
      return 'bg-green-100 text-green-800';
    case 'Member Guest':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface GuestCardProps {
  guest: Guest;
  onView: () => void;
}

export const GuestCard = ({ guest, onView }: GuestCardProps) => {
  // Safe formatting function that handles invalid dates
  const formatSafeDate = (dateString: string | undefined, formatString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, formatString);
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Calculate visit duration if checked out
  const getVisitDuration = () => {
    if (!guest.checkOutDateTime) return null;
    
    try {
      const checkIn = parseISO(guest.checkInDateTime);
      const checkOut = parseISO(guest.checkOutDateTime);
      
      if (!isValid(checkIn) || !isValid(checkOut)) return null;
      
      const diffInMinutes = Math.round((checkOut.getTime() - checkIn.getTime()) / 60000);
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    } catch (error) {
      return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0 h-2">
        <div 
          className={cn(
            "h-full w-full", 
            getGuestStatusColor(guest.status)
          )}
        />
      </CardHeader>
      <CardContent className="pt-4 pb-3">
        <div className="flex justify-between">
          <div className="flex gap-3 mb-3">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback>{guest.firstName[0]}{guest.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-base">
                {guest.firstName} {guest.lastName}
              </h3>
              <p className="text-xs text-muted-foreground">{guest.email || 'No email provided'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Visit Purpose</span>
            <Badge className={getVisitPurposeColor(guest.visitPurpose)}>
              {guest.visitPurpose}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={guest.status === 'Checked In' ? 'default' : 'outline'}>
              {guest.status}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in Time</span>
            <span className="font-medium">
              {formatSafeDate(guest.checkInDateTime, 'h:mm a')}
            </span>
          </div>
          
          {guest.status === 'Checked Out' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">
                {getVisitDuration() || 'N/A'}
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Waiver Signed</span>
            <span>
              {guest.waiverSigned ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </span>
          </div>
          
          {guest.convertedToMember && (
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 w-full justify-center py-1">
                Converted to Member
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" size="sm" className="w-full" onClick={onView}>
            <Edit className="mr-2 h-3.5 w-3.5" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
