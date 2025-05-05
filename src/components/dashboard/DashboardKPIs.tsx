
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, Percent, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function DashboardKPIs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-2" /> 
                Member Retention
              </p>
              <p className="text-2xl font-bold">86%</p>
            </div>
            <div className="text-green-500 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span className="text-sm">2.3%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" /> 
                Memberships Expiring
              </p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="text-sm text-muted-foreground">Next 30 days</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <Percent className="h-4 w-4 mr-2" /> 
                Class Attendance
              </p>
              <p className="text-2xl font-bold">72%</p>
            </div>
            <div className="text-red-500 flex items-center">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span className="text-sm">3.1%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2" /> 
                Outstanding Balances
              </p>
              <p className="text-2xl font-bold">$4,320</p>
            </div>
            <div className="text-sm text-muted-foreground">12 members</div>
          </div>
          
          <div className="mt-4">
            <a href="/reports" className="text-sm text-primary hover:underline flex items-center">
              View detailed reports
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
