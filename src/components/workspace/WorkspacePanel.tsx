import React from "react";
import { StructuredFields } from "./StructuredFields";
import { Composer } from "./Composer";
import { LivePreviewPanel } from "../output/LivePreviewPanel";

export const WorkspacePanel: React.FC = () => {
  return (
    <div className="flex h-full bg-slate-100">
      {/* Left Column: Structured Fields Input (Fixed Width) */}
      <div className="flex flex-col h-full overflow-hidden w-2/5 min-w-[400px] max-w-[600px] border-r border-gray-200 bg-white">
        <header className="mb-0 px-6 py-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Structured Content</h1>
          <p className="text-sm text-gray-600">
            Define the content tokens that drive your editorial layouts.
          </p>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <StructuredFields />
        </div>
        <div className="shrink-0 border-t border-gray-200 bg-gray-50">
          <Composer />
        </div>
      </div>
      {/* Right Column: Live Output Preview (Flex to Fill) */}
      <div className="flex-1 h-full overflow-hidden">
        <LivePreviewPanel />
      </div>
    </div>
  );
};
