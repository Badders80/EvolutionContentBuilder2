import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../utils/systemPrompt";
import { EVOLUTION_BRAND_VOICE } from "../prompts/brandVoice";
import { validateAIPayload } from "../utils/validateAIPayload";
import type { StructuredFields } from "../types";

const API_KEY =
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ??
  (import.meta.env.VITE_GEMINI_KEY as string | undefined);

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export function useAssistant() {
  const { appendMessage, updateStructuredFields, currentModel } = useAppContext();
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

${EVOLUTION_BRAND_VOICE}

### USER INPUT:
${rawInput}
`;

      console.log(`Generating with selected model: ${currentModel}`);
      const model = genAI.getGenerativeModel({ model: currentModel });
      const response = await model.generateContent(prompt);

      const textRaw = response?.response?.text?.() ?? "";
      console.log("Gemini Raw Response:", textRaw);

      // --- CRITICAL SMART PARSER IMPLEMENTATION ---
      let jsonString = textRaw.trim();

      // 1. Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "");

      // 2. Find the first '{' and the last '}' to safely extract the object
      const firstOpen = jsonString.indexOf("{");
      const lastClose = jsonString.lastIndexOf("}");

      if (firstOpen !== -1 && lastClose !== -1) {
        jsonString = jsonString.substring(firstOpen, lastClose + 1);
      }

      let parsed: Partial<StructuredFields> | null = null;

      try {
        // Attempt to parse the stripped string
        parsed = JSON.parse(jsonString) as Partial<StructuredFields>;


        // Validate AI payload before updating context
        if (!validateAIPayload(parsed)) {
          appendMessage({
            role: "assistant",
            content: `Error: AI response contained forbidden fields (CSS/Tailwind/HTML). Please rephrase your request. Raw: ${JSON.stringify(parsed)}`,
          });
          return false;
        }

        updateStructuredFields({
          headline: parsed?.headline ?? "",
          subheadline: parsed?.subheadline ?? "",
          body: parsed?.body ?? "",
          quote: parsed?.quote ?? "",
          quoteAttribution: (parsed as any)?.attribution ?? parsed?.quoteAttribution ?? "",
          footer: parsed?.footer ?? "",
        });

        // Send raw response to log (optional, but helpful for debugging)
        appendMessage({ role: "assistant", content: textRaw });

      } catch (e) {
        console.warn("JSON Parse Failed, AI sent conversational filler.", e);

        // **Failure:** Trigger failure toast and send original raw text to log
        // Note: The logic for setting the UI toast is handled in the Composer component.
        appendMessage({
          role: "assistant",
          content: `Error: Content could not be structured. Please ask Gemini to regenerate. Raw text received: ${textRaw}`,
        });

        // Return false to signal to the Composer that the command failed its quality check
        return false;
      }
      // --- END SMART PARSER ---

    } catch (error: any) {
      console.error("Assistant error:", error);

      appendMessage({
        role: "assistant",
        content: `Error: ${error?.message || "Unknown communication error"}`,
      });
      return false; // Signal failure
    } finally {
      setLoading(false);
    }

    return true; // Signal success
  };

  return { runCommand, loading };
}
