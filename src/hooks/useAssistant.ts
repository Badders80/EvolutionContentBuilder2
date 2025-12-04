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
  const { 
    appendMessage, 
    updateStructuredFields, 
    currentModel, 
    targetField, 
    setTargetField,
    structured, 
  } = useAppContext();
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

      // --- NEW LOGIC: DYNAMIC PROMPT INJECTION AND CONTEXT ---
      const instructionBlock = targetField !== "auto" 
        ? `
### TARGETED REWRITE:
You are currently in rewrite mode for ONLY the '${targetField}' field. Your JSON output MUST ONLY contain the '${targetField}' field and its new value, e.g., { "${targetField}": "new content" }. DO NOT output any other fields or conversation.` 
        : "";

      const currentContent = JSON.stringify({
          headline: structured.headline,
          subheadline: structured.subheadline,
          body: structured.body,
          quote: structured.quote,
          quoteAttribution: structured.quoteAttribution,
          footer: structured.footer,
      }, null, 2);

      const prompt = `
${SYSTEM_PROMPT}

${EVOLUTION_BRAND_VOICE}

### CURRENT CONTENT STATE:
The following JSON object represents the current content you are editing. Use this as context for your response:
---
${currentContent}
---

${instructionBlock}

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
        // Reset target field immediately after successful parsing
        if (targetField !== "auto") {
            setTargetField("auto"); 
        }

        // --- ROBUST FIELD FILTERING (Only update explicitly returned fields) ---
        const fieldsToUpdate: Partial<StructuredFields> = {};

        // Only include fields that are explicitly defined in the AI's payload
        if (parsed?.headline !== undefined) fieldsToUpdate.headline = parsed.headline;
        if (parsed?.subheadline !== undefined) fieldsToUpdate.subheadline = parsed.subheadline;
        if (parsed?.body !== undefined) fieldsToUpdate.body = parsed.body;
        if (parsed?.quote !== undefined) fieldsToUpdate.quote = parsed.quote;
        // Handle attribution, preferring the more descriptive key if available
        if (parsed?.quoteAttribution !== undefined) fieldsToUpdate.quoteAttribution = parsed.quoteAttribution;
        else if ((parsed as any)?.attribution !== undefined) fieldsToUpdate.quoteAttribution = (parsed as any).attribution;
        if (parsed?.footer !== undefined) fieldsToUpdate.footer = parsed.footer;

        // If no fields were returned, we have a problem
        if (Object.keys(fieldsToUpdate).length === 0 && rawInput.toLowerCase() !== "ping") {
          throw new Error("AI did not return a valid content object.");
        }

        updateStructuredFields(fieldsToUpdate);

        // Send raw response to log (optional, but helpful for debugging)
        appendMessage({ role: "assistant", content: textRaw });

      } catch (e) {
        console.warn("JSON Parse Failed or Invalid payload returned:", e);

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
