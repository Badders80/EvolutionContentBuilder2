import React from "react";
import { StructuredFields } from "./StructuredFields";
import { Composer } from "./Composer";

export const WorkspacePanel: React.FC = () => {
  return (
    <section className="flex flex-col h-screen bg-slate-50 border-r">
      <div className="flex-1 overflow-hidden px-4 py-4 space-y-4">
        <StructuredFields />
      </div>
      <Composer />
    </section>
  );
};
