import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Calendar, Clock, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendReservationNotification } from '@/lib/reservationNotifications';

const typeLabel = (type) => {
  if (type === 'scoutmaster_conference') return 'Scoutmaster Conference';
  if (type === 'board_of_review') return 'Board of Review';
  return 'Blue Card Request';
};

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  approved: { color: 'bg-blue-100 text-blue-700', label: 'Approved' },
  scheduled: { color: 'bg-indigo-100 text-indigo-700', label: 'Scheduled' },
  completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
  canceled: { color: 'bg-gray-100 text-gray-500', label: 'Canceled' },
  rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected' },
};

export default function MyReservations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: allRequests = [] } = useQuery({
    queryKey: ['my-reservations', user?.email],
    queryFn: () => base44.entities.AdvancementRequest.list('-created_date', 50),
    enabled: !!user,
  });

  const myRequests = allRequests.filter(
    (r) =>
      (r.type === 'scoutmaster_conference' || r.type === 'board_of_review') &&
      (r.scout_email?.toLowerCase() === user?.email?.toLowerCase() ||
        r.created_by_id === user?.id)
  );

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.entities.AdvancementRequest.update(id, { status: 'canceled' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reservations']);
      queryClient.invalidateQueries(['advancement-requests']);
      queryClient.invalidateQueries(['admin-schedule-requests']);
      if (cancelTarget) {
        sendReservationNotification('cancel', cancelTarget, 2).catch(() => {});
      }
      toast({
        title: 'Reservation canceled',
        description: 'The slot is now available for other Scouts.',
      });
      setCancelTarget(null);
    },
  });

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-[#1a2744] text-xl mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" /> My Reservations
      </h2>
      {myRequests.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          No reservations yet. Schedule a Scoutmaster Conference or Board of Review above.
        </p>
      ) : (
        <div className="space-y-3">
          {myRequests.map((req) => {
            const cfg = statusConfig[req.status] || statusConfig.pending;
            return (
              <div
                key={req.id}
                className={`border rounded-lg p-4 ${
                  req.status === 'canceled' || req.status === 'rejected'
                    ? 'border-gray-200 bg-gray-50 opacity-70'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#1a2744] text-sm">{typeLabel(req.type)}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    {req.meeting_date && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{' '}
                        {format(new Date(req.meeting_date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}
                      </p>
                    )}
                    {req.rank && <p className="text-xs text-gray-500">Rank: {req.rank}</p>}
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Submitted{' '}
                      {req.created_date
                        ? format(new Date(req.created_date), 'MMM d, yyyy')
                        : '—'}
                    </p>
                  </div>
                  {req.status !== 'canceled' &&
                    req.status !== 'rejected' &&
                    req.status !== 'completed' && (
                      <button
                        onClick={() => setCancelTarget(req)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 shrink-0"
                      >
                        Cancel Request
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel confirmation */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex justify-end mb-2">
              <button onClick={() => setCancelTarget(null)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1a2744]">
                  Are you sure you want to give up this slot?
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {typeLabel(cancelTarget.type)} on{' '}
                  {cancelTarget.meeting_date
                    ? format(new Date(cancelTarget.meeting_date + 'T12:00:00'), 'MMMM d, yyyy')
                    : '—'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  The slot will become available to other Scouts immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
              >
                Keep Reservation
              </button>
              <button
                onClick={() => cancelMutation.mutate(cancelTarget.id)}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}