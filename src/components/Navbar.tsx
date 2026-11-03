import React from 'react';
import { ShieldCheck, FileText, Globe, ListFilter } from 'lucide-react';

interface NavbarProps {
  language: 'en' | 'mr';
  setLanguage: (lang: 'en' | 'mr') => void;
  onOpenPdf: () => void;
  onOpenAllDrugs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  onOpenPdf,
  onOpenAllDrugs,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Simple Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              AMR Guide
            </h1>
            <p className="text-[11px] text-slate-500">
              {language === 'mr' ? 'प्रतिजैविक व पर्यायी औषधे माहिती' : 'Antibiotics & Alternatives Information'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Browse all 50 button */}
          <button
            onClick={onOpenAllDrugs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ListFilter className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'mr' ? 'सर्व ५० औषधे पहा' : 'View All 50 Drugs'}</span>
          </button>

          {/* View PDF */}
          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="View original data sheet PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">
              {language === 'mr' ? 'मूळ डेटाशीट (PDF)' : 'Source PDF'}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
