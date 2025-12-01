import { useRef } from 'react';
import { Upload, X, Type, AlignLeft, MessageSquareQuote, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLayoutEngine } from '../LayoutEngine/useLayoutEngine';

export function Editor() {
  const { content, settings, updateContent, isGenerated } = useApp();
  const { wordCount, templateName } = useLayoutEngine();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
