import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function Progress() {
  const { data: creditProgress, isLoading } = useQuery({
    queryKey: ["/api/credit/progress"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Credit Progress Tracking</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Mock data for demonstration
  const mockScores = [
    { bureau: "Experian", score: 695, previousScore: 648, change: 47 },
    { bureau: "Equifax", score: 687, previousScore: 635, change: 52 },
    { bureau: "TransUnion", score: 692, previousScore: 653, change: 39 },
  ];

  const getBureauColor = (bureau: string) => {
    switch (bureau) {
      case "Experian": return "text-emerald-600 dark:text-emerald-400";
      case "Equifax": return "text-primary";
      case "TransUnion": return "text-amber-600 dark:text-amber-400";
      default: return "text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Credit Progress Tracking</h1>
      
      {/* Credit Score Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {mockScores.map((scoreData) => (
          <Card key={scoreData.bureau}>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{scoreData.bureau}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getBureauColor(scoreData.bureau)}`}>
                {scoreData.score}
              </div>
              <div className="text-sm text-muted-foreground">
                +{scoreData.change} points
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Details */}
      <Card>
        <CardHeader>
          <CardTitle>Dispute Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Negative Items Removed</span>
              <span className="font-semibold">12/18</span>
            </div>
            <Progress value={67} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              67% of disputed items successfully removed
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Disputes in Progress</span>
              <span className="font-semibold">6 active</span>
            </div>
            <Progress value={33} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              6 disputes currently being processed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "March 2024", event: "Negative item removed from Experian", type: "success" },
              { date: "February 2024", event: "Dispute letters sent to all bureaus", type: "info" },
              { date: "February 2024", event: "Initial credit report analysis completed", type: "info" },
              { date: "January 2024", event: "Started credit repair program", type: "start" },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${
                  item.type === 'success' ? 'bg-emerald-500' :
                  item.type === 'info' ? 'bg-primary' : 'bg-muted-foreground'
                }`} />
                <div>
                  <p className="font-medium">{item.event}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
