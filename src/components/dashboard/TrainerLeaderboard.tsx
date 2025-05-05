
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrainerPerformanceItem {
  trainerId: string;
  trainerName: string;
  classesCount: number;
  attendanceRate: number;
  clientRetentionRate: number;
  ptSessionsCount: number;
  memberFeedback: number;
  revenueGenerated: number;
  rankLastMonth?: number;
  rankChange?: number;
}

interface TrainerLeaderboardProps {
  performance: TrainerPerformanceItem[];
  isTrainer?: boolean;
}

export function TrainerLeaderboard({ performance, isTrainer = false }: TrainerLeaderboardProps) {
  // Sort trainers by revenue (or any other metric)
  const sortedTrainers = [...performance].sort((a, b) => b.revenueGenerated - a.revenueGenerated);
  
  // For demo, we'll assume the logged-in trainer is the second in the list
  const currentTrainerId = '2'; // This would come from auth in real app
  const currentTrainer = sortedTrainers.find(t => t.trainerId === currentTrainerId);
  const currentRank = sortedTrainers.findIndex(t => t.trainerId === currentTrainerId) + 1;
  
  // Show only top 3 
  const topTrainers = sortedTrainers.slice(0, 3);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trainer Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTrainers.map((trainer, index) => {
            const rankIcon = trainer.rankChange ? (
              trainer.rankChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : trainer.rankChange < 0 ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : (
                <Minus className="h-3 w-3 text-gray-400" />
              )
            ) : null;
            
            return (
              <div key={trainer.trainerId} className="flex items-center space-x-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  index === 0 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : index === 1 
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-amber-800/20 text-amber-800'
                }`}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{trainer.trainerName}</p>
                    <span className="flex items-center ml-2">
                      {rankIcon}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trainer.ptSessionsCount} sessions | ${trainer.revenueGenerated} revenue
                  </p>
                </div>
                <div className="font-medium">
                  #{index + 1}
                </div>
              </div>
            );
          })}
          
          {isTrainer && currentTrainer && currentRank > 3 && (
            <>
              <div className="border-t border-dashed my-2" />
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">You ({currentTrainer.trainerName})</p>
                    <span className="flex items-center ml-2">
                      {currentTrainer.rankChange ? (
                        currentTrainer.rankChange > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : currentTrainer.rankChange < 0 ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : (
                          <Minus className="h-3 w-3 text-gray-400" />
                        )
                      ) : null}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentTrainer.ptSessionsCount} sessions | ${currentTrainer.revenueGenerated} revenue
                  </p>
                </div>
                <div className="font-medium">
                  #{currentRank}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4">
          <a href="/trainers" className="text-sm text-primary hover:underline">
            View all trainers
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
