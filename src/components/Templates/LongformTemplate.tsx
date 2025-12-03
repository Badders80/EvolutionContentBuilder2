import { SmartImage } from '../SmartImage';
import { RawHtmlEmbed } from '../RawHtmlEmbed';
import { useAppContext } from '../../context/AppContext';
import { EditorialHeader } from '../layout/Header/EditorialHeader';
import { EditorialFooter } from '../layout/Footer/EditorialFooter';

export function LongformTemplate() {
  const { structured: content, settings } = useAppContext();

  const isMobile = settings.devicePreview === 'mobile';
  const gridClass = isMobile
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-2 gap-8';

  // Split body into paragraphs
  const paragraphs = content.body.split('\n\n').filter(p => p.trim());

  return (
    <article className="magazine-template min-h-full flex flex-col bg-white">
      <div className="flex-grow">
        {/* Branding Header - Padded */}
        <div className="px-6 md:px-8 pt-6 md:pt-8">
          <EditorialHeader content={content} variant="light" />
        </div>

        {/* Full-width Hero */}
        <header className="relative mb-8">
          {settings.includeImage && (content.imagePreview || content.featuredImageUrl || content.videoUrl || content.rawEmbedHtml) ? (
            <div className="relative h-64 md:h-80 overflow-hidden">
              {content.rawEmbedHtml ? (
                <RawHtmlEmbed html={content.rawEmbedHtml} className="h-full w-full" />
              ) : content.videoUrl ? (
                <video
                  controls
                  src={content.videoUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={content.imagePreview || content.featuredImageUrl}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <h1 className="editorial-headline text-white mb-2">
                  {content.headline || 'Your Headline Here'}
                </h1>
                {content.subheadline && (
                  <p className="editorial-subheadline text-white/90 mb-8">
                    {content.subheadline}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 bg-slate-900 text-white">
              <h1 className="editorial-headline text-white mb-2">
                {content.headline || 'Your Headline Here'}
              </h1>
              {content.subheadline && (
                <p className="editorial-subheadline text-white/90 mb-8">
                  {content.subheadline}
                </p>
              )}
            </div>
          )}
        </header>

        {/* Body Content - Responsive Grid for longer content */}
        <div className="px-6 md:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Two-column grid for desktop, single column for mobile */}
            <div className={gridClass}>
              {/* Left Column: Main body text */}
              <div className="magazine-body editorial-body text-es-text">
                {paragraphs.length > 0 ? (
                  paragraphs.slice(0, Math.ceil(paragraphs.length / 2)).map((paragraph, index) => (
                    <p
                      key={index}
                      className={`mb-6 ${index === 0
                        ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1'
                        : ''
                        }`}
                    >
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
                  <figure className="border-l-2 border-es-borderStrong pl-4">
                    <blockquote className="editorial-quote mb-2">
                      "{content.quote}"
                    </blockquote>
                    {content.quoteAttribution && (
                      <figcaption className="editorial-caption">
                        — {content.quoteAttribution}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Remaining paragraphs */}
                <div className="magazine-body editorial-body text-es-text">
                  {paragraphs.slice(Math.ceil(paragraphs.length / 2)).map((paragraph, index) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Secondary image placement for longform */}
                {settings.includeImage && !(content.imagePreview || content.featuredImageUrl) && (
                  <div className="media-box max-w-xs md:max-w-sm w-full mx-auto">
                    <SmartImage src="" alt="Featured" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditorialFooter />
    </article>
  );
}
