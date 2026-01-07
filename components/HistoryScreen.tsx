
import React from 'react';
// Added RiskFinding to imports to resolve typing issues in the table calculation
import { ScanReport, RiskFinding } from '../types';
import { History, Clock, ChevronRight, Search } from 'lucide-react';

interface Props {
  reports: ScanReport[];
  onSelectReport: (report: ScanReport) => void;
  onNewScan: () => void;
}

export const HistoryScreen: React.FC<Props> = ({ reports, onSelectReport, onNewScan }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4">
            <History className="text-slate-300" size={40} />
            Diagnostic Archive
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Review, compare, and track workflow stability over time.</p>
        </div>
        <button
          onClick={onNewScan}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
        >
          New Risk Scan
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">
        {reports.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Workflow Process</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Diagnostic Timestamp</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Risk Profile</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Max Risk Score</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => {
                // Fix: Explicitly cast to RiskFinding[] and pre-calculate maxScore to avoid 'unknown' type errors
                const allFindings = Object.values(report.sections).flat() as RiskFinding[];
                const maxScore = allFindings.length > 0 ? Math.max(...allFindings.map(r => r.score)) : 0;

                return (
                  <tr 
                    key={report.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => onSelectReport(report)}
                  >
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900 block group-hover:text-indigo-600 transition-colors">{report.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">ID: {report.id}</span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        {report.timestamp}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${
                        report.overallProfile === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                        report.overallProfile === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {report.overallProfile} RISK
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${report.overallProfile === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${maxScore}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-sm font-black text-slate-700">
                          {maxScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-slate-300 group-hover:text-indigo-600 transition-colors transform group-hover:translate-x-1 duration-200">
                        <ChevronRight size={24} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-300 mb-8">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Archived Scans</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">Your diagnostic history will appear here once you've completed your first workflow risk scan.</p>
          </div>
        )}
      </div>
      
      <div className="mt-16 text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-[0.3em]">Invisible Risk Engine Integrity</h3>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium italic">
          "The diagnostic machine is designed for consistency. By tracking your scores over time, you can objectively measure how process changes impact your overall risk profile across silent failure points, memory reliance, and scaling fragility."
        </p>
      </div>
    </div>
  );
};
