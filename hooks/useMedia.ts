"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getUserMedia, createMediaRecord, deleteMediaRecord } from "@/lib/firebase/firestore";
import { uploadFile, deleteFile } from "@/lib/firebase/storage";
import type { Media } from "@/types";

type MediaWithId = Media & { id: string };

export interface UploadingFile {
  name: string;
  progress: number;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function useMedia() {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserMedia(user.uid);
      setMediaItems(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setMediaItems([]);
      setLoading(false);
      return;
    }
    fetch();
  }, [user, fetch]);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!user) throw new Error("Not authenticated");

      // Validate file sizes
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File "${file.name}" exceeds 100MB limit`);
        }
      }

      // Initialize progress tracking
      setUploadingFiles(files.map((f) => ({ name: f.name, progress: 0 })));

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith("video/");

        const { url, storagePath } = await uploadFile(
          file,
          user.uid,
          (percent) => {
            setUploadingFiles((prev) =>
              prev.map((f, idx) => (idx === i ? { ...f, progress: percent } : f))
            );
          }
        );

        await createMediaRecord({
          userId: user.uid,
          url,
          thumbnailUrl: url,
          type: isVideo ? "video" : "image",
          mimeType: file.type,
          sizeBytes: file.size,
          originalName: file.name,
          storagePath,
          usedInPosts: [],
        });
      }

      setUploadingFiles([]);
      await fetch();
    },
    [user, fetch]
  );

  const deleteMedia = useCallback(
    async (item: MediaWithId) => {
      if (item.storagePath) {
        try {
          await deleteFile(item.storagePath);
        } catch {
          // File may already be deleted from storage
        }
      }
      await deleteMediaRecord(item.id);
      await fetch();
    },
    [fetch]
  );

  return { mediaItems, loading, uploadingFiles, uploadFiles, deleteMedia, refetch: fetch };
}
