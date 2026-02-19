import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, Share2Icon, ZapIcon, ArrowRightIcon } from "lucide-react";

const platforms = [
  { name: "Instagram", class: "platform-instagram" },
  { name: "Facebook", class: "platform-facebook" },
  { name: "YouTube", class: "platform-youtube" },
  { name: "Threads", class: "platform-threads" },
  { name: "LinkedIn", class: "platform-linkedin" },
];

const features = [
  {
    icon: CalendarDaysIcon,
    title: "Visual Calendar",
    description: "Plan your content across days, weeks, or months with drag & drop scheduling.",
  },
  {
    icon: Share2Icon,
    title: "Cross-Platform",
    description: "Write once, publish everywhere. One post reaches all your audiences.",
  },
  {
    icon: ZapIcon,
    title: "Auto Publish",
    description: "Set it and forget it. Posts go live exactly when you schedule them.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <span className="text-lg font-semibold tracking-tight">Scheduler</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">
              Get Started
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 pb-16 pt-16 text-center sm:px-8 sm:pt-24 lg:pt-32">
        <div className="page-enter">
          <p className="mb-4 inline-block rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            Now in Beta — Schedule your first post free
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Schedule once,{" "}
            <span className="font-display italic text-primary">publish everywhere</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Plan your social media content, schedule posts to the exact day and
            time, and let us publish across all your platforms simultaneously.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href="/login">
                Start Scheduling
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
              <Link href="/login">View Demo</Link>
            </Button>
          </div>
        </div>

        {/* Platform pills */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span className="mr-1 text-sm text-muted-foreground">Supports:</span>
          {platforms.map((p) => (
            <span
              key={p.name}
              className={`${p.class} rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm sm:text-sm`}
            >
              {p.name}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <div className="stagger-children grid gap-4 sm:grid-cols-3 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 sm:p-8"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5 sm:size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-6 text-center text-sm text-muted-foreground sm:px-8">
        <p>&copy; 2026 Social Scheduler. Built for creators who mean business.</p>
      </footer>
    </div>
  );
}
