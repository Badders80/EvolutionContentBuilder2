import { useAppContext } from '../../../context/AppContext';

const modeLabels: Record<string, string> = {
  'pre-race': 'PRE-RACE PREVIEW',
  'post-race': 'POST-RACE REPORT',
  'trainer': 'TRAINER PROFILE',
  'investor': 'INVESTOR UPDATE',
  'social': 'SOCIAL FEATURE',
};

type Variant = 'default' | 'inverse';

export function EditorialHeader({ variant = 'default' }: { variant?: Variant }) {
  const { settings } = useAppContext();
  const label = modeLabels[settings.mode] || 'EDITORIAL';
  const isInverse = variant === 'inverse';
  const textColor = isInverse ? 'text-es-bg' : 'text-black';
  const borderClass = isInverse ? '' : 'border-b-2 border-black';

  return (
    <header className={`w-full pb-3 mb-8 flex items-baseline justify-between ${borderClass}`}>
      <div className="flex items-center">
        <h1 className={`font-sans font-bold text-xl md:text-2xl uppercase tracking-tight ${textColor}`}>
          EVOLUTION STABLES
        </h1>
      </div>
      <div className={`font-sans tracking-[0.18em] text-[0.7rem] uppercase font-bold ${textColor}`}>
        {label}
      </div>
    </header>
  );
}
