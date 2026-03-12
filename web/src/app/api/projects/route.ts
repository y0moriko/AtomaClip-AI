export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

    const body = await req.json();
    const { name, description, workspaceId } = body;

    if (!name || !workspaceId) {
      return NextResponse.json({ error: "Name and Workspace ID are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId
      }
    });

    return NextResponse.json(project);

  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
