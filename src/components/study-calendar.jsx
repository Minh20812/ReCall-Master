"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StudyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Mock data for study days and question counts
  const studyData = {
    // Format: "YYYY-MM-DD": { studied: boolean, questions: number }
    "2023-05-01": { studied: true, questions: 12 },
    "2023-05-02": { studied: true, questions: 8 },
    "2023-05-03": { studied: true, questions: 15 },
    "2023-05-04": { studied: true, questions: 10 },
    "2023-05-05": { studied: true, questions: 7 },
    "2023-05-06": { studied: false, questions: 0 },
    "2023-05-07": { studied: true, questions: 5 },
    "2023-05-08": { studied: true, questions: 12 },
    "2023-05-09": { studied: true, questions: 8 },
    "2023-05-10": { studied: true, questions: 15 },
    "2023-05-11": { studied: true, questions: 10 },
    "2023-05-12": { studied: true, questions: 7 },
    "2023-05-13": { studied: true, questions: 9 },
    "2023-05-14": { studied: true, questions: 11 },
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const formatDateKey = (day) => {
    return `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getDayData = (day) => {
    const dateKey = formatDateKey(day);
    return studyData[dateKey] || { studied: false, questions: 0 };
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="p-2"></div>
        ))}

        {days.map((day) => {
          const dayData = getDayData(day);
          return (
            <Card
              key={day}
              className={cn(
                "flex flex-col items-center justify-center p-2 h-16 hover:bg-muted/50 cursor-pointer transition-colors",
                isToday(day) && "border-primary",
                dayData.studied && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  isToday(day) && "text-primary"
                )}
              >
                {day}
              </span>
              {dayData.questions > 0 && (
                <span className="text-xs text-muted-foreground">
                  {dayData.questions} Qs
                </span>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/5 border border-primary/20"></div>
          <span className="text-sm text-muted-foreground">Studied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-primary"></div>
          <span className="text-sm text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
}
