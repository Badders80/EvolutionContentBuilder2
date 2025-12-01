import { useEffect } from 'react';
import { determineTemplate, countWords } from './layoutRules';
import { useAppStore } from '../../store/useAppStore';

export interface LayoutEngineResult {
  wordCount: number;
  templateName: string;
}

/**
 * Hook that monitors content inputs and applies layout rules
 * Updates the active template based on content and settings
 */
export function useLayoutEngine(): LayoutEngineResult {
  const content = useAppStore((s) => s.content);
  const settings = useAppStore((s) => s.settings);
  const isGenerated = useAppStore((s) => s.isGenerated);
  const setActiveTemplate = useAppStore((s) => s.setActiveTemplate);
  const activeTemplate = useAppStore((s) => s.activeTemplate);

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
