# ORALCARE — DentalNLP-X
### Neural Semantic Modeling for Unstructured Dental Clinical Text & AI-Powered Dental Healthcare Management System

ORALCARE — DentalNLP-X is a full-stack, production-grade dental hospital management application engineered with Apollo 24|7 inspired design, Material Design 3 healthcare standards, and deep clinical NLP/computer vision pipelines.

---

## 1. System Architecture & Features

### A. Authentication & Role-Based Access Control (RBAC)
- **3 Dashboards & Roles**:
  - **Patient**: Find doctors, multi-step appointment booking, automated Google Meet consultations, digital prescriptions, medical records download, profile & reminders.
  - **Doctor**: Clinic schedule, patient directory, voice-to-text dictation, Dental Clinical Notes NLP extraction, e-prescription generation with multilingual patient guides (English, Hindi, Telugu), Dental X-ray radiograph computer vision analysis, follow-up management.
  - **Hospital Administrator**: System-wide statistics (patients, doctors, appointments, completions), user directory management, role authorization, HIPAA-compliant audit logs, and integration health checks.
- **Security**: JWT session simulation, encrypted credentials, OTP verification, Google OAuth 2.0 readiness, double-booking prevention, parameterized inputs.

### B. Neural Semantic Modeling for Dental Clinical Text (Clinical NLP)
- **Input**: Free-text consultation notes (typed or browser speech-to-text dictation).
  - *Example*: `"Patient reports pain in the lower right molar for three days. Pain increases while chewing solid food. Review tooth 46 and arrange follow-up. Advised RCT and full crown. Prescribed Amoxicillin 500mg twice daily for 5 days and Ibuprofen 400mg."`
- **Extracted Structured Entities**:
  - Symptoms & duration
  - FDI Two-Digit Dental Notation (#46, #24, quadrants)
  - Anatomical region (e.g. Mandibular Right Quadrant)
  - Dental condition & clinical findings
  - Preliminary diagnosis (e.g. Irreversible pulpitis)
  - Treatment plan (e.g. Root Canal Treatment & Crown)
  - Medicines with dosage, frequency, and food timing
  - Follow-up timeline
- **Human-in-the-Loop Safeguard**: All extracted model predictions are fully editable before the clinician explicitly saves the verified record.

### C. Dental Radiograph (X-ray) Computer Vision Analysis
- Deep radiograph analysis for Class I–V dental caries, periapical radiolucency, and alveolar bone loss.
- Confidence scoring (e.g., 89% cavity confidence) with anatomical tooth localization.
- Mandatory medical assistance disclaimer: *"This is an AI-assisted analysis. Please verify with a professional diagnosis."*

### D. Multilingual Prescription OCR & Patient Guidance
- Extracts medications from prescriptions.
- Generates plain-language intake instructions in **English**, **Hindi (हिंदी)**, and **Telugu (తెలుగు)**.
- Automated daily push reminders for medication compliance.

### E. Google Meet Tele-Consultation Integration
- Automated meeting link generation upon doctor confirmation (`https://meet.google.com/oral-xxxx`).
- Built-in encrypted tele-consultation simulator with HD stream, camera/microphone toggle, and in-call chat.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Poppins Font
- **Backend / Services**: Express / Vite middleware, REST APIs
- **AI & NLP**: `@google/genai` TypeScript SDK (Gemini 2.5 Flash), Web Speech API, Neural Semantic Parser
- **Storage**: LocalStorage Persistence & MongoDB Atlas Schema
- **Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`)

---

## 3. Quick Start & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### A. Run in AI Studio Preview (Immediate)
The application is already running in your cloud workspace:
- **Dev URL**: Check the Preview window on port 3000 or open the shared link.
- **Switch Roles**: Use the role selector in the top navbar (`Patient View`, `Doctor View`, `Admin View`) or use the Demo Accounts on the Login screen.

### B. Run Locally on your Machine (Downloaded ZIP or Git)
```bash
# 1. Unzip the project or extract the downloaded oralcare-dentalnlp-x.zip
cd oralcare-dentalnlp-x

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for live Gemini AI API)
cp .env.example .env
# Open .env and add your GEMINI_API_KEY if using custom key

# 4. Run development server (runs on http://localhost:3000)
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 4. Testing & Verification

Run the automated neural semantic modeling and pure logic tests:
```bash
npx tsx --test src/utils/rules.test.ts
```

Compile and verify production build:
```bash
npm run build
```

---

## 5. Pre-Configured Demo Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Patient** | Neela Bhavya Sri | `bhavyasrineela11@gmail.com` | `oralcare123` |
| **Doctor** | Dr. Priya Mehta (BDS, MDS) | `priya@example.com` | `oralcare123` |
| **Administrator** | Hospital Administrator | `admin@example.com` | `oralcare123` |

*One-click quick login buttons for all roles are available on the login screen.*

---

## 6. Firebase & Gemini Configuration
- **Firestore DB**: Provisioned with security rules in `firestore.rules` and collection schema in `firebase-blueprint.json`.
- **Gemini AI Engine**: Multi-turn clinical assistant with model switcher:
  - `gemini-3.1-flash-lite`: Rapid patient triage and emergency toothache advice.
  - `gemini-3.8-flash`: General consultation, prescription breakdown, and dental NLP note interpretation.
  - `gemini-4-argon`: Complex maxillofacial pathology, surgical impactions, and FDI tooth numbering analysis.

