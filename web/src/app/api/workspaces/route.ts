export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrCreatePersonalWorkspace } from "@/lib/workspaces";
import { getServerUser } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  try {
    const user = await getServerUser(req);
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
