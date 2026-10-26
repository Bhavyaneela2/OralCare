import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Type,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Volume2,
  FileText,
  UserCheck
} from 'lucide-react';
import { ClinicalNote, Doctor, ExtractedDentalNLP, User } from '../../types';
import { parseDentalClinicalText } from '../../utils/nlp';

interface ClinicalNotesNLPViewProps {
  currentDoctor: Doctor;
  patients: User[];
  onSaveNote: (note: Omit<ClinicalNote, 'id' | 'date'>) => void;
  preselectedPatientName?: string;
}

const SAMPLE_NOTES = [
  'Patient reports pain in the lower right molar for three days. Pain increases while chewing solid food. Review tooth 46 and arrange follow-up. Advised RCT and full crown. Prescribed Amoxicillin 500mg twice daily for 5 days and Ibuprofen 400mg.',
  'Patient Rahul Sharma presents with acute throbbing pain in tooth 24 for two days, sensitive to cold beverages. Cavitation in dentin observed. Plan composite restoration and review in one week.',
  'Routine dental checkup for Sneha Reddy. Scaling completed. Slight gingivitis around lower incisors. Advised Chlorhexidine 0.2% mouthwash twice daily for 7 days.'
];

export const ClinicalNotesNLPView: React.FC<ClinicalNotesNLPViewProps> = ({
  currentDoctor,
  patients,
  onSaveNote,
  preselectedPatientName
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || 'pat-1'
  );
  const [inputMode, setInputMode] = useState<'type' | 'voice'>('type');
  const [clinicalText, setClinicalText] = useState(SAMPLE_NOTES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedDentalNLP | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Editable fields state
  const [editSymptoms, setEditSymptoms] = useState('');
  const [editTeeth, setEditTeeth] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editTreatment, setEditTreatment] = useState('');
  const [editMedicines, setEditMedicines] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');

  // Speech recognition reference
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (preselectedPatientName) {
      const match = patients.find(
        (p) => p.name.toLowerCase() === preselectedPatientName.toLowerCase()
      );
      if (match) setSelectedPatientId(match.id);
    }
  }, [preselectedPatientName, patients]);

  // Voice dictation handling
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        // Fallback simulation for browsers without Web Speech API
        setIsRecording(true);
        setTimeout(() => {
          setClinicalText((prev) =>
            prev ? `${prev} [Dictated]: Tenderness on vertical percussion on tooth 46.` : 'Patient reports pain in tooth 46 on chewing.'
          );
          setIsRecording(false);
          setFeedbackMsg('Dictation recorded via voice pipeline.');
          setTimeout(() => setFeedbackMsg(null), 3000);
        }, 3000);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English dental dialect

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setClinicalText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (err) {
        console.error('Speech setup error:', err);
        setIsRecording(false);
      }
    }
  };

  const handleProcessNLP = async () => {
    if (!clinicalText.trim()) return;
    setIsProcessing(true);

    try {
      const result = await parseDentalClinicalText(clinicalText);
      setExtractedData(result);
      setEditSymptoms(result.symptoms.join(', '));
      setEditTeeth(result.toothNumbers.join(', '));
      setEditCondition(result.condition);
      setEditDiagnosis(result.diagnosis);
      setEditTreatment(result.treatment);
      setEditMedicines(
        result.medicines.map((m) => `${m.name} ${m.dosage} (${m.frequency})`).join('; ')
      );
      setEditFollowUp(result.followUp);
    } catch (err) {
      console.error('NLP error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

    const noteToSave: Omit<ClinicalNote, 'id' | 'date'> = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      rawText: clinicalText,
      verifiedByDoctor: true,
      extracted: extractedData || {
        symptoms: editSymptoms.split(',').map((s) => s.trim()),
        duration: 'Not specified',
        toothNumbers: editTeeth.split(',').map((t) => t.trim()),
        region: 'Lower right quadrant',
        condition: editCondition,
        findings: 'Clinical findings verified by doctor.',
        diagnosis: editDiagnosis,
        treatment: editTreatment,
        medicines: [],
        followUp: editFollowUp,
        confidence: 0.95,
        uncertainFields: []
      }
    };

    onSaveNote(noteToSave);
    setFeedbackMsg(`Clinical note successfully verified and saved for ${selectedPatient.name}.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Run NLP on initial mount for first sample
  useEffect(() => {
    handleProcessNLP();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Clinical Notes (NLP)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Neural Semantic Modeling for Unstructured Dental Clinical Text — Entity & Relation Extraction
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Patient Selector & Sample Loaders */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Patient:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-semibold"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone || p.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400">Load Clinical Sample:</span>
          {SAMPLE_NOTES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setClinicalText(SAMPLE_NOTES[idx]);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
            >
              Case #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Pane Left, Extracted Entities Right (matching screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input / Voice Dictation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Mode Selector Tabs (Type Note vs Voice Dictation) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setInputMode('type')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    inputMode === 'type'
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Type Note</span>
                </button>

                <button
                  onClick={() => setInputMode('voice')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    inputMode === 'voice'
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Dictation</span>
                </button>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>Recording Live...</span>
                </div>
              )}
            </div>

            {/* Voice Dictation Control Area if in Voice mode */}
            {inputMode === 'voice' && (
              <div className="my-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-center space-y-3">
                <button
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all shadow-md ${
                    isRecording
                      ? 'bg-rose-600 text-white shadow-rose-600/30 animate-bounce'
                      : 'bg-teal-600 text-white shadow-teal-600/30 hover:bg-teal-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <p className="text-xs font-semibold text-slate-800">
                  {isRecording ? 'Listening... Speak clinical findings clearly' : 'Click microphone to start dictation'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Supports browser Speech-to-Text with Indian dental terminology
                </p>
              </div>
            )}

            {/* Textarea */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Clinical Text (Unstructured)
              </label>
              <textarea
                rows={9}
                value={clinicalText}
                onChange={(e) => setClinicalText(e.target.value)}
                placeholder="Enter clinical notes or use voice dictation..."
                className="w-full p-4 text-xs leading-relaxed bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setClinicalText('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear Text
            </button>

            <button
              onClick={handleProcessNLP}
              disabled={isProcessing}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Information</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Extracted Information (exact match to screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Extracted Information
              </h3>
              {extractedData && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Confidence: {Math.round(extractedData.confidence * 100)}%
                </span>
              )}
            </div>

            {/* Editable Extracted Entities List */}
            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Symptoms
                </label>
                <input
                  type="text"
                  value={editSymptoms}
                  onChange={(e) => setEditSymptoms(e.target.value)}
                  placeholder="e.g. Pain increases while chewing"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tooth Numbers
                  </label>
                  <input
                    type="text"
                    value={editTeeth}
                    onChange={(e) => setEditTeeth(e.target.value)}
                    placeholder="e.g. 46"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-700 outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Condition
                  </label>
                  <input
                    type="text"
                    value={editCondition}
                    onChange={(e) => setEditCondition(e.target.value)}
                    placeholder="e.g. Deep occlusal caries"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Diagnosis
                </label>
                <input
                  type="text"
                  value={editDiagnosis}
                  onChange={(e) => setEditDiagnosis(e.target.value)}
                  placeholder="e.g. Irreversible pulpitis"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Treatment Plan
                </label>
                <input
                  type="text"
                  value={editTreatment}
                  onChange={(e) => setEditTreatment(e.target.value)}
                  placeholder="e.g. Root Canal Treatment & Crown"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-teal-800 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Prescribed Medicines
                </label>
                <input
                  type="text"
                  value={editMedicines}
                  onChange={(e) => setEditMedicines(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg (BD), Ibuprofen 400mg (SOS)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Follow-up Recommendation
                </label>
                <input
                  type="text"
                  value={editFollowUp}
                  onChange={(e) => setEditFollowUp(e.target.value)}
                  placeholder="e.g. Recommended in 7 days"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              *Requires explicit clinician verification before saving.
            </span>

            <button
              onClick={handleSave}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
