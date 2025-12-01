import { type FormEvent } from "react";
import { useAssistantStore } from "../../store/useAssistantStore";
import { useAppStore } from "../../store/useAppStore";
import { useGemini, type GeminiContentResult } from "../../hooks/useGemini";
import type { AssistantTargetField } from "../../store/useAssistantStore";

const TARGET_FIELD_LABELS: { value: AssistantTargetField; label: string }[] = [
  { value: "auto", label: "Whole doc" },
  { value: "headline", label: "Headline" },
  { value: "subheadline", label: "Subheadline" },
  { value: "body", label: "Body" },
  { value: "quote", label: "Quote" },
];

export function AssistantBar() {
  const {
    query,
    loading,
    targetField,
    selectionText,
    setQuery,
    setTargetField,
    setSelectionText,
    addMessage,
    setLoading,
    markLastApplied,
  } = useAssistantStore();

  const content = useAppStore((s) => s.content);
  const updateContent = useAppStore((s) => s.updateContent);

  const { modifyExisting, isConfigured } = useGemini();

  if (!isConfigured) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = selectionText
      ? `On this selection:\n"${selectionText}"\n\n${query}`
      : query;

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      actionType: "content",
    });

    setLoading(true);

    const current: GeminiContentResult = {
      headline: content.headline,
      subheadline: content.subheadline,
      body: content.body,
      quote: content.quote,
      quoteAttribution: content.quoteAttribution,
    };

    try {
      const updated = await modifyExisting({
        current,
        instructions: userMessage,
        targetField: targetField === "auto" ? undefined : targetField,
        selectionText,
      });

      // HYBRID LOGIC:
      // For now, treat everything from this bar as CONTENT-ONLY changes → auto apply.
      // Later, we can classify layout/code and move those to "pendingAction".
      applyContentUpdateFromAssistant(updated, targetField, updateContent);
      markLastApplied();
    } catch (err) {
      console.error("Assistant error", err);
      // could add an error message to the chat if desired
    } finally {
      setLoading(false);
      setQuery("");
      setSelectionText(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border-t border-es-border pt-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          className="flex-1 rounded border border-es-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-800"
          placeholder={
            selectionText
              ? "Ask Evolution Assistant about the selected text…"
              : "Ask Evolution Assistant (e.g. 'tighten the body and make it 20% shorter')"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center rounded bg-black px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-neutral-900 disabled:opacity-40"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-[0.7rem] text-es-textSoft">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-[0.16em]">Target</span>
          <select
            className="rounded border border-es-border bg-white px-2 py-1 text-[0.7rem]"
            value={targetField}
            onChange={(e) =>
              setTargetField(e.target.value as AssistantTargetField)
            }
          >
            {TARGET_FIELD_LABELS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {selectionText && (
          <span className="italic">
            Editing selection: "
            {selectionText.length > 40
              ? `${selectionText.slice(0, 40)}…`
              : selectionText}
            "
          </span>
        )}
      </div>
    </form>
  );
}

// Helper: apply only what we want
function applyContentUpdateFromAssistant(
  updated: GeminiContentResult,
  targetField: AssistantTargetField,
  updateContent: (u: Partial<GeminiContentResult>) => void
) {
  if (targetField === "headline") {
    updateContent({ headline: updated.headline });
    return;
  }
  if (targetField === "subheadline") {
    updateContent({ subheadline: updated.subheadline });
    return;
  }
  if (targetField === "body") {
    updateContent({ body: updated.body });
    return;
  }
  if (targetField === "quote") {
    updateContent({
      quote: updated.quote,
      quoteAttribution: updated.quoteAttribution,
    });
    return;
  }

  // auto — whole doc
  updateContent({
    headline: updated.headline,
    subheadline: updated.subheadline,
    body: updated.body,
    quote: updated.quote,
    quoteAttribution: updated.quoteAttribution,
  });
}
