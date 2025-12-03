type ContentMode = 'pre-race' | 'post-race' | 'trainer' | 'investor' | 'social';

export type LayoutType = 'auto' | 'visual' | 'editorial' | 'longform';

export type TemplateType = 'visual' | 'editorial' | 'longform';

type DevicePreview = 'desktop' | 'tablet' | 'mobile';

export type AssistantTargetField =
  | "headline"
  | "subheadline"
  | "body"
  | "quote"
  | "quoteAttribution"
  | "auto";

export interface ContentData {
  headline: string;
  subheadline: string;
  body: string;
  quote: string;
  quoteAttribution: string;
  featuredImageUrl: string;
  footer: string;
  imageFile: File | null;
  imagePreview: string | null;
  caption: string;
  videoUrl: string;
  rawEmbedHtml: string;
  horseName: string;
  raceLocation: string;
  externalEmbedHtml?: string;
  externalEmbedTitle?: string;
}

export type StructuredFields = ContentData;

export interface AppSettings {
  mode: ContentMode;
  includeQuote: boolean;
  includeImage: boolean;
  layoutType: LayoutType;
  devicePreview: DevicePreview;
}

export const initialContent: ContentData = {
  headline: '',
  subheadline: '',
  body: '',
  quote: '',
  quoteAttribution: '',
  featuredImageUrl: '',
  footer: '',
  imageFile: null,
  imagePreview: null,
  caption: '',
  videoUrl: '',
  rawEmbedHtml: '',
  horseName: '',
  raceLocation: '',
};

export const initialSettings: AppSettings = {
  mode: 'pre-race',
  includeQuote: true,
  includeImage: true,
  layoutType: 'auto',
  devicePreview: 'desktop',
};
