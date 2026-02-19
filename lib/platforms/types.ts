import type { Post, SocialAccount, PlatformType, PublishResult } from "@/types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface TokenResult {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

export interface SocialPlatformPublisher {
  platform: PlatformType;
  publish(post: Post, account: SocialAccount): Promise<PublishResult>;
  validateContent(post: Post): ValidationResult;
  getCharacterLimit(): number;
  refreshToken(account: SocialAccount): Promise<TokenResult>;
}
