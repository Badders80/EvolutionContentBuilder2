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

      const model = genAI.getGenerativeModel({ model: "gemini-3.0-pro" });

      const prompt = `
${SYSTEM_PROMPT}

### USER INPUT:
${rawInput}
`;

      const response = await model.generateContent(prompt);
      const textRaw = response?.response?.text?.() ?? "";
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
      } catch {
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
