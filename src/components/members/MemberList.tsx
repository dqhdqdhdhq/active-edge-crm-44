import { Member, MemberTag } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from "lucide-react";

interface MemberListProps {
  members: Member[];
  onViewMember: (member: Member) => void;
}

export const MemberList = ({ members, onViewMember }: MemberListProps) => {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-secondary text-left">
          <tr>
            <th className="w-1/6 px-4 py-2 font-medium text-muted-foreground">Name</th>
            <th className="w-1/6 px-4 py-2 font-medium text-muted-foreground">Email</th>
            <th className="w-1/6 px-4 py-2 font-medium text-muted-foreground">Phone</th>
            <th className="w-1/6 px-4 py-2 font-medium text-muted-foreground">Status</th>
            <th className="w-1/6 px-4 py-2 font-medium text-muted-foreground">Tags</th>
            <th className="w-1/6 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle font-medium">{member.firstName} {member.lastName}</td>
              <td className="p-4 align-middle text-muted-foreground">{member.email}</td>
              <td className="p-4 align-middle text-muted-foreground">{member.phone}</td>
              <td className="p-4 align-middle">
                <Badge variant="secondary">{member.membershipStatus}</Badge>
              </td>
              <td className="p-4 align-middle">
                <div className="flex gap-1">
                  {member.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </td>
              <td className="p-4 align-middle">
                <Button variant="outline" size="sm" onClick={() => onViewMember(member)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
