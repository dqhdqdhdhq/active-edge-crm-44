import { useState } from 'react';
import { MemberSearchFilter } from '@/components/members/MemberSearchFilter';
import { MemberList } from '@/components/members/MemberList';
import { Button } from '@/components/ui/button';
import { members } from '@/data/mockData';
import { Member, MemberTag, MembershipStatus, MembershipType } from '@/lib/types';
import { UserPlus } from 'lucide-react';
import { MemberProfileDialog } from '@/components/members/MemberProfileDialog';
import { MemberFormDialog } from '@/components/members/MemberFormDialog';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const Members = () => {
  const [membersList, setMembersList] = useState(members);
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [editMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setProfileDialogOpen(true);
  };
  
  const handleEditMember = () => {
    if (selectedMember) {
      setProfileDialogOpen(false);
      setEditMemberDialogOpen(true);
    }
  };
  
  const handleSaveMember = (updatedMember: Partial<Member>) => {
    if (updatedMember.id) {
      // Edit existing member
      const updatedMembers = membersList.map(member => 
        member.id === updatedMember.id ? { ...member, ...updatedMember } : member
      );
      
      setMembersList(updatedMembers);
      setFilteredMembers(
        filteredMembers.map(member => 
          member.id === updatedMember.id ? { ...member, ...updatedMember } : member
        )
      );
      
      toast({
        title: "Member Updated",
        description: "Member profile has been updated successfully",
      });
    } else {
      // Add new member
      const newMember = {
        id: uuidv4(),
        checkIns: [],
        ...updatedMember,
      } as Member;
      
      setMembersList([...membersList, newMember]);
      setFilteredMembers([...filteredMembers, newMember]);
      
      toast({
        title: "Member Added",
        description: "New member has been added successfully",
      });
    }
  };
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredMembers(membersList);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    
    const filtered = membersList.filter(member => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      return (
        fullName.includes(lowercaseSearch) ||
        member.email.toLowerCase().includes(lowercaseSearch) ||
        member.phone.includes(searchTerm)
      );
    });
    
    setFilteredMembers(filtered);
  };
  
  const handleFilterChange = (filters: {
    status?: MembershipStatus;
    type?: MembershipType;
    tags: MemberTag[];
  }) => {
    let filtered = [...membersList];
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(member => member.membershipStatus === filters.status);
    }
    
    // Filter by membership type
    if (filters.type) {
      filtered = filtered.filter(member => member.membershipType === filters.type);
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(member => 
        filters.tags.some(tag => member.tags.includes(tag))
      );
    }
    
    setFilteredMembers(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <Button onClick={() => setAddMemberDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      <MemberSearchFilter 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
      />
      
      <MemberList members={filteredMembers} onViewMember={handleViewMember} />
      
      <MemberProfileDialog 
        member={selectedMember} 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen}
        onEditClick={handleEditMember}
      />
      
      <MemberFormDialog 
        open={editMemberDialogOpen} 
        onOpenChange={setEditMemberDialogOpen}
        onSave={handleSaveMember}
        member={selectedMember || undefined}
      />
      
      <MemberFormDialog 
        open={addMemberDialogOpen} 
        onOpenChange={setAddMemberDialogOpen}
        onSave={handleSaveMember}
      />
    </div>
  );
};

export default Members;
