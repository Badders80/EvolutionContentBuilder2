import type { ContentData } from "../../../types";
import { useAppContext } from '../../../context/AppContext';

const modeLabels: Record<string, string> = {
  'pre-race': 'PRE-RACE PREVIEW',
  'post-race': 'POST-RACE REPORT',
  'trainer': 'TRAINER PROFILE',
  'investor': 'INVESTOR UPDATE',
  'social': 'SOCIAL FEATURE',
};

type HeaderVariant = 'dark' | 'light';

export function EditorialHeader({ content, variant = 'dark' }: { content: ContentData; variant?: HeaderVariant }) {
  const { settings } = useAppContext();
  const label = modeLabels[settings.mode] || 'EDITORIAL';
  const isDark = variant === 'dark';
  const containerClasses = isDark
    ? 'mb-8 rounded-md bg-es-text px-4 py-4 text-es-bg'
    : 'mb-6 pb-3 flex items-baseline justify-between border-b-2 border-black';
  const textColor = isDark ? 'text-es-bg' : 'text-black';
  const subTextColor = isDark ? 'text-es-textSoft' : 'text-es-text';

  return (
    <header className={containerClasses}>
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          {content.horseName ? (
            <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-es-bg/80' : 'text-black/70'}`}>
              {content.horseName}
            </p>
          ) : null}
          <h1 className={`editorial-headline font-serif text-3xl md:text-4xl ${textColor}`}>
            {content.headline || 'Your Headline Here'}
          </h1>
          {content.subheadline ? (
            <p className={`editorial-subheadline font-serif text-xl md:text-2xl ${subTextColor}`}>
              {content.subheadline}
            </p>
          ) : null}
        </div>
        <div className={`flex flex-col items-end gap-1 text-xs ${isDark ? 'text-es-textSoft' : 'text-es-text'}`}>
          <span className="tracking-[0.18em] uppercase font-semibold">{label}</span>
        </div>
      </div>
    </header>
  );
}
