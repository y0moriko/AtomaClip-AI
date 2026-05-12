export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  try {
    const user = await getServerUser(req);
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
