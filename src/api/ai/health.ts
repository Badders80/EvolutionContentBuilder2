import { MODEL_FALLBACK } from "../../ai/modelFallback";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function normalizeModelName(name: string): string {
  if (!name) return "";
  return name.startsWith("models/") ? name.slice("models/".length) : name;
}

export async function getModelHealth(apiKey: string) {
  if (!apiKey) {
    return {
      ok: false,
      apiKeyValid: false,
      error: "Missing VITE_GEMINI_KEY / VITE_GEMINI_API_KEY",
      availableModels: [],
      defaultModel: null,
      fallbackChain: MODEL_FALLBACK,
      supported: [],
    };
  }

  try {
    const resp = await fetch(`${API_BASE}?key=${apiKey}`);
    if (!resp.ok) {
      return {
        ok: false,
        apiKeyValid: false,
        error: `ListModels failed with status ${resp.status}`,
        availableModels: [],
        defaultModel: null,
        fallbackChain: MODEL_FALLBACK,
        supported: [],
      };
    }

    const data = await resp.json();
    const models = Array.isArray(data.models) ? data.models : [];
    const availableModels = models
      .map((m: { name?: string }) => normalizeModelName(m?.name ?? ""))
      .filter(Boolean);
    const supported = MODEL_FALLBACK.filter((m) => availableModels.includes(m));

    return {
      ok: true,
      apiKeyValid: true,
      availableModels,
      defaultModel: supported[0] ?? null,
      fallbackChain: MODEL_FALLBACK,
      supported,
    };
  } catch (err) {
    return {
      ok: false,
      apiKeyValid: false,
      error: String(err),
      availableModels: [],
      defaultModel: null,
      fallbackChain: MODEL_FALLBACK,
      supported: [],
    };
  }
}
