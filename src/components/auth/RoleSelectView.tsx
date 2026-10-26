import React from 'react';
import { User, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';
import { ToothLogo } from '../common/ToothLogo';
import { UserRole } from '../../types';

interface RoleSelectViewProps {
  onSelectRole: (role: UserRole) => void;
  onBackToLogin: () => void;
}

export const RoleSelectView: React.FC<RoleSelectViewProps> = ({
  onSelectRole,
  onBackToLogin
}) => {
  const roles = [
    {
      id: 'patient' as UserRole,
      title: 'Patient',
      description: 'Book appointments, view records and more',
      icon: User,
      badgeColor: 'bg-teal-50 text-teal-600 border-teal-200 group-hover:bg-teal-600 group-hover:text-white',
      cardHover: 'hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10'
    },
    {
      id: 'doctor' as UserRole,
      title: 'Doctor',
      description: 'Manage patients, clinical notes, prescriptions',
      icon: Stethoscope,
      badgeColor: 'bg-sky-50 text-sky-600 border-sky-200 group-hover:bg-sky-600 group-hover:text-white',
      cardHover: 'hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10'
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrator',
      description: 'Manage users, appointments and system',
      icon: ShieldCheck,
      badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
      cardHover: 'hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between items-center p-6 md:p-12">
      <div className="w-full max-w-4xl flex items-center justify-between">
        <ToothLogo size={40} />
        <button
          onClick={onBackToLogin}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Sign In
        </button>
      </div>

      <div className="w-full max-w-4xl py-12 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Role
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2 max-w-md">
          Choose how you want to access the system
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${role.cardHover}`}
              >
                <div
                  className={`w-20 h-20 rounded-full border flex items-center justify-center transition-all duration-200 mb-6 ${role.badgeColor}`}
                >
                  <Icon className="w-9 h-9 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-teal-700 transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed min-h-[36px]">
                  {role.description}
                </p>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-4xl flex items-center justify-center pt-8 border-t border-slate-200/60 text-xs text-slate-400">
        <ToothLogo size={24} showText={true} />
      </div>
    </div>
  );
};
