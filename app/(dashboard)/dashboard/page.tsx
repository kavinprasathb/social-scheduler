import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  Link2Icon,
  PenSquareIcon,
  ArrowRightIcon,
  ClockIcon,
} from "lucide-react";

const stats = [
  { label: "Scheduled", value: "0", icon: ClockIcon, color: "text-primary", bg: "bg-primary/10" },
  { label: "Published", value: "0", icon: CheckCircle2Icon, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Failed", value: "0", icon: AlertCircleIcon, color: "text-destructive", bg: "bg-red-50" },
  { label: "Accounts", value: "0", icon: Link2Icon, color: "text-amber-600", bg: "bg-amber-50" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 stagger-children">
      {/* Welcome */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Good morning!
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Here&apos;s what&apos;s happening with your social media.
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/dashboard/create">
            <PenSquareIcon className="size-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                <div className={`rounded-xl p-2.5 ${stat.bg} ${stat.color}`}>
                  <Icon className="size-4 sm:size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                  <p className={`text-xl font-bold sm:text-2xl ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming posts */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base sm:text-lg">Upcoming Posts</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/calendar" className="text-muted-foreground">
              View calendar
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center sm:py-14">
            <div className="mb-4 rounded-2xl bg-muted p-4">
              <CalendarDaysIcon className="size-8 text-muted-foreground/60 sm:size-10" />
            </div>
            <p className="mb-1 font-medium text-foreground">No upcoming posts</p>
            <p className="mb-5 max-w-xs text-sm text-muted-foreground">
              Create your first post and schedule it to see it appear here.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/create">
                <PenSquareIcon className="size-3.5" />
                Create Post
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          { title: "Connect Accounts", desc: "Link your social profiles", href: "/dashboard/settings/accounts", icon: Link2Icon },
          { title: "Upload Media", desc: "Add images and videos", href: "/dashboard/media", icon: CalendarDaysIcon },
          { title: "View Calendar", desc: "See your content plan", href: "/dashboard/calendar", icon: CalendarDaysIcon },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}>
              <Card className="group h-full transition-all hover:shadow-md hover:border-primary/30">
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
