import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../utils/systemPrompt";
import { LAYOUT_PROMPT } from "../utils/layoutPrompt";
import { EVOLUTION_BRAND_VOICE } from "../prompts/brandVoice";

const API_KEY =
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ??
  (import.meta.env.VITE_GEMINI_KEY as string | undefined);

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export function useAssistant() {
  const { appendMessage, updateStructuredFields, updateSettings, structured, currentModel } = useAppContext();
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

      let parsed: any = null;

      try {
        // Attempt to parse the stripped string
        parsed = JSON.parse(jsonString);

        // Success: Merge new data while preserving existing structured content (like image URLs)
        updateStructuredFields({
          headline: parsed?.headline ?? "",
          subheadline: parsed?.subheadline ?? "",
          body: parsed?.body ?? "",
          quote: parsed?.quote ?? "",
          quoteAttribution: parsed?.attribution ?? "",
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

  const runLayoutOrchestrator = async (currentLayout: string) => {
    setLoading(true);

    if (!genAI) {
      appendMessage({
        role: "assistant",
        content: "Missing Gemini API key for Layout Orchestration.",
      });
      setLoading(false);
      return false;
    }

    try {
      const inputContent = JSON.stringify(structured, null, 2);
      const prompt = `
${LAYOUT_PROMPT}

### CURRENT CONTENT TOKENS:
${inputContent}

### CURRENT LAYOUT SETTING:
${currentLayout}
`;

      appendMessage({
        role: "system",
        content: `Running Layout Orchestrator on ${currentModel}...`,
      });

      const model = genAI.getGenerativeModel({ model: currentModel });
      const response = await model.generateContent(prompt);
      const textRaw = response?.response?.text?.() ?? "";
      
      let jsonString = textRaw.trim().replace(/```json/g, "").replace(/```/g, "");
      const firstOpen = jsonString.indexOf("{");
      const lastClose = jsonString.lastIndexOf("}");

      if (firstOpen !== -1 && lastClose !== -1) {
        jsonString = jsonString.substring(firstOpen, lastClose + 1);
      }

      let parsed: any = null;

      try {
        parsed = JSON.parse(jsonString);

        if (parsed.layoutType) {
          updateSettings({ layoutType: parsed.layoutType });
          appendMessage({ 
            role: "system", 
            content: `Layout chosen: ${parsed.layoutType.toUpperCase()}. Rationale: ${parsed.rationale}` 
          });
        } else {
          throw new Error("Layout AI did not return a layoutType field.");
        }

      } catch (e) {
        console.warn("Layout AI Parse Failed:", e);
        appendMessage({
          role: "system",
          content: `Layout Orchestrator failed. Raw text received: ${textRaw}`,
        });
        return false;
      }
      
    } catch (error: any) {
      console.error("Layout Orchestrator error:", error);
      appendMessage({
        role: "system",
        content: `Error: ${error?.message || "Unknown layout communication error"}`,
      });
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  };

  return { runCommand, runLayoutOrchestrator, loading };
}
