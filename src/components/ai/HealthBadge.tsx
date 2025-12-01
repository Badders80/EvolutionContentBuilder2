import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const HealthBadge: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_KEY;
      if (!apiKey) {
        setStatus('error');
        setErrorMsg('No API Key');
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use flash for a quick, reliable health check
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Minimal generation to test connection
        await model.generateContent("ping");
        setStatus('connected');
      } catch (err: any) {
        console.error("Gemini Health Check Failed:", err);
        setStatus('error');
        // Make error message more visible in tooltip
        setErrorMsg(`${err.name}: ${err.message}`);
      }
    };

    checkHealth();
  }, []);

  if (status === 'checking') return <div className="text-[10px] text-slate-500">Checking AI...</div>;
  
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-[10px] text-red-400" title={errorMsg}>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span>Gemini Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[10px] text-emerald-400">
      <div className="w-2 h-2 rounded-full bg-emerald-500" />
      <span>Gemini Connected</span>
    </div>
  );
};
