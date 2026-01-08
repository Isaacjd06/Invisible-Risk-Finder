
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

  // Clear warning if user logs in
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
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Diagnostic Input
        </button>
      </div>

      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 border border-indigo-100">
          <Zap size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
          Diagnostic Credits
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          Power your workflow audits with deep forensic intelligence. Each credit unlocks a full diagnostic scan and causal risk report.
        </p>
      </header>

      {showLoginWarning && !isLoggedIn && (
        <div className="mb-12 max-w-3xl mx-auto bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-rose-100 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
              <UserPlus size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Authorization Required</p>
              <p className="text-sm font-bold text-rose-900 uppercase tracking-widest leading-tight">
                Please log in to proceed with your purchase.
              </p>
            </div>
          </div>
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-indigo-100"
          >
            <Lock size={14} />
            Log in Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-10 rounded-[2.5rem] border-2 transition-all duration-300 ${
              plan.recommended 
                ? 'bg-slate-900 border-slate-800 text-white shadow-2xl scale-105 z-10' 
                : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200 shadow-sm'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                Most Effective
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${plan.recommended ? 'text-indigo-400' : 'text-slate-400'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className={`text-sm font-bold ${plan.recommended ? 'text-slate-400' : 'text-slate-400'}`}>USD</span>
              </div>
              <p className={`text-sm font-medium ${plan.recommended ? 'text-slate-300' : 'text-slate-500'}`}>
                {plan.description}
              </p>
            </div>

            <div className={`h-px w-full mb-8 ${plan.recommended ? 'bg-white/10' : 'bg-slate-100'}`} />

            <div className="flex-1 space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded ${plan.recommended ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Zap size={14} fill="currentColor" />
                </div>
                <span className="font-black text-lg tracking-tight">{plan.credits} Diagnostic Credits</span>
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium">
                    <Check size={18} className={plan.recommended ? 'text-emerald-400' : 'text-emerald-500'} />
                    <span className={plan.recommended ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handlePurchaseAttempt(plan.credits)}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                plan.recommended
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-950/50'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-100'
              } ${!isLoggedIn ? 'opacity-90' : ''}`}
            >
              {!isLoggedIn && <Lock size={16} className="opacity-50" />}
              Purchase {plan.credits} Credits
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-6 max-w-3xl mx-auto">
        <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
          <Info size={24} />
        </div>
        <div>
          <h4 className="text-amber-900 font-black text-sm uppercase tracking-widest mb-1">Preview Environment Disclaimer</h4>
          <p className="text-amber-700 text-sm font-medium leading-relaxed">
            Real checkout is currently disabled. In this preview mode, clicking "Purchase" will simulate a successful transaction by immediately adding credits to your account for testing purposes once logged in.
          </p>
        </div>
      </div>
    </div>
  );
};
