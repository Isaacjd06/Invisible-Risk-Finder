
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, UserPlus, AlertCircle, User } from 'lucide-react';

interface Props {
  onSignUpSuccess: () => void;
  onBack: () => void;
}

export const SignUpScreen: React.FC<Props> = ({ onSignUpSuccess, onBack }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Identification required: Please provide your full name.");
      return;
    }

    // Forensic-grade verification logic
    if (password.length < 8) {
      setError("Security requirement: Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Integrity mismatch: Security passwords do not align.");
      return;
    }

    // Initialize signup process
    onSignUpSuccess();
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const mismatchDetected = password && confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-10">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-6 shadow-xl shadow-indigo-100">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
              Initialize Forensic Credentials
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operator Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identifier</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Create a strong password"
                  className={`w-full pl-11 pr-4 py-4 bg-slate-50 border rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-medium text-sm ${
                    mismatchDetected ? 'border-rose-200 focus:ring-rose-600/10' : 'border-slate-200 focus:ring-indigo-600/20 focus:border-indigo-600'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <ShieldCheck size={18} className={passwordsMatch ? 'text-emerald-500' : mismatchDetected ? 'text-rose-500' : ''} />
                </div>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Repeat your password"
                  className={`w-full pl-11 pr-4 py-4 bg-slate-50 border rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-medium text-sm ${
                    passwordsMatch ? 'border-emerald-200 focus:ring-emerald-600/10 focus:border-emerald-500' : 
                    mismatchDetected ? 'border-rose-200 focus:ring-rose-600/10 focus:border-rose-500' : 
                    'border-slate-200 focus:ring-indigo-600/20 focus:border-indigo-600'
                  }`}
                  required
                />
              </div>
              {mismatchDetected && (
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-top-1">
                  Mismatch Detected: Tokens do not align
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl animate-in slide-in-from-top-2">
                <AlertCircle size={14} className="text-rose-500 flex-shrink-0" />
                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest leading-tight">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={mismatchDetected}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 group mt-2 ${
                mismatchDetected ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-indigo-100'
              }`}
            >
              Initialize Profile
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 px-10 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
