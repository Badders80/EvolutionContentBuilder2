import React from "react";
import { useAppContext } from "../../context/AppContext";
import type { StructuredFields as StructuredFieldsType } from "../../types";

export const StructuredFields: React.FC = () => {
  const { structured, updateStructuredField, saveCurrentBuild } = useAppContext();

  const handleChange =
    (field: keyof StructuredFieldsType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateStructuredField(field, e.target.value);
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
        <button
          type="button"
          onClick={() => saveCurrentBuild()}
          className="text-[11px] px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Save Build
        </button>
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
        <label className="block text-[11px] font-semibold">Featured Image URL</label>
        <input
          className="w-full border rounded px-2 py-1 text-xs"
          value={structured.featuredImageUrl}
          onChange={handleChange("featuredImageUrl")}
        />
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
