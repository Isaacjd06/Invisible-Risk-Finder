
import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  isDataReady: boolean;
  onComplete: () => void;
  isError?: boolean;
}

export const LoadingScreen: React.FC<Props> = ({ isDataReady, onComplete, isError }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  const steps = [
    { id: 1, label: 'Workflow Decomposition', sub: 'Mapping stated events into formal state nodes...' },
    { id: 2, label: 'Failure Mode Simulation', sub: 'Conducting 1,000 stress simulations for race conditions...' },
    { id: 3, label: 'Forensic Synthesis', sub: 'Correlating simulated outcomes to structural vulnerabilities...' },
    { id: 4, label: 'Audit Hardening', sub: 'Validating finding relevance and automation strategies...' }
  ];

  useEffect(() => {
    // Stage 1: Decomposition
    if (activeStep === 1) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 1]);
        setActiveStep(2);
      }, 3500);
      return () => clearTimeout(timer);
    }

    // Stage 2: Simulation (Deep Research phase)
    if (activeStep === 2) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 2]);
        setActiveStep(3);
      }, 7000);
      return () => clearTimeout(timer);
    }

    // Stage 3: Synthesis - waits for actual backend data
    if (activeStep === 3 && isDataReady) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 3]);
        setActiveStep(4);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Stage 4: Formatting
    if (activeStep === 4) {
      const timer = setTimeout(() => {
        setCheckedSteps(prev => [...prev, 4]);
        setTimeout(() => onComplete(), 1000); 
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeStep, isDataReady, onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-20 h-20 ${isError ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'} rounded-3xl flex items-center justify-center mb-6 shadow-inner`}>
            {isError ? <AlertTriangle size={40} className="animate-pulse" /> : <Loader2 size={40} className="animate-spin" />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
            {isError ? 'Recovery Protocol' : 'Structural Audit Active'}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
            {isDataReady 
              ? 'Synthesis complete. Formatting forensic report.' 
              : activeStep === 2 
                ? 'Performing multi-pass failure simulations.'
                : 'Mapping process boundaries and gaps.'}
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((s) => {
            const isChecked = checkedSteps.includes(s.id);
            const isActive = activeStep === s.id;
            const isPending = activeStep < s.id;

            return (
              <div 
                key={s.id} 
                className={`flex items-start gap-5 transition-all duration-500 ${isPending ? 'opacity-20 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                  isChecked 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' 
                    : isActive 
                      ? 'border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-50 animate-pulse' 
                      : 'border-slate-200 text-slate-300'
                }`}>
                  {isChecked ? <CheckCircle2 size={20} strokeWidth={3} /> : <span className="text-sm font-black">{s.id}</span>}
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-black uppercase tracking-widest transition-colors ${isChecked ? 'text-slate-900' : isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
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

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Diagnostic Core</span>
             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Forensic_v5.0</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <span className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-amber-400' : 'bg-indigo-400 animate-pulse'}`}></span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {isError ? 'RECOVERY' : 'RESEARCH_MAX'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
