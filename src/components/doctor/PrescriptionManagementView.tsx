import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  Save,
  Download,
  UploadCloud,
  CheckCircle2,
  Globe,
  Printer,
  Sparkles
} from 'lucide-react';
import { Doctor, MedicineItem, Prescription, User } from '../../types';
import { processPrescriptionOCR } from '../../utils/prescriptionOcr';

interface PrescriptionManagementViewProps {
  currentDoctor: Doctor;
  patients: User[];
  onSavePrescription: (rx: Omit<Prescription, 'id' | 'date'>) => void;
  preselectedPatientName?: string;
}

const COMMON_DRUGS = [
  { name: 'Amoxicillin', dose: '500mg', freq: 'Twice daily', dur: '5 days', timing: 'After food', cat: 'Antibiotic' as const },
  { name: 'Augmentin 625', dose: '625mg', freq: 'Twice daily', dur: '5 days', timing: 'After food', cat: 'Antibiotic' as const },
  { name: 'Ibuprofen', dose: '400mg', freq: 'Twice daily (SOS)', dur: '3 days', timing: 'After food', cat: 'Pain Relief (NSAID)' as const },
  { name: 'Paracetamol', dose: '500mg', freq: 'Twice daily', dur: '3 days', timing: 'After food', cat: 'Analgesic' as const },
  { name: 'Ketorolac-DT', dose: '10mg', freq: 'Once daily SOS', dur: '2 days', timing: 'After food', cat: 'Pain Relief (NSAID)' as const },
  { name: 'Chlorhexidine 0.2%', dose: '10ml', freq: 'Twice daily', dur: '7 days', timing: 'After food', cat: 'Antiseptic Mouthwash' as const }
];

export const PrescriptionManagementView: React.FC<PrescriptionManagementViewProps> = ({
  currentDoctor,
  patients,
  onSavePrescription,
  preselectedPatientName
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || 'pat-1'
  );
  const [diagnosis, setDiagnosis] = useState('Acute periapical pulpitis & dentin hypersensitivity');
  const [generalInstructions, setGeneralInstructions] = useState('Maintain warm saline rinses twice daily. Avoid chewing hard food on affected side.');

  // Medicine entry inputs matching screenshot
  const [medName, setMedName] = useState('Amoxicillin');
  const [dosage, setDosage] = useState('500mg');
  const [frequency, setFrequency] = useState('Twice daily');
  const [duration, setDuration] = useState('5 days');
  const [timing, setTiming] = useState<'After food' | 'Before food' | 'With food' | 'As needed'>('After food');
  const [instructions, setInstructions] = useState('Complete full 5 days antibiotic course');

  const [medicineList, setMedicineList] = useState<MedicineItem[]>([
    {
      id: 'med-init-1',
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '5 days',
      foodTiming: 'After food',
      instructions: 'Take one capsule in morning and one at night after meals',
      category: 'Antibiotic',
      sideEffects: 'Mild nausea',
      warnings: 'Do not skip doses'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'manual' | 'ocr'>('manual');
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrSummary, setOcrSummary] = useState<{ english: string; hindi: string; telugu: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleAddMedicine = () => {
    if (!medName) return;

    const newItem: MedicineItem = {
      id: `med-${Date.now()}`,
      name: medName,
      dosage,
      frequency,
      duration,
      foodTiming: timing,
      instructions,
      category: medName.toLowerCase().includes('amox') || medName.toLowerCase().includes('aug')
        ? 'Antibiotic'
        : medName.toLowerCase().includes('profen') || medName.toLowerCase().includes('ketor')
        ? 'Pain Relief (NSAID)'
        : 'Analgesic'
    };

    setMedicineList([...medicineList, newItem]);
    setMedName('');
    setInstructions('');
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicineList(medicineList.filter((m) => m.id !== id));
  };

  const handleQuickSelect = (drug: typeof COMMON_DRUGS[0]) => {
    setMedName(drug.name);
    setDosage(drug.dose);
    setFrequency(drug.freq);
    setDuration(drug.dur);
    setTiming(drug.timing as 'After food' | 'Before food' | 'With food' | 'As needed');
    setInstructions(`Take with a full glass of water ${drug.timing.toLowerCase()}`);
  };

  const handleSavePrescription = () => {
    if (medicineList.length === 0) {
      alert('Please add at least one medication to the prescription.');
      return;
    }

    onSavePrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      diagnosis,
      instructions: generalInstructions,
      medicines: medicineList,
      status: 'Active',
      patientFriendlySummary: ocrSummary || {
        english: `Prescription issued for ${selectedPatient.name}. Take medications strictly as scheduled after meals.`,
        hindi: `दवाएं हमेशा भोजन के बाद निर्धारित समय पर लें। पूरा कोर्स समाप्त करें।`,
        telugu: `భోజనం తర్వాత సూచించిన విధంగా మందులను సక్రమంగా వాడండి. కోర్సు పూర్తి చేయండి.`
      }
    });

    setSavedSuccess(`Prescription successfully saved and sent to ${selectedPatient.name}.`);
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  // Simulated OCR Dropzone test
  const handleSimulateOCR = async () => {
    setIsOCRProcessing(true);
    try {
      const res = await processPrescriptionOCR('sample_prescription_rx.jpg');
      setMedicineList(res.detectedMedicines);
      setOcrSummary(res.patientFriendlySummary);
    } catch (err) {
      console.error('OCR error:', err);
    } finally {
      setIsOCRProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Prescription Management
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Issue authenticated e-prescriptions with patient-friendly dosage translations in English, Hindi, and Telugu.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Patient Card (matching screenshot) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
            {selectedPatient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{selectedPatient.name}</h3>
            <p className="text-xs text-slate-500">
              Patient ID: {selectedPatient.id} • {selectedPatient.phone || '+91 9876543210'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Select Patient:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Tabs: Manual Entry vs OCR Upload */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('manual')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'manual'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Form Prescription Entry
        </button>

        <button
          onClick={() => setActiveTab('ocr')}
          className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'ocr'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Prescription Image OCR</span>
        </button>
      </div>

      {/* OCR View */}
      {activeTab === 'ocr' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-2 border-dashed border-teal-300 bg-teal-50/30 rounded-2xl p-8 text-center space-y-3">
            <UploadCloud className="w-10 h-10 text-teal-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              Upload Handwritten or Printed Prescription
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our neural OCR pipeline extracts medications, validates drug interactions, and outputs multilingual explanations.
            </p>
            <button
              onClick={handleSimulateOCR}
              disabled={isOCRProcessing}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              {isOCRProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run OCR Scan & Translation</span>
                </>
              )}
            </button>
          </div>

          {ocrSummary && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Globe className="w-4 h-4 text-teal-600" />
                <span>Patient-Friendly Multilingual Instructions</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-teal-700 block mb-1">English:</span>
                  <p className="text-slate-700 leading-relaxed">{ocrSummary.english}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-teal-700 block mb-1">Hindi (हिंदी):</span>
                  <p className="text-slate-700 leading-relaxed">{ocrSummary.hindi}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-teal-700 block mb-1">Telugu (తెలుగు):</span>
                  <p className="text-slate-700 leading-relaxed">{ocrSummary.telugu}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Medicine Entry (exact match to screenshot) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Clinical Diagnosis
          </h3>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-semibold text-slate-800"
          />
        </div>

        {/* Quick select pills */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-2">
            Quick Add Common Dental Medications:
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_DRUGS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => handleQuickSelect(d)}
                className="py-1 px-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-semibold border border-teal-100 transition-colors"
              >
                + {d.name} ({d.dose})
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields matching screenshot: Medicine Name, Dosage, Frequency, Duration, Instructions */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold text-slate-800">Add Medication</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="e.g. Amoxicillin"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Dosage
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="500mg"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Frequency
              </label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Twice daily"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="5 days"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Food Timing
              </label>
              <select
                value={timing}
                onChange={(e: any) => setTiming(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
              >
                <option>After food</option>
                <option>Before food</option>
                <option>With food</option>
                <option>As needed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Instructions
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. After food with warm water"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleAddMedicine}
              className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Prescription</span>
            </button>
          </div>
        </div>

        {/* Added Medicines List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Prescribed Medications ({medicineList.length})
          </h4>

          {medicineList.map((m, idx) => (
            <div
              key={m.id || idx}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    {m.name} — <span className="text-teal-700">{m.dosage}</span>
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {m.frequency} • {m.duration} • <span className="font-medium text-slate-700">{m.foodTiming}</span>
                  </p>
                  {m.instructions && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.instructions}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveMedicine(m.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Buttons (matching screenshot) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setMedicineList([])}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium"
          >
            Cancel / Clear
          </button>

          <button
            type="button"
            onClick={handleSavePrescription}
            className="py-3 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
};
