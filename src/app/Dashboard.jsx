import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, Plus, TrendingUp } from "lucide-react";
import { DashboardCalendar } from "@/components/dashboard-calendar";
import { DashboardChart } from "@/components/dashboard-chart";
import { QuickAddQuestion } from "@/components/questions/QuickAddQuestion";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from "@/components/mobile-dashboard";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileDashboard />;
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! You have{" "}
              <span className="font-semibold text-blue-700">12 questions</span>{" "}
              to review today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-primary ">
              <Link to="/review">Start Review Session</Link>
            </Button>
            <QuickAddQuestion>
              <Button variant="outline" size="icon" className="cursor-pointer">
                <Plus className="w-4 h-4" />
                <span className="sr-only">Add question</span>
              </Button>
            </QuickAddQuestion>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Review</CardTitle>
              <CardDescription>
                Your learning schedule for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 ">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimated time
                    </p>
                    <p className="text-xl font-medium">15 minutes</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">Progress</p>
                    <p className="font-medium">0/12 completed</p>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">2-day</p>
                    <p className="text-lg font-medium">5</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">7-day</p>
                    <p className="text-lg font-medium">4</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">30-day</p>
                    <p className="text-lg font-medium">3</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full ">
                <Link to="/review">Start Review</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Reviews</CardTitle>
              <CardDescription>
                Your scheduled reviews for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 ">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This week</p>
                  <p className="text-xl font-medium">32 questions</p>
                </div>
              </div>
              <DashboardCalendar />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Your learning progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 ">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Retention rate
                  </p>
                  <p className="text-xl font-medium">87%</p>
                </div>
              </div>
              <Tabs defaultValue="retention">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="retention">Retention</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>
                <TabsContent value="retention" className="pt-4">
                  <DashboardChart />
                </TabsContent>
                <TabsContent value="categories" className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <p>Biology</p>
                        <p className="font-medium">92%</p>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <p>Mathematics</p>
                        <p className="font-medium">85%</p>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <p>History</p>
                        <p className="font-medium">78%</p>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <p>Computer Science</p>
                        <p className="font-medium">94%</p>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/analytics">View Detailed Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Questions</CardTitle>
              <CardDescription>
                Questions you've recently created or modified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 transition-colors border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">
                        What is the function of mitochondria in a cell?
                      </p>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary ">
                        Biology
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Multiple choice · Created 2 days ago
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/questions">View All Questions</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Streak</CardTitle>
              <CardDescription>Your learning consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current streak
                  </p>
                  <p className="text-3xl font-bold">7 days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Longest streak
                  </p>
                  <p className="text-3xl font-bold">14 days</p>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-10 mb-1 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                      {i + 1}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
