import React from "react";
import type { SectionId } from "../../types";
import { useAppContext } from "../../context/AppContext";
import { HealthBadge } from "../ai/HealthBadge";

interface NavItem {
  id: SectionId;
  label: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "create", label: "Create New" },
  { id: "saved", label: "Saved Builds" },
  { id: "history", label: "History" },
  { id: "templates", label: "Templates" },
  { id: "settings", label: "Settings" },
];

export const Sidebar: React.FC = () => {
  const { section, setSection } = useAppContext();

  return (
    <aside className="h-screen border-r bg-slate-950 text-slate-100 flex flex-col w-60">
      <div className="px-4 py-4 border-b">
        <div className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400">
          Evolution
        </div>
        <div className="text-sm font-medium text-slate-100">Content Builder 2</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-900 ${
              section === item.id ? "bg-slate-900 font-semibold" : "text-slate-300"
            }`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-4 py-3 text-[11px] text-slate-500 border-t flex items-center justify-between">
        <span>v2 · From paddocks to protocols</span>
        <HealthBadge />
      </div>
    </aside>
  );
};
