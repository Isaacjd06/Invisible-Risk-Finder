
import React from 'react';
import { AppView } from '../types';
import { ShieldCheck, History, Info, Zap, LogOut, User, Plus } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  credits: number;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<Props> = ({ 
  children, 
  currentView, 
  onNavigate, 
  credits, 
  isLoggedIn, 
  onLogin, 
  onLogout 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('input')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-indigo-600 text-white p-1 rounded-md shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black text-indigo-600 tracking-tighter text-lg uppercase">
              Invisible Risk Finder
            </span>
          </button>
          
          <div className="flex items-center gap-6">
            {/* Common Navigation Items */}
            <button 
              onClick={() => onNavigate('credits')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                currentView === 'credits' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pricing
            </button>

            {isLoggedIn ? (
              <>
                {/* Interactive Credits Indicator */}
                <button 
                  onClick={() => onNavigate('credits')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all hover:bg-slate-100 ${
                    currentView === 'credits' ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <Zap size={10} className={`${credits > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">
                    Credits: <span className={credits > 0 ? 'text-indigo-600' : 'text-slate-400'}>{credits}</span>
                  </span>
                  <Plus size={10} className="text-indigo-500" />
                </button>

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

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200">
                    <User size={16} />
                  </div>
                  {currentView !== 'report' && (
                    <button 
                      onClick={onLogout}
                      className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest transition-colors"
                    >
                      <LogOut size={12} />
                      Log out
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={onLogin}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-indigo-100"
                >
                  Log in
                </button>
              </>
            )}

            <div className="h-4 w-px bg-slate-200"></div>

            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-help group relative">
              <Info size={14} />
              Diagnostic v1
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 text-white p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl text-left normal-case tracking-normal z-50">
                <p className="font-bold text-xs border-b border-white/10 pb-2 mb-2">Technical Insight</p>
                <p className="text-[10px] leading-relaxed text-slate-300">
                  This system performs a deep forensic audit of your workflow using advanced causal modeling to find risks that software tools alone cannot detect.
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
            © 2025 WORKFLOW RISK SCANNER | NARROW DIAGNOSTIC UTILITY
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Privacy Policy</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Diagnostic Ethics</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
