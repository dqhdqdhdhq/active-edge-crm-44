
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Guest, Member } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, isValid, differenceInDays, differenceInMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  History, 
  MessageSquare, 
  UserPlus, 
  Edit,
  Clock,
  User
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getGuestStatusColor, getVisitPurposeColor } from "./GuestCard";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { members } from "@/data/mockData";

interface GuestProfileDialogProps {
  guest: Guest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
  onConvertToMember?: () => void;
}

const formatSafeDate = (dateString: string | undefined, formatString: string = 'MMM d, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

export function GuestProfileDialog({ 
  guest, 
  open, 
  onOpenChange, 
  onEditClick,
  onConvertToMember 
}: GuestProfileDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!guest) return null;
  
  // Calculate visit duration
  const getVisitDuration = (checkInDateTime: string, checkOutDateTime?: string) => {
    if (!checkOutDateTime) return 'Ongoing';
    
    try {
      const checkIn = parseISO(checkInDateTime);
      const checkOut = parseISO(checkOutDateTime);
      
      if (!isValid(checkIn) || !isValid(checkOut)) return 'Unknown';
      
      const diffInMinutes = differenceInMinutes(checkOut, checkIn);
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    } catch (error) {
      return 'Unknown';
    }
  };
  
  // Get related member if exists
  const relatedMember = guest.relatedMemberId 
    ? members.find(m => m.id === guest.relatedMemberId) 
    : undefined;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarFallback>{guest.firstName[0]}{guest.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold mb-1">{guest.firstName} {guest.lastName}</DialogTitle>
                <div className="flex gap-2">
                  <Badge 
                    variant={guest.status === 'Checked In' ? 'default' : 'outline'}
                    className={cn(
                      guest.status === 'Checked In' ? 'bg-green-500' : '',
                      guest.status === 'Checked Out' ? 'text-blue-500 border-blue-500' : '',
                      guest.status === 'Scheduled' ? 'text-orange-500 border-orange-500' : ''
                    )}
                  >
                    {guest.status}
                  </Badge>
                  <Badge className={getVisitPurposeColor(guest.visitPurpose)}>
                    {guest.visitPurpose}
                  </Badge>
                  {guest.convertedToMember && (
                    <Badge variant="secondary">
                      Converted to Member
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {onConvertToMember && (
                <Button variant="default" size="sm" onClick={onConvertToMember}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Convert to Member
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Guest
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Visit History</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Guest ID</p>
                      <p>{guest.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                      <p>{guest.visitPurpose}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </p>
                    <p>{guest.email || 'No email provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </p>
                    <p>{guest.phone || 'No phone provided'}</p>
                  </div>

                  {guest.referralSource && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Referral Source</p>
                      <p>{guest.referralSource}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marketing Consent</p>
                    <p>{guest.marketingConsent ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Visit Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Visit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Check-in Date</p>
                      <p>{formatSafeDate(guest.checkInDateTime, 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Check-in Time</p>
                      <p>{formatSafeDate(guest.checkInDateTime, 'h:mm a')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Check-out Time</p>
                      <p>{guest.checkOutDateTime ? 
                          formatSafeDate(guest.checkOutDateTime, 'h:mm a') : 
                          'Not checked out yet'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Visit Duration</p>
                      <p>{getVisitDuration(guest.checkInDateTime, guest.checkOutDateTime)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/40 p-2 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <p className="font-medium">Status</p>
                        <p className="text-muted-foreground text-xs">{guest.status}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "font-medium",
                          getGuestStatusColor(guest.status)
                        )}
                      >
                        {guest.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Waiver Signed</p>
                    <p className={guest.waiverSigned ? "text-green-500" : "text-red-500"}>
                      {guest.waiverSigned ? 'Yes' : 'No'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Related Member Card (if applicable) */}
              {relatedMember && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Related Member</CardTitle>
                    <CardDescription>Member who invited this guest</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={relatedMember.profileImage} />
                        <AvatarFallback>
                          {relatedMember.firstName[0]}{relatedMember.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{relatedMember.firstName} {relatedMember.lastName}</p>
                        <p className="text-sm text-muted-foreground">{relatedMember.membershipType} Membership</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      View Member Profile
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Notes */}
              <Card className={relatedMember ? "md:col-span-1" : "md:col-span-2"}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Notes</CardTitle>
                  <Button variant="outline" size="sm">
                    Add Note
                  </Button>
                </CardHeader>
                <CardContent>
                  {guest.notes ? (
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="whitespace-pre-line">{guest.notes}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No notes have been added for this guest yet.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Clock className="h-5 w-5 mb-1" />
                      <span>Check Out</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Calendar className="h-5 w-5 mb-1" />
                      <span>Schedule Visit</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span>Send Message</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <FileText className="h-5 w-5 mb-1" />
                      <span>Sign Waiver</span>
                    </Button>
                    <Button variant="default" className="h-auto py-4 flex flex-col">
                      <UserPlus className="h-5 w-5 mb-1" />
                      <span>Convert to Member</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Visit History</CardTitle>
                <CardDescription>
                  Previous and current visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {guest.visitHistory.length > 0 ? (
                  <div className="space-y-4">
                    {guest.visitHistory.map((visit, index) => (
                      <div key={visit.id} className="flex justify-between border-b pb-4 last:border-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{formatSafeDate(visit.checkInDateTime, 'MMM d, yyyy')}</p>
                            <Badge className={getVisitPurposeColor(visit.visitPurpose)}>
                              {visit.visitPurpose}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatSafeDate(visit.checkInDateTime, 'h:mm a')} - 
                            {visit.checkOutDateTime ? 
                              ` ${formatSafeDate(visit.checkOutDateTime, 'h:mm a')}` : 
                              ' Not checked out'}
                          </p>
                          {visit.notes && (
                            <p className="text-sm mt-1">{visit.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {getVisitDuration(visit.checkInDateTime, visit.checkOutDateTime)}
                          </p>
                          {visit.staffId && (
                            <p className="text-xs text-muted-foreground">
                              Staff: {visit.staffId}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No visit history available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">Add Visit Record</Button>
              </CardFooter>
            </Card>
            
            {/* Visit Analytics */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visit Analytics</CardTitle>
                  <CardDescription>Patterns and statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">Total Visits</p>
                      <p className="text-sm">{guest.visitHistory.length}</p>
                    </div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">Average Duration</p>
                      <p className="text-sm">1h 25m</p>
                    </div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">Most Common Purpose</p>
                      <p className="text-sm">{guest.visitPurpose}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Conversion Probability</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Based on visit patterns</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Areas of Interest</CardTitle>
                  <CardDescription>Based on visit history and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Cardio Area</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Weight Training</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Group Classes</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Communication Log</CardTitle>
                    <CardDescription>
                      Record of all communications with this guest
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Log Communication
                  </Button>
                </div>
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
                  <Phone className="mr-2 h-4 w-4" />
                  Call Guest
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Communications</h4>
                    <p className="text-sm text-muted-foreground">Receive emails about promotions, events, and updates</p>
                  </div>
                  <Badge variant="outline" className={
                    guest.marketingConsent 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-red-500/10 text-red-500"
                  }>
                    {guest.marketingConsent ? 'Consented' : 'No Consent'}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Preferred Contact Method</h4>
                    <p className="text-sm text-muted-foreground">Primary way to contact this guest</p>
                  </div>
                  <span className="font-medium">{guest.email ? 'Email' : 'Phone'}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Update Communication Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Documents & Waivers</CardTitle>
                    <CardDescription>
                      Signed documents and liability waivers
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">Liability Waiver</p>
                        <p className="text-sm text-muted-foreground">
                          Signed on {formatSafeDate(guest.checkInDateTime)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  
                  {guest.visitPurpose === 'Trial' && (
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-medium">Trial Membership Agreement</p>
                          <p className="text-sm text-muted-foreground">
                            Signed on {formatSafeDate(guest.checkInDateTime)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
