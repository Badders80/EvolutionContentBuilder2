import { useApp } from '../../context/AppContext';

export function LongformTemplate() {
  const { content, settings } = useApp();

  // Split body into paragraphs
  const paragraphs = content.body.split('\n\n').filter(p => p.trim());
  
  // Insert quote after first third of paragraphs
  const quoteInsertIndex = Math.max(1, Math.floor(paragraphs.length / 3));

  return (
    <article className="magazine-template min-h-full">
      {/* Full-width Hero */}
      <header className="relative mb-8">
        {settings.includeImage && (
          <div className="relative h-80 overflow-hidden">
            {content.imagePreview ? (
              <>
                <img
                  src={content.imagePreview}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </>
            ) : (
              <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900" />
            )}
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="magazine-subheadline text-amber-400 text-xs mb-3">
                {content.subheadline || 'SUBHEADLINE'}
              </p>
              <h1 className="magazine-headline text-3xl md:text-5xl text-white mb-2">
                {content.headline || 'Your Headline Here'}
              </h1>
            </div>
          </div>
        )}
        
        {/* No image header */}
        {!settings.includeImage && (
          <div className="p-8 bg-slate-900 text-white">
            <p className="magazine-subheadline text-amber-400 text-xs mb-3">
              {content.subheadline || 'SUBHEADLINE'}
            </p>
            <h1 className="magazine-headline text-3xl md:text-5xl text-white">
              {content.headline || 'Your Headline Here'}
            </h1>
          </div>
        )}
      </header>

      {/* Body Content with Interspersed Quote */}
      <div className="px-8 pb-8">
        <div className="max-w-prose mx-auto">
          <div className="magazine-body text-slate-700">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <div key={index}>
                  <p className="mb-6 text-justify leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                    {paragraph}
                  </p>
                  
                  {/* Insert quote after calculated position */}
                  {settings.includeQuote && content.quote && index === quoteInsertIndex - 1 && (
                    <blockquote className="magazine-quote text-2xl text-slate-600 my-10 py-6 pl-6">
                      <p>"{content.quote}"</p>
                      {content.quoteAttribution && (
                        <footer className="mt-4 text-sm text-slate-500 not-italic">
                          — {content.quoteAttribution}
                        </footer>
                      )}
                    </blockquote>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">Your long-form content will appear here...</p>
            )}
          </div>

          {/* Show quote at end if no paragraphs yet */}
          {settings.includeQuote && content.quote && paragraphs.length === 0 && (
            <blockquote className="magazine-quote text-2xl text-slate-600 my-10 py-6 pl-6">
              <p>"{content.quote}"</p>
              {content.quoteAttribution && (
                <footer className="mt-4 text-sm text-slate-500 not-italic">
                  — {content.quoteAttribution}
                </footer>
              )}
            </blockquote>
          )}
        </div>

        {/* Footer Branding */}
        <footer className="max-w-prose mx-auto mt-12 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-semibold tracking-wide">EVOLUTION</p>
              <p className="text-xs text-slate-400">Premium Content</p>
            </div>
            <p className="text-xs text-slate-400">Longform Layout</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
