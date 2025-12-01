import { create } from "zustand";
import { initialContent, initialSettings } from "../types/schema";
import { determineTemplate } from "../components/LayoutEngine/layoutRules";
import type { ContentData, AppSettings } from "../types/schema";
import type { TemplateType } from "../types";

interface AppState {
  content: ContentData;
  settings: AppSettings;
  isGenerated: boolean;
  activeTemplate: TemplateType;
  sidebarOpen: boolean;

  updateContent: (u: Partial<ContentData>) => void;
  updateSettings: (u: Partial<AppSettings>) => void;
  resetContent: () => void;
  setGenerated: (val: boolean) => void;
  setActiveTemplate: (template: TemplateType) => void;
  setSidebarOpen: (open: boolean) => void;

  generateLayout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  content: initialContent,
  settings: initialSettings,
  isGenerated: false,
  activeTemplate: "editorial",
  sidebarOpen: true,

  updateContent: (updates) =>
    set((state) => ({
      content: { ...state.content, ...updates },
    })),

  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),

  resetContent: () =>
    set({
      content: initialContent,
      settings: initialSettings,
      isGenerated: false,
      activeTemplate: "editorial",
      sidebarOpen: true,
    }),

  setGenerated: (v) => set({ isGenerated: v }),

  setActiveTemplate: (template) => set({ activeTemplate: template }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  generateLayout: () => {
    const { content, settings } = get();
    const template = determineTemplate(content.body, settings.layoutType);
    set({ activeTemplate: template, isGenerated: true });
  },
}));
