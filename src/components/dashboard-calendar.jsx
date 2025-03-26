import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardCalendar() {
  const [currentDate] = useState(new Date());

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    return date;
  });

  // Mock data for question counts
  const questionCounts = [12, 5, 8, 3, 15, 7, 4];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous week</span>
        </Button>
        <h3 className="text-sm font-medium">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, i) => {
          const day = date.getDate();
          const isToday = date.toDateString() === new Date().toDateString();
          const hasQuestions = questionCounts[i] > 0;

          return (
            <Button
              key={day}
              variant="ghost"
              className={cn(
                "h-14 p-0 flex flex-col items-center justify-center hover:bg-muted",
                isToday && "bg-primary/10 text-primary hover:bg-primary/20 ",
                hasQuestions && !isToday && "bg-muted"
              )}
            >
              <span className="text-xs text-muted-foreground">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                  date.getDay()
                ].substring(0, 1)}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isToday && "text-primary "
                )}
              >
                {day}
              </span>
              {hasQuestions && (
                <span
                  className={cn(
                    "text-xs mt-1",
                    isToday ? "text-primary " : "text-muted-foreground"
                  )}
                >
                  {questionCounts[i]}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
