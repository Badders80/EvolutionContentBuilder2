import { create } from "zustand";

export type AssistantTargetField =
  | "headline"
  | "subheadline"
  | "body"
  | "quote"
  | "quoteAttribution"
  | "auto";

export type AssistantActionType = "content" | "layout" | "code";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  actionType?: AssistantActionType;
  applied?: boolean;
}

interface AssistantState {
  query: string;
  loading: boolean;
  targetField: AssistantTargetField;
  messages: AssistantMessage[];

  // For selection-based edits
  selectionText: string | null;

  // For hybrid confirm-on-big-change
  pendingAction?: {
    description: string;
    actionType: AssistantActionType;
    diffPreview?: string;
  };

  setQuery: (v: string) => void;
  setTargetField: (f: AssistantTargetField) => void;
  setSelectionText: (text: string | null) => void;

  addMessage: (msg: AssistantMessage) => void;
  setLoading: (v: boolean) => void;
  setPendingAction: (p?: AssistantState["pendingAction"]) => void;
  markLastApplied: () => void;
  reset: () => void;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  query: "",
  loading: false,
  targetField: "auto",
  messages: [],
  selectionText: null,
  pendingAction: undefined,

  setQuery: (v) => set({ query: v }),
  setTargetField: (f) => set({ targetField: f }),
  setSelectionText: (text) => set({ selectionText: text }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  setLoading: (v) => set({ loading: v }),

  setPendingAction: (p) => set({ pendingAction: p }),

  markLastApplied: () => {
    const { messages } = get();
    if (!messages.length) return;
    const updated = [...messages];
    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      applied: true,
    };
    set({ messages: updated });
  },

  reset: () =>
    set({
      query: "",
      loading: false,
      targetField: "auto",
      messages: [],
      selectionText: null,
      pendingAction: undefined,
    }),
}));
