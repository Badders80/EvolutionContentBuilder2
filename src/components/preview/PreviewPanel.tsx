import React, { useRef, useState } from "react";
import { Monitor, Tablet, Smartphone, FileJson, FileType, Printer } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { determineTemplate } from "../../utils/layoutRules";
import { VisualTemplate } from "../Templates/VisualTemplate";
import { EditorialOutput } from "../Templates/EditorialOutput";
import { LongformTemplate } from "../Templates/LongformTemplate";
import { exportToPDF, exportToHTMLFull } from "../../utils";
import { runLayoutTweaks, runOptimise } from "../../hooks/layoutAI";

interface PreviewPanelProps {
  isExport?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ isExport }) => {
  const {
    structured,
    settings,
    updateSettings,
    layoutConfig,
    setLayoutConfig,
    setStructured,
  } = useAppContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [layoutRequest, setLayoutRequest] = useState("");
  const [isApplyingLayout, setIsApplyingLayout] = useState(false);
  const [isOptimising, setIsOptimising] = useState(false);

  const resolvedLayout = determineTemplate(structured, settings);

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

  const handleApplyLayoutChange = async () => {
    if (!layoutRequest.trim()) return;
    setIsApplyingLayout(true);
    try {
      const updated = await runLayoutTweaks(layoutConfig, layoutRequest);
      if (
        updated &&
        updated.layoutType &&
        typeof updated.twoColumn === "boolean"
      ) {
        setLayoutConfig((prev) => ({ ...prev, ...updated }));
      }
    } finally {
      setIsApplyingLayout(false);
    }
  };

  const handleOptimise = async () => {
    setIsOptimising(true);
    try {
      const result = await runOptimise(structured, layoutConfig, settings);
      const { contentSuggestions, layoutSuggestions } = result ?? {};

      if (contentSuggestions) {
        setStructured((prev) => ({ ...prev, ...contentSuggestions }));
      }
      if (layoutSuggestions) {
        setLayoutConfig((prev) => ({ ...prev, ...layoutSuggestions }));
      }
    } finally {
      setIsOptimising(false);
    }
  };

  const renderTemplate = () => {
    const templateProps = { structured, layoutConfig, settings };
    switch (resolvedLayout) {
      case 'visual':
        return <VisualTemplate {...templateProps} />;
      case 'editorial':
        return <EditorialOutput {...templateProps} />;
      case 'longform':
        return <LongformTemplate {...templateProps} />;
      default:
        return <EditorialOutput {...templateProps} />;
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
            {resolvedLayout.charAt(0).toUpperCase() + resolvedLayout.slice(1)} Template
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          <button
            type="button"
            onClick={handleOptimise}
            className="ml-2 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 border border-slate-900 rounded hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-60"
            disabled={isOptimising}
          >
            {isOptimising ? "Optimising…" : "Optimise layout & copy"}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 flex justify-center bg-slate-100">
        <div ref={contentRef} className={`w-full ${getContainerWidth()} bg-white shadow-sm min-h-[800px] transition-all duration-300 pb-20`}>
          {renderTemplate()}
          {!isExport && (
            <section className="mt-6 border-t border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
                Smart layout editor
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Describe how the layout should change. This will only adjust layout flags, not rewrite your copy.
              </p>
              <textarea
                className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-slate-400"
                rows={3}
                value={layoutRequest}
                onChange={(e) => setLayoutRequest(e.target.value)}
                placeholder="e.g. Make it a single column and move the quote to the left, under the headline."
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyLayoutChange}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                  disabled={isApplyingLayout}
                >
                  {isApplyingLayout ? "Applying…" : "Apply layout change"}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};
