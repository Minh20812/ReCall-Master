import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, TrendingUp } from "lucide-react";
import { DashboardChart } from "@/components/dashboard-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function MobileDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container px-4 py-4 mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold">Welcome back!</h1>
          <p className="text-sm text-muted-foreground">
            You have{" "}
            <span className="font-medium text-primary">12 questions</span> to
            review today.
          </p>
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Today's Review
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">12 questions</p>
                    <p className="text-sm text-muted-foreground">~15 minutes</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-muted-foreground">Progress</p>
                      <p>0/12 completed</p>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-background">
                      <p className="text-xs text-muted-foreground">2-day</p>
                      <p className="text-base font-medium">5</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background">
                      <p className="text-xs text-muted-foreground">7-day</p>
                      <p className="text-base font-medium">4</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background">
                      <p className="text-xs text-muted-foreground">30-day</p>
                      <p className="text-base font-medium">3</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button asChild className="w-full">
                  <Link to="/review">Start Review</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    Retention
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-muted-foreground">
                    +2.5% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 text-primary" />
                    Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-2xl font-bold">7 days</p>
                  <p className="text-xs text-muted-foreground">Best: 14 days</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg">Recent Questions</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 transition-colors border rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">
                          What is the function of mitochondria in a cell?
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Multiple choice
                        </p>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                          Biology
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/questions">View All Questions</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="pt-4">
                    <div className="h-[180px]">
                      <DashboardChart />
                    </div>
                  </TabsContent>
                  <TabsContent value="categories" className="pt-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <p>Biology</p>
                          <p className="font-medium">92%</p>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <p>Mathematics</p>
                          <p className="font-medium">85%</p>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <p>History</p>
                          <p className="font-medium">78%</p>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/analytics">View Analytics</Link>
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2 pt-4">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-4">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="p-3">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
