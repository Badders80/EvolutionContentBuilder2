import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Sidebar } from "./Sidebar";
import { WorkspacePanel } from "../workspace/WorkspacePanel";
import { SavedBuildsPanel } from "../saved/SavedBuildsPanel";

export const MainLayout: React.FC = () => {
  const { section } = useAppContext();

  const renderContent = () => {
    if (section === "create") {
      return (
        <div className="flex-1 h-screen flex flex-col">
          <WorkspacePanel />
        </div>
      );
    }

    if (section === "saved") {
      return (
        <div className="flex-1 h-screen">
          <SavedBuildsPanel />
        </div>
      );
    }

    if (section === "history") {
      return (
        <div className="flex-1 h-screen flex items-center justify-center text-xs text-slate-500">
          History view will build on saved interactions in a later phase. For now, use
          Saved Builds to re-open past work.
        </div>
      );
    }

    if (section === "templates") {
      return (
        <div className="flex-1 h-screen flex items-center justify-center text-xs text-slate-500">
          Templates view will host predefined structures (pre-race, post-race, investor).
          This will be implemented in the next phase.
        </div>
      );
    }

    return (
      <div className="flex-1 h-screen flex items-center justify-center text-xs text-slate-500">
        Settings view to be expanded later. Model defaults and UI options will live here.
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900">
      <Sidebar />
      {renderContent()}
    </div>
  );
};
