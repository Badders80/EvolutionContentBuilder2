import { useRef } from 'react';
import { Menu } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Editor } from './components/Editor/Editor';
import { OutputPanel } from './components/OutputPanel/OutputPanel';
import { determineTemplate } from './components/LayoutEngine/layoutRules';
import { exportToPDF } from './utils/exportToPDF';
import { exportToHTMLFull, exportToHTMLSlim } from './utils/exportToHTML';
import type { GeminiContentResult } from './hooks/useGemini';

function AppContent() {
  const { 
    content, 
    settings, 
    updateContent,
    setIsGenerated, 
    setActiveTemplate, 
    sidebarOpen, 
    setSidebarOpen 
  } = useApp();
  
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    const template = determineTemplate(content.body, settings.layoutType);
    setActiveTemplate(template);
    setIsGenerated(true);
  };

  const handleExportPDF = async () => {
    await exportToPDF(outputRef.current, 'evolution-magazine');
  };

  const handleExportHTMLFull = () => {
    exportToHTMLFull(outputRef.current, 'evolution-magazine-full');
  };

  const handleExportHTMLSlim = () => {
    exportToHTMLSlim(outputRef.current, 'evolution-magazine-slim');
  };

  // Auto-fill editor fields from Gemini AI response
  const handleGeminiFill = (result: GeminiContentResult) => {
    updateContent({
      headline: result.headline,
      subheadline: result.subheadline,
      body: result.body,
      quote: result.quote,
      quoteAttribution: result.attribution,
    });
    // Auto-generate preview after filling
    const template = determineTemplate(result.body, settings.layoutType);
    setActiveTemplate(template);
    setIsGenerated(true);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-amber-400">Evolution</h1>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Sidebar */}
      <Sidebar
        onGenerate={handleGenerate}
        onExportPDF={handleExportPDF}
        onExportHTMLFull={handleExportHTMLFull}
        onExportHTMLSlim={handleExportHTMLSlim}
        onGeminiFill={handleGeminiFill}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Editor Panel */}
        <Editor />
        
        {/* Output Panel */}
        <OutputPanel ref={outputRef} onGenerate={handleGenerate} />
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
