"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileStackIcon,
  PenSquareIcon,
  SearchIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePosts } from "@/hooks/usePosts";
import { format } from "date-fns";
import type { PostStatus, PlatformType } from "@/types";

const filters = ["All", "Scheduled", "Published", "Draft", "Failed"] as const;

const statusStyles: Record<PostStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  scheduled: "bg-blue-100 text-blue-700",
  publishing: "bg-yellow-100 text-yellow-700",
  published: "bg-emerald-100 text-emerald-700",
  partial: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-700",
};

const platformColors: Record<PlatformType, string> = {
  instagram: "bg-pink-100 text-pink-700",
  facebook: "bg-blue-100 text-blue-700",
  youtube: "bg-red-100 text-red-700",
  threads: "bg-gray-100 text-gray-700",
  linkedin: "bg-sky-100 text-sky-700",
};

export default function PostsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { posts, loading, removePost } = usePosts({ realtime: true });

  const filtered = useMemo(() => {
    let result = posts;
    if (activeFilter !== "All") {
      result = result.filter(
        (p) => p.status === activeFilter.toLowerCase()
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.content.text.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeFilter, search]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    for (const f of filters) {
      if (f !== "All") {
        counts[f] = posts.filter((p) => p.status === f.toLowerCase()).length;
      }
    }
    return counts;
  }, [posts]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await removePost(id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 page-enter">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filters */}
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
              {!loading && (
                <span className="ml-1 opacity-60">({filterCounts[filter] ?? 0})</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56 sm:flex-initial">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="h-9 pl-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard/create">
              <PenSquareIcon className="size-3.5" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Posts list or empty state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((post) => (
            <Card key={post.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground sm:text-base">
                    {post.content.text.slice(0, 120)}{post.content.text.length > 120 ? "..." : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className={statusStyles[post.status]}>
                      {post.status}
                    </Badge>
                    {post.targetPlatforms.map((p) => (
                      <Badge key={p} variant="secondary" className={`text-[10px] ${platformColors[p]}`}>
                        {p}
                      </Badge>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {post.scheduledAt?.toDate
                        ? format(post.scheduledAt.toDate(), "MMM d, yyyy 'at' h:mm a")
                        : "No date"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                >
                  {deletingId === post.id ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
