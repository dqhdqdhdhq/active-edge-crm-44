
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isMobile ? "ml-0" : "ml-64"
      )}>
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
