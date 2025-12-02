import type { TemplateType, LayoutType } from '../../types';

const countWords = (text: string): number => {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Determine the template based on body word count
 * - If body < 140 words → VisualTemplate
 * - If body 140–400 → Editorial (Output)
 * - If body > 400 → LongformTemplate
 */
export function determineTemplate(bodyText: string, layoutType: LayoutType): TemplateType {
  // If layout is manually selected, use that
  if (layoutType !== 'auto') {
    return layoutType as TemplateType;
  }

  // Auto mode: determine based on word count
  const wordCount = countWords(bodyText);

  if (wordCount < 140) {
    return 'visual';
  } else if (wordCount <= 400) {
    return 'editorial';
  } else {
    return 'longform';
  }
}
