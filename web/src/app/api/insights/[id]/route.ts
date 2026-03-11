export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function getAuthenticatedUser() {
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
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  return dbUser;
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dbUser = await getAuthenticatedUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });

    const id = params.id;

    const insight = await prisma.insight.findFirst({
      where: { id, userId: dbUser.id }
    })

    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404, headers: corsHeaders });
    }

    await prisma.insight.delete({
      where: { id }
    })

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Delete API Error:", error);
    return NextResponse.json({ error: "Failed to delete insight" }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dbUser = await getAuthenticatedUser();
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });

    const id = params.id;
    const { userNote, isFavorite } = await req.json();

    const insight = await prisma.insight.findFirst({
      where: { id, userId: dbUser.id }
    })

    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404, headers: corsHeaders });
    }

    const updated = await prisma.insight.update({
      where: { id },
      data: {
        userNote: userNote !== undefined ? userNote : undefined,
        isFavorite: isFavorite !== undefined ? isFavorite : undefined,
      }
    })

    return NextResponse.json(updated, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Update API Error:", error);
    return NextResponse.json({ error: "Failed to update insight" }, { status: 500, headers: corsHeaders });
  }
}
