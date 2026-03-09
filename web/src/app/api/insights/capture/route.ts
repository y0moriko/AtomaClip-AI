import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HfInference } from "@huggingface/inference";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function getUser(cookies: any) {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }: any) => ({ name, value }))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  return user
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

async function getAiEmbedding(content: string): Promise<number[] | null> {
  try {
    const result = await hf.featureExtraction({
      model: "sentence-transformers/all-mpnet-base-v2",
      inputs: content
    }) as unknown;
    
    if (Array.isArray(result)) return (result as number[]).map(Number);
    if (result && Array.isArray((result as any)[0])) return (result as any)[0].map(Number);
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
    const cookieStore = cookies()
    const user = await getUser(cookieStore)
    
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

    try {
      const [aiTags, aiEmbedding] = await Promise.all([
        getAiTags(content),
        getAiEmbedding(content)
      ]);
      tags = aiTags;
      embedding = aiEmbedding;
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
              ${insightId}, ${content}, ${context_before}, ${context_after}, ${user_note},
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
            userNote: user_note,
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
