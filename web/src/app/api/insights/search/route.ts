import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HfInference } from "@huggingface/inference";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    
    if (!dbUser) {
      return NextResponse.json([], { headers: corsHeaders });
    }

    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400, headers: corsHeaders });
    }

    const embeddingResult = await hf.featureExtraction({
      model: "sentence-transformers/all-mpnet-base-v2",
      inputs: query
    });
    
    const arr = embeddingResult as unknown as (number | number[])[];
    let embedding: number[] | null = null;
    
    if (Array.isArray(arr)) {
      if (typeof arr[0] === 'number') embedding = arr as number[];
      else if (Array.isArray(arr[0])) embedding = arr[0] as number[];
    }

    if (!embedding) {
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500, headers: corsHeaders });
    }

    try {
      const insights = await prisma.$queryRaw`
        SELECT * FROM match_insights(
          ${embedding}::vector,
          0.3,
          10
        )
        WHERE "userId" = ${dbUser.id}
      `;
      return NextResponse.json(insights, { headers: corsHeaders });
    } catch (matchErr: any) {
      console.error("Vector search failed:", matchErr.message);
      return NextResponse.json([], { headers: corsHeaders });
    }
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
