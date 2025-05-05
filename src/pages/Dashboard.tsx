
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { 
  dashboardStats, 
  gymClasses, 
  recentCheckIns, 
  notes 
} from '@/data/mockData';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <DashboardStats stats={dashboardStats} />
      
      <QuickActions />
      
      <RecentActivity 
        checkIns={recentCheckIns}
        classes={gymClasses}
        notes={notes}
      />
    </div>
  );
};

export default Dashboard;
