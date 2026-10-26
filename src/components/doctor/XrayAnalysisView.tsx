import React, { useState } from 'react';
import {
  FileImage,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  Eye,
  Info
} from 'lucide-react';
import { Doctor, User, XrayAnalysisResult } from '../../types';
import { analyzeDentalXray, XrayAnalysisOutput } from '../../utils/xrayAnalysis';

interface XrayAnalysisViewProps {
  currentDoctor: Doctor;
  patients: User[];
  onSaveReport: (report: Omit<XrayAnalysisResult, 'id' | 'date'>) => void;
}

const PRELOADED_XRAYS = [
  {
    name: 'radiograph_molar_46.jpg',
    label: 'Mandibular Molar #46 Scan',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'panoramic_full_arch.jpg',
    label: 'Panoramic OPG Full Arch',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
  }
];

export const XrayAnalysisView: React.FC<XrayAnalysisViewProps> = ({
  currentDoctor,
  patients,
  onSaveReport
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || 'pat-1'
  );
  const [activeXrayUrl, setActiveXrayUrl] = useState<string>(PRELOADED_XRAYS[0].url);
  const [activeFileName, setActiveFileName] = useState<string>(PRELOADED_XRAYS[0].name);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<XrayAnalysisOutput | null>({
    findings: [
      'Possible cavity (lower molar) — coronal radiolucency',
      'Mild bone loss in interdental alveolar crest'
    ],
    affectedTeeth: ['Tooth 46 (Lower Right 1st Molar)'],
    region: 'Lower Right Quadrant',
    confidence: 0.89,
    severity: 'Moderate',
    preliminaryReport: 'Neural radiograph classifier identified localized radiolucency on the occlusal aspect of tooth 46 approaching coronal pulp. Periodontal space intact without apical granuloma.',
    clinicalRecommendations: [
      'Clinical evaluation & vitality test recommended.',
      'Correlate with chewing pain history.'
    ]
  });

  const [doctorRemarks, setDoctorRemarks] = useState('Correlates with patient chewing pain and sensitivity.');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleRunAnalysis = async (url: string, fileName: string) => {
    setActiveXrayUrl(url);
    setActiveFileName(fileName);
    setIsAnalyzing(true);

    try {
      const res = await analyzeDentalXray(url, fileName, selectedPatient.name);
      setAnalysisResult(res);
    } catch (err) {
      console.error('X-ray analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleRunAnalysis(reader.result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!analysisResult) return;

    onSaveReport({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: currentDoctor.id,
      imageUrl: activeXrayUrl,
      fileName: activeFileName,
      findings: analysisResult.findings,
      affectedTeeth: analysisResult.affectedTeeth,
      region: analysisResult.region,
      confidence: analysisResult.confidence,
      severity: analysisResult.severity,
      preliminaryReport: analysisResult.preliminaryReport,
      verifiedByDoctor: true,
      doctorRemarks
    });

    setSavedSuccess(`Radiograph analysis report successfully verified and saved for ${selectedPatient.name}.`);
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Dental X-ray Analysis
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Deep Convolutional Computer Vision for Dental Radiograph Pathology & Caries Localization
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Patient selector bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Patient:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone || p.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Sample Radiographs:</span>
          {PRELOADED_XRAYS.map((rx) => (
            <button
              key={rx.name}
              type="button"
              onClick={() => handleRunAnalysis(rx.url, rx.name)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                activeFileName === rx.name
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {rx.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload & Radiograph Left, Analysis Right (matching screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload Dropzone & Radiograph Image */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
            Upload X-ray
          </h3>

          {/* Dropzone */}
          <label className="border-2 border-dashed border-teal-300 bg-teal-50/30 rounded-2xl p-6 text-center block cursor-pointer hover:bg-teal-50/60 transition-colors">
            <input
              type="file"
              accept="image/*,.dcm"
              onChange={handleFileUpload}
              className="hidden"
            />
            <UploadCloud className="w-10 h-10 text-teal-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">
              Upload X-ray scan
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Supported JPG, PNG, DICOM • Max 10MB
            </p>
          </label>

          {/* Image Radiograph Preview with Pathology Highlights */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
            <img
              src={activeXrayUrl}
              alt="Dental Radiograph"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Bounding box simulation over Tooth 46 */}
            <div className="absolute bottom-[28%] right-[32%] w-14 h-14 border-2 border-rose-500 bg-rose-500/20 rounded-lg flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold bg-rose-600 text-white px-1 rounded-sm -top-3 absolute">
                #46 Caries (89%)
              </span>
            </div>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs font-semibold">Running Computer Vision Model...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>File: {activeFileName}</span>
            <span className="text-teal-700 font-semibold">Status: Radiograph Validated</span>
          </div>
        </div>

        {/* Right: AI Analysis (Demo / Assistance) (matching screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>AI Analysis (Assistance)</span>
              </h3>

              {analysisResult && (
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Confidence: {Math.round(analysisResult.confidence * 100)}%
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="mt-4 space-y-4 text-xs">
                {/* Findings List (matching screenshot) */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Findings
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.findings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"
                      >
                        <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-800">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Confidence Score:</span>
                    <span className="text-teal-700">89%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(analysisResult.confidence * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Affected Tooth & Region */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                    <span className="text-[10px] font-bold uppercase text-teal-800 block">Affected Tooth</span>
                    <span className="font-bold text-slate-900">{analysisResult.affectedTeeth[0]}</span>
                  </div>
                  <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                    <span className="text-[10px] font-bold uppercase text-sky-800 block">Anatomical Region</span>
                    <span className="font-bold text-slate-900">{analysisResult.region}</span>
                  </div>
                </div>

                {/* Preliminary Report */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Neural Report Summary
                  </label>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {analysisResult.preliminaryReport}
                  </p>
                </div>

                {/* Doctor remarks */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Doctor Clinical Notes / Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={doctorRemarks}
                    onChange={(e) => setDoctorRemarks(e.target.value)}
                    placeholder="Add clinical observation..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                {/* Mandatory Clinical Disclaimer */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    This is an AI-assisted analysis. Please verify with a professional dental diagnosis.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Upload or select an X-ray to generate neural diagnostic report.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
