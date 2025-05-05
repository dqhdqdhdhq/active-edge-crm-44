
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, CalendarPlus, Search, ArrowRight, FileText, Settings, MessageSquare, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsProps {
  userRole: 'admin' | 'front-desk' | 'trainer';
}

export function QuickActions({ userRole }: QuickActionsProps) {
  // Define actions based on user role
  const actions = [
    // Common actions for all roles
    {
      icon: <Search className="h-5 w-5" />,
      label: "Find Member",
      path: "/members",
      show: ['admin', 'front-desk', 'trainer']
    },
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Check-in Member",
      path: "/check-in",
      show: ['admin', 'front-desk', 'trainer']
    },
    // Front desk & Admin actions
    {
      icon: <UserPlus className="h-5 w-5" />,
      label: "Add Member",
      path: "/members",
      show: ['admin', 'front-desk']
    },
    {
      icon: <CalendarPlus className="h-5 w-5" />,
      label: "Schedule Class",
      path: "/classes",
      show: ['admin', 'front-desk']
    },
    // Admin only actions
    {
      icon: <FileText className="h-5 w-5" />,
      label: "View Reports",
      path: "/reports",
      show: ['admin']
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
      show: ['admin']
    },
    // Trainer actions
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Client Messages",
      path: "/messages",
      show: ['trainer']
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "Process Payment",
      path: "/payments",
      show: ['admin', 'front-desk']
    }
  ];

  // Filter actions based on user role
  const filteredActions = actions.filter(action => action.show.includes(userRole));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common gym management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredActions.slice(0, 8).map((action, index) => (
            <Button 
              key={index}
              className="flex flex-col h-auto gap-1 py-4" 
              variant="secondary" 
              asChild
            >
              <Link to={action.path}>
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="link" className="p-0 text-xs flex items-center h-auto">
            View all actions
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
