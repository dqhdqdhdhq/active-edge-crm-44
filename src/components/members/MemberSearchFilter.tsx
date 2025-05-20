import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MembershipStatus, MembershipType, MemberTag } from '@/lib/types';

interface MemberSearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: {
    status?: MembershipStatus;
    type?: MembershipType;
    tags: MemberTag[];
  }) => void;
}

export const MemberSearchFilter = ({ onSearch, onFilterChange }: MemberSearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<MembershipStatus | undefined>(undefined);
  const [type, setType] = useState<MembershipType | undefined>(undefined);
  const [tags, setTags] = useState<MemberTag[]>([]);

  const membershipStatuses: MembershipStatus[] = [
    MembershipStatus.Active,
    MembershipStatus.Inactive,
    MembershipStatus.Pending,
    MembershipStatus.Expired,
    MembershipStatus.Frozen,
    MembershipStatus.Cancelled,
  ];

  const membershipTypes: MembershipType[] = [
    MembershipType.Basic,
    MembershipType.Standard,
    MembershipType.Premium,
    MembershipType.Student,
    MembershipType.Senior,
    MembershipType.Family,
    MembershipType.Corporate,
    MembershipType.Trial,
  ];

  const memberTags: MemberTag[] = [
    'New Member',
    'VIP',
    'Personal Training',
    'Group Classes',
    'Referral',
    'Promotion',
    'Student',
    'Senior',
    'Corporate',
    'Family',
    'Special Needs'
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (value: MembershipStatus | undefined) => {
    setStatus(value);
    onFilterChange({ status: value, type, tags });
  };

  const handleTypeChange = (value: MembershipType | undefined) => {
    setType(value);
    onFilterChange({ status, type: value, tags });
  };

  const handleTagToggle = (tag: MemberTag) => {
    const newTags = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag];
    setTags(newTags);
    onFilterChange({ status, type, tags: newTags });
  };

  const handleClearFilters = () => {
    setStatus(undefined);
    setType(undefined);
    setTags([]);
    setSearchTerm('');
    onSearch('');
    onFilterChange({ status: undefined, type: undefined, tags: [] });
  };

  const hasActiveFilters = !!status || !!type || tags.length > 0 || searchTerm;

  return (
    <div className="space-y-4 p-4 border rounded-md bg-muted/30">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Search & Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <Label htmlFor="search">Search Members</Label>
          <Input
            type="search"
            id="search"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Membership Status Filter */}
        <div>
          <Label htmlFor="status">Membership Status</Label>
          <Select onValueChange={(value) => handleStatusChange(value as MembershipStatus)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {membershipStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Membership Type Filter */}
        <div>
          <Label htmlFor="type">Membership Type</Label>
          <Select onValueChange={(value) => handleTypeChange(value as MembershipType)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {membershipTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Member Tags Filter */}
        <div className="md:col-span-3">
          <Label>Member Tags</Label>
          <div className="flex flex-wrap gap-2">
            {memberTags.map((tag) => (
              <Button
                key={tag}
                variant={tags.includes(tag) ? 'default' : 'outline'}
                onClick={() => handleTagToggle(tag)}
              >
                <Checkbox
                  checked={tags.includes(tag)}
                  className="mr-2"
                  onCheckedChange={() => {}} // Empty handler
                />
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
