# Project Specification: AtomaClip AI
**Core Objective:** High-speed capture and semantic retrieval of "Atomic" web insights.

**Architecture:**
- **Frontend:** Manifest V3 Chrome Extension + Next.js Dashboard.
- **Backend:** FastAPI (Python) - *Better for AI/Vector processing than Next.js API.*
- **Database:** Supabase (PostgreSQL) with pgvector enabled.
- **AI Engine:** Gemini 1.5 Flash for metadata extraction and tagging.

**User Flow:**
1. Highlight -> Right-click -> Capture.
2. AI generates embedding and tags in background.
3. User accesses Dashboard for concept-based search and export.