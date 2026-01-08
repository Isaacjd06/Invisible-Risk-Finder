
import { useState, useEffect } from 'react';
import { AppView, ScanReport } from './types';
import { MOCK_REPORTS, SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from './constants';
import { Layout } from './components/Layout';
import { InputScreen } from './components/InputScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportScreen } from './components/ReportScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { InvalidInputScreen } from './components/InvalidInputScreen';
import { CreditsScreen } from './components/CreditsScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('input');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [isDescriptionGenerated, setIsDescriptionGenerated] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScanReport | null>(null);
  const [history, setHistory] = useState<ScanReport[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [pendingReport, setPendingReport] = useState<ScanReport | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pendingScanIsExample, setPendingScanIsExample] = useState(false);
  
  // Credits MUST start at 0 as per explicit instructions
  const [credits, setCredits] = useState(0);
  const [exampleScansUsed, setExampleScansUsed] = useState(0);
  const [hasScannedExample, setHasScannedExample] = useState(false);
  const [lastArchetypeIndex, setLastArchetypeIndex] = useState<number | null>(null);
  const MAX_EXAMPLE_SCANS = 10; 

  // Load state from storage
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('risk_auth_v4');
      if (savedAuth === 'true') {
        setIsLoggedIn(true);
      }

      const savedHistory = localStorage.getItem('risk_history_v10');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(Array.isArray(parsed) ? parsed : []);
      } else {
        setHistory(MOCK_REPORTS);
      }

      const savedCredits = localStorage.getItem('risk_credits_v10');
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      } else {
        setCredits(0);
      }

      const savedScansUsed = localStorage.getItem('risk_example_scans_v4');
      if (savedScansUsed !== null) {
        setExampleScansUsed(parseInt(savedScansUsed, 10));
      }

      const savedScannedExample = localStorage.getItem('risk_scanned_example_v5');
      if (savedScannedExample === 'true') {
        setHasScannedExample(true);
      }
    } catch (e) {
      console.warn("Storage access failed", e);
      setHistory(MOCK_REPORTS);
    }
  }, []);

  // Sync state to storage
  useEffect(() => {
    try {
      localStorage.setItem('risk_history_v10', JSON.stringify(history || []));
      localStorage.setItem('risk_credits_v10', credits.toString());
      localStorage.setItem('risk_auth_v4', isLoggedIn.toString());
      localStorage.setItem('risk_example_scans_v4', exampleScansUsed.toString());
      localStorage.setItem('risk_scanned_example_v5', hasScannedExample.toString());
    } catch (e) {
      console.warn("Storage save failed", e);
    }
  }, [history, credits, isLoggedIn, exampleScansUsed, hasScannedExample]);

  const handleLoginTrigger = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('input'); // Redirect to input after successful login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (currentView === 'history' || currentView === 'invalid-input' || currentView === 'report') {
      setCurrentView('input');
    }
  };

  const handleRestart = () => {
    setDescription(''); 
    setIsDescriptionGenerated(false);
    setCurrentView('input');
  };

  const handleClearPrompt = () => {
    setDescription('');
    setIsDescriptionGenerated(false);
  };

  const handleBackFromLoading = () => {
    setIsScanning(false);
    setApiError(null);
    setCurrentView('input');
  };

  const handleSetDescription = (val: string) => {
    // Locked if generated
    if (!isDescriptionGenerated) {
      setDescription(val);
    }
  };

  const handleSimulatedPurchase = (amount: number) => {
    setCredits(prev => prev + amount);
    setCurrentView('input');
  };

  const generateExamplePrompt = async () => {
    if (!isLoggedIn || exampleScansUsed >= MAX_EXAMPLE_SCANS) return;

    try {
      if (!process.env.API_KEY) throw new Error("API configuration missing");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const archetypes = [
        "a solo high-end residential painter who handles luxury contracts",
        "a boutique landscape design studio owner managing multiple crews",
        "a custom furniture maker building heirloom pieces with long lead times",
        "a freelance technical illustrator for major engineering firms",
        "a specialized logistics coordinator for overseas high-value art shipping",
        "a solo fractional COO for fast-growing seed-stage startups",
        "a premium event florist handling large-scale wedding installations",
        "a specialized freelance editor for high-stakes academic medical journals",
        "a small commercial cleaning agency with 15 contractors on rotation",
        "a boutique travel consultant for ultra-high-net-worth families"
      ];
      
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * archetypes.length);
      } while (newIndex === lastArchetypeIndex && archetypes.length > 1);
      
      setLastArchetypeIndex(newIndex);
      const chosen = archetypes[newIndex];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a realistic, professional, first-person workflow description for ${chosen}. 

Rules:
1. Write in natural, day-to-day language (a few short paragraphs).
2. Structural variety: Describe unique entry paths and specific stall points (unmonitored vendor delays, client paralysis, bottlenecked production).
3. Explain handoff points and where 'mental polling' occurs.
4. No tool names, checklists, or meta-commentary.`
      });

      const text = response?.text || "";
      setDescription(text.trim());
      setIsDescriptionGenerated(true);
    } catch (error) {
      console.error("Prompt generation failed", error);
      const fallbacks = [
        "I run a boutique landscape design studio. Leads come in via my website form. I spend my days visiting sites and managing three different crews. I track everything on a whiteboard in my home office, but when I'm out in the field, I rely on my memory to recall what a client requested in a text message. Projects often stall because I forget to order specific materials until the day the crew arrives to install them.",
        "I'm a solo fractional COO. My clients come from referrals and I work on three-month retainers. My work lives in various Slack channels and email threads. Because I'm switching between four different companies' cultures and tasks, I often lose the 'thread' of high-priority tasks. A project can stall for weeks simply because I'm waiting on a CEO to sign a document I sent."
      ];
      setDescription(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
      setIsDescriptionGenerated(true);
    }
  };

  const startScan = async (desc: string) => {
    if (!desc?.trim() || !isLoggedIn) return;
    
    const isExampleScan = isDescriptionGenerated && exampleScansUsed < MAX_EXAMPLE_SCANS;

    // Credit check
    if (!isExampleScan && credits <= 0) return;

    const words = desc.trim().split(/\s+/);
    if (words.length < 10 || desc.length < 50) {
      setCurrentView('invalid-input');
      return;
    }

    setPendingScanIsExample(isExampleScan);
    setApiError(null);
    setIsScanning(true);
    setCurrentView('loading');
    setPendingReport(null);

    try {
      if (!process.env.API_KEY) throw new Error("No API key available");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // SUPER-FORENSIC DEEP RESEARCH CONFIGURATION
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { 
          parts: [{ 
            text: `INITIATE MULTI-PASS SUPER-FORENSIC RESEARCH AND CAUSAL AUDIT.
            
            SOURCE WORKFLOW:
            "${desc}"
            
            DIAGNOSTIC MANDATE:
            Treat this input as a live operational environment. Conduct exhaustive internal simulations of failure points across time. Identify non-obvious risks, temporal decay patterns, and systemic fragility. Provide the absolute most advanced, high-density causal audit possible. FILL EVERY FIELD IN THE SCHEMA WITH MAXIMUM ACCURACY AND FORENSIC DEPTH.` 
          }] 
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          maxOutputTokens: 25000,
          thinkingConfig: { thinkingBudget: 32768 },
          temperature: 0.1, // Absolute precision
        },
      });

      const textOutput = response?.text;
      if (!textOutput) throw new Error("Empty response from Deep Research Engine.");

      let jsonString = textOutput.trim();
      if (jsonString.includes('```')) {
        jsonString = jsonString.replace(/```json\n?|\n?```/g, '').trim();
      }
      
      let result;
      try {
        result = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("JSON Parse Error", textOutput);
        throw new Error("Report Synthesis Error: The forensic data structure was malformed. Please retry.");
      }
      
      const newReport: ScanReport = {
        ...result,
        id: `DIAG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        timestamp: new Date().toLocaleString(),
        originalInput: desc,
        name: result.name || "Structural Forensic Audit"
      };

      setPendingReport(newReport);
    } catch (error: any) {
      console.error("Deep Scan Error:", error);
      setApiError(error?.message || "Research Engine Connection Timeout. The simulation was interrupted.");
    }
  };

  const finalizeScan = () => {
    if (pendingReport) {
      if (pendingScanIsExample) {
        const nextUsed = exampleScansUsed + 1;
        setExampleScansUsed(nextUsed);
        if (nextUsed >= MAX_EXAMPLE_SCANS) {
          setHasScannedExample(true);
        }
      } else {
        setCredits(prev => Math.max(0, prev - 1));
      }

      setSelectedReport(pendingReport);
      setHistory(prev => [pendingReport, ...(prev || [])]);
      setCurrentView('report');
      setPendingReport(null);
      setIsScanning(false);
      setPendingScanIsExample(false);
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      credits={credits} 
      isLoggedIn={isLoggedIn}
      onLogin={handleLoginTrigger}
      onLogout={handleLogout}
    >
      {currentView === 'input' && (
        <InputScreen 
          description={description}
          setDescription={handleSetDescription}
          onStartScan={(d) => startScan(d)} 
          onGenerateExample={generateExamplePrompt}
          onClear={handleClearPrompt}
          lastError={apiError}
          credits={credits}
          generationsUsed={exampleScansUsed}
          maxGenerations={MAX_EXAMPLE_SCANS}
          isLoggedIn={isLoggedIn}
          hasScannedExample={hasScannedExample}
          isDescriptionGenerated={isDescriptionGenerated}
        />
      )}
      {currentView === 'loading' && (
        <LoadingScreen 
          isDataReady={!!pendingReport} 
          onComplete={finalizeScan} 
          onRetry={() => startScan(description)}
          onBack={handleBackFromLoading}
          isError={!!apiError} 
        />
      )}
      {currentView === 'report' && selectedReport && (
        <ReportScreen report={selectedReport} onNewScan={handleRestart} />
      )}
      {currentView === 'history' && (
        <HistoryScreen reports={history || []} onSelectReport={(r) => { setSelectedReport(r); setCurrentView('report'); }} onNewScan={handleRestart} />
      )}
      {currentView === 'invalid-input' && (
        <InvalidInputScreen onBack={() => setCurrentView('input')} />
      )}
      {currentView === 'credits' && (
        <CreditsScreen 
          onPurchase={handleSimulatedPurchase} 
          isLoggedIn={isLoggedIn}
          onLogin={handleLoginTrigger}
          onBack={() => setCurrentView('input')}
        />
      )}
      {currentView === 'login' && (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess} 
          onBack={() => setCurrentView('input')} 
          onNavigateSignUp={() => setCurrentView('signup')}
        />
      )}
      {currentView === 'signup' && (
        <SignUpScreen 
          onSignUpSuccess={handleLoginSuccess} 
          onBack={() => setCurrentView('login')} 
        />
      )}
    </Layout>
  );
}
