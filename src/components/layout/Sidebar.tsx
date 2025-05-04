
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Dumbbell, 
  ClipboardCheck, 
  PieChart,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  to, 
  active = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  to: string; 
  active?: boolean; 
}) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 pl-3 font-medium transition-all",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && open) {
      onClose();
    }
  }, [location.pathname, isMobile, open, onClose]);

  return (
    <aside className={cn(
      "bg-sidebar fixed h-full w-64 z-40 transition-all duration-300 flex flex-col border-r border-sidebar-border",
      isMobile ? (open ? "left-0" : "-left-64") : "left-0"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell size={24} className="text-accent" />
          <h1 className="text-xl font-bold text-sidebar-foreground">ActiveEdge</h1>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-sidebar-foreground">
            <X size={20} />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          to="/" 
          active={location.pathname === '/'} 
        />
        <SidebarItem 
          icon={Users} 
          label="Members" 
          to="/members" 
          active={location.pathname.startsWith('/members')} 
        />
        <SidebarItem 
          icon={Calendar} 
          label="Classes" 
          to="/classes" 
          active={location.pathname.startsWith('/classes')} 
        />
        <SidebarItem 
          icon={Dumbbell} 
          label="Trainers" 
          to="/trainers" 
          active={location.pathname.startsWith('/trainers')} 
        />
        <SidebarItem 
          icon={ClipboardCheck} 
          label="Check-In" 
          to="/check-in" 
          active={location.pathname.startsWith('/check-in')} 
        />
        <SidebarItem 
          icon={PieChart} 
          label="Reports" 
          to="/reports" 
          active={location.pathname.startsWith('/reports')} 
        />
      </div>

      <div className="border-t border-sidebar-border p-2">
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          to="/settings" 
          active={location.pathname.startsWith('/settings')} 
        />
      </div>
    </aside>
  );
};

export const SidebarToggle = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden" 
      onClick={onClick}
    >
      <Menu />
    </Button>
  );
};
