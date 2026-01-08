
import React from 'react';
import { AlertCircle, ArrowLeft, Terminal } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const InvalidInputScreen: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-rose-100">
        <AlertCircle size={48} />
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">
        Insufficient Data for Audit
      </h2>
      
      <p className="max-w-md text-slate-500 font-medium leading-relaxed mb-10">
        The diagnostic engine requires a more detailed workflow description to perform a forensic risk scan. One-word prompts or random characters do not provide enough operational surface area to map risks.
      </p>

      <div className="bg-slate-900 rounded-2xl p-6 mb-10 text-left w-full max-w-lg border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
          <Terminal size={14} className="text-indigo-400" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Diagnostic Recommendation</span>
        </div>
        <ul className="space-y-3">
          <li className="text-xs text-slate-300 flex items-start gap-3">
            <span className="text-indigo-500 font-black">•</span>
            <span>Include at least 2-3 sentences about your process.</span>
          </li>
          <li className="text-xs text-slate-300 flex items-start gap-3">
            <span className="text-indigo-500 font-black">•</span>
            <span>Narrate the flow of your work and where points of uncertainty or delay occur over time.</span>
          </li>
          <li className="text-xs text-slate-300 flex items-start gap-3">
            <span className="text-indigo-500 font-black">•</span>
            <span>Explain where tasks tend to stall, be forgotten, or rely purely on your memory to stay active.</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
      >
        <ArrowLeft size={20} />
        Return to Input Module
      </button>
      
      <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Zero Credits Consumed
      </p>
    </div>
  );
};
