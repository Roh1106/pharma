import React, { useState } from 'react';
import { AntibioticRecord } from '../data/amrData';
import { Bot, Send, X, Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  antibiotic: AntibioticRecord;
  language: 'en' | 'mr';
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  antibiotic,
  language,
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickQuestionsEn = [
    `What are the most evidence-based alternative antibiotics from the dataset for ${antibiotic.name}?`,
    `Explain how the resistance genes (${antibiotic.resistanceGenes}) molecularly compromise ${antibiotic.name}.`,
    `How should ${antibiotic.name} dosage be adjusted for renal or hepatic impairment?`,
    `What is the clinical role of ${antibiotic.name} in hospital antimicrobial stewardship (AMS)?`,
  ];

  const quickQuestionsMr = [
    `${antibiotic.name} साठी डेटाशीटमधील सर्वात उत्तम पर्यायी औषधे कोणती आहेत?`,
    `${antibiotic.resistanceGenes} या जनुकांमुळे औषधाचा प्रभाव कसा नष्ट होतो?`,
    `किडनी किंवा लिव्हरच्या रुग्णांमध्ये ${antibiotic.name} चा डोस कसा ठरवावा?`,
    `अनावश्यक वापर टाळण्यासाठी वैद्यकीय मार्गदर्शक तत्त्वे काय आहेत?`,
  ];

  const quickQuestions = language === 'mr' ? quickQuestionsMr : quickQuestionsEn;

  const handleAsk = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/ai-clinical-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          antibioticName: antibiotic.name,
          clinicalQuestion: q,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get clinical guidance');
      }

      setResponse(data.guidance);
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to connect to AI Clinical Consultant. Please check your network or API keys.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
              <Bot className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'mr' ? 'AI वैद्यकीय सल्लागार' : 'AMR Clinical AI Consultant'}
              </h3>
              <p className="text-xs text-blue-200">
                Grounded on {antibiotic.name} AMR Dataset & Stewardship Guidelines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Drug Context pill */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">{antibiotic.name}</span>
              <span className="text-slate-500 ml-1.5">
                ({antibiotic.drugClass}) · Microorganism: {antibiotic.microorganism}
              </span>
            </div>
            <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-semibold text-[11px]">
              {antibiotic.resistanceGenes}
            </span>
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              {language === 'mr' ? 'त्वरित विचारलेले प्रश्न:' : 'Suggested Clinical Queries:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 transition-colors leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">
                Analyzing dataset, resistance mutations, and clinical stewardship evidence...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Clinical AI Notice:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Response Box */}
          {response && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider pb-2 border-b border-slate-200">
                <Sparkles className="w-4 h-4" />
                <span>Evidence-Based Clinical Guidance</span>
              </div>
              <div className="whitespace-pre-line font-normal">{response}</div>
            </div>
          )}
        </div>

        {/* Footer input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'या औषधाबद्दल कोणताही वैद्यकीय प्रश्न विचारा...'
                  : 'Ask any clinical scenario or dosing question about this antibiotic...'
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Consult</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
