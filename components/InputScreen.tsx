
import React, { useState, useEffect } from 'react';
import { LENSES } from '../constants';
import { ShieldCheck, Play, Cpu, AlertCircle, Sparkles, Loader2, ZapOff, UserPlus, Lock, Instagram, Trash2 } from 'lucide-react';

interface Props {
  description: string;
  setDescription: (val: string) => void;
  onStartScan: (description: string) => void;
  onGenerateExample: () => Promise<void>;
  onClear: () => void;
  lastError?: string | null;
  credits: number;
  generationsUsed: number;
  maxGenerations: number;
  isLoggedIn: boolean;
  hasScannedExample: boolean;
  isDescriptionGenerated?: boolean;
}

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z" />
  </svg>
);

export const InputScreen: React.FC<Props> = ({ 
  description, 
  setDescription, 
  onStartScan, 
  onGenerateExample,
  onClear,
  lastError,
  credits,
  generationsUsed,
  maxGenerations,
  isLoggedIn,
  hasScannedExample,
  isDescriptionGenerated = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditWarning, setShowCreditWarning] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  // Clear warnings if input changes or state updates
  useEffect(() => {
    setShowCreditWarning(false);
    setShowLoginWarning(false);
  }, [description, credits, isLoggedIn]);

  const handleGenerateClick = async () => {
    if (!isLoggedIn || generationsUsed >= maxGenerations) return;
    setIsGenerating(true);
    try {
      await onGenerateExample();
    } catch (e) {
      console.error("Generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInitiateScan = () => {
    if (!description?.trim()) return;
    
    if (!isLoggedIn) {
      setShowLoginWarning(true);
      return;
    }

    // Only check credits if we are NOT performing a free example scan
    const isFreeScan = isDescriptionGenerated && generationsUsed < maxGenerations;
    if (!isFreeScan && credits <= 0) {
      setShowCreditWarning(true);
      return;
    }
    
    onStartScan(description);
  };

  const isInputEmpty = !description?.trim();
  const remainingScans = Math.max(0, maxGenerations - generationsUsed);
  const isFreeScanAvailable = isDescriptionGenerated && generationsUsed < maxGenerations;
  const showExampleButton = generationsUsed < maxGenerations;

  // Dynamic Button State Logic
  const getButtonLabel = () => {
    if (!isLoggedIn) return "Log in to Initiate Risk Scan";
    if (isFreeScanAvailable) return "Initiate Free Demo Scan";
    if (credits <= 0) return "Credit Needed";
    return "Initiate Risk Scan";
  };

  const getButtonIcon = () => {
    if (!isLoggedIn) return <Lock size={20} className="mr-2" />;
    if (isFreeScanAvailable) return <Sparkles size={20} className="mr-2 text-indigo-200" />;
    if (credits <= 0) return <ZapOff size={20} className="mr-2" />;
    return <Play size={22} fill="currentColor" className="mr-2" />;
  };

  const canScan = !isInputEmpty && isLoggedIn && (credits > 0 || isFreeScanAvailable);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600 text-white mb-6 shadow-2xl shadow-indigo-200 ring-4 ring-white">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-5xl font-black text-indigo-600 tracking-tight mb-4 text-center">
          Invisible Risk Finder
        </h1>
        <p className="max-w-3xl mx-auto text-slate-500 text-lg font-medium leading-relaxed">
          Describe a workflow you’re using or considering. The engine analyzes how it would behave over time to surface hidden risks, failure points, and fragile assumptions before they cost you.
        </p>
      </header>

      {lastError && (
        <div className="mb-8 max-w-4xl mx-auto bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-4 text-rose-800 animate-in slide-in-from-top-4">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold uppercase tracking-wider">Research Engine Interrupted</p>
            <p className="text-sm font-medium leading-relaxed">{lastError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden transition-all relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-900 rounded text-indigo-400">
                  <Cpu size={14} />
                </div>
                <label htmlFor="description" className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                  Diagnostic Input Module
                </label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                  <span className={`w-2 h-2 rounded-full ${lastError ? 'bg-rose-500' : 'bg-indigo-500'} animate-pulse`}></span>
                  <span className={`text-[10px] ${lastError ? 'text-rose-700' : 'text-indigo-700'} font-bold uppercase tracking-wider`}>
                    {lastError ? 'Research Stalled' : 'Engine Ready'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-slate-50/30">
              {isDescriptionGenerated && (
                <>
                  <div className="absolute top-4 left-6 z-10">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                      <Sparkles size={10} />
                      Generated Example (Locked)
                    </span>
                  </div>
                  <div className="absolute top-4 right-6 z-10">
                    <button 
                      onClick={onClear}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
                      title="Clear to edit manually"
                    >
                      <Trash2 size={12} />
                      Clear
                    </button>
                  </div>
                </>
              )}
              <textarea
                id="description"
                readOnly={isDescriptionGenerated}
                className={`w-full h-[450px] p-10 pt-16 text-slate-950 placeholder-slate-300 focus:outline-none bg-white border-0 transition-all leading-relaxed text-xl font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] ${isDescriptionGenerated ? 'cursor-not-allowed opacity-80' : ''}`}
                placeholder="Explain your process, timelines, and where tracking relies on memory or messages..."
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none group-focus-within:text-indigo-200 transition-colors">
                {description?.length ? `${description.length} characters` : 'Waiting for input...'}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              {showExampleButton && (
                <div className="flex-1 flex flex-col gap-2">
                  <button
                    onClick={handleGenerateClick}
                    disabled={!isLoggedIn || isGenerating}
                    className={`w-full h-full flex items-center justify-center gap-3 py-6 px-10 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm disabled:cursor-not-allowed ${
                      !isLoggedIn 
                        ? 'bg-slate-50 text-slate-400 border-slate-200' 
                        : 'text-slate-700 border-slate-300 bg-white hover:bg-slate-50 shadow-indigo-100'
                    }`}
                  >
                    {isGenerating ? (
                      <Loader2 size={24} className="animate-spin text-indigo-500" />
                    ) : !isLoggedIn ? (
                      <Lock size={20} className="text-slate-300" />
                    ) : (
                      <Sparkles size={24} className="text-indigo-500" />
                    )}
                    {!isLoggedIn 
                      ? "Login to Generate Example"
                      : isDescriptionGenerated ? "Generate Different Example" : "Generate Example Prompt"}
                  </button>
                  
                  {isLoggedIn && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">
                      Example Scans Available: {remainingScans}
                    </p>
                  )}
                </div>
              )}
              <button
                disabled={isInputEmpty}
                onClick={handleInitiateScan}
                className={`flex-1 flex items-center justify-center py-6 px-10 rounded-xl font-black text-xl transition-all shadow-2xl ${
                  canScan
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]'
                    : !isInputEmpty
                    ? 'bg-slate-100 text-slate-400 shadow-none hover:bg-slate-200 cursor-pointer border border-slate-200' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border border-slate-200'
                }`}
              >
                {getButtonIcon()}
                {getButtonLabel()}
              </button>
            </div>
            
            {showLoginWarning && (
              <div className="mt-4 p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center gap-4 text-rose-800 shadow-lg shadow-rose-100 animate-in slide-in-from-top-2">
                <UserPlus size={24} className="text-rose-500" />
                <p className="text-sm font-black uppercase tracking-[0.15em] text-center">
                  Authentication required for structural audit.
                </p>
              </div>
            )}

            {showCreditWarning && isLoggedIn && !isFreeScanAvailable && (
              <div className="mt-4 p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center gap-4 text-rose-800 shadow-lg shadow-rose-100 animate-in slide-in-from-top-2">
                <ZapOff size={24} className="text-rose-500" />
                <p className="text-sm font-black uppercase tracking-[0.15em] text-center">
                  Scan rejected. Insufficient custom audit credits.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">System Taxonomy</h3>
            <ul className="space-y-6">
              {(LENSES || []).map((lens, idx) => (
                <li key={lens.id} className="flex gap-4 items-start relative z-10">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-[12px] font-black text-indigo-400 border border-slate-700 shadow-inner">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-white leading-tight">{lens.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-1">{lens.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col items-center gap-4 opacity-70">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Social & Contact</span>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 cursor-default">
            <Instagram size={18} />
          </button>
          <a 
            href="https://x.com/is_jd_cas" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 flex items-center justify-center"
          >
            <XIcon size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};
