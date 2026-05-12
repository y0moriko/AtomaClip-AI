# Changelog: AtomaClip AI

All notable changes to the AtomaClip AI project, from the initial "Knowledge Layer" concept to the current "Power Researcher" monetization phase.

---

## [[v0.4.0] - 2026-03-28] - The "Power Researcher" & Monetization Phase
This milestone focuses on transforming AtomaClip from a research tool into a professional, paid product for academic freelancers and content creators.

### 🚀 Features & Enhancements
- **Landing Page Revamp**: Implemented a high-conversion "Utility" pitch with the "Stop Bookmarking. Start Clipping" hero section and clear USPs (Ghost Paragraphs, Atoms, Semantic Search).
- **Research Identity (Profile Page)**: Created a new Profile dashboard featuring:
  - **Research Stats**: Total Atoms, Hours Saved, and Research Streaks.
  - **Knowledge Distribution**: Visual progress bars showing top research categories.
  - **Research Persona**: Customizable focus and professional links (LinkedIn/Scholar).
- **Utility Hub (Settings Page)**: Created a comprehensive Settings dashboard including:
  - **Usage Tracker**: Visual progress bar for the 20-clip free limit (Monetization Engine).
  - **Extension Preferences**: Controls for "Ghost Paragraph" depth and AI tagging sensitivity.
  - **PH-Ready Billing**: Placeholder for GCash/Maya integration.
- **Google OAuth Integration**: Added "One-Click" Google Sign-in to both Login and Signup pages.
- **Premium UI Polish**: Refactored Sidebar, TeamSwitcher, and User Menu with a premium "Indigo & Glass" aesthetic.

### 🛠️ Bug Fixes & Architecture
- **Vault Loading Fix**: Resolved a critical bug where the workspace/vault would get stuck in a "Loading" state.
- **Dynamic Profile Fetching**: Implemented real-time user data fetching from Supabase (Name/Avatar).
- **Auth Callback Route**: Created server-side callback handler for secure Supabase OAuth.

---

## [[v0.3.0] - 2026-03-15] - The "Collaborative Brain" Update
Shifted focus toward organizational research with Workspaces and Projects.

### 🚀 Features
- **Workspaces & Projects**: Introduced the ability to group Atoms by specific research projects (e.g., "Thesis - AI Ethics").
- **Deep Semantic Search**: Upgraded to **Gemini text-embedding-004** for deeper conceptual matching across the entire library.
- **AI Project Synthesis**: Added the ability for Gemini to synthesize insights across all clips within a specific project.
- **Real-Time Updates**: Integrated Supabase real-time subscriptions for instant dashboard refreshes when clipping.

### 🛠️ Technical Improvements
- **OpenRouter Integration**: Switched AI tagging and summarization to OpenRouter for improved reliability.
- **Prisma Schema Overhaul**: Updated the schema to support nested Workspaces -> Projects -> Insights architecture.
- **CORS & Extension Auth**: Fixed complex CORS issues by routing API requests through the background script.

---

## [[v0.2.0] - 2026-03-05] - The "Core Atomic Loop" (MVP)
The first functional version of the end-to-end capture and retrieval loop.

### 🚀 Features
- **Chrome Extension V3**: Released the first stable version of the web clipper with "Ghost Paragraph" context capture.
- **Professional Dashboard**: A clean, indigo-themed research vault for managing clips.
- **AI Auto-Tagging**: Initial implementation of automatic categorization using LLMs.
- **Semantic Search (v1)**: First concept-based search using `pgvector` in Supabase.
- **CRUD Operations**: Added ability to edit notes, star favorite atoms, and delete clips.

### 🛠️ Technical Improvements
- **Supabase Auth**: Integrated email/password login and signup flow.
- **Railway/Vercel Deployment**: Established CI/CD pipelines for the web and API layers.
- **Extension Auth Bridge**: Developed a secure way to sync web session cookies with the browser extension.

---

## [[v0.1.0] - 2026-02-20] - Concept & Foundation
Initial research and architectural setup.

### 🚀 Features
- **Project Vision**: Defined the "Autonomous Knowledge Layer" strategy.
- **Tech Stack Selection**: Next.js 14, Prisma, Supabase (PostgreSQL + pgvector), and Google Gemini.
- **Initial Schema**: Designed the base `User` and `Insight` models.
- **Contextual "Ghost" Logic**: Conceptualized the metadata-driven context preservation system.

---
*Last Updated: 2026-03-28*
