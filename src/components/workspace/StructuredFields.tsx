import React from "react";
import { PlusCircle } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import type { StructuredFields as StructuredFieldsType } from "../../types";

export const StructuredFields: React.FC = () => {
  const {
    structured,
    settings,
    updateStructuredField,
    updateStructuredFields,
    updateSettings,
    saveCurrentBuild,
    undo,
  } = useAppContext();

  const modeOptions = [
    { value: "pre-race", label: "Pre-Race Update" },
    { value: "post-race", label: "Post-Race Report" },
    { value: "trainer", label: "Trainer Report" },
    { value: "investor", label: "Investor Update" },
    // "social" dropped for now
  ] as const;

  const handleChange =
    (field: keyof StructuredFieldsType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateStructuredField(field, e.target.value);
    };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateStructuredFields({
          imageFile: file,
          imagePreview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-600">
            Structured Content
          </h2>
          <p className="text-[11px] text-slate-500">
            Refine fields before sending to preview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => undo()}
            className="text-[11px] px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => saveCurrentBuild()}
            className="text-[11px] px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-800"
          >
            Save Build
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">Build Type</label>
        <div className="flex flex-wrap gap-2">
          {modeOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateSettings({ mode: value })}
              className={`text-[11px] px-3 py-2 rounded border transition ${
                settings.mode === value
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

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">Headline</label>
        <input
          className="w-full border rounded px-2 py-1 text-xs"
          value={structured.headline}
          onChange={handleChange("headline")}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">Subheadline</label>
        <input
          className="w-full border rounded px-2 py-1 text-xs"
          value={structured.subheadline}
          onChange={handleChange("subheadline")}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">Body</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs min-h-[140px]"
          value={structured.body}
          onChange={handleChange("body")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold">Quote</label>
          <textarea
            className="w-full border rounded px-2 py-1 text-xs min-h-[80px]"
            value={structured.quote}
            onChange={handleChange("quote")}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold">Quote Attribution</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.quoteAttribution}
            onChange={handleChange("quoteAttribution")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">Featured Image</label>
        <div className="space-y-2 p-2 border rounded bg-white">
          {structured.imagePreview ? (
            <div className="relative group">
              <img 
                src={structured.imagePreview} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded border bg-slate-100" 
              />
              <button
                onClick={() => updateStructuredFields({ imageFile: null, imagePreview: null })}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Image"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-6 h-6 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-[10px] text-slate-500">Click to upload image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          )}
          
          <input
            placeholder="Image Caption"
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.caption}
            onChange={handleChange("caption")}
          />
          <div className="flex items-center gap-2 pt-2 border-t border-dashed">
            <button
              type="button"
              className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-slate-900"
            >
              <PlusCircle size={12} /> Add Secondary Image
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">External Embed HTML (Canva, YouTube)</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs min-h-[80px]"
          value={structured.rawEmbedHtml}
          onChange={handleChange("rawEmbedHtml")}
          placeholder="Paste raw <iframe> or embed code here (like the Canva code). NOTE: This will NOT work in PDFs."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">
          Video URL (Optional MP4/MOV)
        </label>
        <input
        className="w-full border rounded px-2 py-1 text-xs"
        value={structured.videoUrl}
        onChange={handleChange("videoUrl")}
        placeholder="Paste a direct link to an MP4 or MOV file"
      />
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold">Horse Name</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.horseName}
            onChange={handleChange("horseName")}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold">Race Location</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.raceLocation}
            onChange={handleChange("raceLocation")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold">Footer</label>
        <input
          className="w-full border rounded px-2 py-1 text-xs"
          value={structured.footer}
          onChange={handleChange("footer")}
        />
      </div>
    </div>
  );
};
