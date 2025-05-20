
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MemberPortalConfig } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Link, Upload, Palette } from "lucide-react";

interface MemberPortalGlobalSettingsProps {
  config: MemberPortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<MemberPortalConfig>>;
  onSave: () => void;
  isSaving: boolean;
}

export function MemberPortalGlobalSettings({ 
  config, 
  setConfig, 
  onSave, 
  isSaving 
}: MemberPortalGlobalSettingsProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const handleTogglePortal = (enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      portalEnabled: enabled
    }));
  };

  const handleToggleAutoInvite = (enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      autoInviteNewMembers: enabled
    }));
  };

  const handleColorSchemeChange = (scheme: "light" | "dark" | "primary" | "custom") => {
    setConfig(prev => ({
      ...prev,
      colorScheme: scheme
    }));
  };

  const handleUrlChange = (url: string) => {
    setConfig(prev => ({
      ...prev,
      portalUrl: url
    }));
  };

  const handlePrimaryColorChange = (color: string) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: color
    }));
  };

  const handleSecondaryColorChange = (color: string) => {
    setConfig(prev => ({
      ...prev,
      secondaryColor: color
    }));
  };

  const handleWelcomeMessageChange = (message: string) => {
    setConfig(prev => ({
      ...prev,
      welcomeMessage: message
    }));
  };

  const handleFooterTextChange = (text: string) => {
    setConfig(prev => ({
      ...prev,
      footerText: text
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Portal Settings</CardTitle>
        <CardDescription>
          Enable the member portal and configure basic settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portal Activation */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Portal Activation</h3>
            <p className="text-sm text-muted-foreground">
              Enable or disable the member portal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="portal-status">Portal Status</Label>
                <Switch
                  id="portal-status"
                  checked={config.portalEnabled}
                  onCheckedChange={handleTogglePortal}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {config.portalEnabled ? 
                  "The member portal is currently active and accessible to members" : 
                  "The member portal is currently disabled"
                }
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-invite">Auto-invite New Members</Label>
                <Switch
                  id="auto-invite"
                  checked={config.autoInviteNewMembers}
                  onCheckedChange={handleToggleAutoInvite}
                  disabled={!config.portalEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Automatically send portal invitations to new members
              </p>
            </div>
          </div>
        </div>

        {/* Portal URL */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Portal URL</h3>
            <p className="text-sm text-muted-foreground">
              Configure the web address for the member portal
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="portal-url">Member Portal URL</Label>
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-muted-foreground" />
              <Input
                id="portal-url"
                value={config.portalUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://members.yourgym.com"
                disabled={!config.portalEnabled}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This is the URL where members will access their portal
            </p>
          </div>
        </div>

        {/* Portal Branding */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Portal Branding</h3>
            <p className="text-sm text-muted-foreground">
              Customize the appearance of the member portal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="logo-upload"
                  type="file"
                  onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                  accept="image/png,image/jpeg,image/svg+xml"
                  disabled={!config.portalEnabled}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  disabled={!config.portalEnabled}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {config.logo ? "Change Logo" : "Upload Logo"}
                </Button>
                {config.logo && (
                  <Button
                    variant="outline"
                    onClick={() => setConfig(prev => ({ ...prev, logo: undefined }))}
                    disabled={!config.portalEnabled}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {config.logo && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <img src={config.logo} alt="Current Logo" className="h-6" />
                  <span className="text-muted-foreground">Current Logo</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon-upload">Favicon</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="favicon-upload"
                  type="file"
                  onChange={(e) => e.target.files && setFaviconFile(e.target.files[0])}
                  accept="image/png,image/x-icon,image/svg+xml"
                  disabled={!config.portalEnabled}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('favicon-upload')?.click()}
                  disabled={!config.portalEnabled}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {config.favicon ? "Change Favicon" : "Upload Favicon"}
                </Button>
                {config.favicon && (
                  <Button
                    variant="outline"
                    onClick={() => setConfig(prev => ({ ...prev, favicon: undefined }))}
                    disabled={!config.portalEnabled}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {config.favicon && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <img src={config.favicon} alt="Current Favicon" className="h-4" />
                  <span className="text-muted-foreground">Current Favicon</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="color-scheme">Color Scheme</Label>
              <div className="flex items-center gap-2">
                <Palette className="text-muted-foreground h-4 w-4" />
                <Select
                  value={config.colorScheme}
                  onValueChange={(value) => handleColorSchemeChange(value as any)}
                  disabled={!config.portalEnabled}
                >
                  <SelectTrigger id="color-scheme" className="w-full">
                    <SelectValue placeholder="Select a color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="primary">Primary Brand Color</SelectItem>
                    <SelectItem value="custom">Custom Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {config.colorScheme === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded border"
                    style={{ backgroundColor: config.primaryColor || '#000000' }}
                  />
                  <Input
                    id="primary-color"
                    type="color"
                    value={config.primaryColor || "#000000"}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    disabled={!config.portalEnabled || config.colorScheme !== "custom"}
                  />
                </div>
              </div>
            )}
            
            {config.colorScheme === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded border"
                    style={{ backgroundColor: config.secondaryColor || '#cccccc' }}
                  />
                  <Input
                    id="secondary-color"
                    type="color"
                    value={config.secondaryColor || "#cccccc"}
                    onChange={(e) => handleSecondaryColorChange(e.target.value)}
                    disabled={!config.portalEnabled || config.colorScheme !== "custom"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Content Settings */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Portal Content</h3>
            <p className="text-sm text-muted-foreground">
              Configure welcome message and footer text
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <Input
              id="welcome-message"
              value={config.welcomeMessage}
              onChange={(e) => handleWelcomeMessageChange(e.target.value)}
              placeholder="Welcome to your member portal..."
              disabled={!config.portalEnabled}
            />
            <p className="text-xs text-muted-foreground">
              This message will be displayed on the login page
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="footer-text">Footer Text</Label>
            <Input
              id="footer-text"
              value={config.footerText}
              onChange={(e) => handleFooterTextChange(e.target.value)}
              placeholder="© 2025 Your Gym. All rights reserved."
              disabled={!config.portalEnabled}
            />
            <p className="text-xs text-muted-foreground">
              This text will appear in the footer of all portal pages
            </p>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="pt-4">
          <Button onClick={onSave} disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? "Saving..." : "Save Portal Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
