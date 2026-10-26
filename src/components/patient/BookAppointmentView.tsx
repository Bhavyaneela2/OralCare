import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  User
} from 'lucide-react';
import { Appointment, Doctor, User as UserType } from '../../types';

interface BookAppointmentViewProps {
  currentUser: UserType;
  doctors: Doctor[];
  preselectedDoctor?: Doctor | null;
  onBookSuccess: (apt: Appointment) => void;
  onCancel: () => void;
  existingAppointments: Appointment[];
}

export const BookAppointmentView: React.FC<BookAppointmentViewProps> = ({
  currentUser,
  doctors,
  preselectedDoctor,
  onBookSuccess,
  onCancel,
  existingAppointments
}) => {
  const [step, setStep] = useState<number>(preselectedDoctor ? 2 : 1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(
    preselectedDoctor || doctors[0]
  );
  const [selectedDate, setSelectedDate] = useState('May 02, 2025');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [consultationType, setConsultationType] = useState<
    'In-Clinic' | 'Online Consultation (Google Meet)'
  >('Online Consultation (Google Meet)');
  const [reason, setReason] = useState('Severe lower molar sensitivity and slight chewing pain');
  const [isUrgent, setIsUrgent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots = selectedDoctor.slots || [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM'
  ];

  const handleConfirm = () => {
    setError(null);

    // Double booking check
    const isConflict = existingAppointments.some(
      (a) =>
        a.doctorId === selectedDoctor.id &&
        a.date === selectedDate &&
        a.time === selectedTime &&
        a.status !== 'Cancelled'
    );

    if (isConflict) {
      setError(
        `Dr. ${selectedDoctor.name} already has an appointment booked at ${selectedTime} on ${selectedDate}. Please select another time slot.`
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const isOnline = consultationType === 'Online Consultation (Google Meet)';
      const meetCode = 'oral-' + Math.random().toString(36).substr(2, 6);
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientPhone: currentUser.phone || '+91 9006480779',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        type: consultationType,
        status: 'Confirmed',
        reason: reason.trim(),
        isUrgent,
        fee: selectedDoctor.consultationFee,
        meetLink: isOnline ? `https://meet.google.com/${meetCode}` : undefined,
        meetId: isOnline ? meetCode : undefined,
        createdAt: new Date().toISOString()
      };

      setIsSubmitting(false);
      onBookSuccess(newApt);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Book Appointment
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Schedule your consultation with specialized dentists in Hyderabad.
        </p>
      </div>

      {/* 4-Step Indicator (matching screenshot) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        {[
          { num: 1, title: 'Doctor' },
          { num: 2, title: 'Date & Time' },
          { num: 3, title: 'Reason & Details' },
          { num: 4, title: 'Confirm' }
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s.num
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`hidden sm:inline text-xs font-semibold ${
                  step >= s.num ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </div>
            {idx < 3 && <div className="h-0.5 w-8 md:w-16 bg-slate-200" />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Choose a Dentist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                  selectedDoctor.id === doc.id
                    ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-[11px] text-teal-700 font-medium">{doc.specialty}</p>
                  <p className="text-[10px] text-slate-400">₹{doc.consultationFee} fee</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2"
            >
              <span>Next: Date & Time</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time (matching screenshot) */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {/* Selected Doctor Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{selectedDoctor.name}</h4>
                <p className="text-[11px] text-teal-700 font-medium">{selectedDoctor.specialty}</p>
                <p className="text-[10px] text-slate-500">{selectedDoctor.hospital}</p>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              Change
            </button>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Select Consultation Date
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {['May 02, 2025', 'May 03, 2025', 'May 04, 2025', 'May 05, 2025'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedDate === d
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Chips (matching screenshot) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Available Time Slots
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2"
            >
              <span>Next: Consultation Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Reason & Details */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Consultation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType('Online Consultation (Google Meet)')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  consultationType === 'Online Consultation (Google Meet)'
                    ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Online Google Meet</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Instant video room link generated upon doctor confirmation
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('In-Clinic')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  consultationType === 'In-Clinic'
                    ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">In-Clinic Visit</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Physical dental checkup at {selectedDoctor.hospital}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Reason for Visit / Symptoms
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Tooth pain, severe sensitivity when drinking cold water..."
              className="w-full p-3 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-rose-600 font-semibold">Urgent Consultation (Immediate triage)</span>
          </label>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2"
            >
              <span>Review & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm (Summary) */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center py-2">
            <h3 className="text-lg font-bold text-slate-900">Review Booking Details</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please verify your appointment information before final confirmation.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3.5 text-xs">
            <div className="flex justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500">Patient Name:</span>
              <span className="font-bold text-slate-900">{currentUser.name}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500">Selected Dentist:</span>
              <span className="font-bold text-slate-900">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500">Scheduled Date & Time:</span>
              <span className="font-bold text-teal-700">{selectedDate} • {selectedTime}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500">Consultation Mode:</span>
              <span className="font-bold text-slate-900">{consultationType}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500">Reason:</span>
              <span className="font-medium text-slate-800 max-w-xs text-right">{reason}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span className="text-slate-900">Consultation Fee:</span>
              <span className="text-teal-700">₹{selectedDoctor.consultationFee}</span>
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Google Meet link will be generated automatically and emailed to {currentUser.email}.</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="py-3 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
