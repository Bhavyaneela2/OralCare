import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ArrowRight, Stethoscope } from 'lucide-react';
import { ToothLogo } from '../common/ToothLogo';
import { User as UserType, UserRole } from '../../types';

interface SignupViewProps {
  onSignupSuccess: (user: UserType) => void;
  onNavigateToLogin: () => void;
  initialRole?: UserRole;
}

export const SignupView: React.FC<SignupViewProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
  initialRole = 'patient'
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('General Dentist');
  const [qualifications, setQualifications] = useState('BDS, MDS');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser: UserType = {
        id: `${selectedRole}-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: selectedRole,
        address: 'Hyderabad, Telangana',
        status: 'active',
        specialty: selectedRole === 'doctor' ? specialty : undefined,
        qualifications: selectedRole === 'doctor' ? qualifications : undefined,
        createdAt: new Date().toISOString()
      };

      setIsLoading(false);
      onSignupSuccess(newUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 md:p-10">
        <div className="flex justify-center mb-6">
          <ToothLogo size={40} />
        </div>

        {/* Role Toggle Selector (matching screenshot) */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          {(['patient', 'doctor', 'admin'] as UserRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                selectedRole === role
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {role === 'admin' ? 'Admin' : role}
            </button>
          ))}
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join us for better dental care.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {selectedRole === 'doctor' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-teal-50/50 rounded-2xl border border-teal-100">
              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">
                  Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 outline-none"
                >
                  <option>General Dentist</option>
                  <option>Orthodontist</option>
                  <option>Oral Surgeon</option>
                  <option>Endodontist</option>
                  <option>Periodontist</option>
                  <option>Pedodontist</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="BDS, MDS"
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
