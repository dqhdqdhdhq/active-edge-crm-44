
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  UserPlus, 
  CalendarPlus, 
  Search, 
  ArrowRight,
  Settings,
  FileText,
  DollarSign,
  Calendar,
  Users,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { UserRole } from "@/pages/Dashboard";

interface QuickActionsProps {
  userRole: UserRole;
}

export function QuickActions({ userRole }: QuickActionsProps) {
  // Define actions based on user role
  const getActionsByRole = () => {
    // Common actions for all roles
    const commonActions = [
      {
        icon: <Search className="h-5 w-5" />,
        label: "Find Member",
        link: "/members",
        asLink: true
      }
    ];

    // Role specific actions
    if (userRole === 'owner') {
      return [
        ...commonActions,
        {
          icon: <UserPlus className="h-5 w-5" />,
          label: "Add Member",
          link: "#",
          asLink: false
        },
        {
          icon: <Plus className="h-5 w-5" />,
          label: "Check-in",
          link: "/check-in",
          asLink: true
        },
        {
          icon: <FileText className="h-5 w-5" />,
          label: "Reports",
          link: "/reports",
          asLink: true
        },
        {
          icon: <Settings className="h-5 w-5" />,
          label: "Settings",
          link: "/settings",
          asLink: true
        }
      ];
    }

    if (userRole === 'staff') {
      return [
        ...commonActions,
        {
          icon: <UserPlus className="h-5 w-5" />,
          label: "Add Member",
          link: "#",
          asLink: false
        },
        {
          icon: <Plus className="h-5 w-5" />,
          label: "Check-in",
          link: "/check-in",
          asLink: true
        },
        {
          icon: <CalendarPlus className="h-5 w-5" />,
          label: "Schedule Class",
          link: "#",
          asLink: false
        },
        {
          icon: <DollarSign className="h-5 w-5" />,
          label: "Payments",
          link: "#",
          asLink: false
        }
      ];
    }

    if (userRole === 'trainer') {
      return [
        ...commonActions,
        {
          icon: <Calendar className="h-5 w-5" />,
          label: "My Schedule",
          link: "#",
          asLink: false
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: "My Clients",
          link: "#",
          asLink: false
        },
        {
          icon: <Plus className="h-5 w-5" />,
          label: "Check-in",
          link: "/check-in",
          asLink: true
        }
      ];
    }

    // Default return common actions if no role matches
    return commonActions;
  };

  const actions = getActionsByRole();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common gym management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            action.asLink ? (
              <Button 
                key={index}
                className="flex flex-col h-auto gap-1 py-4" 
                variant="secondary" 
                asChild
              >
                <Link to={action.link}>
                  {action.icon}
                  <span className="text-xs">{action.label}</span>
                </Link>
              </Button>
            ) : (
              <Button 
                key={index}
                className="flex flex-col h-auto gap-1 py-4" 
                variant="secondary"
              >
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </Button>
            )
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="link" className="p-0 text-xs flex items-center h-auto">
            View all actions
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
