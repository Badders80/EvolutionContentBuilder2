import React from "react";
import { StructuredFields } from "./StructuredFields";
import { Composer } from "./Composer";

export const WorkspacePanel: React.FC = () => {
  return (
    <div className="flex h-full flex-col bg-es-surfaceAlt">
      <div className="flex-1 overflow-y-auto">
        <StructuredFields />
      </div>
      <div className="shrink-0 border-t border-es-border bg-es-surface">
        <Composer />
      </div>
    </div>
  );
};
