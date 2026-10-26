import {
  Appointment,
  AuditLog,
  ClinicalNote,
  Doctor,
  FollowUp,
  MedicalRecord,
  Notification,
  Prescription,
  User,
  UserRole,
  XrayAnalysisResult
} from '../types';
import {
  INITIAL_ADMIN,
  INITIAL_APPOINTMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLINICAL_NOTES,
  INITIAL_DOCTORS,
  INITIAL_FOLLOWUPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PATIENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_RECORDS,
  INITIAL_XRAYS
} from './mockData';

// Safe Firestore background sync helper
async function syncToFirestore(collectionName: string, id: string, data: any) {
  try {
    const { db } = await import('../firebase');
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, collectionName, id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    // Graceful fallback if offline or permissions pending
    console.warn(`Firestore sync note for ${collectionName}/${id}:`, err);
  }
}

const KEYS = {
  USERS: 'oralcare_users',
  DOCTORS: 'oralcare_doctors',
  APPOINTMENTS: 'oralcare_appointments',
  PRESCRIPTIONS: 'oralcare_prescriptions',
  CLINICAL_NOTES: 'oralcare_clinical_notes',
  XRAYS: 'oralcare_xrays',
  RECORDS: 'oralcare_records',
  FOLLOWUPS: 'oralcare_followups',
  NOTIFICATIONS: 'oralcare_notifications',
  AUDIT_LOGS: 'oralcare_audit_logs',
  SESSION: 'oralcare_session'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to persist ${key}`, err);
  }
}

export const Storage = {
  getUsers(): User[] {
    const fallback = [...INITIAL_PATIENTS, ...INITIAL_DOCTORS, INITIAL_ADMIN];
    return getStored<User[]>(KEYS.USERS, fallback);
  },

  getDoctors(): Doctor[] {
    return getStored<Doctor[]>(KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  getAppointments(): Appointment[] {
    return getStored<Appointment[]>(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  getPrescriptions(): Prescription[] {
    return getStored<Prescription[]>(KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },

  getClinicalNotes(): ClinicalNote[] {
    return getStored<ClinicalNote[]>(KEYS.CLINICAL_NOTES, INITIAL_CLINICAL_NOTES);
  },

  getXrays(): XrayAnalysisResult[] {
    return getStored<XrayAnalysisResult[]>(KEYS.XRAYS, INITIAL_XRAYS);
  },

  getMedicalRecords(): MedicalRecord[] {
    return getStored<MedicalRecord[]>(KEYS.RECORDS, INITIAL_RECORDS);
  },

  getFollowups(): FollowUp[] {
    return getStored<FollowUp[]>(KEYS.FOLLOWUPS, INITIAL_FOLLOWUPS);
  },

  getNotifications(): Notification[] {
    return getStored<Notification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(KEYS.SESSION);
      if (raw) return JSON.parse(raw);
      // Default to Neela Bhavya Sri (patient) as seen in user's UI screenshot
      const defaultUser = INITIAL_PATIENTS[0];
      localStorage.setItem(KEYS.SESSION, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return INITIAL_PATIENTS[0];
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
      this.addAuditLog({
        actorName: user.name,
        actorRole: user.role,
        action: 'User login',
        details: `Active session started for ${user.email} (${user.role}).`
      });
    } else {
      const current = this.getCurrentUser();
      if (current) {
        this.addAuditLog({
          actorName: current.name,
          actorRole: current.role,
          action: 'User logout',
          details: `Session cleared for ${current.email}.`
        });
      }
      localStorage.removeItem(KEYS.SESSION);
    }
  },

  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      ipAddress: '127.0.0.1',
      ...log
    };
    logs.unshift(newLog);
    setStored(KEYS.AUDIT_LOGS, logs.slice(0, 100));
    syncToFirestore('audit_logs', newLog.id, newLog);
  },

  addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const list = this.getAppointments();
    
    // Double booking check: same doctor, same date, same time (unless cancelled)
    const conflict = list.find(
      (a) =>
        a.doctorId === appointment.doctorId &&
        a.date === appointment.date &&
        a.time === appointment.time &&
        a.status !== 'Cancelled'
    );

    if (conflict) {
      throw new Error(`Time slot ${appointment.time} on ${appointment.date} is already booked for this doctor.`);
    }

    const newApt: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    list.unshift(newApt);
    setStored(KEYS.APPOINTMENTS, list);
    syncToFirestore('appointments', newApt.id, newApt);

    this.addAuditLog({
      actorName: appointment.patientName,
      actorRole: 'patient',
      action: 'Appointment booked',
      details: `Scheduled ${appointment.type} with ${appointment.doctorName} on ${appointment.date} at ${appointment.time}.`
    });

    // Notify patient
    this.addNotification({
      userId: appointment.patientId,
      title: 'Appointment Request Submitted',
      message: `Your booking with ${appointment.doctorName} for ${appointment.date} at ${appointment.time} is ${appointment.status}.`,
      type: 'appointment'
    });

    return newApt;
  },

  updateAppointmentStatus(id: string, status: Appointment['status'], actor: User): Appointment {
    const list = this.getAppointments();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Appointment not found');

    const prev = list[index];
    let meetLink = prev.meetLink;
    let meetId = prev.meetId;

    // Automatically generate Google Meet if approved/confirmed and online consultation
    if (status === 'Confirmed' && (!meetLink || meetLink === '')) {
      const code = 'oral-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
      meetId = code;
      meetLink = `https://meet.google.com/${code}`;
    }

    list[index] = {
      ...prev,
      status,
      meetLink,
      meetId
    };

    setStored(KEYS.APPOINTMENTS, list);
    syncToFirestore('appointments', list[index].id, list[index]);

    this.addAuditLog({
      actorName: actor.name,
      actorRole: actor.role,
      action: 'Appointment status updated',
      details: `Appointment ${id} changed from ${prev.status} to ${status}.`
    });

    this.addNotification({
      userId: prev.patientId,
      title: `Appointment ${status}`,
      message: `Your appointment with ${prev.doctorName} is now ${status}.${meetLink ? ` Meeting link: ${meetLink}` : ''}`,
      type: 'appointment'
    });

    return list[index];
  },

  addClinicalNote(note: Omit<ClinicalNote, 'id' | 'date'>): ClinicalNote {
    const list = this.getClinicalNotes();
    const newNote: ClinicalNote = {
      ...note,
      id: `cn-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    list.unshift(newNote);
    setStored(KEYS.CLINICAL_NOTES, list);
    syncToFirestore('clinical_notes', newNote.id, newNote);

    this.addAuditLog({
      actorName: note.doctorName,
      actorRole: 'doctor',
      action: 'Clinical note saved',
      details: `Neural NLP consultation notes persisted for ${note.patientName}.`
    });

    // Also add to Medical Records
    this.addMedicalRecord({
      patientId: note.patientId,
      type: 'Consultation Note',
      date: newNote.date,
      doctorName: note.doctorName,
      title: `Dental Consultation — ${note.extracted.diagnosis || 'Clinical Findings'}`,
      summary: note.rawText.slice(0, 150) + '...',
      referenceId: newNote.id
    });

    return newNote;
  },

  addPrescription(prescription: Omit<Prescription, 'id' | 'date'>): Prescription {
    const list = this.getPrescriptions();
    const newRx: Prescription = {
      ...prescription,
      id: `rx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    list.unshift(newRx);
    setStored(KEYS.PRESCRIPTIONS, list);
    syncToFirestore('prescriptions', newRx.id, newRx);

    this.addAuditLog({
      actorName: prescription.doctorName,
      actorRole: 'doctor',
      action: 'Prescription created',
      details: `Prescribed ${newRx.medicines.length} medicines for ${newRx.patientName}.`
    });

    this.addMedicalRecord({
      patientId: newRx.patientId,
      type: 'Prescription',
      date: newRx.date,
      doctorName: newRx.doctorName,
      title: `Prescription — ${newRx.medicines.map((m) => m.name).join(', ')}`,
      summary: `Diagnosis: ${newRx.diagnosis}. Instructions: ${newRx.instructions}`,
      referenceId: newRx.id
    });

    this.addNotification({
      userId: newRx.patientId,
      title: 'Prescription is ready',
      message: `${newRx.doctorName} has issued your e-prescription for ${newRx.medicines.length} items.`,
      type: 'prescription'
    });

    return newRx;
  },

  addXrayReport(xray: Omit<XrayAnalysisResult, 'id' | 'date'>): XrayAnalysisResult {
    const list = this.getXrays();
    const newReport: XrayAnalysisResult = {
      ...xray,
      id: `xray-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    list.unshift(newReport);
    setStored(KEYS.XRAYS, list);

    this.addAuditLog({
      actorName: 'AI Vision Engine & Doctor',
      actorRole: 'doctor',
      action: 'X-ray analysis saved',
      details: `Radiographic analysis stored for ${newReport.patientName} (${newReport.affectedTeeth.join(', ')}).`
    });

    this.addMedicalRecord({
      patientId: newReport.patientId,
      type: 'Dental X-ray',
      date: newReport.date,
      doctorName: 'Dental Radiology AI',
      title: `Dental Radiograph Analysis — ${newReport.affectedTeeth.join(', ') || 'Arch Scan'}`,
      summary: newReport.preliminaryReport,
      referenceId: newReport.id
    });

    return newReport;
  },

  addMedicalRecord(record: Omit<MedicalRecord, 'id'>): MedicalRecord {
    const list = this.getMedicalRecords();
    const newRec: MedicalRecord = {
      ...record,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    list.unshift(newRec);
    setStored(KEYS.RECORDS, list);
    return newRec;
  },

  addNotification(notif: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const list = this.getNotifications();
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    list.unshift(newNotif);
    setStored(KEYS.NOTIFICATIONS, list);
    return newNotif;
  },

  markNotificationRead(id: string) {
    const list = this.getNotifications();
    const item = list.find((n) => n.id === id);
    if (item) item.read = true;
    setStored(KEYS.NOTIFICATIONS, list);
  },

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existing) {
      throw new Error(`An account with email ${user.email} already exists.`);
    }

    const newUser: User = {
      ...user,
      id: `${user.role.substring(0, 3)}-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    users.unshift(newUser);
    setStored(KEYS.USERS, users);

    // If doctor, also save to doctors list
    if (user.role === 'doctor') {
      const doctors = this.getDoctors();
      const doc: Doctor = {
        ...newUser,
        role: 'doctor',
        specialty: user.specialty || 'General Dentist',
        qualifications: user.qualifications || 'BDS',
        experience: user.experience || '5+ yrs experience',
        hospital: user.hospital || 'OralCare Dental Hospital',
        rating: 5.0,
        reviewCount: 1,
        consultationFee: 500,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
      };
      doctors.push(doc);
      setStored(KEYS.DOCTORS, doctors);
    }

    this.addAuditLog({
      actorName: 'System / Auth',
      actorRole: user.role,
      action: 'User registered',
      details: `Created new ${user.role} profile for ${user.name} (${user.email}).`
    });

    return newUser;
  },

  updateUser(id: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');

    users[idx] = { ...users[idx], ...updates };
    setStored(KEYS.USERS, users);

    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.setCurrentUser(users[idx]);
    }

    this.addAuditLog({
      actorName: users[idx].name,
      actorRole: users[idx].role,
      action: 'Profile updated',
      details: `Updated personal information for ${users[idx].email}.`
    });

    return users[idx];
  },

  toggleUserStatus(id: string, actor: User): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found');

    const nextStatus = users[idx].status === 'active' ? 'inactive' : 'active';
    users[idx].status = nextStatus;
    setStored(KEYS.USERS, users);

    this.addAuditLog({
      actorName: actor.name,
      actorRole: actor.role,
      action: 'Account status toggled',
      details: `Changed ${users[idx].name}'s account status to ${nextStatus}.`
    });

    return users[idx];
  }
};
