
import React, { useState } from 'react';
import { LENSES } from '../constants';
import { ShieldCheck, ChevronDown, ChevronRight, Play, Cpu, AlertCircle } from 'lucide-react';

interface Props {
  onStartScan: (description: string) => void;
  onViewExample: () => void;
  lastError?: string | null;
}

export const InputScreen: React.FC<Props> = ({ onStartScan, onViewExample, lastError }) => {
  const [description, setDescription] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600 text-white mb-6 shadow-2xl shadow-indigo-200 ring-4 ring-white">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Invisible Risk Finder</h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
          Powered by Gemini 3.0 Pro. Deep-scan your daily workflow for hidden risks and silent failures using advanced research models.
        </p>
      </header>

      {lastError && (
        <div className="mb-8 max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 text-red-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold uppercase tracking-wider">Live Engine Warning</p>
            <p className="text-sm font-medium leading-relaxed">
              {lastError}
              <br />
              <span className="text-[11px] opacity-70 mt-1 block">The system automatically fell back to a simulation report to preserve the workflow experience.</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          {/* Main Input Component */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-900 rounded text-indigo-400">
                  <Cpu size={14} />
                </div>
                <label htmlFor="description" className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                  Diagnostic Input Module
                </label>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                  <span className={`w-2 h-2 rounded-full ${lastError ? 'bg-amber-500' : 'bg-indigo-500'} animate-pulse`}></span>
                  <span className={`text-[10px] ${lastError ? 'text-amber-700' : 'text-indigo-700'} font-bold uppercase tracking-wider`}>
                    {lastError ? 'Limited Connectivity' : 'Engine Ready'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-slate-50/30">
              <div className="absolute inset-y-0 left-0 w-1 bg-indigo-600 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <textarea
                id="description"
                className="w-full h-[450px] p-10 text-slate-950 placeholder-slate-300 focus:outline-none bg-white border-0 transition-all leading-relaxed text-xl font-normal shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                placeholder="Explain your process, timelines, handoffs, and what tends to get missed. Be specific about the flow of information and responsibility..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none group-focus-within:text-indigo-200 transition-colors">
                Waiting for description...
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white hover:border-slate-300 transition-colors">
            <button
              onClick={() => setShowPrompts(!showPrompts)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
            >
              <span className="text-sm font-bold text-slate-700">Need help describing your process?</span>
              {showPrompts ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
            </button>
            {showPrompts && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-2">
                  <p className="font-black text-slate-900 uppercase tracking-wider text-[10px]">Context Triggers</p>
                  <p className="font-bold text-slate-800">What triggers new work?</p>
                  <p className="text-slate-600 leading-relaxed">e.g. A client email, a status change in CRM, or a specific calendar notification.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-black text-slate-900 uppercase tracking-wider text-[10px]">Time Sensitivity</p>
                  <p className="font-bold text-slate-800">What time windows matter?</p>
                  <p className="text-slate-600 leading-relaxed">e.g. Responses must happen within 4h, or follow-ups after 3 days of silence.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-black text-slate-900 uppercase tracking-wider text-[10px]">Cognitive Load</p>
                  <p className="font-bold text-slate-800">Where do you rely on memory?</p>
                  <p className="text-slate-600 leading-relaxed">e.g. "I usually remember to check the invoice folder on Fridays if nothing comes in."</p>
                </div>
                <div className="space-y-2">
                  <p className="font-black text-slate-900 uppercase tracking-wider text-[10px]">Transition Points</p>
                  <p className="font-bold text-slate-800">Where do handoffs happen?</p>
                  <p className="text-slate-600 leading-relaxed">e.g. Sales sends the signed contract to Ops via a shared doc link in Slack.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <button
              onClick={onViewExample}
              className="flex-1 py-6 px-10 rounded-xl font-bold text-xl text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              View Example Report
            </button>
            <button
              disabled={!description.trim()}
              onClick={() => onStartScan(description)}
              className={`flex-1 flex items-center justify-center gap-3 py-6 px-10 rounded-xl font-black text-xl transition-all shadow-2xl ${
                description.trim()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Play size={24} fill="currentColor" />
              Initiate Risk Scan
            </button>
          </div>

          <div className="text-center pt-6">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.25em] leading-relaxed">
              Forensic Workflow Diagnostics • Engine Version 3.0.1
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <ShieldCheck size={160} />
            </div>
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">System Taxonomy</h3>
            <p className="text-sm text-slate-400 font-medium mb-10 leading-relaxed">The engine mandates 7 required diagnostic lenses:</p>
            <ul className="space-y-6">
              {LENSES.map((lens, idx) => (
                <li key={lens.id} className="flex gap-4 items-start relative z-10">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-[12px] font-black text-indigo-400 border border-slate-700 shadow-inner">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-white leading-tight">{lens.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-1 group-hover:text-slate-400 transition-colors font-medium">{lens.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
               Scan Protocol
             </h3>
             <ul className="text-xs text-slate-500 space-y-5 font-medium leading-relaxed">
               <li className="flex gap-3">
                 <span className="text-indigo-600 font-black">01</span>
                 <span>Analysis focuses on "Nothing Happening" as a primary failure vector.</span>
               </li>
               <li className="flex gap-3">
                 <span className="text-indigo-600 font-black">02</span>
                 <span>Normalizes process descriptions into immutable Work Maps.</span>
               </li>
               <li className="flex gap-3">
                 <span className="text-indigo-600 font-black">03</span>
                 <span>Identifies direct automation opportunities to mitigate invisible risks.</span>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
