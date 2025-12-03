// [NEW HELPER] 1. The container that centers the entire article and controls vertical/horizontal padding
export function getArticleContainerClasses(): string {
  // mx-auto: centers the content
  // max-w-[800px]: hard width lock
  // px-6 py-10 md:py-12: vertical and horizontal padding token (editorial default)
  return "mx-auto max-w-[800px] px-6 py-10 md:py-12";
}

// [NEW HELPER] 2. The wrapper for the two-column/single-column layout
export function getArticleColumnWrapperClasses(config: LayoutConfig): string {
  const base = "gap-10";
  // Dynamically switches between single column (flex) and two-column grid
  const columns = config.twoColumn ? "grid md:grid-cols-2" : "flex flex-col";
  return `${base} ${columns}`;
}
/**
 * Returns classes for the outer body container (max width, padding, alignment).
 * Does NOT handle columns or grid.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getBodyLayoutClasses(_config: LayoutConfig): string {
  // Outer page body container only:
  // - max width (match header/footer)
  // - horizontal + vertical padding (match header/footer)
  // - alignment (centering)
  const maxWidth = "max-w-4xl";
  const padding = "px-6 md:px-8 py-10 md:py-12";
  const alignment = "mx-auto";
  return `${alignment} ${maxWidth} ${padding}`;
}
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getRightColumnClasses(_config: LayoutConfig): string {
  // right column: flex, gap, responsive spacing
  return "flex flex-col gap-6";
}

//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPullQuoteClasses(_config: LayoutConfig): string {
  // pull-quote: centered, tight, responsive
  return "cursor-pointer text-center";
}
/** Tokenised Tailwind helpers for layout areas */
export function getFooterClasses(config: LayoutConfig): string {
  // width: locked token
  const width = "w-full max-w-4xl mx-auto";
  // height: driven by footerEmphasis
  const padding =
    config.footerEmphasis === "standard"
      ? "px-6 md:px-8 py-36"
      : "px-6 md:px-8 py-27";
  return `${width} ${padding}`;
}

export function getHeaderClasses(config: LayoutConfig): string {
  // width: locked token
  const width = "w-full max-w-4xl mx-auto";
  // padding: driven by headerStyle
  let padding = "px-6 md:px-8 py-4";
  if (config.headerStyle === "compact") padding = "px-6 md:px-8 py-3";
  if (config.headerStyle === "hero") padding = "px-6 md:px-8 py-6";
  return `${width} ${padding}`;
}

//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getBodyColumnClasses(_config: LayoutConfig): string {
  // width: locked token
  return "editorial-body cursor-pointer space-y-4 text-sm leading-relaxed md:text-base";
}
// src/layout/layoutConfig.ts

import type { StructuredFields } from "../types";

export type LayoutType = "poster" | "editorial" | "longform";
export type HeaderStyle = "compact" | "standard" | "hero";
export type FooterEmphasis = "light" | "standard";
export type EmbedStyle = "fullHeightCard" | "inlineThumbnail";
export type QuotePosition = "left" | "right" | "none";
export type WatermarkStyle = "subtle" | "off";

export interface LayoutConfig {
  layoutType: LayoutType;
  twoColumn: boolean;
  headlineSpansColumns: boolean;
  quotePosition: QuotePosition;
  headerStyle: HeaderStyle;
  footerEmphasis: FooterEmphasis;
  watermarkStyle: WatermarkStyle;
  embedStyle: EmbedStyle;
}

/**
 * Suggest a default layout based on word count + presence of visual/quote.
 */
export function suggestLayout(content: StructuredFields): LayoutConfig {
  const wordCount =
    (content.body ?? "")
      .split(/\s+/)
      .filter(Boolean).length;

  const hasVisual =
    !!content.featuredImageUrl ||
    !!content.imagePreview ||
    !!content.videoUrl ||
    !!content.rawEmbedHtml;

  const hasQuote = !!content.quote;

  let layoutType: LayoutType;

  if (wordCount < 200 && (hasVisual || hasQuote)) {
    layoutType = "poster";
  } else if (wordCount > 600) {
    layoutType = "longform";
  } else {
    layoutType = "editorial";
  }

  return {
    layoutType,
    twoColumn: layoutType !== "poster",
    headlineSpansColumns: layoutType !== "poster",
    quotePosition: hasQuote ? "right" : "none",
    headerStyle: layoutType === "poster" ? "hero" : "standard",
    footerEmphasis: "light",
    watermarkStyle: "subtle",
    embedStyle: "fullHeightCard",
  };
}

/** Helper for embed card classes based on layout config. */
export function getEmbedCardClasses(config: LayoutConfig): string {
  if (config.embedStyle === "inlineThumbnail") {
    return "relative w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 p-3";
  }
  // default full height card: fixed height, no flex-1, no absolute
  return "relative w-full h-64 md:h-80 rounded-xl border border-slate-200 bg-slate-50 p-4 overflow-hidden";
}

/** Helpers for header/footer padding so all variants are centralised. */
export function headerPadding(style: HeaderStyle): string {
  switch (style) {
    case "compact":
      return "px-4 py-3";
    case "hero":
      return "px-6 py-6";
    case "standard":
    default:
      return "px-5 py-4";
  }
}

export function footerPadding(style: FooterEmphasis): string {
  switch (style) {
    case "light":
      return "px-4 py-9"; // tripled from py-3
    case "standard":
    default:
      return "px-5 py-12"; // tripled from py-4
  }
}
