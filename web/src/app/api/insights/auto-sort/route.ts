export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { suggestProject } from "@/lib/openrouter";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
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
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { workspaceId } = body;

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    // Verify user belongs to workspace
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: dbUser.id,
          workspaceId
        }
      }
    });

    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Get projects in workspace
    const projects = await prisma.project.findMany({
      where: { workspaceId }
    });

    if (projects.length === 0) {
      return NextResponse.json({ error: "No projects found to sort into" }, { status: 400 });
    }

    // Get unassigned insights in workspace
    const unassignedInsights = await prisma.insight.findMany({
      where: {
        workspaceId,
        projectId: null
      },
      take: 50 // Limit per run
    });

    const results = [];

    for (const insight of unassignedInsights) {
      const suggestedProjectId = await suggestProject(insight.content, projects);
      
      if (suggestedProjectId && suggestedProjectId !== "null") {
        await prisma.insight.update({
          where: { id: insight.id },
          data: { projectId: suggestedProjectId }
        });
        results.push({ insightId: insight.id, projectId: suggestedProjectId });
      }
    }

    return NextResponse.json({ 
      success: true, 
      sortedCount: results.length,
      totalChecked: unassignedInsights.length 
    });

  } catch (error) {
    console.error("Auto-sort error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
