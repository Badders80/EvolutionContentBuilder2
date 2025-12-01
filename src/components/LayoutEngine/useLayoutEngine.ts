import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { determineTemplate, countWords } from './layoutRules';

export interface LayoutEngineResult {
  wordCount: number;
  templateName: string;
}

/**
 * Hook that monitors content inputs and applies layout rules
 * Updates the active template based on content and settings
 */
export function useLayoutEngine(): LayoutEngineResult {
  const { content, settings, isGenerated, setActiveTemplate, activeTemplate } = useApp();

  // Monitor body content and update template when generated
  useEffect(() => {
    if (isGenerated) {
      const newTemplate = determineTemplate(content.body, settings.layoutType);
      if (newTemplate !== activeTemplate) {
        setActiveTemplate(newTemplate);
      }
    }
  }, [content.body, settings.layoutType, isGenerated, setActiveTemplate, activeTemplate]);

  const wordCount = countWords(content.body);

  const templateNames: Record<string, string> = {
    visual: 'Visual',
    editorial: 'Editorial',
    longform: 'Longform',
  };

  return {
    wordCount,
    templateName: templateNames[activeTemplate] || 'Visual',
  };
}
