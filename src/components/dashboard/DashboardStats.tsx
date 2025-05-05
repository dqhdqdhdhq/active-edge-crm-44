
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, ArrowUpRight, Timer, UserPlus } from 'lucide-react';
import type { DashboardStats as DashboardStatsType } from '@/lib/types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: React.ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, trend, description }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground flex items-center mt-1">{trend}</p>}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export function DashboardStats({ stats }: { stats: DashboardStatsType }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        title="Today's Check-ins"
        value={stats.todayCheckIns}
        icon={<Timer className="h-5 w-5" />}
        trend={<><ArrowUpRight className="h-3 w-3 mr-1" /> <span>12% from yesterday</span></>}
      />
      <StatCard
        title="Active Members"
        value={stats.activeMembers}
        icon={<Users className="h-5 w-5" />}
        trend={<><ArrowUpRight className="h-3 w-3 mr-1" /> <span>5% this month</span></>}
      />
      <StatCard
        title="Memberships Expiring"
        value={stats.expiringMemberships}
        icon={<TrendingUp className="h-5 w-5" />}
        description="In the next 30 days"
      />
      <StatCard
        title="Upcoming Classes"
        value={stats.upcomingClasses}
        icon={<Calendar className="h-5 w-5" />}
        description="Next 24 hours"
      />
      <StatCard
        title="New Members"
        value={stats.newMembers}
        icon={<UserPlus className="h-5 w-5" />}
        description="This week"
      />
    </div>
  );
}
