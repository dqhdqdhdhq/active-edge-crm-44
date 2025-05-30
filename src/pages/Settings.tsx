import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Bell, 
  Calendar, 
  Users, 
  Database, 
  Tag,
  Link as LinkIcon,
  Building,
  UserCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GymProfileSettings } from "@/components/settings/GymProfileSettings";
import { PageTitle } from "@/components/ui/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberPortalSettings } from "@/components/settings/MemberPortalSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("gym-profile");

  return (
    <div className="container mx-auto py-6">
      <PageTitle title="Settings" description="Configure your gym management system" />
      
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Using a single Tabs component that wraps both the sidebar and content */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full flex flex-col md:flex-row gap-6"
        >
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 space-y-1">
            <TabsList className="flex flex-col h-auto bg-card p-2 gap-1 w-full">
              <TabsTrigger 
                value="gym-profile" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <Building size={18} />
                <span>Gym Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="membership" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <Users size={18} />
                <span>Membership</span>
              </TabsTrigger>
              <TabsTrigger 
                value="classes" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <Calendar size={18} />
                <span>Classes & Scheduling</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <User size={18} />
                <span>Users & Roles</span>
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <CreditCard size={18} />
                <span>Billing & Payments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <Bell size={18} />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="member-portal" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <UserCircle size={18} />
                <span>Member Portal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="customization" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <Tag size={18} />
                <span>Customization</span>
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <LinkIcon size={18} />
                <span>Integrations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="w-full justify-start gap-3 pl-3 font-medium"
              >
                <Database size={18} />
                <span>Data Management</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Settings Content */}
          <div className="flex-1">
            <TabsContent value="gym-profile" className="mt-0 data-[state=inactive]:hidden">
              <GymProfileSettings />
            </TabsContent>
            <TabsContent value="membership" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Settings</CardTitle>
                  <CardDescription>
                    Configure membership types, policies, and related settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Membership settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="classes" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Classes & Scheduling</CardTitle>
                  <CardDescription>
                    Manage class types, booking rules, and resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Class and scheduling settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Users & Roles</CardTitle>
                  <CardDescription>
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="billing" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>
                    Configure payment gateways, tax rules, and invoice settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Billing settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Customize email templates and notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Notification settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="member-portal" className="mt-0 data-[state=inactive]:hidden">
              <MemberPortalSettings />
            </TabsContent>
            <TabsContent value="customization" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Customization</CardTitle>
                  <CardDescription>
                    Manage tags, custom fields, and other customization options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Customization settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="integrations" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect with third-party services and tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Integration settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="data" className="mt-0 data-[state=inactive]:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Manage backups, imports, exports, and audit logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Data management settings will be implemented soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
