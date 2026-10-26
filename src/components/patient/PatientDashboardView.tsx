import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Pill,
  FileImage,
  Video,
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { Appointment, MedicalRecord, AppNotification, Prescription, User } from '../../types';

interface PatientDashboardViewProps {
  currentUser: User;
  appointments: Appointment[];
  prescriptions: Prescription[];
  records: MedicalRecord[];
  notifications: AppNotification[];
  onNavigateTab: (tab: string) => void;
  onJoinMeeting: (appointment: Appointment) => void;
  onCancelAppointment: (id: string) => void;
  onSelectPrescription: (prescription: Prescription) => void;
  onSelectRecord: (record: MedicalRecord) => void;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({
  currentUser,
  appointments,
  prescriptions,
  records,
  notifications,
  onNavigateTab,
  onJoinMeeting,
  onCancelAppointment,
  onSelectPrescription,
  onSelectRecord
}) => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Active upcoming appointment
  const nextAppointment = appointments.find(
    (a) => a.patientId === currentUser.id && a.status === 'Confirmed'
  ) || appointments[0];

  const upcomingCount = appointments.filter(
    (a) => a.patientId === currentUser.id && (a.status === 'Confirmed' || a.status === 'Pending')
  ).length;

  const pastCount = appointments.filter(
    (a) => a.patientId === currentUser.id && a.status === 'Completed'
  ).length || 3;

  const rxCount = prescriptions.filter((p) => p.patientId === currentUser.id).length || 2;
  const reportsCount = records.filter((r) => r.patientId === currentUser.id).length || 1;

  return (
    <div className="space-y-6">
      {/* Welcome Banner (exact match to screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Good Morning, {currentUser.name}!
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Take care of your smile. Your dental health matters.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{upcomingCount}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 mt-2">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Past Consultations</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{pastCount}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 mt-2">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => onNavigateTab('prescriptions')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Prescriptions</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{rxCount}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => onNavigateTab('reports-xrays')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Reports & X-rays</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileImage className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-3">{reportsCount}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 mt-2">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Grid: 2/3 Content, 1/3 Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Appointment Card (exact match) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Next Appointment
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Confirmed
              </span>
            </div>

            {nextAppointment ? (
              <div className="mt-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
                      alt={nextAppointment.doctorName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {nextAppointment.doctorName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {nextAppointment.doctorSpecialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>{nextAppointment.date} • {nextAppointment.time}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-teal-50/50 p-3 rounded-xl border border-teal-100/60">
                  <strong className="text-teal-900">Reason:</strong> {nextAppointment.reason}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onJoinMeeting(nextAppointment)}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Online Consultation</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('book-appointment')}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => onCancelAppointment(nextAppointment.id)}
                    className="py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No active appointments scheduled.
              </div>
            )}
          </div>

          {/* Recent Prescriptions Table / List (matching screenshot) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recent Prescriptions
              </span>
              <button
                onClick={() => onNavigateTab('prescriptions')}
                className="text-xs font-semibold text-teal-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Amoxicillin 500mg</h4>
                    <p className="text-[11px] text-slate-500">Dr. Priya Mehta • 2 times a day</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Active
                  </span>
                  <button
                    onClick={() => prescriptions[0] && onSelectPrescription(prescriptions[0])}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ibuprofen 400mg</h4>
                    <p className="text-[11px] text-slate-500">Dr. Priya Mehta • SOS as needed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Active
                  </span>
                  <button
                    onClick={() => prescriptions[0] && onSelectPrescription(prescriptions[0])}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Paracetamol 500mg</h4>
                    <p className="text-[11px] text-slate-500">Dr. Rajesh Kumar • 2 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Completed
                  </span>
                  <button
                    onClick={() => prescriptions[1] && onSelectPrescription(prescriptions[1])}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recent Reports
              </span>
              <button
                onClick={() => onNavigateTab('reports-xrays')}
                className="text-xs font-semibold text-teal-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {records.slice(0, 3).map((rec) => (
                <div key={rec.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <FileImage className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                      <p className="text-[11px] text-slate-500">{rec.date} • {rec.doctorName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectRecord(rec)}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Quick Actions (exact match) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
              Quick Actions
            </h3>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => onNavigateTab('find-doctor')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    Find a Doctor
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Search and book available doctors
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigateTab('book-appointment')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    Book Appointment
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Schedule a new consultation
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigateTab('reports-xrays')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    Upload X-ray
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Get AI-assisted scan report
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigateTab('prescriptions')}
                className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    View Prescriptions
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Access your dosages & guides
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Notifications List (exact match) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
              Notifications
            </h3>

            <div className="mt-4 space-y-3.5">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                    <h4 className="text-xs font-semibold text-slate-800">{n.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-4 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 pl-4 block mt-1">
                    {n.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help? Card (exact match) */}
          <div className="bg-gradient-to-br from-teal-50 to-sky-50 rounded-3xl p-6 border border-teal-200/60 shadow-xs text-center">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-600/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Need Help?</h4>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              Our clinical dental support team is here for you 24/7.
            </p>
            <button
              onClick={() => setShowSupportModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-teal-200 hover:bg-teal-50 text-teal-800 text-xs font-semibold shadow-xs transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">OralCare 24/7 Support</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Need immediate emergency triage or assistance with appointments?
            </p>
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <strong className="text-slate-800">Toll Free Helpline:</strong>
                <p className="text-teal-700 font-semibold">+91 1800-ORAL-CARE (1800 672 5227)</p>
              </div>
              <div>
                <strong className="text-slate-800">WhatsApp Clinical Desk:</strong>
                <p className="text-teal-700 font-semibold">+91 9006480779</p>
              </div>
              <div>
                <strong className="text-slate-800">Email:</strong>
                <p className="text-slate-600">support@oralcare-dentalnlp.com</p>
              </div>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
