export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getOpenRouterEmbedding } from "@/lib/openrouter";
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
  try {
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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    
    if (!dbUser) {
      return NextResponse.json([], { headers: corsHeaders });
    }

    const body = await req.json();
    const { query, project_id } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400, headers: corsHeaders });
    }

    // Get personal workspace context
    const personalWorkspace = await getOrCreatePersonalWorkspace(dbUser.id, dbUser.name || "User");

    let insights: any[] = [];
    let usedKeywordFallback = false;

    try {
      // Upgraded to OpenRouter Embeddings
      const embedding = await getOpenRouterEmbedding(query);

      if (embedding) {
        // Now passing workspaceId and optional projectId to the SQL function
        insights = await prisma.$queryRaw`
          SELECT * FROM match_insights(
            ${embedding}::vector,
            0.4,
            15,
            ${personalWorkspace.id},
            ${project_id || null}
          )
        `;
      } else {
        usedKeywordFallback = true;
      }
    } catch (err) {
      console.warn("Vector search failed, using keyword fallback", err);
      usedKeywordFallback = true;
    }

    // Keyword Fallback (either if vector search failed or if it returned no results)
    if (usedKeywordFallback || insights.length === 0) {
      insights = await prisma.insight.findMany({
        where: {
          userId: dbUser.id,
          OR: [
            { content: { contains: query, mode: 'insensitive' } },
            { pageTitle: { contains: query, mode: 'insensitive' } },
            { userNote: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
    }

    return NextResponse.json(insights, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
