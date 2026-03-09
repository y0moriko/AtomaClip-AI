import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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
    });
    
    if (Array.isArray(result)) return result.map(Number);
    if (result && Array.isArray(result[0])) return result[0].map(Number);
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
      let user = await prisma.user.findFirst({ where: { email: "test@atomaclip.ai" } });
      if (!user) {
        user = await prisma.user.create({
          data: { email: "test@atomaclip.ai", name: "Test User" }
        });
      }

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
              ${source_url}, ${page_title}, ${tags}, ${user.id}, NOW(), NOW(),
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
            userId: user.id
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
