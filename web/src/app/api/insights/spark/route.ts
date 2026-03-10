export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get a random insight to start the spark
    const count = await prisma.insight.count();
    if (count === 0) return NextResponse.json([]);
    
    const skip = Math.floor(Math.random() * count);
    const randomInsight = await prisma.insight.findFirst({
      skip: skip,
    }) as (any | null);

    if (!randomInsight || !randomInsight.embedding) {
      // Fallback if no embedding: just get latest 3
      const latest = await prisma.insight.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
      return NextResponse.json(latest);
    }

    // 2. Use the random insight's embedding to find 2 more related ones
    // We use the same match_insights RPC we created earlier
    const related = await prisma.$queryRaw`
      SELECT * FROM match_insights(
        ${randomInsight.embedding}::vector,
        0.3, 
        3
      )
      WHERE id != ${randomInsight.id}::uuid
    `;

    return NextResponse.json([randomInsight, ...(related as any[])]);
  } catch (error: any) {
    console.error("Spark API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
