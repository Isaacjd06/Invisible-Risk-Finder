
import React, { useState, useEffect, useRef } from 'react';
import { ScanReport, RiskFinding, SuggestedTool } from '../types';
import { LENSES } from '../constants';
import { RiskCard } from './RiskCard';
import { ChevronDown, ChevronUp, Clock, AlertTriangle, ArrowRight, Play, FileText, X, Shield, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  report: ScanReport;
  onNewScan: () => void;
}

// Map lens colors to static Tailwind classes
const lensStyles: Record<string, { border: string, text: string, bgActive: string, shadow: string, ring: string }> = {
  rose: { border: 'border-rose-500', text: 'text-rose-600', bgActive: 'bg-rose-600', shadow: 'shadow-rose-50', ring: 'ring-rose-500/10' },
  amber: { border: 'border-amber-500', text: 'text-amber-600', bgActive: 'bg-amber-600', shadow: 'shadow-amber-50', ring: 'ring-amber-500/10' },
  violet: { border: 'border-violet-500', text: 'text-violet-600', bgActive: 'bg-violet-600', shadow: 'shadow-violet-50', ring: 'ring-violet-500/10' },
  indigo: { border: 'border-indigo-500', text: 'text-indigo-600', bgActive: 'bg-indigo-600', shadow: 'shadow-indigo-50', ring: 'ring-indigo-500/10' },
  sky: { border: 'border-sky-500', text: 'text-sky-600', bgActive: 'bg-sky-600', shadow: 'shadow-sky-50', ring: 'ring-sky-500/10' },
  emerald: { border: 'border-emerald-500', text: 'text-emerald-600', bgActive: 'bg-emerald-600', shadow: 'shadow-emerald-50', ring: 'ring-emerald-500/10' },
  orange: { border: 'border-orange-500', text: 'text-orange-600', bgActive: 'bg-orange-600', shadow: 'shadow-orange-50', ring: 'ring-orange-500/10' },
};

const SuggestedToolsModal: React.FC<{ 
  tools: SuggestedTool[]; 
  isOpen: boolean; 
  onClose: () => void 
}> = ({ tools, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <Sparkles size={20} className="text-indigo-600" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Automation Roadmap</h2>
             </div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Causal-Mapped Structural Solutions</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
            <X size={24} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/50">
          {tools?.map((tool, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-indigo-500 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-900 text-2xl tracking-tight">{tool.name}</h3>
                    {tool.url && (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">{tool.bestFor}</p>
                </div>
                <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {tool.tag}
                </span>
              </div>
              <ul className="space-y-3">
                {tool.whyFits?.map((point, pIdx) => (
                  <li key={pIdx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl text-sm text-slate-700 font-medium border border-slate-100">
                    <ArrowRight size={16} className="text-indigo-500 flex-shrink-0 mt-1" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ReportScreen: React.FC<Props> = ({ report, onNewScan }) => {
  const [activeTab, setActiveTab] = useState(LENSES[0].id);
  const [originalInputOpen, setOriginalInputOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);

  const activeLens = LENSES?.find(l => l.id === activeTab) || LENSES[0];
  const findings = report?.sections?.[activeTab] || [];
  
  const allFindings = Object.values(report?.sections || {}).flat() as RiskFinding[];
  const topRisks = [...allFindings].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-12 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
               <Shield size={32} />
             </div>
             <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{report?.name}</h1>
               <div className="flex items-center gap-4 mt-2">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{report?.timestamp}</span>
                 <span className={`text-xs font-black uppercase tracking-widest ${report?.overallProfile === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>
                   {report?.overallProfile} Risk Profile
                 </span>
               </div>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setOriginalInputOpen(!originalInputOpen)} className="px-6 py-3 rounded-2xl font-black text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
            Source Input
          </button>
          <button onClick={onNewScan} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-slate-800 transition-all">
            Restart Audit
          </button>
        </div>
      </header>

      {originalInputOpen && (
        <div className="mb-12 p-8 bg-slate-900 rounded-3xl text-slate-300 font-mono text-sm leading-relaxed border border-slate-800">
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">Source Protocol Input</p>
          {report?.originalInput}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 pl-2">Risk Taxonomy</p>
          <div className="sticky top-24 space-y-1.5">
            {LENSES?.map(lens => {
              const count = report?.sections?.[lens.id]?.length || 0;
              const isActive = activeTab === lens.id;
              const style = lensStyles[lens.color] || lensStyles.indigo;
              return (
                <button
                  key={lens.id}
                  onClick={() => setActiveTab(lens.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 ${
                    isActive 
                    ? `${style.border} bg-white shadow-lg ${style.shadow} ring-1 ${style.ring}` 
                    : 'text-slate-500 hover:bg-white hover:border-slate-300 border-transparent'
                  }`}
                >
                  <span className={`text-xs font-black uppercase tracking-widest ${isActive ? style.text : 'text-slate-500'}`}>
                    {lens.label}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${count > 0 ? (isActive ? `${style.bgActive} text-white` : 'bg-slate-100 text-slate-500') : 'text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <div className="pt-8">
              <button onClick={() => setIsToolsModalOpen(true)} className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                Automation Solutions
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-10">
          <div className="pb-4 border-b border-slate-100">
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{activeLens.label}</h3>
             <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-3 leading-relaxed">{activeLens.description}</p>
          </div>
          <div className="space-y-8">
            {findings?.map(f => (
              <RiskCard key={f.id} finding={f} accentColor={activeLens.color} />
            ))}
          </div>
        </main>
      </div>
      <SuggestedToolsModal isOpen={isToolsModalOpen} onClose={() => setIsToolsModalOpen(false)} tools={report?.suggestedTools || []} />
    </div>
  );
};
