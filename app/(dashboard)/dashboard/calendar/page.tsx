"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

const views = ["Day", "Week", "Month"] as const;
type View = (typeof views)[number];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const [activeView, setActiveView] = useState<View>("Month");
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <div className="space-y-4 sm:space-y-6 page-enter">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={prevMonth}>
            <ChevronLeftIcon className="size-4" />
          </Button>
          <h2 className="min-w-[160px] text-center text-base font-semibold tracking-tight sm:text-lg">
            {monthName}
          </h2>
          <Button variant="outline" size="icon-sm" onClick={nextMonth}>
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex rounded-lg border border-border p-0.5">
            {views.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                  activeView === view
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <Button asChild size="sm">
            <Link href="/dashboard/create">
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <Card>
        <CardContent className="p-2 sm:p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border pb-2">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{DAYS_SHORT[i]}</span>
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[48px] border-b border-r border-border/50 sm:min-h-[80px] lg:min-h-[100px]"
              />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellIndex = firstDay + i;
              const isLastCol = (cellIndex + 1) % 7 === 0;

              return (
                <div
                  key={day}
                  className={`group relative min-h-[48px] cursor-pointer border-b border-border/50 p-1 transition-colors hover:bg-accent/50 sm:min-h-[80px] sm:p-2 lg:min-h-[100px] ${
                    !isLastCol ? "border-r" : ""
                  }`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-medium sm:size-7 sm:text-sm ${
                      isToday(day)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>

                  {/* Hover add button */}
                  <div className="absolute bottom-1 right-1 hidden opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                    <div className="flex size-5 items-center justify-center rounded bg-primary/10 text-primary">
                      <PlusIcon className="size-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
