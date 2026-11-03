import React, { useState, useMemo } from 'react';
import {
  AntibioticRecord,
  AMR_DATASET,
  UNIQUE_MICROORGANISMS,
  UNIQUE_DRUG_CLASSES,
} from '../data/amrData';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface AntibiogramTableProps {
  onSelectAntibiotic: (antibiotic: AntibioticRecord) => void;
  language: 'en' | 'mr';
}

export const AntibiogramTable: React.FC<AntibiogramTableProps> = ({
  onSelectAntibiotic,
  language,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'cases' | 'microorganism'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered & Sorted items
  const filteredData = useMemo(() => {
    return AMR_DATASET.filter((item) => {
      const matchesText =
        !filterText.trim() ||
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.nameMr.includes(filterText) ||
        item.resistanceGenes.toLowerCase().includes(filterText.toLowerCase()) ||
        item.alternativeAntibioticsRaw.toLowerCase().includes(filterText.toLowerCase()) ||
        item.microorganism.toLowerCase().includes(filterText.toLowerCase());

      const matchesOrganism =
        selectedOrganism === 'ALL' || item.microorganism === selectedOrganism;

      const matchesClass =
        selectedClass === 'ALL' || item.drugClass.includes(selectedClass);

      return matchesText && matchesOrganism && matchesClass;
    }).sort((a, b) => {
      let comp = 0;
      if (sortBy === 'id') {
        comp = a.id - b.id;
      } else if (sortBy === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (sortBy === 'cases') {
        comp = (b.resistanceCases || 0) - (a.resistanceCases || 0);
      } else if (sortBy === 'microorganism') {
        comp = a.microorganism.localeCompare(b.microorganism);
      }
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [filterText, selectedOrganism, selectedClass, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Antibiotic Name',
      'Marathi Name',
      'Drug Class',
      'Microorganism',
      'Resistance Cases',
      'Resistance Genes',
      'Diagnostic Test',
      'Alternative Antibiotic',
    ];

    const rows = AMR_DATASET.map((d) => [
      d.id,
      `"${d.name}"`,
      `"${d.nameMr}"`,
      `"${d.drugClass}"`,
      `"${d.microorganism}"`,
      d.resistanceCases ?? '',
      `"${d.resistanceGenes.replace(/"/g, '""')}"`,
      `"${d.diagnosticTest}"`,
      `"${d.alternativeAntibioticsRaw.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AMR_Surveillance_Data_Sheet.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSort = (field: 'id' | 'name' | 'cases' | 'microorganism') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'cases' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'mr'
              ? 'सर्व ५० प्रतिजैविक व प्रतिकार डेटाशीट'
              : 'Complete 50-Antibiotic Surveillance & Antibiogram Matrix'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'mr'
              ? 'डेटाशीटमधील ५० औषधे, संबंधित सूक्ष्मजीव, प्रतिरोध जनुके आणि पर्यायी औषधे एका नजरेत पहा.'
              : 'Direct mapping of all 50 entries with resistance gene signatures and alternative antimicrobials.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Dataset as CSV</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search antibiotic, gene, or alternative..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Microorganism filter */}
        <select
          value={selectedOrganism}
          onChange={(e) => setSelectedOrganism(e.target.value)}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
        >
          <option value="ALL">All Microorganisms ({UNIQUE_MICROORGANISMS.length})</option>
          {UNIQUE_MICROORGANISMS.map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>

        {/* Drug Class filter */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
        >
          <option value="ALL">All Drug Classes</option>
          <option value="Cephalosporin">Cephalosporins</option>
          <option value="Fluoroquinolone">Fluoroquinolones</option>
          <option value="Carbapenem">Carbapenems</option>
          <option value="Macrolide">Macrolides</option>
          <option value="Aminoglycoside">Aminoglycosides</option>
          <option value="Glycopeptide">Glycopeptides</option>
          <option value="Rifamycin">Rifamycins</option>
          <option value="Tetracycline">Tetracyclines</option>
          <option value="Penicillin">Penicillins</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors w-16"
                >
                  <div className="flex items-center gap-1">
                    <span>#</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Antibiotic Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('microorganism')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Micro-organism</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('cases')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Resistance Cases</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Resistance Genes</th>
                <th className="px-4 py-3.5">Alternative Antibiotic(s)</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectAntibiotic(item)}
                  className="hover:bg-blue-50/60 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3.5 font-bold font-mono text-slate-500">
                    {item.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-1.5">
                      <span>{item.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.nameMr} · {item.drugClass}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 italic font-medium text-slate-800">
                    {item.microorganism}
                  </td>
                  <td className="px-4 py-3.5">
                    {item.resistanceCases !== null ? (
                      <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {item.resistanceCases.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">
                        Surveillance
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs font-mono text-[11px] text-indigo-900 font-medium">
                    {item.resistanceGenes}
                  </td>
                  <td className="px-4 py-3.5 max-w-xs text-xs text-emerald-800 font-medium">
                    {item.alternativeAntibioticsRaw}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAntibiotic(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredData.length} of {AMR_DATASET.length} antibiotic entries</span>
          <span>Click any row to open the complete clinical dossier</span>
        </div>
      </div>
    </div>
  );
};
