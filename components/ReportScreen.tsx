
import React, { useState, useEffect, useRef } from 'react';
import { ScanReport, RiskFinding, SuggestedTool } from '../types';
import { LENSES } from '../constants';
import { RiskCard } from './RiskCard';
import { ChevronDown, ChevronUp, Clock, AlertTriangle, ArrowRight, Play, FileText, X, Shield, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  report: ScanReport;
  onNewScan: () => void;
}

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="px-6 sm:px-10 py-6 sm:py-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <Sparkles size={20} className="text-indigo-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Automation Roadmap</h2>
             </div>
             <p className="text-[8px] sm:text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Forensic Structural Solutions</p>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 hover:bg-slate-100 rounded-xl sm:rounded-2xl transition-all text-slate-400 hover:text-slate-900">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 sm:space-y-8 bg-slate-50/50">
          {tools?.map((tool, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-indigo-500 transition-all duration-300 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-900 text-xl sm:text-2xl tracking-tight">{tool.name}</h3>
                    {tool.url && (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                        <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-sm font-black text-indigo-600 uppercase tracking-widest">{tool.bestFor}</p>
                </div>
                <span className="self-start px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                  {tool.tag}
                </span>
              </div>
              <ul className="space-y-3">
                {tool.whyFits?.map((point, pIdx) => (
                  <li key={pIdx} className="flex gap-3 sm:gap-4 p-4 bg-slate-50 rounded-2xl text-xs sm:text-sm text-slate-700 font-medium border border-slate-100">
                    <ArrowRight size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
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
  
  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6 pb-32">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="p-2 sm:p-3 bg-indigo-600 rounded-xl sm:rounded-2xl text-white shadow-lg shrink-0">
               <Shield size={24} className="sm:w-8 sm:h-8" />
             </div>
             <div>
               <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-tight">{report?.name}</h1>
               <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{report?.timestamp}</span>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${report?.overallProfile === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>
                   {report?.overallProfile} Risk Profile
                 </span>
               </div>
             </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button onClick={() => setOriginalInputOpen(!originalInputOpen)} className="flex-1 lg:flex-none px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest">
            {originalInputOpen ? 'Hide Source' : 'View Source'}
          </button>
          <button onClick={onNewScan} className="flex-1 lg:flex-none bg-slate-900 text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100">
            Restart Audit
          </button>
        </div>
      </header>

      {originalInputOpen && (
        <div className="mb-10 sm:mb-12 p-6 sm:p-8 bg-slate-900 rounded-3xl text-slate-300 font-mono text-[11px] sm:text-sm leading-relaxed border border-slate-800 shadow-inner">
          <p className="mb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-400">Source Protocol Input</p>
          <div className="whitespace-pre-wrap">{report?.originalInput}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Responsive Lens Selector */}
        <aside className="lg:col-span-3">
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 sm:mb-6 lg:pl-2">Risk Taxonomy</p>
          
          {/* Tablet/Desktop Side Nav */}
          <div className="hidden lg:flex flex-col sticky top-24 gap-1.5">
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
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? style.text : 'text-slate-500'}`}>
                    {lens.label}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${count > 0 ? (isActive ? `${style.bgActive} text-white` : 'bg-slate-100 text-slate-500') : 'text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <div className="pt-8">
              <button onClick={() => setIsToolsModalOpen(true)} className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest">
                Automation Solutions
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Scroll Nav */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar -mx-4 px-4 mask-fade-right">
              {LENSES?.map(lens => {
                const isActive = activeTab === lens.id;
                const style = lensStyles[lens.color] || lensStyles.indigo;
                return (
                  <button
                    key={lens.id}
                    onClick={() => setActiveTab(lens.id)}
                    className={`whitespace-nowrap px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all shrink-0 ${
                      isActive ? `${style.border} bg-white ${style.text} shadow-sm` : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    {lens.label}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setIsToolsModalOpen(true)} className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles size={16} />
              Automation Solutions
            </button>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-8 sm:space-y-10">
          <div className="pb-4 sm:pb-6 border-b border-slate-100">
             <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase">{activeLens.label}</h3>
             <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-3 leading-relaxed">{activeLens.description}</p>
          </div>
          <div className="space-y-6 sm:space-y-8">
            {findings.length > 0 ? (
              findings.map(f => (
                <RiskCard key={f.id} finding={f} accentColor={activeLens.color} />
              ))
            ) : (
              <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">No risks identified under this lens.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <SuggestedToolsModal isOpen={isToolsModalOpen} onClose={() => setIsToolsModalOpen(false)} tools={report?.suggestedTools || []} />
    </div>
  );
};
