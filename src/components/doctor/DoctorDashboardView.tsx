import React from 'react';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight,
  Video,
  FileText,
  Pill,
  FileImage,
  UserPlus,
  Play,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Appointment, Doctor, User } from '../../types';

interface DoctorDashboardViewProps {
  currentUser: Doctor;
  appointments: Appointment[];
  onNavigateTab: (tab: string) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onJoinMeeting: (apt: Appointment) => void;
  onOpenClinicalNote: (patientName: string) => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  currentUser,
  appointments,
  onNavigateTab,
  onUpdateStatus,
  onJoinMeeting,
  onOpenClinicalNote
}) => {
  const todayApts = appointments.filter((a) => a.doctorId === currentUser.id);

  const completedCount = todayApts.filter((a) => a.status === 'Completed').length || 2;
  const inProgressCount = todayApts.filter((a) => a.status === 'In Progress').length || 1;
  const followUpCount = todayApts.filter((a) => a.reason.toLowerCase().includes('follow')).length || 3;

  return (
    <div className="space-y-6">
      {/* Header (matching screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Good Morning, {currentUser.name}!
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Here's your today's summary and clinic schedule.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards (exact match) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{todayApts.length || 5}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 mt-2">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('patient-directory')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Patients</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">124</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 mt-2">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('follow-ups')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Follow-ups</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{followUpCount}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-2">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{completedCount}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Cols Left, 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Appointments Table & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table (matching screenshot) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Today's Appointments
              </h3>
              <span className="text-xs text-slate-400">
                {todayApts.length} total consultations scheduled
              </span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3 pl-2">Time</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayApts.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pl-2 font-semibold text-slate-900 whitespace-nowrap">
                        {apt.time}
                      </td>
                      <td className="py-3.5">
                        <div className="font-bold text-slate-800">{apt.patientName}</div>
                        <div className="text-[10px] text-slate-400">{apt.reason.slice(0, 30)}...</div>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[11px] text-slate-600">
                          {apt.type.includes('Online') ? 'Online Meet' : 'In-Clinic'}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            apt.status === 'Completed'
                              ? 'bg-slate-100 text-slate-600'
                              : apt.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : apt.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-orange-50 text-orange-700 border border-orange-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right space-x-1.5 whitespace-nowrap">
                        {apt.type.includes('Online') && (
                          <button
                            onClick={() => onJoinMeeting(apt)}
                            className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100"
                            title="Launch Google Meet"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onOpenClinicalNote(apt.patientName)}
                          className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100"
                          title="Record Clinical Notes (NLP)"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        {apt.status !== 'Completed' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'Completed')}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-[11px] font-semibold transition-colors"
                          >
                            Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Feed (matching screenshot) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-4 border-b border-slate-100">
              Recent Activity
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Clinical note saved — Rahul Sharma
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Neural extraction completed for Tooth #46 (Irreversible pulpitis)
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Apr 28, 2025 • 10:15 AM
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Prescription updated — Sneha Reddy
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Amoxicillin 500mg BD course added with automated patient reminder schedule
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Apr 28, 2025 • 09:45 AM
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileImage className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    X-ray analysis completed — Arjun Patel
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Radiographic findings: 89% cavity confidence on mandibular molar
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Apr 28, 2025 • 08:30 AM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
              Quick Actions
            </h3>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => onNavigateTab('patient-directory')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    Add New Patient
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Register patient record & phone
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('patient-directory')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    View Patient Directory
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Search 124 clinic histories
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('clinical-notes')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    Clinical Notes (NLP)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Dictate or type dental consultations
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('xray-analysis')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    Upload X-ray
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Run radiograph caries detection
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('prescriptions')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    Create Prescription
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Issue e-prescription & multilingual summary
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
