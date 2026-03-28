import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is missing! Gemini features will fail.");
}

// Initialize the SDK
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function getGeminiEmbedding(text: string) {
  try {
    if (!apiKey) throw new Error("API Key missing");
    
    // Explicitly using v1beta as confirmed by curl tests for text-embedding-004
    const model = genAI.getGenerativeModel(
      { model: "text-embedding-004" },
      { apiVersion: "v1beta" }
    );
    
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Gemini Embedding Error:", error);
    return null;
  }
}

export async function generateDeepInsight(query: string, insights: any[]) {
  try {
    if (!apiKey) throw new Error("API Key missing");
    
    // Using v1beta here as well for consistency across the SDK initialization
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1beta" }
    );
    
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
