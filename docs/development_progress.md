# AtomaClip AI - Development Progress

## Session Summary (April 3, 2026)

### Completed Features

#### 1. Real Usage Tracking
- Added `/api/usage/stats` endpoint that returns:
  - Current month's clip count from database
  - Total atoms count
  - Subscription tier (free/pro)
  - Days until monthly reset
  - Top tags and tag distribution
- Updated Settings page to fetch real usage data
- Added usage progress bar in nav-user dropdown
- Free users see upgrade prompts, pro users see "Scholar Pro" badge

#### 2. Navigation Improvements
- Added "Back to Dashboard" buttons in Settings and Profile pages
- Added ArrowLeft icon for quick navigation back
- Consistent styling across pages

#### 3. Profile Page - Real Data from DB
- Fetches stats from `/api/usage/stats` API
- Shows real total atoms, monthly atoms, hours saved
- User level calculated from total atoms (level = floor(totalAtoms / 50) + 1)
- Displays real top tags from user's library
- Knowledge distribution chart based on actual tags

#### 4. Conversation Chat in Projects
- Complete UI overhaul - chat interface on right side (384px panel)
- Maintains conversation history for follow-up questions
- Suggestion prompts for first-time users ("What are the main themes?", etc.)
- Toggle panel to show/hide chat
- Loading animation (bouncing dots) while AI responds
- AI responses formatted with bullet points (elaborate style)
- Separate scroll for chat vs main content

#### 5. AI Improvements for Research Assistant
- Enhanced prompt in `generateDeepInsight()` for more detailed, bullet-point responses
- Conversation history support for contextual follow-ups
- Temperature 0.7 for more creative responses
- Max 1000 tokens for detailed answers

#### 6. PDF Clipping
- Auto-detects PDFs from: arXiv, ResearchGate, JSTOR, Google Docs PDF viewer, Springer, Wiley
- Injects PDF.js from CDN for native PDF support
- PDF-specific capture popup with:
  - Preview of selected text
  - PDF badge indicator (amber/orange styling)
  - Same workspace/project selection
- Floating hint when PDF mode is active
- Separate capture handler for web vs PDF

#### 7. Weekly Digest Email
- Email template: Beautiful HTML with:
  - Weekly stats (atoms this week, total library)
  - Recent captures (last 3)
  - Top tags with counts
  - Suggested searches based on topics
  - CTA button to open app
- API route: `POST /api/digest/weekly` (requires CRON_SECRET)
- User email preferences (emailDigest, emailMarketing fields in User model)
- Settings UI for toggling weekly digest on/off

#### 8. Database Schema Changes
Added to User model:
```prisma
emailDigest    Boolean @default(true)   // Weekly digest emails
emailMarketing Boolean @default(false) // Marketing emails
```

### Environment Variables Added
| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Email sending (get from resend.com) |
| `CRON_SECRET` | Secures weekly digest cron endpoint |
| `NEXT_PUBLIC_APP_URL` | Used in email links |

### Pending Features (from roadmap)

#### High Priority - Monetization
- [ ] Stripe/Xendit payment integration
- [ ] Upgrade prompt modal when free users hit 20 clips
- [ ] Extension usage display (X/20 clips in popup)

#### Medium Priority - UX
- [ ] Notion integration
- [ ] Slack webhook management
- [ ] Auto-citation (extract DOI, author from clips)

### Current Issues
1. **Extension popup collections not loading** - Debug logging added, waiting for user feedback from console logs
2. **Prisma schema needed `npx prisma db push`** - Fixed locally

### Branch
- Remote: `https://github.com/y0moriko/AtomaClip-AI.git`
- Branch: `feat/workspaces-and-projects`
- Latest commit: `28234c7` - "debug: Add logging for workspace loading in extension popup"

### Next Steps When User Returns
1. User to check Chrome DevTools console for `AtomaClip:` logs when capturing
2. Investigate why workspaces/projects not loading in extension popup
3. Potentially implement upgrade flow once UX features are tested

### Files Modified
- `web/src/app/api/usage/stats/route.ts` - Usage tracking
- `web/src/app/app/settings/page.tsx` - Real data + email preferences
- `web/src/app/app/profile/page.tsx` - Real data from DB
- `web/src/app/app/projects/[id]/page.tsx` - Conversation chat
- `web/src/lib/openrouter.ts` - Enhanced AI prompts
- `web/prisma/schema.prisma` - Added emailDigest/emailMarketing
- `web/src/lib/email.ts` - Email templates
- `web/src/app/api/digest/weekly/route.ts` - Weekly digest API
- `web/src/app/api/preferences/route.ts` - User preferences API
- `extension/content_script.js` - PDF detection + logging
- `extension/pdf_handler.js` - PDF handling (new)
- `extension/content_styles.css` - PDF styling
- `extension/background.js` - PDF capture handler
- `extension/manifest.json` - Version bump to 1.1
- `docs/monetization_roadmap.md` - Added implementation notes

### Notes
- The Workspaces in Extension feature was already implemented in the original code

## Session Summary (April 4, 2026)

### Completed Features

#### 1. Auto-Citation
- Added `doi`, `authors`, `publicationDate` fields to Insight model
- New AI function `extractCitationMetadata()` in `openrouter.ts`
- Extracts DOI from URL patterns (arXiv, JSTOR, etc.) + AI extraction
- Updated capture route to save citation metadata

#### 2. Extension Workspace Loading Fix
- Enhanced cookie detection in background.js (`sb-access`, `access-token`)
- Added console logs with `AtomaClip:` prefix for debugging
- Fixed content_script.js workspace loading with better error handling

#### 3. Chat UI Fixes
- Added custom scrollbar to chat panel
- Fixed subtle border styling (reduced opacity to 50%)
- Fixed page scrolling vs chat scrolling issue
- Final fix: `h-full` on sidebar container

### Pending Features
- Stripe/Xendit payment integration
- Upgrade prompt modal at 20 clips
- Extension usage display (X/20 clips)
- Notion integration
- Slack webhook management

### Branch
- Remote: `https://github.com/y0moriko/AtomaClip-AI.git`
- Branch: `feat/workspaces-and-projects`
- Latest commit: `495be24` - "fix: Ensure chat panel has proper height for scrolling"

### Files Modified
- `web/prisma/schema.prisma` - Added citation fields
- `web/src/lib/openrouter.ts` - Added extractCitationMetadata function
- `web/src/app/api/insights/capture/route.ts` - AI citation extraction
- `web/public/extension/background.js` - Cookie detection fix
- `web/public/extension/content_script.js` - Debug logs
- `web/src/app/app/projects/[id]/page.tsx` - Chat UI fixes
- `web/src/app/globals.css` - Custom scrollbar styling

### Next Steps
1. User to check Chrome DevTools console for `AtomaClip:` logs
2. Test chat scrolling after fix
3. Run `npx prisma db push` to add citation columns
- PDF Clipping and Weekly Digest were newly added
- Profile page was updated to show real data instead of hardcoded stats
