
import React from 'react';
import {
  LayoutDashboard,
  Search,
  CalendarPlus,
  CalendarCheck,
  FileSpreadsheet,
  Pill,
  FileImage,
  User,
  Users,
  Stethoscope,
  Clock,
  Bell,
  ShieldAlert,
  Settings,
  LogOut,
  Sparkles,
  Video,
} from 'lucide-react';

import { ToothLogo } from './ToothLogo';
import { UserRole } from '../../types';

interface SidebarProps {
  currentRole: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentTab,
  onSelectTab,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const getNavItems = () => {
    switch (currentRole) {
      case 'patient':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'find-doctor', label: 'Find a Doctor', icon: Search },
          { id: 'book-appointment', label: 'Book Appointment', icon: CalendarPlus },
          { id: 'appointments', label: 'My Appointments', icon: CalendarCheck },
          { id: 'medical-records', label: 'Medical Records', icon: FileSpreadsheet },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
          { id: 'reports-xrays', label: 'Reports & X-rays', icon: FileImage },
          { id: 'online-consultation', label: 'Online Consultation', icon: Video },
          { id: 'profile', label: 'Profile', icon: User },
        ];

      case 'doctor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'patient-directory', label: 'Patient Directory', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
          { id: 'clinical-notes', label: 'Clinical Notes (NLP)', icon: Sparkles },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
          { id: 'xray-analysis', label: 'X-ray Analysis', icon: FileImage },
          { id: 'medical-records', label: 'Medical Records', icon: FileSpreadsheet },
          { id: 'follow-ups', label: 'Follow-ups', icon: Clock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'profile', label: 'Profile', icon: Stethoscope },
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'user-management', label: 'User Directory', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
          { id: 'medical-records', label: 'Medical Records', icon: FileSpreadsheet },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
          { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert },
          { id: 'system-settings', label: 'System Settings', icon: Settings },
          { id: 'profile', label: 'Profile', icon: User },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {isOpenMobile && (
        <div
          aria-hidden="true"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-64 shrink-0 flex-col justify-between
          overflow-hidden border-r border-slate-800/80
          bg-[#0B192C] text-slate-300
          transition-transform duration-200 ease-in-out
          -translate-x-full
          ${
            isOpenMobile ? 'translate-x-0' : ''
          }
          md:sticky md:top-0 md:z-auto md:h-screen md:translate-x-0
        `}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-slate-800/80 p-5">
            <ToothLogo lightText size={38} />
          </div>

          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile?.();
                  }}
                  className={`
                    flex w-full items-center gap-3 rounded-xl
                    px-3.5 py-2.5 text-left text-xs font-medium
                    transition-colors
                    ${
                      isActive
                        ? 'bg-teal-600 font-semibold text-white shadow-md shadow-teal-700/20'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 space-y-3 border-t border-slate-800/80 bg-[#081220] p-4">
          <div className="rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-900/40 to-sky-950/40 p-3 text-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px] font-semibold leading-tight text-white">
                Healthy Smiles
              </div>
            </div>
            <p className="mt-1 text-[10px] leading-normal text-slate-400">
              Brighter Futures through AI dental diagnostics
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};