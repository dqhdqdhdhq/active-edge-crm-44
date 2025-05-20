
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member, Trainer } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, isValid, differenceInYears, differenceInDays } from "date-fns";
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
  Edit,
  BarChart,
  Tag,
  Link,
  User,
  Clock
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMembershipStatusColor } from "@/components/members/MemberCard";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface MemberProfileDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
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

export function MemberProfileDialog({ member, open, onOpenChange, onEditClick }: MemberProfileDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!member) return null;
  
  const age = calculateAge(member.dateOfBirth);
  
  // Calculate membership duration
  const membershipStartDate = parseISO(member.membershipStartDate);
  const currentDate = new Date();
  const membershipDuration = isValid(membershipStartDate) ? 
    differenceInDays(currentDate, membershipStartDate) : 0;
  
  // Calculate days until expiry
  const expiryDate = parseISO(member.membershipEndDate);
  const daysUntilExpiry = isValid(expiryDate) ? 
    differenceInDays(expiryDate, currentDate) : 0;
  
  // Mock attendance data
  const mockAttendanceData = [
    { month: 'Jan', visits: 12 },
    { month: 'Feb', visits: 8 },
    { month: 'Mar', visits: 15 },
    { month: 'Apr', visits: 10 },
    { month: 'May', visits: 14 },
    { month: 'Jun', visits: 7 },
  ];
  
  // Mock preferred activities
  const mockPreferredActivities = [
    { activity: 'Weight Training', percentage: 45 },
    { activity: 'Cardio', percentage: 30 },
    { activity: 'Group Classes', percentage: 15 },
    { activity: 'Yoga/Pilates', percentage: 10 },
  ];
  
  // Mock communication logs
  const mockCommunications = [
    { id: 1, type: 'Email', subject: 'Membership Renewal', date: '2023-04-15T14:30:00', staff: 'Alex Rodriguez' },
    { id: 2, type: 'SMS', subject: 'Class Booking Confirmation', date: '2023-04-20T09:15:00', staff: 'System' },
    { id: 3, type: 'Call', subject: 'Membership Options', date: '2023-05-02T11:20:00', staff: 'Jessica Kim' },
  ];
  
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
            <Button variant="outline" size="sm" onClick={onEditClick}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
              
              {/* Membership Details with Enhanced Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Membership Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                      <p>{formatSafeDate(member.membershipStartDate)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Member for {Math.floor(membershipDuration / 30)} months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                      <p className={cn(
                        "font-medium",
                        daysUntilExpiry <= 0 
                          ? "text-red-500" 
                          : daysUntilExpiry <= 30
                            ? "text-orange-500"
                            : ""
                      )}>
                        {formatSafeDate(member.membershipEndDate)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {daysUntilExpiry > 0 
                          ? `${daysUntilExpiry} days remaining` 
                          : "Expired"}
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
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Visit Frequency</p>
                    <p>
                      {member.checkIns.length > 0 
                        ? `${Math.round(member.checkIns.length / (membershipDuration / 7))} visits per week (avg)` 
                        : 'No visits recorded'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Attendance Summary Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Attendance Summary</CardTitle>
                  <CardDescription>Last 6 months of gym visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAttendanceData.map(month => (
                      <div key={month.month} className="flex items-center space-x-2">
                        <div className="w-10 text-right font-medium">{month.month}</div>
                        <div className="flex-1">
                          <div className="bg-muted rounded-full h-2.5 w-full">
                            <div 
                              className="bg-primary rounded-full h-2.5" 
                              style={{ width: `${(month.visits/15)*100}%` }} 
                            />
                          </div>
                        </div>
                        <div className="w-8 text-sm">{month.visits}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Fitness Goals & Preferences Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Preferred Activities</CardTitle>
                  <CardDescription>Based on class bookings and check-ins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPreferredActivities.map(item => (
                      <div key={item.activity} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.activity}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <Progress value={item.percentage} />
                      </div>
                    ))}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
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
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Activity className="h-5 w-5 mb-1" />
                      <span>Fitness Plan</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Tag className="h-5 w-5 mb-1" />
                      <span>Add Tags</span>
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
                <Button variant="outline" size="sm">View Complete History</Button>
              </CardFooter>
            </Card>
            
            {/* Additional Activity and Progress Tracking */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Class Attendance</CardTitle>
                  <CardDescription>Recent classes attended</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No recent class attendance</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Class Schedule</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fitness Progress</CardTitle>
                  <CardDescription>Tracked metrics and goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No progress data recorded</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">Record New Measurements</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gym Preferences</CardTitle>
                  <CardDescription>Personalized settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Preferred Training Times</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="justify-center py-1.5">
                        <Clock className="mr-1 h-3.5 w-3.5" /> Morning
                      </Badge>
                      <Badge variant="secondary" className="justify-center py-1.5">
                        <Clock className="mr-1 h-3.5 w-3.5" /> Evening
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Preferred Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Free Weights</Badge>
                      <Badge variant="outline">Rowing Machine</Badge>
                      <Badge variant="outline">Treadmill</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Class Preferences</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Yoga</Badge>
                      <Badge variant="outline">HIIT</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full">Update Preferences</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fitness Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Weight Loss</h4>
                      <span className="text-sm text-muted-foreground">Primary Goal</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <p className="text-sm text-muted-foreground">Currently at 35% of target</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Muscle Gain</h4>
                      <span className="text-sm text-muted-foreground">Secondary Goal</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    <p className="text-sm text-muted-foreground">Currently at 20% of target</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full">Update Goals</Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Personal Trainer Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Trainer" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Primary Trainer</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">Change</Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Training Style Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">High Intensity</Badge>
                    <Badge variant="outline">Personalized</Badge>
                    <Badge variant="outline">Goal Oriented</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Session Frequency</h4>
                  <p>2 sessions per week</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Communication Log</CardTitle>
                    <CardDescription>
                      Record of all communications with this member
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Log Communication
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {mockCommunications.length > 0 ? (
                  <div className="space-y-4">
                    {mockCommunications.map((comm) => (
                      <div key={comm.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">{comm.subject}</div>
                          <Badge variant="outline">{comm.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex justify-between">
                          <span>Staff: {comm.staff}</span>
                          <span>{formatSafeDate(comm.date, "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No communication records found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Member
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
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive emails about promotions, events, and updates</p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">Subscribed</Badge>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive text messages for booking confirmations and reminders</p>
                  </div>
                  <Badge variant="outline" className="bg-red-500/10 text-red-500">Not Subscribed</Badge>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Preferred Contact Method</h4>
                    <p className="text-sm text-muted-foreground">Primary way to contact this member</p>
                  </div>
                  <span className="font-medium">Email</span>
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
                        <p className="font-medium">Membership Agreement</p>
                        <p className="text-sm text-muted-foreground">Signed on {formatSafeDate(member.membershipStartDate)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">Liability Waiver</p>
                        <p className="text-sm text-muted-foreground">Signed on {formatSafeDate(member.membershipStartDate)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">Health Questionnaire</p>
                        <p className="text-sm text-muted-foreground">Completed on {formatSafeDate(member.membershipStartDate)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Linked Profiles</CardTitle>
                <CardDescription>Family members or related accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jane Doe</p>
                      <p className="text-sm text-muted-foreground">Family Member</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Link className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Link Another Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
