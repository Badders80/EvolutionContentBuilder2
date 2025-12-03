import React from "react";
import EditorialOutput from "../Templates/EditorialOutput";
import { useAppContext } from "../../context/AppContext";

export const LivePreviewPanel: React.FC = () => {
    const { structured, lastUpdateTimestamp } = useAppContext();

    // Helper to format the time
    const formatTimestamp = (timestamp: number | null) => {
        if (!timestamp) return "Awaiting first content update.";
        const date = new Date(timestamp);
        return date.toLocaleTimeString(undefined, { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-slate-200">
            {/* Status Feedback Bar */}
            <header className="mb-4 flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-300">
                <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-slate-600">
                    Live Output Preview
                </h2>
                <div className="text-[11px] text-slate-500">
                    Last Update: 
                    <span className="font-mono text-slate-800 ml-1">
                        {formatTimestamp(lastUpdateTimestamp)}
                    </span>
                </div>
            </header>
            {/* The single source of truth for the output */}
                <EditorialOutput data={structured} />
        </div>
    );
}
