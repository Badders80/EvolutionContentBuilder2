import type { TemplateType, LayoutType } from '../../types';

/**
 * Count words in a string
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Determine the template based on body word count
 * - If body < 140 words → VisualTemplate
 * - If body 140–400 → EditorialTemplate  
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

/**
 * Get template display name
 */
export function getTemplateDisplayName(template: TemplateType): string {
  const names: Record<TemplateType, string> = {
    visual: 'Visual Template',
    editorial: 'Editorial Template',
    longform: 'Longform Template',
  };
  return names[template];
}
