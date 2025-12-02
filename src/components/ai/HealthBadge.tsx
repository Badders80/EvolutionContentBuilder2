import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAppContext } from '../../context/AppContext';

export const HealthBadge: React.FC = () => {
  const { setCurrentModel, currentModel } = useAppContext();
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_KEY;
      if (!apiKey) {
        setStatus('error');
        setErrorMsg('No API Key found in .env');
        return;
      }

      try {
        // 1. Fetch available models directly
        const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        
        if (!listResp.ok) {
          throw new Error(`API Error: ${listResp.status} ${listResp.statusText}`);
        }

        const listData = await listResp.json();
        const models = (listData.models || [])
          .map((m: any) => m.name.replace('models/', ''))
          .filter((n: string) => n.includes('gemini'));
        
        setAvailableModels(models);
        console.log("✅ AVAILABLE GEMINI MODELS:", models);

        // 2. If our current model isn't in the list, switch to the first available one
        if (models.length > 0 && !models.includes(currentModel)) {
          // Prefer 1.5-flash or 1.5-pro if available
          const preferred = models.find((m: string) => m.includes('1.5-flash')) || 
                            models.find((m: string) => m.includes('1.5-pro')) || 
                            models[0];
          console.log(`Switching model from ${currentModel} to ${preferred}`);
          setCurrentModel(preferred);
        }

        // 3. Test connection with the (potentially new) current model
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = models.includes(currentModel) ? currentModel : models[0];
        const model = genAI.getGenerativeModel({ model: modelName });
        
        await model.generateContent("ping");
        setStatus('connected');
      } catch (err: any) {
        console.error("Gemini Health Check Failed:", err);
        setStatus('error');
        setErrorMsg(err.message || 'Connection Failed');
      }
    };

    checkHealth();
  }, []);

  return (
    <>
      <button 
        onClick={() => setShowDebug(true)}
        className="flex items-center gap-2 text-[10px] hover:bg-slate-900 rounded px-2 py-1 transition-colors"
        title={status === 'error' ? errorMsg : `Connected to ${currentModel}`}
      >
        <div className={`w-2 h-2 rounded-full ${
          status === 'checking' ? 'bg-slate-500' :
          status === 'connected' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
        }`} />
        <span className={
          status === 'checking' ? 'text-slate-500' :
          status === 'connected' ? 'text-emerald-400' : 'text-red-400'
        }>
          {status === 'checking' ? 'Checking AI...' : 
           status === 'error' ? 'Gemini Error' : 
           `Gemini Connected (${currentModel})`}
        </span>
      </button>

      {showDebug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowDebug(false)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-slate-900">AI Diagnostics</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <div className={`text-sm ${status === 'connected' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {status === 'connected' ? 'Connected' : errorMsg}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Current Model</label>
                <div className="text-sm font-mono bg-slate-100 p-2 rounded mt-1">
                  {currentModel}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Available Models</label>
                <div className="mt-1 max-h-40 overflow-y-auto border rounded bg-slate-50">
                  {availableModels.length === 0 ? (
                    <div className="p-2 text-xs text-slate-400 italic">No models found</div>
                  ) : (
                    availableModels.map(m => (
                      <button
                        key={m}
                        onClick={() => {
                          setCurrentModel(m);
                          setStatus('checking'); // Re-check will trigger
                          setTimeout(() => window.location.reload(), 500); // Reload to force re-check
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-200 flex justify-between ${
                          currentModel === m ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {m}
                        {currentModel === m && <span>✓</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowDebug(false)}
                className="px-4 py-2 bg-slate-900 text-white text-sm rounded hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
