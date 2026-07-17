import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, addDays, isMonday, startOfDay } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MAX_SLOTS = 2;
const RANKS = ['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle'];

function getUpcomingMondays(count = 8) {
  const mondays = [];
  let date = startOfDay(new Date());
  while (mondays.length < count) {
    if (isMonday(date)) mondays.push(date);
    date = addDays(date, 1);
  }
  return mondays;
}

const typeLabel = (type) =>
  type === 'scoutmaster_conference' ? 'Scoutmaster Conference' : 'Board of Review';

export default function SchedulingModal({ onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ scout_name: '', scout_email: '', rank: '' });

  const mondays = getUpcomingMondays(8);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['advancement-requests'],
    queryFn: () => base44.entities.AdvancementRequest.list('-created_date', 200),
  });

  const getSlotCount = (dateStr, type) =>
    requests.filter(
      (r) =>
        r.meeting_date === dateStr &&
        r.type === type &&
        r.status !== 'canceled' &&
        r.status !== 'rejected'
    ).length;

  const isAlreadyRegistered = (dateStr, type, email) =>
    requests.some(
      (r) =>
        r.meeting_date === dateStr &&
        r.type === type &&
        r.status !== 'canceled' &&
        r.status !== 'rejected' &&
        r.scout_email?.toLowerCase() === email?.toLowerCase()
    );

  const registerMutation = useMutation({
    mutationFn: (data) =>
      base44.entities.AdvancementRequest.create({ ...data, status: 'pending' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['advancement-requests']);
      queryClient.invalidateQueries(['my-reservations']);
      queryClient.invalidateQueries(['admin-schedule']);
      toast({ title: 'Slot reserved!', description: 'Your request has been submitted.' });
      onClose();
    },
  });

  const handleRegister = () => {
    if (!form.scout_name.trim() || !form.scout_email.trim()) {
      toast({ title: 'Please fill in your name and email', variant: 'destructive' });
      return;
    }
    const dateStr = format(selectedSlot.date, 'yyyy-MM-dd');
    if (isAlreadyRegistered(dateStr, selectedSlot.type, form.scout_email)) {
      toast({ title: 'You already have a reservation for this slot', variant: 'destructive' });
      return;
    }
    registerMutation.mutate({
      ...form,
      type: selectedSlot.type,
      meeting_date: dateStr,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Schedule Scoutmaster Conference or Board of Review
          </h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select an upcoming troop meeting date. Each meeting allows up to {MAX_SLOTS} Scoutmaster
          Conference slots and {MAX_SLOTS} Board of Review slots — tracked separately.
        </p>

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading availability…</div>
        ) : (
          <div className="space-y-3 mb-5">
            {mondays.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const smcCount = getSlotCount(dateStr, 'scoutmaster_conference');
              const borCount = getSlotCount(dateStr, 'board_of_review');
              const smcRemaining = MAX_SLOTS - smcCount;
              const borRemaining = MAX_SLOTS - borCount;

              return (
                <div key={dateStr} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-[#1a2744]" />
                    <p className="font-bold text-[#1a2744] text-sm">
                      {format(date, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-400">7:00 PM</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* SMC slot */}
                    <div
                      className={`p-3 rounded-lg border-2 ${
                        smcRemaining > 0
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#1a2744] mb-1">Scoutmaster Conference</p>
                      {smcRemaining > 0 ? (
                        <>
                          <p className="text-xs text-green-700 font-semibold mb-2">
                            {smcRemaining} of {MAX_SLOTS} slots available
                          </p>
                          <button
                            onClick={() => setSelectedSlot({ date, type: 'scoutmaster_conference' })}
                            className="w-full py-1.5 bg-[#1a2744] text-white rounded text-xs font-semibold hover:bg-[#1a2744]/90"
                          >
                            Register
                          </button>
                        </>
                      ) : (
                        <p className="text-xs text-red-600 font-bold">Full</p>
                      )}
                    </div>
                    {/* BOR slot */}
                    <div
                      className={`p-3 rounded-lg border-2 ${
                        borRemaining > 0
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#1a2744] mb-1">Board of Review</p>
                      {borRemaining > 0 ? (
                        <>
                          <p className="text-xs text-green-700 font-semibold mb-2">
                            {borRemaining} of {MAX_SLOTS} slots available
                          </p>
                          <button
                            onClick={() => setSelectedSlot({ date, type: 'board_of_review' })}
                            className="w-full py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700"
                          >
                            Register
                          </button>
                        </>
                      ) : (
                        <p className="text-xs text-red-600 font-bold">Full</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Registration form */}
        {selectedSlot && (
          <div className="border-t pt-4 space-y-3 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[#1a2744] text-sm">
                Register for {typeLabel(selectedSlot.type)} —{' '}
                {format(selectedSlot.date, 'MMMM d, yyyy')}
              </p>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Full Name *"
                value={form.scout_name}
                onChange={(e) => setForm((f) => ({ ...f, scout_name: e.target.value }))}
              />
              <input
                type="email"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Email *"
                value={form.scout_email}
                onChange={(e) => setForm((f) => ({ ...f, scout_email: e.target.value }))}
              />
            </div>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.rank}
              onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))}
            >
              <option value="">Rank being pursued</option>
              {RANKS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={handleRegister}
              disabled={registerMutation.isPending}
              className="w-full py-2.5 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {registerMutation.isPending ? 'Registering...' : 'Reserve Slot'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}