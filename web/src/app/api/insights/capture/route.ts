export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HfInference } from "@huggingface/inference";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getGeminiEmbedding } from "@/lib/gemini";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function getUser(cookieStore: any, authHeader?: string) {
  console.log("getUser - authHeader present:", !!authHeader)
  
  const options: any = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }

  if (cookieStore) {
    options.cookies = {
      getAll() {
        return cookieStore.getAll().map(({ name, value }: any) => ({ name, value }))
      },
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  )

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    console.log("getUser - testing token (first 10 chars):", token.substring(0, 10))
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error) {
      console.error("getUser - Supabase Auth Error:", error.message)
    }
    if (user) {
      console.log("getUser - Auth success for:", user.email)
      return user
    }
  }

  if (cookieStore) {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (user) {
      console.log("getUser - Cookie auth success for:", user.email)
      return user
    }
  }

  console.warn("getUser - No valid user found")
  return null
}

async function getAiTags(content: string): Promise<string[]> {
  try {
    const result = await hf.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: content.slice(0, 500),
      parameters: {
        candidate_labels: ["technology", "science", "business", "health", "entertainment", "education", "politics", "sports", "news", "tips", "tutorial", "review", "opinion", "data", "research"]
      }
    });
    
    if (result && Array.isArray(result)) {
      return result.map((r: any) => r.label.toLowerCase()).slice(0, 5);
    }
  } catch (err) {
    console.error("Tagging failed:", err);
  }
  return ["research"];
}

async function getAiSummary(content: string): Promise<string | null> {
  try {
    const result = await hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: content.slice(0, 1024),
      parameters: {
        max_length: 60,
        min_length: 30
      }
    });
    return result.summary_text;
  } catch (err) {
    console.error("Summarization failed:", err);
    return null;
  }
}

async function getAiEmbedding(content: string): Promise<number[] | null> {
  try {
    // Upgraded to Gemini Embeddings
    const embedding = await getGeminiEmbedding(content);
    return (embedding as number[]) || null;
  } catch (err) {
    console.error("Embedding failed:", err);
  }
  return null;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  let aiStatus = "success";
  
  try {
    let cookieStore = null;
    try {
      cookieStore = cookies()
    } catch (e) {}
    
    const authHeader = req.headers.get('Authorization')
    console.log("Capture - Auth header:", authHeader)
    const user = await getUser(cookieStore, authHeader || undefined)
    console.log("Capture - User:", user)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { 
      content, 
      context_before, 
      context_after, 
      user_note, 
      source_url, 
      page_title 
    } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400, headers: corsHeaders });
    }

    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0],
        }
      })
    }

    if (dbUser.subscriptionTier === "free") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await prisma.insight.count({
        where: {
          userId: dbUser.id,
          createdAt: { gte: startOfMonth }
        }
      });

      if (monthlyCount >= 20) {
        return NextResponse.json(
          { error: "Free tier limit reached (20 clips/month). Upgrade to Pro for unlimited clips." },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    let tags: string[] = ["research"];
    let embedding: number[] | null = null;
    let finalNote = user_note;

    try {
      const tasks: any[] = [
        getAiTags(content),
        getAiEmbedding(content)
      ];
      
      // If user note is empty, generate AI summary
      if (!user_note || user_note.trim() === "") {
        tasks.push(getAiSummary(content));
      }

      const [aiTags, aiEmbedding, aiSummary] = await Promise.all(tasks);
      
      tags = aiTags;
      embedding = aiEmbedding;
      if (aiSummary) {
        finalNote = `AI Summary: ${aiSummary}`;
      }
      
      if (!embedding) aiStatus = "partial";
    } catch (aiErr) {
      console.error("AI Pipeline failed entirely");
      aiStatus = "failed";
    }

    try {
      const insightId = crypto.randomUUID();
      
      if (embedding) {
        try {
          await prisma.$executeRaw`
            INSERT INTO insights (
              id, content, "contextBefore", "contextAfter", "userNote", 
              "sourceUrl", "pageTitle", tags, "userId", "createdAt", "updatedAt",
              embedding
            ) VALUES (
              ${insightId}, ${content}, ${context_before}, ${context_after}, ${finalNote},
              ${source_url}, ${page_title}, ${tags}, ${dbUser.id}, NOW(), NOW(),
              CAST(${embedding}::float8[] AS vector)
            )
          `;
        } catch (embedError: any) {
          console.error("Embedding insert failed, saving without:", embedError.message);
          embedding = null;
          aiStatus = "partial";
        }
      }

      if (!embedding) {
        await prisma.insight.create({
          data: {
            id: insightId,
            content,
            contextBefore: context_before,
            contextAfter: context_after,
            userNote: finalNote,
            sourceUrl: source_url,
            pageTitle: page_title,
            tags,
            userId: dbUser.id
          }
        });
      }

      return NextResponse.json(
        { success: true, insight_id: insightId, ai_status: aiStatus }, 
        { status: aiStatus === "success" ? 200 : 201, headers: corsHeaders }
      );

    } catch (dbError: any) {
      console.error("Database Save Error:", dbError);
      return NextResponse.json({ error: "Database save failed" }, { status: 500, headers: corsHeaders });
    }

  } catch (error: any) {
    console.error("Critical Capture Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
  }
}
// fix cache
