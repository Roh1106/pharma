import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { AntibioticDetail } from './components/AntibioticDetail';
import { PdfViewerModal } from './components/PdfViewerModal';
import { AllDrugsModal } from './components/AllDrugsModal';
import { AMR_DATASET, AntibioticRecord } from './data/amrData';

export default function App() {
  // Start with Ciprofloxacin (#2) or Azithromycin (#1)
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<AntibioticRecord>(AMR_DATASET[1]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  const [isAllDrugsOpen, setIsAllDrugsOpen] = useState<boolean>(false);

  // When user clicks on an alternative antibiotic from the dossier
  const handleSelectAlternative = (drugName: string) => {
    const matched = AMR_DATASET.find(
      (d) =>
        d.name.toLowerCase() === drugName.toLowerCase() ||
        drugName.toLowerCase().includes(d.name.toLowerCase()) ||
        d.name.toLowerCase().includes(drugName.toLowerCase())
    );

    if (matched) {
      setSelectedAntibiotic(matched);
      setSearchQuery(matched.name);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSearchQuery(drugName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Clean Navigation Bar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onOpenPdf={() => setIsPdfOpen(true)}
        onOpenAllDrugs={() => setIsAllDrugsOpen(true)}
      />

      {/* 2. Main Search & Antibiotic Details */}
      <main className="flex-1 pb-16">
        {/* Simple Search Input */}
        <SearchHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedAntibiotic={selectedAntibiotic}
          setSelectedAntibiotic={setSelectedAntibiotic}
          language={language}
        />

        {/* 4 Core Sections for Selected Antibiotic */}
        <AntibioticDetail
          antibiotic={selectedAntibiotic}
          onSelectAlternative={handleSelectAlternative}
          language={language}
        />
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-1">
          <p className="font-semibold text-slate-700">
            AMR Shield · Combating Antimicrobial Resistance (प्रतिजैविक प्रतिकार लढा)
          </p>
          <p>
            Data sourced from AMR Data Sheet (50 Antibiotics, Microorganisms, Resistance Genes & Alternatives).
          </p>
        </div>
      </footer>

      {/* Simple PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        language={language}
      />

      {/* All 50 Drugs Quick Picker Modal */}
      <AllDrugsModal
        isOpen={isAllDrugsOpen}
        onClose={() => setIsAllDrugsOpen(false)}
        onSelectDrug={(drug) => {
          setSelectedAntibiotic(drug);
          setSearchQuery(drug.name);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />
    </div>
  );
}
