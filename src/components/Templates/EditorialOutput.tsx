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
      <div className="mx-auto max-w-[800px] px-6 py-10 md:py-12">
        <EditorialHeader content={content} />

        <article className="bg-white shadow-sm px-6 md:px-12 lg:px-14 py-8 md:py-10 rounded-md">
          {/* Responsive Grid: Left = content, Right = quote + image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column: Body */}
            <div>
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
                <div
                  className="my-8 md:my-10 cursor-pointer hover:bg-es-bgSoft transition-colors"
                  onClick={() => setTargetField('quote')}
                >
                  <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-es-textSoft">
                    “{content.quote}”
                  </p>
                  {content.quoteAttribution && (
                    <p className="mt-2 text-xs uppercase tracking-wide text-es-textSoft/80">
                      — {content.quoteAttribution}
                    </p>
                  )}
                </div>
              )}

              {/* Embed, Video, or Image with Caption */}
              {settings.includeImage && (content.featuredImageUrl || content.imagePreview || content.videoUrl || content.rawEmbedHtml) && (
                <div className="my-8 md:my-10">
                  <div className="mx-auto w-full max-w-md md:max-w-lg">
                    {content.imagePreview || content.featuredImageUrl ? (
                      <SmartImage
                        src={content.imagePreview || content.featuredImageUrl || ''}
                        alt={content.caption || content.headline || 'Featured image'}
                        className="w-full rounded-lg object-cover"
                      />
                    ) : null}

                    {content.videoUrl && !content.imagePreview && !content.featuredImageUrl && (
                      <div className="mt-4 w-full aspect-video overflow-hidden rounded-lg">
                        <iframe
                          src={content.videoUrl}
                          className="h-full w-full"
                          title="Embedded video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {content.rawEmbedHtml && !content.imagePreview && !content.featuredImageUrl && !content.videoUrl && (
                      <div className="mt-4 w-full aspect-video overflow-hidden rounded-lg">
                        <div
                          className="h-full w-full"
                          dangerouslySetInnerHTML={{ __html: content.rawEmbedHtml }}
                        />
                      </div>
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
        </article>

        <EditorialFooter className="mt-12 md:mt-16 rounded-md px-4 py-4" />
      </div>
    </div>
  );
}
