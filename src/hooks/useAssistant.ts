import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../utils/systemPrompt";

const API_KEY =
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ??
  (import.meta.env.VITE_GEMINI_KEY as string | undefined);

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export function useAssistant() {
  // Note: updateStructuredFields in AppContext takes UpdateStructuredInput which is Partial<StructuredFields>
  // But in AppContext.tsx it was defined as updateStructuredFields(fields: UpdateStructuredInput)
  // Let's check AppContext interface again.
  const { appendMessage, updateStructuredFields } = useAppContext();
  const [loading, setLoading] = useState(false);

  const runCommand = async (rawInput: string) => {
    if (!rawInput || rawInput.trim() === "") return;
    
    setLoading(true);

    if (!genAI) {
      appendMessage({
        role: "assistant",
        content: "Missing Gemini API key (VITE_GEMINI_API_KEY or VITE_GEMINI_KEY).",
      });
      setLoading(false);
      return;
    }

    try {
      appendMessage({
        role: "user",
        content: rawInput,
      });

      const prompt = `
${SYSTEM_PROMPT}

### USER INPUT:
${rawInput}
`;

      // Fallback strategy: 3.0 Pro -> 3.0 -> 2.0 Pro -> 1.5 Pro
      const modelsToTry = ["gemini-3.0-pro", "gemini-3.0", "gemini-2.0-pro", "gemini-1.5-pro"];
      let response;
      let lastError;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting generation with model: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          response = await model.generateContent(prompt);
          if (response) break; // Success
        } catch (e) {
          console.warn(`Model ${modelName} failed:`, e);
          lastError = e;
          continue; // Try next model
        }
      }

      if (!response) {
        throw lastError || new Error("All models failed to generate content");
      }

      const textRaw = response?.response?.text?.() ?? "";
      console.log("Gemini Raw Response:", textRaw); // Debug log
      const text = textRaw.replace(/```(json)?/gi, "").replace(/```/g, "").trim();

      let parsed: {
        headline: string;
        subheadline: string;
        body: string;
        quote: string;
        attribution: string;
        footer: string;
      } | null = null;

      try {
        parsed = JSON.parse(text);
        console.log("Parsed JSON:", parsed); // Debug log
      } catch (e) {
        console.warn("JSON Parse Failed, falling back to raw text", e);
        parsed = {
          headline: "",
          subheadline: "",
          body: text,
          quote: "",
          attribution: "",
          footer: "",
        };
      }

      // We need to map the parsed fields to StructuredFields
      // StructuredFields has featuredImageUrl, parsed doesn't seem to have it in the prompt?
      // The system prompt says: "If a field is missing in the raw input, leave it as an empty string"
      // But the system prompt output format doesn't include featuredImageUrl.
      // I should probably update the system prompt too if I want image support.
      // For now, I'll just map what we have.
      
      updateStructuredFields({
        headline: parsed?.headline ?? "",
        subheadline: parsed?.subheadline ?? "",
        body: parsed?.body ?? "",
        quote: parsed?.quote ?? "",
        quoteAttribution: parsed?.attribution ?? "",
        footer: parsed?.footer ?? "",
      });

      appendMessage({
        role: "assistant",
        content: text,
      });

    } catch (error: any) {
      console.error("Assistant error:", error);

      appendMessage({
        role: "assistant",
        content: `Error: ${error?.message || "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return { runCommand, loading };
}
