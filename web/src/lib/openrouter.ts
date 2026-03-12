import OpenAI from "openai";

const getOpenAI = () => {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "dummy-key-for-build",
  });
};

/**
 * Generates a 768-dimension embedding using OpenAI's text-embedding-3-small via OpenRouter.
 */
export async function getOpenRouterEmbedding(text: string): Promise<number[] | null> {
  try {
    const openai = getOpenAI();
    const response = await openai.embeddings.create({
      model: "openai/text-embedding-3-small",
      input: text.replace(/\n/g, " "),
      // @ts-ignore - OpenRouter passes this to OpenAI
      dimensions: 768, 
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("OpenRouter Embedding Error:", error);
    return null;
  }
}

/**
 * Generates AI tags for content using Gemini Flash via OpenRouter.
 */
export async function getOpenRouterTags(content: string): Promise<string[]> {
  try {
    const openai = getOpenAI();
    const prompt = `
      Analyze this text and return exactly 3-5 short, one-word tags as a JSON array of strings.
      Focus on the main topics.
      Text: "${content.slice(0, 1000)}"
    `;

    const response = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const contentStr = response.choices[0].message.content || '{"tags": ["research"]}';
    const data = JSON.parse(contentStr);
    return Array.isArray(data.tags) ? data.tags.map((t: string) => t.toLowerCase()) : ["research"];
  } catch (error) {
    console.error("OpenRouter Tagging Error:", error);
    return ["research"];
  }
}

/**
 * Generates a concise AI summary for content using Gemini Flash via OpenRouter.
 */
export async function getOpenRouterSummary(content: string): Promise<string | null> {
  try {
    const openai = getOpenAI();
    const prompt = `
      Summarize this text in one short sentence (max 15 words).
      Text: "${content.slice(0, 2000)}"
    `;

    const response = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Summary Error:", error);
    return null;
  }
}

/**
 * Generates a deep insight synthesis using Gemini 1.5 Flash via OpenRouter.
 */
export async function generateDeepInsight(query: string, insights: any[]) {
  try {
    const openai = getOpenAI();
    const context = insights
      .map((i, idx) => `[Insight ${idx + 1}]: ${i.content}\nSource: ${i.pageTitle || i.sourceUrl}`)
      .join("\n\n");

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

    const response = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Generation Error:", error);
    return null;
  }
}

/**
 * Suggests the best project for a given insight based on available projects.
 */
export async function suggestProject(content: string, projects: { id: string, name: string, description?: string | null }[]): Promise<string | null> {
  if (projects.length === 0) return null;

  try {
    const openai = getOpenAI();
    const projectList = projects.map(p => `- ID: ${p.id}, Name: ${p.name}${p.description ? `, Description: ${p.description}` : ""}`).join("\n");
    
    const prompt = `
      You are a research assistant. Given an "Atomic Clip" (highlighted text) and a list of research projects, identify which project is the best fit for this clip.
      
      Clip Content: "${content.slice(0, 1000)}"
      
      Available Projects:
      ${projectList}
      
      Return ONLY the ID of the best matching project. If none are a good fit, return "null".
    `;

    const response = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content?.trim();
    return result === "null" || !result ? null : result;
  } catch (error) {
    console.error("OpenRouter Project Suggestion Error:", error);
    return null;
  }
}
