
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/lib/types';
import { Search, UserCheck, UserX, AlertTriangle, Calendar, Clock, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, differenceInDays, isValid, formatDistanceToNow, addDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface EnhancedCheckInFormProps {
  members: Member[];
  onCheckIn: (memberId: string) => void;
}

type SearchType = 'name' | 'email' | 'phone' | 'memberId';

export const EnhancedCheckInForm = ({ members, onCheckIn }: EnhancedCheckInFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Format a date safely
  const formatSafeDate = (dateString: string, formatString: string): string => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, formatString);
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (member: Member): number => {
    try {
      const expiryDate = parseISO(member.membershipEndDate);
      if (!isValid(expiryDate)) return 0;
      return differenceInDays(expiryDate, new Date());
    } catch (error) {
      return 0;
    }
  };
  
  // Get expiry status info
  const getExpiryInfo = (member: Member) => {
    const daysUntilExpiry = getDaysUntilExpiry(member);
    
    if (daysUntilExpiry < 0) {
      return {
        status: 'Expired',
        className: 'text-destructive',
        message: `Expired ${formatDistanceToNow(parseISO(member.membershipEndDate), { addSuffix: true })}`
      };
    } else if (daysUntilExpiry <= 7) {
      return {
        status: 'Expiring Soon',
        className: 'text-orange-500',
        message: `Expires in ${daysUntilExpiry} days`
      };
    } else {
      return {
        status: 'Active',
        className: 'text-green-500',
        message: `Expires ${formatSafeDate(member.membershipEndDate, 'MMM d, yyyy')}`
      };
    }
  };
  
  // Get last check-in date
  const getLastCheckInInfo = (member: Member) => {
    if (member.checkIns.length === 0) {
      return {
        date: 'Never visited',
        isFirstVisit: true
      };
    }
    
    try {
      const lastCheckIn = new Date(member.checkIns[0].dateTime);
      if (!isValid(lastCheckIn)) return { date: 'Unknown', isFirstVisit: false };
      
      return {
        date: formatDistanceToNow(lastCheckIn, { addSuffix: true }),
        isFirstVisit: false
      };
    } catch (error) {
      return { date: 'Unknown', isFirstVisit: false };
    }
  };
  
  // Filter members based on search term and type
  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    
    if (!searchTerm) return false;
    
    switch (searchType) {
      case 'name':
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        return fullName.includes(searchLower);
      case 'email':
        return member.email.toLowerCase().includes(searchLower);
      case 'phone':
        return member.phone.toLowerCase().includes(searchLower);
      case 'memberId':
        return member.id.toLowerCase().includes(searchLower);
      default:
        return false;
    }
  });
  
  // Handle search type change
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value as SearchType);
    setSearchTerm('');
    setShowResults(false);
    setSelectedMember(null);
    // Focus the search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };
  
  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
    setSelectedMember(null);
  };
  
  // Handle member selection
  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setShowResults(false);
  };
  
  // Handle check-in
  const handleCheckIn = () => {
    if (!selectedMember) return;
    
    const daysUntilExpiry = getDaysUntilExpiry(selectedMember);
    
    if (daysUntilExpiry < 0) {
      toast({
        variant: "destructive",
        title: "Cannot check in",
        description: `Membership expired. Please renew membership before check-in.`,
      });
      return;
    }
    
    onCheckIn(selectedMember.id);
    
    // Show success toast with contextual info
    const lastCheckInfo = getLastCheckInInfo(selectedMember);
    let description = `${selectedMember.firstName} ${selectedMember.lastName} has been checked in successfully.`;
    
    // Add contextual message based on status
    if (lastCheckInfo.isFirstVisit) {
      description += " This is their first visit!";
    }
    
    toast({
      title: "Member checked in",
      description: description,
    });
    
    // Reset form
    setSelectedMember(null);
    setSearchTerm('');
  };
  
  // Get placeholder text based on search type
  const getPlaceholderText = () => {
    switch (searchType) {
      case 'name': return 'Search by member name...';
      case 'email': return 'Enter member email...';
      case 'phone': return 'Enter phone number...';
      case 'memberId': return 'Enter member ID...';
      default: return 'Search...';
    }
  };
  
  // Check if member has waiver required
  const requiresWaiver = (member: Member) => {
    // Mock logic - in a real app this would check actual waiver status
    // For demo purposes, we'll consider members with 'Special Needs' tag need waivers
    return member.tags.includes('Special Needs');
  };
  
  // Mock data for outstanding balance
  const getOutstandingBalance = (member: Member) => {
    // Mock function - in a real app this would query actual balance
    // For demo purposes, we'll use random amounts for VIP members
    if (member.membershipType === 'VIP') {
      return Math.round(Math.random() * 100);
    }
    return 0;
  };
  
  // Get mock visit count
  const getVisitCount = (member: Member) => {
    return member.checkIns.length;
  };

  // Check if it's member's birthday
  const isBirthday = (member: Member) => {
    try {
      const dob = parseISO(member.dateOfBirth);
      if (!isValid(dob)) return false;
      
      const today = new Date();
      return dob.getDate() === today.getDate() && 
             dob.getMonth() === today.getMonth();
    } catch (error) {
      return false;
    }
  };
  
  // Get status color
  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Frozen': return 'bg-blue-500';
      case 'Expired': return 'bg-red-500';
      case 'Inactive': return 'bg-orange-500';
      case 'Pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Member Check-In</CardTitle>
        <CardDescription>Search for a member to check in</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search type selection */}
        <div>
          <Label className="mb-2 block">Search by:</Label>
          <Tabs 
            defaultValue="name" 
            value={searchType} 
            onValueChange={handleSearchTypeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="name">Name</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="memberId">Member ID</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Search input */}
        <div className="space-y-2">
          <Label htmlFor="member-search">Enter search term</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              id="member-search"
              type="search"
              placeholder={getPlaceholderText()}
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Search results */}
        {showResults && (
          <div className="border rounded-md overflow-hidden max-h-64 overflow-y-auto">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                  onClick={() => handleMemberSelect(member)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.profileImage} />
                    <AvatarFallback>
                      {member.firstName[0]}{member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <div>
                    <Badge 
                      variant={member.membershipStatus === 'Active' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {member.membershipStatus}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No members found
              </div>
            )}
          </div>
        )}

        {/* Selected member details */}
        {selectedMember && (
          <div className="space-y-4">
            {/* Member header with photo */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedMember.profileImage} />
                <AvatarFallback className="text-lg">
                  {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getMembershipStatusColor(selectedMember.membershipStatus)
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    selectedMember.membershipStatus === 'Active' ? 'text-green-600' : 
                    selectedMember.membershipStatus === 'Expired' ? 'text-red-600' : 
                    'text-orange-600'
                  )}>
                    {selectedMember.membershipStatus}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Contextual alerts */}
            <div className="space-y-3">
              {/* Expired membership alert */}
              {getDaysUntilExpiry(selectedMember) < 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Membership Expired</AlertTitle>
                  <AlertDescription>
                    Membership expired {formatDistanceToNow(parseISO(selectedMember.membershipEndDate), { addSuffix: true })}.
                    Please renew before check-in.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Expiring soon alert */}
              {getDaysUntilExpiry(selectedMember) > 0 && 
                getDaysUntilExpiry(selectedMember) <= 7 && 
                selectedMember.membershipStatus === 'Active' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Membership Expiring Soon</AlertTitle>
                  <AlertDescription>
                    Membership will expire in {getDaysUntilExpiry(selectedMember)} days.
                    Consider reminding the member to renew.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Waiver required alert */}
              {requiresWaiver(selectedMember) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Waiver Required</AlertTitle>
                  <AlertDescription>
                    This member requires a special waiver. Please ensure it's signed before proceeding.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Birthday alert */}
              {isBirthday(selectedMember) && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-700">Happy Birthday!</AlertTitle>
                  <AlertDescription className="text-blue-600">
                    Today is {selectedMember.firstName}'s birthday. Consider offering a birthday promotion!
                  </AlertDescription>
                </Alert>
              )}
              
              {/* First visit alert */}
              {getLastCheckInInfo(selectedMember).isFirstVisit && (
                <Alert className="bg-green-50 border-green-200">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700">First Visit!</AlertTitle>
                  <AlertDescription className="text-green-600">
                    This is {selectedMember.firstName}'s first visit. 
                    Please provide a facility orientation and welcome package.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Outstanding balance alert */}
              {getOutstandingBalance(selectedMember) > 0 && (
                <Alert variant="destructive">
                  <DollarSign className="h-4 w-4" />
                  <AlertTitle>Payment Due</AlertTitle>
                  <AlertDescription>
                    Outstanding balance: ${getOutstandingBalance(selectedMember)}.
                    Consider collecting payment.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Membership details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Membership Type</p>
                <p className="font-medium">{selectedMember.membershipType}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className={cn(
                  "font-medium",
                  getExpiryInfo(selectedMember).className
                )}>
                  {getExpiryInfo(selectedMember).message}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Visit</p>
                <p className="font-medium">{getLastCheckInInfo(selectedMember).date}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="font-medium">{getVisitCount(selectedMember)}</p>
              </div>
            </div>
            
            {/* Member tags */}
            <div className="flex flex-wrap gap-2">
              {selectedMember.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          disabled={!selectedMember || selectedMember.membershipStatus !== 'Active'}
          onClick={handleCheckIn}
        >
          {selectedMember?.membershipStatus === 'Active' ? (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Check In Member
            </>
          ) : (
            <>
              <UserX className="mr-2 h-4 w-4" />
              {selectedMember ? 'Membership Not Active' : 'Select a Member'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
