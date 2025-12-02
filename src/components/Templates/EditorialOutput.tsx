import { EditorialHeader } from '../layout/Header';
import { EditorialFooter } from '../layout/Footer';
import { SmartImage } from '../SmartImage';
import { useAppContext } from '../../context/AppContext';

/**
 * Premium greyscale editorial output template
 * Uses Lora font, clean typography hierarchy, and responsive grid
 */
export function EditorialOutput() {
  const { structured: content, settings, setTargetField } = useAppContext();

  const paragraphs = (content.body ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-es-bg text-es-text">
      <div className="mx-auto max-w-[800px] px-6 pt-6 md:pt-8">
        <header className="mb-8 rounded-md bg-es-text px-4 py-3 text-es-bg">
          <EditorialHeader variant="inverse" />
        </header>
      </div>

      <div className="mx-auto max-w-[800px] px-6 pb-10 md:pb-12">
        <article className="bg-white shadow-sm px-6 md:px-12 lg:px-14 py-8 md:py-10">

          {/* Responsive Grid: Left = content, Right = quote + image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column: Headline, Subheadline, Body */}
            <div>
              {/* Headline */}
              <h1
                className="editorial-headline mb-3 cursor-pointer hover:bg-es-bgSoft transition-colors"
                onClick={() => setTargetField('headline')}
              >
                {content.headline || 'Your Headline Here'}
              </h1>

              {/* Subheadline / standfirst */}
              {content.subheadline && (
                <p
                  className="editorial-subheadline mb-8 cursor-pointer hover:bg-es-bgSoft transition-colors"
                  onClick={() => setTargetField('subheadline')}
                >
                  {content.subheadline}
                </p>
              )}

              {/* Body Paragraphs */}
              <div
                className="editorial-body text-es-text space-y-4 cursor-pointer hover:bg-es-bgSoft transition-colors"
                onClick={() => setTargetField('body')}
              >
                {paragraphs.length > 0 ? (
                  paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
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
                    className="editorial-quote mb-2 cursor-pointer hover:bg-es-bgSoft transition-colors"
                    onClick={() => setTargetField('quote')}
                  >
                    "{content.quote}"
                  </blockquote>
                  {content.quoteAttribution && (
                    <figcaption className="editorial-caption">
                      — {content.quoteAttribution}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Embed, Video, or Image with Caption */}
              {settings.includeImage && (content.featuredImageUrl || content.imagePreview || content.videoUrl || content.rawEmbedHtml) && (
                <div className="my-6 md:my-8">
                  <div className="mx-auto w-full max-w-xl">
                    {content.imagePreview || content.featuredImageUrl ? (
                      <SmartImage
                        src={content.imagePreview || content.featuredImageUrl || ''}
                        alt={content.caption || content.headline || 'Featured image'}
                        className="w-full rounded-lg object-cover"
                      />
                    ) : null}

                    {content.videoUrl && !content.imagePreview && !content.featuredImageUrl && (
                      <iframe
                        src={content.videoUrl}
                        className="mt-4 w-full aspect-video rounded-lg"
                        title="Embedded video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}

                    {content.rawEmbedHtml && !content.imagePreview && !content.featuredImageUrl && !content.videoUrl && (
                      <div
                        className="mt-4 w-full aspect-video rounded-lg overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: content.rawEmbedHtml }}
                      />
                    )}

                    {content.caption && (
                      <figcaption className="editorial-caption text-center mt-2">
                        {content.caption}
                      </figcaption>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <EditorialFooter
            variant="dark"
            className="mt-12 md:mt-16 rounded-md px-4 py-4"
          />
        </article>
      </div>
    </div>
  );
}
