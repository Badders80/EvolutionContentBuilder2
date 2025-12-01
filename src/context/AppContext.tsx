import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  type ContentData,
  type AppSettings,
  type TemplateType,
  initialContent,
  initialSettings,
} from '../types';

interface AppContextType {
  content: ContentData;
  settings: AppSettings;
  isGenerated: boolean;
  activeTemplate: TemplateType;
  sidebarOpen: boolean;
  updateContent: (updates: Partial<ContentData>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  setIsGenerated: (value: boolean) => void;
  setActiveTemplate: (template: TemplateType) => void;
  setSidebarOpen: (open: boolean) => void;
  resetContent: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData>(initialContent);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('visual');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const updateContent = useCallback((updates: Partial<ContentData>) => {
    setContent(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetContent = useCallback(() => {
    setContent(initialContent);
    setIsGenerated(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        content,
        settings,
        isGenerated,
        activeTemplate,
        sidebarOpen,
        updateContent,
        updateSettings,
        setIsGenerated,
        setActiveTemplate,
        setSidebarOpen,
        resetContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
