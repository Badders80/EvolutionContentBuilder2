import { forwardRef } from 'react';
import { EditorialOutput } from '../Templates/EditorialOutput';
import { Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface OutputPanelProps {
  onGenerate: () => void;
}

export const OutputPanel = forwardRef<HTMLDivElement, OutputPanelProps>(
  function OutputPanel({ onGenerate }, ref) {
    const { structured, settings } = useAppContext();
    const isGenerated = !!structured.body || !!structured.headline;

    // Device preview widths
    const deviceWidths = {
      desktop: 'w-full',
      tablet: 'max-w-xl mx-auto',
      mobile: 'max-w-sm mx-auto',
    };

    return (
      <div className="flex-1 bg-es-bgSoft overflow-y-auto">
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
                className="min-h-full"
              >
                <EditorialOutput />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 font-serif">
                <div className="w-20 h-20 bg-es-border rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-es-muted" />
                </div>
                <h3 className="text-xl font-semibold text-es-text mb-2">
                  Ready to Generate
                </h3>
                <p className="text-es-textSoft mb-6 max-w-sm text-sm">
                  Fill in your content in the editor and click Generate Output to preview your magazine layout.
                </p>
                <button
                  onClick={onGenerate}
                  className="flex items-center gap-2 bg-es-borderStrong hover:bg-es-textSoft text-white font-medium py-3 px-6 rounded-md transition-colors"
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
