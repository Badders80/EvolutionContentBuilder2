import { useRef, useState } from 'react';
import { Upload, X, Type, AlignLeft, MessageSquareQuote, User, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLayoutEngine } from '../LayoutEngine/useLayoutEngine';
import { useGemini } from '../../hooks/useGemini';
import { determineTemplate } from '../LayoutEngine/layoutRules';

export function Editor() {
  const { content, settings, updateContent, isGenerated, setIsGenerated, setActiveTemplate } = useApp();
  const { wordCount, templateName } = useLayoutEngine();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Raw input state
  const [rawInput, setRawInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { generateContent, isConfigured } = useGemini();

  // Handle generating structured content from raw input
  const handleGenerateStructured = async () => {
    if (!rawInput.trim()) {
      setError('Please paste your transcript or raw content first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateContent(rawInput);
      
      // Auto-fill all editor fields
      updateContent({
        headline: result.headline,
        subheadline: result.subheadline,
        body: result.body,
        quote: result.quote,
        quoteAttribution: result.attribution,
      });

      // Auto-generate preview
      const template = determineTemplate(result.body, settings.layoutType);
      setActiveTemplate(template);
      setIsGenerated(true);
      
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
            <h2 className="text-xl font-semibold text-slate-900">Content Editor</h2>
            <p className="text-sm text-slate-500">
              {isGenerated ? (
                <>Active: <span className="font-medium text-amber-600">{templateName} Template</span></>
              ) : (
                'Enter your content below'
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-700">{wordCount}</p>
            <p className="text-xs text-slate-500">words</p>
          </div>
        </div>

        {/* RAW INPUT SECTION - Always visible at top */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-purple-600" />
            <label className="text-sm font-semibold text-purple-900">
              Raw Input (Transcript / Notes)
            </label>
          </div>
          
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste your transcript, interview notes, race commentary, or any raw content here... Gemini will convert it into structured magazine content."
            rows={5}
            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />

          {error && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {!isConfigured && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs">
              <AlertCircle size={14} />
              <span>Set VITE_GEMINI_KEY in .env to enable AI generation</span>
            </div>
          )}

          <button
            onClick={handleGenerateStructured}
            disabled={isGenerating || !isConfigured || !rawInput.trim()}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
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

          <p className="mt-2 text-xs text-purple-600 text-center">
            AI will auto-fill: Headline, Subheadline, Body, Quote & Attribution
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-slate-50 text-slate-500 font-medium">Or edit fields manually</span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Type size={16} className="text-slate-400" />
            Headline
          </label>
          <input
            type="text"
            value={content.headline}
            onChange={(e) => updateContent({ headline: e.target.value })}
            placeholder="Enter a compelling headline..."
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-lg font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Subheadline */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Type size={14} className="text-slate-400" />
            Subheadline
          </label>
          <input
            type="text"
            value={content.subheadline}
            onChange={(e) => updateContent({ subheadline: e.target.value })}
            placeholder="Add a supporting subheadline..."
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Body Text */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <AlignLeft size={16} className="text-slate-400" />
            Body Text
          </label>
          <textarea
            value={content.body}
            onChange={(e) => updateContent({ body: e.target.value })}
            placeholder="Write your article content here..."
            rows={10}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-500">
            {wordCount < 140 && '< 140 words: Visual template'}
            {wordCount >= 140 && wordCount <= 400 && '140-400 words: Editorial template'}
            {wordCount > 400 && '> 400 words: Longform template'}
          </p>
        </div>

        {/* Quote Section */}
        {settings.includeQuote && (
          <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <MessageSquareQuote size={16} className="text-amber-600" />
                Quote (Optional)
              </label>
              <textarea
                value={content.quote}
                onChange={(e) => updateContent({ quote: e.target.value })}
                placeholder="Add a memorable quote..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-lg text-sm italic placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <User size={16} className="text-amber-600" />
                Quote Attribution
              </label>
              <input
                type="text"
                value={content.quoteAttribution}
                onChange={(e) => updateContent({ quoteAttribution: e.target.value })}
                placeholder="— Author name or source"
                className="w-full px-4 py-2 bg-white border border-amber-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Image Upload */}
        {settings.includeImage && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Upload size={16} className="text-slate-400" />
              Featured Image
            </label>
            
            {content.imagePreview ? (
              <div className="relative">
                <img
                  src={content.imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors"
              >
                <Upload size={24} className="text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Click to upload image</p>
                <p className="text-xs text-slate-400">PNG, JPG up to 10MB</p>
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
      </div>
    </div>
  );
}
