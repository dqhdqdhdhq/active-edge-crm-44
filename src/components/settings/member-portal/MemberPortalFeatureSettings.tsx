
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberPortalConfig } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MemberPortalFeatureSettingsProps {
  config: MemberPortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<MemberPortalConfig>>;
  onSave: () => void;
  isSaving: boolean;
}

export function MemberPortalFeatureSettings({ 
  config, 
  setConfig, 
  onSave, 
  isSaving 
}: MemberPortalFeatureSettingsProps) {
  const handleProfileToggle = (field: keyof MemberPortalConfig['features']['profile'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        profile: {
          ...prev.features.profile,
          [field]: value
        }
      }
    }));
  };

  const handleBookingsToggle = (field: keyof MemberPortalConfig['features']['bookings'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        bookings: {
          ...prev.features.bookings,
          [field]: value
        }
      }
    }));
  };

  const handleBookingsInput = (field: 'bookingWindow' | 'cancellationWindow', value: string) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        bookings: {
          ...prev.features.bookings,
          [field]: parseInt(value) || 0
        }
      }
    }));
  };

  const handlePurchasesToggle = (field: keyof MemberPortalConfig['features']['purchases'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        purchases: {
          ...prev.features.purchases,
          [field]: value
        }
      }
    }));
  };

  const handleEngagementToggle = (field: keyof MemberPortalConfig['features']['engagement'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        engagement: {
          ...prev.features.engagement,
          [field]: value
        }
      }
    }));
  };

  // Dummy data for selects
  const availableMembershipTypes = ["Basic", "Standard", "Premium", "Family", "Corporate", "Student"];
  const availablePackages = ["Personal Training (10 sessions)", "Massage (5 sessions)", "Nutrition Consult (3 sessions)"];
  const availableProductCategories = ["Supplements", "Apparel", "Equipment", "Accessories"];
  const availableStaffMembers = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"];
  const availableAppointmentTypes = ["Personal Training", "Nutrition Consult", "Fitness Assessment", "Massage Therapy"];

  const addItem = (field: string, item: string) => {
    switch(field) {
      case 'availableMembershipTypes':
        if (!config.features.purchases.availableMembershipTypes.includes(item)) {
          setConfig(prev => ({
            ...prev,
            features: {
              ...prev.features,
              purchases: {
                ...prev.features.purchases,
                availableMembershipTypes: [...prev.features.purchases.availableMembershipTypes, item]
              }
            }
          }));
        }
        break;
      case 'availablePackages':
        if (!config.features.purchases.availablePackages.includes(item)) {
          setConfig(prev => ({
            ...prev,
            features: {
              ...prev.features,
              purchases: {
                ...prev.features.purchases,
                availablePackages: [...prev.features.purchases.availablePackages, item]
              }
            }
          }));
        }
        break;
      case 'availableProductCategories':
        if (!config.features.purchases.availableProductCategories.includes(item)) {
          setConfig(prev => ({
            ...prev,
            features: {
              ...prev.features,
              purchases: {
                ...prev.features.purchases,
                availableProductCategories: [...prev.features.purchases.availableProductCategories, item]
              }
            }
          }));
        }
        break;
      case 'bookableAppointmentTypes':
        if (!config.features.bookings.bookableAppointmentTypes.includes(item)) {
          setConfig(prev => ({
            ...prev,
            features: {
              ...prev.features,
              bookings: {
                ...prev.features.bookings,
                bookableAppointmentTypes: [...prev.features.bookings.bookableAppointmentTypes, item]
              }
            }
          }));
        }
        break;
      case 'bookableStaffMembers':
        if (!config.features.bookings.bookableStaffMembers.includes(item)) {
          setConfig(prev => ({
            ...prev,
            features: {
              ...prev.features,
              bookings: {
                ...prev.features.bookings,
                bookableStaffMembers: [...prev.features.bookings.bookableStaffMembers, item]
              }
            }
          }));
        }
        break;
    }
  };

  const removeItem = (field: string, item: string) => {
    switch(field) {
      case 'availableMembershipTypes':
        setConfig(prev => ({
          ...prev,
          features: {
            ...prev.features,
            purchases: {
              ...prev.features.purchases,
              availableMembershipTypes: prev.features.purchases.availableMembershipTypes.filter(t => t !== item)
            }
          }
        }));
        break;
      case 'availablePackages':
        setConfig(prev => ({
          ...prev,
          features: {
            ...prev.features,
            purchases: {
              ...prev.features.purchases,
              availablePackages: prev.features.purchases.availablePackages.filter(p => p !== item)
            }
          }
        }));
        break;
      case 'availableProductCategories':
        setConfig(prev => ({
          ...prev,
          features: {
            ...prev.features,
            purchases: {
              ...prev.features.purchases,
              availableProductCategories: prev.features.purchases.availableProductCategories.filter(c => c !== item)
            }
          }
        }));
        break;
      case 'bookableAppointmentTypes':
        setConfig(prev => ({
          ...prev,
          features: {
            ...prev.features,
            bookings: {
              ...prev.features.bookings,
              bookableAppointmentTypes: prev.features.bookings.bookableAppointmentTypes.filter(t => t !== item)
            }
          }
        }));
        break;
      case 'bookableStaffMembers':
        setConfig(prev => ({
          ...prev,
          features: {
            ...prev.features,
            bookings: {
              ...prev.features.bookings,
              bookableStaffMembers: prev.features.bookings.bookableStaffMembers.filter(s => s !== item)
            }
          }
        }));
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Configuration</CardTitle>
        <CardDescription>
          Enable or disable features in the member portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {/* Profile & Account Management Section */}
          <AccordionItem value="profile">
            <AccordionTrigger className="text-lg font-medium">
              Profile & Account Management
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-profile">View Profile</Label>
                  <Switch
                    id="view-profile"
                    checked={config.features.profile.viewProfile}
                    onCheckedChange={(checked) => handleProfileToggle("viewProfile", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="edit-contact">Edit Contact Details</Label>
                  <Switch
                    id="edit-contact"
                    checked={config.features.profile.editContactDetails}
                    onCheckedChange={(checked) => handleProfileToggle("editContactDetails", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="edit-emergency">Edit Emergency Contact</Label>
                  <Switch
                    id="edit-emergency"
                    checked={config.features.profile.editEmergencyContact}
                    onCheckedChange={(checked) => handleProfileToggle("editEmergencyContact", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="upload-photo">Upload Profile Picture</Label>
                  <Switch
                    id="upload-photo"
                    checked={config.features.profile.uploadProfilePicture}
                    onCheckedChange={(checked) => handleProfileToggle("uploadProfilePicture", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="comm-prefs">Update Communication Preferences</Label>
                  <Switch
                    id="comm-prefs"
                    checked={config.features.profile.updateCommunicationPreferences}
                    onCheckedChange={(checked) => handleProfileToggle("updateCommunicationPreferences", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="change-password">Change Password</Label>
                  <Switch
                    id="change-password"
                    checked={config.features.profile.changePassword}
                    onCheckedChange={(checked) => handleProfileToggle("changePassword", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-membership">View Membership Details</Label>
                  <Switch
                    id="view-membership"
                    checked={config.features.profile.viewMembershipDetails}
                    onCheckedChange={(checked) => handleProfileToggle("viewMembershipDetails", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-contract">View Contract Documents</Label>
                  <Switch
                    id="view-contract"
                    checked={config.features.profile.viewContractDocuments}
                    onCheckedChange={(checked) => handleProfileToggle("viewContractDocuments", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-payment">View Payment Methods</Label>
                  <Switch
                    id="view-payment"
                    checked={config.features.profile.viewPaymentMethods}
                    onCheckedChange={(checked) => handleProfileToggle("viewPaymentMethods", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="update-payment">Update Payment Methods</Label>
                  <Switch
                    id="update-payment"
                    checked={config.features.profile.updatePaymentMethods}
                    onCheckedChange={(checked) => handleProfileToggle("updatePaymentMethods", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-billing">View Billing History</Label>
                  <Switch
                    id="view-billing"
                    checked={config.features.profile.viewBillingHistory}
                    onCheckedChange={(checked) => handleProfileToggle("viewBillingHistory", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="download-invoices">Download Invoices</Label>
                  <Switch
                    id="download-invoices"
                    checked={config.features.profile.downloadInvoices}
                    onCheckedChange={(checked) => handleProfileToggle("downloadInvoices", checked)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Bookings & Scheduling Section */}
          <AccordionItem value="bookings">
            <AccordionTrigger className="text-lg font-medium">
              Bookings & Scheduling
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <Label htmlFor="enable-class-booking" className="block mb-1">Enable Class Booking</Label>
                    <p className="text-sm text-muted-foreground">Allow members to book classes online</p>
                  </div>
                  <Switch
                    id="enable-class-booking"
                    checked={config.features.bookings.enableClassBooking}
                    onCheckedChange={(checked) => handleBookingsToggle("enableClassBooking", checked)}
                  />
                </div>
                
                {config.features.bookings.enableClassBooking && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2">
                    <div className="space-y-2">
                      <Label htmlFor="booking-window">Booking Window (days)</Label>
                      <Input
                        id="booking-window"
                        type="number"
                        min="1"
                        max="60"
                        value={config.features.bookings.bookingWindow}
                        onChange={(e) => handleBookingsInput("bookingWindow", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        How many days in advance members can book classes
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cancellation-window">Cancellation Window (hours)</Label>
                      <Input
                        id="cancellation-window"
                        type="number"
                        min="0"
                        max="72"
                        value={config.features.bookings.cancellationWindow}
                        onChange={(e) => handleBookingsInput("cancellationWindow", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        How many hours before a class members can cancel without penalty
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="show-class-desc">Show Class Description</Label>
                      <Switch
                        id="show-class-desc"
                        checked={config.features.bookings.showClassDescription}
                        onCheckedChange={(checked) => handleBookingsToggle("showClassDescription", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="show-trainer-info">Show Trainer Info</Label>
                      <Switch
                        id="show-trainer-info"
                        checked={config.features.bookings.showTrainerInfo}
                        onCheckedChange={(checked) => handleBookingsToggle("showTrainerInfo", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="show-spots">Show Remaining Spots</Label>
                      <Switch
                        id="show-spots"
                        checked={config.features.bookings.showRemainingSpots}
                        onCheckedChange={(checked) => handleBookingsToggle("showRemainingSpots", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="enable-waitlist">Enable Waitlist</Label>
                      <Switch
                        id="enable-waitlist"
                        checked={config.features.bookings.enableWaitlist}
                        onCheckedChange={(checked) => handleBookingsToggle("enableWaitlist", checked)}
                      />
                    </div>
                    
                    {config.features.bookings.enableWaitlist && (
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <Label htmlFor="show-position">Show Waitlist Position</Label>
                        <Switch
                          id="show-position"
                          checked={config.features.bookings.showWaitlistPosition}
                          onCheckedChange={(checked) => handleBookingsToggle("showWaitlistPosition", checked)}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 border rounded-md mt-6">
                  <div>
                    <Label htmlFor="enable-appointment-booking" className="block mb-1">Enable Appointment Booking</Label>
                    <p className="text-sm text-muted-foreground">Allow members to book appointments with staff</p>
                  </div>
                  <Switch
                    id="enable-appointment-booking"
                    checked={config.features.bookings.enableAppointmentBooking}
                    onCheckedChange={(checked) => handleBookingsToggle("enableAppointmentBooking", checked)}
                  />
                </div>
                
                {config.features.bookings.enableAppointmentBooking && (
                  <div className="space-y-4 pl-4 border-l-2">
                    <div className="space-y-2">
                      <Label>Bookable Appointment Types</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {config.features.bookings.bookableAppointmentTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="px-2 py-1">
                            {type}
                            <X 
                              className="ml-1 h-3 w-3 cursor-pointer" 
                              onClick={() => removeItem('bookableAppointmentTypes', type)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={(value) => addItem('bookableAppointmentTypes', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment types" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAppointmentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Bookable Staff Members</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {config.features.bookings.bookableStaffMembers.map((member) => (
                          <Badge key={member} variant="secondary" className="px-2 py-1">
                            {member}
                            <X 
                              className="ml-1 h-3 w-3 cursor-pointer" 
                              onClick={() => removeItem('bookableStaffMembers', member)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={(value) => addItem('bookableStaffMembers', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff members" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStaffMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-schedule">View My Schedule</Label>
                  <Switch
                    id="view-schedule"
                    checked={config.features.bookings.viewSchedule}
                    onCheckedChange={(checked) => handleBookingsToggle("viewSchedule", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-attendance">View Attendance History</Label>
                  <Switch
                    id="view-attendance"
                    checked={config.features.bookings.viewAttendanceHistory}
                    onCheckedChange={(checked) => handleBookingsToggle("viewAttendanceHistory", checked)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Purchases & Retail Section */}
          <AccordionItem value="purchases">
            <AccordionTrigger className="text-lg font-medium">
              Purchases & Retail
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <Label htmlFor="enable-membership-purchase" className="block mb-1">Enable Membership Purchase</Label>
                    <p className="text-sm text-muted-foreground">Allow members to purchase or renew memberships online</p>
                  </div>
                  <Switch
                    id="enable-membership-purchase"
                    checked={config.features.purchases.enableMembershipPurchase}
                    onCheckedChange={(checked) => handlePurchasesToggle("enableMembershipPurchase", checked)}
                  />
                </div>
                
                {config.features.purchases.enableMembershipPurchase && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <Label>Available Membership Types</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {config.features.purchases.availableMembershipTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="px-2 py-1">
                          {type}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem('availableMembershipTypes', type)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <Select onValueChange={(value) => addItem('availableMembershipTypes', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select membership types" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMembershipTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 border rounded-md mt-6">
                  <div>
                    <Label htmlFor="enable-package-purchase" className="block mb-1">Enable Package Purchase</Label>
                    <p className="text-sm text-muted-foreground">Allow members to purchase session packages</p>
                  </div>
                  <Switch
                    id="enable-package-purchase"
                    checked={config.features.purchases.enablePackagePurchase}
                    onCheckedChange={(checked) => handlePurchasesToggle("enablePackagePurchase", checked)}
                  />
                </div>
                
                {config.features.purchases.enablePackagePurchase && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <Label>Available Packages</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {config.features.purchases.availablePackages.map((pkg) => (
                        <Badge key={pkg} variant="secondary" className="px-2 py-1">
                          {pkg}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem('availablePackages', pkg)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <Select onValueChange={(value) => addItem('availablePackages', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select packages" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePackages.map((pkg) => (
                          <SelectItem key={pkg} value={pkg}>
                            {pkg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 border rounded-md mt-6">
                  <div>
                    <Label htmlFor="enable-retail-purchase" className="block mb-1">Enable Retail Purchase</Label>
                    <p className="text-sm text-muted-foreground">Allow members to purchase retail items online</p>
                  </div>
                  <Switch
                    id="enable-retail-purchase"
                    checked={config.features.purchases.enableRetailPurchase}
                    onCheckedChange={(checked) => handlePurchasesToggle("enableRetailPurchase", checked)}
                  />
                </div>
                
                {config.features.purchases.enableRetailPurchase && (
                  <div className="space-y-2 pl-4 border-l-2">
                    <Label>Available Product Categories</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {config.features.purchases.availableProductCategories.map((category) => (
                        <Badge key={category} variant="secondary" className="px-2 py-1">
                          {category}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem('availableProductCategories', category)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <Select onValueChange={(value) => addItem('availableProductCategories', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProductCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Engagement & Community Section */}
          <AccordionItem value="engagement">
            <AccordionTrigger className="text-lg font-medium">
              Engagement & Community
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-challenges">View Challenges & Events</Label>
                  <Switch
                    id="view-challenges"
                    checked={config.features.engagement.viewChallenges}
                    onCheckedChange={(checked) => handleEngagementToggle("viewChallenges", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="register-challenges">Register for Challenges</Label>
                  <Switch
                    id="register-challenges"
                    checked={config.features.engagement.registerForChallenges}
                    onCheckedChange={(checked) => handleEngagementToggle("registerForChallenges", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="view-leaderboards">View Leaderboards</Label>
                  <Switch
                    id="view-leaderboards"
                    checked={config.features.engagement.viewLeaderboards}
                    onCheckedChange={(checked) => handleEngagementToggle("viewLeaderboards", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="log-progress">Log Challenge Progress</Label>
                  <Switch
                    id="log-progress"
                    checked={config.features.engagement.logChallengeProgress}
                    onCheckedChange={(checked) => handleEngagementToggle("logChallengeProgress", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="access-workout-library">Access Workout Library</Label>
                  <Switch
                    id="access-workout-library"
                    checked={config.features.engagement.accessWorkoutLibrary}
                    onCheckedChange={(checked) => handleEngagementToggle("accessWorkoutLibrary", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="enable-referral">Enable Referral Program</Label>
                  <Switch
                    id="enable-referral"
                    checked={config.features.engagement.enableReferralProgram}
                    onCheckedChange={(checked) => handleEngagementToggle("enableReferralProgram", checked)}
                  />
                </div>
                
                {config.features.engagement.enableReferralProgram && (
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="submit-referrals">Submit Referrals</Label>
                    <Switch
                      id="submit-referrals"
                      checked={config.features.engagement.submitReferrals}
                      onCheckedChange={(checked) => handleEngagementToggle("submitReferrals", checked)}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-6">
          <Button onClick={onSave} disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? "Saving..." : "Save Feature Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
