
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MembershipStatus, MembershipType, MemberTag } from '@/lib/types';
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface MemberSearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: {
    status?: MembershipStatus;
    type?: MembershipType;
    tags: MemberTag[];
  }) => void;
}

const membershipStatuses: MembershipStatus[] = ['Active', 'Inactive', 'Expired', 'Frozen', 'Pending'];
const membershipTypes: MembershipType[] = ['Standard', 'Premium', 'VIP', 'Student', 'Senior', 'Family', 'Corporate'];
const memberTags: MemberTag[] = ['VIP', 'Personal Training', 'New Member', 'Special Needs', 'Prospect', 'Corporate'];

export function MemberSearchFilter({ onSearch, onFilterChange }: MemberSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<MembershipStatus | undefined>(undefined);
  const [type, setType] = useState<MembershipType | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<MemberTag[]>([]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };
  
  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : value as MembershipStatus;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, type, tags: selectedTags });
  };
  
  const handleTypeChange = (value: string) => {
    const newType = value === 'all' ? undefined : value as MembershipType;
    setType(newType);
    onFilterChange({ status, type: newType, tags: selectedTags });
  };
  
  const handleTagToggle = (tag: MemberTag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onFilterChange({ status, type, tags: newTags });
  };

  const clearFilters = () => {
    setStatus(undefined);
    setType(undefined);
    setSelectedTags([]);
    onFilterChange({ tags: [] });
  };

  const hasActiveFilters = status !== undefined || type !== undefined || selectedTags.length > 0;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {membershipStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={type || 'all'} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Membership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Memberships</SelectItem>
              {membershipTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Member Tags</h4>
                <div className="space-y-2">
                  {memberTags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`} className="text-sm font-normal">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>
          
          {status && (
            <Badge variant="outline" className="px-2 py-0 h-6">
              {status}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleStatusChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {type && (
            <Badge variant="outline" className="px-2 py-0 h-6">
              {type}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleTypeChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedTags.map(tag => (
            <Badge key={tag} variant="outline" className="px-2 py-0 h-6">
              {tag}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleTagToggle(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
