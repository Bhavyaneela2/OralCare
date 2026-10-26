import React, { useState } from 'react';
import { Search, Star, Clock, MapPin, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Doctor } from '../../types';

interface FindDoctorViewProps {
  doctors: Doctor[];
  onSelectDoctorToBook: (doctor: Doctor) => void;
}

export const FindDoctorView: React.FC<FindDoctorViewProps> = ({
  doctors,
  onSelectDoctorToBook
}) => {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');

  const specialties = ['All', 'General Dentist', 'Orthodontist', 'Oral Surgeon', 'Endodontist'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.hospital?.toLowerCase().includes(search.toLowerCase());

    const matchSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchRating = selectedRating === 'All' || doc.rating >= parseFloat(selectedRating);

    return matchSearch && matchSpecialty && matchRating;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Find a Doctor
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Connect with India's certified dental surgeons and orthodontists.
        </p>
      </div>

      {/* Filter Bar (matching screenshot) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-medium"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Specialties' : s}
              </option>
            ))}
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-medium"
          >
            <option value="All">All Ratings</option>
            <option value="4.8">4.8+ Stars</option>
            <option value="4.9">4.9+ Stars</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards List (exact match to screenshot layout) */}
      <div className="space-y-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4">
              <img
                src={doc.avatar}
                alt={doc.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                  </span>
                </div>

                <p className="text-xs font-semibold text-teal-700">
                  {doc.specialty} • <span className="text-slate-500 font-normal">{doc.qualifications}</span>
                </p>

                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{doc.experience}</span>
                  <span>•</span>
                  <span>{doc.hospital}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Consultation:</span>
                <span className="text-sm font-bold text-slate-900">₹{doc.consultationFee}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Clock className="w-3 h-3 text-teal-600" />
                <span>Available Today • {doc.slots[0]} - {doc.slots[doc.slots.length - 1]}</span>
              </div>

              <button
                onClick={() => onSelectDoctorToBook(doc)}
                className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No doctors matched your criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the specialty or search filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
