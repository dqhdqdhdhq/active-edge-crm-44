
import { useState } from 'react';
import { GuestList } from '@/components/guests/GuestList';
import { GuestSearchFilter } from '@/components/guests/GuestSearchFilter';
import { Button } from '@/components/ui/button';
import { guests } from '@/data/mockData';
import { Guest, GuestStatus, GuestVisitPurpose } from '@/lib/types';
import { UserPlus } from 'lucide-react';
import { GuestProfileDialog } from '@/components/guests/GuestProfileDialog';
import { GuestFormDialog } from '@/components/guests/GuestFormDialog';
import { useToast } from '@/hooks/use-toast';

// Simple function to generate a pseudo-random ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const Guests = () => {
  const [guestsList, setGuestsList] = useState(guests);
  const [filteredGuests, setFilteredGuests] = useState(guests);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [addGuestDialogOpen, setAddGuestDialogOpen] = useState(false);
  const [editGuestDialogOpen, setEditGuestDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  const handleViewGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setProfileDialogOpen(true);
  };
  
  const handleEditGuest = () => {
    if (selectedGuest) {
      setProfileDialogOpen(false);
      setEditGuestDialogOpen(true);
    }
  };
  
  const handleConvertToMember = (guest: Guest) => {
    // In a real app, this would open a member signup form prefilled with guest info
    toast({
      title: "Convert to Member",
      description: "Would redirect to member signup form in a real application"
    });
  };
  
  const handleSaveGuest = (updatedGuest: Partial<Guest>) => {
    if (updatedGuest.id) {
      // Edit existing guest
      const updatedGuests = guestsList.map(guest => 
        guest.id === updatedGuest.id ? { ...guest, ...updatedGuest } : guest
      );
      
      setGuestsList(updatedGuests);
      setFilteredGuests(
        filteredGuests.map(guest => 
          guest.id === updatedGuest.id ? { ...guest, ...updatedGuest } : guest
        )
      );
      
      toast({
        title: "Guest Updated",
        description: "Guest information has been updated successfully"
      });
    } else {
      // Add new guest
      const newGuest = {
        id: generateId(),
        visitHistory: [],
        convertedToMember: false,
        marketingConsent: false,
        status: 'Checked In' as GuestStatus,
        ...updatedGuest
      } as Guest;
      
      setGuestsList([...guestsList, newGuest]);
      setFilteredGuests([...filteredGuests, newGuest]);
      
      toast({
        title: "Guest Added",
        description: "New guest has been added successfully"
      });
    }
  };
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredGuests(guestsList);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    
    const filtered = guestsList.filter(guest => {
      const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
      return (
        fullName.includes(lowercaseSearch) ||
        (guest.email?.toLowerCase().includes(lowercaseSearch) || false) ||
        (guest.phone?.includes(searchTerm) || false)
      );
    });
    
    setFilteredGuests(filtered);
  };
  
  const handleFilterChange = (filters: {
    status?: GuestStatus;
    visitPurpose?: GuestVisitPurpose;
    convertedToMember?: boolean;
  }) => {
    let filtered = [...guestsList];
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(guest => guest.status === filters.status);
    }
    
    // Filter by visit purpose
    if (filters.visitPurpose) {
      filtered = filtered.filter(guest => guest.visitPurpose === filters.visitPurpose);
    }
    
    // Filter by conversion status
    if (filters.convertedToMember !== undefined) {
      filtered = filtered.filter(guest => guest.convertedToMember === filters.convertedToMember);
    }
    
    setFilteredGuests(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Guests</h1>
        <Button onClick={() => setAddGuestDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </div>
      
      <GuestSearchFilter 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
      />
      
      <GuestList 
        guests={filteredGuests} 
        onViewGuest={handleViewGuest} 
      />
      
      <GuestProfileDialog 
        guest={selectedGuest} 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen}
        onEditClick={handleEditGuest}
        onConvertToMember={
          selectedGuest && !selectedGuest.convertedToMember ? 
            () => handleConvertToMember(selectedGuest) : 
            undefined
        }
      />
      
      <GuestFormDialog 
        open={editGuestDialogOpen} 
        onOpenChange={setEditGuestDialogOpen}
        onSave={handleSaveGuest}
        guest={selectedGuest || undefined}
      />
      
      <GuestFormDialog 
        open={addGuestDialogOpen} 
        onOpenChange={setAddGuestDialogOpen}
        onSave={handleSaveGuest}
      />
    </div>
  );
};

export default Guests;
