import React from "react";
import { useAppContext } from "../../context/AppContext";
import { determineTemplate } from "../LayoutEngine/layoutRules";
import { VisualTemplate } from "../Templates/VisualTemplate";
import { EditorialTemplate } from "../Templates/EditorialTemplate";
import { LongformTemplate } from "../Templates/LongformTemplate";

export const PreviewPanel: React.FC = () => {
  const { structured, settings } = useAppContext();
  
  const templateType = determineTemplate(structured.body, settings.layoutType);

  const renderTemplate = () => {
    switch (templateType) {
      case 'visual':
        return <VisualTemplate />;
      case 'editorial':
        return <EditorialTemplate />;
      case 'longform':
        return <LongformTemplate />;
      default:
        return <EditorialTemplate />;
    }
  };

  return (
    <section className="flex flex-col h-screen bg-slate-100">
      <header className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            Preview
          </h2>
          <p className="text-[11px] text-slate-500">
            {templateType.charAt(0).toUpperCase() + templateType.slice(1)} Template
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-sm min-h-[800px]">
           {renderTemplate()}
        </div>
      </div>
    </section>
  );
};
