import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiContentResult {
  headline: string;
  subheadline: string;
  body: string;
  quote: string;
  attribution: string;
}

/**
 * Hook for interacting with Google Gemini Pro API
 * Used to transform transcripts into structured magazine content
 */
export function useGemini() {
  const apiKey = import.meta.env.VITE_GEMINI_KEY as string;

  async function generateContent(transcript: string): Promise<GeminiContentResult> {
    if (!apiKey) {
      throw new Error('VITE_GEMINI_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are an editorial assistant for a premium racing publication called Evolution Stables.
Rewrite the following transcript into structured magazine content with a sophisticated, editorial tone.

IMPORTANT: Return ONLY valid JSON with no markdown formatting, no code blocks, just pure JSON:

{
  "headline": "A compelling, attention-grabbing headline (max 10 words)",
  "subheadline": "A supporting subheadline that adds context (max 15 words)",
  "body": "The main article content, professionally written in an engaging editorial style. Include multiple paragraphs separated by double newlines. Aim for 150-300 words.",
  "quote": "Extract or craft a memorable quote from the content",
  "attribution": "The person the quote is attributed to, or 'Evolution Stables' if none specified"
}

Transcript:
${transcript}
    `.trim();

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean up response - remove any markdown code blocks if present
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      return JSON.parse(cleanedText) as GeminiContentResult;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content. Please check your API key and try again.');
    }
  }

  return { generateContent, isConfigured: !!apiKey };
}
