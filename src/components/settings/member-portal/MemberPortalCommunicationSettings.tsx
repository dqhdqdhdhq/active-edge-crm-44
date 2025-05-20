import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MemberPortalConfig, MemberPortalEmailTemplate, MemberPortalFeedbackForm, MemberPortalFeedbackField } from "@/lib/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash, Edit, Mail, MessageSquare, InfoIcon, PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MemberPortalCommunicationSettingsProps {
  config: MemberPortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<MemberPortalConfig>>;
  onSave: () => void;
  isSaving: boolean;
}

export function MemberPortalCommunicationSettings({ 
  config, 
  setConfig, 
  onSave, 
  isSaving 
}: MemberPortalCommunicationSettingsProps) {
  const [activeTab, setActiveTab] = useState("email-templates");
  
  // Email Templates
  const [emailTemplateDialogOpen, setEmailTemplateDialogOpen] = useState(false);
  const [editingEmailTemplate, setEditingEmailTemplate] = useState<MemberPortalEmailTemplate | null>(null);
  const [newEmailTemplate, setNewEmailTemplate] = useState<Partial<MemberPortalEmailTemplate>>({
    name: "",
    subject: "",
    body: "",
    isEnabled: true
  });
  
  // Feedback Forms
  const [feedbackFormDialogOpen, setFeedbackFormDialogOpen] = useState(false);
  const [editingFeedbackForm, setEditingFeedbackForm] = useState<MemberPortalFeedbackForm | null>(null);
  const [newFeedbackForm, setNewFeedbackForm] = useState<Partial<MemberPortalFeedbackForm>>({
    name: "",
    description: "",
    isEnabled: true,
    recipientEmails: [],
    fields: []
  });
  
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<MemberPortalFeedbackField | null>(null);
  const [newField, setNewField] = useState<Partial<MemberPortalFeedbackField>>({
    type: 'text',
    label: '',
    required: false,
    options: []
  });
  
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [tempRecipientEmail, setTempRecipientEmail] = useState("");
  const [tempFieldOption, setTempFieldOption] = useState("");

  // Email Template handlers
  const handleEmailTemplateSubmit = () => {
    if (editingEmailTemplate) {
      // Update existing template
      setConfig(prev => ({
        ...prev,
        emailTemplates: prev.emailTemplates.map(t => 
          t.id === editingEmailTemplate.id ? { 
            ...editingEmailTemplate, 
            name: newEmailTemplate.name || "", 
            subject: newEmailTemplate.subject || "",
            body: newEmailTemplate.body || "",
            isEnabled: newEmailTemplate.isEnabled ?? true
          } : t
        )
      }));
    } else {
      // Add new template
      const template: MemberPortalEmailTemplate = {
        id: `email-template-${Date.now()}`,
        name: newEmailTemplate.name || "",
        subject: newEmailTemplate.subject || "",
        body: newEmailTemplate.body || "",
        isEnabled: newEmailTemplate.isEnabled ?? true
      };
      
      setConfig(prev => ({
        ...prev,
        emailTemplates: [...prev.emailTemplates, template]
      }));
    }
    
    // Reset form and close dialog
    setNewEmailTemplate({
      name: "",
      subject: "",
      body: "",
      isEnabled: true
    });
    setEditingEmailTemplate(null);
    setEmailTemplateDialogOpen(false);
  };
  
  const handleEmailTemplateEdit = (template: MemberPortalEmailTemplate) => {
    setEditingEmailTemplate(template);
    setNewEmailTemplate({
      name: template.name,
      subject: template.subject,
      body: template.body,
      isEnabled: template.isEnabled
    });
    setEmailTemplateDialogOpen(true);
  };
  
  const handleEmailTemplateDelete = (id: string) => {
    setConfig(prev => ({
      ...prev,
      emailTemplates: prev.emailTemplates.filter(t => t.id !== id)
    }));
  };
  
  const toggleEmailTemplateEnabled = (id: string, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      emailTemplates: prev.emailTemplates.map(t => 
        t.id === id ? { ...t, isEnabled: enabled } : t
      )
    }));
  };
  
  // Feedback Form handlers
  const handleFeedbackFormSubmit = () => {
    if (editingFeedbackForm) {
      // Update existing form
      setConfig(prev => ({
        ...prev,
        feedbackForms: prev.feedbackForms.map(f => 
          f.id === editingFeedbackForm.id ? { 
            ...editingFeedbackForm, 
            name: newFeedbackForm.name || "", 
            description: newFeedbackForm.description || "",
            isEnabled: newFeedbackForm.isEnabled ?? true,
            recipientEmails: newFeedbackForm.recipientEmails || [],
            fields: newFeedbackForm.fields || []
          } : f
        )
      }));
    } else {
      // Add new form
      const form: MemberPortalFeedbackForm = {
        id: `feedback-form-${Date.now()}`,
        name: newFeedbackForm.name || "",
        description: newFeedbackForm.description || "",
        isEnabled: newFeedbackForm.isEnabled ?? true,
        recipientEmails: newFeedbackForm.recipientEmails || [],
        fields: newFeedbackForm.fields || []
      };
      
      setConfig(prev => ({
        ...prev,
        feedbackForms: [...prev.feedbackForms, form]
      }));
    }
    
    // Reset form and close dialog
    setNewFeedbackForm({
      name: "",
      description: "",
      isEnabled: true,
      recipientEmails: [],
      fields: []
    });
    setEditingFeedbackForm(null);
    setFeedbackFormDialogOpen(false);
  };
  
  const handleFeedbackFormEdit = (form: MemberPortalFeedbackForm) => {
    setEditingFeedbackForm(form);
    setNewFeedbackForm({
      name: form.name,
      description: form.description,
      isEnabled: form.isEnabled,
      recipientEmails: [...form.recipientEmails],
      fields: [...form.fields]
    });
    setFeedbackFormDialogOpen(true);
  };
  
  const handleFeedbackFormDelete = (id: string) => {
    setConfig(prev => ({
      ...prev,
      feedbackForms: prev.feedbackForms.filter(f => f.id !== id)
    }));
  };
  
  const toggleFeedbackFormEnabled = (id: string, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      feedbackForms: prev.feedbackForms.map(f => 
        f.id === id ? { ...f, isEnabled: enabled } : f
      )
    }));
  };
  
  const addRecipientEmail = () => {
    if (tempRecipientEmail && !newFeedbackForm.recipientEmails?.includes(tempRecipientEmail)) {
      setNewFeedbackForm({
        ...newFeedbackForm,
        recipientEmails: [...(newFeedbackForm.recipientEmails || []), tempRecipientEmail]
      });
      setTempRecipientEmail("");
    }
  };
  
  const removeRecipientEmail = (email: string) => {
    setNewFeedbackForm({
      ...newFeedbackForm,
      recipientEmails: newFeedbackForm.recipientEmails?.filter(e => e !== email) || []
    });
  };
  
  // Field handlers
  const handleFieldSubmit = () => {
    if (!selectedFormId) return;
    
    if (editingField) {
      // Update existing field
      setNewFeedbackForm(prev => ({
        ...prev,
        fields: prev.fields?.map(f => 
          f.id === editingField.id ? { 
            ...f, 
            type: newField.type as MemberPortalFeedbackField['type'], 
            label: newField.label || "",
            required: newField.required ?? false,
            options: newField.options || []
          } : f
        ) || []
      }));
    } else {
      // Add new field
      const field: MemberPortalFeedbackField = {
        id: `field-${Date.now()}`,
        type: newField.type as MemberPortalFeedbackField['type'],
        label: newField.label || "",
        required: newField.required ?? false,
        options: newField.options || []
      };
      
      setNewFeedbackForm(prev => ({
        ...prev,
        fields: [...(prev.fields || []), field]
      }));
    }
    
    // Reset form and close dialog
    setNewField({
      type: 'text',
      label: '',
      required: false,
      options: []
    });
    setEditingField(null);
    setFieldDialogOpen(false);
  };
  
  const handleFieldEdit = (field: MemberPortalFeedbackField) => {
    setEditingField(field);
    setNewField({
      type: field.type,
      label: field.label,
      required: field.required,
      options: field.options ? [...field.options] : []
    });
    setFieldDialogOpen(true);
  };
  
  const handleFieldDelete = (fieldId: string) => {
    setNewFeedbackForm(prev => ({
      ...prev,
      fields: prev.fields?.filter(f => f.id !== fieldId) || []
    }));
  };
  
  const addFieldOption = () => {
    if (tempFieldOption && !newField.options?.includes(tempFieldOption)) {
      setNewField({
        ...newField,
        options: [...(newField.options || []), tempFieldOption]
      });
      setTempFieldOption("");
    }
  };
  
  const removeFieldOption = (option: string) => {
    setNewField({
      ...newField,
      options: newField.options?.filter(o => o !== option) || []
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Settings</CardTitle>
        <CardDescription>
          Configure email templates and feedback forms for the member portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
            <TabsTrigger value="feedback-forms">Feedback Forms</TabsTrigger>
          </TabsList>
          
          {/* Email Templates Tab */}
          <TabsContent value="email-templates">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Email Templates</h3>
                <Dialog open={emailTemplateDialogOpen} onOpenChange={setEmailTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingEmailTemplate ? "Edit Email Template" : "Add New Email Template"}</DialogTitle>
                      <DialogDescription>
                        {editingEmailTemplate ? "Update template details" : "Create a new email template for automated communications"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={newEmailTemplate.name || ""}
                          onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, name: e.target.value })}
                          placeholder="e.g., Welcome Email, Password Reset, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-subject">Email Subject</Label>
                        <Input
                          id="template-subject"
                          value={newEmailTemplate.subject || ""}
                          onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, subject: e.target.value })}
                          placeholder="e.g., Welcome to [GymName] Member Portal"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="template-body">Email Body</Label>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <InfoIcon className="h-3 w-3 mr-1" />
                            <span>Available placeholders: [MemberName], [GymName], [ClassName], etc.</span>
                          </div>
                        </div>
                        <Textarea
                          id="template-body"
                          value={newEmailTemplate.body || ""}
                          onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, body: e.target.value })}
                          rows={10}
                          placeholder="Dear [MemberName],&#10;&#10;Thank you for joining [GymName]..."
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="template-enabled"
                          checked={newEmailTemplate.isEnabled}
                          onCheckedChange={(checked) => 
                            setNewEmailTemplate({ ...newEmailTemplate, isEnabled: checked })
                          }
                        />
                        <Label htmlFor="template-enabled">Enable this email template</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setEmailTemplateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleEmailTemplateSubmit}>
                        {editingEmailTemplate ? "Update" : "Add"} Template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {config.emailTemplates.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">No Email Templates</h3>
                  <p className="text-muted-foreground mb-4">Create email templates for automated communications</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setEmailTemplateDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Email Template
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Template Name</TableHead>
                      <TableHead className="w-[300px]">Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {template.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {template.subject}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`template-enabled-${template.id}`}
                              checked={template.isEnabled}
                              onCheckedChange={(checked) => toggleEmailTemplateEnabled(template.id, checked)}
                            />
                            <Label htmlFor={`template-enabled-${template.id}`} className="text-sm">
                              {template.isEnabled ? "Enabled" : "Disabled"}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell className="text-right flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmailTemplateEdit(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEmailTemplateDelete(template.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
          
          {/* Feedback Forms Tab */}
          <TabsContent value="feedback-forms">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Feedback Forms</h3>
                <Dialog open={feedbackFormDialogOpen} onOpenChange={setFeedbackFormDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Form
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingFeedbackForm ? "Edit Feedback Form" : "Add New Feedback Form"}</DialogTitle>
                      <DialogDescription>
                        {editingFeedbackForm ? "Update form details" : "Create a new feedback form for members"}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {/* Field Dialog (Sub-dialog) */}
                    <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{editingField ? "Edit Field" : "Add New Field"}</DialogTitle>
                          <DialogDescription>
                            {editingField ? "Update field details" : "Add a new field to your form"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="field-label">Field Label</Label>
                            <Input
                              id="field-label"
                              value={newField.label || ""}
                              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                              placeholder="e.g., Full Name, Feedback Message, Rating"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="field-type">Field Type</Label>
                            <Select 
                              value={newField.type} 
                              onValueChange={(value) => setNewField({ 
                                ...newField, 
                                type: value as MemberPortalFeedbackField['type']
                              })}
                            >
                              <SelectTrigger id="field-type">
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text Input</SelectItem>
                                <SelectItem value="textarea">Text Area</SelectItem>
                                <SelectItem value="select">Dropdown Select</SelectItem>
                                <SelectItem value="radio">Radio Buttons</SelectItem>
                                <SelectItem value="checkbox">Checkboxes</SelectItem>
                                <SelectItem value="rating">Star Rating</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {(newField.type === 'select' || newField.type === 'radio' || newField.type === 'checkbox') && (
                            <div className="space-y-2">
                              <Label>Options</Label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {newField.options?.map((option) => (
                                  <Badge key={option} variant="secondary" className="px-2 py-1">
                                    {option}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 ml-1"
                                      onClick={() => removeFieldOption(option)}
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add new option"
                                  value={tempFieldOption}
                                  onChange={(e) => setTempFieldOption(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addFieldOption();
                                    }
                                  }}
                                />
                                <Button type="button" onClick={addFieldOption}>Add</Button>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <Switch
                              id="field-required"
                              checked={newField.required}
                              onCheckedChange={(checked) => 
                                setNewField({ ...newField, required: checked })
                              }
                            />
                            <Label htmlFor="field-required">Required field</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setFieldDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={handleFieldSubmit}>
                            {editingField ? "Update" : "Add"} Field
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="form-name">Form Name</Label>
                        <Input
                          id="form-name"
                          value={newFeedbackForm.name || ""}
                          onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, name: e.target.value })}
                          placeholder="e.g., Contact Us, Class Feedback, Suggestion Box"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-description">Description</Label>
                        <Textarea
                          id="form-description"
                          value={newFeedbackForm.description || ""}
                          onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, description: e.target.value })}
                          placeholder="Brief description of this form's purpose"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Recipient Emails</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {newFeedbackForm.recipientEmails?.map((email) => (
                            <Badge key={email} variant="secondary" className="px-2 py-1">
                              {email}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeRecipientEmail(email)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add recipient email"
                            type="email"
                            value={tempRecipientEmail}
                            onChange={(e) => setTempRecipientEmail(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addRecipientEmail();
                              }
                            }}
                          />
                          <Button type="button" onClick={addRecipientEmail}>Add</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base">Form Fields</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFormId(editingFeedbackForm?.id || 'new-form');
                              setEditingField(null);
                              setNewField({
                                type: 'text',
                                label: '',
                                required: false,
                                options: []
                              });
                              setFieldDialogOpen(true);
                            }}
                          >
                            <Plus className="mr-1 h-4 w-4" /> Add Field
                          </Button>
                        </div>
                        
                        {newFeedbackForm.fields && newFeedbackForm.fields.length > 0 ? (
                          <div className="border rounded-md divide-y">
                            {newFeedbackForm.fields.map((field) => (
                              <div key={field.id} className="p-3 flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{field.label}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {field.type}
                                    </Badge>
                                    {field.required && (
                                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFieldEdit(field)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFieldDelete(field.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-4 border rounded-md bg-muted/30">
                            <p className="text-muted-foreground">No fields added yet</p>
                            <Button
                              variant="link"
                              onClick={() => {
                                setSelectedFormId(editingFeedbackForm?.id || 'new-form');
                                setFieldDialogOpen(true);
                              }}
                            >
                              Add your first field
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-4">
                        <Switch
                          id="form-enabled"
                          checked={newFeedbackForm.isEnabled}
                          onCheckedChange={(checked) => 
                            setNewFeedbackForm({ ...newFeedbackForm, isEnabled: checked })
                          }
                        />
                        <Label htmlFor="form-enabled">Enable this feedback form</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setFeedbackFormDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleFeedbackFormSubmit}>
                        {editingFeedbackForm ? "Update" : "Add"} Form
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {config.feedbackForms.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">No Feedback Forms</h3>
                  <p className="text-muted-foreground mb-4">Create forms for collecting member feedback</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFeedbackFormDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Feedback Form
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Form Name</TableHead>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.feedbackForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            {form.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {form.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`form-enabled-${form.id}`}
                              checked={form.isEnabled}
                              onCheckedChange={(checked) => toggleFeedbackFormEnabled(form.id, checked)}
                            />
                            <Label htmlFor={`form-enabled-${form.id}`} className="text-sm">
                              {form.isEnabled ? "Enabled" : "Disabled"}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {form.fields.length} {form.fields.length === 1 ? 'field' : 'fields'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleFeedbackFormEdit(form)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleFeedbackFormDelete(form.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button onClick={onSave} disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? "Saving..." : "Save Communication Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
