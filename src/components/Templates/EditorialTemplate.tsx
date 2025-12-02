import { SmartImage } from '../SmartImage';
import { useAppContext } from '../../context/AppContext';
import { EditorialHeader } from '../layout/Header/EditorialHeader';
import { EditorialFooter } from '../layout/Footer/EditorialFooter';

export function EditorialTemplate() {
  const { structured: content, settings } = useAppContext();

  const isMobile = settings.devicePreview === 'mobile';
  const gridClass = isMobile 
    ? 'grid grid-cols-1 gap-6' 
    : 'grid grid-cols-2 gap-8';

  // Split body into paragraphs
  const paragraphs = content.body.split('\n\n').filter(p => p.trim());

  return (
    <article className="magazine-template min-h-full flex flex-col bg-white font-serif">
      <div className="flex-grow p-6 md:p-8">
        <EditorialHeader />

        {/* Header */}
        <header className="mb-8 border-b-2 border-black pb-6">
          <h1 className="editorial-headline text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight mb-3 text-es-text">
            {content.headline || 'Your Headline Here'}
          </h1>
          {content.subheadline && (
            <p className="font-serif italic text-es-textSoft text-[1.2rem] leading-relaxed mb-8">
              {content.subheadline}
            </p>
          )}
        </header>

        {/* Responsive Grid: Mobile = 1 col, Tablet/Desktop = 2 col */}
        <div className={gridClass}>
          {/* Left Column: Body Content */}
          <div className="magazine-body editorial-body font-serif text-es-text">
            {paragraphs.length > 0 ? (
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm md:text-[0.95rem] leading-relaxed mb-4"
                  >
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
              <figure className="border-l-2 border-es-borderStrong pl-4">
                <blockquote className="editorial-quote italic text-sm text-es-textSoft mb-2">
                  "{content.quote}"
                </blockquote>
                {content.quoteAttribution && (
                  <figcaption className="text-[0.75rem] uppercase tracking-[0.16em] text-es-muted">
                    — {content.quoteAttribution}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Smart Image */}
            {settings.includeImage && (
              <figure>
                <SmartImage
                  src={content.imagePreview || content.featuredImageUrl || ''}
                  alt="Featured"
                />
                {(content.imagePreview || content.featuredImageUrl) && (
                  <figcaption className="text-xs text-slate-500 mt-2 italic text-center">
                    Featured image
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </div>
      </div>

      <EditorialFooter />
    </article>
  );
}
