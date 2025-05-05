
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, CreditCard, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertProps {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
}

const Alert = ({ type, title, description, action }: AlertProps) => {
  const iconMap = {
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Bell className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />
  };
  
  return (
    <div className="flex items-start gap-3 p-3 border-b last:border-0">
      <div>{iconMap[type]}</div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button size="sm" variant="outline" className="text-xs h-8">
          {action}
        </Button>
      )}
    </div>
  );
};

interface AlertsNotificationsProps {
  userRole: 'admin' | 'front-desk' | 'trainer';
}

export function AlertsNotifications({ userRole }: AlertsNotificationsProps) {
  // Filter alerts based on user role
  const alerts: AlertProps[] = [
    {
      type: 'warning',
      title: '5 Memberships Expiring Today',
      description: 'Members need to be contacted for renewal',
      action: 'View'
    },
    {
      type: 'info',
      title: '3 Member Birthdays Today',
      description: 'Special greeting recommended at check-in',
      action: 'View List'
    },
    {
      type: 'warning',
      title: 'Low Attendance in Evening Yoga',
      description: 'Only 4 of 20 spots booked for today at 6pm',
      action: userRole === 'admin' ? 'Promote' : 'View'
    }
  ];

  if (userRole === 'admin') {
    alerts.push({
      type: 'warning',
      title: '$1,250 in Overdue Payments',
      description: '7 members with outstanding balances',
      action: 'Process'
    });
  }
  
  if (userRole === 'trainer') {
    alerts.push({
      type: 'info',
      title: '2 New Clients Assigned',
      description: 'Initial assessments need to be scheduled',
      action: 'Schedule'
    });
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {alerts.map((alert, index) => (
            <Alert key={index} {...alert} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
