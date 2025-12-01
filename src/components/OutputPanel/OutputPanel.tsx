import { forwardRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VisualTemplate, EditorialTemplate, LongformTemplate } from '../Templates';
import { Sparkles } from 'lucide-react';

interface OutputPanelProps {
  onGenerate: () => void;
}

export const OutputPanel = forwardRef<HTMLDivElement, OutputPanelProps>(
  function OutputPanel({ onGenerate }, ref) {
    const { isGenerated, activeTemplate, settings } = useApp();

    // Device preview widths
    const deviceWidths = {
      desktop: 'w-full',
      tablet: 'max-w-lg mx-auto',
      mobile: 'max-w-sm mx-auto',
    };

    const renderTemplate = () => {
      switch (activeTemplate) {
        case 'editorial':
          return <EditorialTemplate />;
        case 'longform':
          return <LongformTemplate />;
        case 'visual':
        default:
          return <VisualTemplate />;
      }
    };

    return (
      <div className="flex-1 bg-slate-200 overflow-y-auto">
        <div className="p-4 h-full">
          <div
            className={`
              ${deviceWidths[settings.devicePreview]}
              h-full transition-all duration-300
            `}
          >
            {isGenerated ? (
              <div
                ref={ref}
                className="bg-white shadow-xl rounded-lg overflow-hidden min-h-full"
              >
                {renderTemplate()}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-slate-300 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                  Fill in your content in the editor and click Generate Output to preview your magazine layout.
                </p>
                <button
                  onClick={onGenerate}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <Sparkles size={18} />
                  Generate Output
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
