export type ContentMode = 'pre-race' | 'post-race' | 'trainer' | 'investor' | 'social';

export type LayoutType = 'auto' | 'visual' | 'editorial' | 'longform';

export type TemplateType = 'visual' | 'editorial' | 'longform';

export type DevicePreview = 'desktop' | 'tablet' | 'mobile';

export interface ContentData {
  headline: string;
  subheadline: string;
  body: string;
  quote: string;
  quoteAttribution: string;
  imageFile: File | null;
  imagePreview: string | null;
  imageCaption: string;
}

export interface AppSettings {
  mode: ContentMode;
  includeQuote: boolean;
  includeImage: boolean;
  layoutType: LayoutType;
  devicePreview: DevicePreview;
}

export interface AppState {
  content: ContentData;
  settings: AppSettings;
  isGenerated: boolean;
  activeTemplate: TemplateType;
}

export const initialContent: ContentData = {
  headline: '',
  subheadline: '',
  body: '',
  quote: '',
  quoteAttribution: '',
  imageFile: null,
  imagePreview: null,
  imageCaption: '',
};

export const initialSettings: AppSettings = {
  mode: 'pre-race',
  includeQuote: true,
  includeImage: true,
  layoutType: 'auto',
  devicePreview: 'desktop',
};
