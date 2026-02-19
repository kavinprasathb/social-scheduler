"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileStackIcon, PenSquareIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const filters = ["All", "Scheduled", "Published", "Draft", "Failed"] as const;

export default function PostsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  return (
    <div className="space-y-4 sm:space-y-6 page-enter">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filters — horizontal scroll on mobile */}
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border p-0.5 scrollbar-none">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56 sm:flex-initial">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search posts..." className="h-9 pl-9 text-sm" />
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard/create">
              <PenSquareIcon className="size-3.5" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
          <div className="mb-4 rounded-2xl bg-muted p-4">
            <FileStackIcon className="size-8 text-muted-foreground/60 sm:size-10" />
          </div>
          <p className="mb-1 text-lg font-medium text-foreground">No posts yet</p>
          <p className="mb-5 max-w-xs text-sm text-muted-foreground">
            Create your first post and it will show up here with its publish status.
          </p>
          <Button asChild>
            <Link href="/dashboard/create">
              <PenSquareIcon className="size-4" />
              Create Your First Post
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
