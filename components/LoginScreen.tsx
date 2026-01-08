
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, UserPlus } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onBack: () => void;
  onNavigateSignUp: () => void;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184L12.048 13.56c-.806.54-1.836.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.708a5.41 5.41 0 010-3.416V4.96H.957a8.991 8.991 0 000 8.08l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
  </svg>
);

export const LoginScreen: React.FC<Props> = ({ onLoginSuccess, onBack, onNavigateSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-10">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-6 shadow-xl shadow-indigo-100">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              System Authorization
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
              Diagnostic Credentials Required
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
            >
              Authorize Access
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={onNavigateSignUp}
              className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-[0.2em]"
            >
              <UserPlus size={14} />
              Don't have an account? Sign Up
            </button>
          </div>

          <div className="relative my-10 text-center">
            <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-slate-100"></div>
            <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Or Continue With
            </span>
          </div>

          <button
            onClick={onLoginSuccess}
            className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            Google Account
          </button>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 px-10 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Back to Input Module
          </button>
        </div>
      </div>
    </div>
  );
};
