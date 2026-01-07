
import { useState, useEffect } from 'react';
import { AppView, ScanReport } from './types';
import { MOCK_REPORTS, SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from './constants';
import { Layout } from './components/Layout';
import { InputScreen } from './components/InputScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportScreen } from './components/ReportScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { GoogleGenAI } from "@google/genai";

// Fix: Define AIStudio interface and extend global Window to resolve "AIStudio" type mismatch and modifier conflict.
declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    readonly aistudio: AIStudio;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('input');
  const [selectedReport, setSelectedReport] = useState<ScanReport | null>(null);
  const [history, setHistory] = useState<ScanReport[]>(historyFromStorage() || MOCK_REPORTS);
  const [isScanning, setIsScanning] = useState(false);
  const [pendingReport, setPendingReport] = useState<ScanReport | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [needsKeySelection, setNeedsKeySelection] = useState(false);

  function historyFromStorage(): ScanReport[] | null {
    try {
      const saved = localStorage.getItem('risk_history');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }

  useEffect(() => {
    localStorage.setItem('risk_history', JSON.stringify(history));
  }, [history]);

  // Check for required key selection on upgraded/paid tiers
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setNeedsKeySelection(!hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setNeedsKeySelection(false);
      // Proceeding directly after selection to mitigate race conditions
    }
  };

  /**
   * Performs the forensic diagnostic scan using Gemini 3 Pro reasoning.
   */
  const startScan = async (description: string, retryCount = 0) => {
    setApiError(null);
    if (retryCount === 0) {
      setIsScanning(true);
      setCurrentView('loading');
    }
    setPendingReport(null);

    try {
      // Create a fresh instance for every call to ensure latest API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: `Diagnostic Request: Audit the following workflow for invisible risks. 
        Execute all 5 internal analysis phases. 
        Focus on negative-space reasoning and second-order behavioral shifts. 
        
        Workflow Description:
        ${description}` }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          thinkingConfig: { thinkingBudget: 24000 },
        },
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("Reasoning engine returned an empty response. This is likely a safety filter block or a billing/quota restriction.");
      }

      // Robust JSON cleaning to handle any potential markdown wrapping
      const jsonString = textOutput.replace(/```json\n?|\n?```/g, '').trim();
      let result;
      try {
        result = JSON.parse(jsonString);
      } catch (e) {
        throw new Error("The engine produced a malformed response that could not be parsed as diagnostic data.");
      }
      
      const totalFindings = Object.values(result.sections || {}).flat().length;
      
      // Auto-retry once if results are non-existent despite request
      if (retryCount < 1 && totalFindings === 0 && description.length > 50) {
        return startScan(`${description}\n\nRETRY: Provide at least 3 critical findings.`, retryCount + 1);
      }

      const newReport: ScanReport = {
        ...result,
        id: `LIVE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        timestamp: new Date().toLocaleString(),
        originalInput: description,
        name: result.name || "Live Forensic Diagnostic"
      };

      setPendingReport(newReport);
    } catch (error: any) {
      const errorMessage = error?.message || "Internal Connection Error";
      console.error("Diagnostic Engine Failure:", error);
      
      // Handle "Entity not found" error by prompting for key re-selection
      if (errorMessage.includes("Requested entity was not found")) {
        setNeedsKeySelection(true);
      }

      if (retryCount < 1) {
        return startScan(description, retryCount + 1);
      }
      
      setApiError(errorMessage);
      
      // Simulation Fallback with explicit error injection for debugging
      setTimeout(() => {
        setPendingReport({
          ...MOCK_REPORTS[0],
          id: `SIM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          timestamp: new Date().toLocaleString(),
          originalInput: description,
          name: `Simulation Mode (Error: ${errorMessage.substring(0, 30)}...)`
        });
      }, 1000);
    } finally {
      setIsScanning(false);
    }
  };

  const finalizeScan = () => {
    if (pendingReport) {
      setSelectedReport(pendingReport);
      if (!pendingReport.id.startsWith('SIM-')) {
        setHistory(prev => [pendingReport, ...prev]);
      }
      setCurrentView('report');
      setPendingReport(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'input':
        return (
          <div className="relative">
            {needsKeySelection && (
              <div className="max-w-4xl mx-auto mt-8 bg-indigo-900 text-white rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-indigo-400">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Upgraded API Access Detected</h3>
                  <p className="text-indigo-200 text-sm font-medium">Please select your paid API key to enable High-Fidelity reasoning. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline font-bold text-white">Learn about billing</a></p>
                </div>
                <button 
                  onClick={handleOpenKeyDialog}
                  className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-black hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap"
                >
                  Select API Key
                </button>
              </div>
            )}
            <InputScreen 
              onStartScan={(d) => startScan(d)} 
              onViewExample={() => { setSelectedReport(MOCK_REPORTS[0]); setCurrentView('report'); }} 
              lastError={apiError}
            />
          </div>
        );
      case 'loading':
        return <LoadingScreen isDataReady={!!pendingReport} onComplete={finalizeScan} isError={!!apiError} />; 
      case 'report':
        return selectedReport ? <ReportScreen report={selectedReport} onNewScan={() => setCurrentView('input')} /> : null;
      case 'history':
        return <HistoryScreen reports={history} onSelectReport={(r) => { setSelectedReport(r); setCurrentView('report'); }} onNewScan={() => setCurrentView('input')} />;
      default:
        return <InputScreen onStartScan={(d) => startScan(d)} onViewExample={() => { setSelectedReport(MOCK_REPORTS[0]); setCurrentView('report'); }} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}
