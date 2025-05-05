
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageTitle } from '@/components/ui/page-title';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AlertsNotifications } from '@/components/dashboard/AlertsNotifications';
import { MySchedule } from '@/components/dashboard/MySchedule';
import { TrainerLeaderboard } from '@/components/dashboard/TrainerLeaderboard';
import { 
  dashboardStats, 
  gymClasses, 
  recentCheckIns, 
  notes,
  trainerPerformance
} from '@/data/mockData';

// This would normally come from an auth context
type UserRole = 'admin' | 'front-desk' | 'trainer';

const Dashboard = () => {
  // In a real app, this would come from auth context
  const [userRole, setUserRole] = useState<UserRole>('admin');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageTitle 
          title="Dashboard" 
          description={`Welcome back! Here's your ${userRole} dashboard.`} 
        />
        
        {/* Role switcher - this would be removed in production, just for demo */}
        <Card className="w-full sm:w-auto">
          <CardContent className="p-3">
            <Tabs 
              defaultValue={userRole} 
              className="w-full" 
              onValueChange={(value) => setUserRole(value as UserRole)}
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="front-desk">Front Desk</TabsTrigger>
                <TabsTrigger value="trainer">Trainer</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Snapshot */}
      <DashboardStats stats={dashboardStats} userRole={userRole} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPIs - Mainly for Admin */}
        {(userRole === 'admin' || userRole === 'front-desk') && (
          <DashboardKPIs />
        )}
        
        {/* Alerts & Notifications */}
        <AlertsNotifications userRole={userRole} />
      </div>
      
      {/* Quick Actions */}
      <QuickActions userRole={userRole} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Schedule - For trainers and staff */}
        {(userRole === 'trainer' || userRole === 'front-desk') && (
          <MySchedule classes={gymClasses} userRole={userRole} />
        )}
        
        {/* Recent Activity */}
        <div className={`${userRole === 'trainer' ? 'lg:col-span-2' : ''}`}>
          <RecentActivity 
            checkIns={recentCheckIns}
            classes={gymClasses}
            notes={notes}
            userRole={userRole}
          />
        </div>
        
        {/* Trainer Leaderboard - For admin and trainers */}
        {(userRole === 'admin' || userRole === 'trainer') && (
          <TrainerLeaderboard 
            performance={trainerPerformance}
            isTrainer={userRole === 'trainer'}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
