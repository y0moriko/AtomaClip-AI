export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { generateDeepInsight } from "@/lib/openrouter";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
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
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });

    const { query, insights } = await req.json();

    if (!query || !insights || !Array.isArray(insights)) {
      return NextResponse.json({ error: "Query and insights are required" }, { status: 400, headers: corsHeaders });
    }

    const answer = await generateDeepInsight(query, insights);
    
    if (!answer) {
      return NextResponse.json({ error: "OpenRouter failed to generate an answer" }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ answer }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Deep Search API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
