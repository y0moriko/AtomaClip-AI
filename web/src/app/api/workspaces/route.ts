export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getOrCreatePersonalWorkspace } from "@/lib/workspaces";

export async function GET() {
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

    // Use upsert to handle race conditions where multiple requests try to create the same user
    let dbUser = await prisma.user.upsert({
      where: { email: user.email! },
      update: {}, // No updates if user already exists
      create: {
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0],
      },
      include: {
        workspaces: {
          include: {
            workspace: {
              include: {
                projects: true
              }
            }
          }
        }
      }
    });

    // Ensure the personal workspace exists
    await getOrCreatePersonalWorkspace(dbUser.id, dbUser.name || "User");
    
    // If the user was just created, they might not have the workspace in the initial upsert include
    if (dbUser.workspaces.length === 0) {
      dbUser = await prisma.user.findUnique({
        where: { id: dbUser.id },
        include: {
          workspaces: {
            include: {
              workspace: {
                include: {
                  projects: true
                }
              }
            }
          }
        }
      }) as any;
    }

    const workspaces = dbUser!.workspaces.map(w => w.workspace);
    return NextResponse.json(workspaces);

  } catch (error) {
    console.error("Fetch workspaces error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
