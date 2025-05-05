
import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@/pages/Dashboard";

interface WelcomeMessageProps {
  userRole: UserRole;
}

export function WelcomeMessage({ userRole }: WelcomeMessageProps) {
  // This would be the logged in user's name in a real app
  const userName = "John";
  
  // Different greeting based on user role
  const getRoleSpecificMessage = () => {
    switch (userRole) {
      case 'owner':
        return "Here's what's happening at your gym today.";
      case 'staff':
        return "Here's what you need to know for your shift today.";
      case 'trainer':
        return "Here's your schedule and client updates for today.";
      default:
        return "Welcome to your dashboard.";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-1">Welcome back, {userName}!</h2>
        <p className="text-muted-foreground">{getRoleSpecificMessage()}</p>
      </CardContent>
    </Card>
  );
}
