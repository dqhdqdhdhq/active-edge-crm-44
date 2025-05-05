
import { Button } from "@/components/ui/button";
import { UserRole } from "@/pages/Dashboard";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={currentRole === 'owner' ? 'default' : 'outline'}
        onClick={() => onRoleChange('owner')}
      >
        Owner View
      </Button>
      <Button
        size="sm"
        variant={currentRole === 'staff' ? 'default' : 'outline'}
        onClick={() => onRoleChange('staff')}
      >
        Staff View
      </Button>
      <Button
        size="sm"
        variant={currentRole === 'trainer' ? 'default' : 'outline'}
        onClick={() => onRoleChange('trainer')}
      >
        Trainer View
      </Button>
    </div>
  );
}
