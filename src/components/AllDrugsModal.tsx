import React, { useState } from 'react';
import { AntibioticRecord, AMR_DATASET } from '../data/amrData';
import { X, Search, ChevronRight } from 'lucide-react';

interface AllDrugsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDrug: (drug: AntibioticRecord) => void;
  language: 'en' | 'mr';
}

export const AllDrugsModal: React.FC<AllDrugsModalProps> = ({
  isOpen,
  onClose,
  onSelectDrug,
  language,
}) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = AMR_DATASET.filter((d) => {
    const q = filter.toLowerCase().trim();
    return (
      d.name.toLowerCase().includes(q) ||
      d.nameMr.includes(q) ||
      d.microorganism.toLowerCase().includes(q) ||
      d.drugClass.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'mr' ? 'सर्व ५० प्रतिजैविके (All 50 Antibiotics)' : 'All 50 Antibiotics in Dataset'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'माहिती पाहण्यासाठी कोणत्याही औषधावर क्लिक करा' : 'Click any antibiotic to view complete details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name, class, organism..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.map((drug) => (
            <button
              key={drug.id}
              onClick={() => {
                onSelectDrug(drug);
                onClose();
              }}
              className="w-full px-5 py-3 text-left hover:bg-blue-50/80 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {drug.id}
                </span>
                <div>
                  <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700">
                    {drug.name}{' '}
                    <span className="text-xs font-medium text-slate-500">
                      ({drug.nameMr})
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {drug.drugClass} · <span className="italic">{drug.microorganism}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {drug.resistanceCases && (
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 hidden sm:inline-block">
                    {drug.resistanceCases.toLocaleString()} cases
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
          <span>Showing {filtered.length} of 50 antibiotics</span>
          <span>From AMR Data Sheet</span>
        </div>
      </div>
    </div>
  );
};
