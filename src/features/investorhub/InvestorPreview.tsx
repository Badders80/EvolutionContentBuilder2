import EvolutionWatermark from "../../assets/Evolution-Watermark-Black.svg";
import EvolutionWatermarkOneLine from "../../assets/Evolution-Watermark-OneLine-Black.svg";
// Card class for pull-quote
const quoteCardClass = "bg-white rounded-xl p-6 shadow-sm";
// Evolution Gold color token

// Social/action icons (SVGs for demo)
const HouseIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} style={style} aria-hidden="true"><path d="M3 9.5L10 4l7 5.5V17a1 1 0 01-1 1h-3v-4H7v4H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
);
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5"/></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="15" cy="5" r="1" fill="currentColor"/></svg>
);
const MailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true"><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 5l7 6 7-6" stroke="currentColor" strokeWidth="1.5"/></svg>
);
import { useState } from "react";
import type { ContentDocument } from "../../types/content";

export interface PreviewMedia {
  src: string;
  alt?: string;
}

interface InvestorPreviewProps {
  doc: ContentDocument;
  media?: PreviewMedia;
}

const CONTENT_LABELS: Record<string, string> = {
  race_preview: "PRE-RACE UPDATE",
  post_race: "POST-RACE REPORT",
  investor_report: "INVESTOR UPDATE",
  trainer_update: "TRAINER UPDATE"
};

export function InvestorPreview({ doc, media }: InvestorPreviewProps) {
  const [darkHero, setDarkHero] = useState(false);

  // Attribution logic
  let attribution = "Evolution Stables Trainer";
  if (doc.trainer_name) {
    attribution = `— ${doc.trainer_name}, Trainer`;
  }

  // Header styles
  const headerClass = darkHero
    ? "w-full border-b border-neutral-800 bg-neutral-950 text-neutral-50 px-6 py-4 flex items-center justify-between"
    : "w-full border-b border-neutral-200 bg-white text-neutral-900 px-6 py-4 flex items-center justify-between";

  // Hero styles
  const heroHeadlineClass = darkHero
    ? "text-3xl md:text-5xl font-semibold leading-tight text-neutral-50"
    : "text-3xl md:text-5xl font-semibold leading-tight text-neutral-900";
  const heroSubClass = darkHero
    ? "mt-4 text-base md:text-lg leading-relaxed text-neutral-300"
    : "mt-4 text-base md:text-lg leading-relaxed text-neutral-600";

  // Footer styles (removed unused variable)



  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Dark hero toggle */}
      <div className="flex justify-end px-6 pt-4">
        <button
          type="button"
          className={`px-3 py-1 rounded border text-xs font-medium ${darkHero ? "bg-neutral-900 text-neutral-50 border-neutral-700" : "bg-white text-neutral-900 border-neutral-300"}`}
          onClick={() => setDarkHero(v => !v)}
        >
          {darkHero ? "Light hero" : "Dark hero"}
        </button>
      </div>
      {/* Header bar */}
      <header className={headerClass}>
        <div className="flex items-center gap-3">
          <img
            src={EvolutionWatermark}
            alt="Evolution Stables"
            className="h-6 w-auto"
          />
        </div>
        <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500">
          {CONTENT_LABELS[doc.content_type] || "UPDATE"}
        </span>
      </header>
      {/* Hero + grid */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-10 grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        {/* Left: hero text + body */}
        <div>
          <h1 className={heroHeadlineClass}>{doc.headline}</h1>
          {doc.subheading && <div className={heroSubClass}>{doc.subheading}</div>}
          {/* Mobile: pull-quote below hero */}
          <div className="md:hidden mt-8">
            {doc.body_highlights && doc.body_highlights.length > 0 && (
              <div className={quoteCardClass}>
                <div className="text-lg md:text-xl italic leading-relaxed text-neutral-800">{doc.body_highlights[0]}</div>
                <div className="mt-4 text-[11px] tracking-[0.18em] uppercase text-neutral-500">{attribution}</div>
              </div>
            )}
          </div>
          {/* Body text */}
          <section className="max-w-3xl mx-auto px-0 mt-10 space-y-5 text-neutral-800 leading-relaxed">
            <p className="text-base leading-7">{doc.body_intro}</p>
            <p className="text-base leading-7">{doc.body_details}</p>
            {doc.body_highlights && doc.body_highlights.length > 1 && (
              <ul className="list-disc pl-5 mt-4 space-y-1">
                {doc.body_highlights.slice(1).map((h, idx) => <li key={idx}>{h}</li>)}
              </ul>
            )}
          </section>
        </div>
        {/* Right: pull-quote + media */}
        <div className="hidden md:flex flex-col gap-8">
          {doc.body_highlights && doc.body_highlights.length > 0 && (
            <div className={quoteCardClass}>
              <div className="text-lg md:text-xl italic leading-relaxed text-neutral-800">{doc.body_highlights[0]}</div>
              <div className="mt-4 text-[11px] tracking-[0.18em] uppercase text-neutral-500">{attribution}</div>
            </div>
          )}
          {media && (
            <div className="mt-10 md:mt-0 md:self-start">
              <div className="w-full max-w-xs md:max-w-sm lg:max-w-md aspect-[9/16] overflow-hidden rounded-xl bg-neutral-900">
                <img
                  src={media.src}
                  alt={media.alt ?? doc.horse_name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Media card for mobile */}
      {media && (
        <div className="md:hidden max-w-3xl mx-auto px-6 mt-10">
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-neutral-900">
            <img src={media.src} alt={media.alt || "Media"} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      {/* Footer band (only for darkHero) */}
      {darkHero && (
        <div className="w-full rounded-xl bg-neutral-950 px-6 py-5 flex items-center justify-between mt-12">
          <img
            src={EvolutionWatermarkOneLine}
            alt="Evolution Stables"
            className="h-5 w-auto opacity-80"
          />
          <div className="flex items-center gap-4 text-neutral-600">
            <button className="text-ownership-gold hover:text-ownership-gold" aria-label="Evolution Stables"><HouseIcon className="h-5 w-5" /></button>
            <button className="hover:text-ownership-gold" aria-label="X"><XIcon className="h-5 w-5" /></button>
            <button className="hover:text-ownership-gold" aria-label="Instagram"><InstagramIcon className="h-5 w-5" /></button>
            <button className="hover:text-ownership-gold" aria-label="LinkedIn"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 8.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><path d="M9.5 10.5c0-1 1-2 2.5-2s2.5 1 2.5 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
            <button className="hover:text-ownership-gold" aria-label="Email"><MailIcon className="h-5 w-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
