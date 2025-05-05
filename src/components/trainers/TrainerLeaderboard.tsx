
import { Trainer } from "@/lib/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Medal, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Star,
  StarHalf
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrainerLeaderboardProps {
  trainers: Trainer[];
  period?: "thisMonth" | "lastMonth";
}

// Helper function to calculate trainer scores
const calculateTrainerScore = (trainer: Trainer): number => {
  if (!trainer.performance) return 0;
  
  // Weighted calculation using the formula from requirements
  const weightAttendance = 0.4;
  const weightClasses = 0.3;
  const weightFeedback = 0.3;
  
  const attendanceScore = trainer.performance.attendanceRate * weightAttendance;
  const classesScore = (trainer.performance.classesCount / 25) * weightClasses; // Normalize to 0-1 scale (assuming 25 classes is max)
  const feedbackScore = (trainer.performance.memberFeedback / 5) * weightFeedback; // Assuming 5 is max rating
  
  return +(attendanceScore + classesScore + feedbackScore).toFixed(2);
};

// Sort trainers by score
const getRankedTrainers = (trainers: Trainer[]): Trainer[] => {
  // First, add mock performance data if it doesn't exist
  const trainersWithPerformance = trainers.map(trainer => {
    if (!trainer.performance) {
      // Generate mock performance data for demonstration
      trainer = {
        ...trainer,
        performance: {
          classesCount: Math.floor(Math.random() * 25) + 5,
          attendanceRate: +(Math.random() * 30 + 70).toFixed(1), // 70-100%
          clientRetentionRate: +(Math.random() * 30 + 70).toFixed(1), // 70-100%
          ptSessionsCount: Math.floor(Math.random() * 40) + 10,
          memberFeedback: +(Math.random() * 2 + 3).toFixed(1), // 3-5 rating
          revenueGenerated: Math.floor(Math.random() * 5000) + 1000,
          rankLastMonth: Math.floor(Math.random() * trainers.length) + 1,
        }
      };

      // Calculate rank change
      const currentRank = trainers.length; // Default to last place
      if (trainer.performance.rankLastMonth) {
        trainer.performance.rankChange = trainer.performance.rankLastMonth - currentRank;
      }
    }
    return trainer;
  });
  
  // Sort by score in descending order
  return trainersWithPerformance.sort((a, b) => {
    const scoreA = calculateTrainerScore(a);
    const scoreB = calculateTrainerScore(b);
    return scoreB - scoreA;
  });
};

export function TrainerLeaderboard({ trainers, period = "thisMonth" }: TrainerLeaderboardProps) {
  const rankedTrainers = getRankedTrainers(trainers);
  
  // Update rank change after sorting
  rankedTrainers.forEach((trainer, index) => {
    if (trainer.performance) {
      const currentRank = index + 1;
      if (trainer.performance.rankLastMonth) {
        trainer.performance.rankChange = trainer.performance.rankLastMonth - currentRank;
      }
    }
  });
  
  const renderRankIcon = (rank: number) => {
    if (rank === 1) return <Award className="text-yellow-500" />;
    if (rank === 2) return <Medal className="text-gray-400" />;
    if (rank === 3) return <Medal className="text-amber-600" />;
    return null;
  };
  
  const renderRankChange = (change?: number) => {
    if (!change) return null;
    if (change > 0) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {change}
        </Badge>
      );
    }
    if (change < 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          {Math.abs(change)}
        </Badge>
      );
    }
    return <Badge variant="outline">No change</Badge>;
  };
  
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
    }
    
    // Add empty stars to reach 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Trainer Leaderboard Arena</CardTitle>
            <CardDescription>
              {period === "thisMonth" 
                ? "Current ranking for this month" 
                : "Final rankings from last month"}
            </CardDescription>
          </div>
          <Tabs defaultValue={period} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="thisMonth">This Month</TabsTrigger>
              <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedTrainers.map((trainer, index) => (
              <TableRow key={trainer.id} className={index < 3 ? "bg-muted/30" : ""}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{index + 1}</span>
                    {renderRankIcon(index + 1)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={trainer.profileImage} alt={trainer.firstName} />
                      <AvatarFallback>{trainer.firstName[0]}{trainer.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{trainer.firstName} {trainer.lastName}</div>
                      <div className="text-xs text-muted-foreground">
                        {trainer.specialties[0]}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-lg">{calculateTrainerScore(trainer)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {trainer.performance?.classesCount || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{trainer.performance?.attendanceRate || 0}%</div>
                </TableCell>
                <TableCell>
                  {renderRatingStars(trainer.performance?.memberFeedback || 0)}
                </TableCell>
                <TableCell>
                  {renderRankChange(trainer.performance?.rankChange)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
