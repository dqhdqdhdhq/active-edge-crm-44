
import { useState } from 'react';
import { MemberCard } from './MemberCard';
import { Member } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberListProps {
  members: Member[];
  onViewMember: (member: Member) => void;
}

export const MemberList = ({ members, onViewMember }: MemberListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{members.length} Members</h2>
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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map(member => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onView={() => onViewMember(member)} 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {members.map(member => (
            <div key={member.id} className="border rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  member.membershipStatus === 'Active' ? 'bg-green-500' :
                  member.membershipStatus === 'Expired' ? 'bg-red-500' :
                  'bg-orange-500'
                )}/>
                <span className="font-medium">{member.firstName} {member.lastName}</span>
                <span className="text-sm text-muted-foreground">{member.membershipType}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewMember(member)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
