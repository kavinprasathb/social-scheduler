"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getPostsByDateRange } from "@/lib/firebase/firestore";
import type { Post, PlatformType } from "@/types";

const views = ["Day", "Week", "Month"] as const;
type View = (typeof views)[number];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

const platformDotColors: Record<PlatformType, string> = {
  instagram: "bg-pink-500",
  facebook: "bg-blue-500",
  youtube: "bg-red-500",
  threads: "bg-gray-500",
  linkedin: "bg-sky-500",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type PostWithId = Post & { id: string };

export default function CalendarPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<View>("Month");
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [posts, setPosts] = useState<PostWithId[]>([]);
  const [loading, setLoading] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const start = new Date(currentYear, currentMonth, 1);
      const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
      const data = await getPostsByDateRange(user.uid, start, end);
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, [user, currentYear, currentMonth]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Group posts by day number
  const postsByDay = useMemo(() => {
    const map: Record<number, PostWithId[]> = {};
    for (const post of posts) {
      if (post.scheduledAt?.toDate) {
        const day = post.scheduledAt.toDate().getDate();
        if (!map[day]) map[day] = [];
        map[day].push(post);
      }
    }
    return map;
  }, [posts]);

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

  const formatDateParam = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

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
              const dayPosts = postsByDay[day] || [];

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

                  {/* Post indicators */}
                  {dayPosts.length > 0 && (
                    <div className="mt-0.5 flex flex-wrap gap-0.5 sm:mt-1">
                      {dayPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex gap-0.5">
                          {post.targetPlatforms.slice(0, 2).map((p) => (
                            <div
                              key={p}
                              className={`size-1.5 rounded-full sm:size-2 ${platformDotColors[p]}`}
                            />
                          ))}
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <span className="text-[9px] text-muted-foreground sm:text-[10px]">
                          +{dayPosts.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Hover add button */}
                  <Link
                    href={`/dashboard/create?date=${formatDateParam(day)}`}
                    className="absolute bottom-1 right-1 hidden opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                  >
                    <div className="flex size-5 items-center justify-center rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
                      <PlusIcon className="size-3" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
