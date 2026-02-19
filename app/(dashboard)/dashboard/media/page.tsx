"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UploadCloudIcon,
  ImagePlusIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
} from "lucide-react";

export default function MediaPage() {
  return (
    <div className="space-y-4 sm:space-y-6 page-enter">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search media..." className="h-9 pl-9 text-sm" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5">
            <button className="rounded-md bg-primary/10 px-2 py-1 text-primary">
              <GridIcon className="size-4" />
            </button>
            <button className="rounded-md px-2 py-1 text-muted-foreground hover:text-foreground">
              <ListIcon className="size-4" />
            </button>
          </div>

          <Button size="sm">
            <UploadCloudIcon className="size-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </div>
      </div>

      {/* Upload zone */}
      <label className="block cursor-pointer">
        <input type="file" className="hidden" accept="image/*,video/*" multiple />
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-accent/30 sm:p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <UploadCloudIcon className="mb-3 size-8 text-muted-foreground/60 sm:size-10" />
            <p className="text-sm font-medium text-foreground">
              Drop files here or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Images & Videos — Max 100MB per file
            </p>
          </div>
        </div>
      </label>

      {/* Empty grid */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
          <div className="mb-4 rounded-2xl bg-muted p-4">
            <ImagePlusIcon className="size-8 text-muted-foreground/60 sm:size-10" />
          </div>
          <p className="mb-1 text-lg font-medium text-foreground">No media yet</p>
          <p className="mb-5 max-w-xs text-sm text-muted-foreground">
            Upload images and videos to reuse them across your posts.
          </p>
          <label>
            <input type="file" className="hidden" accept="image/*,video/*" multiple />
            <Button asChild>
              <span>
                <UploadCloudIcon className="size-4" />
                Upload Media
              </span>
            </Button>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
