import React, { useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import type { StructuredFields as StructuredFieldsType, AssistantTargetField } from "../../types";
import { ExportButton } from "../output/ExportButton";
// import { getWordCount } from "../../utils/wordCount";
import { RefreshCw } from "lucide-react";
import { p, g, s } from "../../layout/layoutConfig";

export const StructuredFields: React.FC = () => {
  const {
    structured,
    settings,
    updateStructuredField,
    updateStructuredFields,
    updateSettings,
    saveCurrentBuild,
    undo,
    setTargetField,
    targetField, 
  } = useAppContext();

  const REWRITE_FIELDS: AssistantTargetField[] = [
    "headline", 
    "subheadline", 
    "body", 
    "quote"
  ];

  const handleReduceLoad = useCallback((field: AssistantTargetField) => {
    // Check if the user is clicking the currently active target to turn it off
    if (targetField === field) {
      setTargetField("auto");
      return;
    }
    // Set the new target
    setTargetField(field);
    alert(`AI Rewrite Mode Activated for ${field.toUpperCase()}. Please type your rewrite command (e.g., 'Make it more concise' or 'Add more racing detail') into the chat below and press Send.`);
  }, [setTargetField, targetField]);

  const modeOptions = [
    { value: "pre-race", label: "Pre-Race Update" },
    { value: "post-race", label: "Post-Race Report" },
    { value: "trainer", label: "Trainer Report" },
    { value: "investor", label: "Investor Update" },
  ] as const;

  const handleChange = (field: keyof StructuredFieldsType) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateStructuredField(field, e.target.value);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    updateStructuredFields({
      featuredImageUrl: url,
      imagePreview: url
    });
  };

  const renderFieldHeader = (label: string, fieldName: keyof StructuredFieldsType) => {
    const isRewriteable = REWRITE_FIELDS.includes(fieldName as AssistantTargetField);
    const isActiveTarget = targetField === fieldName; 
    const wordCount = (structured[fieldName] as string ?? "").split(/\s+/).filter(Boolean).length;
    let goalWords = 0;
    if (fieldName === 'headline') goalWords = 8;
    if (fieldName === 'subheadline') goalWords = 30;
    if (fieldName === 'body') goalWords = 180;
    const wordCountClass = (count: number) => count > goalWords ? 'text-red-600' : 'text-slate-600';
    return (
      <div className="flex justify-between items-center mb-1">
          <label className="block text-[11px] font-semibold">{label}</label>
          <div className="flex items-center gap-2">
            {isRewriteable && (
              <button
                type="button"
                onClick={() => handleReduceLoad(fieldName as AssistantTargetField)}
                className={`text-[10px] flex items-center border px-2 py-0.5 rounded transition-colors ${
                  isActiveTarget 
                    ? "bg-slate-900 text-white border-slate-900 font-medium" 
                    : "text-slate-500 hover:text-slate-900 border-slate-200"
                }`}
                title={`Click to target this field for AI rewrite (or unselect if already targeted)`}
              >
                <RefreshCw size={10} className="mr-1" />
                {isActiveTarget ? 'Targeted' : 'Target'} 
              </button>
            )}
            <span className={`text-[10px] font-medium ${wordCountClass(wordCount)}`}>Words: {wordCount}{goalWords > 0 && ` (Goal: ${goalWords})`}</span>
          </div>
        </div>
      );
    };

    return (
      <div className={s(3)}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-600">
              Structured Content
            </h2>
            <p className="text-[11px] text-slate-500">
              Refine fields before sending to preview.
            </p>
          </div>
          <div className={`flex items-center ${g(2)}`}>
            <ExportButton />
            <button
              type="button"
              onClick={() => undo()}
              className={`text-[11px] ${p(2)} rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold`} 
              title="Undo last change to Structured Fields"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => saveCurrentBuild()}
              className={`text-[11px] ${p(2)} rounded bg-slate-900 text-white hover:bg-slate-800 font-semibold`}
            >
              Save Build
            </button>
          </div>
        </div>

        <div className={s(2)}>
          <label className="block text-[11px] font-semibold">Build Type</label>
          <div className={`flex flex-wrap ${g(2)}`}>
            {modeOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateSettings({ mode: value })}
                className={`text-[11px] ${p(2)} rounded border transition ${settings.mode === value
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                aria-pressed={settings.mode === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={s(2)}>
          {renderFieldHeader("Headline", "headline")}
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.headline}
            onChange={handleChange("headline")}
          />
        </div>

        <div className={s(2)}>
          {renderFieldHeader("Subheadline", "subheadline")}
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.subheadline}
            onChange={handleChange("subheadline")}
          />
        </div>

        <div className={s(2)}>
          {renderFieldHeader("Body", "body")}
          <textarea
            className="w-full border rounded px-2 py-1 text-xs min-h-[140px]"
            value={structured.body}
            onChange={handleChange("body")}
          />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${g(2)}`}> 
          <div className={s(2)}>
            {renderFieldHeader("Quote", "quote")}
            <textarea
              className="w-full border rounded px-2 py-1 text-xs min-h-[80px]"
              value={structured.quote}
              onChange={handleChange("quote")}
            />
          </div>
          <div className={s(2)}>
            <label className="block text-[11px] font-semibold">Quote Attribution</label>
            <input
              className="w-full border rounded px-2 py-1 text-xs"
              value={structured.quoteAttribution}
              onChange={handleChange("quoteAttribution")}
            />
          </div>
        </div>

        <div className={s(2)}>
          <label className="block text-[11px] font-semibold">Featured Image URL</label>
          <div className={`space-y-2 ${p(2)} border rounded bg-white`}>
            <input
              placeholder="Paste a direct URL for the image (e.g., https://.../image.jpg)"
              className="w-full border rounded px-2 py-1 text-xs"
              value={structured.featuredImageUrl}
              onChange={handleImageUrlChange}
            />
            {structured.imagePreview && (
              <div className={`relative group mt-2`}>
                <img
                  src={structured.imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-contain rounded border bg-slate-100"
                />
              </div>
            )}

            <input
              placeholder="Image Caption"
              className="w-full border rounded px-2 py-1 text-xs mt-2"
              value={structured.caption}
              onChange={handleChange("caption")}
            />
          </div>
        </div>

        <div className={s(2)}>
          <label className="block text-[11px] font-semibold">External Embed HTML (Canva, YouTube)</label>
          <textarea
            className="w-full border rounded px-2 py-1 text-xs min-h-[80px]"
            value={structured.rawEmbedHtml}
            onChange={handleChange("rawEmbedHtml")}
            placeholder="Paste raw <iframe> or embed code here (like the Canva code). NOTE: This will NOT work in PDFs."
          />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${g(2)}`}> 
          <div className={s(2)}>
            <label className="block text-[11px] font-semibold">Horse Name</label>
            <input
              className="w-full border rounded px-2 py-1 text-xs"
              value={structured.horseName}
              onChange={handleChange("horseName")}
            />
          </div>
          <div className={s(2)}>
            <label className="block text-[11px] font-semibold">Race Location</label>
            <input
              className="w-full border rounded px-2 py-1 text-xs"
              value={structured.raceLocation}
              onChange={handleChange("raceLocation")}
            />
          </div>
        </div>

        <div className={s(2)}>
          <label className="block text-[11px] font-semibold">Footer</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.footer}
            onChange={handleChange("footer")}
          />
        </div>
      </div>
    );
}

