import { useApp } from '../../context/AppContext';

export function EditorialTemplate() {
  const { content, settings } = useApp();

  // Split body into paragraphs for two-column layout
  const paragraphs = content.body.split('\n\n').filter(p => p.trim());

  return (
    <article className="magazine-template min-h-full p-8">
      {/* Header */}
      <header className="mb-8 border-b-2 border-slate-900 pb-6">
        <p className="magazine-subheadline text-amber-600 text-xs mb-3">
          {content.subheadline || 'SUBHEADLINE'}
        </p>
        
        <h1 className="magazine-headline text-3xl md:text-4xl text-slate-900 mb-4">
          {content.headline || 'Your Headline Here'}
        </h1>
      </header>

      {/* Image Section */}
      {settings.includeImage && (
        <figure className="mb-8">
          {content.imagePreview ? (
            <img
              src={content.imagePreview}
              alt="Featured"
              className="w-full h-56 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="h-56 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
              <span className="text-slate-500 text-sm">Featured Image</span>
            </div>
          )}
          <figcaption className="text-xs text-slate-500 mt-2 italic text-center">
            Image caption placeholder
          </figcaption>
        </figure>
      )}

      {/* Two-Column Body Content */}
      <div className="magazine-body text-slate-700 mb-8">
        {paragraphs.length > 0 ? (
          <div className="two-column">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic">Your body content will appear here in a two-column layout...</p>
        )}
      </div>

      {/* Quote Block - Centered */}
      {settings.includeQuote && content.quote && (
        <blockquote className="magazine-quote text-xl text-center text-slate-600 my-10 py-6 px-8 border-l-0 border-y border-amber-300 bg-amber-50/50">
          <p className="italic">"{content.quote}"</p>
          {content.quoteAttribution && (
            <footer className="mt-4 text-sm text-slate-500 not-italic font-medium">
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
          <p className="text-xs text-slate-400">Editorial Layout</p>
        </div>
      </footer>
    </article>
  );
}
