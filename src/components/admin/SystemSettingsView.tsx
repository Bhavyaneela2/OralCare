import React, { useState } from 'react';
import { Settings, ShieldCheck, CheckCircle2, Database, Sparkles, Video, Globe, Save } from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const [hospitalName, setHospitalName] = useState('OralCare Super Specialty Dental Center');
  const [city, setCity] = useState('Hyderabad, Telangana');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 9006480779');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const services = [
    { name: 'Gemini AI & Vision API', status: 'Operational', type: 'NLP & X-ray Assist', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'Google Meet Integration', status: 'Active', type: 'Tele-consultation links', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'Database & State Storage', status: 'Healthy', type: 'LocalStorage & Atlas JSON', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'Speech-to-Text Pipeline', status: 'Supported', type: 'Web Speech & Whisper', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'Multilingual Dental Engine', status: 'En-Hi-Te Active', type: 'English, Hindi, Telugu', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          System Settings & Integrations
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Configure clinical parameters, API connections, and hospital details.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      {/* Integration Status Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
          Clinical AI & Cloud Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {services.map((s) => (
            <div key={s.name} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">{s.name}</h4>
                <p className="text-[11px] text-slate-500">{s.type}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${s.color}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Configuration Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
          Facility Details (Indian Healthcare)
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic Name</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location & State</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Desk Helpline</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
