
import React, { useState } from 'react';
import { Storage } from './utils/storage';
import {
  Appointment,
  Doctor,
  FollowUp,
  MedicalRecord,
  AppNotification,
  Prescription,
  User,
  UserRole
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
  const [currentUser, setCurrentUser] = useState<User | null>(
    () => Storage.getCurrentUser()
  );
  const [authScreen, setAuthScreen] = useState<
    'login' | 'signup' | 'role-select' | 'forgot-password'
  >('login');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Domain entities
  const [users, setUsers] = useState<User[]>(() => Storage.getUsers());
  const [doctors, setDoctors] = useState<Doctor[]>(() => Storage.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(
    () => Storage.getAppointments()
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(
    () => Storage.getPrescriptions()
  );
  const [records, setRecords] = useState<MedicalRecord[]>(
    () => Storage.getMedicalRecords()
  );
  const [followups, setFollowups] = useState<FollowUp[]>(
    () => Storage.getFollowups()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    () => Storage.getNotifications()
  );
  const [auditLogs, setAuditLogs] = useState(() => Storage.getAuditLogs());

  // Active modals and preselected values
  const [activeMeetingApt, setActiveMeetingApt] =
    useState<Appointment | null>(null);
  const [activePrescriptionModal, setActivePrescriptionModal] =
    useState<Prescription | null>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] =
    useState<Doctor | null>(null);
  const [preselectedPatientForDoctor, setPreselectedPatientForDoctor] =
    useState('');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Refresh data from storage
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

  // Authentication actions
  const handleLoginSuccess = (user: User) => {
    Storage.setCurrentUser(user);
    setCurrentUser(user);
    setCurrentTab('dashboard');
    setIsMobileMenuOpen(false);
    refreshStorage();
  };

  const handleLogout = () => {
    Storage.setCurrentUser(null);
    setCurrentUser(null);
    setAuthScreen('login');
    setIsMobileMenuOpen(false);
  };

  const handleQuickRoleSwitch = (role: UserRole) => {
    const candidate = users.find((user) => user.role === role);

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

  const handleUpdateAppointmentStatus = (
    id: string,
    status: Appointment['status']
  ) => {
    if (!currentUser) return;

    Storage.updateAppointmentStatus(id, status, currentUser);
    refreshStorage();
  };

  const handleCancelAppointment = (id: string) => {
    if (!currentUser) return;

    Storage.updateAppointmentStatus(id, 'Cancelled', currentUser);
    refreshStorage();
  };

  // Doctor clinical notes
  const handleSaveClinicalNote = (
    note: Parameters<typeof Storage.addClinicalNote>[0]
  ) => {
    Storage.addClinicalNote(note);
    refreshStorage();
  };

  // Doctor prescriptions
  const handleSavePrescription = (
    rx: Parameters<typeof Storage.addPrescription>[0]
  ) => {
    Storage.addPrescription(rx);
    refreshStorage();
  };

  // Doctor X-ray reports
  const handleSaveXrayReport = (
    report: Parameters<typeof Storage.addXrayReport>[0]
  ) => {
    Storage.addXrayReport(report);
    refreshStorage();
  };

  // Doctor follow-ups
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

  const handleUpdateFollowupStatus = (
    id: string,
    status: FollowUp['status']
  ) => {
    const list = Storage.getFollowups();
    const index = list.findIndex((followup) => followup.id === id);

    if (index !== -1) {
      list[index].status = status;
      localStorage.setItem('oralcare_followups', JSON.stringify(list));
      refreshStorage();
    }
  };

  // Profile updates
  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;

    const updated = Storage.updateUser(currentUser.id, updates);
    setCurrentUser(updated);
    refreshStorage();
  };

  // Admin user actions
  const handleToggleUserStatus = (userId: string) => {
    if (!currentUser) return;

    Storage.toggleUserStatus(userId, currentUser);
    refreshStorage();
  };

  const handleAddUser = (user: Parameters<typeof Storage.addUser>[0]) => {
    Storage.addUser(user);
    refreshStorage();
  };

  // Unauthenticated screen router
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
            const match = users.find((user) => user.role === role);
            if (match) handleLoginSuccess(match);
          }}
          onBackToLogin={() => setAuthScreen('login')}
        />
      );
    }

    if (authScreen === 'forgot-password') {
      return (
        <ForgotPasswordView
          onBackToLogin={() => setAuthScreen('login')}
        />
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

  // Active doctor object
  const currentDoctor =
    doctors.find((doctor) => doctor.id === currentUser.id) || doctors[0];

  // Render content based on role and selected tab
  const renderMainContent = () => {
    // PATIENT
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
              onSelectDoctorToBook={(doctor) => {
                setSelectedDoctorForBooking(doctor);
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
              records={records.filter(
                (record) => record.patientId === currentUser.id
              )}
            />
          );

        case 'online-consultation':
          return (
            <OnlineConsultationView
              currentUser={currentUser}
              appointment={appointments.find(
                (appointment) => appointment.patientId === currentUser.id
              )}
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

    // DOCTOR
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
              onOpenClinicalNote={(patientName) => {
                setPreselectedPatientForDoctor(patientName);
                setCurrentTab('clinical-notes');
              }}
            />
          );

        case 'patient-directory':
          return (
            <PatientDirectoryView
              patients={users.filter((user) => user.role === 'patient')}
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
              patients={users.filter((user) => user.role === 'patient')}
              preselectedPatientName={preselectedPatientForDoctor}
              onSaveNote={handleSaveClinicalNote}
            />
          );

        case 'prescriptions':
          return (
            <PrescriptionManagementView
              currentDoctor={currentDoctor}
              patients={users.filter((user) => user.role === 'patient')}
              preselectedPatientName={preselectedPatientForDoctor}
              onSavePrescription={handleSavePrescription}
            />
          );

        case 'xray-analysis':
          return (
            <XrayAnalysisView
              currentDoctor={currentDoctor}
              patients={users.filter((user) => user.role === 'patient')}
              onSaveReport={handleSaveXrayReport}
            />
          );

        case 'follow-ups':
          return (
            <FollowupManagementView
              currentDoctor={currentDoctor}
              patients={users.filter((user) => user.role === 'patient')}
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
              onOpenClinicalNote={(patientName) => {
                setPreselectedPatientForDoctor(patientName);
                setCurrentTab('clinical-notes');
              }}
            />
          );
      }
    }

    // ADMIN
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
    <div className="flex min-h-screen flex-col antialiased bg-[#F8FAFC]">
      {/* Sidebar and main content layout */}
      <div className="flex min-w-0 flex-1">
        <Sidebar
          currentRole={currentUser.role}
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsMobileMenuOpen(false);
          }}
          onLogout={handleLogout}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main content: never expands underneath the desktop sidebar */}
        <div className="flex min-w-0 flex-1 flex-col">
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

          <main className="mx-auto w-full max-w-7xl min-w-0 flex-1 p-4 md:p-8">
            {renderMainContent()}
          </main>
        </div>
      </div>

      {/* Global bottom banner */}
      <FooterBanner
        onNavigateTab={setCurrentTab}
        currentUserRole={currentUser.role}
      />

      {/* Dental AI chatbot */}
      <DentalAiChatbot
        currentUserRole={currentUser.role}
        currentUserName={currentUser.name}
      />

      {/* Video consultation modal */}
      {activeMeetingApt && (
        <VideoConsultationModal
          appointment={activeMeetingApt}
          onClose={() => setActiveMeetingApt(null)}
          currentUserRole={currentUser.role}
        />
      )}

      {/* Printable prescription modal */}
      {activePrescriptionModal && (
        <PrescriptionModal
          prescription={activePrescriptionModal}
          onClose={() => setActivePrescriptionModal(null)}
        />
      )}

      {/* Notifications modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Your Notifications
              </h3>

              <button
                type="button"
                onClick={() => setShowNotificationsModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-3 max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {notification.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {notification.timestamp}
                    </span>
                  </div>

                  <p className="mt-1 leading-relaxed text-slate-600">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                notifications.forEach((notification) =>
                  Storage.markNotificationRead(notification.id)
                );
                refreshStorage();
                setShowNotificationsModal(false);
              }}
              className="mt-4 w-full rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
