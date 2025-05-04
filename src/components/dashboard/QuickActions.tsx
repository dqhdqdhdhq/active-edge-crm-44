
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, CalendarPlus, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common gym management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button className="flex flex-col h-auto gap-1 py-4" variant="secondary">
            <UserPlus className="h-5 w-5" />
            <span className="text-xs">Add Member</span>
          </Button>
          
          <Button className="flex flex-col h-auto gap-1 py-4" variant="secondary" asChild>
            <Link to="/check-in">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Check-in Member</span>
            </Link>
          </Button>
          
          <Button className="flex flex-col h-auto gap-1 py-4" variant="secondary">
            <CalendarPlus className="h-5 w-5" />
            <span className="text-xs">Schedule Class</span>
          </Button>
          
          <Button className="flex flex-col h-auto gap-1 py-4" variant="secondary" asChild>
            <Link to="/members">
              <Search className="h-5 w-5" />
              <span className="text-xs">Find Member</span>
            </Link>
          </Button>
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
