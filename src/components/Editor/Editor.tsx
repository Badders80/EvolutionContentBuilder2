import { useRef, useState } from 'react';
import { Upload, X, Type, AlignLeft, MessageSquareQuote, User, Sparkles, FileText, AlertCircle, Minus, Plus } from 'lucide-react';
import { useLayoutEngine } from '../LayoutEngine/useLayoutEngine';
import { useGemini } from '../../hooks/useGemini';
import { determineTemplate } from '../LayoutEngine/layoutRules';
import { useAppStore } from '../../store/useAppStore';
import { AssistantBar } from '../Assistant/AssistantBar';
import { useAssistantStore } from '../../store/useAssistantStore';

export function Editor() {
  const content = useAppStore((s) => s.content);
  const settings = useAppStore((s) => s.settings);
  const updateContent = useAppStore((s) => s.updateContent);
  const isGenerated = useAppStore((s) => s.isGenerated);
  const setGenerated = useAppStore((s) => s.setGenerated);
  const setActiveTemplate = useAppStore((s) => s.setActiveTemplate);
  const setSelectionText = useAssistantStore((s) => s.setSelectionText);
  const { wordCount, templateName } = useLayoutEngine();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Raw input state
  const [rawInput, setRawInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetWordCount, setTargetWordCount] = useState<number | null>(null);
  const { generateFromTranscript, isConfigured } = useGemini();

  // Word count target handlers
  const handleWordTarget = (direction: 'increase' | 'decrease') => {
    const step = 50;
    setTargetWordCount((prev) => {
      const base = prev ?? (wordCount || 150);
      const next = direction === 'increase' ? base + step : Math.max(50, base - step);
      return next;
    });
  };

  function handleBodySelect(
    e: React.SyntheticEvent<HTMLTextAreaElement>
  ) {
    const target = e.currentTarget;
    const { selectionStart, selectionEnd, value } = target;
    if (selectionStart === selectionEnd) {
      setSelectionText(null);
      return;
    }
    const selected = value.slice(selectionStart, selectionEnd);
    setSelectionText(selected);
  }

  // Handle generating structured content from raw input
  const handleGenerateStructured = async () => {
    if (!rawInput.trim()) {
      setError('Please paste your transcript or raw content first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const desiredWordCount = targetWordCount ?? (wordCount || 150);
      const result = await generateFromTranscript({
        transcript: rawInput,
        targetWordCount: desiredWordCount,
      });
      
      // Auto-fill all editor fields
      updateContent({
        headline: result.headline,
        subheadline: result.subheadline,
        body: result.body,
        quote: result.quote,
        quoteAttribution: result.quoteAttribution,
      });

      // Auto-generate preview
      const template = determineTemplate(result.body, settings.layoutType);
      setActiveTemplate(template);
      setGenerated(true);
      
      // Clear raw input after successful generation
      setRawInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateContent({
          imageFile: file,
          imagePreview: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateContent({ imageFile: null, imagePreview: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-es-text font-serif">Content Editor</h2>
            <p className="text-sm text-es-muted">
              {isGenerated ? (
                <>Active: <span className="font-medium text-es-text">{templateName} Template</span></>
              ) : (
                'Enter your content below'
              )}
            </p>
          </div>
          {/* Word Count Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleWordTarget('decrease')}
              className="w-7 h-7 flex items-center justify-center border border-es-border rounded hover:bg-es-bgSoft text-es-muted hover:text-es-text transition-colors"
            >
              <Minus size={14} />
            </button>
            <div className="text-center min-w-[70px]">
              <p className="text-xl font-semibold text-es-text">{wordCount}</p>
              <p className="text-[0.65rem] text-es-muted uppercase tracking-wide">words</p>
            </div>
            <button
              type="button"
              onClick={() => handleWordTarget('increase')}
              className="w-7 h-7 flex items-center justify-center border border-es-border rounded hover:bg-es-bgSoft text-es-muted hover:text-es-text transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Target word hint */}
        {targetWordCount && (
          <p className="text-[0.7rem] text-es-muted -mt-4">
            Target length: around {targetWordCount} words
          </p>
        )}

        {/* RAW INPUT SECTION - Always visible at top */}
        <div className="p-4 bg-es-bgSoft border border-es-border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-es-textSoft" />
            <label className="text-sm font-semibold text-es-text font-serif">
              Raw Input (Transcript / Notes)
            </label>
          </div>
          
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste your transcript, interview notes, race commentary, or any raw content here... Gemini will convert it into structured magazine content."
            rows={5}
            className="w-full px-4 py-3 bg-white border border-es-border rounded-md text-sm font-serif placeholder:text-es-muted focus:outline-none focus:ring-2 focus:ring-es-borderStrong focus:border-transparent resize-none"
          />

          {error && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {!isConfigured && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-es-bgSoft border border-es-border rounded-md text-es-muted text-xs">
              <AlertCircle size={14} />
              <span>Set VITE_GEMINI_KEY in .env to enable AI generation</span>
            </div>
          )}

          <button
            onClick={handleGenerateStructured}
            disabled={isGenerating || !isConfigured || !rawInput.trim()}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-es-text hover:bg-es-textSoft disabled:bg-es-border disabled:text-es-muted disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-md font-medium transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Structured Content
              </>
            )}
          </button>

          <p className="mt-2 text-xs text-es-muted text-center">
            AI will auto-fill: Headline, Subheadline, Body, Quote & Attribution
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-es-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-slate-50 text-es-muted font-medium">Or edit fields manually</span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-es-text">
            <Type size={16} className="text-es-muted" />
            Headline
          </label>
          <input
            type="text"
            value={content.headline}
            onChange={(e) => updateContent({ headline: e.target.value })}
            placeholder="Enter a compelling headline..."
            className="w-full px-4 py-3 bg-white border border-es-border rounded-md text-lg font-semibold font-serif placeholder:text-es-muted focus:outline-none focus:ring-2 focus:ring-es-borderStrong focus:border-transparent"
          />
        </div>

        {/* Subheadline */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-es-text">
            <Type size={14} className="text-es-muted" />
            Subheadline
          </label>
          <input
            type="text"
            value={content.subheadline}
            onChange={(e) => updateContent({ subheadline: e.target.value })}
            placeholder="Add a supporting subheadline..."
            className="w-full px-4 py-2.5 bg-white border border-es-border rounded-md text-sm italic font-serif placeholder:text-es-muted focus:outline-none focus:ring-2 focus:ring-es-borderStrong focus:border-transparent"
          />
        </div>

        {/* Body Text */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-es-text">
            <AlignLeft size={16} className="text-es-muted" />
            Body Text
          </label>
          <textarea
            value={content.body}
            onChange={(e) => updateContent({ body: e.target.value })}
            onSelect={handleBodySelect}
            placeholder="Write the main body copy here..."
            rows={10}
            className="w-full px-4 py-3 bg-white border border-es-border rounded-md text-sm leading-relaxed font-serif placeholder:text-es-muted focus:outline-none focus:ring-2 focus:ring-es-borderStrong focus:border-transparent resize-none"
          />
          <p className="text-xs text-es-muted">
            {wordCount < 140 && '< 140 words: Visual template'}
            {wordCount >= 140 && wordCount <= 400 && '140-400 words: Editorial template'}
            {wordCount > 400 && '> 400 words: Longform template'}
          </p>
        </div>

        {/* Quote Section */}
        {settings.includeQuote && (
          <div className="space-y-4 p-4 bg-es-bgSoft border border-es-border rounded-lg">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-es-text">
                <MessageSquareQuote size={16} className="text-es-muted" />
                Quote (Optional)
              </label>
              <textarea
                value={content.quote}
                onChange={(e) => updateContent({ quote: e.target.value })}
                placeholder="Add a memorable quote..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-es-border rounded-md text-sm italic font-serif placeholder:text-es-muted focus:outline-none focus:ring-2 focus:ring-es-borderStrong focus:border-transparent resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-es-text">
                <User size={16} className="text-es-muted" />
                Quote Attribution
              </label>
              <input
                type="text"
                value={content.quoteAttribution}
                onChange={(e) => updateContent({ quoteAttribution: e.target.value })}
                placeholder="— Author name or source"
                className="w-full px-4 py-2 bg-white border border-es-border rounded-md text-sm placeholder:text-es-muted focus:outline-none focus:ring-2 focus:ring-es-borderStrong focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Image Upload */}
        {settings.includeImage && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-es-text">
              <Upload size={16} className="text-es-muted" />
              Featured Image
            </label>
            
            {content.imagePreview ? (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={content.imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-es-borderStrong hover:bg-es-textSoft text-white rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Image Caption Input */}
                <div>
                  <label className="block text-xs font-medium text-es-muted mb-1">
                    Image Caption (optional)
                  </label>
                  <input
                    type="text"
                    value={content.imageCaption}
                    onChange={(e) => updateContent({ imageCaption: e.target.value })}
                    placeholder="Add a short caption…"
                    className="w-full border border-es-border rounded-md px-3 py-1.5 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-es-borderStrong"
                  />
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 text-[0.7rem] text-es-textSoft hover:text-es-text transition-colors disabled:opacity-60"
                  disabled
                >
                  <Plus size={12} />
                  <span>Add another image (coming soon)</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-es-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-es-borderStrong hover:bg-es-bgSoft transition-colors"
              >
                <Upload size={24} className="text-es-muted mb-2" />
                <p className="text-sm text-es-textSoft">Click to upload image</p>
                <p className="text-xs text-es-muted">PNG, JPG up to 10MB</p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        <AssistantBar />
      </div>
    </div>
  );
}
