import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, addDays, isMonday, startOfDay } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendReservationNotification } from '@/lib/reservationNotifications';
import ScoutPhoneLookup from '@/components/advancement/ScoutPhoneLookup';

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
  const [form, setForm] = useState({ scout_email: '', rank: '' });
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [scoutName, setScoutName] = useState('');
  const [verified, setVerified] = useState(false);

  const mondays = getUpcomingMondays(8);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['advancement-requests', verifiedPhone],
    queryFn: () => base44.entities.AdvancementRequest.list('-created_date', 200),
    enabled: verified,
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
      base44.functions.invoke('submit-advancement-request', {
        phone_number: verifiedPhone,
        request_data: data,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['advancement-requests']);
      queryClient.invalidateQueries(['my-reservations']);
      queryClient.invalidateQueries(['admin-schedule-requests']);
      if (selectedSlot) {
        const dateStr = format(selectedSlot.date, 'yyyy-MM-dd');
        const openSlots = Math.max(0, MAX_SLOTS - getSlotCount(dateStr, selectedSlot.type) - 1);
        sendReservationNotification('new', {
          scout_name: scoutName,
          scout_email: form.scout_email,
          type: selectedSlot.type,
          meeting_date: dateStr,
        }, openSlots).catch(() => {});
      }
      toast({ title: 'Slot reserved!', description: 'Your request has been submitted.' });
      onClose();
    },
    onError: (err) => {
      toast({ title: 'Failed to reserve slot', description: err?.message || 'Please try again.', variant: 'destructive' });
    },
  });

  const handleRegister = () => {
    if (!form.scout_email.trim()) {
      toast({ title: 'Please fill in your email', variant: 'destructive' });
      return;
    }
    if (!selectedSlot) return;
    const dateStr = format(selectedSlot.date, 'yyyy-MM-dd');
    if (isAlreadyRegistered(dateStr, selectedSlot.type, form.scout_email)) {
      toast({ title: 'You already have a reservation for this slot', variant: 'destructive' });
      return;
    }
    registerMutation.mutate({
      scout_name: scoutName,
      scout_email: form.scout_email,
      rank: form.rank,
      type: selectedSlot.type,
      meeting_date: dateStr,
      status: 'pending',
    });
  };

  const handleReset = () => {
    setVerified(false);
    setScoutName('');
    setVerifiedPhone('');
    setSelectedSlot(null);
    setForm({ scout_email: '', rank: '' });
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

        {/* Scout verification gate — always visible */}
        <ScoutPhoneLookup
          instruction="You must verify your Scout record before viewing available reservation slots. Enter the phone number on file with the troop roster."
          onVerified={(phone, name) => {
            setVerifiedPhone(phone);
            setScoutName(name);
            setVerified(true);
          }}
          onReset={handleReset}
        />

        {/* Only show availability after verification */}
        {verified && (
          <>
            <p className="text-sm text-gray-600 mt-5 mb-3">
              Hi <strong>{scoutName}</strong> — select an upcoming troop meeting date. Each meeting
              allows up to {MAX_SLOTS} Scoutmaster Conference slots and {MAX_SLOTS} Board of Review slots.
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
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Scout Name</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                      value={scoutName}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Email *</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]"
                      placeholder="your@email.com"
                      value={form.scout_email}
                      onChange={(e) => setForm((f) => ({ ...f, scout_email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Rank being pursued</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]"
                    value={form.rank}
                    onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))}
                  >
                    <option value="">Please select your rank request</option>
                    {RANKS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending || !form.scout_email.trim()}
                  className="w-full py-2.5 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {registerMutation.isPending ? 'Registering...' : 'Reserve Slot'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}