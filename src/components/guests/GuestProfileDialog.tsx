import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Phone, Mail, Calendar, CheckCircle, XCircle, Edit, UserPlus, FileText, StickyNote, Clock } from 'lucide-react';

import { Guest, GuestVisit, GuestStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface GuestProfileDialogProps {
  guest: Guest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
  onConvertToMember?: () => void;
}

export function GuestProfileDialog({
  guest,
  open,
  onOpenChange,
  onEditClick,
  onConvertToMember,
}: GuestProfileDialogProps) {
  const [notes, setNotes] = useState(guest?.notes || '');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const toggleNotesExpansion = () => {
    setIsNotesExpanded(!isNotesExpanded);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Guest Profile</DialogTitle>
          <DialogDescription>
            View and manage guest information.
          </DialogDescription>
        </DialogHeader>

        {guest ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={guest.profileImage} alt={guest.firstName} />
                  <AvatarFallback>{guest.firstName[0]}{guest.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{guest.firstName} {guest.lastName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {guest.email}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {guest.status}
                    </Badge>
                    {guest.convertedToMember && (
                      <Badge variant="outline">
                        Converted to Member
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onEditClick && (
                    <DropdownMenuItem onClick={onEditClick}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                  )}
                  {onConvertToMember && (
                    <DropdownMenuItem onClick={onConvertToMember}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Convert to Member
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{guest.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{guest.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Visit Purpose: {guest.visitPurpose}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {guest.waiverSigned ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Waiver Signed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Waiver Not Signed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium">Visit Information</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Check-In: {format(new Date(guest.checkInDateTime), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    {guest.checkOutDateTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Check-Out: {format(new Date(guest.checkOutDateTime), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    )}
                    {guest.referralSource && (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                        <span>Referral Source: {guest.referralSource}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium">Visit History</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {guest.visitHistory.map((visit) => (
                          <TableRow key={visit.id}>
                            <TableCell>{format(new Date(visit.checkInDateTime), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{visit.purpose}</TableCell>
                            <TableCell>{visit.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium flex items-center justify-between">
                    <span>Notes</span>
                    <Button variant="ghost" size="sm" onClick={toggleNotesExpansion}>
                      {isNotesExpanded ? 'Collapse' : 'Expand'}
                    </Button>
                  </h3>
                  <Separator className="my-2" />
                  {isNotesExpanded ? (
                    <Textarea
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Add notes about the guest"
                      className="w-full resize-none border-none focus-visible:ring-0 shadow-none"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {notes || 'No notes added.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No guest selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
