import React, { useState } from 'react';
import {
  AntibioticRecord,
  AMR_DATASET,
  UNIQUE_MICROORGANISMS,
} from '../data/amrData';
import { Bug, ShieldCheck, AlertCircle, ChevronRight, Dna } from 'lucide-react';

interface PathogenViewProps {
  onSelectAntibiotic: (antibiotic: AntibioticRecord) => void;
  language: 'en' | 'mr';
}

export const PathogenView: React.FC<PathogenViewProps> = ({
  onSelectAntibiotic,
  language,
}) => {
  const [selectedPathogen, setSelectedPathogen] = useState<string>('Escherichia coli');

  // Antibiotics associated with selected pathogen
  const pathogenAntibiotics = AMR_DATASET.filter(
    (item) => item.microorganism === selectedPathogen
  );

  // Total recorded resistance cases for this pathogen in dataset
  const totalCasesForPathogen = pathogenAntibiotics.reduce(
    (acc, curr) => acc + (curr.resistanceCases || 0),
    0
  );

  const pathogenInfo: Record<
    string,
    { type: string; site: string; description: string; descriptionMr: string }
  > = {
    'Escherichia coli': {
      type: 'Gram-negative bacillus (Enterobacteriaceae)',
      site: 'Urinary tract, gastrointestinal, intra-abdominal, bloodstream',
      description:
        'Leading cause of community and hospital-acquired urinary tract infections and Gram-negative bacteremia. Exhibits severe resistance burden through CTX-M extended-spectrum beta-lactamases and gyrA fluoroquinolone target mutations.',
      descriptionMr:
        'मूत्रमार्ग संसर्ग (UTI) आणि रक्तातील संसर्गाचे मुख्य कारण. ESBL (blaCTX-M) आणि फ्लोरोक्विनोलोन (gyrA) प्रतिरोधाचे मोठे आव्हान.',
    },
    'Pseudomonas aeruginosa': {
      type: 'Gram-negative non-fermenting bacillus',
      site: 'Ventilator pneumonia, burns, cystic fibrosis, urinary, diabetic foot',
      description:
        'Notorious opportunistic nosocomial pathogen with intrinsic low membrane permeability, AmpC beta-lactamase, active efflux systems, and high susceptibility to carbapenemase acquisition (VIM, IMP, NDM).',
      descriptionMr:
        'रुग्णालयातील अत्यंत हट्टी जंतू; व्हेंटिलेटर न्यूमोनिया, भाजलेल्या जखमा व सिस्टिक फायब्रॉसिसमध्ये आढळतो. OprD छिद्रे बंद करून कार्बापेनेमला विरोध करतो.',
    },
    'Staphylococcus aureus': {
      type: 'Gram-positive coccus in clusters',
      site: 'Skin and soft tissue, bloodstream, heart valves, bone, prosthetic joints',
      description:
        'Virulent pathogen responsible for Methicillin-Resistant Staphylococcus aureus (MRSA). Resistance driven by altered penicillin-binding protein PBP2a (mecA), inducible MLS_B (erm), and van gene reprogramming.',
      descriptionMr:
        'त्वचेचे गळू, रक्ताचा संसर्ग, हृदयाच्या झडपा व हाडांचा दाह करणारा घातक जंतू (MRSA). mecA व erm जनुकांमुळे अनेक औषधांना दाद देत नाही.',
    },
    'Streptococcus pneumoniae': {
      type: 'Gram-positive lancet-shaped diplococcus',
      site: 'Pneumonia, otitis media, sinusitis, bacterial meningitis',
      description:
        'Major cause of community-acquired pneumonia and bacterial meningitis. Resistance mediated through altered PBPs, erm(B) ribosomal methylases, and mef(A/E) efflux pumps.',
      descriptionMr:
        'फुफ्फुसांचा दाह (न्यूमोनिया), कानाचा पू आणि मेंदूज्वरासाठी कारणीभूत. मॅक्रोलाइड्स आणि पेनिसिलिनविरुद्ध प्रतिकार निर्माण करतो.',
    },
    'Klebsiella pneumoniae': {
      type: 'Gram-negative encapsulated bacillus',
      site: 'Hospital-acquired pneumonia, urosepsis, intra-abdominal',
      description:
        'Prominent carbapenem-resistant Enterobacteriaceae (CRE) pathogen harboring plasmid-encoded serine carbapenemases (blaKPC) and metallo-beta-lactamases (blaNDM).',
      descriptionMr:
        'अतिदक्षता विभागातील अतिशय घातक सुपरबग. KPC आणि NDM जनुकांमुळे मेरोपेनेमसारखी शेवटची औषधेही निकामी ठरतात.',
    },
    'Mycobacterium tuberculosis': {
      type: 'Acid-fast bacillus (Slow-growing)',
      site: 'Pulmonary parenchyma, lymph nodes, meninges, spine',
      description:
        'Causative agent of Tuberculosis. Single point mutations in rpoB (RRDR region) cause rifampicin resistance, defining Multi-Drug Resistant Tuberculosis (MDR-TB).',
      descriptionMr:
        'क्षयरोगाचा (टीबी) जंतू. rpoB जनुकातील उत्परिवर्तनामुळे रिफाम्पिसिन प्रतिरोधी बनते (MDR-TB).',
    },
    'Bacteroides fragilis': {
      type: 'Anaerobic Gram-negative rod',
      site: 'Intra-abdominal abscesses, peritonitis, pelvic inflammatory disease',
      description:
        'Predominant anaerobic flora of the colon; produces cephalosporinases and metallo-beta-lactamases (cfiA) causing resistance to cephamycins.',
      descriptionMr:
        'आतड्यातील प्राणवायू नसलेला (एनारोबिक) जंतू; पोटातील गळू आणि पेरिटोनाइटिससाठी कारणीभूत.',
    },
    'Haemophilus influenzae': {
      type: 'Fastidious Gram-negative coccobacillus',
      site: 'Otitis media, sinusitis, acute exacerbations of chronic bronchitis',
      description:
        'Common respiratory pathogen; resistance mediated by TEM-1 beta-lactamases and BLNAR PBP-3 mutations.',
      descriptionMr:
        'मुलांमधील कान, सायनस आणि घशाचा संसर्ग करणारा जिवाणू; TEM एन्झाईम्स तयार करतो.',
    },
    'Streptococcus pyogenes': {
      type: 'Gram-positive streptococcus (Group A)',
      site: 'Pharyngotonsillitis, cellulitis, necrotizing fasciitis, scarlet fever',
      description:
        'Group A Strep; retains universal penicillin susceptibility but exhibits erm(B) macrolide resistance.',
      descriptionMr:
        'घशातील टॉन्सिल्स आणि मांस खाणाऱ्या संसर्गाचा जंतू; मॅक्रोलाइड्सविरुद्ध प्रतिकार दर्शवतो.',
    },
    'Mycobacterium avium': {
      type: 'Non-tuberculous mycobacterium (Atypical)',
      site: 'Disseminated disease in advanced HIV/AIDS, bronchiectasis',
      description:
        'Intracellular opportunistic mycobacterium resistant to standard antituberculars; requires clarithromycin/azithromycin and rifabutin regimens.',
      descriptionMr:
        'कमी प्रतिकारशक्ती असलेल्या (HIV) रुग्णांमध्ये होणारा दुर्मीळ संसर्ग.',
    },
  };

  const currentInfo = pathogenInfo[selectedPathogen] || {
    type: 'Bacterial Pathogen',
    site: 'Systemic / Localized',
    description: 'Pathogen under active AMR surveillance.',
    descriptionMr: 'सक्रिय प्रतिकार तपासणीखालील जिवाणू.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'mr'
              ? 'सूक्ष्मजीव-आधारित प्रतिकार विश्लेषण'
              : 'Pathogen-Centric AMR Profile & Therapeutics'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'mr'
              ? 'विशिष्ट जिवाणू निवडा आणि त्याच्याविरुद्ध कोणते प्रतिजैविक धोक्यात आहे व काय पर्याय आहेत ते पहा.'
              : 'Select a microorganism to analyze compromised antimicrobials, resistance gene signatures, and recommended therapeutic alternatives.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Total Pathogens:</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
            {UNIQUE_MICROORGANISMS.length} Species
          </span>
        </div>
      </div>

      {/* Pathogen Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {UNIQUE_MICROORGANISMS.map((microbe) => {
          const isSelected = selectedPathogen === microbe;
          const count = AMR_DATASET.filter((i) => i.microorganism === microbe).length;
          return (
            <button
              key={microbe}
              onClick={() => setSelectedPathogen(microbe)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bug className="w-4 h-4" />
              <span className="italic">{microbe}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count} drugs
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Pathogen Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 w-fit mb-2">
              <Bug className="w-3.5 h-3.5" />
              <span>{currentInfo.type}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 italic">
              {selectedPathogen}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Primary Infection Sites: {currentInfo.site}
            </p>
          </div>

          {totalCasesForPathogen > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-right">
              <span className="text-2xl font-black text-rose-600 block">
                {totalCasesForPathogen.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Total Documented AMR Cases
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">
              Pathogen Profile & Resistance Overview:
            </span>
            {currentInfo.description}
          </div>
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            <span className="font-bold text-blue-900 block mb-1">
              मराठी माहिती:
            </span>
            {currentInfo.descriptionMr}
          </div>
        </div>

        {/* List of Antibiotics under this Pathogen */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-slate-900">
            Antibiotics Tested against {selectedPathogen} ({pathogenAntibiotics.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathogenAntibiotics.map((drug) => (
              <div
                key={drug.id}
                onClick={() => onSelectAntibiotic(drug)}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                          {drug.name}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          ({drug.nameMr})
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {drug.drugClass}
                      </span>
                    </div>

                    {drug.resistanceCases !== null ? (
                      <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {drug.resistanceCases.toLocaleString()} cases
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Surveillance
                      </span>
                    )}
                  </div>

                  {/* Resistance Genes */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Dna className="w-3 h-3 text-indigo-600" />
                      Resistance Genes:
                    </span>
                    <p className="font-mono text-xs font-semibold text-indigo-900 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
                      {drug.resistanceGenes}
                    </p>
                  </div>

                  {/* Alternatives */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Alternative Antibiotics (from Dataset):
                    </span>
                    <p className="text-xs font-medium text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                      {drug.alternativeAntibioticsRaw}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end text-xs font-semibold text-blue-600 group-hover:text-blue-700 pt-2 border-t border-slate-200/60">
                  <span>View Complete Dossier</span>
                  <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
