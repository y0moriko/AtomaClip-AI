export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getOrCreatePersonalWorkspace } from "@/lib/workspaces";

export async function GET() {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!dbUser) return NextResponse.json([]);

    // Get personal workspace context
    const personalWorkspace = await getOrCreatePersonalWorkspace(dbUser.id, dbUser.name || "User");

    // 1. Get a random insight from the user's library
    const count = await prisma.insight.count({
      where: { userId: dbUser.id }
    });
    
    if (count === 0) return NextResponse.json([]);
    
    const skip = Math.floor(Math.random() * count);
    const randomInsight = await prisma.insight.findFirst({
      where: { userId: dbUser.id },
      skip: skip,
    }) as (any | null);

    if (!randomInsight || !randomInsight.embedding) {
      // Fallback if no embedding: just get latest 3 for this user
      const latest = await prisma.insight.findMany({ 
        where: { userId: dbUser.id },
        take: 3, 
        orderBy: { createdAt: 'desc' } 
      });
      return NextResponse.json(latest);
    }

    // 2. Use the random insight's embedding to find 2 more related ones in the same workspace
    // We use the updated match_insights SQL function
    const related = await prisma.$queryRaw`
      SELECT * FROM match_insights(
        ${randomInsight.embedding}::vector,
        0.3, 
        3,
        ${personalWorkspace.id}
      )
      WHERE id != ${randomInsight.id}::uuid
    `;

    return NextResponse.json([randomInsight, ...(related as any[])]);
  } catch (error: any) {
    console.error("Spark API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
