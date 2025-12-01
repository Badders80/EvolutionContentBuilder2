import { useAppStore } from '../../../store/useAppStore';
import WatermarkFull from '../../../assets/Evolution-Watermark-Black.svg';
import WatermarkOneLine from '../../../assets/Evolution-Watermark-OneLine-Black.svg';

const modeLabels: Record<string, string> = {
  'pre-race': 'PRE-RACE PREVIEW',
  'post-race': 'POST-RACE REPORT',
  'trainer': 'TRAINER PROFILE',
  'investor': 'INVESTOR UPDATE',
  'social': 'SOCIAL FEATURE',
};

export function EditorialHeader() {
  const settings = useAppStore((s) => s.settings);
  const label = modeLabels[settings.mode] || 'EDITORIAL';

  const logoSrc = settings.devicePreview === 'mobile' ? WatermarkFull : WatermarkOneLine;

  return (
    <header className="w-full pb-3 mb-8 flex items-baseline justify-between">
      <div className="flex items-center">
        <img src={logoSrc} alt="Evolution Stables" className="h-6" />
      </div>
      <div className="font-sans tracking-[0.18em] text-[0.7rem] uppercase text-es-textSoft font-normal">
        {label}
      </div>
    </header>
  );
}
