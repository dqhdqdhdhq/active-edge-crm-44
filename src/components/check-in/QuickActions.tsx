
import { Button } from '@/components/ui/button';
import { Member } from '@/lib/types';
import { 
  User, 
  CreditCard, 
  Calendar, 
  PenBox, 
  Camera, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  member: Member;
  onAcknowledgeAlert?: () => void;
  hasUnacknowledgedAlerts?: boolean;
}

export const QuickActions = ({ member, onAcknowledgeAlert, hasUnacknowledgedAlerts = false }: QuickActionsProps) => {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isUpdatePhotoOpen, setIsUpdatePhotoOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const { toast } = useToast();

  const handleAddNote = () => {
    // This would actually save the note in a real implementation
    toast({
      title: "Note added",
      description: `Added note to ${member.firstName}'s profile`,
    });
    setNoteText('');
    setIsAddNoteOpen(false);
  };

  const handleUpdatePhoto = () => {
    // This would actually update the photo in a real implementation
    toast({
      title: "Photo updated",
      description: `Updated profile photo for ${member.firstName}`,
    });
    setIsUpdatePhotoOpen(false);
  };

  const handleAcknowledgeAlert = () => {
    if (onAcknowledgeAlert) {
      onAcknowledgeAlert();
      toast({
        title: "Alert acknowledged",
        description: "The alert has been acknowledged and cleared",
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <ExternalLink className="h-3 w-3" />
          View Profile
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Make Payment
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Book Session
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setIsAddNoteOpen(true)}
        >
          <PenBox className="h-4 w-4" />
          Add Note
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setIsUpdatePhotoOpen(true)}
        >
          <Camera className="h-4 w-4" />
          Update Photo
        </Button>
        
        {hasUnacknowledgedAlerts && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleAcknowledgeAlert}
          >
            <Check className="h-4 w-4" />
            Acknowledge Alert
          </Button>
        )}
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note for {member.firstName} {member.lastName}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddNoteOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Photo Dialog */}
      <Dialog open={isUpdatePhotoOpen} onOpenChange={setIsUpdatePhotoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              In a real implementation, this would activate your camera to take a photo.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUpdatePhotoOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePhoto}>
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
