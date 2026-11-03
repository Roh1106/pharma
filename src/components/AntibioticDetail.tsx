import React, { useState } from 'react';
import {
  AntibioticRecord,
  AMR_DATASET
} from '../data/amrData';
import {
  Pill,
  RefreshCw,
  Stethoscope,
  Dna,
  Check,
  Copy,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface AntibioticDetailProps {
  antibiotic: AntibioticRecord;
  onSelectAlternative: (drugName: string) => void;
  language: 'en' | 'mr';
}

export const AntibioticDetail: React.FC<AntibioticDetailProps> = ({
  antibiotic,
  onSelectAlternative,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  // Match alternative drugs from dataset
  const matchedAlternatives = antibiotic.alternativeList.map((alt) => {
    const cleanName = alt.split('(')[0].trim();
    const existing = AMR_DATASET.find(
      (d) =>
        d.name.toLowerCase() === cleanName.toLowerCase() ||
        cleanName.toLowerCase().includes(d.name.toLowerCase()) ||
        d.name.toLowerCase().includes(cleanName.toLowerCase())
    );
    return {
      raw: alt,
      cleanName,
      matchedDrug: existing || null,
    };
  });

  const handleCopy = () => {
    const text = `${antibiotic.name} (${antibiotic.nameMr})
Class: ${antibiotic.drugClass}
Target Organism: ${antibiotic.microorganism}
Alternatives: ${antibiotic.alternativeAntibioticsRaw}
Resistance Genes: ${antibiotic.resistanceGenes}
Diagnostic Test: ${antibiotic.diagnosticTest}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Main Drug Title & Basic Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                #{antibiotic.id} of 50
              </span>
              <span className="text-xs font-medium text-slate-500">
                {antibiotic.drugClass}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {antibiotic.name}{' '}
              <span className="text-blue-600 text-xl font-bold">
                ({antibiotic.nameMr})
              </span>
            </h1>
          </div>

          <button
            onClick={handleCopy}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Mechanism of Action */}
        <div className="mt-4 space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {language === 'mr' ? 'कार्यपद्धती (Mechanism of Action):' : 'How It Works (Mechanism):'}
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">
            {language === 'mr' ? antibiotic.mechanismOfActionMr : antibiotic.mechanismOfAction}
          </p>
          {language === 'mr' && (
            <p className="text-xs text-slate-500 italic mt-1">
              English: {antibiotic.mechanismOfAction}
            </p>
          )}

          {antibiotic.brandNames.length > 0 && (
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              <strong className="text-slate-600">Common Brands:</strong> {antibiotic.brandNames.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* 2. Other Available Antibiotics (Direct from Data Set) */}
      <div className="bg-emerald-50/70 rounded-xl border-2 border-emerald-300/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-5 h-5 text-emerald-700 shrink-0" />
          <h2 className="text-lg font-bold text-emerald-950">
            {language === 'mr' ? 'पर्यायी प्रतिजैविके (Alternative Antibiotics)' : 'Alternative Antibiotics Available'}
          </h2>
        </div>

        <p className="text-xs text-emerald-800 mb-3">
          {language === 'mr'
            ? 'डेटाशीटनुसार या औषधाऐवजी वापरता येणारी इतर पर्यायी औषधे:'
            : 'Recommended alternatives from the AMR dataset:'}
        </p>

        {/* Exact text from PDF */}
        <div className="bg-white p-3.5 rounded-lg border border-emerald-200 text-sm font-semibold text-emerald-900 mb-3 shadow-xs">
          "{antibiotic.alternativeAntibioticsRaw}"
        </div>

        {/* Clickable pill buttons to easily switch */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-emerald-900 block">
            {language === 'mr' ? 'माहिती पाहण्यासाठी पर्यायावर क्लिक करा:' : 'Click to inspect any alternative:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {matchedAlternatives.map((alt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (alt.matchedDrug) {
                    onSelectAlternative(alt.matchedDrug.name);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                  alt.matchedDrug
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs cursor-pointer'
                    : 'bg-white text-emerald-900 border border-emerald-200 cursor-default'
                }`}
              >
                <span>{alt.raw}</span>
                {alt.matchedDrug && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Effects for Each Clinical Condition */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" />
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'mr' ? 'आजारानुसार परिणाम व प्रभाव (Effects for Each Condition)' : 'Effects for Each Clinical Condition'}
          </h2>
        </div>

        <div className="space-y-3">
          {antibiotic.conditionsAndEffects.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-bold text-sm text-slate-900">
                  {item.condition}{' '}
                  <span className="text-blue-700 font-medium text-xs">
                    ({item.conditionMr})
                  </span>
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded w-fit">
                  {item.efficacyRate}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="text-slate-800">Effect:</strong> {language === 'mr' ? item.effectMr : item.effect}
              </p>

              <p className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200/60">
                <strong className="text-slate-700">Note:</strong> {item.clinicalNote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Potential Resistance Patterns Identified */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Dna className="w-5 h-5 text-indigo-600 shrink-0" />
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'mr' ? 'प्रतिरोध माहिती व जनुके (Resistance Patterns Identified)' : 'Potential Resistance Patterns Identified'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Target Microorganism */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Target Micro-organism:</span>
            <p className="text-sm font-bold text-slate-900 italic mt-0.5">
              {antibiotic.microorganism}
            </p>
            <p className="text-xs text-slate-500">{antibiotic.microorganismMr}</p>
          </div>

          {/* Resistance Cases */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Resistance Cases in Data Sheet:</span>
            {antibiotic.resistanceCases !== null ? (
              <p className="text-base font-extrabold text-rose-600 mt-0.5">
                {antibiotic.resistanceCases.toLocaleString()} cases
              </p>
            ) : (
              <p className="text-xs font-semibold text-amber-700 mt-0.5">
                Recorded under active surveillance
              </p>
            )}
          </div>
        </div>

        {/* Resistance Genes */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700">Resistance Gene(s):</span>
          <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 font-mono text-xs font-bold text-indigo-950">
            {antibiotic.resistanceGenes}
          </div>
        </div>

        {/* Diagnostic Test */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700">Diagnostic Laboratory Test:</span>
          <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {antibiotic.diagnosticTest} ({antibiotic.diagnosticTestMr})
          </p>
        </div>

        {/* Resistance Mechanism explanation */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs sm:text-sm">
          <span className="font-bold text-slate-800 block">How Resistance Occurs:</span>
          <p className="text-slate-700 leading-relaxed">
            {language === 'mr' ? antibiotic.resistancePatternSummaryMr : antibiotic.resistancePatternSummary}
          </p>
        </div>
      </div>
    </div>
  );
};
