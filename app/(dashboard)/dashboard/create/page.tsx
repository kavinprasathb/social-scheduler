"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UploadCloudIcon,
  CheckIcon,
  ImageIcon,
  VideoIcon,
  SendIcon,
  SaveIcon,
  XIcon,
  Loader2Icon,
} from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { uploadFile } from "@/lib/firebase/storage";
import { useAuth } from "@/hooks/useAuth";
import type { PlatformType, MediaItem } from "@/types";

const platforms = [
  { id: "instagram" as PlatformType, label: "Instagram", class: "platform-instagram" },
  { id: "facebook" as PlatformType, label: "Facebook", class: "platform-facebook" },
  { id: "youtube" as PlatformType, label: "YouTube", class: "platform-youtube" },
  { id: "threads" as PlatformType, label: "Threads", class: "platform-threads" },
  { id: "linkedin" as PlatformType, label: "LinkedIn", class: "platform-linkedin" },
];

const charLimits: Record<string, number> = {
  instagram: 2200,
  facebook: 63206,
  youtube: 5000,
  threads: 500,
  linkedin: 3000,
};

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { createNewPost } = usePosts();

  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [scheduledDate, setScheduledDate] = useState(searchParams.get("date") || "");
  const [scheduledTime, setScheduledTime] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (id: PlatformType) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const minCharLimit =
    selectedPlatforms.length > 0
      ? Math.min(...selectedPlatforms.map((p) => charLimits[p] || 5000))
      : 5000;

  const isOverLimit = content.length > minCharLimit;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setMediaFiles((prev) => [...prev, ...files]);
    // Generate previews
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setMediaPreviews((prev) => [...prev, url]);
    });
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (status: "draft" | "scheduled") => {
    if (!user || saving) return;
    if (status === "scheduled" && (!scheduledDate || !scheduledTime)) return;

    setSaving(true);
    try {
      // Upload media files first
      const uploadedMedia: MediaItem[] = [];
      for (const file of mediaFiles) {
        const { url } = await uploadFile(file, user.uid);
        uploadedMedia.push({
          url,
          type: file.type.startsWith("video/") ? "video" : "image",
          mimeType: file.type,
          sizeBytes: file.size,
          thumbnailUrl: url,
        });
      }

      // Build scheduled date
      let scheduledAt: Date | undefined;
      if (status === "scheduled" && scheduledDate && scheduledTime) {
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
      }

      await createNewPost({
        content,
        platforms: selectedPlatforms,
        status,
        scheduledAt,
        media: uploadedMedia,
      });

      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 page-enter sm:space-y-6">
      {/* Platform selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Publish to</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all sm:gap-2 sm:px-4 sm:py-2.5 ${
                    isSelected
                      ? `${platform.class} text-white shadow-sm`
                      : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {platform.label}
                  {isSelected && <CheckIcon className="size-3.5" />}
                </button>
              );
            })}
          </div>
          {selectedPlatforms.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Select at least one platform to publish to
            </p>
          )}
        </CardContent>
      </Card>

      {/* Content editor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to share with your audience?"
            rows={5}
            className="min-h-[120px] resize-none text-[0.95rem] leading-relaxed sm:min-h-[160px] sm:text-base"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <VideoIcon className="size-4" />
              </Button>
            </div>
            <Badge variant={isOverLimit ? "destructive" : "secondary"}>
              {content.length}
              {selectedPlatforms.length > 0 && ` / ${minCharLimit.toLocaleString()}`}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Media upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-8 transition-all hover:border-primary/50 hover:bg-accent/30 sm:py-12">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
            <UploadCloudIcon className="mb-3 size-8 text-muted-foreground/60 sm:size-10" />
            <p className="text-sm font-medium text-foreground">
              Drop files or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WebP, MP4, MOV — up to 100MB
            </p>
          </label>

          {/* Media previews */}
          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {mediaPreviews.map((preview, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                  {mediaFiles[i]?.type.startsWith("video/") ? (
                    <video src={preview} className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="" className="h-full w-full object-cover" />
                  )}
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">Date</Label>
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="h-11 text-[0.95rem] sm:h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Time</Label>
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="h-11 text-[0.95rem] sm:h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          disabled={saving || !content.trim()}
          onClick={() => handleSave("draft")}
        >
          {saving ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
          Save Draft
        </Button>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={saving || selectedPlatforms.length === 0 || !content.trim() || !scheduledDate || !scheduledTime}
          onClick={() => handleSave("scheduled")}
        >
          {saving ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
          Schedule Post
        </Button>
      </div>
    </div>
  );
}
