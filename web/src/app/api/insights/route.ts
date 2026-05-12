import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  try {
    const user = await getServerUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0],
        }
      })
    }

    const insights = await prisma.insight.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error("Fetch API Error:", error);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
