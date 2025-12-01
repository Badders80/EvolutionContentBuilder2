import { useAppContext } from '../../context/AppContext';

const fields = [
  { id: 'headline', label: 'Headline' },
  { id: 'subheadline', label: 'Subheadline' },
  { id: 'body', label: 'Body Text' },
  { id: 'quote', label: 'Quote' },
] as const;

export function AssistantFieldChips() {
  const { targetField, setTargetField } = useAppContext();

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {fields.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setTargetField(f.id)}
          className={`px-3 py-1 rounded-full border text-xs transition-colors ${
            targetField === f.id
              ? 'bg-black text-white border-black'
              : 'border-es-border text-es-muted hover:border-black'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
