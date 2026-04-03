export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function getUser(cookieStore: any) {
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

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const user = await getUser(cookieStore)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        emailDigest: true,
        emailMarketing: true
      }
    });

    return NextResponse.json(dbUser || { emailDigest: true, emailMarketing: false }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Preferences error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = cookies()
    const user = await getUser(cookieStore)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { emailDigest, emailMarketing } = body;

    const updated = await prisma.user.update({
      where: { email: user.email! },
      data: {
        emailDigest: emailDigest !== undefined ? emailDigest : undefined,
        emailMarketing: emailMarketing !== undefined ? emailMarketing : undefined,
      },
      select: {
        emailDigest: true,
        emailMarketing: true
      }
    });

    return NextResponse.json(updated, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Preferences update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
