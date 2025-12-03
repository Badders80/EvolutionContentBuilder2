import type { StructuredFields, AppSettings } from "../types";
import type { LayoutConfig } from "../context/AppContext";

export function runLayoutTweaks(
  current: LayoutConfig,
  request: string
): Promise<Partial<LayoutConfig>> {
  // TODO: Replace stub with Gemini call that returns a valid LayoutConfig JSON.
  // For now, this is a no-op that just echoes the current config.
  if (!request.trim()) return Promise.resolve(current);
  return Promise.resolve(current);
}

export function runOptimise(
  content: StructuredFields,
  config: LayoutConfig,
  settings: AppSettings
): Promise<{
  contentSuggestions: Partial<StructuredFields>;
  layoutSuggestions: Partial<LayoutConfig>;
}> {
  // TODO: Replace stub with editorial/layout QA model call.
  // Should enforce brand voice, banned-language rules and reasonable lengths.
  void content;
  void config;
  void settings;

  return Promise.resolve({
    contentSuggestions: {},
    layoutSuggestions: {},
  });
}
