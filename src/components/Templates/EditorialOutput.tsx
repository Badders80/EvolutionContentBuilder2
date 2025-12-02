import { EditorialHeader } from '../layout/Header';
import { EditorialFooter } from '../layout/Footer';
import { SmartImage } from '../SmartImage';
import { RawHtmlEmbed } from '../RawHtmlEmbed';
import { useAppContext } from '../../context/AppContext';

/**
 * Premium greyscale editorial output template
 * Uses Lora font, clean typography hierarchy, and responsive grid
 */
export function EditorialOutput() {
  const { structured: content, settings, setTargetField } = useAppContext();

  // Split body into paragraphs
  const paragraphs = content.body.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="min-h-full bg-es-bgSoft py-8 md:py-10">
      <article className="mx-auto max-w-4xl bg-white shadow-sm px-6 md:px-12 lg:px-16 py-8 md:py-10">
        {/* Header */}
        <EditorialHeader />
        <div className="border-b-2 border-black mt-2 mb-10" />

        {/* Responsive Grid: Left = content, Right = quote + image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Headline, Subheadline, Body */}
          <div>
            {/* Headline */}
            <h1
              className="editorial-headline text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-3 text-es-text cursor-pointer hover:bg-es-bgSoft transition-colors"
              onClick={() => setTargetField('headline')}
            >
              {content.headline || 'Your Headline Here'}
            </h1>

            {/* Subheadline / standfirst */}
            {content.subheadline && (
              <p
                className="font-sans text-es-textSoft text-[1.2rem] leading-relaxed mb-8 cursor-pointer hover:bg-es-bgSoft transition-colors"
                onClick={() => setTargetField('subheadline')}
              >
                {content.subheadline}
              </p>
            )}

            {/* Body Paragraphs */}
            <div
              className="editorial-body text-es-text cursor-pointer hover:bg-es-bgSoft transition-colors"
              onClick={() => setTargetField('body')}
            >
              {paragraphs.length > 0 ? (
                paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-sm md:text-[0.95rem] leading-relaxed mb-4"
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-es-muted italic text-sm">
                  Your article content will appear here...
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Quote + Image */}
          <div className="space-y-8 md:self-center">
            {/* Quote Block */}
            {settings.includeQuote && content.quote && (
              <figure className="border-l-2 border-es-borderStrong pl-4">
                <blockquote
                  className="editorial-quote italic text-sm text-es-textSoft mb-2 cursor-pointer hover:bg-es-bgSoft transition-colors"
                  onClick={() => setTargetField('quote')}
                >
                  "{content.quote}"
                </blockquote>
                {content.quoteAttribution && (
                  <figcaption className="text-[0.75rem] uppercase tracking-[0.16em] text-es-muted">
                    — {content.quoteAttribution}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Embed or Image with Caption */}
            {settings.includeImage && (
              <figure className="mt-2 media-box max-w-xs md:max-w-sm w-full mx-auto">
                <div className="w-full">
                  {content.rawEmbedHtml ? (
                    <RawHtmlEmbed html={content.rawEmbedHtml} />
                  ) : (
                    <SmartImage
                      src={content.imagePreview || content.featuredImageUrl || ''}
                      alt={content.caption || content.headline || 'Featured image'}
                    />
                  )}
                </div>
                {content.caption && (
                  <figcaption className="mt-2 text-[0.7rem] text-es-muted text-center italic">
                    {content.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </div>

        {/* Footer */}
        <EditorialFooter />
      </article>
    </div>
  );
}
