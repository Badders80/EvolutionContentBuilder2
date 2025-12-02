import React, { useRef } from "react";
import { Monitor, Tablet, Smartphone, FileJson, FileType, Printer } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { determineTemplate } from "../LayoutEngine/layoutRules";
import { VisualTemplate } from "../Templates/VisualTemplate";
// CHANGE: Import the Output component (The Single Source of Truth)
import { EditorialOutput } from "../Templates/EditorialOutput";
import { LongformTemplate } from "../Templates/LongformTemplate";
import { exportToPDF, exportToHTMLFull } from "../../utils";

export const PreviewPanel: React.FC = () => {
  const { structured, settings, updateSettings } = useAppContext();
  const contentRef = useRef<HTMLDivElement>(null);

  const templateType = determineTemplate(structured.body, settings.layoutType);

  // Function to save build to disk
  const handleSaveToDisk = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ structured, settings }, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `evolution-build-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

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
      <header className="px-4 py-3 border-b bg-white flex items-center justify-between gap-4">
        <div className="flex flex-col">
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

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToDisk}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-es-border rounded hover:bg-slate-50 transition-colors"
            title="Save Build File to Disk"
          >
            <FileJson size={14} />
            Save
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            onClick={() => exportToHTMLFull(contentRef.current, structured.headline || 'export')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-es-border rounded hover:bg-slate-50 transition-colors"
          >
            <FileType size={14} />
            HTML
          </button>

          <button
            onClick={() => exportToPDF(contentRef.current, structured.headline || 'export')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 border border-slate-900 rounded hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Printer size={14} />
            PDF
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 flex justify-center bg-slate-100">
        <div ref={contentRef} className={`w-full ${getContainerWidth()} bg-white shadow-sm min-h-[800px] transition-all duration-300 pb-20`}>
          {renderTemplate()}
        </div>
      </div>
    </section>
  );
};
