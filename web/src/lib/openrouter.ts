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
      Analyze this text and return exactly 3-5 highly descriptive, one-word tags as a JSON array of strings.
      Avoid generic tags like "research" or "article" unless they are the primary topic.
      Be specific to the subject matter (e.g., "neuroscience", "saas", "cooking", "productivity").
      
      Text: "${content.slice(0, 1000)}"
    `;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const contentStr = response.choices[0].message.content || '{"tags": ["insight"]}';
    const data = JSON.parse(contentStr);
    return Array.isArray(data.tags) ? data.tags.map((t: string) => t.toLowerCase()) : ["insight"];
  } catch (error) {
    console.error("OpenRouter Tagging Error:", error);
    return ["insight"];
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
      model: "google/gemini-2.0-flash-001",
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
export async function generateDeepInsight(query: string, insights: any[], conversationHistory?: {role: 'user' | 'assistant'; content: string}[]) {
  try {
    const openai = getOpenAI();
    const context = insights
      .map((i, idx) => `[Insight ${idx + 1}]: ${i.content}\nSource: ${i.pageTitle || i.sourceUrl}`)
      .join("\n\n");

    const systemPrompt = `You are AtomaClip AI, a researcher's intelligent assistant. 

Your role is to synthesize and analyze atomic clips from the user's personal research library.

RESPONSE STYLE:
- Use bullet points (• or -) for key findings and takeaways
- Use numbered lists (1., 2., 3.) for sequential steps or ranked items
- Bold key terms and important concepts
- Include specific quotes or data points when available from the clips
- If information is missing from the clips, clearly state what you couldn't find
- Provide connections between different clips when relevant
- Keep explanations thorough but focused on actionable insights

STRUCTURE your responses as:
• **Key Finding/Overview**: Brief summary
• **Detailed Points**: 3-5 bullet points with specifics
• **Connections**: How insights relate to each other
• **Gaps**: What wasn't covered (if applicable)`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `Here are my research clips:\n\n${context}` },
      ...(conversationHistory || []),
      { role: "user" as const, content: query }
    ];

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
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
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content?.trim();
    return result === "null" || !result ? null : result;
  } catch (error) {
    console.error("OpenRouter Project Suggestion Error:", error);
    return null;
  }
}

export interface CitationMetadata {
  doi: string | null;
  authors: string | null;
  publicationDate: string | null;
}

/**
 * Extracts citation metadata (DOI, authors, publication date) from content and source URL.
 */
export async function extractCitationMetadata(content: string, sourceUrl: string): Promise<CitationMetadata> {
  try {
    const openai = getOpenAI();
    
    // First, try to extract DOI from URL directly
    const urlDois = [
      /(?:doi\.org\/|doi:)?(10\.\d{4,}\/[^\s]+)/i,
      /arxiv\.org\/abs\/([\w\.\-]+)/i,
      /jstor\.org\/stable\/(\d+)/i,
      /researchgate\.net\/publication\/(\d+)/i,
    ];
    
    let foundDoi: string | null = null;
    for (const regex of urlDois) {
      const match = sourceUrl.match(regex);
      if (match) {
        foundDoi = match[1];
        break;
      }
    }
    
    const prompt = `
      You are a citation metadata extractor. Analyze the content and URL below and extract citation information.
      
      Content (first 500 chars): "${content.slice(0, 500)}"
      Source URL: "${sourceUrl}"
      ${foundDoi ? `DOI found in URL: ${foundDoi}` : ''}
      
      Extract the following and return as JSON:
      {
        "doi": "The DOI if found in the content or URL, otherwise null",
        "authors": "Author names (e.g., 'John Smith, Jane Doe' or 'Smith et al.'), null if not found",
        "publicationDate": "Publication date in ISO format (YYYY-MM-DD) or simple year (YYYY), null if not found"
      }
      
      Be conservative - only extract what is explicitly stated or can be reliably inferred.`;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const contentStr = response.choices[0].message.content || '{}';
    const data = JSON.parse(contentStr);
    
    return {
      doi: foundDoi || data.doi || null,
      authors: data.authors || null,
      publicationDate: data.publicationDate || null,
    };
  } catch (error) {
    console.error("OpenRouter Citation Extraction Error:", error);
    return { doi: null, authors: null, publicationDate: null };
  }
}
