import { EditorialHeader } from "../layout/Header";
import { EditorialFooter } from "../layout/Footer";
import { SmartImage } from "../SmartImage";
import { ExternalEmbedCard } from "../ExternalEmbedCard";
import { getBodyColumnClasses, getRightColumnClasses, getPullQuoteClasses, getArticleContainerClasses, getArticleColumnWrapperClasses } from "../../layout/layoutConfig";
import type { StructuredFields } from "../../types";

import type { LayoutConfig } from "../../layout/layoutConfig";
import { RawHtmlEmbed } from "../RawHtmlEmbed";

interface EditorialOutputProps {
  structured: StructuredFields;
  layoutConfig: LayoutConfig;
  settings: { includeQuote: boolean; includeImage: boolean };
}

export function EditorialOutput({ structured: content, layoutConfig, settings }: EditorialOutputProps) {
  // setTargetField is not available here; click-to-edit is not supported in props-only mode
  const paragraphs = content.body
    ? content.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-es-bg text-es-text">
      <div className={getArticleContainerClasses()}>
        <EditorialHeader />
        <div className={getArticleColumnWrapperClasses(layoutConfig)}>
          {/* Left column: body */}
          <div className={getBodyColumnClasses(layoutConfig)}>
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
            ) : (
              <p className="text-es-textSoft">
                Your article content will appear here…
              </p>
            )}
          </div>
          {/* Right column: quote + media */}
          <div className={getRightColumnClasses(layoutConfig)}>
            {/* Quote */}
            {settings.includeQuote && content.quote && (
              <div className={getPullQuoteClasses(layoutConfig)}>
                <p className="font-serif italic text-xl md:text-2xl leading-snug text-es-text">
                  <span className="align-top text-3xl md:text-4xl text-es-text">“</span>
                  <span className="ml-1">{content.quote}</span>
                  <span className="align-bottom text-3xl md:text-4xl text-es-text">”</span>
                </p>
                {content.quoteAttribution && (
                  <p className="mt-2 text-xs uppercase tracking-wide text-es-textSoft/80">
                    — {content.quoteAttribution}
                  </p>
                )}
              </div>
            )}
            {/* Image / video block */}
            {settings.includeImage &&
              (content.imagePreview || content.featuredImageUrl || content.videoUrl || content.rawEmbedHtml) && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  {content.rawEmbedHtml ? (
                    <RawHtmlEmbed html={content.rawEmbedHtml} className="h-full w-full" />
                  ) : content.videoUrl ? (
                    <video
                      controls
                      src={content.videoUrl}
                      className="h-full w-full"
                      title={content.headline || "Embedded video"}
                    />
                  ) : (
                    <SmartImage
                      src={content.imagePreview || content.featuredImageUrl}
                      alt={content.headline || "Article image"}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  )}
                </div>
              )}
            {/* External embed block */}
            {content.externalEmbedHtml && (
              <ExternalEmbedCard
                html={content.externalEmbedHtml}
                title={content.externalEmbedTitle}
              />
            )}
          </div>
        </div>

        <EditorialFooter />
      </div>
    </div>
  );
}
