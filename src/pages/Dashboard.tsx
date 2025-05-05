
import { useState } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { WelcomeMessage } from '@/components/dashboard/WelcomeMessage';
import { UpcomingSchedule } from '@/components/dashboard/UpcomingSchedule';
import { RoleSwitcher } from '@/components/dashboard/RoleSwitcher';
import { 
  dashboardStats, 
  gymClasses, 
  recentCheckIns, 
  notes 
} from '@/data/mockData';

// Define the possible user roles
export type UserRole = 'owner' | 'staff' | 'trainer';

const Dashboard = () => {
  // In a real app, this would come from authentication context
  // For now, we'll use state to simulate different roles
  const [userRole, setUserRole] = useState<UserRole>('owner');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        {/* Role switcher for demonstration purposes */}
        <RoleSwitcher currentRole={userRole} onRoleChange={setUserRole} />
      </div>

      {/* Welcome message with personalized greeting */}
      <WelcomeMessage userRole={userRole} />
      
      {/* Key statistics that change based on role */}
      <DashboardStats stats={dashboardStats} userRole={userRole} />
      
      {/* Quick action buttons that change based on role */}
      <QuickActions userRole={userRole} />
      
      {/* Upcoming schedule relevant to the user */}
      <UpcomingSchedule classes={gymClasses} userRole={userRole} />
      
      {/* Recent activity feed */}
      <RecentActivity 
        checkIns={recentCheckIns}
        classes={gymClasses}
        notes={notes}
        userRole={userRole}
      />
    </div>
  );
};

export default Dashboard;
