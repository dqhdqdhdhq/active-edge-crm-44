
import { useState } from 'react';
import { GuestCard } from './GuestCard';
import { Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid3X3, List, Mail, Tag, UserPlus, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface GuestListProps {
  guests: Guest[];
  onViewGuest: (guest: Guest) => void;
}

export const GuestList = ({ guests, onViewGuest }: GuestListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleSelectGuest = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId) 
        : [...prev, guestId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedGuests.length === guests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(guests.map(guest => guest.id));
    }
  };
  
  const getSelectedGuests = () => {
    return guests.filter(guest => selectedGuests.includes(guest.id));
  };
  
  const handleBulkEmail = () => {
    const emails = getSelectedGuests()
      .filter(guest => guest.email)
      .map(guest => guest.email as string)
      .join(';');
    
    if (emails) {
      window.location.href = `mailto:${emails}`;
      toast({
        title: "Email Client Opened",
        description: `Email drafted to ${selectedGuests.length} guests`,
      });
    } else {
      toast({
        title: "No Emails Available",
        description: "Selected guests do not have email addresses",
        variant: "destructive"
      });
    }
  };
  
  const handleExportCsv = () => {
    // In a real application, this would generate and download a CSV file
    toast({
      title: "Export Started",
      description: `Exporting data for ${selectedGuests.length} guests`,
    });
  };
  
  const handleConvertToMembers = () => {
    // In a real application, this would open a batch conversion process
    toast({
      title: "Batch Conversion",
      description: `Would start batch conversion process for ${selectedGuests.length} guests`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{guests.length} Guests</h2>
        <div className="flex gap-2">
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(viewMode === 'grid' && "bg-secondary")}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(viewMode === 'list' && "bg-secondary")}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {selectedGuests.length > 0 && (
        <div className="flex justify-between items-center bg-muted/40 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all"
              checked={selectedGuests.length === guests.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              {selectedGuests.length} guests selected
            </label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleConvertToMembers}>
              <UserPlus className="mr-2 h-4 w-4" />
              Convert to Member
            </Button>
          </div>
        </div>
      )}

      {guests.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No guests found matching your search criteria</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {guests.map(guest => (
                <div key={guest.id} className="relative">
                  {/* Checkbox for selection */}
                  <div className="absolute top-3 left-3 z-10">
                    <Checkbox 
                      checked={selectedGuests.includes(guest.id)}
                      onCheckedChange={() => handleSelectGuest(guest.id)}
                    />
                  </div>
                  <GuestCard 
                    key={guest.id} 
                    guest={guest} 
                    onView={() => onViewGuest(guest)} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {guests.map(guest => (
                <div key={guest.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={selectedGuests.includes(guest.id)}
                      onCheckedChange={() => handleSelectGuest(guest.id)}
                    />
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      guest.status === 'Checked In' ? 'bg-green-500' :
                      guest.status === 'Checked Out' ? 'bg-blue-500' :
                      'bg-orange-500'
                    )}/>
                    <span className="font-medium">{guest.firstName} {guest.lastName}</span>
                    <Badge className={cn(
                      "text-xs",
                      guest.visitPurpose === 'Trial' ? 'bg-purple-100 text-purple-800' :
                      guest.visitPurpose === 'Day Pass' ? 'bg-blue-100 text-blue-800' :
                      guest.visitPurpose === 'Tour' ? 'bg-amber-100 text-amber-800' :
                      guest.visitPurpose === 'Event' ? 'bg-green-100 text-green-800' :
                      'bg-indigo-100 text-indigo-800'
                    )}>
                      {guest.visitPurpose}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewGuest(guest)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
