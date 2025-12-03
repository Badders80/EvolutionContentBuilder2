import React from "react";
import { StructuredFields } from "./StructuredFields";
import { Composer } from "./Composer";

export const WorkspacePanel: React.FC = () => {
  return (
    <div className="flex h-full bg-gray-100">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-6 py-6">
        <header className="mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Structured Content</h1>
          <p className="text-sm text-gray-600">
            Define the content tokens that drive your editorial layouts.
          </p>
        </header>

        <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <StructuredFields />
          </div>
          <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-3">
            <Composer />
          </div>
        </div>
      </div>
    </div>
  );
};
