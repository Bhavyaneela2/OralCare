import React, { useState } from 'react';
import {
  CheckCircle2,
  Video,
  Copy,
  Check,
  Calendar,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Appointment, User } from '../../types';

interface OnlineConsultationViewProps {
  currentUser: User;
  appointment?: Appointment | null;
  onJoinMeeting: (apt: Appointment) => void;
  onReschedule: () => void;
  onCancel: (id: string) => void;
}

export const OnlineConsultationView: React.FC<OnlineConsultationViewProps> = ({
  currentUser,
  appointment,
  onJoinMeeting,
  onReschedule,
  onCancel
}) => {
  const [copied, setCopied] = useState(false);

  // Default fallback appointment if none active
  const activeApt = appointment || {
    id: 'apt-101',
    patientId: currentUser.id,
    patientName: currentUser.name,
    patientPhone: currentUser.phone || '+91 9006480779',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    doctorSpecialty: 'General Dentist • BDS, MDS',
    date: 'May 02, 2025',
    time: '10:30 AM',
    type: 'Online Consultation (Google Meet)' as const,
    status: 'Confirmed' as const,
    reason: 'Severe lower molar sensitivity and slight chewing pain',
    meetLink: 'https://meet.google.com/xyz-oral-care',
    meetId: 'xyz-oral-care',
    fee: 600,
    createdAt: new Date().toISOString()
  };

  const meetLink = activeApt.meetLink || 'https://meet.google.com/xyz-oral-care';

  const handleCopy = () => {
    navigator.clipboard.writeText(meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Online Consultation
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          High-definition encrypted video dental consultation via Google Meet.
        </p>
      </div>

      {/* Confirmed Banner (exact match to screenshot) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Your Consultation is Confirmed
            </h2>
            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
              {activeApt.date} • {activeApt.time}
            </p>
          </div>
        </div>

        {/* Doctor Summary */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
              alt={activeApt.doctorName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white"
            />
            <div>
              <h3 className="text-xs font-bold text-slate-900">{activeApt.doctorName}</h3>
              <p className="text-[11px] text-teal-700 font-semibold">{activeApt.doctorSpecialty}</p>
              <p className="text-[10px] text-slate-500">Chief Dental Officer, OralCare</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {activeApt.status}
          </span>
        </div>

        {/* Meeting Link Section (matching screenshot) */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-800">
            Meeting Link
          </label>

          <button
            onClick={() => onJoinMeeting(activeApt)}
            className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs md:text-sm font-semibold shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Video className="w-5 h-5" />
            <span>Join Google Meet</span>
          </button>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-mono text-slate-600 truncate flex-1 pl-2">
              {meetLink}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors flex-shrink-0"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <Mail className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Meeting details have been sent to your email and phone.</span>
          </p>
        </div>

        {/* Action Buttons (matching screenshot) */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onReschedule}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            Reschedule
          </button>

          <button
            onClick={() => onCancel(activeApt.id)}
            className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
