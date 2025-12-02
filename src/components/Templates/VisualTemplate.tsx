import { SmartImage } from '../SmartImage';
import { RawHtmlEmbed } from '../RawHtmlEmbed';
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
    <article className="magazine-template min-h-full flex flex-col bg-white">
      <div className="flex-grow p-6 md:p-8">
        <EditorialHeader />

        {/* Header */}
        <header className="mb-8">
          <h1 className="editorial-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900 mb-4">
            {content.headline || 'Your Headline Here'}
          </h1>
          {content.subheadline && (
            <p className="font-sans italic text-es-textSoft text-[1.2rem] leading-relaxed mb-8">
              {content.subheadline}
            </p>
          )}
        </header>

        {/* Responsive Grid: Mobile = 1 col, Tablet/Desktop = 2 col */}
        <div className={gridClass}>
          {/* Left Column: Body Content */}
          <div className="magazine-body editorial-body text-es-text">
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

            {/* Embed, Video, or Smart Image */}
            {settings.includeImage && (
              <div className="media-box max-w-xs md:max-w-sm w-full mx-auto">
                {content.rawEmbedHtml ? (
                  <RawHtmlEmbed html={content.rawEmbedHtml} />
                ) : content.videoUrl ? (
                  <video
                    controls
                    src={content.videoUrl}
                    className="w-full h-full object-cover rounded shadow-md"
                  />
                ) : (
                  <SmartImage
                    src={content.imagePreview || content.featuredImageUrl || ''}
                    alt={content.caption || content.headline || 'Featured'}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <EditorialFooter />
    </article>
  );
}
