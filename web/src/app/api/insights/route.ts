import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // For MVP, fetch all insights for the test user
    const insights = await prisma.insight.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error("Fetch API Error:", error);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
