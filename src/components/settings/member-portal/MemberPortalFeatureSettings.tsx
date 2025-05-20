
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberPortalConfig } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { 
  UserCircle, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Trophy, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState<{
    profile: boolean;
    bookings: boolean;
    purchases: boolean;
    engagement: boolean;
  }>({
    profile: true,
    bookings: false,
    purchases: false,
    engagement: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleProfileFeatureToggle = (feature: keyof MemberPortalConfig['features']['profile'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        profile: {
          ...prev.features.profile,
          [feature]: value
        }
      }
    }));
  };

  const handleBookingFeatureToggle = (feature: keyof MemberPortalConfig['features']['bookings'], value: boolean | number) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        bookings: {
          ...prev.features.bookings,
          [feature]: value
        }
      }
    }));
  };

  const handlePurchaseFeatureToggle = (feature: keyof MemberPortalConfig['features']['purchases'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        purchases: {
          ...prev.features.purchases,
          [feature]: value
        }
      }
    }));
  };

  const handleEngagementFeatureToggle = (feature: keyof MemberPortalConfig['features']['engagement'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        engagement: {
          ...prev.features.engagement,
          [feature]: value
        }
      }
    }));
  };

  const getChevron = (isExpanded: boolean) => {
    return isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Profile & Account Management */}
      <Card>
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => toggleSection('profile')}
        >
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Profile & Account Management</CardTitle>
              <CardDescription>
                Configure what members can view and edit in their profile
              </CardDescription>
            </div>
          </div>
          {getChevron(expandedSections.profile)}
        </CardHeader>
        
        {expandedSections.profile && (
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Profile Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view their stored profile information
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.viewProfile}
                    onCheckedChange={(value) => handleProfileFeatureToggle('viewProfile', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Edit Contact Details</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to update their phone, email, and address
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.editContactDetails}
                    onCheckedChange={(value) => handleProfileFeatureToggle('editContactDetails', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Edit Emergency Contact</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to update their emergency contact information
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.editEmergencyContact}
                    onCheckedChange={(value) => handleProfileFeatureToggle('editEmergencyContact', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Upload Profile Picture</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to upload or change their profile picture
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.uploadProfilePicture}
                    onCheckedChange={(value) => handleProfileFeatureToggle('uploadProfilePicture', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Update Communication Preferences</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to opt in/out of newsletters and other communications
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.updateCommunicationPreferences}
                    onCheckedChange={(value) => handleProfileFeatureToggle('updateCommunicationPreferences', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Change Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to change their portal password
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.changePassword}
                    onCheckedChange={(value) => handleProfileFeatureToggle('changePassword', value)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Membership & Billing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Membership Details</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view their membership type, status, and dates
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.viewMembershipDetails}
                    onCheckedChange={(value) => handleProfileFeatureToggle('viewMembershipDetails', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Contract Documents</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view their membership agreement/contract
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.viewContractDocuments}
                    onCheckedChange={(value) => handleProfileFeatureToggle('viewContractDocuments', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Payment Methods</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view their stored payment methods
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.viewPaymentMethods}
                    onCheckedChange={(value) => handleProfileFeatureToggle('viewPaymentMethods', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Update Payment Methods</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to add or update their payment methods
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.updatePaymentMethods}
                    onCheckedChange={(value) => handleProfileFeatureToggle('updatePaymentMethods', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Billing History</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view their past invoices and payments
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.viewBillingHistory}
                    onCheckedChange={(value) => handleProfileFeatureToggle('viewBillingHistory', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Download Invoices</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to download PDF copies of their invoices
                    </p>
                  </div>
                  <Switch
                    checked={config.features.profile.downloadInvoices}
                    onCheckedChange={(value) => handleProfileFeatureToggle('downloadInvoices', value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Profile Settings"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Bookings & Scheduling */}
      <Card>
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => toggleSection('bookings')}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Bookings & Scheduling</CardTitle>
              <CardDescription>
                Configure class and appointment booking options
              </CardDescription>
            </div>
          </div>
          {getChevron(expandedSections.bookings)}
        </CardHeader>
        
        {expandedSections.bookings && (
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Class Booking</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Class Booking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to book classes online
                    </p>
                  </div>
                  <Switch
                    checked={config.features.bookings.enableClassBooking}
                    onCheckedChange={(value) => handleBookingFeatureToggle('enableClassBooking', value)}
                  />
                </div>
                
                {config.features.bookings.enableClassBooking && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="booking-window">Booking Window (days)</Label>
                        <div className="flex">
                          <Input
                            id="booking-window"
                            type="number"
                            min={1}
                            max={90}
                            value={config.features.bookings.bookingWindow}
                            onChange={(e) => handleBookingFeatureToggle('bookingWindow', parseInt(e.target.value) || 7)}
                          />
                          <div className="ml-2 flex items-center text-sm text-muted-foreground">
                            days in advance
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          How far in advance members can book classes
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cancellation-window">Cancellation Window (hours)</Label>
                        <div className="flex">
                          <Input
                            id="cancellation-window"
                            type="number"
                            min={0}
                            max={48}
                            value={config.features.bookings.cancellationWindow}
                            onChange={(e) => handleBookingFeatureToggle('cancellationWindow', parseInt(e.target.value) || 2)}
                          />
                          <div className="ml-2 flex items-center text-sm text-muted-foreground">
                            hours before
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          How close to class start time members can cancel
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Class Description</Label>
                        <p className="text-sm text-muted-foreground">
                          Display detailed descriptions of classes in the booking interface
                        </p>
                      </div>
                      <Switch
                        checked={config.features.bookings.showClassDescription}
                        onCheckedChange={(value) => handleBookingFeatureToggle('showClassDescription', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Trainer Information</Label>
                        <p className="text-sm text-muted-foreground">
                          Display trainer details for each class
                        </p>
                      </div>
                      <Switch
                        checked={config.features.bookings.showTrainerInfo}
                        onCheckedChange={(value) => handleBookingFeatureToggle('showTrainerInfo', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Remaining Spots</Label>
                        <p className="text-sm text-muted-foreground">
                          Display how many spots are left in each class
                        </p>
                      </div>
                      <Switch
                        checked={config.features.bookings.showRemainingSpots}
                        onCheckedChange={(value) => handleBookingFeatureToggle('showRemainingSpots', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Waitlist</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow members to join waitlists for full classes
                        </p>
                      </div>
                      <Switch
                        checked={config.features.bookings.enableWaitlist}
                        onCheckedChange={(value) => handleBookingFeatureToggle('enableWaitlist', value)}
                      />
                    </div>
                    
                    {config.features.bookings.enableWaitlist && (
                      <div className="flex items-center justify-between pl-6">
                        <div className="space-y-0.5">
                          <Label className="text-base">Show Waitlist Position</Label>
                          <p className="text-sm text-muted-foreground">
                            Show members their position on the waitlist
                          </p>
                        </div>
                        <Switch
                          checked={config.features.bookings.showWaitlistPosition}
                          onCheckedChange={(value) => handleBookingFeatureToggle('showWaitlistPosition', value)}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Appointment Booking</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Appointment Booking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to book appointments with trainers and staff
                    </p>
                  </div>
                  <Switch
                    checked={config.features.bookings.enableAppointmentBooking}
                    onCheckedChange={(value) => handleBookingFeatureToggle('enableAppointmentBooking', value)}
                  />
                </div>
                
                {config.features.bookings.enableAppointmentBooking && (
                  <>
                    <div className="space-y-2">
                      <Label>Bookable Appointment Types</Label>
                      <div className="border rounded-md p-4 space-y-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          Select which appointment types members can book online
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="apt-type-personal" />
                            <Label htmlFor="apt-type-personal" className="text-sm font-normal">Personal Training (60 min)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="apt-type-intro" />
                            <Label htmlFor="apt-type-intro" className="text-sm font-normal">Introductory Consultation (30 min)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="apt-type-nutrition" />
                            <Label htmlFor="apt-type-nutrition" className="text-sm font-normal">Nutrition Consultation (45 min)</Label>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Manage Appointment Types
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Bookable Staff Members</Label>
                      <div className="border rounded-md p-4 space-y-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          Select which staff members can be booked online
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="staff-john" />
                            <Label htmlFor="staff-john" className="text-sm font-normal">John Smith (Personal Trainer)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="staff-sarah" />
                            <Label htmlFor="staff-sarah" className="text-sm font-normal">Sarah Johnson (Nutritionist)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="staff-mike" />
                            <Label htmlFor="staff-mike" className="text-sm font-normal">Mike Wilson (Personal Trainer)</Label>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Manage Staff Availability
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Schedule & History</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Schedule</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view their upcoming bookings
                    </p>
                  </div>
                  <Switch
                    checked={config.features.bookings.viewSchedule}
                    onCheckedChange={(value) => handleBookingFeatureToggle('viewSchedule', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Attendance History</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view their past class attendance
                    </p>
                  </div>
                  <Switch
                    checked={config.features.bookings.viewAttendanceHistory}
                    onCheckedChange={(value) => handleBookingFeatureToggle('viewAttendanceHistory', value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Booking Settings"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Purchases & Retail */}
      <Card>
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => toggleSection('purchases')}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Purchases & Retail</CardTitle>
              <CardDescription>
                Configure online purchasing options for members
              </CardDescription>
            </div>
          </div>
          {getChevron(expandedSections.purchases)}
        </CardHeader>
        
        {expandedSections.purchases && (
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Membership Purchases</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Membership Purchase</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to purchase or renew memberships online
                    </p>
                  </div>
                  <Switch
                    checked={config.features.purchases.enableMembershipPurchase}
                    onCheckedChange={(value) => handlePurchaseFeatureToggle('enableMembershipPurchase', value)}
                  />
                </div>
                
                {config.features.purchases.enableMembershipPurchase && (
                  <div className="space-y-2">
                    <Label>Available Membership Types</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Select which membership types can be purchased online
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="mem-standard" />
                          <Label htmlFor="mem-standard" className="text-sm font-normal">Standard Monthly ($49.99/mo)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="mem-premium" />
                          <Label htmlFor="mem-premium" className="text-sm font-normal">Premium Monthly ($79.99/mo)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="mem-annual" />
                          <Label htmlFor="mem-annual" className="text-sm font-normal">Annual Membership ($499.99/yr)</Label>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Manage Membership Types
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Package Purchases</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Package Purchase</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to purchase session packages online
                    </p>
                  </div>
                  <Switch
                    checked={config.features.purchases.enablePackagePurchase}
                    onCheckedChange={(value) => handlePurchaseFeatureToggle('enablePackagePurchase', value)}
                  />
                </div>
                
                {config.features.purchases.enablePackagePurchase && (
                  <div className="space-y-2">
                    <Label>Available Packages</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Select which packages can be purchased online
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="pkg-pt5" />
                          <Label htmlFor="pkg-pt5" className="text-sm font-normal">5 Personal Training Sessions ($249)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="pkg-pt10" />
                          <Label htmlFor="pkg-pt10" className="text-sm font-normal">10 Personal Training Sessions ($449)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="pkg-massage" />
                          <Label htmlFor="pkg-massage" className="text-sm font-normal">3 Massage Sessions ($179)</Label>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Manage Packages
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Retail Products</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Retail Purchase</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to purchase retail products online
                    </p>
                  </div>
                  <Switch
                    checked={config.features.purchases.enableRetailPurchase}
                    onCheckedChange={(value) => handlePurchaseFeatureToggle('enableRetailPurchase', value)}
                  />
                </div>
                
                {config.features.purchases.enableRetailPurchase && (
                  <div className="space-y-2">
                    <Label>Available Product Categories</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Select which product categories can be purchased online
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat-apparel" />
                          <Label htmlFor="cat-apparel" className="text-sm font-normal">Apparel & Accessories</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat-supplements" />
                          <Label htmlFor="cat-supplements" className="text-sm font-normal">Supplements & Nutrition</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat-equipment" />
                          <Label htmlFor="cat-equipment" className="text-sm font-normal">Small Equipment</Label>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Manage Product Categories
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Purchase Settings"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Engagement & Community */}
      <Card>
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => toggleSection('engagement')}
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Engagement & Community</CardTitle>
              <CardDescription>
                Configure community features and member engagement tools
              </CardDescription>
            </div>
          </div>
          {getChevron(expandedSections.engagement)}
        </CardHeader>
        
        {expandedSections.engagement && (
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Challenges & Events</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Challenges</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view upcoming gym challenges
                    </p>
                  </div>
                  <Switch
                    checked={config.features.engagement.viewChallenges}
                    onCheckedChange={(value) => handleEngagementFeatureToggle('viewChallenges', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Register for Challenges</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to register for challenges online
                    </p>
                  </div>
                  <Switch
                    checked={config.features.engagement.registerForChallenges}
                    onCheckedChange={(value) => handleEngagementFeatureToggle('registerForChallenges', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">View Leaderboards</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to view challenge leaderboards
                    </p>
                  </div>
                  <Switch
                    checked={config.features.engagement.viewLeaderboards}
                    onCheckedChange={(value) => handleEngagementFeatureToggle('viewLeaderboards', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Log Challenge Progress</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to log their progress for active challenges
                    </p>
                  </div>
                  <Switch
                    checked={config.features.engagement.logChallengeProgress}
                    onCheckedChange={(value) => handleEngagementFeatureToggle('logChallengeProgress', value)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Workout Library & Referrals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Access Workout Library</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow members to access workout videos and guides
                    </p>
                  </div>
                  <Switch
                    checked={config.features.engagement.accessWorkoutLibrary}
                    onCheckedChange={(value) => handleEngagementFeatureToggle('accessWorkoutLibrary', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Referral Program</Label>
                    <p className="text-sm text-muted-foreground">
                      Display information about your referral program
                    </p>
                  </div>
                  <Switch
                    checked={config.features.engagement.enableReferralProgram}
                    onCheckedChange={(value) => handleEngagementFeatureToggle('enableReferralProgram', value)}
                  />
                </div>
                
                {config.features.engagement.enableReferralProgram && (
                  <div className="flex items-center justify-between pl-6">
                    <div className="space-y-0.5">
                      <Label className="text-base">Submit Referrals</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow members to submit referrals through the portal
                      </p>
                    </div>
                    <Switch
                      checked={config.features.engagement.submitReferrals}
                      onCheckedChange={(value) => handleEngagementFeatureToggle('submitReferrals', value)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Engagement Settings"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
