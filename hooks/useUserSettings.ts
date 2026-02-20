"use client";

import { useEffect, useState, useCallback } from "react";
import { updateProfile as updateAuthProfile } from "firebase/auth";
import { useAuth } from "./useAuth";
import { getUserProfile, updateUserProfile } from "@/lib/firebase/firestore";
import type { User } from "@/types";

export function useUserSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserProfile(user.uid)
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, [user]);

  const updateProfile = useCallback(
    async (data: { displayName?: string; timezone?: string }) => {
      if (!user) throw new Error("Not authenticated");
      setSaving(true);
      try {
        const updates: Record<string, unknown> = {};

        if (data.displayName !== undefined) {
          updates.displayName = data.displayName;
          await updateAuthProfile(user, { displayName: data.displayName });
        }

        if (data.timezone !== undefined) {
          updates["settings.timezone"] = data.timezone;
        }

        if (Object.keys(updates).length > 0) {
          await updateUserProfile(user.uid, updates as Partial<User>);
        }

        // Refresh profile
        const fresh = await getUserProfile(user.uid);
        setProfile(fresh);
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  return { profile, loading, saving, updateProfile };
}
