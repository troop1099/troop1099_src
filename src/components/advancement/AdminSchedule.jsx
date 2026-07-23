import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { ClipboardList, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MAX_SLOTS = 2;

const typeLabel = (type) => {
  if (type === 'scoutmaster_conference') return 'Scoutmaster Conference';
  if (type === 'board_of_review') return 'Board of Review';
  return 'Blue Card';
};

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'approved', label: 'Approved', color: 'bg-blue-100 text-blue-700' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'canceled', label: 'Canceled', color: 'bg-gray-100 text-gray-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

export default function AdminSchedule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [authorized, setAuthorized] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [requests, setRequests] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);

  const handleVerify = async () => {
    if (!adminCode.trim()) {
      toast({ title: 'Please enter the Admin Code', variant: 'destructive' });
      return;
    }
    setVerifying(true);
    try {
      const res = await base44.functions.invoke('verify-reservation-admin', { admin_code: adminCode.trim() });
      if (res.data?.authorized) {
        setRequests(res.data.requests || []);
        setAuthorized(true);
        toast({ title: 'Access granted', description: 'Reservation data loaded.' });
      } else {
        toast({ title: 'Incorrect admin code', variant: 'destructive' });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Verification failed.';
      toast({ title: 'Incorrect admin code', description: msg, variant: 'destructive' });
    }
    setVerifying(false);
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) =>
      base44.entities.AdvancementRequest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-schedule']);
      queryClient.invalidateQueries(['advancement-requests']);
      queryClient.invalidateQueries(['my-reservations']);
      // Refresh local state
      setRequests(prev => prev.map(r => r.id === updateMutation.variables?.id ? { ...r, status: updateMutation.variables?.status } : r));
    },
  });

  if (!authorized) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-[#1a2744]" />
          <h2 className="font-bold text-[#1a2744] text-lg">View Reservations (Admin)</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">Enter the admin code to view all Scoutmaster Conference and Board of Review reservations.</p>
        <div className="flex gap-2">
          <input
            type="password"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]"
            value={adminCode}
            onChange={e => setAdminCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="Admin Code"
          />
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-5 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Unlock'}
          </button>
        </div>
      </div>
    );
  }

  const scheduledRequests = requests.filter(
    (r) =>
      (r.type === 'scoutmaster_conference' || r.type === 'board_of_review') && r.meeting_date
  );

  const byDate = {};
  scheduledRequests.forEach((r) => {
    if (!byDate[r.meeting_date]) byDate[r.meeting_date] = [];
    byDate[r.meeting_date].push(r);
  });
  const sortedDates = Object.keys(byDate).sort();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-[#1a2744] text-white p-5 flex items-center gap-2">
        <ClipboardList className="w-5 h-5" />
        <h2 className="font-bold text-lg">Schedule Management (Admin)</h2>
      </div>
      <div className="p-5 space-y-3">
        {sortedDates.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No scheduled requests yet.</p>
        ) : (
          sortedDates.map((dateStr) => {
            const dateRequests = byDate[dateStr];
            const smcActive = dateRequests.filter(
              (r) =>
                r.type === 'scoutmaster_conference' &&
                r.status !== 'canceled' &&
                r.status !== 'rejected'
            ).length;
            const borActive = dateRequests.filter(
              (r) =>
                r.type === 'board_of_review' &&
                r.status !== 'canceled' &&
                r.status !== 'rejected'
            ).length;
            const smcRemaining = MAX_SLOTS - smcActive;
            const borRemaining = MAX_SLOTS - borActive;
            const isExpanded = expandedDate === dateStr;

            return (
              <div key={dateStr} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedDate(isExpanded ? null : dateStr)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#1a2744]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#1a2744]" />
                    )}
                    <p className="font-bold text-[#1a2744] text-sm">
                      {format(new Date(dateStr + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        smcRemaining > 0
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      SMC: {smcRemaining}/{MAX_SLOTS} open
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        borRemaining > 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      BOR: {borRemaining}/{MAX_SLOTS} open
                    </span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {dateRequests.map((req) => {
                      const cfg =
                        statusOptions.find((s) => s.value === req.status) || statusOptions[0];
                      return (
                        <div
                          key={req.id}
                          className={`p-4 flex items-center justify-between gap-3 ${
                            req.status === 'canceled' || req.status === 'rejected'
                              ? 'bg-gray-50 opacity-70'
                              : ''
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#1a2744] text-sm">
                                {req.scout_name}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  cfg.color
                                }`}
                              >
                                {typeLabel(req.type)}
                              </span>
                            </div>
                            {req.rank && (
                              <p className="text-xs text-gray-500">Rank: {req.rank}</p>
                            )}
                            {req.scout_email && (
                              <p className="text-xs text-gray-400">{req.scout_email}</p>
                            )}
                            <p className="text-xs text-gray-400">
                              Submitted:{' '}
                              {req.created_date
                                ? format(new Date(req.created_date), 'MMM d, yyyy h:mm a')
                                : '—'}
                            </p>
                            {req.status === 'canceled' && (
                              <p className="text-xs text-red-500 font-semibold">
                                ⚠ Canceled by Scout
                              </p>
                            )}
                          </div>
                          <select
                            value={req.status}
                            onChange={(e) =>
                              updateMutation.mutate({ id: req.id, status: e.target.value })
                            }
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${cfg.color}`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}