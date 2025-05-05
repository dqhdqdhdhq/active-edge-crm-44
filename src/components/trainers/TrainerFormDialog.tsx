
import { useState } from "react";
import { Trainer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Upload } from "lucide-react";

interface TrainerFormDialogProps {
  trainer?: Trainer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (trainer: Partial<Trainer>) => void;
}

const defaultAvailability = [
  { day: "Monday", startTime: "08:00", endTime: "17:00" },
  { day: "Tuesday", startTime: "08:00", endTime: "17:00" },
  { day: "Wednesday", startTime: "08:00", endTime: "17:00" },
  { day: "Thursday", startTime: "08:00", endTime: "17:00" },
  { day: "Friday", startTime: "08:00", endTime: "17:00" },
];

export function TrainerFormDialog({ 
  trainer, 
  open, 
  onOpenChange, 
  onSave 
}: TrainerFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Trainer>>(
    trainer || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialties: [],
      certifications: [],
      bio: "",
      availability: defaultAvailability,
      profileImage: "",
      assignedClasses: [],
      assignedMembers: [],
    }
  );
  
  const [specialty, setSpecialty] = useState("");
  const [certification, setCertification] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSpecialty = () => {
    if (specialty && !formData.specialties?.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...(prev.specialties || []), specialty]
      }));
      setSpecialty("");
    }
  };
  
  const handleRemoveSpecialty = (item: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties?.filter(s => s !== item) || []
    }));
  };
  
  const handleAddCertification = () => {
    if (certification && !formData.certifications?.includes(certification)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), certification]
      }));
      setCertification("");
    }
  };
  
  const handleRemoveCertification = (item: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications?.filter(c => c !== item) || []
    }));
  };
  
  const handleUpdateAvailability = (index: number, field: "startTime" | "endTime", value: string) => {
    setFormData(prev => {
      const newAvailability = [...(prev.availability || [])];
      newAvailability[index] = {
        ...newAvailability[index],
        [field]: value
      };
      return {
        ...prev,
        availability: newAvailability
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pt-6 px-6">
            <DialogTitle>
              {trainer ? "Edit Trainer" : "Add New Trainer"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="mt-4">
            <div className="px-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="px-6 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
              <TabsContent value="basic" className="space-y-4 mt-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.profileImage} />
                    <AvatarFallback>
                      {formData.firstName?.[0]}{formData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    onValueChange={value => handleSelectChange("status", value)} 
                    defaultValue="active"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="onLeave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    value={formData.bio} 
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="qualifications" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Specialties</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add specialty..." 
                        value={specialty} 
                        onChange={e => setSpecialty(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddSpecialty}>Add</Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.specialties?.map((item, i) => (
                        <div key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                          <span>{item}</span>
                          <button 
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveSpecialty(item)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add certification..." 
                        value={certification} 
                        onChange={e => setCertification(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddCertification}>Add</Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.certifications?.map((item, i) => (
                        <div key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                          <span>{item}</span>
                          <button 
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveCertification(item)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label>Regular Availability</Label>
                  {formData.availability?.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="w-24 font-medium">{slot.day}:</span>
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <Input 
                          type="time" 
                          value={slot.startTime} 
                          onChange={e => handleUpdateAvailability(index, "startTime", e.target.value)} 
                        />
                        <Input 
                          type="time" 
                          value={slot.endTime} 
                          onChange={e => handleUpdateAvailability(index, "endTime", e.target.value)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {trainer ? "Save Changes" : "Add Trainer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
