
import React from 'react';
import { ScanReport, RiskFinding } from '../types';
import { History, Clock, ChevronRight, Search, ShieldAlert } from 'lucide-react';

interface Props {
  reports: ScanReport[];
  onSelectReport: (report: ScanReport) => void;
  onNewScan: () => void;
}

export const HistoryScreen: React.FC<Props> = ({ reports, onSelectReport, onNewScan }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 sm:mb-16">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 flex items-center gap-4 tracking-tight">
            <History className="text-slate-300 flex-shrink-0" size={32} />
            Diagnostic Archive
          </h1>
          <p className="text-slate-500 mt-3 text-base sm:text-xl font-medium max-w-2xl leading-relaxed">
            Review, compare, and track workflow stability over time through historical forensic audits.
          </p>
        </div>
        <button
          onClick={onNewScan}
          className="bg-indigo-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] w-full md:w-auto"
        >
          New Risk Scan
        </button>
      </header>

      {reports.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-100">
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
                  const allFindings = Object.values(report.sections).flat() as RiskFinding[];
                  const maxScore = allFindings.length > 0 ? Math.max(...allFindings.map(r => r.score)) : 0;

                  return (
                    <tr 
                      key={report.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => onSelectReport(report)}
                    >
                      <td className="px-8 py-7">
                        <span className="font-black text-slate-900 block group-hover:text-indigo-600 transition-colors text-lg tracking-tight">{report.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">ID: {report.id}</span>
                      </td>
                      <td className="px-8 py-7 text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          {report.timestamp}
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${
                          report.overallProfile === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                          report.overallProfile === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {report.overallProfile} RISK
                        </span>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
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
                      <td className="px-8 py-7 text-right">
                        <button className="text-slate-300 group-hover:text-indigo-600 transition-colors transform group-hover:translate-x-1 duration-200">
                          <ChevronRight size={24} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="lg:hidden space-y-4">
            {reports.map((report) => {
              const allFindings = Object.values(report.sections).flat() as RiskFinding[];
              const maxScore = allFindings.length > 0 ? Math.max(...allFindings.map(r => r.score)) : 0;
              
              return (
                <div 
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm active:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-lg leading-tight">{report.name}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <Clock size={12} />
                        {report.timestamp}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border shrink-0 ${
                      report.overallProfile === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                      report.overallProfile === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {report.overallProfile}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <ShieldAlert size={14} className="text-slate-300" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Score</span>
                        <span className="font-mono font-black text-indigo-600">{maxScore}/100</span>
                      </div>
                    </div>
                    <div className="flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest gap-1">
                      View Report
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-20 sm:py-32 text-center bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-50 text-slate-300 mb-8 border border-slate-100 shadow-inner">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Archived Scans</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto px-6 text-sm sm:text-base leading-relaxed">Your diagnostic history will appear here once you've completed your first workflow risk scan.</p>
        </div>
      )}
      
      <div className="mt-16 text-center p-8 sm:p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
        <h3 className="text-[10px] font-black text-slate-800 mb-4 uppercase tracking-[0.3em]">Invisible Risk Engine Integrity</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium italic">
          "The diagnostic machine is designed for consistency. By tracking your scores over time, you can objectively measure how process changes impact your overall risk profile across silent failure points, memory reliance, and scaling fragility."
        </p>
      </div>
    </div>
  );
};
