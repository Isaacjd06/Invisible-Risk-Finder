
import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  isDataReady: boolean;
  onComplete: () => void;
  onRetry?: () => void;
  onBack?: () => void;
  isError?: boolean;
}

export const LoadingScreen: React.FC<Props> = ({ isDataReady, onComplete, onRetry, onBack, isError }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  const steps = [
    { id: 1, label: 'Context Parsing', sub: 'Deconstructing workflow input into operational nodes...' },
    { id: 2, label: 'Structural Mapping', sub: 'Identifying dependencies, handoffs, and feedback loops...' },
    { id: 3, label: 'Risk Analysis', sub: 'Evaluating process gaps against the diagnostic taxonomy...' },
    { id: 4, label: 'Report Synthesis', sub: 'Formatting forensic audit and automation roadmap...' }
  ];

  useEffect(() => {
    // If we hit an error, we stop the progression
    if (isError) return;

    // Stage 1: Initial Parsing
    if (activeStep === 1) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 1]);
        setActiveStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Stage 2: Structural Analysis
    if (activeStep === 2) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 2]);
        setActiveStep(3);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Stage 3: Risk Vectoring (Wait for API response)
    if (activeStep === 3 && isDataReady) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 3]);
        setActiveStep(4);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Stage 4: Final Formatting
    if (activeStep === 4) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 4]);
        // Short buffer before finishing
        setTimeout(() => onComplete(), 800); 
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activeStep, isDataReady, onComplete, isError]);

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-20 h-20 ${isError ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'} rounded-3xl flex items-center justify-center mb-6 shadow-inner`}>
            {isError ? <AlertTriangle size={40} /> : <Loader2 size={40} className="animate-spin" />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
            {isError ? 'Analysis Interrupted' : 'Audit in Progress'}
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            {isError 
              ? 'The diagnostic engine encountered a connection error.' 
              : isDataReady && activeStep >= 3
                ? 'Analysis complete. Compiling final report.' 
                : 'Mapping process boundaries and risk vectors.'}
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((s) => {
            const isChecked = checkedSteps.includes(s.id);
            const isActive = activeStep === s.id && !isError;
            const isPending = activeStep < s.id;
            const stepFailed = isError && activeStep === s.id;

            return (
              <div 
                key={s.id} 
                className={`flex items-start gap-5 transition-all duration-500 ${isPending ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                  isChecked 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' 
                    : stepFailed
                      ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100'
                      : isActive 
                        ? 'border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-50 animate-pulse' 
                        : 'border-slate-200 text-slate-300'
                }`}>
                  {isChecked ? <CheckCircle2 size={20} strokeWidth={3} /> : stepFailed ? <AlertTriangle size={20} /> : <span className="text-sm font-black">{s.id}</span>}
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-black uppercase tracking-widest transition-colors ${isChecked ? 'text-slate-900' : isActive ? 'text-indigo-600' : stepFailed ? 'text-rose-600' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{s.sub}</p>
                </div>
                {isActive && (
                  <Loader2 size={16} className="text-indigo-600 animate-spin mt-1" />
                )}
              </div>
            );
          })}
        </div>

        {isError ? (
          <div className="mt-12 flex flex-col gap-3">
            <button 
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <RefreshCw size={14} />
              Retry Diagnostic
            </button>
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              <ArrowLeft size={14} />
              Back to Input
            </button>
          </div>
        ) : (
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Diagnostic Engine</span>
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">v1.2.0_Forensic</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <span className={`w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse`}></span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                PROCESS_ACTIVE
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
