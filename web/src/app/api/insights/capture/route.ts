import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Super-Resilient AI Tagging
 */
async function getAiTags(content: string): Promise<string[]> {
  const prompt = `Analyze this text and return 3-5 short lowercase tags separated by commas. No intro, no markdown.
  Text: ${content}`;

  // Chain of stable model strings
  const modelChain = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-8b", 
    "gemini-pro"
  ];

  for (const modelName of modelChain) {
    try {
      // Trying with models/ prefix as per Google's more explicit requirement in some SDK versions
      const model = genAI.getGenerativeModel({ model: `models/${modelName}` });
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      
      // Aggressive cleaning
      text = text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").replace(/`/g, "").replace(/#/g, "").trim();
      
      const tags = text.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0 && t.length < 25);
      if (tags.length > 0) return tags;
    } catch (err) {
      console.warn(`Tagging failed for models/${modelName}`);
    }
  }
  return ["research"]; // Rock-solid fallback
}

/**
 * Super-Resilient Embedding
 */
async function getAiEmbedding(content: string): Promise<number[] | null> {
  const embeddingModels = ["text-embedding-004", "embedding-001"];
  
  for (const modelName of embeddingModels) {
    try {
      const model = genAI.getGenerativeModel({ model: `models/${modelName}` });
      const result = await model.embedContent({
        content: { parts: [{ text: content }] },
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      });
      if (result.embedding.values) return result.embedding.values;
    } catch (err) {
      console.error(`Embedding failed for models/${modelName}`);
    }
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

    // 1. AI Processing
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

    // 2. Database Logic
    try {
      let user = await prisma.user.findFirst({ where: { email: "test@atomaclip.ai" } });
      if (!user) {
        user = await prisma.user.create({
          data: { email: "test@atomaclip.ai", name: "Test User" }
        });
      }

      const insightId = crypto.randomUUID();
      
      if (embedding) {
        // Use explicit float8 cast for Postgres vector
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
      } else {
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
