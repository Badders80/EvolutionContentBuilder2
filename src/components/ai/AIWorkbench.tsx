import React, { useState } from "react";
import type { FormEvent } from "react";
import { callAI } from "../../api/ai";
import { useAppContext } from "../../context/AppContext";
import type { AIMessage } from "../../types";

const MODEL_OPTIONS = [
  { id: "gemini-3.0-pro", label: "Gemini 3.0 Pro" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
];

export const AIWorkbench: React.FC = () => {
  const {
    currentModel,
    setCurrentModel,
    messages,
    appendMessage,
    setMessages,
    clearMessages,
    structured,
    setStructured,
  } = useAppContext();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);

    const userContent = input.trim();
    appendMessage({ role: "user", content: userContent });

    setInput("");
    setIsLoading(true);

    try {
      const allMessages: AIMessage[] = [
        ...messages,
        {
          id: "tmp",
          role: "user",
          content: userContent,
          createdAt: Date.now(),
        },
      ];

      const { reply } = await callAI(currentModel, allMessages);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: userContent,
          createdAt: Date.now(),
        },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          createdAt: Date.now(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong talking to AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToStructured = () => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    const base = lastAssistant?.content || "";

    if (!base) return;

    const lines = base.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const [headline = structured.headline, subheadline = structured.subheadline, ...rest] = lines;

    setStructured({
      ...structured,
      headline,
      subheadline,
      body: rest.join("\n\n") || structured.body,
    });
  };

  const handlePasteTranscript = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (!text.trim()) return;
        setInput(text);
      })
      .catch((err) => console.error("Clipboard read failed", err));
  };

  return (
    <section className="flex flex-col h-full border-r bg-slate-50">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            AI Workbench
          </h2>
          <p className="text-[11px] text-slate-500">
            Paste transcript or notes, then work with Gemini to shape the content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-xs border rounded px-2 py-1 bg-white"
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
          >
            {MODEL_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={clearMessages}
            className="text-[11px] px-2 py-1 border rounded hover:bg-slate-100"
          >
            Clear
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
        {messages.length === 0 && (
          <div className="text-xs text-slate-500 border border-dashed rounded p-3 bg-slate-50">
            Start by pasting a transcript or notes into the box below, then ask:
            <br />
            <span className="italic">
              “Turn this into a pre-race investor update” or “Summarise into 150 words”.
            </span>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-slate-900 text-slate-50 ml-auto max-w-[80%]"
                : msg.role === "assistant"
                ? "bg-white border text-slate-900 mr-auto max-w-[80%]"
                : "bg-slate-100 text-slate-700 max-w-[80%] mx-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {error && (
        <div className="px-4 py-2 text-xs text-red-600 border-t bg-red-50">{error}</div>
      )}

      <footer className="border-t bg-white px-4 py-2">
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            className="w-full border rounded px-2 py-1 text-xs resize-none h-20"
            placeholder="Type a message, paste a transcript, or ask Gemini to rewrite something…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteTranscript}
                className="text-[11px] px-2 py-1 border rounded hover:bg-slate-100"
              >
                Paste from clipboard
              </button>
              <button
                type="button"
                onClick={handlePushToStructured}
                className="text-[11px] px-2 py-1 border rounded bg-slate-900 text-white hover:bg-slate-800"
              >
                Push latest reply to Structured
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="text-[11px] px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? "Thinking…" : "Send"}
            </button>
          </div>
        </form>
      </footer>
    </section>
  );
};
