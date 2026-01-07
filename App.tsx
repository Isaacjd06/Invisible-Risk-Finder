
import { useState, useEffect } from 'react';
import { AppView, ScanReport } from './types';
import { MOCK_REPORTS, SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from './constants';
import { Layout } from './components/Layout';
import { InputScreen } from './components/InputScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportScreen } from './components/ReportScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { GoogleGenAI } from "@google/genai";

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
      const saved = localStorage.getItem('risk_history_v3');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }

  useEffect(() => {
    localStorage.setItem('risk_history_v3', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await aistudio.hasSelectedApiKey();
        setNeedsKeySelection(!hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.openSelectKey === 'function') {
      await aistudio.openSelectKey();
      setNeedsKeySelection(false);
    }
  };

  const startScan = async (description: string, retryCount = 0) => {
    setApiError(null);
    if (retryCount === 0) {
      setIsScanning(true);
      setCurrentView('loading');
    }
    setPendingReport(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("No API key available in process.env.API_KEY");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { 
          parts: [{ 
            text: `INITIATE MULTI-PASS DEEP FORENSIC RESEARCH:
            
            WORKFLOW SOURCE:
            "${description}"
            
            DIRECTIVE:
            1. Perform a structural decomposition of this workflow.
            2. Conduct 1,000 internal simulations of potential race conditions, ownership voids, and information decay.
            3. Research unstated processes that MUST exist for this workflow to operate (e.g. if invoices are mentioned, audit the unstated reconciliation process).
            4. Provide a high-density forensic report with AT LEAST ONE high-relevance, critical risk per category (7 categories total).
            5. Ensure the findings represent deep structural insights that an average LLM would miss.
            6. Propose an advanced AI/Automation toolset to solve these specific mechanisms.` 
          }] 
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          maxOutputTokens: 20000,
          thinkingConfig: { thinkingBudget: 32768 },
        },
      });

      const textOutput = response.text;
      if (!textOutput) throw new Error("Empty response from research engine.");

      const jsonString = textOutput.replace(/```json\n?|\n?```/g, '').trim();
      let result = JSON.parse(jsonString);
      
      const newReport: ScanReport = {
        ...result,
        id: `LIVE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        timestamp: new Date().toLocaleString(),
        originalInput: description,
        name: result.name || "Workflow Structural Audit"
      };

      setPendingReport(newReport);
    } catch (error: any) {
      const errorMessage = error?.message || "Research Engine Connection Timeout";
      setApiError(errorMessage);
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const finalizeScan = () => {
    if (pendingReport) {
      setSelectedReport(pendingReport);
      setHistory(prev => [pendingReport, ...prev]);
      setCurrentView('report');
      setPendingReport(null);
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'input' && (
        <InputScreen 
          onStartScan={(d) => startScan(d)} 
          onViewExample={() => { setSelectedReport(MOCK_REPORTS[0]); setCurrentView('report'); }} 
          lastError={apiError}
        />
      )}
      {currentView === 'loading' && (
        <LoadingScreen isDataReady={!!pendingReport} onComplete={finalizeScan} isError={!!apiError} />
      )}
      {currentView === 'report' && selectedReport && (
        <ReportScreen report={selectedReport} onNewScan={() => setCurrentView('input')} />
      )}
      {currentView === 'history' && (
        <HistoryScreen reports={history} onSelectReport={(r) => { setSelectedReport(r); setCurrentView('report'); }} onNewScan={() => setCurrentView('input')} />
      )}
    </Layout>
  );
}
