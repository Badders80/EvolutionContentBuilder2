import { SmartImage } from '../SmartImage';
import { useAppStore } from '../../store/useAppStore';

export function LongformTemplate() {
  const content = useAppStore((s) => s.content);
  const settings = useAppStore((s) => s.settings);

  // Split body into paragraphs
  const paragraphs = content.body.split('\n\n').filter(p => p.trim());

  return (
    <article className="magazine-template min-h-full">
      {/* Full-width Hero */}
      <header className="relative mb-8">
        {settings.includeImage && content.imagePreview ? (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={content.imagePreview}
              alt="Featured"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              {content.subheadline && (
                <p className="font-serif text-es-textSoft text-[1.2rem] leading-relaxed mb-8">
                  {content.subheadline}
                </p>
              )}
              <h1 className="magazine-headline text-2xl md:text-4xl lg:text-5xl text-white mb-2">
                {content.headline || 'Your Headline Here'}
              </h1>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 bg-slate-900 text-white">
            {content.subheadline && (
              <p className="font-serif text-es-textSoft text-[1.2rem] leading-relaxed mb-8">
                {content.subheadline}
              </p>
            )}
            <h1 className="magazine-headline text-2xl md:text-4xl lg:text-5xl text-white">
              {content.headline || 'Your Headline Here'}
            </h1>
          </div>
        )}
      </header>

      {/* Body Content - Responsive Grid for longer content */}
      <div className="px-6 md:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Two-column grid for desktop, single column for mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column: Main body text */}
            <div className="magazine-body text-slate-700">
              {paragraphs.length > 0 ? (
                paragraphs.slice(0, Math.ceil(paragraphs.length / 2)).map((paragraph, index) => (
                  <p key={index} className={`mb-6 leading-relaxed ${index === 0 ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1' : ''}`}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-slate-400 italic">Your long-form content will appear here...</p>
              )}
            </div>

            {/* Right Column: Rest of body + quote */}
            <div className="space-y-6">
              {/* Quote Block */}
              {settings.includeQuote && content.quote && (
                <blockquote className="magazine-quote text-lg md:text-xl text-slate-600 py-6 pl-4 md:pl-6">
                  <p>"{content.quote}"</p>
                  {content.quoteAttribution && (
                    <footer className="mt-4 text-sm text-slate-500 not-italic">
                      — {content.quoteAttribution}
                    </footer>
                  )}
                </blockquote>
              )}

              {/* Remaining paragraphs */}
              <div className="magazine-body text-slate-700">
                {paragraphs.slice(Math.ceil(paragraphs.length / 2)).map((paragraph, index) => (
                  <p key={index} className="mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Secondary image placement for longform */}
              {settings.includeImage && !content.imagePreview && (
                <SmartImage src="" alt="Featured" />
              )}
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <footer className="max-w-4xl mx-auto mt-12 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-semibold tracking-wide">EVOLUTION STABLES</p>
              <p className="text-xs text-slate-400">Premium Content</p>
            </div>
            <p className="text-xs text-slate-400">Longform Layout</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
