"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboardIcon,
  CalendarDaysIcon,
  PenSquareIcon,
  FileStackIcon,
  ImagePlusIcon,
  Link2Icon,
  SettingsIcon,
  XIcon,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDaysIcon },
  { label: "Create Post", href: "/dashboard/create", icon: PenSquareIcon },
  { label: "Posts", href: "/dashboard/posts", icon: FileStackIcon },
  { label: "Media", href: "/dashboard/media", icon: ImagePlusIcon },
  { label: "Accounts", href: "/dashboard/settings/accounts", icon: Link2Icon },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Scheduler
          </span>
        </Link>
        {/* Mobile close */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onMobileClose}
        >
          <XIcon className="size-5" />
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 h-11 text-[0.9rem] ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={onMobileClose}
            >
              <Link href={item.href}>
                <Icon className="size-[1.15rem]" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
          <Avatar className="size-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              User
            </p>
            <p className="truncate text-xs text-muted-foreground">
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-sidebar-border bg-sidebar md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay + drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm overlay-enter md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-[280px] bg-sidebar shadow-2xl sidebar-enter md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
