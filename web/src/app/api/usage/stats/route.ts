export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helpers";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { 
        subscriptionTier: true,
        createdAt: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const monthlyCount = await prisma.insight.count({
      where: {
        userId: user.id,
        createdAt: { 
          gte: startOfMonth,
          lt: endOfMonth
        }
      }
    });

    const totalCount = await prisma.insight.count({
      where: { userId: user.id }
    });

    const allInsights = await prisma.insight.findMany({
      where: { userId: user.id },
      select: { tags: true }
    });

    const tagCounts: Record<string, number> = {};
    allInsights.forEach(insight => {
      insight.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, count]) => ({ name, count }));

    const totalTagUsage = Object.values(tagCounts).reduce((sum, count) => sum + count, 0);
    const tagDistribution = topTags.map(tag => ({
      name: tag.name,
      percentage: totalTagUsage > 0 ? Math.round((tag.count / totalTagUsage) * 100) : 0
    }));

    const daysUntilReset = new Date(endOfMonth).getDate() - new Date().getDate();
    const limits = {
      free: 20,
      pro: Infinity
    };

    const currentLimit = limits[dbUser.subscriptionTier as keyof typeof limits] || 20;

    return NextResponse.json({
      subscriptionTier: dbUser.subscriptionTier,
      atomsUsed: monthlyCount,
      totalCount,
      limit: currentLimit,
      isUnlimited: currentLimit === Infinity,
      daysUntilReset,
      topTags,
      tagDistribution,
      startOfMonth: startOfMonth.toISOString(),
      endOfMonth: endOfMonth.toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Usage stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
  }
}
