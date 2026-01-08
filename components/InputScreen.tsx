
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

  const getButtonLabel = () => {
    if (!isLoggedIn) return "Log in to Scan";
    if (isFreeScanAvailable) return "Free Demo Scan";
    if (credits <= 0) return "Credit Needed";
    return "Initiate Risk Scan";
  };

  const getButtonIcon = () => {
    if (!isLoggedIn) return <Lock size={20} className="mr-0 sm:mr-2" />;
    if (isFreeScanAvailable) return <Sparkles size={20} className="mr-0 sm:mr-2 text-indigo-200" />;
    if (credits <= 0) return <ZapOff size={20} className="mr-0 sm:mr-2" />;
    return <Play size={20} fill="currentColor" className="mr-0 sm:mr-2" />;
  };

  const canScan = !isInputEmpty && isLoggedIn && (credits > 0 || isFreeScanAvailable);

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6">
      <header className="mb-10 sm:mb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white mb-6 shadow-2xl shadow-indigo-200 ring-4 ring-white animate-in zoom-in duration-500">
          <ShieldCheck size={32} className="sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-indigo-600 tracking-tight mb-4 text-center">
          Invisible Risk Finder
        </h1>
        <p className="max-w-3xl mx-auto text-slate-500 text-sm sm:text-lg font-medium leading-relaxed px-2">
          Describe a workflow you’re using or considering. The engine analyzes how it would behave over time to surface hidden risks, failure points, and fragile assumptions before they cost you.
        </p>
      </header>

      {lastError && (
        <div className="mb-8 max-w-4xl mx-auto bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-4 text-rose-800 animate-in slide-in-from-top-4">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider">Research Engine Interrupted</p>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">{lastError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden transition-all relative">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 bg-slate-900 rounded text-indigo-400">
                  <Cpu size={12} className="sm:w-[14px] sm:h-[14px]" />
                </div>
                <label htmlFor="description" className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                  Diagnostic Input Module
                </label>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${lastError ? 'bg-rose-500' : 'bg-indigo-500'} animate-pulse`}></span>
                  <span className={`text-[8px] sm:text-[10px] ${lastError ? 'text-rose-700' : 'text-indigo-700'} font-bold uppercase tracking-wider`}>
                    {lastError ? 'Stalled' : 'Engine Ready'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-slate-50/30">
              {isDescriptionGenerated && (
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-indigo-600 text-white rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-lg">
                    <Sparkles size={8} className="sm:w-2.5 sm:h-2.5" />
                    Generated Example
                  </span>
                  <button 
                    onClick={onClear}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm"
                  >
                    <Trash2 size={10} className="sm:w-3 sm:h-3" />
                    Clear
                  </button>
                </div>
              )}
              <textarea
                id="description"
                readOnly={isDescriptionGenerated}
                className={`w-full h-[300px] sm:h-[450px] p-6 sm:p-10 ${isDescriptionGenerated ? 'pt-16' : 'pt-10'} text-slate-950 placeholder-slate-300 focus:outline-none bg-white border-0 transition-all leading-relaxed text-base sm:text-xl font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] ${isDescriptionGenerated ? 'cursor-not-allowed opacity-80' : ''}`}
                placeholder="Explain your process, timelines, and where tracking relies on memory or messages..."
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-8 text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none group-focus-within:text-indigo-200 transition-colors">
                {description?.length ? `${description.length} chars` : 'Waiting for input...'}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {showExampleButton && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleGenerateClick}
                    disabled={!isLoggedIn || isGenerating}
                    className={`flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-6 px-4 rounded-xl font-bold text-sm sm:text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm border ${
                      !isLoggedIn 
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                        : 'text-slate-700 border-slate-300 bg-white hover:bg-slate-50 shadow-indigo-100'
                    }`}
                  >
                    {isGenerating ? (
                      <Loader2 size={20} className="animate-spin text-indigo-500" />
                    ) : !isLoggedIn ? (
                      <Lock size={18} className="text-slate-300" />
                    ) : (
                      <Sparkles size={20} className="text-indigo-500" />
                    )}
                    <span className="whitespace-nowrap">
                      {!isLoggedIn ? "Login for Example" : isDescriptionGenerated ? "New Example" : "Generate Example"}
                    </span>
                  </button>
                  {isLoggedIn && (
                    <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">
                      Demos Available: {remainingScans}
                    </p>
                  )}
                </div>
              )}
              <div className={`flex flex-col gap-2 ${!showExampleButton ? 'sm:col-span-2' : ''}`}>
                <button
                  disabled={isInputEmpty}
                  onClick={handleInitiateScan}
                  className={`flex items-center justify-center py-4 sm:py-6 px-4 rounded-xl font-black text-sm sm:text-xl transition-all shadow-xl ${
                    canScan
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]'
                      : !isInputEmpty
                      ? 'bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer border border-slate-200' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  {getButtonIcon()}
                  <span className="whitespace-nowrap">{getButtonLabel()}</span>
                </button>
              </div>
            </div>
            
            {(showLoginWarning || (showCreditWarning && isLoggedIn && !isFreeScanAvailable)) && (
              <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center gap-3 text-rose-800 shadow-lg shadow-rose-100 animate-in slide-in-from-top-2">
                {showLoginWarning ? <UserPlus size={20} className="text-rose-500" /> : <ZapOff size={20} className="text-rose-500" />}
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-center">
                  {showLoginWarning ? 'Authentication required for structural audit.' : 'Scan rejected. Insufficient audit credits.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 lg:sticky lg:top-24">
            <h3 className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 sm:mb-8">System Taxonomy</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-x-8 lg:gap-6">
              {(LENSES || []).map((lens, idx) => (
                <li key={lens.id} className="flex gap-4 items-start relative z-10">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-[11px] sm:text-[12px] font-black text-indigo-400 border border-slate-700 shadow-inner">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs sm:text-[13px] font-bold text-white leading-tight">{lens.label}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 leading-tight mt-1">{lens.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 sm:mt-24 pt-8 border-t border-slate-100 flex flex-col items-center gap-6 opacity-80">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Connect & Social</span>
        <div className="flex items-center gap-6 sm:gap-8">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300">
            <Instagram size={20} />
          </button>
          <a 
            href="https://x.com/is_jd_cas" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 flex items-center justify-center"
          >
            <XIcon size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};
