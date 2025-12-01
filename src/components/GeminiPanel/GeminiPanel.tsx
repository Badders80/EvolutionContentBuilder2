import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useGemini, type GeminiContentResult } from '../../hooks/useGemini';

interface GeminiPanelProps {
  onFill: (result: GeminiContentResult) => void;
}

/**
 * Collapsible Gemini AI assistant panel for auto-generating magazine content
 */
export function GeminiPanel({ onFill }: GeminiPanelProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { generateFromTranscript, isConfigured } = useGemini();

  async function handleGenerate() {
    if (!input.trim()) {
      setError('Please paste a transcript first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateFromTranscript({
        transcript: input,
        targetWordCount: 180,
      });
      onFill(result);
      setInput(''); // Clear after successful generation
      setIsExpanded(false); // Collapse panel after success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-slate-700">
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-sm font-medium">Gemini Assistant</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {!isConfigured && (
            <div className="flex items-start gap-2 p-2 bg-amber-900/30 rounded text-amber-300 text-xs">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>Set VITE_GEMINI_KEY in .env to enable AI generation</span>
            </div>
          )}

          <textarea
            className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Paste your transcript, interview notes, or raw content here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className="flex items-start gap-2 p-2 bg-red-900/30 rounded text-red-300 text-xs">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            onClick={handleGenerate}
            disabled={loading || !isConfigured}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Magazine Content
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center">
            AI will structure your content into headline, body, and quote
          </p>
        </div>
      )}
    </div>
  );
}
