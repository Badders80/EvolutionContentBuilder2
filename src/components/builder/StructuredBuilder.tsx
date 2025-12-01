import React from "react";
import { useAppContext } from "../../context/AppContext";
import { type StructuredFields } from "../../types";

export const StructuredBuilder: React.FC = () => {
  const { structured, updateStructuredField, saveCurrentBuild } = useAppContext();

  const handleChange =
    (field: keyof StructuredFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateStructuredField(field, e.target.value);
    };

  return (
    <section className="flex flex-col h-full border-r bg-slate-50">
      <header className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            Structured Content
          </h2>
          <p className="text-[11px] text-slate-500">
            Refine headline, body and quote before sending to preview.
          </p>
        </div>
        <button
          type="button"
          onClick={() => saveCurrentBuild()}
          className="text-[11px] px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Save Build
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold mb-1">Headline</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.headline}
            onChange={handleChange("headline")}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">Subheadline</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.subheadline}
            onChange={handleChange("subheadline")}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">Body</label>
          <textarea
            className="w-full border rounded px-2 py-1 text-xs min-h-[140px]"
            value={structured.body}
            onChange={handleChange("body")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold mb-1">Quote</label>
            <textarea
              className="w-full border rounded px-2 py-1 text-xs min-h-[80px]"
              value={structured.quote}
              onChange={handleChange("quote")}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1">Quote Attribution</label>
            <input
              className="w-full border rounded px-2 py-1 text-xs"
              value={structured.quoteAttribution}
              onChange={handleChange("quoteAttribution")}
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">Featured Image URL</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.featuredImageUrl}
            onChange={handleChange("featuredImageUrl")}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold mb-1">Footer</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            value={structured.footer}
            onChange={handleChange("footer")}
          />
        </div>
      </div>
    </section>
  );
};
