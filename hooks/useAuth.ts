"use client";

import { useEffect, useState, useCallback } from "react";
import { type User } from "firebase/auth";
import { onAuthChange, signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    router.push("/login");
  }, [router]);

  return { user, loading, logout };
}

export function useRequireAuth() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { user, loading, logout };
}
