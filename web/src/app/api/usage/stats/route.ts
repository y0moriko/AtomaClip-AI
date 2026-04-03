export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function getUser(cookieStore: any, authHeader?: string) {
  const options: any = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }

  if (cookieStore) {
    options.cookies = {
      getAll() {
        return cookieStore.getAll().map(({ name, value }: any) => ({ name, value }))
      },
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  )

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (user) return user
  }

  if (cookieStore) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user
  }

  return null
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    let cookieStore = null;
    try {
      cookieStore = cookies()
    } catch (e) {}

    const authHeader = cookies().get('sb-access-token') ? undefined : undefined;
    const user = await getUser(cookieStore)
    
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

    const daysUntilReset = new Date(endOfMonth).getDate() - new Date().getDate();
    const limits = {
      free: 20,
      pro: Infinity
    };

    const currentLimit = limits[dbUser.subscriptionTier as keyof typeof limits] || 20;

    return NextResponse.json({
      subscriptionTier: dbUser.subscriptionTier,
      atomsUsed: monthlyCount,
      limit: currentLimit,
      isUnlimited: currentLimit === Infinity,
      daysUntilReset,
      startOfMonth: startOfMonth.toISOString(),
      endOfMonth: endOfMonth.toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Usage stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders });
  }
}
