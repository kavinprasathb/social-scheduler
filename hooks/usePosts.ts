"use client";

import { useEffect, useState, useCallback } from "react";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "./useAuth";
import {
  getUserPosts,
  onUserPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/lib/firebase/firestore";
import type { Post, PlatformType, PostStatus, MediaItem } from "@/types";

type PostWithId = Post & { id: string };

export function usePosts(options?: {
  statusFilter?: string;
  realtime?: boolean;
}) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithId[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserPosts(user.uid, options?.statusFilter);
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, [user, options?.statusFilter]);

  useEffect(() => {
    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    if (options?.realtime) {
      setLoading(true);
      const unsub = onUserPosts(user.uid, (data) => {
        setPosts(data);
        setLoading(false);
      });
      return unsub;
    }

    fetch();
  }, [user, options?.realtime, fetch]);

  const createNewPost = useCallback(
    async (data: {
      content: string;
      platforms: PlatformType[];
      status: PostStatus;
      scheduledAt?: Date;
      media?: MediaItem[];
    }) => {
      if (!user) throw new Error("Not authenticated");
      const id = await createPost({
        userId: user.uid,
        content: { text: data.content },
        targetPlatforms: data.platforms,
        status: data.status,
        scheduledAt: data.scheduledAt
          ? Timestamp.fromDate(data.scheduledAt)
          : Timestamp.now(),
        media: data.media || [],
        publishResults: {},
        retryCount: 0,
      });
      if (!options?.realtime) await fetch();
      return id;
    },
    [user, options?.realtime, fetch]
  );

  const updateExistingPost = useCallback(
    async (id: string, data: Partial<Omit<Post, "id" | "createdAt">>) => {
      await updatePost(id, data);
      if (!options?.realtime) await fetch();
    },
    [options?.realtime, fetch]
  );

  const removePost = useCallback(
    async (id: string) => {
      await deletePost(id);
      if (!options?.realtime) await fetch();
    },
    [options?.realtime, fetch]
  );

  return {
    posts,
    loading,
    createNewPost,
    updateExistingPost,
    removePost,
    refetch: fetch,
  };
}
