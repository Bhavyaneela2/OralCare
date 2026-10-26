import { Appointment, AuditLog, ClinicalNote, Doctor, FollowUp, MedicalRecord, Notification, Prescription, User, XrayAnalysisResult } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Priya Mehta',
    email: 'priya@example.com',
    phone: '+91 9845012345',
    role: 'doctor',
    specialty: 'General Dentist',
    qualifications: 'BDS, MDS (Prosthodontics)',
    experience: '8+ yrs experience',
    hospital: 'OralCare Super Specialty Clinic, Jubilee Hills, Hyderabad',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    rating: 4.9,
    reviewCount: 142,
    consultationFee: 600,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 9822098765',
    role: 'doctor',
    specialty: 'Orthodontist',
    qualifications: 'BDS, MDS (Orthodontics & Dentofacial)',
    experience: '10+ yrs experience',
    hospital: 'Apollo Dental Institute, Banjara Hills, Hyderabad',
    address: 'Banjara Hills, Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    rating: 4.8,
    reviewCount: 98,
    consultationFee: 750,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    slots: ['12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM'],
    createdAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'doc-3',
    name: 'Dr. Anjali Sharma',
    email: 'anjali@example.com',
    phone: '+91 9711045678',
    role: 'doctor',
    specialty: 'Oral Surgeon',
    qualifications: 'BDS, MDS (Oral & Maxillofacial Surgery)',
    experience: '6+ yrs experience',
    hospital: 'Manipal Dental Health, Gachibowli, Hyderabad',
    address: 'Financial District, Gachibowli, Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1594824813637-43c224a0d9e8?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    rating: 4.9,
    reviewCount: 84,
    consultationFee: 800,
    availableDays: ['Tue', 'Thu', 'Sat'],
    slots: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'doc-4',
    name: 'Dr. Vikram Malhotra',
    email: 'vikram.dr@example.com',
    phone: '+91 9888011223',
    role: 'doctor',
    specialty: 'Endodontist',
    qualifications: 'BDS, MDS (Conservative Dentistry & Endodontics)',
    experience: '12+ yrs experience',
    hospital: 'OralCare Advanced Micro-Endodontics, Madhapur, Hyderabad',
    address: 'Hitech City, Madhapur, Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    status: 'active',
    rating: 5.0,
    reviewCount: 215,
    consultationFee: 850,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    slots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM'],
    createdAt: '2023-11-20T08:00:00Z',
  }
];

export const INITIAL_PATIENTS: User[] = [
  {
    id: 'pat-1',
    name: 'Neela Bhavya Sri',
    email: 'bhavyasrineela11@gmail.com',
    phone: '+91 9006480779',
    role: 'patient',
    address: 'Jubilee Hills, Hyderabad, Telangana',
    status: 'active',
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'pat-2',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 9876543210',
    role: 'patient',
    address: 'Madhapur, Hyderabad, Telangana',
    status: 'active',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'pat-3',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    phone: '+91 9123456780',
    role: 'patient',
    address: 'Kukatpally, Hyderabad, Telangana',
    status: 'active',
    createdAt: '2025-02-15T11:00:00Z',
  },
  {
    id: 'pat-4',
    name: 'Arjun Patel',
    email: 'arjun@example.com',
    phone: '+91 9988776655',
    role: 'patient',
    address: 'Kondapur, Hyderabad, Telangana',
    status: 'active',
    createdAt: '2025-03-01T14:00:00Z',
  },
  {
    id: 'pat-5',
    name: 'Priya Singh',
    email: 'priyasingh@example.com',
    phone: '+91 9445566778',
    role: 'patient',
    address: 'Secunderabad, Telangana',
    status: 'active',
    createdAt: '2025-03-12T16:00:00Z',
  },
  {
    id: 'pat-6',
    name: 'Karthik Rao',
    email: 'karthik@example.com',
    phone: '+91 9332211445',
    role: 'patient',
    address: 'Begumpet, Hyderabad, Telangana',
    status: 'active',
    createdAt: '2025-03-20T12:00:00Z',
  },
  {
    id: 'pat-7',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    phone: '+91 9112233445',
    role: 'patient',
    address: 'Gachibowli, Hyderabad, Telangana',
    status: 'active',
    createdAt: '2025-03-25T09:30:00Z',
  }
];

export const INITIAL_ADMIN: User = {
  id: 'admin-1',
  name: 'Hospital Administrator',
  email: 'admin@example.com',
  phone: '+91 9000012345',
  role: 'admin',
  address: 'OralCare Headquarters, HITEC City, Hyderabad',
  status: 'active',
  createdAt: '2023-01-01T00:00:00Z',
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientId: 'pat-1',
    patientName: 'Neela Bhavya Sri',
    patientPhone: '+91 9006480779',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    doctorSpecialty: 'General Dentist • BDS, MDS',
    date: 'May 02, 2025',
    time: '10:30 AM',
    type: 'Online Consultation (Google Meet)',
    status: 'Confirmed',
    reason: 'Severe lower molar sensitivity and slight chewing pain',
    isUrgent: false,
    meetLink: 'https://meet.google.com/xyz-oral-care',
    meetId: 'xyz-oral-care',
    fee: 600,
    createdAt: '2025-04-26T08:30:00Z',
  },
  {
    id: 'apt-102',
    patientId: 'pat-2',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 9876543210',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    doctorSpecialty: 'General Dentist',
    date: 'Apr 28, 2025',
    time: '09:00 AM',
    type: 'In-Clinic',
    status: 'Completed',
    reason: 'Tooth pain lower right molar #46',
    fee: 600,
    createdAt: '2025-04-24T10:00:00Z',
  },
  {
    id: 'apt-103',
    patientId: 'pat-3',
    patientName: 'Sneha Reddy',
    patientPhone: '+91 9123456780',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    doctorSpecialty: 'General Dentist',
    date: 'Apr 28, 2025',
    time: '10:30 AM',
    type: 'In-Clinic',
    status: 'In Progress',
    reason: 'Follow-up root canal therapy review',
    fee: 400,
    createdAt: '2025-04-25T11:30:00Z',
  },
  {
    id: 'apt-104',
    patientId: 'pat-4',
    patientName: 'Arjun Patel',
    patientPhone: '+91 9988776655',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    doctorSpecialty: 'General Dentist',
    date: 'Apr 28, 2025',
    time: '12:00 PM',
    type: 'Online Consultation (Google Meet)',
    status: 'Confirmed',
    reason: 'Crown seating discomfort',
    meetLink: 'https://meet.google.com/arj-pat-oral',
    meetId: 'arj-pat-oral',
    fee: 600,
    createdAt: '2025-04-26T14:00:00Z',
  },
  {
    id: 'apt-105',
    patientId: 'pat-5',
    patientName: 'Priya Singh',
    patientPhone: '+91 9445566778',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    doctorSpecialty: 'General Dentist',
    date: 'Apr 28, 2025',
    time: '03:00 PM',
    type: 'In-Clinic',
    status: 'Confirmed',
    reason: 'Routine dental scaling and calculus check',
    fee: 600,
    createdAt: '2025-04-27T09:15:00Z',
  },
  {
    id: 'apt-106',
    patientId: 'pat-6',
    patientName: 'Karthik Rao',
    patientPhone: '+91 9332211445',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    doctorSpecialty: 'General Dentist',
    date: 'Apr 28, 2025',
    time: '04:30 PM',
    type: 'In-Clinic',
    status: 'Pending',
    reason: 'Gum bleeding on brushing',
    fee: 600,
    createdAt: '2025-04-28T07:45:00Z',
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-201',
    appointmentId: 'apt-101',
    patientId: 'pat-1',
    patientName: 'Neela Bhavya Sri',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    date: 'Apr 25, 2025',
    diagnosis: 'Acute reversible pulpitis with dentin hypersensitivity',
    instructions: 'Maintain warm saline rinses twice daily. Avoid very cold beverages.',
    status: 'Active',
    patientFriendlySummary: {
      english: 'Take Amoxicillin twice daily with water after meals to prevent infection. Take Ibuprofen only if experiencing pain.',
      hindi: 'संक्रमण से बचने के लिए भोजन के बाद दिन में दो बार एमोक्सिसिलिन लें। केवल दर्द होने पर ही इबुप्रोफेन लें।',
      telugu: 'ఇన్‌ఫెక్షన్‌ను నివారించడానికి భోజనం తర్వాత రోజుకు రెండుసార్లు అమోక్సిసిలిన్ తీసుకోండి. నొప్పి ఉంటే మాత్రమే ఇబుప్రోఫెన్ వాడండి.'
    },
    medicines: [
      {
        id: 'med-1',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '5 days',
        foodTiming: 'After food',
        instructions: 'Complete full 5 days antibiotic course without skipping',
        category: 'Antibiotic',
        sideEffects: 'Mild nausea, stomach upset',
        warnings: 'Do not consume with alcohol. Inform if penicillin allergy.',
        missedDose: 'Take as soon as remembered, unless close to next dose.'
      },
      {
        id: 'med-2',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Twice daily',
        duration: '3 days',
        foodTiming: 'After food',
        instructions: 'Take only when experiencing discomfort or pain',
        category: 'Pain Relief (NSAID)',
        sideEffects: 'Mild gastritis',
        warnings: 'Always take after solid food with a glass of water.'
      }
    ]
  },
  {
    id: 'rx-202',
    patientId: 'pat-1',
    patientName: 'Neela Bhavya Sri',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    date: 'Apr 10, 2025',
    diagnosis: 'Post-scaling prophylaxis and mild gingivitis',
    instructions: 'Use mouthwash for 1 minute before spitting. Do not rinse with water immediately.',
    status: 'Completed',
    medicines: [
      {
        id: 'med-3',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '2 days',
        foodTiming: 'After food',
        instructions: 'Take if mild throbbing after cleaning',
        category: 'Analgesic'
      },
      {
        id: 'med-4',
        name: 'Chlorhexidine 0.2% Mouthwash',
        dosage: '10ml',
        frequency: 'Twice daily',
        duration: '7 days',
        foodTiming: 'After food',
        instructions: 'Swish for 60 seconds after brushing',
        category: 'Antiseptic Mouthwash'
      }
    ]
  }
];

export const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'cn-301',
    patientId: 'pat-2',
    patientName: 'Rahul Sharma',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    date: 'Apr 28, 2025',
    rawText: 'Patient reports severe pain in the lower right molar for three days. Pain increases while chewing solid food. Clinical examination reveals deep occlusal caries on tooth 46 with tenderness on vertical percussion. Advised root canal treatment (RCT) followed by ceramic crown restoration. Prescribed Amoxicillin 500mg BD for 5 days and Ibuprofen 400mg SOS. Review in 7 days.',
    verifiedByDoctor: true,
    extracted: {
      symptoms: ['severe tooth pain', 'pain increases while chewing'],
      duration: '3 days',
      toothNumbers: ['46'],
      region: 'Lower right quadrant (mandibular right first molar)',
      condition: 'Deep occlusal caries, Acute irreversible pulpitis',
      findings: 'Tenderness on vertical percussion, cavitation into dentin',
      diagnosis: 'Irreversible pulpitis tooth 46',
      treatment: 'Root Canal Treatment (RCT) and Crown placement',
      medicines: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Twice daily (BD)',
          duration: '5 days',
          instructions: 'After meals'
        },
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'As needed (SOS)',
          duration: '3 days',
          instructions: 'After meals'
        }
      ],
      followUp: 'Recommended in 7 days',
      confidence: 0.94,
      uncertainFields: []
    }
  }
];

export const INITIAL_XRAYS: XrayAnalysisResult[] = [
  {
    id: 'xray-401',
    patientId: 'pat-1',
    patientName: 'Neela Bhavya Sri',
    doctorId: 'doc-1',
    date: 'Apr 23, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    fileName: 'radiograph_panoramic_46.jpg',
    findings: [
      'Radiolucency in coronal enamel & dentin of tooth 46 (deep cavity)',
      'Intact lamina dura, mild crestal bone loss (2mm)',
      'Normal root morphology without apical granuloma'
    ],
    affectedTeeth: ['46 (Lower Right 1st Molar)'],
    region: 'Lower Right Quadrant',
    confidence: 0.89,
    severity: 'Moderate',
    preliminaryReport: 'Neural vision model identified localized radiolucency consistent with Class I occlusal dental caries approaching the pulp chamber on mandibular tooth 46. Surrounding periodontal ligament space is normal.',
    verifiedByDoctor: true,
    doctorRemarks: 'Correlates with clinical symptoms. Will proceed with pulp therapy.'
  }
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-501',
    patientId: 'pat-1',
    type: 'Consultation Note',
    date: 'Apr 23, 2025',
    doctorName: 'Dr. Priya Mehta',
    title: 'Consultation Note — Pulpitis Examination',
    summary: 'Clinical diagnosis of pulpal hyperemia on tooth 46 with cold sensitivity.',
    referenceId: 'cn-301'
  },
  {
    id: 'rec-502',
    patientId: 'pat-1',
    type: 'Prescription',
    date: 'Apr 18, 2025',
    doctorName: 'Dr. Priya Mehta',
    title: 'Prescription — Amoxicillin & Ibuprofen',
    summary: 'Antibiotic prophylactic course and analgesics for dental pain management.',
    referenceId: 'rx-201'
  },
  {
    id: 'rec-503',
    patientId: 'pat-1',
    type: 'Dental X-ray',
    date: 'Apr 10, 2025',
    doctorName: 'Dr. Rajesh Kumar',
    title: 'Dental Panoramic Radiograph (OPG)',
    summary: 'Full mouth panoramic radiograph assessing mandibular molar arch alignment.',
    referenceId: 'xray-401'
  },
  {
    id: 'rec-504',
    patientId: 'pat-1',
    type: 'Follow-up Report',
    date: 'Apr 02, 2025',
    doctorName: 'Dr. Priya Mehta',
    title: 'Follow-up Checkup & Plaque Index',
    summary: 'Gingival healing verified post-ultrasonic scaling session.',
    referenceId: 'apt-101'
  }
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fu-601',
    patientId: 'pat-1',
    patientName: 'Neela Bhavya Sri',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    scheduledDate: 'May 30, 2025',
    scheduledTime: '10:00 AM',
    reason: 'Post-treatment checkup and crown fit verification',
    status: 'Upcoming',
    notificationSent: true,
  },
  {
    id: 'fu-602',
    patientId: 'pat-3',
    patientName: 'Sneha Reddy',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Mehta',
    scheduledDate: 'May 05, 2025',
    scheduledTime: '11:00 AM',
    reason: 'Root canal obturation review',
    status: 'Upcoming',
    notificationSent: true,
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-701',
    userId: 'pat-1',
    title: 'Your appointment is confirmed',
    message: 'Online Consultation with Dr. Priya Mehta scheduled for May 02, 2025 • 10:30 AM',
    timestamp: 'Apr 26, 2025 • 08:30 PM',
    read: false,
    type: 'appointment',
  },
  {
    id: 'notif-702',
    userId: 'pat-1',
    title: 'Prescription is ready',
    message: 'Dr. Priya Mehta has issued your electronic prescription.',
    timestamp: 'Apr 25, 2025 • 04:30 PM',
    read: false,
    type: 'prescription',
  },
  {
    id: 'notif-703',
    userId: 'pat-1',
    title: 'Follow-up reminder',
    message: 'Scheduled follow-up on May 30, 2025 • 10:00 AM with Dr. Priya Mehta.',
    timestamp: 'Apr 17, 2025 • 10:00 AM',
    read: true,
    type: 'followup',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-801',
    timestamp: 'Apr 28, 2025 • 10:32 AM',
    actorName: 'rahul@example.com',
    actorRole: 'patient',
    action: 'User login',
    details: 'Authenticated via email/password session token.',
    ipAddress: '49.205.112.44'
  },
  {
    id: 'log-802',
    timestamp: 'Apr 28, 2025 • 10:15 AM',
    actorName: 'Dr. Priya Mehta',
    actorRole: 'doctor',
    action: 'Clinical note saved',
    details: 'Dental NLP analysis verified and persisted for Rahul Sharma (Tooth #46).',
    ipAddress: '182.73.22.10'
  },
  {
    id: 'log-803',
    timestamp: 'Apr 28, 2025 • 09:45 AM',
    actorName: 'Dr. Priya Mehta',
    actorRole: 'doctor',
    action: 'Appointment updated',
    details: 'Status changed to In Progress for patient Sneha Reddy.',
    ipAddress: '182.73.22.10'
  },
  {
    id: 'log-804',
    timestamp: 'Apr 28, 2025 • 08:30 AM',
    actorName: 'Dr. Priya Mehta',
    actorRole: 'doctor',
    action: 'X-ray analysis completed',
    details: 'Computer vision neural report approved for patient Arjun Patel.',
    ipAddress: '182.73.22.10'
  },
  {
    id: 'log-805',
    timestamp: 'Apr 26, 2025 • 04:15 PM',
    actorName: 'Hospital Administrator',
    actorRole: 'admin',
    action: 'Role changed',
    details: 'Authorized Dr. Anjali Sharma account status to Active.',
    ipAddress: '103.21.144.9'
  }
];
