📋 AtomaClip AI: Technical Requirements & Initialization Guide
1. Core Tech Stack
Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS + Lucide React (Icons)
UI Library: Radix UI + Shadcn UI (Components)
Database: Supabase (PostgreSQL with pgvector enabled)
ORM: Prisma
AI Engine: Google Gemini 1.5 Flash (@google/generative-ai)
Extension: Chrome Manifest V3
2. Mandatory Dependencies
Run these commands in your terminal to ensure the environment is ready:
A. UI & Icons
code
Bash
npm install lucide-react clsx tailwind-merge tailwindcss-animate framer-motion
B. Database & AI
code
Bash
npm install @prisma/client @google/generative-ai @supabase/supabase-js
npm install -D prisma
C. Shadcn Components (Required for Dashboard Design)
code
Bash
npx shadcn-ui@latest add card button input badge toast skeleton separator scroll-area
3. Environment Variables (.env)
Create a .env file in the root directory. Do not skip these.
code
Env
# Database (Get from Supabase > Settings > Database)
DATABASE_URL="postgres://postgres.[USER]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.[USER]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase Keys (Get from Supabase > Settings > API)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI Key (Get from https://aistudio.google.com/)
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# Auth (Generate a random string for NEXTAUTH_SECRET)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-long-string-here"
4. Prisma Schema Requirement (prisma/schema.prisma)
The AI must use this exact schema to ensure semantic search and "Ghost Paragraphs" work.
code
Prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Insight {
  id            String   @id @default(uuid())
  userId        String?
  content       String   @db.Text
  contextBefore String?  @db.Text
  contextAfter  String?  @db.Text
  userNote      String?  @db.Text
  sourceUrl     String
  pageTitle     String
  tags          String[]
  // Note: embedding is handled via raw SQL in Supabase for pgvector
  createdAt     DateTime @default(now())

  @@map("insights")
}
5. Chrome Extension Requirements
The /extension folder must remain separate from the Next.js /app folder.
manifest.json: Version 3.
Permissions: ["contextMenus", "activeTab", "storage", "scripting"]
Host Permissions: ["https://*/*", "http://*/*"]
Design: Must use a content.js to inject UI rather than opening new tabs.
6. AI Processing Requirements (Gemini 1.5 Flash)
When processing a new "Atom," the backend must:
Tagging: Send content to Gemini to return 3-5 keywords.
Embedding: Send content to Gemini text-embedding-004 to generate a 768-dimension vector.
Storage: Store both the text and the vector in Supabase.