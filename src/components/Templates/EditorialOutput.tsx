import { EditorialHeader } from "../layout/Header";
import { EditorialFooter } from "../layout/Footer";
import { SmartImage } from "../SmartImage";
import { useAppContext } from "../../context/AppContext";

export function EditorialOutput() {
  const { structured: content, settings, setTargetField } = useAppContext();

  const paragraphs = (content.body ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-es-bg text-es-text">
      <div className="mx-auto max-w-[800px] px-6 py-10 md:py-12">
        <EditorialHeader />

        <div className="grid gap-10 md:grid-cols-2">
          {/* Left column: body */}
          <div
            className="editorial-body cursor-pointer space-y-4 text-sm leading-relaxed md:text-base"
            onClick={() => setTargetField("body")}
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
            ) : (
              <p className="text-es-textSoft">
                Your article content will appear here…
              </p>
            )}
          </div>

          {/* Right column: quote + media */}
          <div className="space-y-8">
            {/* Quote */}
            {settings.includeQuote && content.quote && (
              <div
                className="cursor-pointer text-center"
                onClick={() => setTargetField("quote")}
              >
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

            {/* Image / video / raw embed */}
            {settings.includeImage &&
              (content.featuredImageUrl ||
                content.imagePreview ||
                content.videoUrl ||
                content.rawEmbedHtml) && (
                <div className="my-8 md:my-10">
                  <div className="mx-auto w-full max-w-md md:max-w-lg">
                    {content.imagePreview || content.featuredImageUrl ? (
                      <SmartImage
                        src={content.imagePreview || content.featuredImageUrl}
                        alt={content.caption ?? content.headline ?? ""}
                        className="w-full rounded-lg object-cover"
                      />
                    ) : null}

                    {content.videoUrl &&
                      !content.imagePreview &&
                      !content.featuredImageUrl && (
                        <div className="mt-4 w-full overflow-hidden rounded-lg aspect-video">
                          <iframe
                            src={content.videoUrl}
                            className="h-full w-full"
                            title={content.headline || "Embedded video"}
                            allowFullScreen
                          />
                        </div>
                      )}

                    {content.rawEmbedHtml &&
                      !content.imagePreview &&
                      !content.featuredImageUrl &&
                      !content.videoUrl && (
                        <div
                          className="mt-4 w-full overflow-hidden rounded-lg aspect-[4/3]"
                          dangerouslySetInnerHTML={{
                            __html: content.rawEmbedHtml,
                          }}
                        />
                      )}
                  </div>
                </div>
              )}
          </div>
        </div>

        <EditorialFooter />
      </div>
    </div>
  );
}
