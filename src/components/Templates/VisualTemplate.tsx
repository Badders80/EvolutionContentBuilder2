import { SmartImage } from '../SmartImage';
import { useAppContext } from '../../context/AppContext';
import { EditorialHeader } from '../layout/Header/EditorialHeader';
import { EditorialFooter } from '../layout/Footer/EditorialFooter';

export function VisualTemplate() {
  const { structured: content, settings } = useAppContext();

  const isMobile = settings.devicePreview === 'mobile';
  const gridClass = isMobile
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-2 gap-8';

  return (
    <article className="magazine-template min-h-full flex flex-col bg-white font-serif">
      <div className="flex-grow p-6 md:p-8">
        <EditorialHeader />

        {/* Header */}
        <header className="mb-8">
            <h1 className="editorial-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900 mb-4">
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
            {content.body ? (
              <div className="whitespace-pre-wrap text-sm md:text-[0.95rem] leading-relaxed">
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
              <SmartImage
                src={content.imagePreview || content.featuredImageUrl || ''}
                alt="Featured"
              />
            )}
          </div>
        </div>
      </div>

      <EditorialFooter />
    </article>
  );
}
