import React from "react";
import { useAppContext } from "../../context/AppContext";
import { type SavedBuild } from "../../types";

export const SavedBuildsPanel: React.FC = () => {
  const { savedBuilds, loadBuild, duplicateBuild } = useAppContext();

  const sorted = [...savedBuilds].sort((a, b) => b.updatedAt - a.updatedAt);

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const renderRow = (b: SavedBuild) => (
    <tr key={b.id} className="border-b last:border-b-0">
      <td className="px-2 py-1 text-xs">
        <div className="font-medium text-slate-900 truncate">{b.name}</div>
        <div className="text-[10px] text-slate-500">Updated {formatDate(b.updatedAt)}</div>
      </td>
      <td className="px-2 py-1 text-[10px] text-slate-500">{b.section}</td>
      <td className="px-2 py-1 text-right text-[11px]">
        <button
          type="button"
          onClick={() => loadBuild(b.id)}
          className="px-2 py-1 border rounded mr-1 hover:bg-slate-100"
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => duplicateBuild(b.id)}
          className="px-2 py-1 border rounded hover:bg-slate-100"
        >
          Copy
        </button>
      </td>
    </tr>
  );

  return (
    <section className="flex flex-col h-full bg-slate-50">
      <header className="px-4 py-3 border-b bg-white">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
          Saved Builds
        </h2>
        <p className="text-[11px] text-slate-500">
          Click <span className="font-semibold">Open</span> to load a build into the
          workspace. <span className="font-semibold">Copy</span> duplicates the layout so
          you can re-use the template with new raw content.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <div className="text-[11px] text-slate-500 border border-dashed rounded p-3 bg-slate-100">
            No builds saved yet. Create a build, then click{" "}
            <span className="font-semibold">Save Build</span> in the Structured panel.
          </div>
        ) : (
          <table className="w-full border text-xs bg-white rounded overflow-hidden">
            <tbody>{sorted.map(renderRow)}</tbody>
          </table>
        )}
      </div>
    </section>
  );
};
