export const MODEL_FALLBACK = [
  "gemini-3.0-pro",
  "gemini-3.0-flash",
  "gemini-3.0-pro-exp",
  "gemini-3.0-flash-exp",
  "gemini-2.0-flash-thinking",
  "gemini-2.0-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
] as const;

export type ModelId = (typeof MODEL_FALLBACK)[number];
