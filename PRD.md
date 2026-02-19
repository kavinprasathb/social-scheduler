# Product Requirements Document (PRD)
# Social Media Scheduler

## 1. Overview

**Product Name:** Social Media Scheduler
**Client:** TBD
**Version:** 1.0 (MVP)
**Last Updated:** 2026-02-18

### Problem Statement
Managing social media presence across multiple platforms (Instagram, YouTube, Facebook, Threads, LinkedIn) is time-consuming. Content creators and businesses need to manually log into each platform, format content per platform, and publish individually. There's no unified workflow for planning, scheduling, and cross-posting.

### Solution
A web application that lets users plan content calendars (2 days, 1 week, or 1 month), schedule posts to specific dates, and publish a single post across all connected social media platforms simultaneously.

### Target Users
- Small business owners managing their own social media
- Social media managers handling one or more brands
- Content creators posting across multiple platforms

---

## 2. Goals & Success Metrics

### MVP Goals
- Users can connect their social media accounts (Instagram, Facebook, YouTube, Threads, LinkedIn)
- Users can create posts with text + images/videos
- Users can schedule posts to specific dates and times
- Posts are automatically published to all selected platforms at the scheduled time
- Calendar view for planning content across days/weeks/months

### Success Metrics
- Post published successfully to all target platforms within 5 minutes of scheduled time
- < 3 seconds page load for calendar and post creation views
- Support for images up to 10MB and videos up to 100MB

---

## 3. User Stories

### Authentication
- As a user, I can sign up / log in with email or Google account
- As a user, I can connect my social media accounts via OAuth

### Content Creation
- As a user, I can create a new post with text content
- As a user, I can attach images (JPG, PNG, WebP) to a post
- As a user, I can attach short videos (MP4, MOV) to a post
- As a user, I can preview how the post will look on each platform
- As a user, I can select which platforms to publish to

### Scheduling
- As a user, I can schedule a post for a specific date and time
- As a user, I can view all scheduled posts in a calendar view (day/week/month)
- As a user, I can drag and drop posts to reschedule them on the calendar
- As a user, I can edit or delete a scheduled post before it's published
- As a user, I can publish a post immediately (skip scheduling)

### Dashboard
- As a user, I can see upcoming scheduled posts
- As a user, I can see published post history with status (success/failed)
- As a user, I can retry a failed post

---

## 4. Platform Requirements

### Instagram
- API: Meta Graph API (Instagram Graph API)
- Content: Images, Carousels, Reels (short video)
- Requirements: Instagram Business/Creator account linked to Facebook Page
- Limitations: No direct story posting via API

### Facebook
- API: Meta Graph API
- Content: Text, Images, Videos, Links
- Requirements: Facebook Page (not personal profile for API access)

### YouTube
- API: YouTube Data API v3
- Content: Videos with title, description, tags
- Requirements: Google/YouTube channel
- Limitations: Video upload only (no community posts in v3)

### Threads
- API: Threads API (Meta)
- Content: Text, Images, Videos
- Requirements: Threads account linked to Instagram

### LinkedIn
- API: LinkedIn Marketing API / Share API
- Content: Text, Images, Videos, Articles
- Requirements: LinkedIn account or Company Page

---

## 5. Feature Specifications

### 5.1 Post Creator
- Rich text editor for post content
- Platform-specific character limits shown in real-time
  - Instagram: 2,200 chars
  - Facebook: 63,206 chars
  - YouTube: 5,000 chars (description)
  - Threads: 500 chars
  - LinkedIn: 3,000 chars
- Media uploader with drag & drop
  - Images: JPG, PNG, WebP (max 10MB)
  - Videos: MP4, MOV (max 100MB)
- Platform selector (checkboxes for each connected platform)
- Per-platform content override (optional: tweak text per platform)

### 5.2 Calendar View
- Three views: Day, Week, Month
- Color-coded by platform or status (draft/scheduled/published/failed)
- Drag & drop to reschedule
- Click to create new post on a date
- Click existing post to edit

### 5.3 Media Library
- Upload and store media files
- Reuse previously uploaded media
- Auto-generate thumbnails
- Storage via Firebase Cloud Storage

### 5.4 Publishing Engine
- Cloud Functions triggered by Cloud Scheduler / Cloud Tasks
- Retry logic: 3 attempts with exponential backoff
- Per-platform publish status tracking
- Error logging with platform-specific error messages

### 5.5 Social Account Management
- OAuth connection flow for each platform
- Token refresh handling (auto-refresh before expiry)
- Disconnect / reconnect accounts
- Connection health status indicator

---

## 6. Non-Functional Requirements

- **Performance:** Calendar loads in < 3s, post creation in < 2s
- **Scalability:** Architecture supports adding more platforms later
- **Security:** OAuth tokens encrypted at rest, no tokens exposed to client
- **Reliability:** 99.5% uptime for publishing engine
- **Mobile:** Responsive design (mobile-friendly, not native app)

---

## 7. Out of Scope (MVP)

- Analytics dashboard (engagement, reach, clicks)
- Team collaboration (multiple users per account)
- AI content suggestions
- Hashtag recommendations
- Bulk import from CSV
- Multi-language support
- Billing / subscription management
- A/B testing for posts
- Comment management / inbox

---

## 8. Timeline Estimate

| Phase | Scope | Duration |
|-------|-------|----------|
| Phase 1 | Project setup, Auth, DB schema, UI shell | Week 1-2 |
| Phase 2 | Post creator, Media upload, Calendar UI | Week 3-4 |
| Phase 3 | OAuth flows for all 5 platforms | Week 5-6 |
| Phase 4 | Publishing engine (Cloud Functions + scheduling) | Week 7-8 |
| Phase 5 | Testing, error handling, polish | Week 9-10 |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Platform API changes | Posts fail to publish | Abstract API layer per platform, monitor changelogs |
| OAuth token expiry | Silent failures | Auto-refresh tokens, health checks, alert on failure |
| Meta API review process | Delayed Instagram/Facebook access | Start Meta App Review early (requires business verification) |
| Video upload size/time | Slow UX, timeouts | Resumable uploads, progress indicators, Cloud Storage signed URLs |
| Rate limits | Throttled publishing | Queue-based publishing with rate limit awareness |
