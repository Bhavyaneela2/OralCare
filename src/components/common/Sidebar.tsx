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
  Video
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
  onCloseMobile
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
          { id: 'profile', label: 'Profile', icon: User }
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
          { id: 'profile', label: 'Profile', icon: Stethoscope }
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
          { id: 'profile', label: 'Profile', icon: User }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0B192C] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800/80 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-slate-800/80">
            <ToothLogo lightText size={38} />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-700/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 space-y-3 border-t border-slate-800/80 bg-[#081220]">
          {/* Promo Badge as in screenshot */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-900/40 to-sky-950/40 border border-teal-500/20 text-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] font-semibold text-white leading-tight">
                Healthy Smiles
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              Brighter Futures through AI dental diagnostics
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
