
import React from 'react';
import { RiskFinding, RiskLevel, Detectability } from '../types';
import { AlertCircle, Clock, Eye, Info } from 'lucide-react';

const LevelBadge = ({ level, label }: { level: RiskLevel | Detectability, label: string }) => {
  const colors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Moderate: 'bg-amber-100 text-amber-800 border-amber-200',
    High: 'bg-red-100 text-red-800 border-red-200',
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Hidden: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const colorClass = colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${colorClass}`}>
      {label}: {level}
    </span>
  );
};

export const RiskCard: React.FC<{ finding: RiskFinding }> = ({ finding }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:border-slate-300 transition-colors">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
        <div>
          <h4 className="text-slate-900 font-bold text-lg mb-1">{finding.title}</h4>
          <div className="flex flex-wrap gap-2">
            <LevelBadge label="Likelihood" level={finding.likelihood} />
            <LevelBadge label="Impact" level={finding.impact} />
            <LevelBadge label="Detectability" level={finding.detectability} />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Risk Score</div>
          <div className={`text-2xl font-black ${finding.score > 80 ? 'text-red-600' : finding.score > 50 ? 'text-amber-600' : 'text-green-600'}`}>
            {finding.score}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <section>
          <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1.5">
            <AlertCircle size={14} />
            What can go wrong
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{finding.whatCanGoWrong}</p>
        </section>

        <section>
          <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1.5">
            <Info size={14} />
            Why it matters
          </div>
          <p className="text-slate-700 text-sm leading-relaxed italic">{finding.whyItMatters}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <section className="bg-slate-50 p-3 rounded border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1.5">
              <Eye size={14} />
              How it fails silently
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">{finding.howItFailsSilently}</p>
          </section>

          <section className="bg-slate-50 p-3 rounded border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1.5">
              <Info size={14} />
              Early signal to watch
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">{finding.earlySignal}</p>
          </section>
        </div>

        {finding.timeTrigger && (
          <section className="bg-amber-50 p-3 rounded border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
              <Clock size={14} />
              Time Trigger
            </div>
            <p className="text-amber-800 text-xs font-mono">{finding.timeTrigger}</p>
          </section>
        )}
      </div>
    </div>
  );
};
