
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

const accentMapping: Record<string, { border: string, bg: string, text: string, lightBg: string }> = {
  rose: { border: 'hover:border-rose-200', bg: 'bg-rose-500', text: 'text-rose-500', lightBg: 'bg-rose-50/50' },
  amber: { border: 'hover:border-amber-200', bg: 'bg-amber-500', text: 'text-amber-500', lightBg: 'bg-amber-50/50' },
  violet: { border: 'hover:border-violet-200', bg: 'bg-violet-500', text: 'text-violet-500', lightBg: 'bg-violet-50/50' },
  indigo: { border: 'hover:border-indigo-200', bg: 'bg-indigo-500', text: 'text-indigo-500', lightBg: 'bg-indigo-50/50' },
  sky: { border: 'hover:border-sky-200', bg: 'bg-sky-500', text: 'text-sky-500', lightBg: 'bg-sky-50/50' },
  emerald: { border: 'hover:border-emerald-200', bg: 'bg-emerald-500', text: 'text-emerald-500', lightBg: 'bg-emerald-50/50' },
  orange: { border: 'hover:border-orange-200', bg: 'bg-orange-500', text: 'text-orange-500', lightBg: 'bg-orange-50/50' },
};

export const RiskCard: React.FC<{ finding: RiskFinding; accentColor?: string }> = ({ finding, accentColor = 'indigo' }) => {
  const styles = accentMapping[accentColor] || accentMapping.indigo;

  return (
    <div className={`group bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 ${styles.border}`}>
      <div className={`p-4 border-b border-slate-100 bg-white flex items-start justify-between relative`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${styles.bg} opacity-80`} />
        <div className="pl-1">
          <div className="flex items-center gap-2 mb-1">
             <ShieldAlert size={14} className={styles.text} />
             <h4 className="text-slate-900 font-black text-lg tracking-tight leading-tight">{finding.title}</h4>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <LevelBadge label="Likelihood" level={finding.likelihood} />
            <LevelBadge label="Impact" level={finding.impact} />
            <LevelBadge label="Visibility" level={finding.detectability} />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <section>
          <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-1.5">
            <AlertCircle size={12} className={styles.text} />
            Causal Mechanism
          </div>
          <p className="text-slate-800 text-xs font-medium leading-relaxed">{finding.whatCanGoWrong}</p>
        </section>

        <section className={`${styles.lightBg} p-3 rounded-lg border border-slate-100`}>
          <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-1">
            <Info size={12} />
            Consequence
          </div>
          <p className="text-slate-600 text-[11px] leading-snug italic">"{finding.whyItMatters}"</p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <section className="bg-white p-3 rounded-lg border border-slate-50 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-1">
              <Eye size={12} className={styles.text} />
              Failure Pattern
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{finding.howItFailsSilently}</p>
          </section>

          <section className="bg-white p-3 rounded-lg border border-slate-50 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-1">
              <ShieldAlert size={12} className="text-indigo-400" />
              Signal
            </div>
            <p className="text-indigo-900 text-[11px] leading-tight font-bold bg-indigo-50/50 p-1.5 rounded border border-indigo-50">
              {finding.earlySignal}
            </p>
          </section>
        </div>

        {finding.timeTrigger && (
          <section className="bg-amber-50/50 p-2 rounded-lg border border-amber-50 flex items-center gap-2">
            <Clock size={12} className="text-amber-600" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Threshold:</span>
              <p className="text-amber-900 text-[10px] font-mono font-bold">{finding.timeTrigger}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
