
import React, { useState, useEffect, useRef } from 'react';
import { ScanReport, RiskLevel, RiskFinding, SuggestedTool } from '../types';
import { LENSES } from '../constants';
import { RiskCard } from './RiskCard';
import { ChevronDown, ChevronUp, Clock, Layout, AlertTriangle, ArrowRight, Play, FileText, Wrench, X, Shield, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  report: ScanReport;
  onNewScan: () => void;
}

const SuggestedToolsModal: React.FC<{ 
  tools: SuggestedTool[]; 
  isOpen: boolean; 
  onClose: () => void 
}> = ({ tools, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <Sparkles size={20} className="text-indigo-600" />
                <h2 id="modal-title" className="text-2xl font-black text-slate-900 tracking-tight">Automation Roadmap</h2>
             </div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Causal-Mapped Structural Solutions</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/50">
          {tools.map((tool, idx) => (
            <div key={idx} className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-indigo-500 hover:shadow-xl transition-all duration-300">
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
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">{tool.bestFor}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {tool.tag}
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Mechanism Implementation</p>
                <ul className="space-y-3">
                  {tool.whyFits.map((point, pIdx) => (
                    <li key={pIdx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl text-sm text-slate-700 font-medium border border-slate-100">
                      <div className="mt-1"><ArrowRight size={16} className="text-indigo-500" /></div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
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

  const activeLens = LENSES.find(l => l.id === activeTab) || LENSES[0];
  const findings = report.sections[activeTab] || [];
  
  const allFindings = Object.values(report.sections).flat() as RiskFinding[];
  const topRisks = [...allFindings].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
      {/* Top Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-12 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
               <Shield size={32} />
             </div>
             <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{report.name}</h1>
               <div className="flex items-center gap-4 mt-2">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{report.timestamp}</span>
                 <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                 <span className={`text-xs font-black uppercase tracking-widest ${report.overallProfile === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>
                   {report.overallProfile} Profile Verified
                 </span>
               </div>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setOriginalInputOpen(!originalInputOpen)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <FileText size={18} />
            Diagnostic Source
          </button>
          <button onClick={onNewScan} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Play size={18} fill="currentColor" />
            Restart Audit
          </button>
        </div>
      </header>

      {originalInputOpen && (
        <div className="mb-12 p-8 bg-slate-900 rounded-3xl text-slate-300 font-mono text-sm leading-relaxed border border-slate-800 animate-in fade-in slide-in-from-top-4">
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">Source Input Sequence</p>
          {report.originalInput}
        </div>
      )}

      {/* Critical Risks Grid */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle size={24} className="text-rose-500" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">High-Reasoning Criticals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topRisks.map(risk => (
            <div key={risk.id} className="relative group bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <AlertTriangle size={120} />
              </div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-100">Critical Priority</span>
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-3 leading-tight">{risk.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{risk.whatCanGoWrong}</p>
              <button 
                onClick={() => {
                  const id = Object.keys(report.sections).find(k => report.sections[k].some(r => r.id === risk.id));
                  if(id) setActiveTab(id);
                }}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:gap-3 transition-all"
              >
                Trace Root <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Main Forensic Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Lenses */}
        <aside className="lg:col-span-3 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 pl-2">Risk Taxonomy</p>
          <div className="sticky top-24 space-y-1.5">
            {LENSES.map(lens => {
              const count = report.sections[lens.id]?.length || 0;
              const isActive = activeTab === lens.id;
              return (
                <button
                  key={lens.id}
                  onClick={() => setActiveTab(lens.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                    isActive 
                    ? `bg-white border-2 border-${lens.color}-500 shadow-lg shadow-${lens.color}-50 ring-1 ring-${lens.color}-500/10` 
                    : 'text-slate-500 hover:bg-white hover:border-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-xs font-black uppercase tracking-widest ${isActive ? `text-${lens.color}-600` : 'text-slate-500'}`}>
                      {lens.label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${count > 0 ? (isActive ? `bg-${lens.color}-600 text-white` : 'bg-slate-100 text-slate-500') : 'text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}

            <div className="pt-8">
              <button 
                onClick={() => setIsToolsModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-5 rounded-3xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group"
              >
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                Automation Solutions
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Risk Feed - Clean Words (No card header, no Lens prefix) */}
        <main className="lg:col-span-9 space-y-10">
          <div className="pb-4 border-b border-slate-100">
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {activeLens.label}
             </h3>
             <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-3 leading-relaxed max-w-2xl">{activeLens.description}</p>
          </div>

          <div className="space-y-8">
            {findings.map(f => (
              <RiskCard key={f.id} finding={f} accentColor={activeLens.color} />
            ))}
          </div>
        </main>

        {/* Full-Width Bottom Structural Stabilizers - Vertical Bullet Point List */}
        <section className="lg:col-span-12 pt-16 mt-16 border-t border-slate-200">
           <div className="bg-slate-950 text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-14">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                      <Shield className="text-indigo-400" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-[0.3em]">Structural Stabilizers</h3>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Audit-Hardened Observations</p>
                    </div>
                 </div>
                 
                 <ul className="space-y-10 max-w-5xl">
                    {report.stabilizingActions?.slice(0, 2).map((act, i) => (
                      <li key={i} className="flex items-start gap-8 group">
                         <div className="mt-2.5 flex-shrink-0 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] group-hover:scale-125 transition-transform" />
                         <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 italic opacity-90">
                           {act}
                         </p>
                      </li>
                    ))}
                 </ul>

                 <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-20 pt-10 border-t border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Deep_Forensic_Protocol v5.5 • Simulated Scenarios: 1,000+
                   </p>
                   <div className="flex gap-4">
                      <span className="text-[9px] font-black px-4 py-2 bg-white/5 rounded-full text-slate-400 border border-white/10 uppercase tracking-widest">Causal Verified</span>
                      <span className="text-[9px] font-black px-4 py-2 bg-white/5 rounded-full text-slate-400 border border-white/10 uppercase tracking-widest">Structural Optimized</span>
                   </div>
                 </div>
              </div>
           </div>
        </section>
      </div>

      <SuggestedToolsModal 
        isOpen={isToolsModalOpen} 
        onClose={() => setIsToolsModalOpen(false)} 
        tools={report.suggestedTools} 
      />
    </div>
  );
};
