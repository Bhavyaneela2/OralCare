import React, { useState } from 'react';
import {
  User as UserIcon,
  Lock,
  Bell,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Save
} from 'lucide-react';
import { User } from '../../types';

interface PatientProfileViewProps {
  currentUser: User;
  onUpdateProfile: (updates: Partial<User>) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  currentUser,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'notifications'>('info');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+91 9006480779');
  const [address, setAddress] = useState(currentUser.address || 'Hyderabad, Telangana');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [rxReminders, setRxReminders] = useState(true);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim()
    });
    setSuccessMsg('Profile information saved successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    setSuccessMsg('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Profile & Notifications
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage your personal details, consultation preferences, and secure credentials.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Left subnav, Right form (matching screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sub-nav */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
              activeTab === 'info'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
              activeTab === 'password'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
              activeTab === 'notifications'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Settings</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-6">
              {/* Profile Avatar Container */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-teal-600/20">
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{currentUser.role} Account</p>
                  <p className="text-[11px] text-teal-600 mt-0.5">Patient ID: {currentUser.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Indian Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Security Credentials</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold mt-4"
              >
                Change Password
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Reminders & Alerts</h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Email Notifications</h4>
                    <p className="text-[11px] text-slate-500">Receive Google Meet links and appointment confirmations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">SMS Reminders (+91)</h4>
                    <p className="text-[11px] text-slate-500">Receive 30-minute consultation reminders via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Daily Medicine Intake Push Alerts</h4>
                    <p className="text-[11px] text-slate-500">Morning and evening prompts until antibiotic course finishes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={rxReminders}
                    onChange={(e) => setRxReminders(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
