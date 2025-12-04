import React, { useRef, useState } from "react";
import { Paperclip, Send, Bot } from "lucide-react";
import { useAssistant } from "../../hooks/useAssistant";
import { useAppContext } from "../../context/AppContext";

export const Composer: React.FC = () => {
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const { runCommand, loading } = useAssistant();
  const { currentModel, setCurrentModel, targetField } = useAppContext(); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // New: Render function for the target indicator
  const renderTargetIndicator = () => {
      if (targetField === 'auto') return null;
      return (
        <span className="absolute top-2 right-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
          Target: {targetField}
        </span>
      );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const success = await runCommand(input.trim());
    if (!success) {
      showToast("Error: Content could not be structured. Please ask Gemini to regenerate.");
      return;
    }
    setInput("");
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-es-border bg-white p-4">
      <div className="relative flex flex-col gap-2 rounded-xl border border-es-border shadow-sm focus-within:ring-2 focus-within:ring-slate-200 transition-all bg-white overflow-hidden">
        {/* Target Indicator */}
        {renderTargetIndicator()}
        {/* Text Area */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini to write content, analyze data, or generate a layout..."
          className="w-full resize-none p-4 text-sm focus:outline-none min-h-[80px] max-h-[200px]"
          rows={3}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 border-t border-es-border">
          {/* Left: Tools */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAttachment}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              title="Add context (image/text)"
            >
              <Paperclip size={18} />
              <input type="file" ref={fileInputRef} className="hidden" />
            </button>
            {/* Model Selector */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white border border-es-border rounded-md text-xs text-slate-600">
              <Bot size={14} className="text-emerald-600" />
              <select 
                value={currentModel} 
                onChange={(e) => setCurrentModel(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="gemini-3.0-pro">Gemini 3.0 Pro</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              </select>
            </div>
          </div>
          {/* Right: Send */}
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !input.trim()}
            className={`p-2 rounded-lg transition-all ${
              input.trim() 
                ? "bg-slate-900 text-white shadow-md hover:bg-slate-800" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-slate-400">
          Evolution Content Engine may display inaccurate info, including about people, so double-check its responses.
        </p>
      </div>
      {toast && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {toast}
        </div>
      )}
    </div>
  );
};
