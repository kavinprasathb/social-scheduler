"use client";

import { useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UploadCloudIcon,
  ImagePlusIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
  Trash2Icon,
  Loader2Icon,
  FileVideoIcon,
} from "lucide-react";
import { useMedia } from "@/hooks/useMedia";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mediaItems, loading, uploadingFiles, uploadFiles, deleteMedia } = useMedia();

  const filtered = useMemo(() => {
    if (!search.trim()) return mediaItems;
    const q = search.toLowerCase();
    return mediaItems.filter((m) => m.originalName.toLowerCase().includes(q));
  }, [mediaItems, search]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      await uploadFiles(files);
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    }
    // Reset input
    if (e.target) e.target.value = "";
  };

  const handleDelete = async (item: (typeof mediaItems)[0]) => {
    setDeletingId(item.id);
    try {
      await deleteMedia(item);
      toast.success("Media deleted.");
    } catch {
      toast.error("Failed to delete media.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 page-enter">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="h-9 pl-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md px-2 py-1 ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <GridIcon className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md px-2 py-1 ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ListIcon className="size-4" />
            </button>
          </div>

          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <UploadCloudIcon className="size-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
      />

      {/* Upload zone */}
      <label className="block cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
        />
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

      {/* Upload progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div key={file.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Loader2Icon className="size-4 shrink-0 animate-spin text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {Math.round(file.progress)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Media grid or empty state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border">
                <div className="aspect-square bg-muted">
                  {item.type === "video" ? (
                    <div className="flex h-full items-center justify-center">
                      <FileVideoIcon className="size-10 text-muted-foreground/40" />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.originalName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{item.originalName}</p>
                  <p className="text-[10px] text-muted-foreground">{formatFileSize(item.sizeBytes)}</p>
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                >
                  {deletingId === item.id ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50">
                <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  {item.type === "video" ? (
                    <div className="flex h-full items-center justify-center">
                      <FileVideoIcon className="size-5 text-muted-foreground/40" />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.originalName} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.originalName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.sizeBytes)} · {item.type}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
            <div className="mb-4 rounded-2xl bg-muted p-4">
              <ImagePlusIcon className="size-8 text-muted-foreground/60 sm:size-10" />
            </div>
            <p className="mb-1 text-lg font-medium text-foreground">No media yet</p>
            <p className="mb-5 max-w-xs text-sm text-muted-foreground">
              Upload images and videos to reuse them across your posts.
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <UploadCloudIcon className="size-4" />
              Upload Media
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
