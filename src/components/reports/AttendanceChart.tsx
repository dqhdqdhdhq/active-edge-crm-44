
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MonthlyData {
  name: string;
  checkIns: number;
}

interface ClassAttendanceData {
  name: string;
  attendance: number;
}

interface AttendanceChartProps {
  monthlyData: MonthlyData[];
  classAttendanceData: ClassAttendanceData[];
}

export const AttendanceChart = ({ monthlyData, classAttendanceData }: AttendanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attendance Metrics</CardTitle>
        <CardDescription>Member check-ins and class attendance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly Check-ins</TabsTrigger>
            <TabsTrigger value="classes">Class Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="checkIns"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                    name="Check-ins"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="classes">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="attendance"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Attendance %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
