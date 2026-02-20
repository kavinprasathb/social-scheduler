"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserSettings } from "@/hooks/useUserSettings";

const timezones = [
  "Asia/Kolkata (IST)",
  "America/New_York (EST)",
  "America/Chicago (CST)",
  "America/Denver (MST)",
  "America/Los_Angeles (PST)",
  "Europe/London (GMT)",
  "Europe/Berlin (CET)",
  "Asia/Tokyo (JST)",
  "Asia/Shanghai (CST)",
  "Australia/Sydney (AEST)",
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, loading, saving, updateProfile } = useUserSettings();

  const [displayName, setDisplayName] = useState("");
  const [timezone, setTimezone] = useState(timezones[0]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      const tz = timezones.find((t) => t.startsWith(profile.settings?.timezone || ""));
      if (tz) setTimezone(tz);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const tzValue = timezone.split(" ")[0];
      await updateProfile({ displayName, timezone: tzValue });
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      const tz = timezones.find((t) => t.startsWith(profile.settings?.timezone || ""));
      if (tz) setTimezone(tz);
    }
  };

  const initials = (displayName || user?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl space-y-5 page-enter sm:space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Profile</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative">
              <Avatar className="size-20 border-2 border-border">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-110">
                <CameraIcon className="size-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Upload a photo</p>
              <p className="text-sm text-muted-foreground">
                JPG or PNG, max 2MB
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                placeholder="Your name"
                className="h-11 text-[0.95rem] sm:h-12"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="h-11 text-[0.95rem] sm:h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timezone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Timezone</CardTitle>
          <CardDescription>
            Posts will be scheduled based on this timezone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={loading}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-[0.95rem] text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 sm:h-12"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive sm:text-lg">
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
          <Button variant="destructive" size="sm" className="w-full sm:w-auto">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Save */}
      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
