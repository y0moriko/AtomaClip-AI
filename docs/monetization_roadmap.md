# AtomaClip AI: Monetization & Growth Roadmap

## 1. Monetization Strategy (MVP to Pro)
The goal is to transition AtomaClip from a research tool to a paid "Knowledge Layer" for high-stakes research.

### **Proposed Pricing Models (Global)**
*   **Free Tier (The "Scout" Plan):**
    *   Limit: 30 clips (Atoms) per month.
    *   Standard search (keyword-based).
    *   Basic web clipping only.
*   **Pro Tier (The "Scholar" Plan) - ~$8–$12/month:**
    *   Unlimited clips.
    *   **PDF Clipping Support** (Critical for academic freelancers).
    *   Semantic/AI Search (Find by concept).
    *   Priority Gemini 1.5 Flash processing.

### **Localized Pricing (Philippines & Students)**
Since many academic freelancers in the PH are students, we must apply **Purchasing Power Parity (PPP)**:
*   **PH Student Plan:** ₱149 - ₱199/month (approx. $2.50–$3.50).
    *   *Why?* Matches the price of a few cups of coffee or a cheap mobile data promo.
*   **PH Freelancer Plan:** ₱399/month (approx. $7.00).
*   **Payment Methods:** Integrate **GCash/Maya** (via Stripe or PayMongo) as these are the primary tools for PH students.

---

## 2. The "Power Researcher" Conversion Funnel

### **Step 1: The Landing Page (The "Utility" Pitch)**
*   **Header:** AtomaClip AI | [Login] [Install Extension]
*   **Headline:** Stop Bookmarking. Start Clipping.
*   **Sub-headline:** A lightweight Chrome extension to capture specific web insights. Search your library by meaning, not just keywords.
*   **The "Why" (USPs):**
    *   **Save Atoms, not URLs:** Capture the exact sentence you need.
    *   **Ghost Paragraphs:** We save the context before and after every clip automatically.
    *   **Semantic Search:** Ask questions to find your notes instantly (Powered by Gemini).
*   **Primary CTA:** [Add to Chrome — Setup in 30 Seconds]

### **Step 2: Onboarding (The "First Clip" Success)**
*   **Guided Setup:** After installation, show a 3-step overlay: 1. Pin Icon, 2. Open Article, 3. Right-Click to Capture.
*   **Interactive Dashboard:** If the library is empty, display a large: **"Need an example? [Clip this sentence!]"** button to trigger the first save.
*   **Real-time Feedback:** Use browser toast notifications: "Atom Saved! [View in Dashboard]" to confirm the utility immediately.

### **Step 3: Conversion (The "Power User" Wall)**
*   **The Usage Tracker:** A progress bar in the sidebar: `Atoms: 12 / 20`. 
*   **The Value Trigger:** At 20 clips, trigger a non-intrusive modal: *"You're a Power Researcher! You've reached the free limit. Upgrade to keep your research momentum."*
*   **The Pro Offer ($5/mo - Approx ₱280):**
    *   Unlimited Atomic Clips.
    *   One-Click Export to Google Docs/Markdown.
    *   **Priority Processing:** No "Cold Starts" or sleeping servers.
    *   Advanced AI Insights (Longer context windows).

### **Step 4: Retention (The "Weekly Digest")**
*   **Weekly Recap:** Email users a summary: *"This week, you saved 14 insights on [Topic A]. Your library is growing!"*
*   **Search Hints:** Remind users of the AI power: *"Can't find that fact? Try asking: 'What was that quote about the GDP?'"*

---

## 3. Feature Roadmap for MVP Attraction
To attract **Academic Freelancers**, we need to bridge the gap between "web clipping" and "research management."

### **Top Priority: PDF Clipping**
*   **Problem:** Most academic sources are PDFs (ResearchGate, JSTOR, arXiv).
*   **Solution:** Integrate a PDF.js-based overlay in the extension to allow highlighting and "Atoming" within local and web-hosted PDFs.

### **Extension UI: The "Search-Assist" Icon**
*   **Visual Integration:** Add a small AtomaClip icon at the end of search bars (Google, Google Scholar, DuckDuckGo).
*   **Function:** One-click to "Search my Brain" for the same query, showing relevant saved clips directly on the search results page.

### **Organization & Workflow**
*   **Workspaces:** Group clips by project/client (e.g., "Thesis - AI Ethics").
*   **Auto-Citation:** Automatically grab the URL, DOI, or Metadata of a clip to generate citations.

---

## 3. Technical & Architectural Improvements (Based on Codebase)
To support the transition to a paid product, we will implement these high-impact optimizations:

### **AI Efficiency & Cost Control**
*   **Embedding Cache:** Implement a hashing system for clipped content. Before calling `getGeminiEmbedding`, check if the hash already exists in a `GlobalSource` table to avoid paying for the same embedding twice (especially for popular research papers).
*   **Token Management:** Limit "Ghost Paragraph" extraction to a specific token count to keep Gemini processing costs predictable.

### **Advanced Research Features**
*   **Hybrid Search (Semantic + Exact):** Combine `pgvector` (concept-based) with PostgreSQL **Full-Text Search (FTS)** using Reciprocal Rank Fusion (RRF). This ensures researchers can find exact terms (e.g., "2024 GDP") AND general concepts (e.g., "economic growth").
*   **Auto-Citation Schema:** Expand the `Insight` model to include `doi`, `author`, and `publicationDate`. Use Gemini to automatically extract these from the `sourceUrl` and `content` during the clipping process.

### **Monetization Enforcement**
*   **Tier-Based Rate Limiting:** Add a middleware to the `/api/insights` route that checks the `subscriptionTier` from the `User` model. Enforce the "30 Atoms/month" limit for Free users.
*   **PH-Ready Payment Gateways:** Prioritize **Xendit** or **PayMongo** for the Philippine market to provide seamless **GCash/Maya** integration, which is essential for student freelancers.

---

## 4. Architecture & Scalability Check
*   **Current Load:** The Next.js + Supabase + Prisma stack is highly scalable.
*   **5-User Capacity:** This stack can handle 5 or even 5,000 users without significant architectural changes.
*   **Bottleneck:** The primary cost will be **Gemini API usage** for embeddings and auto-tagging. We should implement **caching** for embeddings if users clip the same source multiple times.

---

## 4. Market Suggestions
*   **Early Bird Offer:** A "Lifetime Deal" (LTD) for the first 100 users for a flat fee (e.g., $49). This builds a seed community and provides immediate cash flow for API costs.
*   **Affiliate Program:** Target academic influencers on Twitter/LinkedIn.
