
import { useState } from 'react';
import { MemberSearchFilter } from '@/components/members/MemberSearchFilter';
import { MemberList } from '@/components/members/MemberList';
import { Button } from '@/components/ui/button';
import { members } from '@/data/mockData';
import { MemberTag, MembershipStatus, MembershipType } from '@/lib/types';
import { UserPlus } from 'lucide-react';

const Members = () => {
  const [filteredMembers, setFilteredMembers] = useState(members);
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    
    const filtered = members.filter(member => {
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
    let filtered = [...members];
    
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
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      <MemberSearchFilter 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
      />
      
      <MemberList members={filteredMembers} />
    </div>
  );
};

export default Members;
