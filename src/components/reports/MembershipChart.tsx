
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

interface MembershipData {
  name: string;
  value: number;
}

interface MembershipChartProps {
  data: MembershipData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#6366f1', '#ec4899', '#14b8a6'];

export const MembershipChart = ({ data }: MembershipChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Membership Distribution</CardTitle>
        <CardDescription>Breakdown of current memberships by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} members (${((value as number / total) * 100).toFixed(1)}%)`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
