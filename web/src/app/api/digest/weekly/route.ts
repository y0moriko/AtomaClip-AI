export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWeeklyDigest } from "@/lib/email";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function generateSuggestedSearches(topTags: { name: string; count: number }[]): string[] {
  const suggestions = [];
  
  if (topTags.length > 0) {
    suggestions.push(`What did I save about "${topTags[0].name}"?`);
  }
  if (topTags.length > 1) {
    suggestions.push(`Compare ${topTags[0].name} and ${topTags[1].name}`);
  }
  suggestions.push("Summarize my key findings this week");
  suggestions.push("What gaps exist in my research?");
  
  return suggestions.slice(0, 3);
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const users = await prisma.user.findMany({
      where: {
        createdAt: { lt: weekAgo }
      }
    });

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const user of users) {
      try {
        const weeklyInsights = await prisma.insight.findMany({
          where: {
            userId: user.id,
            createdAt: { gte: weekAgo }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        });

        if (weeklyInsights.length === 0) {
          continue;
        }

        const totalAtoms = await prisma.insight.count({
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
          .slice(0, 6)
          .map(([name, count]) => ({ name, count }));

        const suggestedSearches = generateSuggestedSearches(topTags);

        const emailResult = await sendWeeklyDigest({
          email: user.email,
          name: user.name || user.email.split('@')[0],
          weeklyAtoms: weeklyInsights.length,
          totalAtoms,
          topTags,
          recentInsights: weeklyInsights.map(i => ({
            content: i.content,
            pageTitle: i.pageTitle || '',
            sourceUrl: i.sourceUrl,
            createdAt: i.createdAt.toISOString()
          })),
          suggestedSearches
        });

        if (emailResult.success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`${user.email}: ${emailResult.error}`);
        }
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${user.email}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      results
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Weekly digest error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST to trigger weekly digest",
    description: "Sends weekly digest emails to all active users",
    auth: "Requires Authorization: Bearer <CRON_SECRET>"
  }, { headers: corsHeaders });
}
