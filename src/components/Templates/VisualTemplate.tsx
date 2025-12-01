import { useApp } from '../../context/AppContext';

export function VisualTemplate() {
  const { content, settings } = useApp();

  return (
    <article className="magazine-template min-h-full p-8">
      {/* Hero Section */}
      <header className="relative mb-8">
        {settings.includeImage && content.imagePreview && (
          <div className="relative h-64 mb-6 overflow-hidden rounded-lg shadow-lg">
            <img
              src={content.imagePreview}
              alt="Featured"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        
        {/* Placeholder image block when no image */}
        {settings.includeImage && !content.imagePreview && (
          <div className="h-64 mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
            <span className="text-slate-500 text-sm">Featured Image</span>
          </div>
        )}

        <p className="magazine-subheadline text-amber-600 text-xs mb-2">
          {content.subheadline || 'SUBHEADLINE'}
        </p>
        
        <h1 className="magazine-headline text-4xl md:text-5xl text-slate-900 mb-4">
          {content.headline || 'Your Headline Here'}
        </h1>
      </header>

      {/* Body Content */}
      <div className="magazine-body text-slate-700 mb-8">
        {content.body ? (
          <p className="whitespace-pre-wrap">{content.body}</p>
        ) : (
          <p className="text-slate-400 italic">Your body content will appear here...</p>
        )}
      </div>

      {/* Quote Block */}
      {settings.includeQuote && content.quote && (
        <blockquote className="magazine-quote text-xl text-slate-600 my-8 py-4">
          <p>"{content.quote}"</p>
          {content.quoteAttribution && (
            <footer className="mt-3 text-sm text-slate-500 not-italic">
              — {content.quoteAttribution}
            </footer>
          )}
        </blockquote>
      )}

      {/* Footer Branding */}
      <footer className="mt-12 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-600 font-semibold tracking-wide">EVOLUTION</p>
            <p className="text-xs text-slate-400">Premium Content</p>
          </div>
          <p className="text-xs text-slate-400">Visual Layout</p>
        </div>
      </footer>
    </article>
  );
}
