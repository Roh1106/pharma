import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';
import { AntibioticRecord, AMR_DATASET } from '../data/amrData';

interface SearchHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAntibiotic: AntibioticRecord;
  setSelectedAntibiotic: (item: AntibioticRecord) => void;
  language: 'en' | 'mr';
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedAntibiotic,
  setSelectedAntibiotic,
  language,
}) => {
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Suggestions based on search
  const filteredSuggestions = searchQuery.trim()
    ? AMR_DATASET.filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.nameMr.includes(q) ||
          item.drugClass.toLowerCase().includes(q) ||
          item.microorganism.toLowerCase().includes(q) ||
          item.brandNames.some((b) => b.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpenSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (drug: AntibioticRecord) => {
    setSelectedAntibiotic(drug);
    setSearchQuery(drug.name);
    setIsOpenSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsOpenSuggestions(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const popularDrugs = [
    'Ciprofloxacin',
    'Ceftriaxone',
    'Meropenem',
    'Vancomycin',
    'Azithromycin',
    'Piperacillin tazobactam',
    'Levofloxacin',
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-6 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Simple Label */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {language === 'mr'
              ? 'प्रतिजैविकाचे नाव प्रविष्ट करा (Type Antibiotic Name)'
              : 'Enter Antibiotic Name'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'नाव टाका आणि सर्व माहिती, पर्यायी औषधे, आजारानुसार परिणाम व प्रतिकार माहिती एकाच जागी पहा.'
              : 'Instant information: alternatives from dataset, clinical condition effects, and resistance patterns.'}
          </p>
        </div>

        {/* Input Bar with Dropdown select */}
        <div ref={containerRef} className="relative">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpenSuggestions(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsOpenSuggestions(true);
                }}
                placeholder={
                  language === 'mr'
                    ? 'उदा. Ciprofloxacin, Azithromycin, Ceftriaxone, Meropenem...'
                    : 'Type name: Ciprofloxacin, Azithromycin, Ceftriaxone...'
                }
                className="w-full pl-11 pr-10 py-3 text-base bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-2 border-slate-200 focus:border-blue-600 rounded-xl outline-none font-medium text-slate-900 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick dropdown for all 50 */}
            <div className="relative sm:w-60">
              <select
                value={selectedAntibiotic.name}
                onChange={(e) => {
                  const drug = AMR_DATASET.find((d) => d.name === e.target.value);
                  if (drug) {
                    setSelectedAntibiotic(drug);
                    setSearchQuery(drug.name);
                    setIsOpenSuggestions(false);
                  }
                }}
                className="w-full py-3 px-3.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="" disabled>
                  {language === 'mr' ? 'किंवा यादीतून निवडा (१ ते ५०)' : 'Or pick from list (1-50)'}
                </option>
                {AMR_DATASET.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.id}. {d.name} ({d.microorganism.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Autocomplete dropdown suggestions */}
          {isOpenSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
              {filteredSuggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      ({item.nameMr}) · {item.drugClass}
                    </span>
                    <p className="text-xs text-slate-400 italic">
                      Target: {item.microorganism}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">
                    Select
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick click pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
          <span className="text-xs text-slate-400 mr-1">
            {language === 'mr' ? 'उदाहरणे:' : 'Quick pick:'}
          </span>
          {popularDrugs.map((drugName) => {
            const isCurrent = selectedAntibiotic.name.toLowerCase() === drugName.toLowerCase();
            return (
              <button
                key={drugName}
                onClick={() => {
                  const drug = AMR_DATASET.find((d) => d.name === drugName);
                  if (drug) {
                    setSelectedAntibiotic(drug);
                    setSearchQuery(drug.name);
                    setIsOpenSuggestions(false);
                  }
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 font-medium'
                }`}
              >
                {drugName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
