
import React from 'react';
import { AppView } from '../types';
import { ShieldCheck, History, Info } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Layout: React.FC<Props> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('input')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-indigo-600 text-white p-1 rounded-md">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-lg uppercase">
              Invisible <span className="text-indigo-600">Risk</span> Finder
            </span>
          </button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                currentView === 'history' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <History size={16} />
              History
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-help group relative">
              <Info size={14} />
              Diagnostic v1
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 text-white p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl text-left normal-case tracking-normal z-50">
                <p className="font-bold text-xs border-b border-slate-700 pb-2 mb-2">Technical Insight</p>
                <p className="text-[10px] leading-relaxed text-slate-300">
                  This system performs a deep forensic audit of your workflow using advanced causal modeling to find risks that software tools alone cannot detect, then suggests the optimal automation stack to solve them.
                </p>
              </div>
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-[#f8fafc]">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2023 WORKFLOW RISK SCANNER | NARROW DIAGNOSTIC UTILITY
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy Policy</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Ethics</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
