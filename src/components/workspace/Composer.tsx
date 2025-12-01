import React, { useState } from "react";
import { useAssistant } from "../../hooks/useAssistant";

export const Composer: React.FC = () => {
  const [input, setInput] = useState("");
  const { runCommand, loading } = useAssistant();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    await runCommand(input.trim());
    setInput("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full border-t border-slate-200 p-4 bg-white"
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste transcript or enter content request..."
        className="w-full resize-none rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        rows={3}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full rounded-md bg-slate-900 py-2 text-white text-sm disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate"}
      </button>
    </form>
  );
};
