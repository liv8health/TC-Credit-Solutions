import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Trash2, Calendar, ArrowUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Dashboard() {
  const { user } = useAuth();

  const { data: creditProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/credit/progress"],
  });

  if (progressLoading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Mock data for demonstration - in a real app this would come from the API
  const mockStats = {
    currentScore: 687,
    itemsRemoved: 12,
    daysActive: 45,
  };

  const mockActivities = [
    {
      text: "Negative item removed from Experian",
      time: "2 days ago",
      type: "success",
    },
    {
      text: "Dispute letter sent to Equifax", 
      time: "5 days ago",
      type: "info",
    },
    {
      text: "Credit report analysis completed",
      time: "1 week ago", 
      type: "warning",
    },
  ];

  const mockTasks = [
    { text: "Review updated credit reports", completed: false },
    { text: "Upload bank statements", completed: true },
    { text: "Schedule follow-up call", completed: false },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome Back, {user?.firstName || 'Member'}!</h1>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Current Score</p>
                <p className="text-3xl font-bold">{mockStats.currentScore}</p>
              </div>
              <ArrowUp className="h-8 w-8 text-emerald-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80">Items Removed</p>
                <p className="text-3xl font-bold">{mockStats.itemsRemoved}</p>
              </div>
              <Trash2 className="h-8 w-8 text-primary-foreground/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100">Days Active</p>
                <p className="text-3xl font-bold">{mockStats.daysActive}</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Tasks */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActivities.map((activity, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'info' ? 'bg-primary' : 'bg-amber-500'
                  }`} />
                  <span className="flex-1">{activity.text}</span>
                  <span className="text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.completed}
                    readOnly
                  />
                  <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
