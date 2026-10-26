import React, { useState, useEffect } from 'react';
import { Storage } from './utils/storage';
import {
  Appointment,
  Doctor,
  FollowUp,
  MedicalRecord,
  AppNotification,
  Prescription,
  User,
  UserRole,
  XrayAnalysisResult
} from './types';

// Common Components
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { FooterBanner } from './components/common/FooterBanner';
import { VideoConsultationModal } from './components/common/VideoConsultationModal';
import { PrescriptionModal } from './components/common/PrescriptionModal';
import { DentalAiChatbot } from './components/common/DentalAiChatbot';

// Auth Components
import { LoginView } from './components/auth/LoginView';
import { SignupView } from './components/auth/SignupView';
import { RoleSelectView } from './components/auth/RoleSelectView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';

// Patient Views
import { PatientDashboardView } from './components/patient/PatientDashboardView';
import { FindDoctorView } from './components/patient/FindDoctorView';
import { BookAppointmentView } from './components/patient/BookAppointmentView';
import { MedicalRecordsView } from './components/patient/MedicalRecordsView';
import { OnlineConsultationView } from './components/patient/OnlineConsultationView';
import { PatientProfileView } from './components/patient/PatientProfileView';

// Doctor Views
import { DoctorDashboardView } from './components/doctor/DoctorDashboardView';
import { PatientDirectoryView } from './components/doctor/PatientDirectoryView';
import { ClinicalNotesNLPView } from './components/doctor/ClinicalNotesNLPView';
import { PrescriptionManagementView } from './components/doctor/PrescriptionManagementView';
import { XrayAnalysisView } from './components/doctor/XrayAnalysisView';
import { FollowupManagementView } from './components/doctor/FollowupManagementView';

// Admin Views
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { SystemSettingsView } from './components/admin/SystemSettingsView';

export default function App() {
  // App state
  const [currentUser, setCurrentUser] = useState<User | null>(() => Storage.getCurrentUser());
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'role-select' | 'forgot-password'>('login');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Domain entities
  const [users, setUsers] = useState<User[]>(() => Storage.getUsers());
  const [doctors, setDoctors] = useState<Doctor[]>(() => Storage.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(() => Storage.getAppointments());
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => Storage.getPrescriptions());
  const [records, setRecords] = useState<MedicalRecord[]>(() => Storage.getMedicalRecords());
  const [followups, setFollowups] = useState<FollowUp[]>(() => Storage.getFollowups());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => Storage.getNotifications());
  const [auditLogs, setAuditLogs] = useState(() => Storage.getAuditLogs());

  // Active Modals & Preselections
  const [activeMeetingApt, setActiveMeetingApt] = useState<Appointment | null>(null);
  const [activePrescriptionModal, setActivePrescriptionModal] = useState<Prescription | null>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [preselectedPatientForDoctor, setPreselectedPatientForDoctor] = useState<string>('');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Sync state helpers
  const refreshStorage = () => {
    setUsers(Storage.getUsers());
    setDoctors(Storage.getDoctors());
    setAppointments(Storage.getAppointments());
    setPrescriptions(Storage.getPrescriptions());
    setRecords(Storage.getMedicalRecords());
    setFollowups(Storage.getFollowups());
    setNotifications(Storage.getNotifications());
    setAuditLogs(Storage.getAuditLogs());
  };

  // Auth actions
  const handleLoginSuccess = (user: User) => {
    Storage.setCurrentUser(user);
    setCurrentUser(user);
    setCurrentTab('dashboard');
    refreshStorage();
  };

  const handleLogout = () => {
    Storage.setCurrentUser(null);
    setCurrentUser(null);
    setAuthScreen('login');
  };

  const handleQuickRoleSwitch = (role: UserRole) => {
    const candidate = users.find((u) => u.role === role);
    if (candidate) {
      handleLoginSuccess(candidate);
    }
  };

  // Appointment actions
  const handleBookAppointment = (apt: Appointment) => {
    Storage.addAppointment(apt);
    refreshStorage();
    setCurrentTab('online-consultation');
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    if (!currentUser) return;
    Storage.updateAppointmentStatus(id, status, currentUser);
    refreshStorage();
  };

  const handleCancelAppointment = (id: string) => {
    if (!currentUser) return;
    Storage.updateAppointmentStatus(id, 'Cancelled', currentUser);
    refreshStorage();
  };

  // Doctor Clinical Notes
  const handleSaveClinicalNote = (note: Parameters<typeof Storage.addClinicalNote>[0]) => {
    Storage.addClinicalNote(note);
    refreshStorage();
  };

  // Doctor Prescriptions
  const handleSavePrescription = (rx: Parameters<typeof Storage.addPrescription>[0]) => {
    Storage.addPrescription(rx);
    refreshStorage();
  };

  // Doctor X-ray
  const handleSaveXrayReport = (report: Parameters<typeof Storage.addXrayReport>[0]) => {
    Storage.addXrayReport(report);
    refreshStorage();
  };

  // Doctor Follow-ups
  const handleAddFollowup = (fu: FollowUp) => {
    const list = Storage.getFollowups();
    list.unshift(fu);
    localStorage.setItem('oralcare_followups', JSON.stringify(list));
    Storage.addAuditLog({
      actorName: currentUser?.name || 'Doctor',
      actorRole: 'doctor',
      action: 'Follow-up scheduled',
      details: `Scheduled checkup for ${fu.patientName} on ${fu.scheduledDate} at ${fu.scheduledTime}.`
    });
    refreshStorage();
  };

  const handleUpdateFollowupStatus = (id: string, status: FollowUp['status']) => {
    const list = Storage.getFollowups();
    const idx = list.findIndex((f) => f.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem('oralcare_followups', JSON.stringify(list));
      refreshStorage();
    }
  };

  // Profile update
  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = Storage.updateUser(currentUser.id, updates);
    setCurrentUser(updated);
    refreshStorage();
  };

  // Admin user status
  const handleToggleUserStatus = (userId: string) => {
    if (!currentUser) return;
    Storage.toggleUserStatus(userId, currentUser);
    refreshStorage();
  };

  const handleAddUser = (user: Parameters<typeof Storage.addUser>[0]) => {
    Storage.addUser(user);
    refreshStorage();
  };

  // Unauthenticated Screen Router
  if (!currentUser) {
    if (authScreen === 'signup') {
      return (
        <SignupView
          onSignupSuccess={handleLoginSuccess}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }
    if (authScreen === 'role-select') {
      return (
        <RoleSelectView
          onSelectRole={(role) => {
            const match = users.find((u) => u.role === role);
            if (match) handleLoginSuccess(match);
          }}
          onBackToLogin={() => setAuthScreen('login')}
        />
      );
    }
    if (authScreen === 'forgot-password') {
      return (
        <ForgotPasswordView onBackToLogin={() => setAuthScreen('login')} />
      );
    }
    return (
      <LoginView
        availableUsers={users}
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignup={() => setAuthScreen('signup')}
        onNavigateToForgotPassword={() => setAuthScreen('forgot-password')}
        onNavigateToRoleSelect={() => setAuthScreen('role-select')}
      />
    );
  }

  // Active Doctor object if doctor
  const currentDoctor = doctors.find((d) => d.id === currentUser.id) || doctors[0];

  // Render view depending on role & tab
  const renderMainContent = () => {
    // PATIENT ROLE
    if (currentUser.role === 'patient') {
      switch (currentTab) {
        case 'dashboard':
          return (
            <PatientDashboardView
              currentUser={currentUser}
              appointments={appointments}
              prescriptions={prescriptions}
              records={records}
              notifications={notifications}
              onNavigateTab={setCurrentTab}
              onJoinMeeting={(apt) => setActiveMeetingApt(apt)}
              onCancelAppointment={handleCancelAppointment}
              onSelectPrescription={(rx) => setActivePrescriptionModal(rx)}
              onSelectRecord={() => setCurrentTab('medical-records')}
            />
          );
        case 'find-doctor':
          return (
            <FindDoctorView
              doctors={doctors}
              onSelectDoctorToBook={(doc) => {
                setSelectedDoctorForBooking(doc);
                setCurrentTab('book-appointment');
              }}
            />
          );
        case 'book-appointment':
          return (
            <BookAppointmentView
              currentUser={currentUser}
              doctors={doctors}
              preselectedDoctor={selectedDoctorForBooking}
              existingAppointments={appointments}
              onBookSuccess={handleBookAppointment}
              onCancel={() => setCurrentTab('dashboard')}
            />
          );
        case 'appointments':
        case 'medical-records':
        case 'prescriptions':
        case 'reports-xrays':
          return (
            <MedicalRecordsView
              currentUser={currentUser}
              records={records.filter((r) => r.patientId === currentUser.id)}
            />
          );
        case 'online-consultation':
          return (
            <OnlineConsultationView
              currentUser={currentUser}
              appointment={appointments.find((a) => a.patientId === currentUser.id)}
              onJoinMeeting={(apt) => setActiveMeetingApt(apt)}
              onReschedule={() => setCurrentTab('book-appointment')}
              onCancel={handleCancelAppointment}
            />
          );
        case 'profile':
          return (
            <PatientProfileView
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          );
        default:
          return (
            <PatientDashboardView
              currentUser={currentUser}
              appointments={appointments}
              prescriptions={prescriptions}
              records={records}
              notifications={notifications}
              onNavigateTab={setCurrentTab}
              onJoinMeeting={(apt) => setActiveMeetingApt(apt)}
              onCancelAppointment={handleCancelAppointment}
              onSelectPrescription={(rx) => setActivePrescriptionModal(rx)}
              onSelectRecord={() => setCurrentTab('medical-records')}
            />
          );
      }
    }

    // DOCTOR ROLE
    if (currentUser.role === 'doctor') {
      switch (currentTab) {
        case 'dashboard':
          return (
            <DoctorDashboardView
              currentUser={currentDoctor}
              appointments={appointments}
              onNavigateTab={setCurrentTab}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onJoinMeeting={(apt) => setActiveMeetingApt(apt)}
              onOpenClinicalNote={(pName) => {
                setPreselectedPatientForDoctor(pName);
                setCurrentTab('clinical-notes');
              }}
            />
          );
        case 'patient-directory':
          return (
            <PatientDirectoryView
              patients={users.filter((u) => u.role === 'patient')}
              onAddPatient={handleAddUser}
              onOpenNotesForPatient={(name) => {
                setPreselectedPatientForDoctor(name);
                setCurrentTab('clinical-notes');
              }}
              onOpenRxForPatient={(name) => {
                setPreselectedPatientForDoctor(name);
                setCurrentTab('prescriptions');
              }}
            />
          );
        case 'clinical-notes':
          return (
            <ClinicalNotesNLPView
              currentDoctor={currentDoctor}
              patients={users.filter((u) => u.role === 'patient')}
              preselectedPatientName={preselectedPatientForDoctor}
              onSaveNote={handleSaveClinicalNote}
            />
          );
        case 'prescriptions':
          return (
            <PrescriptionManagementView
              currentDoctor={currentDoctor}
              patients={users.filter((u) => u.role === 'patient')}
              preselectedPatientName={preselectedPatientForDoctor}
              onSavePrescription={handleSavePrescription}
            />
          );
        case 'xray-analysis':
          return (
            <XrayAnalysisView
              currentDoctor={currentDoctor}
              patients={users.filter((u) => u.role === 'patient')}
              onSaveReport={handleSaveXrayReport}
            />
          );
        case 'follow-ups':
          return (
            <FollowupManagementView
              currentDoctor={currentDoctor}
              patients={users.filter((u) => u.role === 'patient')}
              followups={followups}
              onAddFollowup={handleAddFollowup}
              onUpdateStatus={handleUpdateFollowupStatus}
            />
          );
        case 'medical-records':
          return (
            <MedicalRecordsView
              currentUser={currentUser}
              records={records}
            />
          );
        case 'profile':
          return (
            <PatientProfileView
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          );
        default:
          return (
            <DoctorDashboardView
              currentUser={currentDoctor}
              appointments={appointments}
              onNavigateTab={setCurrentTab}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onJoinMeeting={(apt) => setActiveMeetingApt(apt)}
              onOpenClinicalNote={(pName) => {
                setPreselectedPatientForDoctor(pName);
                setCurrentTab('clinical-notes');
              }}
            />
          );
      }
    }

    // ADMINISTRATOR ROLE
    if (currentUser.role === 'admin') {
      switch (currentTab) {
        case 'dashboard':
        case 'user-management':
        case 'appointments':
          return (
            <AdminDashboardView
              currentUser={currentUser}
              users={users}
              appointments={appointments}
              auditLogs={auditLogs}
              onToggleUserStatus={handleToggleUserStatus}
              onAddUser={handleAddUser}
              onNavigateTab={setCurrentTab}
            />
          );
        case 'audit-logs':
          return <AuditLogsView auditLogs={auditLogs} />;
        case 'system-settings':
          return <SystemSettingsView />;
        case 'medical-records':
        case 'prescriptions':
          return <MedicalRecordsView currentUser={currentUser} records={records} />;
        case 'profile':
          return (
            <PatientProfileView
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          );
        default:
          return (
            <AdminDashboardView
              currentUser={currentUser}
              users={users}
              appointments={appointments}
              auditLogs={auditLogs}
              onToggleUserStatus={handleToggleUserStatus}
              onAddUser={handleAddUser}
              onNavigateTab={setCurrentTab}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
      <div className="flex-1 flex">
        {/* Dark Navy Sidebar */}
        <Sidebar
          currentRole={currentUser.role}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onLogout={handleLogout}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            currentUser={currentUser}
            notifications={notifications}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onSelectRole={handleQuickRoleSwitch}
            onOpenProfile={() => setCurrentTab('profile')}
            onOpenNotifications={() => setShowNotificationsModal(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {renderMainContent()}
          </main>
        </div>
      </div>

      {/* Global Bottom Banner matching reference sheet */}
      <FooterBanner
        onNavigateTab={setCurrentTab}
        currentUserRole={currentUser?.role}
      />

      {/* Multi-Turn Gemini Dental AI Chatbot (gemini-3.1-flash-lite, gemini-3.8-flash, gemini-4-argon) */}
      <DentalAiChatbot
        currentUserRole={currentUser.role}
        currentUserName={currentUser.name}
      />

      {/* Video Consultation Modal (Google Meet Simulation) */}
      {activeMeetingApt && (
        <VideoConsultationModal
          appointment={activeMeetingApt}
          onClose={() => setActiveMeetingApt(null)}
          currentUserRole={currentUser.role}
        />
      )}

      {/* Printable Prescription Modal */}
      {activePrescriptionModal && (
        <PrescriptionModal
          prescription={activePrescriptionModal}
          onClose={() => setActivePrescriptionModal(null)}
        />
      )}

      {/* Notifications Drawer Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Your Notifications</h3>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Close
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-3 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                notifications.forEach((n) => Storage.markNotificationRead(n.id));
                refreshStorage();
                setShowNotificationsModal(false);
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
