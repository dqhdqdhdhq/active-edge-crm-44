
import { Trainer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Users, Clock, Calendar, TrendingUp, DollarSign, ThumbsUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TrainerPerformanceMetricsProps {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for performance metrics
const generateMockPerformanceData = (trainer: Trainer) => {
  return {
    hoursWorked: {
      total: 87,
      thisMonth: 24,
      lastMonth: 22,
      change: 9.1, // percentage change
    },
    sessions: {
      total: 56,
      thisMonth: 15,
      lastMonth: 12,
      change: 25,
    },
    classes: {
      total: 42,
      attendance: 85, // percentage
      retention: 78, // percentage
    },
    clients: {
      total: trainer.assignedMembers.length,
      active: Math.floor(trainer.assignedMembers.length * 0.8),
      retention: 83, // percentage
    },
    revenue: {
      total: 8570,
      thisMonth: 2450,
      lastMonth: 2200,
      change: 11.4,
    },
    feedback: {
      average: 4.7, // out of 5
      count: 34,
    },
    recentSessions: [
      { 
        date: "2023-09-15", 
        type: "Personal Training",
        client: "Sarah Johnson",
        duration: 60,
        status: "Completed"
      },
      { 
        date: "2023-09-14", 
        type: "Group Class: HIIT",
        client: "Multiple (12)",
        duration: 45,
        status: "Completed"  
      },
      { 
        date: "2023-09-14", 
        type: "Personal Training",
        client: "Michael Chen",
        duration: 30,
        status: "Cancelled"
      },
      { 
        date: "2023-09-13", 
        type: "Personal Training",
        client: "Emma Wilson",
        duration: 60,
        status: "Completed"
      },
      { 
        date: "2023-09-12", 
        type: "Group Class: Yoga",
        client: "Multiple (15)",
        duration: 60,
        status: "Completed"
      }
    ],
    clientFeedback: [
      {
        clientName: "Sarah Johnson",
        rating: 5,
        comment: "Amazing trainer! Really helped me improve my form and reach my goals."
      },
      {
        clientName: "Michael Chen",
        rating: 4,
        comment: "Great knowledge and always punctual. Would recommend."
      },
      {
        clientName: "Emma Wilson",
        rating: 5,
        comment: "Fantastic trainer who keeps the sessions varied and engaging."
      }
    ]
  };
};

export function TrainerPerformanceMetrics({ 
  trainer, 
  open, 
  onOpenChange 
}: TrainerPerformanceMetricsProps) {
  if (!trainer) return null;
  
  const performanceData = generateMockPerformanceData(trainer);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6 space-y-0">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={trainer.profileImage} />
                <AvatarFallback>{trainer.firstName[0]}{trainer.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">
                  {trainer.firstName} {trainer.lastName} - Performance
                </DialogTitle>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="metrics" className="mt-2">
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="metrics">
                <BarChart className="h-4 w-4 mr-2" />
                Key Metrics
              </TabsTrigger>
              <TabsTrigger value="sessions">
                <FileText className="h-4 w-4 mr-2" />
                Sessions Log
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Client Feedback
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="max-h-[65vh] mt-2">
            <TabsContent value="metrics" className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Hours Worked
                    </CardDescription>
                    <CardTitle className="text-2xl">{performanceData.hoursWorked.total} hrs</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">This Month:</span>
                        <span className="font-medium">{performanceData.hoursWorked.thisMonth} hrs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">vs Last Month:</span>
                        <span className={`font-medium ${performanceData.hoursWorked.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {performanceData.hoursWorked.change > 0 ? '+' : ''}{performanceData.hoursWorked.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      PT Sessions
                    </CardDescription>
                    <CardTitle className="text-2xl">{performanceData.sessions.total}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">This Month:</span>
                        <span className="font-medium">{performanceData.sessions.thisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">vs Last Month:</span>
                        <span className={`font-medium ${performanceData.sessions.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {performanceData.sessions.change > 0 ? '+' : ''}{performanceData.sessions.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      Revenue Generated
                    </CardDescription>
                    <CardTitle className="text-2xl">${performanceData.revenue.total}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">This Month:</span>
                        <span className="font-medium">${performanceData.revenue.thisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">vs Last Month:</span>
                        <span className={`font-medium ${performanceData.revenue.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {performanceData.revenue.change > 0 ? '+' : ''}{performanceData.revenue.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      Classes
                    </CardDescription>
                    <CardTitle className="text-2xl">{performanceData.classes.total}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Attendance Rate:</span>
                          <span className="font-medium">{performanceData.classes.attendance}%</span>
                        </div>
                        <Progress value={performanceData.classes.attendance} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      Clients
                    </CardDescription>
                    <CardTitle className="text-2xl">{performanceData.clients.total}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active:</span>
                        <span className="font-medium">{performanceData.clients.active}/{performanceData.clients.total}</span>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Retention Rate:</span>
                          <span className="font-medium">{performanceData.clients.retention}%</span>
                        </div>
                        <Progress value={performanceData.clients.retention} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      Client Feedback
                    </CardDescription>
                    <CardTitle className="text-2xl">{performanceData.feedback.average}/5</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Based on:</span>
                        <span className="font-medium">{performanceData.feedback.count} reviews</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${star <= Math.round(performanceData.feedback.average) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.934l-6.18 3.254 1.18-6.875L.003 7.32l6.902-1.003L10 0l3.095 6.317 6.902 1.003-4.997 4.993 1.18 6.875z"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sessions" className="px-6 py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session Audit Log</CardTitle>
                  <CardDescription>
                    Recent training sessions conducted by {trainer.firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Session Type</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performanceData.recentSessions.map((session, index) => (
                        <TableRow key={index}>
                          <TableCell>{session.date}</TableCell>
                          <TableCell>{session.type}</TableCell>
                          <TableCell>{session.client}</TableCell>
                          <TableCell>{session.duration} min</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              session.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              session.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback" className="px-6 py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Feedback</CardTitle>
                  <CardDescription>
                    Reviews and comments from {trainer.firstName}'s clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData.clientFeedback.map((feedback, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{feedback.clientName}</h4>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 15.934l-6.18 3.254 1.18-6.875L.003 7.32l6.902-1.003L10 0l3.095 6.317 6.902 1.003-4.997 4.993 1.18 6.875z"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
