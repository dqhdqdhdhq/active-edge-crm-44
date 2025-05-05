
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function GymProfileSettings() {
  // Initial mock data for the gym profile
  const [gymData, setGymData] = useState({
    name: "ActiveEdge Fitness",
    email: "contact@activeedgefitness.com",
    phone: "(555) 123-4567",
    website: "https://activeedgefitness.com",
    facebook: "https://facebook.com/activeedge",
    instagram: "https://instagram.com/activeedge",
    address: {
      street: "123 Fitness Ave",
      city: "Gymtown",
      state: "CA",
      zipCode: "90210",
      country: "United States"
    },
    operationalSettings: {
      timeZone: "America/Los_Angeles",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setGymData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setGymData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Gym profile updated successfully!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
          <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          <TabsTrigger value="operational">Operational Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Add your gym's core identity information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Gym Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={gymData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.street">Street Address</Label>
                  <Input 
                    id="address.street"
                    name="address.street"
                    value={gymData.address.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.city">City</Label>
                  <Input 
                    id="address.city"
                    name="address.city"
                    value={gymData.address.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.state">State/Province</Label>
                  <Input 
                    id="address.state"
                    name="address.state"
                    value={gymData.address.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.zipCode">Zip/Postal Code</Label>
                  <Input 
                    id="address.zipCode"
                    name="address.zipCode"
                    value={gymData.address.zipCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.country">Country</Label>
                  <Input 
                    id="address.country"
                    name="address.country"
                    value={gymData.address.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Basic Information"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Social Media</CardTitle>
              <CardDescription>
                Manage your gym's contact details and social media links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={gymData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={gymData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Social Media</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    type="url"
                    value={gymData.website}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input 
                    id="facebook"
                    name="facebook"
                    type="url"
                    value={gymData.facebook}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input 
                    id="instagram"
                    name="instagram"
                    type="url"
                    value={gymData.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Contact Information"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="operational">
          <Card>
            <CardHeader>
              <CardTitle>Operational Settings</CardTitle>
              <CardDescription>
                Configure time zone, currency, and date/time formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operationalSettings.timeZone">Time Zone</Label>
                  <Input 
                    id="operationalSettings.timeZone"
                    name="operationalSettings.timeZone"
                    value={gymData.operationalSettings.timeZone}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for scheduling and reporting
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operationalSettings.currency">Currency</Label>
                  <Input 
                    id="operationalSettings.currency"
                    name="operationalSettings.currency"
                    value={gymData.operationalSettings.currency}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for pricing and financial reports
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operationalSettings.dateFormat">Date Format</Label>
                  <Input 
                    id="operationalSettings.dateFormat"
                    name="operationalSettings.dateFormat"
                    value={gymData.operationalSettings.dateFormat}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operationalSettings.timeFormat">Time Format</Label>
                  <Input 
                    id="operationalSettings.timeFormat"
                    name="operationalSettings.timeFormat"
                    value={gymData.operationalSettings.timeFormat}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Operational Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
