"use client";

import { usePathname } from "next/navigation";
import { type User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon, MenuIcon } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/calendar": "Calendar",
  "/dashboard/create": "Create Post",
  "/dashboard/posts": "Posts",
  "/dashboard/media": "Media Library",
  "/dashboard/settings": "Settings",
  "/dashboard/settings/accounts": "Connected Accounts",
};

interface HeaderProps {
  onMenuClick: () => void;
  user?: User | null;
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <MenuIcon className="size-5" />
        </Button>

        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon-sm" className="sm:size-9">
          <BellIcon className="size-[1.1rem]" />
        </Button>
        {/* Mobile avatar (visible only on small screens since sidebar has user) */}
        <Avatar className="size-8 border border-border md:hidden">
          {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />}
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
