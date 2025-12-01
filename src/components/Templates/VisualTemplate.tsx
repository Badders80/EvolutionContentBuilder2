import { useApp } from '../../context/AppContext';
import { SmartImage } from '../SmartImage';

export function VisualTemplate() {
  const { content, settings } = useApp();

  return (
    <article className="magazine-template min-h-full p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <p className="magazine-subheadline text-amber-600 text-xs mb-2">
          {content.subheadline || 'SUBHEADLINE'}
        </p>
        <h1 className="magazine-headline text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-4">
          {content.headline || 'Your Headline Here'}
        </h1>
      </header>

      {/* Responsive Grid: Mobile = 1 col, Tablet/Desktop = 2 col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column: Body Content */}
        <div className="magazine-body text-slate-700">
          {content.body ? (
            <div className="whitespace-pre-wrap leading-relaxed">
              {content.body}
            </div>
          ) : (
            <p className="text-slate-400 italic">Your body content will appear here...</p>
          )}
        </div>

        {/* Right Column: Quote + Image */}
        <div className="space-y-6">
          {/* Quote Block */}
          {settings.includeQuote && content.quote && (
            <blockquote className="magazine-quote text-lg md:text-xl text-slate-600 py-4">
              <p>"{content.quote}"</p>
              {content.quoteAttribution && (
                <footer className="mt-3 text-sm text-slate-500 not-italic">
                  — {content.quoteAttribution}
                </footer>
              )}
            </blockquote>
          )}

          {/* Smart Image */}
          {settings.includeImage && (
            <SmartImage
              src={content.imagePreview || ''}
              alt="Featured"
            />
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-12 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-600 font-semibold tracking-wide">EVOLUTION STABLES</p>
            <p className="text-xs text-slate-400">Premium Content</p>
          </div>
          <p className="text-xs text-slate-400">Visual Layout</p>
        </div>
      </footer>
    </article>
  );
}
