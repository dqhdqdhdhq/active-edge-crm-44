
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MemberPortalConfig, MemberPortalAnnouncement, MemberPortalResource, MemberPortalFaqCategory } from "@/lib/types";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, FileIcon, Trash, Edit, Plus, FileText, Folder } from "lucide-react";
import { format } from "date-fns";

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
    publishDate: new Date().toISOString().split('T')[0],
    isPublished: true
  });
  
  // Resources
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<MemberPortalResource | null>(null);
  const [newResource, setNewResource] = useState<Partial<MemberPortalResource>>({
    name: "",
    description: "",
    category: "General",
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingFaqQuestion, setEditingFaqQuestion] = useState<{id: string, question: string, answer: string, order: number} | null>(null);
  const [newFaqQuestion, setNewFaqQuestion] = useState<{question: string, answer: string, order: number}>({
    question: "",
    answer: "",
    order: 0
  });

  // Announcements handlers
  const handleAnnouncementSubmit = () => {
    if (editingAnnouncement) {
      // Update existing announcement
      setConfig(prev => ({
        ...prev,
        announcements: prev.announcements.map(a => 
          a.id === editingAnnouncement.id ? { ...editingAnnouncement, ...newAnnouncement } : a
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
      publishDate: new Date().toISOString().split('T')[0],
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
      publishDate: announcement.publishDate.split('T')[0],
      expiryDate: announcement.expiryDate?.split('T')[0],
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
          r.id === editingResource.id ? { ...editingResource, ...newResource } : r
        )
      }));
    } else {
      // Add new resource
      const resource: MemberPortalResource = {
        id: `resource-${Date.now()}`,
        name: newResource.name || "",
        description: newResource.description || "",
        category: newResource.category || "General",
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
      category: "General",
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
          c.id === editingFaqCategory.id ? { ...editingFaqCategory, name: newFaqCategory.name || "", order: newFaqCategory.order || 0 } : c
        )
      }));
    } else {
      // Add new category
      const category: MemberPortalFaqCategory = {
        id: `faq-category-${Date.now()}`,
        name: newFaqCategory.name || "",
        order: config.faqCategories.length,
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
      order: category.order
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
    
    if (editingFaqQuestion) {
      // Update existing question
      setConfig(prev => ({
        ...prev,
        faqCategories: prev.faqCategories.map(c => 
          c.id === selectedCategoryId 
            ? {
                ...c, 
                questions: c.questions.map(q => 
                  q.id === editingFaqQuestion.id 
                    ? { ...q, question: newFaqQuestion.question, answer: newFaqQuestion.answer, order: newFaqQuestion.order } 
                    : q
                )
              } 
            : c
        )
      }));
    } else {
      // Add new question
      const question = {
        id: `faq-question-${Date.now()}`,
        question: newFaqQuestion.question,
        answer: newFaqQuestion.answer,
        order: newFaqQuestion.order
      };
      
      setConfig(prev => ({
        ...prev,
        faqCategories: prev.faqCategories.map(c => 
          c.id === selectedCategoryId 
            ? { ...c, questions: [...c.questions, question] } 
            : c
        )
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
  
  const handleAddFaqQuestion = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const category = config.faqCategories.find(c => c.id === categoryId);
    if (category) {
      setNewFaqQuestion({
        question: "",
        answer: "",
        order: category.questions.length
      });
    }
    setFaqQuestionDialogOpen(true);
  };
  
  const handleFaqQuestionEdit = (categoryId: string, question: { id: string, question: string, answer: string, order: number }) => {
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
    setConfig(prev => ({
      ...prev,
      faqCategories: prev.faqCategories.map(c => 
        c.id === categoryId 
          ? { ...c, questions: c.questions.filter(q => q.id !== questionId) } 
          : c
      )
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>
          Manage content that will be displayed to members in the portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="resources">Resource Library</TabsTrigger>
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="announcement-content">Content</Label>
                        <Textarea
                          id="announcement-content"
                          value={newAnnouncement.content || ""}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          rows={6}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="publish-date">Publish Date</Label>
                          <Input
                            id="publish-date"
                            type="date"
                            value={newAnnouncement.publishDate || ""}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, publishDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                          <Input
                            id="expiry-date"
                            type="date"
                            value={newAnnouncement.expiryDate || ""}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiryDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is-sticky"
                            checked={newAnnouncement.isSticky}
                            onCheckedChange={(checked) => 
                              setNewAnnouncement({ ...newAnnouncement, isSticky: checked as boolean })
                            }
                          />
                          <Label htmlFor="is-sticky">Sticky (Pin to top)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is-important"
                            checked={newAnnouncement.isImportant}
                            onCheckedChange={(checked) => 
                              setNewAnnouncement({ ...newAnnouncement, isImportant: checked as boolean })
                            }
                          />
                          <Label htmlFor="is-important">Mark as Important</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is-published"
                            checked={newAnnouncement.isPublished}
                            onCheckedChange={(checked) => 
                              setNewAnnouncement({ ...newAnnouncement, isPublished: checked as boolean })
                            }
                          />
                          <Label htmlFor="is-published">Published</Label>
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
                  <h3 className="text-lg font-medium mb-2">No Announcements Yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first announcement for the member portal</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setAnnouncementDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Announcement
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
                          {announcement.title}
                          <div className="flex gap-1 mt-1">
                            {announcement.isSticky && (
                              <Badge variant="outline" className="text-xs">Sticky</Badge>
                            )}
                            {announcement.isImportant && (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 text-xs">
                                Important
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={announcement.isPublished ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {announcement.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(announcement.publishDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {announcement.expiryDate 
                            ? new Date(announcement.expiryDate).toLocaleDateString() 
                            : "No expiry"}
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
          
          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Resource Library</h3>
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
                        {editingResource ? "Update resource details" : "Upload a new resource to the library"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="resource-name">Resource Name</Label>
                        <Input
                          id="resource-name"
                          value={newResource.name || ""}
                          onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resource-description">Description</Label>
                        <Textarea
                          id="resource-description"
                          value={newResource.description || ""}
                          onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resource-category">Category</Label>
                        <Input
                          id="resource-category"
                          value={newResource.category || ""}
                          onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                          placeholder="e.g., Gym Policies, Nutrition Guides, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resource-file">File Upload</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" className="h-10">
                            Upload File
                          </Button>
                          <Input
                            id="resource-file-url"
                            placeholder="Or enter file URL"
                            value={newResource.fileUrl || ""}
                            onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resource-file-type">File Type</Label>
                        <Input
                          id="resource-file-type"
                          value={newResource.fileType || ""}
                          onChange={(e) => setNewResource({ ...newResource, fileType: e.target.value })}
                          placeholder="e.g., pdf, docx, jpg"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="resource-visible"
                          checked={newResource.isVisible}
                          onCheckedChange={(checked) => 
                            setNewResource({ ...newResource, isVisible: checked })
                          }
                        />
                        <Label htmlFor="resource-visible">Visible to Members</Label>
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
                  <h3 className="text-lg font-medium mb-2">Resource Library Empty</h3>
                  <p className="text-muted-foreground mb-4">Upload documents, guides, and other resources for your members</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setResourceDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Resource</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileIcon className="h-4 w-4" />
                            <div>
                              <div>{resource.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                                {resource.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>{resource.fileType.toUpperCase()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={resource.isVisible ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {resource.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(resource.uploadDate).toLocaleDateString()}
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
          
          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">FAQs</h3>
                <Dialog open={faqCategoryDialogOpen} onOpenChange={setFaqCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add FAQ Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingFaqCategory ? "Edit Category" : "Add New FAQ Category"}</DialogTitle>
                      <DialogDescription>
                        {editingFaqCategory ? "Update category details" : "Create a new category for organizing FAQs"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          value={newFaqCategory.name || ""}
                          onChange={(e) => setNewFaqCategory({ ...newFaqCategory, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-order">Display Order</Label>
                        <Input
                          id="category-order"
                          type="number"
                          min="0"
                          value={newFaqCategory.order}
                          onChange={(e) => setNewFaqCategory({ 
                            ...newFaqCategory, 
                            order: parseInt(e.target.value) || 0 
                          })}
                        />
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
              </div>
              
              {/* Question Dialog */}
              <Dialog open={faqQuestionDialogOpen} onOpenChange={setFaqQuestionDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingFaqQuestion ? "Edit Question" : "Add New FAQ Question"}</DialogTitle>
                    <DialogDescription>
                      {editingFaqQuestion ? "Update question details" : "Add a new question and answer"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="faq-question">Question</Label>
                      <Input
                        id="faq-question"
                        value={newFaqQuestion.question}
                        onChange={(e) => setNewFaqQuestion({ ...newFaqQuestion, question: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faq-answer">Answer</Label>
                      <Textarea
                        id="faq-answer"
                        value={newFaqQuestion.answer}
                        onChange={(e) => setNewFaqQuestion({ ...newFaqQuestion, answer: e.target.value })}
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="question-order">Display Order</Label>
                      <Input
                        id="question-order"
                        type="number"
                        min="0"
                        value={newFaqQuestion.order}
                        onChange={(e) => setNewFaqQuestion({ 
                          ...newFaqQuestion, 
                          order: parseInt(e.target.value) || 0 
                        })}
                      />
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
              
              {config.faqCategories.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/30">
                  <h3 className="text-lg font-medium mb-2">No FAQ Categories</h3>
                  <p className="text-muted-foreground mb-4">Create categories to organize your frequently asked questions</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFaqCategoryDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add FAQ Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {config.faqCategories.map((category) => (
                    <div key={category.id} className="border rounded-md">
                      <div className="flex justify-between items-center p-4 border-b">
                        <div className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-medium">{category.name}</h4>
                          <Badge variant="outline" className="ml-2">
                            {category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddFaqQuestion(category.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleFaqCategoryEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleFaqCategoryDelete(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {category.questions.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <p>No questions in this category</p>
                          <Button 
                            variant="link" 
                            onClick={() => handleAddFaqQuestion(category.id)}
                          >
                            Add a question
                          </Button>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {category.questions.map((question) => (
                            <div key={question.id} className="p-4 hover:bg-muted/30">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <h5 className="font-medium">{question.question}</h5>
                                  </div>
                                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                                    {question.answer.length > 100 
                                      ? `${question.answer.substring(0, 100)}...` 
                                      : question.answer}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleFaqQuestionEdit(category.id, question)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleFaqQuestionDelete(category.id, question.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
