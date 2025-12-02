import React from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { determineTemplate } from "../LayoutEngine/layoutRules";
import { VisualTemplate } from "../Templates/VisualTemplate";
// CHANGE: Import the Output component (The Single Source of Truth)
import { EditorialOutput } from "../Templates/EditorialOutput";
import { LongformTemplate } from "../Templates/LongformTemplate";

export const PreviewPanel: React.FC = () => {
  const { structured, settings, updateSettings } = useAppContext();
  
  const templateType = determineTemplate(structured.body, settings.layoutType);

  const renderTemplate = () => {
    switch (templateType) {
      case 'visual':
        return <VisualTemplate />;
      case 'editorial':
        // CHANGE: Render EditorialOutput. 
        // Now the preview is 100% identical to the PDF and includes click-to-edit.
        return <EditorialOutput />;
      case 'longform':
        return <LongformTemplate />;
      default:
        return <EditorialOutput />;
    }
  };

  const getContainerWidth = () => {
    switch (settings.devicePreview) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-4xl';
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
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => updateSettings({ devicePreview: 'desktop' })}
            className={`p-1.5 rounded ${settings.devicePreview === 'desktop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            title="Desktop View"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => updateSettings({ devicePreview: 'tablet' })}
            className={`p-1.5 rounded ${settings.devicePreview === 'tablet' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            title="Tablet View"
          >
            <Tablet size={14} />
          </button>
          <button
            onClick={() => updateSettings({ devicePreview: 'mobile' })}
            className={`p-1.5 rounded ${settings.devicePreview === 'mobile' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            title="Mobile View"
          >
            <Smartphone size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 flex justify-center bg-slate-100">
        <div className={`w-full ${getContainerWidth()} bg-white shadow-sm min-h-[800px] transition-all duration-300 pb-20`}>
           {renderTemplate()}
        </div>
      </div>
    </section>
  );
};
