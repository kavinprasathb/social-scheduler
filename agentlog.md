# Agent Log - Social Media Scheduler

---

## 1. Project Overview

**Project Name:** Social Media Scheduler
**Goal:** Build a web app that automates social media posting across Instagram, YouTube, Facebook, Threads, and LinkedIn. Users can plan content calendars (2 days / 1 week / 1 month), schedule posts to specific dates, and publish a single post to all connected platforms simultaneously.
**Tech Stack:**
- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4
- **Auth:** Firebase Authentication (Google + Email)
- **Database:** Firestore (NoSQL)
- **File Storage:** Firebase Cloud Storage
- **Backend Logic:** Cloud Functions (Gen 2)
- **Scheduling:** Google Cloud Tasks
- **Frontend Hosting:** Vercel
- **Social APIs:** Meta Graph API (IG/FB/Threads), YouTube Data API v3, LinkedIn Marketing API

---

## 2. Current Status

**Current Phase:** Project Setup (base structure complete, ready for Firebase console setup)
**Current Problem:** None
**Last Updated:** 2026-02-18

---

## 3. Daily Development Log

---

### 2026-02-18 (Session 2) - Project Initialization

#### Changes Made
- Initialized Next.js 16 project with TypeScript, Tailwind CSS 4, ESLint
- Installed dependencies: `next@16.1.6`, `react@19.2.4`, `firebase@12.9.0`, `firebase-admin`
- Created config files: `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`
- Created `.env.local.example` with all required environment variables
- Created app structure with App Router:
  - Landing page (`/`)
  - Auth pages: `/login`, `/signup` (with Google OAuth + email/password forms)
  - Dashboard layout with sidebar navigation + header
  - Dashboard pages: `/dashboard`, `/dashboard/calendar`, `/dashboard/create`, `/dashboard/posts`, `/dashboard/media`, `/dashboard/settings`, `/dashboard/settings/accounts`
- Created components: `Sidebar.tsx`, `Header.tsx`
- Created Firebase config: `lib/firebase/config.ts` (client), `lib/firebase/admin.ts` (server)
- Created TypeScript types: `types/index.ts` (User, Post, SocialAccount, Media, etc.)
- Created platform abstraction interface: `lib/platforms/types.ts`
- Build passes successfully with all 10 routes

#### What Worked
- Manual project setup (instead of `create-next-app`) avoided interactive prompt issues
- Tailwind CSS 4 with `@tailwindcss/postcss` plugin works cleanly
- CSS custom properties for theming (light/dark) — no extra theme library needed
- All pages render as static content in build

#### What Failed
- `create-next-app` interactive prompts blocked in non-TTY environment — switched to manual setup
- Initial build failed because `firebase-admin` wasn't installed (separate from `firebase` client SDK)

#### Insights / Learning
- Next.js 16 uses Turbopack by default for builds
- `firebase` (client) and `firebase-admin` (server) are separate npm packages
- Tailwind CSS 4 uses `@tailwindcss/postcss` instead of the old `tailwindcss` PostCSS plugin

#### Next Steps
- Set up Firebase project in GCP console (Auth + Firestore + Storage)
- Add `.env.local` with real Firebase credentials
- Implement auth context/hooks with Firebase Auth
- Wire up login/signup pages with actual Firebase Auth
- Install and configure `@fullcalendar/react` for calendar view

---

### 2026-02-18 (Session 1) - Planning

#### Changes Made
- Created project directory `social-scheduler`
- Created PRD.md with full product requirements
- Created ARCHITECTURE.md with system design, data model, folder structure
- Created agentlog.md for development tracking

#### What Worked
- Defined clear MVP scope: Auth + Post Creator + Calendar + Publishing Engine
- Chose Firebase stack for rapid serverless development
- Identified all 5 platform API requirements and limitations

#### What Failed
- N/A (planning phase)

#### Insights / Learning
- Meta API (Instagram/Facebook/Threads) requires business account + app review process — should start early
- YouTube API only supports video uploads, not community posts
- Cloud Tasks is better than Cloud Scheduler for one-off scheduled posts
- Threads API is relatively new — may have limitations

#### Next Steps
- Initialize Next.js project (done in Session 2)

---

## 4. Architecture Decisions

| # | Decision | Alternatives Considered | Reason |
|---|----------|------------------------|--------|
| 1 | Firestore over Cloud SQL | PostgreSQL on Cloud SQL | Serverless, real-time sync, document model fits our data, cheaper at low scale |
| 2 | Cloud Tasks over Cloud Scheduler | Cron-based scheduling | Cloud Tasks supports one-off scheduled execution per post, Cloud Scheduler is for recurring jobs |
| 3 | Vercel for frontend over Firebase Hosting | Firebase Hosting, Cloud Run | First-class Next.js SSR support, edge network, better DX |
| 4 | Tailwind CSS 4 with CSS custom properties | shadcn/ui, MUI, Chakra UI | Direct Tailwind usage, CSS variables for theming, no heavy component library dependency |
| 5 | Platform abstraction interface | Direct API calls everywhere | Common `SocialPlatformPublisher` interface makes adding new platforms easy |
| 6 | Firebase Auth over custom auth | NextAuth.js, Auth0, Clerk | Already in Firebase ecosystem, free tier generous, Google provider built-in |
| 7 | Manual project setup over create-next-app | create-next-app CLI | Avoids interactive prompt issues, full control over config |

---

## 5. Known Issues & Fixes

| # | Problem | Cause | Fix | Date |
|---|---------|-------|-----|------|
| 1 | `create-next-app` prompts hang in non-TTY | Interactive prompts need a terminal | Manual setup: `npm init` + install deps individually | 2026-02-18 |
| 2 | Build fails: `Cannot find module 'firebase-admin/app'` | `firebase-admin` is a separate package | `npm install firebase-admin` | 2026-02-18 |

---

## 6. Pending Tasks

### Phase 1: Project Setup
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS
- [x] Create base layout (sidebar + header + routing)
- [x] Build login/signup pages
- [x] Set up Firebase config files + types
- [ ] Create Firebase project in GCP console
- [ ] Configure Firebase Auth (Google + Email providers)
- [ ] Set up Firestore database with security rules
- [ ] Set up Cloud Storage bucket
- [ ] Implement auth context/hooks
- [ ] Wire auth pages to Firebase

### Phase 2: Core Features
- [ ] Build Post Creator page (text editor + media upload)
- [ ] Build Calendar View (day/week/month with FullCalendar)
- [ ] Build Media Library page
- [ ] Implement Firestore CRUD for posts
- [ ] Implement media upload to Cloud Storage

### Phase 3: Platform Connections
- [ ] Register Meta Developer App (Instagram/Facebook/Threads)
- [ ] Register Google Cloud OAuth (YouTube)
- [ ] Register LinkedIn Developer App
- [ ] Build OAuth connect/callback flows
- [ ] Build Account Settings page
- [ ] Implement token encryption + storage

### Phase 4: Publishing Engine
- [ ] Set up Cloud Functions project
- [ ] Build `publishPost` Cloud Function
- [ ] Implement platform-specific publishers (IG, FB, YT, Threads, LI)
- [ ] Integrate Google Cloud Tasks for scheduling
- [ ] Build token refresh cron function
- [ ] Add retry logic with exponential backoff

### Phase 5: Polish & Testing
- [ ] Error handling for all API calls
- [ ] Loading states and skeleton screens
- [ ] Mobile responsive design
- [ ] End-to-end testing of publish flow
- [ ] Deploy frontend to Vercel
- [ ] Deploy functions to Firebase

---

## 7. Experiment Log

| # | Experiment | Goal | Result | Date |
|---|-----------|------|--------|------|
| 1 | create-next-app in non-TTY | Auto-scaffold Next.js | Failed — interactive prompts block | 2026-02-18 |
| 2 | Manual npm init + install | Set up Next.js without CLI | Success — full control, clean build | 2026-02-18 |
