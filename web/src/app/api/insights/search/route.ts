import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const embeddingResult = await hf.featureExtraction({
      model: "sentence-transformers/all-mpnet-base-v2",
      inputs: query
    });

    let embedding = Array.isArray(embeddingResult) ? embeddingResult.map(Number) : embeddingResult[0]?.map(Number);

    if (!embedding) {
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
    }

    try {
      const insights = await prisma.$queryRaw`
        SELECT * FROM match_insights(
          ${embedding}::vector,
          0.3,
          10
        )
      `;
      return NextResponse.json(insights);
    } catch (matchErr: any) {
      console.error("Vector search failed:", matchErr.message);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
