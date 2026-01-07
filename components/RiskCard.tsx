
import React from 'react';
import { RiskFinding, RiskLevel, Detectability } from '../types';
import { AlertCircle, Clock, Eye, Info, ShieldAlert } from 'lucide-react';

const LevelBadge = ({ level, label }: { level: RiskLevel | Detectability, label: string }) => {
  const colors = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-100',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Hidden: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  const colorClass = colors[level as keyof typeof colors] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm ${colorClass}`}>
      {label}: {level}
    </span>
  );
};

export const RiskCard: React.FC<{ finding: RiskFinding; accentColor?: string }> = ({ finding, accentColor = 'indigo' }) => {
  return (
    <div className={`group bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-${accentColor}-200`}>
      <div className={`p-5 border-b border-slate-100 bg-white flex items-start justify-between relative`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full bg-${accentColor}-500 opacity-80`} />
        <div className="pl-2">
          <div className="flex items-center gap-2 mb-1">
             <ShieldAlert size={14} className={`text-${accentColor}-500`} />
             <h4 className="text-slate-900 font-black text-xl tracking-tight leading-tight">{finding.title}</h4>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <LevelBadge label="Likelihood" level={finding.likelihood} />
            <LevelBadge label="Impact" level={finding.impact} />
            <LevelBadge label="Visibility" level={finding.detectability} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section>
          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <AlertCircle size={14} className={`text-${accentColor}-400`} />
            Causal Mechanism
          </div>
          <p className="text-slate-800 text-sm font-medium leading-relaxed">{finding.whatCanGoWrong}</p>
        </section>

        <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <Info size={14} />
            Forensic Consequence
          </div>
          <p className="text-slate-600 text-sm leading-relaxed italic">"{finding.whyItMatters}"</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <Eye size={14} className={`text-${accentColor}-400`} />
              Silent Failure Pattern
            </div>
            <p className="text-slate-600 text-[13px] leading-relaxed">{finding.howItFailsSilently}</p>
          </section>

          <section className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <ShieldAlert size={14} className="text-indigo-400" />
              Pre-Failure Signal
            </div>
            <p className="text-indigo-950 text-[13px] leading-relaxed font-bold bg-indigo-50/50 p-2 rounded border border-indigo-100">
              {finding.earlySignal}
            </p>
          </section>
        </div>

        {finding.timeTrigger && (
          <section className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex items-center gap-3">
            <Clock size={16} className="text-amber-600" />
            <div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Temporal Threshold</span>
              <p className="text-amber-900 text-xs font-mono font-bold">{finding.timeTrigger}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
