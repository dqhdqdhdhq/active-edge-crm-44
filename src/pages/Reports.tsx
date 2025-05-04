
import { MembershipChart } from '@/components/reports/MembershipChart';
import { AttendanceChart } from '@/components/reports/AttendanceChart';
import { 
  generateMembershipDistributionData,
  generateMonthlyCheckInData, 
  generateWeeklyClassAttendanceData 
} from '@/data/mockData';

const Reports = () => {
  const membershipData = generateMembershipDistributionData();
  const monthlyCheckInData = generateMonthlyCheckInData();
  const classAttendanceData = generateWeeklyClassAttendanceData();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendanceChart 
          monthlyData={monthlyCheckInData}
          classAttendanceData={classAttendanceData}
        />
        <MembershipChart data={membershipData} />
      </div>
    </div>
  );
};

export default Reports;
