import {
  Sparkles,
  FileDown,
  FileCode,
  FileText,
  Monitor,
  Tablet,
  Smartphone,
  Quote,
  Image,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ContentMode, LayoutType, DevicePreview } from '../../types';

interface SidebarProps {
  onGenerate: () => void;
  onExportPDF: () => void;
  onExportHTMLFull: () => void;
  onExportHTMLSlim: () => void;
}

const modes: { value: ContentMode; label: string }[] = [
  { value: 'pre-race', label: 'Pre-Race' },
  { value: 'post-race', label: 'Post-Race' },
  { value: 'trainer', label: 'Trainer' },
  { value: 'investor', label: 'Investor' },
  { value: 'social', label: 'Social' },
];

const layouts: { value: LayoutType; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'visual', label: 'Visual' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'longform', label: 'Longform' },
];

const devices: { value: DevicePreview; icon: typeof Monitor; label: string }[] = [
  { value: 'desktop', icon: Monitor, label: 'Desktop' },
  { value: 'tablet', icon: Tablet, label: 'Tablet' },
  { value: 'mobile', icon: Smartphone, label: 'Mobile' },
];

export function Sidebar({ onGenerate, onExportPDF, onExportHTMLFull, onExportHTMLSlim }: SidebarProps) {
  const { settings, updateSettings, sidebarOpen, setSidebarOpen, isGenerated } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-60 bg-slate-900 text-white
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:w-60
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-amber-400">Evolution</h1>
            <p className="text-xs text-slate-400">Content Builder</p>
          </div>
          <button
            className="lg:hidden p-1 hover:bg-slate-800 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
              Content Mode
            </label>
            <select
              value={settings.mode}
              onChange={(e) => updateSettings({ mode: e.target.value as ContentMode })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {modes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">
              Options
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.includeQuote}
                  onChange={(e) => updateSettings({ includeQuote: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
              <Quote size={16} className="text-slate-400 group-hover:text-white" />
              <span className="text-sm">Include Quote</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.includeImage}
                  onChange={(e) => updateSettings({ includeImage: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
              <Image size={16} className="text-slate-400 group-hover:text-white" />
              <span className="text-sm">Include Image</span>
            </label>
          </div>

          {/* Layout Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
              Layout Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {layouts.map((layout) => (
                <button
                  key={layout.value}
                  onClick={() => updateSettings({ layoutType: layout.value })}
                  className={`
                    px-3 py-2 text-xs font-medium rounded-lg transition-all
                    ${settings.layoutType === layout.value
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }
                  `}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>

          {/* Device Preview */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
              Device Preview
            </label>
            <div className="flex gap-2">
              {devices.map((device) => (
                <button
                  key={device.value}
                  onClick={() => updateSettings({ devicePreview: device.value })}
                  title={device.label}
                  className={`
                    flex-1 p-2 rounded-lg transition-all flex items-center justify-center
                    ${settings.devicePreview === device.value
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <device.icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={onGenerate}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            <Sparkles size={18} />
            Generate Output
          </button>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={onExportPDF}
              disabled={!isGenerated}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm transition-colors"
            >
              <FileDown size={16} />
              Export PDF
            </button>
            
            <button
              onClick={onExportHTMLFull}
              disabled={!isGenerated}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm transition-colors"
            >
              <FileCode size={16} />
              Export HTML (Full)
            </button>
            
            <button
              onClick={onExportHTMLSlim}
              disabled={!isGenerated}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm transition-colors"
            >
              <FileText size={16} />
              Export HTML (Slim)
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
