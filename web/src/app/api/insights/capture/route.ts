export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helpers";
import { getOpenRouterEmbedding, getOpenRouterTags, getOpenRouterSummary, extractCitationMetadata, type CitationMetadata } from "@/lib/openrouter";
import { getOrCreatePersonalWorkspace } from "@/lib/workspaces";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  let aiStatus = "success";
  
  try {
    const user = await getServerUser(req);
    
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
      page_title,
      project_id // New optional project_id
    } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400, headers: corsHeaders });
    }

    // Use upsert to handle race conditions where multiple requests try to create the same user
    let dbUser = await prisma.user.upsert({
      where: { email: user.email! },
      update: {},
      create: {
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0],
      }
    });

    // Get or Create Personal Workspace
    const personalWorkspace = await getOrCreatePersonalWorkspace(dbUser.id, dbUser.name || "User");

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
    let finalNote = user_note || "";
    let citationMetadata: CitationMetadata = { doi: null, authors: null, publicationDate: null };

    try {
      const results = await Promise.allSettled([
        getOpenRouterTags(content),
        getOpenRouterEmbedding(content),
        getOpenRouterSummary(content),
        extractCitationMetadata(content, source_url || "")
      ]);
      
      if (results[0].status === "fulfilled") tags = results[0].value;
      if (results[1].status === "fulfilled" && results[1].value) {
        embedding = results[1].value;
      } else {
        console.warn("Embedding generation failed or returned null");
        aiStatus = "partial";
      }

      if (results[2].status === "fulfilled" && results[2].value) {
        const aiSummary = results[2].value;
        const aiPart = `AI Insight: ${aiSummary}`;
        finalNote = user_note && user_note.trim() !== "" 
          ? `${user_note}\n\n${aiPart}`
          : aiPart;
      }

      if (results[3].status === "fulfilled" && results[3].value) {
        citationMetadata = results[3].value;
      }

      if (results.some(r => r.status === "rejected")) {
        console.warn("Some AI tasks rejected");
        aiStatus = "partial";
      }
    } catch (aiErr) {
      console.error("Critical AI Pipeline error:", aiErr);
      aiStatus = "failed";
    }

    try {
      const insightId = crypto.randomUUID();
      
      if (embedding) {
        try {
          await prisma.$executeRaw`
            INSERT INTO insights (
              id, content, "contextBefore", "contextAfter", "userNote", 
              "sourceUrl", "pageTitle", tags, "userId", "workspaceId", "projectId", "createdAt", "updatedAt",
              embedding, doi, authors, "publicationDate"
            ) VALUES (
              ${insightId}, ${content}, ${context_before}, ${context_after}, ${finalNote},
              ${source_url}, ${page_title}, ${tags}, ${dbUser.id}, ${personalWorkspace.id}, ${project_id || null}, NOW(), NOW(),
              CAST(${embedding}::float8[] AS vector), ${citationMetadata.doi}, ${citationMetadata.authors}, ${citationMetadata.publicationDate}
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
            doi: citationMetadata.doi,
            authors: citationMetadata.authors,
            publicationDate: citationMetadata.publicationDate,
            userId: dbUser.id,
            workspaceId: personalWorkspace.id,
            projectId: project_id || null
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
