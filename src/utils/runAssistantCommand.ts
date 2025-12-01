import { useAppStore } from '../store/useAppStore';
import { useAssistantStore } from '../store/useAssistantStore';

export async function runAssistantCommand() {
  const content = useAppStore.getState().content;
  const updateContent = useAppStore.getState().updateContent;

  const { query, targetField, addMessage, setLoading, setQuery } =
    useAssistantStore.getState();

  const trimmed = query.trim();
  if (!trimmed) return;

  // Handle confirmation replies for pending updates
  if (trimmed.toLowerCase() === 'yes') {
    const pending = (window as any).__pendingAssistantUpdate as
      | { field: string; value: string }
      | undefined;

    if (pending) {
      updateContent({ [pending.field]: pending.value } as any);

      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `${pending.field} updated.`,
      });

      (window as any).__pendingAssistantUpdate = null;
    }

    setQuery('');
    setLoading(false);
    return;
  }

  if (trimmed.toLowerCase() === 'no') {
    (window as any).__pendingAssistantUpdate = null;

    addMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Okay — no changes applied.',
    });

    setQuery('');
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch('/api/seek', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        content,
        targetField,
      }),
    });

    const data = await res.json();

    // Show assistant's natural language response
    if (data?.response) {
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
      });
    }

    // If a specific field is targeted and we have an updated value,
    // ask for explicit confirmation before applying.
    if (targetField && data?.updatedValue) {
      useAssistantStore.getState().addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I’ve prepared an updated version of your ${targetField}.
Would you like me to apply it?

Preview:

${data.updatedValue}

Reply "yes" to confirm or "no" to cancel.`,
      });

      (window as any).__pendingAssistantUpdate = {
        field: targetField,
        value: data.updatedValue as string,
      };
    }
  } catch (err) {
    addMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Error: Unable to contact Gemini service.',
    });
  }

  setQuery('');
  setLoading(false);
}
