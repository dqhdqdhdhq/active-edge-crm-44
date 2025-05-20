
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColorSwatchIcon, UploadIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MemberPortalConfig } from "@/lib/types";

interface ColorSchemeOption {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
}

const colorSchemeOptions: ColorSchemeOption[] = [
  { id: "light", name: "Light", primaryColor: "#ffffff", secondaryColor: "#f9fafb" },
  { id: "dark", name: "Dark", primaryColor: "#1f2937", secondaryColor: "#111827" },
  { id: "primary", name: "Primary Brand", primaryColor: "#8B5CF6", secondaryColor: "#7C3AED" },
  { id: "custom", name: "Custom", primaryColor: "", secondaryColor: "" }
];

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
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>(config.colorScheme);

  const handleToggleChange = (field: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorSchemeSelect = (schemeId: string) => {
    setSelectedColorScheme(schemeId);
    setConfig(prev => ({
      ...prev,
      colorScheme: schemeId as MemberPortalConfig['colorScheme']
    }));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Portal Activation & Access</CardTitle>
          <CardDescription>
            Enable the member portal and configure basic access settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="portal-enabled" className="text-base">Enable Member Portal</Label>
              <p className="text-sm text-muted-foreground">
                When disabled, members will see a "Portal Currently Unavailable" message
              </p>
            </div>
            <Switch
              id="portal-enabled"
              checked={config.portalEnabled}
              onCheckedChange={(checked) => handleToggleChange("portalEnabled", checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portal-url">Portal URL</Label>
            <Input
              id="portal-url"
              placeholder="https://members.yourgym.com"
              value={config.portalUrl}
              onChange={(e) => handleInputChange("portalUrl", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This is the URL where members will access their portal
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-invite" className="text-base">Auto-Invite New Members</Label>
              <p className="text-sm text-muted-foreground">
                Automatically send portal activation emails to new members
              </p>
            </div>
            <Switch
              id="auto-invite"
              checked={config.autoInviteNewMembers}
              onCheckedChange={(checked) => handleToggleChange("autoInviteNewMembers", checked)}
            />
          </div>
          
          <div className="pt-4">
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Access Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Branding & Appearance</CardTitle>
          <CardDescription>
            Customize how the member portal looks to match your brand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo</Label>
              <div className="flex items-center gap-2">
                {config.logo ? (
                  <div className="w-16 h-16 border rounded flex items-center justify-center">
                    <img 
                      src={config.logo} 
                      alt="Logo preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 border rounded flex items-center justify-center bg-muted">
                    <UploadIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <Button variant="outline" className="h-10">
                  Upload Logo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended size: 200x60px, PNG or SVG
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="favicon-upload">Favicon</Label>
              <div className="flex items-center gap-2">
                {config.favicon ? (
                  <div className="w-8 h-8 border rounded flex items-center justify-center">
                    <img 
                      src={config.favicon} 
                      alt="Favicon preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 border rounded flex items-center justify-center bg-muted">
                    <UploadIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <Button variant="outline" className="h-10">
                  Upload Favicon
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended size: 32x32px, PNG format
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <Label>Color Scheme</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colorSchemeOptions.map((scheme) => (
                <div
                  key={scheme.id}
                  className={`
                    border rounded-md p-3 cursor-pointer flex flex-col gap-2
                    ${selectedColorScheme === scheme.id ? 'border-primary ring-1 ring-primary' : 'border-border'}
                  `}
                  onClick={() => handleColorSchemeSelect(scheme.id)}
                >
                  <div className="flex items-center gap-2">
                    <ColorSwatchIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{scheme.name}</span>
                  </div>
                  {scheme.id !== 'custom' && (
                    <div className="flex gap-1">
                      <div 
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: scheme.primaryColor }}
                      />
                      <div 
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: scheme.secondaryColor }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedColorScheme === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: config.primaryColor || '#8B5CF6' }}
                    />
                    <Input
                      id="primary-color"
                      placeholder="#8B5CF6"
                      value={config.primaryColor || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        primaryColor: e.target.value
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: config.secondaryColor || '#7C3AED' }}
                    />
                    <Input
                      id="secondary-color"
                      placeholder="#7C3AED"
                      value={config.secondaryColor || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        secondaryColor: e.target.value
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <Textarea
              id="welcome-message"
              placeholder="Welcome to your member portal..."
              value={config.welcomeMessage}
              onChange={(e) => handleInputChange("welcomeMessage", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This message will be displayed on the login page
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="footer-text">Footer Text</Label>
            <Input
              id="footer-text"
              placeholder="© 2025 Your Gym. All rights reserved."
              value={config.footerText}
              onChange={(e) => handleInputChange("footerText", e.target.value)}
            />
          </div>
          
          <div className="pt-4">
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Branding Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
