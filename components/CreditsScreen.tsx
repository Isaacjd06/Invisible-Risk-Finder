
import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Check, Info, Lock, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';

interface Props {
  onPurchase: (amount: number) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onBack: () => void;
}

export const CreditsScreen: React.FC<Props> = ({ onPurchase, isLoggedIn, onLogin, onBack }) => {
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowLoginWarning(false);
    }
  }, [isLoggedIn]);

  const handlePurchaseAttempt = (amount: number) => {
    if (!isLoggedIn) {
      setShowLoginWarning(true);
      return;
    }
    onPurchase(amount);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: '$7.99',
      credits: 3,
      description: 'Perfect for a single-role diagnostic.',
      features: [
        '3 Deep Forensic Scans',
        'Taxonomy-Mapped Insights',
        'Standard Engine Priority',
        '30-Day History Access'
      ],
      color: 'indigo'
    },
    {
      id: 'operator',
      name: 'Operator Pack',
      price: '$17.99',
      credits: 10,
      description: 'Best for multi-team audits and deep forensic scaling.',
      features: [
        '10 Deep Forensic Scans',
        'Full History Archive',
        'Highest Engine Priority',
        'Detailed Automation Roadmap',
        'Structural Causal Modeling'
      ],
      color: 'slate',
      recommended: true
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-16 px-4 sm:px-6">
      <div className="mb-10">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Input Module
        </button>
      </div>

      <header className="text-center mb-12 sm:mb-20">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 border border-indigo-100 shadow-sm animate-in zoom-in">
          <Zap size={28} className="sm:w-8 sm:h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase">
          Diagnostic Credits
        </h1>
        <p className="text-slate-500 text-sm sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-4">
          Power your workflow audits with deep forensic intelligence. Each credit unlocks a full diagnostic scan and causal risk report.
        </p>
      </header>

      {showLoginWarning && !isLoggedIn && (
        <div className="mb-12 max-w-3xl mx-auto bg-rose-50 border border-rose-200 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-rose-100 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
              <UserPlus size={24} />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Authorization Required</p>
              <p className="text-xs sm:text-sm font-bold text-rose-900 uppercase tracking-widest leading-tight">
                Please log in to proceed with your purchase.
              </p>
            </div>
          </div>
          <button 
            onClick={onLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-indigo-100"
          >
            <Lock size={14} />
            Log in Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-8 sm:p-10 rounded-[2.5rem] border-2 transition-all duration-300 ${
              plan.recommended 
                ? 'bg-slate-900 border-slate-800 text-white shadow-2xl md:scale-105 z-10' 
                : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200 shadow-sm'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl">
                Most Effective
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 ${plan.recommended ? 'text-indigo-400' : 'text-slate-400'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className={`text-[10px] sm:text-sm font-bold ${plan.recommended ? 'text-slate-400' : 'text-slate-400'}`}>USD</span>
              </div>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${plan.recommended ? 'text-slate-300' : 'text-slate-500'}`}>
                {plan.description}
              </p>
            </div>

            <div className={`h-px w-full mb-8 ${plan.recommended ? 'bg-white/10' : 'bg-slate-100'}`} />

            <div className="flex-1 space-y-4 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-1.5 rounded ${plan.recommended ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Zap size={16} fill="currentColor" />
                </div>
                <span className="font-black text-lg sm:text-xl tracking-tight">{plan.credits} Scans</span>
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-medium">
                    <Check size={18} className={`shrink-0 ${plan.recommended ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <span className={plan.recommended ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handlePurchaseAttempt(plan.credits)}
              className={`w-full py-4 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                plan.recommended
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-950/50'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-100'
              }`}
            >
              {!isLoggedIn && <Lock size={14} className="opacity-50" />}
              Purchase Pack
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-[2rem] bg-amber-50 border border-amber-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-3xl mx-auto shadow-sm">
        <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
          <Info size={24} />
        </div>
        <div className="text-center sm:text-left">
          <h4 className="text-amber-900 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-2">Diagnostic Disclaimer</h4>
          <p className="text-amber-700 text-[11px] sm:text-sm font-medium leading-relaxed">
            Payment processing is simulated for this preview environment. Selecting "Purchase" will immediately credit your account for testing once authorization is established.
          </p>
        </div>
      </div>
    </div>
  );
};
