import React from 'react';
import { Pill, Printer, Download, X, Globe, ShieldCheck } from 'lucide-react';
import { Prescription } from '../../types';

interface PrescriptionModalProps {
  prescription: Prescription;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  prescription,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Electronic Prescription
              </h3>
              <p className="text-[11px] text-slate-500">
                Rx ID: {prescription.id} &bull; {prescription.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Print Prescription"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Doctor & Patient Info */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Patient Details</span>
            <span className="font-bold text-slate-900 text-sm">{prescription.patientName}</span>
            <span className="text-slate-500 block text-[11px]">ID: {prescription.patientId}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Prescribing Doctor</span>
            <span className="font-bold text-slate-900 text-sm">{prescription.doctorName}</span>
            <span className="text-teal-700 block text-[11px]">Registered Dental Surgeon</span>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="py-3">
          <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-1">Diagnosis</span>
          <p className="text-xs font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {prescription.diagnosis}
          </p>
        </div>

        {/* Medicines Table */}
        <div className="py-3 space-y-2">
          <span className="text-slate-400 font-semibold block text-[10px] uppercase">
            Medications ({prescription.medicines.length})
          </span>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {prescription.medicines.map((m, idx) => (
              <div key={idx} className="p-3.5 bg-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900">
                    {idx + 1}. {m.name} — <span className="text-teal-700">{m.dosage}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {m.frequency} &bull; {m.duration} &bull; <strong className="text-slate-700">{m.foodTiming}</strong>
                  </p>
                  {m.instructions && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.instructions}</p>
                  )}
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-100 self-start sm:self-auto">
                  {m.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Multilingual Patient Instructions if available */}
        {prescription.patientFriendlySummary && (
          <div className="py-3 space-y-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-[10px] uppercase">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>Multilingual Patient Guide</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-teal-700 block text-[11px] mb-0.5">English:</strong>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {prescription.patientFriendlySummary.english}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-teal-700 block text-[11px] mb-0.5">Hindi (हिंदी):</strong>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {prescription.patientFriendlySummary.hindi}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-teal-700 block text-[11px] mb-0.5">Telugu (తెలుగు):</strong>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {prescription.patientFriendlySummary.telugu}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>NABH Accredited &bull; Electronic Signature Verified</span>
          </span>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
