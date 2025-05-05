
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member, Trainer } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, isValid, differenceInYears } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  History, 
  MessageSquare, 
  UserPlus, 
  Activity, 
  CreditCard,
  Edit
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMembershipStatusColor } from "@/components/members/MemberCard";
import { cn } from "@/lib/utils";

interface MemberProfileDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatSafeDate = (dateString: string, formatString: string = 'MMM d, yyyy') => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

const calculateAge = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    return differenceInYears(new Date(), date);
  } catch (error) {
    return null;
  }
};

export function MemberProfileDialog({ member, open, onOpenChange }: MemberProfileDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!member) return null;
  
  const age = calculateAge(member.dateOfBirth);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} />
                <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold mb-1">{member.firstName} {member.lastName}</DialogTitle>
                <div className="flex gap-2">
                  <Badge 
                    variant={member.membershipStatus === 'Active' ? 'default' : 'outline'}
                    className={cn(
                      member.membershipStatus === 'Active' ? 'bg-green-500' : '',
                      member.membershipStatus === 'Expired' ? 'text-red-500 border-red-500' : '',
                      member.membershipStatus === 'Frozen' ? 'text-blue-500 border-blue-500' : ''
                    )}
                  >
                    {member.membershipStatus}
                  </Badge>
                  <Badge variant="outline">{member.membershipType}</Badge>
                  {member.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member ID</p>
                      <p>{member.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p>{formatSafeDate(member.dateOfBirth)} {age !== null && `(${age} years)`}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </p>
                    <p>{member.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </p>
                    <p>{member.phone}</p>
                  </div>

                  {member.emergencyContact && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                      <div className="bg-muted/50 p-2 rounded-md text-sm">
                        <p><span className="font-medium">{member.emergencyContact.name}</span> ({member.emergencyContact.relationship})</p>
                        <p>{member.emergencyContact.phone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Membership Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Membership Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                      <p>{formatSafeDate(member.membershipStartDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                      <p className={cn(
                        "font-medium",
                        differenceInYears(parseISO(member.membershipEndDate), new Date()) <= 0 
                          ? "text-red-500" 
                          : differenceInYears(parseISO(member.membershipEndDate), new Date()) <= 30
                            ? "text-orange-500"
                            : ""
                      )}>
                        {formatSafeDate(member.membershipEndDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/40 p-2 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <p className="font-medium">{member.membershipType}</p>
                        <p className="text-muted-foreground text-xs">Membership Type</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "font-medium",
                          getMembershipStatusColor(member.membershipStatus)
                        )}
                      >
                        {member.membershipStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Check-in</p>
                    <p>
                      {member.checkIns.length > 0 
                        ? formatSafeDate(member.checkIns[0].dateTime, 'MMM d, yyyy h:mm a') 
                        : 'No check-ins recorded'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Notes */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Notes</CardTitle>
                  <Button variant="outline" size="sm">
                    Add Note
                  </Button>
                </CardHeader>
                <CardContent>
                  {member.notes ? (
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="whitespace-pre-line">{member.notes}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No notes have been added for this member yet.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Calendar className="h-5 w-5 mb-1" />
                      <span>Book Class</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span>Message</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <UserPlus className="h-5 w-5 mb-1" />
                      <span>Assign Trainer</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <CreditCard className="h-5 w-5 mb-1" />
                      <span>Billing</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Check-in History</CardTitle>
                <CardDescription>
                  Recent facility and class check-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {member.checkIns.length > 0 ? (
                  <div className="space-y-4">
                    {member.checkIns.map((checkIn, index) => (
                      <div key={checkIn.id} className="flex justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{formatSafeDate(checkIn.dateTime, 'MMM d, yyyy')}</p>
                          <p className="text-sm text-muted-foreground">{formatSafeDate(checkIn.dateTime, 'h:mm a')}</p>
                        </div>
                        <Badge variant="outline">Facility Check-in</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No check-in history available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">View All History</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <CardTitle>Communication Log</CardTitle>
                <CardDescription>
                  Record of all communications with this member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>No communication records found</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Log Communication
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Waivers</CardTitle>
                <CardDescription>
                  Signed documents and liability waivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>No documents uploaded yet</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  Upload Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
