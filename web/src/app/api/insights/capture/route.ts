export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getOpenRouterEmbedding, getOpenRouterTags, getOpenRouterSummary } from "@/lib/openrouter";
import { getOrCreatePersonalWorkspace } from "@/lib/workspaces";

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

    try {
      // Use allSettled to be resilient to partial AI failures (e.g. rate limits)
      const results = await Promise.allSettled([
        getOpenRouterTags(content),
        getOpenRouterEmbedding(content),
        getOpenRouterSummary(content)
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
              embedding
            ) VALUES (
              ${insightId}, ${content}, ${context_before}, ${context_after}, ${finalNote},
              ${source_url}, ${page_title}, ${tags}, ${dbUser.id}, ${personalWorkspace.id}, ${project_id || null}, NOW(), NOW(),
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
