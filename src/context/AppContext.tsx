import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { AIMessage, SavedBuild, SectionId, StructuredFields, AppSettings, AssistantTargetField } from "../types";
import { EMPTY_STRUCTURED, initialSettings } from "../types";

const STORAGE_KEY_SAVED_BUILDS = "ecb2_saved_builds";

export interface AppContextValue {
  section: SectionId;
  setSection: (section: SectionId) => void;

  currentModel: string;
  setCurrentModel: (model: string) => void;

  messages: AIMessage[];
  setMessages: Dispatch<SetStateAction<AIMessage[]>>;
  appendMessage: (msg: Omit<AIMessage, "id" | "createdAt">) => void;
  clearMessages: () => void;

  structured: StructuredFields;
  setStructured: (s: StructuredFields) => void;
  updateStructuredField: (field: keyof StructuredFields, value: string) => void;

  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  targetField: AssistantTargetField;
  setTargetField: (field: AssistantTargetField) => void;

  savedBuilds: SavedBuild[];
  saveCurrentBuild: (name?: string) => void;
  duplicateBuild: (id: string) => void;
  loadBuild: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppendLogInput = {
  role: AIMessage["role"];
  content: string;
  createdAt?: number;
};

type UpdateStructuredInput = Partial<StructuredFields>;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [section, setSection] = useState<SectionId>("create");
  const [currentModel, setCurrentModel] = useState<string>("gemini-3.0-pro");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [structured, setStructured] = useState<StructuredFields>(EMPTY_STRUCTURED);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [targetField, setTargetField] = useState<AssistantTargetField>("auto");
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_SAVED_BUILDS);
      if (raw) {
        const parsed: SavedBuild[] = JSON.parse(raw);
        setSavedBuilds(parsed);
      }
    } catch (err) {
      console.error("Failed to load saved builds", err);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_SAVED_BUILDS, JSON.stringify(savedBuilds));
    } catch (err) {
      console.error("Failed to persist saved builds", err);
    }
  }, [savedBuilds]);

  const appendMessage = (msg: Omit<AIMessage, "id" | "createdAt">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      },
    ]);
  };

  const clearMessages = () => setMessages([]);

  const appendAILog = (msg: AppendLogInput) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt ?? Date.now(),
      },
    ]);
  };

  const updateStructuredField = (field: keyof StructuredFields, value: string) => {
    setStructured((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateStructuredFields = (fields: UpdateStructuredInput) => {
    setStructured((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const saveCurrentBuild = (name?: string) => {
    const effectiveName =
      name?.trim() ||
      (structured.headline ? structured.headline.slice(0, 80) : "Untitled Build");

    setSavedBuilds((prev) => {
      const existingIndex = prev.findIndex((b) => b.name === effectiveName);
      const now = Date.now();

      if (existingIndex >= 0) {
        const updated: SavedBuild = {
          ...prev[existingIndex],
          updatedAt: now,
          messages,
          structured,
          model: currentModel,
        };
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      }

      const newBuild: SavedBuild = {
        id: crypto.randomUUID(),
        name: effectiveName,
        createdAt: now,
        updatedAt: now,
        section,
        model: currentModel,
        messages,
        structured,
      };
      return [newBuild, ...prev];
    });
  };

  const duplicateBuild = (id: string) => {
    setSavedBuilds((prev) => {
      const build = prev.find((b) => b.id === id);
      if (!build) return prev;
      const now = Date.now();
      const copy: SavedBuild = {
        ...build,
        id: crypto.randomUUID(),
        name: `${build.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      return [copy, ...prev];
    });
  };

  const loadBuild = (id: string) => {
    const build = savedBuilds.find((b) => b.id === id);
    if (!build) return;

    const migratedStructured: StructuredFields = {
      ...EMPTY_STRUCTURED,
      ...build.structured,
      quoteAttribution:
        (build.structured as any).quoteAttribution ??
        (build.structured as any).attribution ??
        EMPTY_STRUCTURED.quoteAttribution,
      featuredImageUrl:
        (build.structured as any).featuredImageUrl ??
        (build.structured as any).featuredImage ??
        EMPTY_STRUCTURED.featuredImageUrl,
    };

    setSection("create");
    setCurrentModel(build.model);
    setMessages(build.messages);
    setStructured(migratedStructured);
  };

  const value: AppContextValue = useMemo(
    () => ({
      section,
      setSection,
      currentModel,
      setCurrentModel,
      messages,
      setMessages,
      appendMessage,
      clearMessages,
      structured,
      setStructured,
      updateStructuredField,
      settings,
      updateSettings,
      targetField,
      setTargetField,
      savedBuilds,
      saveCurrentBuild,
      duplicateBuild,
      loadBuild,
    }),
    [section, currentModel, messages, structured, settings, targetField, savedBuilds]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
};

