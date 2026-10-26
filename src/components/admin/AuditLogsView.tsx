import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, Calendar, Download } from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogsViewProps {
  auditLogs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || log.actorRole === roleFilter;
    return matchSearch && matchRole;
  });

  const handleExportLogs = () => {
    const content = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OralCare_Audit_Logs_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Security & Audit Logs
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            HIPAA-compliant immutable chronological audit trail for clinical access, logins, and records.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-700/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, action, or clinical details..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="all">All Roles</option>
          <option value="patient">Patient Events</option>
          <option value="doctor">Doctor Events</option>
          <option value="admin">Admin Actions</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {filtered.map((log) => (
          <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{log.action}</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-teal-700 font-semibold">{log.actorName}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {log.actorRole}
                </span>
              </div>
              <p className="text-slate-600">{log.details}</p>
            </div>

            <div className="text-[11px] text-slate-400 whitespace-nowrap self-end sm:self-auto flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
