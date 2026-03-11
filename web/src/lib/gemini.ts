import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function getGeminiEmbedding(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Gemini Embedding Error:", error);
    return null;
  }
}

export async function generateDeepInsight(query: string, insights: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const context = insights.map((i, idx) => `[Insight ${idx + 1}]: ${i.content}\nSource: ${i.pageTitle || i.sourceUrl}`).join("\n\n");
    
    const prompt = `
      You are AtomaClip AI, a researcher's best friend. 
      The user asked: "${query}"
      
      I found the following related "Atomic Clips" from their personal library:
      
      ${context}
      
      Based ONLY on these clips, provide a concise, high-signal answer to the user's question. 
      If the clips don't contain enough information to answer, say so honestly.
      Connect the dots between different clips if possible.
      Keep it under 150 words. Use Markdown for formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
}
