import { useAppContext } from '../../../context/AppContext';

const modeLabels: Record<string, string> = {
  'pre-race': 'PRE-RACE PREVIEW',
  'post-race': 'POST-RACE REPORT',
  'trainer': 'TRAINER PROFILE',
  'investor': 'INVESTOR UPDATE',
  'social': 'SOCIAL FEATURE',
};

export function EditorialHeader() {
  const { settings } = useAppContext();
  const label = modeLabels[settings.mode] || 'EDITORIAL';

  return (
    <header className="w-full pb-3 mb-8 border-b-2 border-black flex items-baseline justify-between">
      <div className="flex items-center">
        <h1 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-tight text-black">
          EVOLUTION STABLES
        </h1>
      </div>
      <div className="font-sans tracking-[0.18em] text-[0.7rem] uppercase text-black font-bold">
        {label}
      </div>
    </header>
  );
}
