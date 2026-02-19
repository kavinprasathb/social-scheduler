# Architecture Document
# Social Media Scheduler

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT                              │
│              Next.js + React (Vercel)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Calendar  │ │  Post    │ │  Media   │ │  Account  │  │
│  │   View    │ │ Creator  │ │ Library  │ │ Settings  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    FIREBASE                               │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Firebase Auth │  │  Firestore   │  │ Cloud Storage │  │
│  │ (Google,      │  │  (Database)  │  │ (Media Files) │  │
│  │  Email)       │  │              │  │               │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │            Cloud Functions (Gen 2)                │    │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────┐  │   │
│  │  │ OAuth Flow │ │ Publisher  │ │ Token Refresh │  │   │
│  │  │  Handlers  │ │  Engine    │ │   (Cron)     │  │   │
│  │  └────────────┘ └─────┬──────┘ └──────────────┘  │   │
│  └────────────────────────┼──────────────────────────┘   │
└───────────────────────────┼──────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
     ┌──────────────┐ ┌─────────┐ ┌───────────┐
     │  Meta Graph   │ │ YouTube │ │ LinkedIn  │
     │  API          │ │ Data    │ │ Marketing │
     │ (IG/FB/       │ │ API v3  │ │ API       │
     │  Threads)     │ │         │ │           │
     └──────────────┘ └─────────┘ └───────────┘
```

---

## 2. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 14+ (App Router) | SSR, API routes, React ecosystem |
| UI Library | Tailwind CSS + shadcn/ui | Rapid UI dev, consistent design |
| State Management | Zustand or React Context | Lightweight, no boilerplate |
| Calendar | @fullcalendar/react | Mature, drag & drop, multiple views |
| Auth | Firebase Auth | Google + Email providers, easy setup |
| Database | Firestore | Real-time sync, serverless, scalable |
| File Storage | Firebase Cloud Storage | Direct upload from client, signed URLs |
| Backend Logic | Cloud Functions (Gen 2) | Event-driven, scales to zero, GCP native |
| Scheduling | Google Cloud Tasks | Precise scheduled execution, retry built-in |
| Hosting (Frontend) | Vercel | Optimized for Next.js, edge network |
| Hosting (Functions) | Firebase/GCP | Auto-managed with Cloud Functions |

---

## 3. Data Model (Firestore)

### Collection: `users`
```
users/{userId}
├── email: string
├── displayName: string
├── photoURL: string
├── createdAt: timestamp
├── updatedAt: timestamp
└── settings: {
      timezone: string           // e.g., "Asia/Kolkata"
      defaultPlatforms: string[] // default selected platforms
    }
```

### Collection: `socialAccounts`
```
socialAccounts/{accountId}
├── userId: string (indexed)
├── platform: "instagram" | "facebook" | "youtube" | "threads" | "linkedin"
├── platformAccountId: string
├── accountName: string
├── profilePicUrl: string
├── accessToken: string (encrypted)
├── refreshToken: string (encrypted)
├── tokenExpiresAt: timestamp
├── scopes: string[]
├── isActive: boolean
├── connectedAt: timestamp
└── lastUsedAt: timestamp
```

### Collection: `posts`
```
posts/{postId}
├── userId: string (indexed)
├── content: {
│     text: string
│     platformOverrides: {      // optional per-platform text
│       instagram?: string
│       facebook?: string
│       youtube?: { title: string, description: string, tags: string[] }
│       threads?: string
│       linkedin?: string
│     }
│   }
├── media: [
│     {
│       url: string             // Cloud Storage URL
│       type: "image" | "video"
│       mimeType: string
│       sizeBytes: number
│       thumbnailUrl: string
│     }
│   ]
├── targetPlatforms: string[]   // ["instagram", "facebook", ...]
├── scheduledAt: timestamp      // when to publish
├── status: "draft" | "scheduled" | "publishing" | "published" | "partial" | "failed"
├── publishResults: {
│     instagram?: { status: "success" | "failed", postId?: string, error?: string, publishedAt?: timestamp }
│     facebook?:  { status: "success" | "failed", postId?: string, error?: string, publishedAt?: timestamp }
│     youtube?:   { status: "success" | "failed", videoId?: string, error?: string, publishedAt?: timestamp }
│     threads?:   { status: "success" | "failed", postId?: string, error?: string, publishedAt?: timestamp }
│     linkedin?:  { status: "success" | "failed", postId?: string, error?: string, publishedAt?: timestamp }
│   }
├── retryCount: number
├── cloudTaskId: string         // reference to scheduled Cloud Task
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Collection: `media`
```
media/{mediaId}
├── userId: string (indexed)
├── url: string
├── thumbnailUrl: string
├── type: "image" | "video"
├── mimeType: string
├── sizeBytes: number
├── originalName: string
├── uploadedAt: timestamp
└── usedInPosts: string[]       // post IDs referencing this media
```

---

## 4. Key Architectural Decisions

### 4.1 Why Firestore over Cloud SQL
- **Serverless**: No connection pooling, no instance management
- **Real-time**: Calendar can update live when posts change status
- **Cost**: Pay per read/write, cheap at low scale
- **Tradeoff**: No complex joins, but our data model is document-friendly

### 4.2 Why Cloud Tasks for Scheduling (not Cloud Scheduler)
- Cloud Scheduler = fixed cron jobs (good for recurring tasks)
- Cloud Tasks = one-off scheduled HTTP calls (perfect for "publish post X at time Y")
- Each scheduled post creates a Cloud Task with `scheduleTime` set to the post's `scheduledAt`
- If user reschedules, delete old task and create new one

### 4.3 Why Vercel for Frontend (not Firebase Hosting)
- Firebase Hosting is fine for static sites but limited for Next.js SSR
- Vercel has first-class Next.js support (ISR, middleware, edge functions)
- Firebase handles backend only

### 4.4 Token Encryption
- OAuth tokens stored in Firestore are encrypted using GCP KMS or a symmetric key in Secret Manager
- Cloud Functions decrypt at runtime when publishing
- Tokens never sent to the client

### 4.5 Platform Abstraction Layer
Each social platform is a module implementing a common interface:
```typescript
interface SocialPlatformPublisher {
  platform: PlatformType;
  publish(post: Post, account: SocialAccount): Promise<PublishResult>;
  validateContent(post: Post): ValidationResult;
  getCharacterLimit(): number;
  refreshToken(account: SocialAccount): Promise<TokenResult>;
}
```
This makes adding new platforms straightforward.

---

## 5. Publishing Flow

```
User schedules post
        │
        ▼
┌──────────────────┐
│  Create post doc  │  status: "scheduled"
│  in Firestore     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Create Cloud     │  scheduleTime = post.scheduledAt
│  Task             │  target = publishPost function URL
└────────┬─────────┘
         │
    (waits until scheduled time)
         │
         ▼
┌──────────────────┐
│  Cloud Function:  │  Triggered by Cloud Task
│  publishPost      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  For each target  │
│  platform:        │──┐
└──────────────────┘  │
         │            │  (parallel per platform)
         ▼            │
┌──────────────────┐  │
│  Get account +    │  │
│  decrypt token    │  │
│  Upload media     │  │
│  Call platform API│  │
│  Record result    │◄─┘
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Update post doc  │  status: "published" | "partial" | "failed"
│  with results     │  per-platform results saved
└──────────────────┘
```

---

## 6. OAuth Connection Flow

```
User clicks "Connect Instagram"
        │
        ▼
Frontend redirects to:
  /api/auth/connect/instagram
        │
        ▼
Cloud Function generates OAuth URL
  → Redirect to Meta OAuth consent screen
        │
        ▼
User grants permissions
        │
        ▼
Meta redirects to callback URL:
  /api/auth/callback/instagram?code=xxx
        │
        ▼
Cloud Function exchanges code for tokens
  → Encrypt tokens
  → Store in socialAccounts collection
  → Redirect user back to settings page
```

---

## 7. Folder Structure

```
social-scheduler/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   ├── page.tsx              # Dashboard home (upcoming posts)
│   │   ├── calendar/page.tsx     # Calendar view
│   │   ├── create/page.tsx       # Post creator
│   │   ├── posts/page.tsx        # All posts list
│   │   ├── media/page.tsx        # Media library
│   │   └── settings/
│   │       ├── page.tsx          # General settings
│   │       └── accounts/page.tsx # Social account connections
│   ├── api/
│   │   └── auth/
│   │       ├── connect/[platform]/route.ts
│   │       └── callback/[platform]/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── calendar/
│   │   ├── CalendarView.tsx
│   │   └── PostCard.tsx
│   ├── post/
│   │   ├── PostCreator.tsx
│   │   ├── PlatformSelector.tsx
│   │   ├── MediaUploader.tsx
│   │   └── PostPreview.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── accounts/
│       ├── ConnectButton.tsx
│       └── AccountCard.tsx
├── lib/
│   ├── firebase/
│   │   ├── config.ts             # Firebase client config
│   │   ├── admin.ts              # Firebase Admin SDK
│   │   ├── auth.ts               # Auth helpers
│   │   └── firestore.ts          # DB helpers
│   ├── platforms/
│   │   ├── types.ts              # Shared interfaces
│   │   ├── instagram.ts
│   │   ├── facebook.ts
│   │   ├── youtube.ts
│   │   ├── threads.ts
│   │   └── linkedin.ts
│   └── utils/
│       ├── encryption.ts         # Token encryption/decryption
│       └── dates.ts              # Timezone helpers
├── functions/                    # Cloud Functions (separate deploy)
│   ├── src/
│   │   ├── index.ts              # Function exports
│   │   ├── publishPost.ts        # Main publisher
│   │   ├── refreshTokens.ts      # Cron: refresh expiring tokens
│   │   └── platforms/            # Platform-specific publish logic
│   │       ├── instagram.ts
│   │       ├── facebook.ts
│   │       ├── youtube.ts
│   │       ├── threads.ts
│   │       └── linkedin.ts
│   ├── package.json
│   └── tsconfig.json
├── hooks/
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── useCalendar.ts
├── types/
│   └── index.ts                  # Shared TypeScript types
├── public/
├── agentlog.md
├── PRD.md
├── ARCHITECTURE.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── firebase.json
├── firestore.rules
└── .env.local
```

---

## 8. Security Considerations

| Concern | Approach |
|---------|----------|
| OAuth tokens | Encrypted at rest in Firestore using GCP Secret Manager key |
| Firestore rules | Users can only read/write their own documents |
| Media uploads | Signed upload URLs with size limits, validated MIME types |
| API routes | Authenticated via Firebase Auth ID tokens |
| Cloud Functions | Service account with minimal permissions |
| Environment secrets | Stored in GCP Secret Manager, not in code |
| CORS | Restricted to app domain only |

---

## 9. Scaling Path (Post-MVP)

1. **Multi-tenancy**: Add `organizationId` to all collections, update Firestore rules
2. **Team roles**: Add `members` subcollection with role-based access
3. **Analytics**: Store engagement data from platform APIs, build dashboard
4. **Billing**: Integrate Stripe, add usage limits per plan
5. **More platforms**: TikTok, Pinterest, X (Twitter) - just add new platform modules
6. **AI features**: Content suggestions via OpenAI, auto-hashtags, best-time-to-post
