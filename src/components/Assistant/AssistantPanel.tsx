import clsx from "clsx";
import { useAssistantStore } from "../../store/useAssistantStore";

export function AssistantPanel() {
  const { messages } = useAssistantStore();

  return (
    <div className="w-80 border-l border-es-border bg-[#fafafa] h-full flex flex-col">
      <div className="px-4 py-3 border-b border-es-border bg-white">
        <div className="text-xs uppercase tracking-[0.16em] text-es-textSoft font-medium">
          Evolution Assistant
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-es-textSoft italic">
            No assistant interactions yet.
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx(
              "rounded p-3 border text-sm",
              m.role === "assistant"
                ? "bg-white border-es-border"
                : "bg-[#f2f2f2] border-es-border"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={clsx(
                  "text-[0.65rem] uppercase tracking-[0.16em]",
                  m.role === "assistant"
                    ? "text-neutral-700"
                    : "text-neutral-500"
                )}
              >
                {m.role}
              </span>

              {m.applied && (
                <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-black text-white uppercase tracking-[0.16em]">
                  applied
                </span>
              )}
            </div>

            <div className="whitespace-pre-line text-[0.8rem] leading-relaxed">
              {m.content}
            </div>

            {m.actionType && (
              <div className="mt-2 text-[0.6rem] text-es-textSoft uppercase tracking-[0.16em]">
                Action: {m.actionType}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
