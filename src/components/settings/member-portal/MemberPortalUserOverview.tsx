
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Mail, 
  UserX, 
  User, 
  CheckCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberPortalUser } from "@/lib/types";

interface MemberPortalUserOverviewProps {
  onSave: () => void;
  isSaving: boolean;
}

export function MemberPortalUserOverview({ 
  onSave, 
  isSaving 
}: MemberPortalUserOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MemberPortalUser | null>(null);
  const [disableReason, setDisableReason] = useState("");
  
  // Mock users data
  const [users, setUsers] = useState<MemberPortalUser[]>([
    {
      id: "user-1",
      memberId: "mem-001",
      memberName: "John Smith",
      status: "Active",
      lastLoginDate: "2025-05-15T10:23:45",
      inviteSentDate: "2025-04-20T14:30:00"
    },
    {
      id: "user-2",
      memberId: "mem-002",
      memberName: "Sarah Johnson",
      status: "Never Logged In",
      inviteSentDate: "2025-05-10T09:15:00"
    },
    {
      id: "user-3",
      memberId: "mem-003",
      memberName: "Michael Brown",
      status: "Disabled",
      lastLoginDate: "2025-05-01T16:45:22",
      inviteSentDate: "2025-02-15T11:20:00"
    },
    {
      id: "user-4",
      memberId: "mem-004",
      memberName: "Jessica Williams",
      status: "Active",
      lastLoginDate: "2025-05-18T08:12:33",
      inviteSentDate: "2025-03-05T15:40:00"
    },
    {
      id: "user-5",
      memberId: "mem-005",
      memberName: "David Miller",
      status: "Invited",
      inviteSentDate: "2025-05-19T10:30:00"
    }
  ]);

  const filteredUsers = users.filter(user => 
    user.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResendInvite = (userId: string) => {
    // Simulate resending invite
    setTimeout(() => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, inviteSentDate: new Date().toISOString() } 
            : user
        )
      );
    }, 500);
  };

  const handleDisableUser = () => {
    if (!selectedUser) return;
    
    // Update user status
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: "Disabled" } 
          : user
      )
    );
    
    // Close dialog and reset
    setDisableDialogOpen(false);
    setSelectedUser(null);
    setDisableReason("");
  };
  
  const handleEnableUser = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: "Active" } 
          : user
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">{status}</Badge>;
      case "Disabled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">{status}</Badge>;
      case "Invited":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">{status}</Badge>;
      case "Never Logged In":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portal User Overview</CardTitle>
        <CardDescription>
          View and manage user access to the member portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Disable User Dialog */}
        <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disable Portal Access</DialogTitle>
              <DialogDescription>
                This will prevent the user from accessing the member portal until re-enabled.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Member</Label>
                <div className="font-medium">{selectedUser?.memberName}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Disabling</Label>
                <Select onValueChange={(value) => setDisableReason(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account-delinquent">Account Delinquent</SelectItem>
                    <SelectItem value="membership-expired">Membership Expired</SelectItem>
                    <SelectItem value="inappropriate-behavior">Inappropriate Behavior</SelectItem>
                    <SelectItem value="member-request">Member Request</SelectItem>
                    <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {disableReason === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-reason">Specify Reason</Label>
                  <Textarea id="custom-reason" rows={3} />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDisableDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDisableUser}>
                Disable Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Invitation Sent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {user.memberName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      {user.lastLoginDate 
                        ? new Date(user.lastLoginDate).toLocaleDateString() 
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      {user.inviteSentDate 
                        ? new Date(user.inviteSentDate).toLocaleDateString() 
                        : "Not Sent"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {(user.status === "Invited" || user.status === "Never Logged In") && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResendInvite(user.id)}
                          >
                            <Mail className="mr-1 h-4 w-4" />
                            Resend Invite
                          </Button>
                        )}
                        
                        {user.status === "Disabled" ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEnableUser(user.id)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Enable Access
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setDisableDialogOpen(true);
                            }}
                          >
                            <UserX className="mr-1 h-4 w-4" />
                            Disable Access
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Export/Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline">
              Export User List
            </Button>
            
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
