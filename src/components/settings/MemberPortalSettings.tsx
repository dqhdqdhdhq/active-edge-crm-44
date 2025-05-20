
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberPortalConfig } from "@/lib/types";
import { MemberPortalGlobalSettings } from "./member-portal/MemberPortalGlobalSettings";
import { MemberPortalFeatureSettings } from "./member-portal/MemberPortalFeatureSettings";
import { MemberPortalContentSettings } from "./member-portal/MemberPortalContentSettings";
import { MemberPortalCommunicationSettings } from "./member-portal/MemberPortalCommunicationSettings";
import { MemberPortalUserOverview } from "./member-portal/MemberPortalUserOverview";
import { toast } from "sonner";

// Initial default configuration
const defaultMemberPortalConfig: MemberPortalConfig = {
  portalEnabled: false,
  portalUrl: "https://members.yourgym.com",
  autoInviteNewMembers: true,
  
  logo: undefined,
  favicon: undefined,
  colorScheme: "light",
  welcomeMessage: "Welcome to your member portal. Log in to manage your membership and more.",
  footerText: "© 2025 Your Gym. All rights reserved.",
  
  features: {
    profile: {
      viewProfile: true,
      editContactDetails: true,
      editEmergencyContact: true,
      uploadProfilePicture: true,
      updateCommunicationPreferences: true,
      changePassword: true,
      viewMembershipDetails: true,
      viewContractDocuments: true,
      viewPaymentMethods: true,
      updatePaymentMethods: true,
      viewBillingHistory: true,
      downloadInvoices: true,
    },
    bookings: {
      enableClassBooking: true,
      bookingWindow: 7, // days in advance
      cancellationWindow: 2, // hours before
      showClassDescription: true,
      showTrainerInfo: true,
      showRemainingSpots: true,
      enableWaitlist: true,
      showWaitlistPosition: true,
      enableAppointmentBooking: true,
      bookableAppointmentTypes: [],
      bookableStaffMembers: [],
      viewSchedule: true,
      viewAttendanceHistory: true,
    },
    purchases: {
      enableMembershipPurchase: true,
      availableMembershipTypes: [],
      enablePackagePurchase: true,
      availablePackages: [],
      enableRetailPurchase: true,
      availableProductCategories: [],
    },
    engagement: {
      viewChallenges: true,
      registerForChallenges: true,
      viewLeaderboards: true,
      logChallengeProgress: true,
      accessWorkoutLibrary: true,
      enableReferralProgram: true,
      submitReferrals: true,
    },
  },
  
  announcements: [],
  resources: [],
  faqCategories: [],
  
  emailTemplates: [
    {
      id: "welcome-email",
      name: "Portal Welcome Email",
      subject: "Welcome to Your Member Portal",
      body: "<p>Hello [MemberName],</p><p>Welcome to your new member portal! You can now manage your membership, book classes, and more online.</p><p>Your login details are:</p><p>Username: [Email]<br>Password: [TempPassword]</p><p>Best regards,<br>The Team</p>",
      isEnabled: true
    },
    {
      id: "password-reset",
      name: "Password Reset",
      subject: "Password Reset Request",
      body: "<p>Hello [MemberName],</p><p>We received a request to reset your password. Click the link below to create a new password:</p><p>[ResetLink]</p><p>If you didn't request this, please ignore this email.</p><p>Best regards,<br>The Team</p>",
      isEnabled: true
    },
    {
      id: "booking-confirmation",
      name: "Class Booking Confirmation",
      subject: "Class Booking Confirmation",
      body: "<p>Hello [MemberName],</p><p>Your booking for [ClassName] on [BookingDate] at [BookingTime] has been confirmed.</p><p>See you there!</p><p>Best regards,<br>The Team</p>",
      isEnabled: true
    }
  ],
  feedbackForms: [],
};

export function MemberPortalSettings() {
  const [config, setConfig] = useState<MemberPortalConfig>(defaultMemberPortalConfig);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Member portal settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <MemberPortalGlobalSettings 
            config={config} 
            setConfig={setConfig} 
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <MemberPortalFeatureSettings 
            config={config} 
            setConfig={setConfig} 
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <MemberPortalContentSettings 
            config={config} 
            setConfig={setConfig} 
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="communication" className="space-y-4">
          <MemberPortalCommunicationSettings 
            config={config} 
            setConfig={setConfig} 
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <MemberPortalUserOverview 
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
