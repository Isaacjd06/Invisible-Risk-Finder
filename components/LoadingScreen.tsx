
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  isDataReady: boolean;
  onComplete: () => void;
  isError?: boolean;
}

export const LoadingScreen: React.FC<Props> = ({ isDataReady, onComplete, isError }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const isDataReadyRef = useRef(isDataReady);

  useEffect(() => {
    isDataReadyRef.current = isDataReady;
  }, [isDataReady]);

  // Handle the automatic progression of the first few steps
  useEffect(() => {
    let timeout: any;

    const advance = (step: number) => {
      if (step > 4) {
        onComplete();
        return;
      }

      // If we are on step 3 (Calculating Risks) and data isn't ready, wait for it
      if (step === 3 && !isDataReadyRef.current) {
        setActiveStep(3);
        return;
      }

      // If we are on step 4 or moving to it because data is ready
      setActiveStep(step);
      
      const delay = step === 4 ? 600 : 1200;
      
      timeout = setTimeout(() => {
        setCheckedSteps(prev => [...new Set([...prev, step])]);
        advance(step + 1);
      }, delay);
    };

    // Start the process
    advance(1);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  // Watch for data readiness to trigger the final jump
  useEffect(() => {
    if (isDataReady && activeStep === 3) {
      // Data arrived while we were waiting on Step 3
      setCheckedSteps(prev => [...new Set([...prev, 3])]);
      const timer = setTimeout(() => {
        setActiveStep(4);
        setTimeout(() => {
          setCheckedSteps(prev => [...new Set([...prev, 4])]);
          setTimeout(() => onComplete(), 300);
        }, 500);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isDataReady, activeStep, onComplete]);

  const steps = [
    { id: 1, label: 'Processing Input', sub: 'Parsing workflow syntax...' },
    { id: 2, label: 'Reasoning Engine', sub: 'Modeling causal chains with Gemini 3 Pro...' },
    { id: 3, label: 'Calculating Risks', sub: 'Applying 7-lens forensic taxonomy...' },
    { id: 4, label: 'Finalizing Report', sub: 'Synthesizing Work Map and automation stack...' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-16 h-16 ${isError ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'} rounded-2xl flex items-center justify-center mb-6`}>
            {isError ? <AlertTriangle size={32} className="animate-pulse" /> : <Loader2 size={32} className="animate-spin" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isError ? 'Fallback Diagnostic Active' : 'Live Diagnostic in Progress'}
          </h2>
          <p className="text-slate-500 text-sm italic">
            {isError ? '"Simulating results based on forensic baseline."' : '"The invisible is only invisible to the unmapped."'}
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s) => {
            const isChecked = checkedSteps.includes(s.id);
            const isActive = activeStep === s.id;
            const isPending = activeStep < s.id;

            return (
              <div 
                key={s.id} 
                className={`flex items-center gap-4 transition-all duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isChecked 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-slate-300 text-slate-300'
                }`}>
                  {isChecked ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{s.id}</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold transition-colors ${isChecked ? 'text-slate-900' : isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-slate-500">{s.sub}</p>
                </div>
                {isActive && (
                  <Loader2 size={16} className="text-indigo-600 animate-spin" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Forensic Protocol v3.0.1
          </p>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-amber-400' : 'bg-green-400 animate-pulse'}`}></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isError ? 'Simulation' : 'Live Engine'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
