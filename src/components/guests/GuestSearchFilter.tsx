import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuestStatus, GuestVisitPurpose } from '@/lib/types';
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GuestSearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: {
    status?: GuestStatus;
    visitPurpose?: GuestVisitPurpose;
    convertedToMember?: boolean;
  }) => void;
}

const guestStatuses: GuestStatus[] = ['Checked In', 'Checked Out', 'Scheduled'];
const visitPurposes: GuestVisitPurpose[] = [
  GuestVisitPurpose.Trial, 
  GuestVisitPurpose.DayPass, 
  GuestVisitPurpose.Tour, 
  GuestVisitPurpose.Event, 
  GuestVisitPurpose.MemberGuest
];

export function GuestSearchFilter({ onSearch, onFilterChange }: GuestSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<GuestStatus | undefined>(undefined);
  const [visitPurpose, setVisitPurpose] = useState<GuestVisitPurpose | undefined>(undefined);
  const [convertedToMember, setConvertedToMember] = useState<boolean | undefined>(undefined);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };
  
  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : value as GuestStatus;
    setStatus(newStatus);
    onFilterChange({ 
      status: newStatus, 
      visitPurpose, 
      convertedToMember 
    });
  };
  
  const handleVisitPurposeChange = (value: string) => {
    const newPurpose = value === 'all' ? undefined : value as GuestVisitPurpose;
    setVisitPurpose(newPurpose);
    onFilterChange({ 
      status, 
      visitPurpose: newPurpose, 
      convertedToMember 
    });
  };
  
  const handleConvertedToggle = (value: boolean | undefined) => {
    setConvertedToMember(value);
    onFilterChange({ 
      status, 
      visitPurpose, 
      convertedToMember: value 
    });
  };

  const clearFilters = () => {
    setStatus(undefined);
    setVisitPurpose(undefined);
    setConvertedToMember(undefined);
    onFilterChange({ 
      convertedToMember: undefined 
    });
  };

  const hasActiveFilters = status !== undefined || 
    visitPurpose !== undefined || 
    convertedToMember !== undefined;
  
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
              {guestStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={visitPurpose || 'all'} onValueChange={handleVisitPurposeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Visit Purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purposes</SelectItem>
              {visitPurposes.map(purpose => (
                <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Additional Filters</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="converted-yes">Show Converted Only</Label>
                    <Switch 
                      id="converted-yes" 
                      checked={convertedToMember === true}
                      onCheckedChange={() => handleConvertedToggle(
                        convertedToMember === true ? undefined : true
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="converted-no">Show Non-Converted Only</Label>
                    <Switch 
                      id="converted-no" 
                      checked={convertedToMember === false}
                      onCheckedChange={() => handleConvertedToggle(
                        convertedToMember === false ? undefined : false
                      )}
                    />
                  </div>
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
          
          {visitPurpose && (
            <Badge variant="outline" className="px-2 py-0 h-6">
              {visitPurpose}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleVisitPurposeChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {convertedToMember !== undefined && (
            <Badge variant="outline" className="px-2 py-0 h-6">
              {convertedToMember ? 'Converted to Member' : 'Not Converted'}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleConvertedToggle(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
