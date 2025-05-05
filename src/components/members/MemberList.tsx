
import { useState } from 'react';
import { MemberCard } from './MemberCard';
import { Member, MemberTag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid3X3, List, Mail, Tag, UserPlus, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface MemberListProps {
  members: Member[];
  onViewMember: (member: Member) => void;
}

export const MemberList = ({ members, onViewMember }: MemberListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };
  
  const getSelectedMembers = () => {
    return members.filter(member => selectedMembers.includes(member.id));
  };
  
  const handleBulkAddTag = (tag: MemberTag) => {
    // In a real application, this would call an API to update members
    toast({
      title: "Tags Added",
      description: `Added "${tag}" tag to ${selectedMembers.length} members`,
    });
  };
  
  const handleBulkEmail = () => {
    const emails = getSelectedMembers().map(member => member.email).join(';');
    window.location.href = `mailto:${emails}`;
    toast({
      title: "Email Client Opened",
      description: `Email drafted to ${selectedMembers.length} members`,
    });
  };
  
  const handleExportCsv = () => {
    // In a real application, this would generate and download a CSV file
    toast({
      title: "Export Started",
      description: `Exporting data for ${selectedMembers.length} members`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{members.length} Members</h2>
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
      
      {selectedMembers.length > 0 && (
        <div className="flex justify-between items-center bg-muted/40 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all"
              checked={selectedMembers.length === members.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              {selectedMembers.length} members selected
            </label>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Tag className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAddTag("VIP")}>
                  VIP
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAddTag("Personal Training")}>
                  Personal Training
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAddTag("New Member")}>
                  New Member
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAddTag("Special Needs")}>
                  Special Needs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAddTag("Corporate")}>
                  Corporate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleBulkEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map(member => (
            <div key={member.id} className="relative">
              {/* Checkbox for selection */}
              <div className="absolute top-3 left-3 z-10">
                <Checkbox 
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleSelectMember(member.id)}
                />
              </div>
              <MemberCard 
                key={member.id} 
                member={member} 
                onView={() => onViewMember(member)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {members.map(member => (
            <div key={member.id} className="border rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleSelectMember(member.id)}
                />
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
