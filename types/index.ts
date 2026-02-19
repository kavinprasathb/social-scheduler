import { Timestamp } from "firebase/firestore";

export type PlatformType =
  | "instagram"
  | "facebook"
  | "youtube"
  | "threads"
  | "linkedin";

export type PostStatus =
  | "draft"
  | "scheduled"
  | "publishing"
  | "published"
  | "partial"
  | "failed";

export type PublishStatus = "success" | "failed";

export interface User {
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: {
    timezone: string;
    defaultPlatforms: PlatformType[];
  };
}

export interface SocialAccount {
  id: string;
  userId: string;
  platform: PlatformType;
  platformAccountId: string;
  accountName: string;
  profilePicUrl: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Timestamp;
  scopes: string[];
  isActive: boolean;
  connectedAt: Timestamp;
  lastUsedAt: Timestamp;
}

export interface MediaItem {
  url: string;
  type: "image" | "video";
  mimeType: string;
  sizeBytes: number;
  thumbnailUrl: string;
}

export interface PublishResult {
  status: PublishStatus;
  postId?: string;
  videoId?: string;
  error?: string;
  publishedAt?: Timestamp;
}

export interface Post {
  id: string;
  userId: string;
  content: {
    text: string;
    platformOverrides?: {
      instagram?: string;
      facebook?: string;
      youtube?: { title: string; description: string; tags: string[] };
      threads?: string;
      linkedin?: string;
    };
  };
  media: MediaItem[];
  targetPlatforms: PlatformType[];
  scheduledAt: Timestamp;
  status: PostStatus;
  publishResults: Partial<Record<PlatformType, PublishResult>>;
  retryCount: number;
  cloudTaskId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Media {
  id: string;
  userId: string;
  url: string;
  thumbnailUrl: string;
  type: "image" | "video";
  mimeType: string;
  sizeBytes: number;
  originalName: string;
  uploadedAt: Timestamp;
  usedInPosts: string[];
}
