
import { SmartImage } from '../SmartImage';
import { RawHtmlEmbed } from '../RawHtmlEmbed';
import { EditorialHeader } from '../layout/Header';
import { EditorialFooter } from '../layout/Footer';
import type { StructuredFields } from '../../types';
import { getBodyLayoutClasses } from '../../layout/layoutConfig';

import type { LayoutConfig } from '../../layout/layoutConfig';

interface VisualTemplateProps {
  structured: StructuredFields;
  layoutConfig: LayoutConfig;
  settings: { includeQuote: boolean; includeImage: boolean; devicePreview: string };
}

export function VisualTemplate({ structured: content, layoutConfig, settings }: VisualTemplateProps) {
  const isMobile = settings.devicePreview === 'mobile';
  const gridClass = isMobile
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-2 gap-8';

  return (
    <article className="magazine-template min-h-full flex flex-col bg-white">
      <div className={getBodyLayoutClasses(layoutConfig)}>
        <EditorialHeader />

        {/* Header */}
        <header className="mb-8">
          {/* Headline/Subheadline now handled by header */}
        </header>

        {/* Responsive Grid: Mobile = 1 col, Tablet/Desktop = 2 col */}
        <div className={gridClass}>
          {/* Left Column: Body Content */}
          <div className="magazine-body editorial-body text-es-text">
            {content.body ? (
              <div className="whitespace-pre-wrap">
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

            {/* Embed, Video, or Smart Image */}
            {settings.includeImage && (
              <>
                {content.rawEmbedHtml && !content.videoUrl && !content.featuredImageUrl && !content.imagePreview ? (
                  <div className="my-6 md:my-8">
                    <div className="mx-auto w-full max-w-xl">
                      <div className="w-full aspect-video rounded-lg overflow-hidden">
                        <RawHtmlEmbed html={content.rawEmbedHtml} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="media-box max-w-xs md:max-w-sm w-full mx-auto">
                    {content.videoUrl ? (
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
              </>
            )}
          </div>
        </div>
      </div>

      <EditorialFooter />
    </article>
  );
}
