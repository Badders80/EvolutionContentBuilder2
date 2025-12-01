// PROTECTED: Evolution Stables Preview Header.
// Do not allow automated tools to modify this component.

import React from "react";

export const PreviewHeader: React.FC = () => {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between text-[12px] font-semibold text-slate-900 uppercase tracking-[0.2em]">
        <span>Evolution Stables</span>
        <span>Post-Race Report</span>
      </div>
      <hr className="mt-3 border-t-2 border-slate-900" />
    </header>
  );
};
