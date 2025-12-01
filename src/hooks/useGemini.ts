import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { ContentDataSchema } from "../types/schema";
import { EVOLUTION_SYSTEM_PROMPT } from "../ai/systemPrompt";
import { MODEL_FALLBACK } from "../ai/modelFallback";

const GeminiResponseSchema = ContentDataSchema.pick({
  headline: true,
  subheadline: true,
  body: true,
  quote: true,
  quoteAttribution: true,
});

export type GeminiContentResult = z.infer<typeof GeminiResponseSchema>;

interface GenerateArgs {
  transcript: string;
  targetWordCount: number;
}

interface ModifyArgs {
  current: GeminiContentResult;
  instructions: string;
  targetField?: "headline" | "subheadline" | "body" | "quote" | "quoteAttribution";
  selectionText?: string | null;
}

const API_KEY =
  (import.meta.env.VITE_GEMINI_KEY as string | undefined) ??
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
let cachedModels: string[] | null = null;

function normalizeModelName(name: string): string {
  if (!name) return "";
  return name.startsWith("models/") ? name.slice("models/".length) : name;
}

async function listAvailableModels(): Promise<string[]> {
  if (!API_KEY) return [];
  if (cachedModels) return cachedModels;

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    if (!resp.ok) {
      return [];
    }
    const data = await resp.json();
    const models = Array.isArray(data.models) ? data.models : [];
    const normalized = models
      .map((m: { name?: string }) => normalizeModelName(m?.name ?? ""))
      .filter(Boolean);
    cachedModels = normalized;
    return normalized;
  } catch (err) {
    console.warn("ListModels failed:", err);
    return [];
  }
}

function cleanOutput(raw: string): string {
  return raw.replace(/```(json)?/gi, "").replace(/```/g, "").trim();
}

async function callWithFallback(prompt: string): Promise<{ text: string; modelUsed: string }> {
  if (!genAI) {
    throw new Error("Gemini is not configured");
  }

  const available = await listAvailableModels();
  const candidates =
    available.length > 0
      ? MODEL_FALLBACK.filter((m) => available.includes(m))
      : [...MODEL_FALLBACK];

  if (!candidates.length) {
    throw new Error("No supported Gemini models found for this API key.");
  }

  let lastError: unknown;
  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      return { text: cleanOutput(raw), modelUsed: modelName };
    } catch (err) {
      lastError = err;
      const msg = String(err).toLowerCase();
      const retryable = msg.includes("404") || msg.includes("not found") || msg.includes("unsupported");
      if (retryable) {
        console.warn(`Model ${modelName} unsupported, trying next fallback.`);
        continue;
      }
      console.warn(`Model ${modelName} failed, trying next fallback.`, err);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All Gemini fallbacks failed.");
}

function parseGeminiJson(text: string): GeminiContentResult {
  const match = text.match(/\{[\s\S]*\}/);
  const jsonText = match ? match[0] : text;
  const parsed = JSON.parse(jsonText);
  return GeminiResponseSchema.parse(parsed);
}

export function useGemini() {
  // Generate from raw transcript
  async function generateFromTranscript(
    args: GenerateArgs
  ): Promise<GeminiContentResult> {
    const { transcript, targetWordCount } = args;

    const prompt = `
${EVOLUTION_SYSTEM_PROMPT}

You are generating NEW content from a raw transcript.

Target word count (soft): ~${targetWordCount} words.

TRANSCRIPT:
${transcript}
`;

    const { text } = await callWithFallback(prompt);
    return parseGeminiJson(text);
  }

  // Modify existing structured content (hybrid mode)
  async function modifyExisting(
    args: ModifyArgs
  ): Promise<GeminiContentResult> {
    const { current, instructions, targetField = "body", selectionText = null } = args;

    const prompt = `
${EVOLUTION_SYSTEM_PROMPT}

You are MODIFYING existing Evolution Stables editorial content based on user instructions.

IMPORTANT:
- Preserve the overall structure and facts unless the instruction explicitly says otherwise.
- Apply changes with a light touch: keep it Evolution, just cleaner/clearer/better aligned.
- You may adjust length but keep it within a similar range.

TARGET FIELD: ${targetField}
SELECTED TEXT (if any):
${selectionText ?? "None provided"}

CURRENT CONTENT (JSON):
${JSON.stringify(current, null, 2)}

USER INSTRUCTIONS:
${instructions}

Return ONLY the full updated JSON object.
`;

    const { text } = await callWithFallback(prompt);
    return parseGeminiJson(text);
  }

  return {
    isConfigured: !!API_KEY,
    generateFromTranscript,
    modifyExisting,
  };
}
