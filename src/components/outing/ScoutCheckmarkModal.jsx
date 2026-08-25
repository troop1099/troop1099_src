import React, { useState } from 'react';
import { X, CheckSquare, Square, Loader2, ShieldCheck, AlertCircle, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ScoutCheckmarkModal({ attendee, onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | searching | found | mismatch | error
  const [verifiedName, setVerifiedName] = useState('');
  const [checks, setChecks] = useState({
    attending: attendee.attending,
    permission_slip: attendee.permission_slip,
    paid: attendee.paid,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('check-in-outing-attendee', {
      attendee_id: attendee.id,
      phone,
      checks: data,
    }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['attendees']);
      toast({ title: 'Saved!', description: 'Your checkmarks have been updated.' });
      onClose();
    },
    onError: (err) => {
      toast({ title: 'Save failed', description: err?.message || 'Please try again.', variant: 'destructive' });
    },
  });

  const handleVerify = async () => {
    if (!phone.trim() || status === 'searching') return;
    setStatus('searching');
    try {
      const res = await base44.functions.invoke('lookup-scout-by-phone', { phone_number: phone });
      const data = res.data;
      if (data?.status === 'found' && data.scout_name) {
        if (data.scout_name.trim().toLowerCase() === attendee.scout_name.trim().toLowerCase()) {
          setVerifiedName(data.scout_name);
          setStatus('found');
        } else {
          setStatus('mismatch');
        }
      } else if (data?.status === 'duplicate') {
        setStatus('error');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const toggleCheck = (field) => {
    setChecks((c) => ({ ...c, [field]: !c[field] }));
  };

  const handleSave = () => {
    saveMutation.mutate(checks);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (status === 'found' || verifiedName) {
      setVerifiedName('');
      setStatus('idle');
    }
  };

  const fields = [
    { key: 'attending', label: 'Attending', color: 'text-green-500' },
    { key: 'permission_slip', label: 'Permission Slip', color: 'text-blue-500' },
    { key: 'paid', label: 'Paid', color: 'text-yellow-500' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1a2744]" />
            Verify to Check In
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500">Scout</p>
          <p className="font-bold text-[#1a2744]">{attendee.scout_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{attendee.patrol || 'No patrol'}</p>
        </div>

        {status !== 'found' && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Enter the phone number on file with the Troop 1099 Master Roster to verify your identity before checking in.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="tel"
                placeholder="(770) 555-1234"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <button
                onClick={handleVerify}
                disabled={!phone.trim() || status === 'searching'}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-[#1a2744]/90 whitespace-nowrap"
              >
                {status === 'searching' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            {status === 'error' && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  Phone number not found on the roster. Check the number or contact the Scoutmaster.
                </p>
              </div>
            )}
            {status === 'mismatch' && (
              <div className="mt-3 flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700">
                  This phone number belongs to a different scout. You can only check in for your own row.
                </p>
              </div>
            )}
          </>
        )}

        {status === 'found' && (
          <>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Verified: <strong>{verifiedName}</strong>
              </p>
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Check In</p>
            <div className="space-y-2">
              {fields.map((f) => (
                <button
                  key={f.key}
                  onClick={() => toggleCheck(f.key)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-[#1a2744]">{f.label}</span>
                  {checks[f.key] ? (
                    <CheckSquare className={`w-5 h-5 ${f.color}`} />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1 py-2.5 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}