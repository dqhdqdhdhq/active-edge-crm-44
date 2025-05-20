import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  MemberPortalConfig, 
  MemberPortalAnnouncement, 
  MemberPortalFaqCategory,
  MemberPortalResource,
  MemberPortalFaqQuestion
} from "@/lib/types";
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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, Edit, FileQuestion, Megaphone, FileText, FileEdit, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MemberPortalContentSettingsProps {
  config: MemberPortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<MemberPortalConfig>>;
  onSave: () => void;
  isSaving: boolean;
}

export function MemberPortalContentSettings({ 
  config, 
  setConfig, 
  onSave, 
  isSaving 
}: MemberPortalContentSettingsProps) {
  const [activeTab, setActiveTab] = useState("announcements");
  
  // Announcements
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<MemberPortalAnnouncement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<MemberPortalAnnouncement>>({
    title: "",
    content: "",
    isSticky: false,
    isImportant: false,
    publishDate: new Date().toISOString(),
    isPublished: true
  });
  
  // Resources
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<MemberPortalResource | null>(null);
  const [newResource, setNewResource] = useState<Partial<MemberPortalResource>>({
    name: "",
    description: "",
    category: "",
    fileUrl: "",
    fileType: "pdf",
    isVisible: true,
    uploadDate: new Date().toISOString()
  });
  
  // FAQs
  const [faqCategoryDialogOpen, setFaqCategoryDialogOpen] = useState(false);
  const [editingFaqCategory, setEditingFaqCategory] = useState<MemberPortalFaqCategory | null>(null);
  const [newFaqCategory, setNewFaqCategory] = useState<Partial<MemberPortalFaqCategory>>({
    name: "",
    order: 0,
    questions: []
  });
  
  const [faqQuestionDialogOpen, setFaqQuestionDialogOpen] = useState(false);
  const [editingFaqQuestion, setEditingFaqQuestion] = useState<MemberPortalFaqQuestion | null>(null);
  const [newFaqQuestion, setNewFaqQuestion] = useState<Partial<MemberPortalFaqQuestion>>({
    question: "",
    answer: "",
    order: 0
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Announcements handlers
  const handleAnnouncementSubmit = () => {
    if (editingAnnouncement) {
      // Update existing announcement
      setConfig(prev => ({
        ...prev,
        announcements: prev.announcements.map(a => 
          a.id === editingAnnouncement.id ? { 
            ...editingAnnouncement, 
            title: newAnnouncement.title || "", 
            content: newAnnouncement.content || "",
            isSticky: newAnnouncement.isSticky || false,
            isImportant: newAnnouncement.isImportant || false,
            publishDate: newAnnouncement.publishDate || new Date().toISOString(),
            expiryDate: newAnnouncement.expiryDate,
            isPublished: newAnnouncement.isPublished || false
          } : a
        )
      }));
    } else {
      // Add new announcement
      const announcement: MemberPortalAnnouncement = {
        id: `announcement-${Date.now()}`,
        title: newAnnouncement.title || "",
        content: newAnnouncement.content || "",
        isSticky: newAnnouncement.isSticky || false,
        isImportant: newAnnouncement.isImportant || false,
        publishDate: newAnnouncement.publishDate || new Date().toISOString(),
        expiryDate: newAnnouncement.expiryDate,
        isPublished: newAnnouncement.isPublished || false
      };
      
      setConfig(prev => ({
        ...prev,
        announcements: [...prev.announcements, announcement]
      }));
    }
    
    // Reset form and close dialog
    setNewAnnouncement({
      title: "",
      content: "",
      isSticky: false,
      isImportant: false,
      publishDate: new Date().toISOString(),
      isPublished: true
    });
    setEditingAnnouncement(null);
    setAnnouncementDialogOpen(false);
  };
  
  const handleAnnouncementEdit = (announcement: MemberPortalAnnouncement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      isSticky: announcement.isSticky,
      isImportant: announcement.isImportant,
      publishDate: announcement.publishDate,
      expiryDate: announcement.expiryDate,
      isPublished: announcement.isPublished
    });
    setAnnouncementDialogOpen(true);
  };
  
  const handleAnnouncementDelete = (id: string) => {
    setConfig(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id)
    }));
  };
  
  // Resources handlers
  const handleResourceSubmit = () => {
    if (editingResource) {
      // Update existing resource
      setConfig(prev => ({
        ...prev,
        resources: prev.resources.map(r => 
          r.id === editingResource.id ? { 
            ...editingResource, 
            name: newResource.name || "", 
            description: newResource.description || "",
            category: newResource.category || "",
            fileUrl: newResource.fileUrl || "",
            fileType: newResource.fileType || "pdf",
            isVisible: newResource.isVisible ?? true
          } : r
        )
      }));
    } else {
      // Add new resource
      const resource: MemberPortalResource = {
        id: `resource-${Date.now()}`,
        name: newResource.name || "",
        description: newResource.description || "",
        category: newResource.category || "",
        fileUrl: newResource.fileUrl || "",
        fileType: newResource.fileType || "pdf",
        isVisible: newResource.isVisible ?? true,
        uploadDate: new Date().toISOString()
      };
      
      setConfig(prev => ({
        ...prev,
        resources: [...prev.resources, resource]
      }));
    }
    
    // Reset form and close dialog
    setNewResource({
      name: "",
      description: "",
      category: "",
      fileUrl: "",
      fileType: "pdf",
      isVisible: true,
      uploadDate: new Date().toISOString()
    });
    setEditingResource(null);
    setResourceDialogOpen(false);
  };
  
  const handleResourceEdit = (resource: MemberPortalResource) => {
    setEditingResource(resource);
    setNewResource({
      name: resource.name,
      description: resource.description,
      category: resource.category,
      fileUrl: resource.fileUrl,
      fileType: resource.fileType,
      isVisible: resource.isVisible
    });
    setResourceDialogOpen(true);
  };
  
  const handleResourceDelete = (id: string) => {
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r.id !== id)
    }));
  };
  
  // FAQ Category handlers
  const handleFaqCategorySubmit = () => {
    if (editingFaqCategory) {
      // Update existing category
      setConfig(prev => ({
        ...prev,
        faqCategories: prev.faqCategories.map(c => 
          c.id === editingFaqCategory.id ? { 
            ...editingFaqCategory, 
            name: newFaqCategory.name || "", 
            order: newFaqCategory.order || 0
          } : c
        )
      }));
    } else {
      // Add new category
      const nextOrder = config.faqCategories.length > 0 
        ? Math.max(...config.faqCategories.map(c => c.order)) + 1 
        : 0;
        
      const category: MemberPortalFaqCategory = {
        id: `faq-category-${Date.now()}`,
        name: newFaqCategory.name || "",
        order: newFaqCategory.order ?? nextOrder,
        questions: []
      };
      
      setConfig(prev => ({
        ...prev,
        faqCategories: [...prev.faqCategories, category]
      }));
    }
    
    // Reset form and close dialog
    setNewFaqCategory({
      name: "",
      order: 0,
      questions: []
    });
    setEditingFaqCategory(null);
    setFaqCategoryDialogOpen(false);
  };
  
  const handleFaqCategoryEdit = (category: MemberPortalFaqCategory) => {
    setEditingFaqCategory(category);
    setNewFaqCategory({
      name: category.name,
      order: category.order,
      questions: category.questions
    });
    setFaqCategoryDialogOpen(true);
  };
  
  const handleFaqCategoryDelete = (id: string) => {
    setConfig(prev => ({
      ...prev,
      faqCategories: prev.faqCategories.filter(c => c.id !== id)
    }));
  };
  
  // FAQ Question handlers
  const handleFaqQuestionSubmit = () => {
    if (!selectedCategoryId) return;
    
    const categoryIndex = config.faqCategories.findIndex(c => c.id === selectedCategoryId);
    if (categoryIndex === -1) return;
    
    if (editingFaqQuestion) {
      // Update existing question
      const updatedCategories = [...config.faqCategories];
      const questionIndex = updatedCategories[categoryIndex].questions.findIndex(q => q.id === editingFaqQuestion.id);
      
      if (questionIndex !== -1) {
        updatedCategories[categoryIndex].questions[questionIndex] = {
          ...editingFaqQuestion,
          question: newFaqQuestion.question || "",
          answer: newFaqQuestion.answer || "",
          order: newFaqQuestion.order || 0
        };
        
        setConfig(prev => ({
          ...prev,
          faqCategories: updatedCategories
        }));
      }
    } else {
      // Add new question
      const nextOrder = config.faqCategories[categoryIndex].questions.length > 0 
        ? Math.max(...config.faqCategories[categoryIndex].questions.map(q => q.order)) + 1 
        : 0;
        
      const question: MemberPortalFaqQuestion = {
        id: `faq-question-${Date.now()}`,
        question: newFaqQuestion.question || "",
        answer: newFaqQuestion.answer || "",
        order: newFaqQuestion.order ?? nextOrder
      };
      
      const updatedCategories = [...config.faqCategories];
      updatedCategories[categoryIndex].questions.push(question);
      
      setConfig(prev => ({
        ...prev,
        faqCategories: updatedCategories
      }));
    }
    
    // Reset form and close dialog
    setNewFaqQuestion({
      question: "",
      answer: "",
      order: 0
    });
    setEditingFaqQuestion(null);
    setFaqQuestionDialogOpen(false);
  };
  
  const handleFaqQuestionEdit = (categoryId: string, question: MemberPortalFaqQuestion) => {
    setSelectedCategoryId(categoryId);
    setEditingFaqQuestion(question);
    setNewFaqQuestion({
      question: question.question,
      answer: question.answer,
      order: question.order
    });
    setFaqQuestionDialogOpen(true);
  };
  
  const handleFaqQuestionDelete = (categoryId: string, questionId: string) => {
    const categoryIndex = config.faqCategories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const updatedCategories = [...config.faqCategories];
    updatedCategories[categoryIndex].questions = updatedCategories[categoryIndex].questions.filter(q => q.id !== questionId);
    
    setConfig(prev => ({
      ...prev,
      faqCategories: updatedCategories
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Settings</CardTitle>
        <CardDescription>
          Manage announcements, resources, and FAQs for the member portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>
          
          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Announcements</h3>
                <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}</DialogTitle>
                      <DialogDescription>
                        {editingAnnouncement ? "Update announcement details" : "Create a new announcement for the member portal"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-title">Title</Label>
                        <Input
                          id="announcement-title"
                          value={newAnnouncement.title || ""}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          placeholder="e.g., Holiday Hours, New Class Schedule, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="announcement-content">Content</Label>
                        <Textarea
                          id="announcement-content"
                          value={newAnnouncement.content || ""}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          placeholder="Announcement content..."
                          rows={5}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Publish Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newAnnouncement.publishDate ? (
                                  format(new Date(newAnnouncement.publishDate), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newAnnouncement.publishDate ? new Date(newAnnouncement.publishDate) : undefined}
                                onSelect={(date) => setNewAnnouncement({ ...newAnnouncement, publishDate: date ? date.toISOString() : new Date().toISOString() })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>Expiry Date (Optional)</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newAnnouncement.expiryDate ? (
                                  format(new Date(newAnnouncement.expiryDate), "PPP")
                                ) : (
                                  <span>No expiry</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <div className="p-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setNewAnnouncement({ ...newAnnouncement, expiryDate: undefined })}
                                >
                                  Clear date
                                </Button>
                              </div>
                              <Calendar
                                mode="single"
                                selected={newAnnouncement.expiryDate ? new Date(newAnnouncement.expiryDate) : undefined}
                                onSelect={(date) => setNewAnnouncement({ ...newAnnouncement, expiryDate: date ? date.toISOString() : undefined })}
                                fromDate={newAnnouncement.publishDate ? new Date(newAnnouncement.publishDate) : new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="announcement-sticky"
                            checked={newAnnouncement.isSticky}
                            onCheckedChange={(checked) => 
                              setNewAnnouncement({ ...newAnnouncement, isSticky: checked })
                            }
                          />
                          <Label htmlFor="announcement-sticky">Pin to top of announcements</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="announcement-important"
                            checked={newAnnouncement.isImportant}
                            onCheckedChange={(checked) => 
                              setNewAnnouncement({ ...newAnnouncement, isImportant: checked })
                            }
                          />
                          <Label htmlFor="announcement-important">Mark as important</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="announcement-published"
                            checked={newAnnouncement.isPublished}
                            onCheckedChange={(checked) => 
                              setNewAnnouncement({ ...newAnnouncement, isPublished: checked })
                            }
                          />
                          <Label htmlFor="announcement-published">
                            {newAnnouncement.isPublished ? "Published" : "Draft"}
                          </Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAnnouncementSubmit}>
                        {editingAnnouncement ? "Update" : "Add"} Announcement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {config.announcements.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">No Announcements</h3>
                  <p className="text-muted-foreground mb-4">Create announcements to display on the member portal</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setAnnouncementDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Announcement
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Publish Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.announcements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Megaphone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              {announcement.title}
                              <div className="flex gap-1.5 mt-1">
                                {announcement.isSticky && (
                                  <Badge variant="secondary" className="text-xs">Pinned</Badge>
                                )}
                                {announcement.isImportant && (
                                  <Badge variant="default" className="text-xs">Important</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={announcement.isPublished ? "outline" : "secondary"}>
                            {announcement.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {announcement.publishDate && format(new Date(announcement.publishDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {announcement.expiryDate ? format(new Date(announcement.expiryDate), "MMM d, yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-right flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleAnnouncementEdit(announcement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAnnouncementDelete(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Resources</h3>
                <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
                      <DialogDescription>
                        {editingResource ? "Update resource details" : "Upload documents and resources for members"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="resource-name">Resource Name</Label>
                        <Input
                          id="resource-name"
                          value={newResource.name || ""}
                          onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                          placeholder="e.g., Membership Guide, Workout Plan, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resource-description">Description</Label>
                        <Textarea
                          id="resource-description"
                          value={newResource.description || ""}
                          onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                          placeholder="Brief description of this resource..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="resource-category">Category</Label>
                          <Input
                            id="resource-category"
                            value={newResource.category || ""}
                            onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                            placeholder="e.g., Forms, Guides, Programs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="resource-type">File Type</Label>
                          <Select 
                            value={newResource.fileType} 
                            onValueChange={(value) => setNewResource({ ...newResource, fileType: value })}
                          >
                            <SelectTrigger id="resource-type">
                              <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF Document</SelectItem>
                              <SelectItem value="doc">Word Document</SelectItem>
                              <SelectItem value="xls">Excel Spreadsheet</SelectItem>
                              <SelectItem value="ppt">PowerPoint</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resource-url">File URL</Label>
                        <Input
                          id="resource-url"
                          value={newResource.fileUrl || ""}
                          onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                          placeholder="https://example.com/files/resource.pdf"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter the URL where this file is hosted. For optimal performance, use a CDN or file hosting service.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="resource-visible"
                          checked={newResource.isVisible}
                          onCheckedChange={(checked) => 
                            setNewResource({ ...newResource, isVisible: checked })
                          }
                        />
                        <Label htmlFor="resource-visible">Make this resource visible to members</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setResourceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleResourceSubmit}>
                        {editingResource ? "Update" : "Add"} Resource
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {config.resources.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">No Resources</h3>
                  <p className="text-muted-foreground mb-4">Upload resources like documents, forms, and guides</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setResourceDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Resource
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead className="w-[250px]">Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {resource.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {resource.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {resource.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {resource.fileType.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={resource.isVisible ? "outline" : "secondary"}>
                            {resource.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleResourceEdit(resource)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleResourceDelete(resource.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
          
          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                <Dialog open={faqCategoryDialogOpen} onOpenChange={setFaqCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingFaqCategory ? "Edit FAQ Category" : "Add New FAQ Category"}</DialogTitle>
                      <DialogDescription>
                        Create a category to organize related FAQs
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          value={newFaqCategory.name || ""}
                          onChange={(e) => setNewFaqCategory({ ...newFaqCategory, name: e.target.value })}
                          placeholder="e.g., Membership, Facilities, Classes"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-order">Display Order</Label>
                        <Input
                          id="category-order"
                          type="number"
                          min={0}
                          value={newFaqCategory.order || 0}
                          onChange={(e) => setNewFaqCategory({ ...newFaqCategory, order: parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Categories are displayed in ascending order (0 appears first)
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setFaqCategoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleFaqCategorySubmit}>
                        {editingFaqCategory ? "Update" : "Add"} Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* FAQ Question Dialog */}
                <Dialog open={faqQuestionDialogOpen} onOpenChange={setFaqQuestionDialogOpen}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingFaqQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
                      <DialogDescription>
                        {editingFaqQuestion ? "Update question details" : "Add a question to the selected category"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="question-text">Question</Label>
                        <Input
                          id="question-text"
                          value={newFaqQuestion.question || ""}
                          onChange={(e) => setNewFaqQuestion({ ...newFaqQuestion, question: e.target.value })}
                          placeholder="e.g., How do I cancel my membership?"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="question-answer">Answer</Label>
                        <Textarea
                          id="question-answer"
                          value={newFaqQuestion.answer || ""}
                          onChange={(e) => setNewFaqQuestion({ ...newFaqQuestion, answer: e.target.value })}
                          placeholder="Detailed answer to the question..."
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="question-order">Display Order</Label>
                        <Input
                          id="question-order"
                          type="number"
                          min={0}
                          value={newFaqQuestion.order || 0}
                          onChange={(e) => setNewFaqQuestion({ ...newFaqQuestion, order: parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Questions are displayed in ascending order (0 appears first)
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setFaqQuestionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleFaqQuestionSubmit}>
                        {editingFaqQuestion ? "Update" : "Add"} Question
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {config.faqCategories.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">No FAQ Categories</h3>
                  <p className="text-muted-foreground mb-4">Create categories and add frequently asked questions</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFaqCategoryDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {config.faqCategories.map((category) => (
                    <Card key={category.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30 py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileQuestion className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">{category.name}</h4>
                            <Badge variant="outline" className="ml-2">
                              {category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => {
                                setSelectedCategoryId(category.id);
                                setEditingFaqQuestion(null);
                                setNewFaqQuestion({
                                  question: '',
                                  answer: '',
                                  order: 0
                                });
                                setFaqQuestionDialogOpen(true);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Question
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => handleFaqCategoryEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => handleFaqCategoryDelete(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {category.questions.length === 0 ? (
                          <div className="text-center py-6 border rounded-md bg-muted/20">
                            <p className="text-muted-foreground mb-2">No questions in this category</p>
                            <Button
                              variant="link"
                              onClick={() => {
                                setSelectedCategoryId(category.id);
                                setFaqQuestionDialogOpen(true);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add First Question
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {category.questions
                              .sort((a, b) => a.order - b.order)
                              .map((question) => (
                                <div key={question.id} className="border rounded-md p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium">{question.question}</h5>
                                      <p className="text-muted-foreground mt-1 text-sm">
                                        {question.answer}
                                      </p>
                                    </div>
                                    <div className="flex gap-1 ml-4">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={() => handleFaqQuestionEdit(category.id, question)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={() => handleFaqQuestionDelete(category.id, question.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button onClick={onSave} disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? "Saving..." : "Save Content Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
