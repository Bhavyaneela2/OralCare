import React from 'react';
import { ToothLogo } from './ToothLogo';
import { Sparkles, FileText, ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';

export const FooterBanner: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-5 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-sm">
        <ToothLogo size={36} />

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>AI-Powered Dental NLP</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>X-ray Analysis & Reports</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure & Private Health Records</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Role-Based Access</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/oralcare-dentalnlp-x.zip"
            download="oralcare-dentalnlp-x.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            title="Download full project source code ZIP"
          >
            <span>Download Project ZIP</span>
          </a>

          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50/80 px-3.5 py-1.5 rounded-full border border-teal-200">
            <HeartHandshake className="w-4 h-4 text-teal-600" />
            <span>Better Tools. Better Care. Healthier Smiles.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
