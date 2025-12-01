import { SmartImage } from '../SmartImage';
import { useAppContext } from '../../context/AppContext';

export function EditorialTemplate() {
  const { structured: content, settings } = useAppContext();

  // Split body into paragraphs
  const paragraphs = content.body.split('\n\n').filter(p => p.trim());

  return (
    <article className="magazine-template min-h-full p-6 md:p-8">
      {/* Header */}
      <header className="mb-8 border-b-2 border-slate-900 pb-6">
        {content.subheadline && (
          <p className="font-serif text-es-textSoft text-[1.2rem] leading-relaxed mb-8">
            {content.subheadline}
          </p>
        )}
        <h1 className="magazine-headline text-2xl md:text-3xl lg:text-4xl text-slate-900 mb-4">
          {content.headline || 'Your Headline Here'}
        </h1>
      </header>

      {/* Responsive Grid: Mobile = 1 col, Tablet/Desktop = 2 col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column: Body Content */}
        <div className="magazine-body text-slate-700">
          {paragraphs.length > 0 ? (
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-justify leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">Your body content will appear here...</p>
          )}
        </div>

        {/* Right Column: Quote + Image */}
        <div className="space-y-6">
          {/* Quote Block */}
          {settings.includeQuote && content.quote && (
            <blockquote className="magazine-quote text-lg md:text-xl text-slate-600 py-6 px-4 md:px-6 border-l-4 border-amber-500 bg-amber-50/50 rounded-r-lg">
              <p className="italic">"{content.quote}"</p>
              {content.quoteAttribution && (
                <footer className="mt-4 text-sm text-slate-500 not-italic font-medium">
                  — {content.quoteAttribution}
                </footer>
              )}
            </blockquote>
          )}

          {/* Smart Image */}
          {settings.includeImage && (
            <figure>
              <SmartImage
                src={content.featuredImageUrl || ''}
                alt="Featured"
              />
              {content.featuredImageUrl && (
                <figcaption className="text-xs text-slate-500 mt-2 italic text-center">
                  Featured image
                </figcaption>
              )}
            </figure>
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
          <p className="text-xs text-slate-400">Editorial Layout</p>
        </div>
      </footer>
    </article>
  );
}
