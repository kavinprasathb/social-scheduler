"use client";

import { useState } from "react";
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
} from "lucide-react";

const platforms = [
  { id: "instagram", label: "Instagram", class: "platform-instagram" },
  { id: "facebook", label: "Facebook", class: "platform-facebook" },
  { id: "youtube", label: "YouTube", class: "platform-youtube" },
  { id: "threads", label: "Threads", class: "platform-threads" },
  { id: "linkedin", label: "LinkedIn", class: "platform-linkedin" },
];

const charLimits: Record<string, number> = {
  instagram: 2200,
  facebook: 63206,
  youtube: 5000,
  threads: 500,
  linkedin: 3000,
};

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const minCharLimit =
    selectedPlatforms.length > 0
      ? Math.min(...selectedPlatforms.map((p) => charLimits[p] || 5000))
      : 5000;

  const isOverLimit = content.length > minCharLimit;

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
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                <ImageIcon className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
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
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-8 transition-all hover:border-primary/50 hover:bg-accent/30 sm:py-12">
            <input type="file" className="hidden" accept="image/*,video/*" multiple />
            <UploadCloudIcon className="mb-3 size-8 text-muted-foreground/60 sm:size-10" />
            <p className="text-sm font-medium text-foreground">
              Drop files or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WebP, MP4, MOV — up to 100MB
            </p>
          </label>
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
              <Input type="date" className="h-11 text-[0.95rem] sm:h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Time</Label>
              <Input type="time" className="h-11 text-[0.95rem] sm:h-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <SaveIcon className="size-4" />
          Save Draft
        </Button>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={selectedPlatforms.length === 0 || !content.trim()}
        >
          <SendIcon className="size-4" />
          Schedule Post
        </Button>
      </div>
    </div>
  );
}
