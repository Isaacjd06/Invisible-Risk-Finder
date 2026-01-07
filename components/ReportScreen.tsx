
import React, { useState, useEffect, useRef } from 'react';
import { ScanReport, RiskLevel, RiskFinding, SuggestedTool } from '../types';
import { LENSES } from '../constants';
import { RiskCard } from './RiskCard';
import { ChevronDown, ChevronUp, Clock, Layout, AlertTriangle, ArrowRight, Play, FileText, Wrench, X } from 'lucide-react';

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
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 id="modal-title" className="text-xl font-black text-slate-900">Top Suggested Automation Tools</h2>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Based on your original work description.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {tools.length > 0 ? (
            tools.map((tool, idx) => (
              <div key={idx} className="group border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all bg-slate-50/30">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{tool.name}</h3>
                    <p className="text-sm font-bold text-indigo-600 mb-2">{tool.bestFor}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {tool.tag}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why it fits your work</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    {tool.whyFits.map((point, pIdx) => (
                      <li key={pIdx} className="flex gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 font-medium italic">No tool suggestions available for this scan yet.</p>
            </div>
          )}
        </div>
        
        <footer className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Diagnostic Tools Extension Module
          </p>
        </footer>
      </div>
    </div>
  );
};

export const ReportScreen: React.FC<Props> = ({ report, onNewScan }) => {
  const [activeTab, setActiveTab] = useState(LENSES[0].id);
  const [workMapOpen, setWorkMapOpen] = useState(false);
  const [originalInputOpen, setOriginalInputOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);

  const getFindingsForTab = (tabId: string) => report.sections[tabId] || [];
  
  const allFindings = Object.values(report.sections).flat() as RiskFinding[];
  const topRisks = [...allFindings].sort((a, b) => b.score - a.score).slice(0, 3);

  const ProfileBadge = ({ level }: { level: RiskLevel }) => {
    const colors = {
      Low: 'bg-green-100 text-green-700 border-green-200',
      Moderate: 'bg-amber-100 text-amber-700 border-amber-200',
      High: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[level]}`}>
        {level} Risk Profile
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 pb-24">
      {/* Original Work Description Dropdown */}
      <section className="mb-8">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setOriginalInputOpen(!originalInputOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Original Work Description</span>
            </div>
            {originalInputOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>
          {originalInputOpen && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
              <pre className="whitespace-pre-wrap text-sm text-slate-600 mono leading-relaxed">
                {report.originalInput || "No original input captured for this report."}
              </pre>
            </div>
          )}
        </div>
      </section>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-black text-slate-900">{report.name}</h1>
             <ProfileBadge level={report.overallProfile} />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Clock size={14} /> {report.timestamp}</span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 font-medium text-slate-700 underline underline-offset-4 decoration-slate-300">Scan ID: {report.id}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider self-center mr-1">Time Windows:</span>
             {report.timeWindowsDetected.map(chip => (
               <span key={chip} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                 {chip}
               </span>
             ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onNewScan} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            <Play size={16} fill="currentColor" />
            Run New Scan
          </button>
        </div>
      </header>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4 text-slate-900">
          <AlertTriangle size={20} className="text-amber-500" />
          <h2 className="text-xl font-bold">Top Critical Risks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRisks.map(risk => (
            <div key={risk.id} className="bg-white border-l-4 border-l-red-500 border border-slate-200 p-5 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 leading-tight pr-4">{risk.title}</h3>
                <span className="text-lg font-black text-red-600">{risk.score}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{risk.whatCanGoWrong}</p>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => {
                    const lensId = Object.keys(report.sections).find(k => report.sections[k].some(r => r.id === risk.id));
                    if (lensId) setActiveTab(lensId);
                  }}
                  className="text-[10px] font-bold uppercase text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  View Lens <ArrowRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work Map Section */}
      <section className="mb-12">
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <button 
            onClick={() => setWorkMapOpen(!workMapOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Layout size={20} className="text-slate-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Work Map</h3>
                <p className="text-[10px] text-slate-500 font-medium">This is how your description was normalized before scanning</p>
              </div>
            </div>
            {workMapOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {workMapOpen && (
            <div className="p-6 border-t border-slate-200 bg-white grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Events</h4>
                <ul className="text-xs space-y-1.5 font-medium text-slate-700 mono">
                  {report.workMap.events.map(e => <li key={e} className="flex gap-2"><span>-</span> {e}</li>)}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Timelines</h4>
                <ul className="text-xs space-y-1.5 font-medium text-slate-700 mono">
                  {report.workMap.timelines.map(e => <li key={e} className="flex gap-2 text-indigo-600"><span>•</span> {e}</li>)}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Decisions</h4>
                <ul className="text-xs space-y-1.5 font-medium text-slate-700 mono">
                  {report.workMap.decisions.map(e => <li key={e} className="flex gap-2"><span>?</span> {e}</li>)}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Dependencies</h4>
                <ul className="text-xs space-y-1.5 font-medium text-slate-700 mono">
                  {report.workMap.dependencies.map(e => <li key={e} className="flex gap-2 text-amber-600"><span>→</span> {e}</li>)}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1">Ownership</h4>
                <ul className="text-xs space-y-1.5 font-medium text-slate-700 mono">
                  {report.workMap.ownership.map(e => <li key={e} className="flex gap-2"><span>@</span> {e}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Analysis Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="sticky top-8 space-y-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-2">Risk Taxonomy</h3>
            {LENSES.map(lens => {
              const findingsCount = getFindingsForTab(lens.id).length;
              return (
                <button
                  key={lens.id}
                  onClick={() => setActiveTab(lens.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group ${
                    activeTab === lens.id 
                      ? 'bg-white shadow-sm border border-slate-200 text-indigo-700 ring-1 ring-indigo-500/10' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-xs font-bold ${activeTab === lens.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {lens.label}
                  </span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded min-w-[20px] text-center ${
                    findingsCount > 0 
                      ? (activeTab === lens.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600') 
                      : 'bg-slate-100 text-slate-300'
                  }`}>
                    {findingsCount}
                  </span>
                </button>
              );
            })}
            
            {/* Suggested Tools Button */}
            <div className="pt-6">
              <button 
                onClick={() => setIsToolsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 group"
              >
                <Wrench size={16} className="group-hover:rotate-12 transition-transform" />
                Suggested Tools
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              {LENSES.find(l => l.id === activeTab)?.label}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {LENSES.find(l => l.id === activeTab)?.description}
            </p>
          </div>

          <div className="space-y-6">
            {getFindingsForTab(activeTab).length > 0 ? (
              getFindingsForTab(activeTab)
                .sort((a, b) => b.score - a.score)
                .map(finding => (
                  <RiskCard key={finding.id} finding={finding} />
                ))
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No findings detected in this lens</p>
                <p className="text-xs text-slate-400 mt-2">The scanner found no specific risks relating to this taxonomy category for your workflow.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <SuggestedToolsModal 
        isOpen={isToolsModalOpen} 
        onClose={() => setIsToolsModalOpen(false)} 
        tools={report.suggestedTools || []}
      />
    </div>
  );
};
