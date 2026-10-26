import React, { useState } from 'react';
import { Search, Calendar, Bell, Menu, ChevronDown, Check } from 'lucide-react';
import { User, AppNotification, UserRole } from '../../types';

interface NavbarProps {
  currentUser: User;
  notifications: AppNotification[];
  onOpenMobileMenu: () => void;
  onSelectRole: (role: UserRole) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  notifications,
  onOpenMobileMenu,
  onSelectRole,
  onOpenProfile,
  onOpenNotifications,
  searchQuery,
  onSearchChange
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              currentUser.role === 'doctor'
                ? 'Search patients, appointments...'
                : currentUser.role === 'admin'
                ? 'Search users, appointments, audit logs...'
                : 'Search doctors, appointments, or medical records...'
            }
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200/90 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Date, Notifications, User Pill & Role Switcher */}
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Role Quick Switch Menu (Crucial for Reviewers/Demonstrators) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 text-teal-800 text-[11px] font-semibold transition-colors"
            title="Switch demo role"
          >
            <span className="capitalize">{currentUser.role} View</span>
            <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-semibold uppercase text-slate-400">
                Switch Role View
              </div>
              {(['patient', 'doctor', 'admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onSelectRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 capitalize ${
                    currentUser.role === role ? 'font-semibold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{role === 'admin' ? 'Administrator' : role}</span>
                  {currentUser.role === role && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-500 capitalize">
              {currentUser.role === 'admin' ? 'Hospital Admin' : currentUser.role}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
