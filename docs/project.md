Project Title: AtomaClip AI
Sub-title: The Autonomous Knowledge Layer for High-Velocity Research.
1. The "AI-Enhanced" Features
To make this stand out to your company’s founder, add these "Intelligent" layers:
AI Auto-Tagging: The user shouldn't have to manually tag "Market Research." The AI should analyze the clip and the source URL to apply tags automatically.
Semantic (Vector) Search: (This is the big one!) Instead of searching for the exact word, users can search for concepts.
User Search: "Why are electric cars expensive?"
AtomaClip AI finds: A clip about "Lithium-ion battery supply chain constraints."


Contextual "Ghost" Paragraphs: When you clip a sentence, the AI automatically saves the 2 sentences before and after the clip as hidden metadata. This ensures that when you read it 6 months later, you have the full context without visiting the URL.
"Daily Spark" Email: Every morning, the AI sends you 3 related "Atoms" from your library to help you connect dots between different research sessions.
2. Target User (The High-Value Pivot)
Primary: Content Strategists, AI Prompt Engineers, and Legal Researchers.
Why? These people get paid to find specific "Atoms" of info. Time saved = Money earned.
3. Updated Monetization
Free: 20 Clips/mo.
Pro ($5/mo): Unlimited Clips + Search.
Team Intelligence ($15/user/mo): A shared "Team Brain." If I clip something about "Competitor A," my teammate gets a notification or sees it in their dashboard. (This is where the big money is).

4. Technical Specifications (The Upgrade)
Updated Database (Vector Support)
Table
Fields
Insights
(Add) embedding (Vector Type for AI Search), auto_tags (JSONB)
Teams
id, org_name, admin_id (For the B2B play)

AI API Endpoints
POST /v1/ai/embed: Converts the clip into a vector for semantic search.
POST /v1/ai/suggest-tags: Returns 3-5 tags based on the content.
GET /v1/search/semantic: Allows users to search their library using natural language questions.

