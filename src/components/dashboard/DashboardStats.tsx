
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, ArrowUpRight, Timer, UserPlus, DollarSign, Percent } from 'lucide-react';
import type { DashboardStats as DashboardStatsType } from '@/lib/types';
import { UserRole } from '@/pages/Dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon, trend, description, isLoading = false }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {trend && <p className="text-xs text-muted-foreground flex items-center mt-1">{trend}</p>}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  stats: DashboardStatsType;
  userRole: UserRole;
  isLoading?: boolean;
}

export function DashboardStats({ stats, userRole, isLoading = false }: DashboardStatsProps) {
  // Common stats for all roles
  const commonStats = [
    {
      title: "Today's Check-ins",
      value: stats.todayCheckIns,
      icon: <Timer className="h-5 w-5" />,
      trend: <><ArrowUpRight className="h-3 w-3 mr-1" /> <span>12% from yesterday</span></>,
    },
    {
      title: "Active Members",
      value: stats.activeMembers,
      icon: <Users className="h-5 w-5" />,
      trend: <><ArrowUpRight className="h-3 w-3 mr-1" /> <span>5% this month</span></>,
    },
    {
      title: "Upcoming Classes",
      value: stats.upcomingClasses,
      icon: <Calendar className="h-5 w-5" />,
      description: "Next 24 hours",
    },
  ];

  // Owner-specific stats
  const ownerStats = [
    {
      title: "Monthly Revenue",
      value: "$24,580",
      icon: <DollarSign className="h-5 w-5" />,
      trend: <><ArrowUpRight className="h-3 w-3 mr-1" /> <span>8% from last month</span></>,
    },
    {
      title: "Retention Rate",
      value: "92%",
      icon: <Percent className="h-5 w-5" />,
      description: "Last 30 days",
    },
  ];

  // Staff-specific stats
  const staffStats = [
    {
      title: "Memberships Expiring",
      value: stats.expiringMemberships,
      icon: <TrendingUp className="h-5 w-5" />,
      description: "In the next 30 days",
    },
  ];

  // Trainer-specific stats
  const trainerStats = [
    {
      title: "My Classes Today",
      value: "4",
      icon: <Calendar className="h-5 w-5" />,
      description: "Total attendees: 32",
    },
    {
      title: "Client Sessions",
      value: "3",
      icon: <Users className="h-5 w-5" />,
      description: "Today's schedule",
    },
  ];

  // Determine which stats to show based on user role
  let roleSpecificStats: StatCardProps[] = [];
  
  if (userRole === 'owner') {
    roleSpecificStats = [...commonStats, ...ownerStats];
  } else if (userRole === 'staff') {
    roleSpecificStats = [...commonStats, ...staffStats];
  } else if (userRole === 'trainer') {
    roleSpecificStats = [...trainerStats];
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {roleSpecificStats.map((stat, index) => (
        <StatCard
          key={`${stat.title}-${index}`}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          description={stat.description}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
