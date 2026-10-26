import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  CalendarCheck,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { FollowUp, Doctor, User as UserType } from '../../types';

interface FollowupManagementViewProps {
  currentDoctor: Doctor;
  patients: UserType[];
  followups: FollowUp[];
  onAddFollowup: (fu: FollowUp) => void;
  onUpdateStatus: (id: string, status: FollowUp['status']) => void;
}

export const FollowupManagementView: React.FC<FollowupManagementViewProps> = ({
  currentDoctor,
  patients,
  followups,
  onAddFollowup,
  onUpdateStatus
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'pat-1');
  const [scheduledDate, setScheduledDate] = useState('May 30, 2025');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [reason, setReason] = useState('Post-treatment checkup and crown fit verification');
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];
    const newFu: FollowUp = {
      id: `fu-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      scheduledDate,
      scheduledTime,
      reason,
      status: 'Upcoming',
      notificationSent: true
    };

    onAddFollowup(newFu);
    setShowAddModal(false);
    setNotice(`Follow-up consultation successfully scheduled and notified to ${pat.name}.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Follow-up Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Track post-operative recovery, suture removals, and clinical checkups.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Follow-up Cards List (matching screenshot) */}
      <div className="space-y-4">
        {followups.map((fu) => (
          <div
            key={fu.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                  {fu.patientName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Follow-up with {fu.doctorName}
                  </h3>
                  <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                    {fu.scheduledDate} • {fu.scheduledTime}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-semibold self-start sm:self-auto ${
                  fu.status === 'Completed'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {fu.status}
              </span>
            </div>

            <div className="text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <span className="font-bold text-slate-700">Reason:</span>{' '}
              <span className="text-slate-600">{fu.reason}</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Send className="w-3.5 h-3.5 text-teal-600" />
                <span>Automated SMS & Email reminders enabled</span>
              </div>

              <div className="flex items-center gap-2">
                {fu.status !== 'Completed' && (
                  <button
                    onClick={() => onUpdateStatus(fu.id, 'Completed')}
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Mark Completed
                  </button>
                )}

                <button
                  onClick={() => onUpdateStatus(fu.id, 'Cancelled')}
                  className="py-1.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Schedule Patient Follow-up
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Send SMS/email notification to the patient with clinic reminder.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Follow-up</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Save & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
