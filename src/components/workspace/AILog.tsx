import React from "react";
import { useAppContext } from "../../context/AppContext";

export const AILog: React.FC = () => {
  const { messages } = useAppContext();

  return (
    <div className="flex-1 overflow-y-auto border rounded bg-white p-3 space-y-2">
      {messages.length === 0 && (
        <div className="text-[11px] text-slate-500">
          AI responses will appear here after you send a prompt.
        </div>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`rounded px-3 py-2 text-[11px] leading-relaxed whitespace-pre-wrap ${
            msg.role === "user"
              ? "bg-slate-900 text-slate-50 ml-auto max-w-[85%]"
              : msg.role === "assistant"
              ? "bg-slate-50 border text-slate-900 mr-auto max-w-[85%]"
              : "bg-slate-100 text-slate-700 max-w-[85%] mx-auto"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};
