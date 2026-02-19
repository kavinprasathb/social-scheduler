"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CameraIcon } from "lucide-react";

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
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  U
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
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
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
          <select className="h-11 w-full rounded-lg border border-input bg-background px-4 text-[0.95rem] text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 sm:h-12">
            {timezones.map((tz) => (
              <option key={tz}>{tz}</option>
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
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button size="lg" className="w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
