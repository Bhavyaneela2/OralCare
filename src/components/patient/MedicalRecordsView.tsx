import React, { useState } from 'react';
import {
  FileText,
  Pill,
  FileImage,
  Clock,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2
} from 'lucide-react';
import { MedicalRecord, User } from '../../types';

interface MedicalRecordsViewProps {
  currentUser: User;
  records: MedicalRecord[];
}

export const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({
  currentUser,
  records
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Consultations' | 'Prescriptions' | 'Reports & X-rays'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(records[0]?.id || null);
  const [search, setSearch] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filtered = records.filter((r) => {
    const matchTab =
      activeTab === 'All'
        ? true
        : activeTab === 'Consultations'
        ? r.type === 'Consultation Note'
        : activeTab === 'Prescriptions'
        ? r.type === 'Prescription'
        : r.type === 'Dental X-ray' || r.type === 'Follow-up Report';

    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  const handleDownload = (record: MedicalRecord) => {
    setDownloadNotice(`Generating verified dental record document for ${record.title}...`);
    setTimeout(() => {
      // Create a printable text blob
      const content = `======================================================
ORALCARE DentalNLP-X — Official Dental Health Record
======================================================
Patient: ${currentUser.name}
Phone: ${currentUser.phone}
Record Type: ${record.type}
Date: ${record.date}
Attending Clinician: ${record.doctorName}
Title: ${record.title}
------------------------------------------------------
Summary / Findings:
${record.summary}
------------------------------------------------------
Hospital: OralCare Super Specialty Dental Center, Hyderabad
Accreditation: NABH Dental Healthcare Compliance
======================================================`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OralCare_${record.type.replace(/\s+/g, '_')}_${record.date.replace(/[\s,]+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadNotice(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Medical Records
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Access your consultation histories, clinical diagnostic notes, prescriptions, and radiographs.
        </p>
      </div>

      {downloadNotice && (
        <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Tabs (matching screenshot) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
        {(['All', 'Consultations', 'Prescriptions', 'Reports & X-rays'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search records by doctor, treatment, or date..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
        />
      </div>

      {/* Records Accordion List */}
      <div className="space-y-3">
        {filtered.map((rec) => {
          const isExpanded = expandedId === rec.id;
          return (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                    {rec.type === 'Prescription' ? (
                      <Pill className="w-4 h-4" />
                    ) : rec.type === 'Dental X-ray' ? (
                      <FileImage className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{rec.title}</h3>
                    <p className="text-[11px] text-slate-500">
                      {rec.date} • {rec.doctorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {rec.type}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1">Clinical Summary</h4>
                    <p className="text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80">
                      {rec.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Verified by Telangana Dental Council Registered Practitioner
                    </span>
                    <button
                      onClick={() => handleDownload(rec)}
                      className="py-1.5 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Record</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <p className="text-xs font-semibold text-slate-600">No records found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
