export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  qualifications?: string;
  experience?: string;
  hospital?: string;
  address?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  qualifications: string;
  experience: string;
  availableDays: string[];
  slots: string[];
  rating: number;
  reviewCount: number;
  consultationFee: number;
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'In Progress' | 'Cancelled';
export type ConsultationType = 'In-Clinic' | 'Online Consultation (Google Meet)';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  type: ConsultationType;
  status: AppointmentStatus;
  reason: string;
  isUrgent?: boolean;
  meetLink?: string;
  meetId?: string;
  fee: number;
  createdAt: string;
}

export interface ExtractedDentalNLP {
  symptoms: string[];
  duration: string;
  toothNumbers: string[];
  region: string;
  condition: string;
  findings: string;
  diagnosis: string;
  treatment: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  followUp: string;
  confidence: number;
  uncertainFields: string[];
}

export interface ClinicalNote {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  rawText: string;
  extracted: ExtractedDentalNLP;
  verifiedByDoctor: boolean;
  notes?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  foodTiming: 'Before food' | 'After food' | 'With food' | 'As needed';
  instructions: string;
  category: 'Antibiotic' | 'Pain Relief (NSAID)' | 'Antiseptic Mouthwash' | 'Analgesic' | 'Supplement';
  sideEffects?: string;
  warnings?: string;
  missedDose?: string;
  image?: string;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: MedicineItem[];
  instructions: string;
  status: 'Active' | 'Completed';
  ocrSourceImage?: string;
  patientFriendlySummary?: {
    english: string;
    hindi: string;
    telugu: string;
  };
}

export interface XrayAnalysisResult {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  imageUrl: string;
  fileName: string;
  findings: string[];
  affectedTeeth: string[];
  region: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  preliminaryReport: string;
  verifiedByDoctor: boolean;
  doctorRemarks?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'Consultation Note' | 'Prescription' | 'Dental X-ray' | 'Follow-up Report';
  date: string;
  doctorName: string;
  title: string;
  summary: string;
  downloadUrl?: string;
  referenceId: string;
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  status: 'Upcoming' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notificationSent: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'appointment' | 'prescription' | 'report' | 'followup' | 'system';
  linkTarget?: string;
}

export type Notification = AppNotification;

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
}
