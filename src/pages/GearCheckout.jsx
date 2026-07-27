import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PackageCheck, PackageOpen, RotateCcw, CheckCircle, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const GEAR_OPTIONS = [
  'Troop Tent',
  'Pyro Box',
  'Bonsai Box',
  'Shamrock Box',
  'Bonsai Stove',
  'Shamrock Stove',
  'Pyro Stove',
  'Water Filter #1',
  'Water Filter #2',
  'Water Jug #1',
  'Water Jug #2',
];

function CheckoutForm({ onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    scout_name: '',
    scout_email: '',
    gear_item: GEAR_OPTIONS[0],
    tent_number: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [quartermasterCode, setQuartermasterCode] = useState('');

  const { data: scouts = [], isLoading: rosterLoading } = useQuery({
    queryKey: ['roster'],
    queryFn: async () => {
      const res = await base44.functions.invoke('fetch-roster', {});
      return res.data?.scouts || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const isTent = form.gear_item === 'Troop Tent';

  const handleScoutSelect = (name) => {
    const scout = scouts.find(s => s.name === name);
    setForm(f => ({ ...f, scout_name: name, scout_email: scout?.email || '' }));
  };

  const handleSubmit = async () => {
    if (!form.scout_name.trim() || !form.scout_email.trim()) {
      toast({ title: 'Please select a scout and enter their email.', variant: 'destructive' });
      return;
    }
    if (isTent && !form.tent_number.trim()) {
      toast({ title: 'Please enter the tent number.', variant: 'destructive' });
      return;
    }
    if (!quartermasterCode.trim()) {
      toast({ title: 'Quartermaster Code required', description: 'Enter the code to authorize this checkout.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await base44.functions.invoke('verify-gear-return', { admin_code: quartermasterCode.trim() });
      if (!res.data?.authorized) {
        toast({ title: 'Incorrect Quartermaster code', variant: 'destructive' });
        setSaving(false);
        return;
      }
    } catch (err) {
      toast({ title: 'Incorrect Quartermaster code', variant: 'destructive' });
      setSaving(false);
      return;
    }
    await base44.entities.GearCheckout.create({
      ...form,
      checkout_date: format(new Date(), 'yyyy-MM-dd'),
      status: 'checked_out',
    });
    queryClient.invalidateQueries(['gear_checkouts']);
    setSaving(false);
    toast({ title: 'Gear checked out!', description: `${form.gear_item} is now checked out to ${form.scout_name}.` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#1a2744] text-lg flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-red-600" /> Check Out Gear
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Scout Name *</label>
            {rosterLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2.5"><Loader2 className="w-4 h-4 animate-spin" /> Loading roster...</div>
            ) : (
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.scout_name} onChange={e => handleScoutSelect(e.target.value)}>
                <option value="">Select a scout...</option>
                {scouts.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Scout Email *</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.scout_email} onChange={e => setForm(f => ({...f, scout_email: e.target.value}))} placeholder="scout@email.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Gear Item *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.gear_item} onChange={e => setForm(f => ({...f, gear_item: e.target.value, tent_number: ''}))}>
              {GEAR_OPTIONS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          {isTent && (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Tent Number *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.tent_number} onChange={e => setForm(f => ({...f, tent_number: e.target.value}))} placeholder="e.g. 3" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Notes (optional)</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Any condition notes..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Quartermaster Code *</label>
            <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={quartermasterCode} onChange={e => setQuartermasterCode(e.target.value)} placeholder="Enter the Quartermaster code" />
            <p className="text-xs text-gray-400 mt-1">Only a Quartermaster with the correct code can check out gear.</p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Saving...' : 'Check Out Gear'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckInModal({ record, onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [returnCode, setReturnCode] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCheckIn = async () => {
    if (!returnCode.trim()) {
      toast({ title: 'Quartermaster Return Code required', description: 'Enter the code to verify the gear return.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await base44.functions.invoke('verify-gear-return', {
        admin_code: returnCode.trim(),
        record_id: record.id,
        notes: notes || record.notes || '',
      });
      if (res.data?.authorized) {
        queryClient.invalidateQueries(['gear_checkouts']);
        toast({ title: 'Gear returned!', description: `${record.gear_item} has been checked back in.` });
        onClose();
      } else {
        toast({ title: 'Incorrect return code', description: 'The Quartermaster Return Code is incorrect.', variant: 'destructive' });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Verification failed. The backend function may not be deployed yet.';
      toast({ title: 'Incorrect return code', description: msg, variant: 'destructive' });
    }
    setSaving(false);
  };

  const gearLabel = record.tent_number ? `${record.gear_item} #${record.tent_number}` : record.gear_item;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-green-600" /> Return Gear
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Confirm return of <strong>{gearLabel}</strong> checked out by <strong>{record.scout_name}</strong>.</p>
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Quartermaster Return Code *</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={returnCode} onChange={e => setReturnCode(e.target.value)} placeholder="Enter the Quartermaster Return Code" />
          <p className="text-xs text-gray-400 mt-1">Only a Quartermaster with the correct code can confirm gear returns.</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Return Notes (optional)</label>
          <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any condition notes on return..." />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={handleCheckIn} disabled={saving || !returnCode.trim()} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Verifying...' : 'Confirm Return'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GearCheckout() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkInRecord, setCheckInRecord] = useState(null);
  const [filter, setFilter] = useState('checked_out');

  const { data: records = [] } = useQuery({
    queryKey: ['gear_checkouts'],
    queryFn: () => base44.entities.GearCheckout.list('-checkout_date', 100),
  });

  const checkedOut = records.filter(r => r.status === 'checked_out');
  const returned = records.filter(r => r.status === 'returned');
  const displayed = filter === 'checked_out' ? checkedOut : returned;

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Troop Gear Checkout</h1>
            <p className="text-white/70 mt-1">Track who has troop gear and when it's returned.</p>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <PackageOpen className="w-4 h-4" /> Check Out Gear
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-red-200 p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-red-600">{checkedOut.length}</p>
          <p className="text-sm text-gray-500 mt-1">Items Currently Out</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-600">{returned.length}</p>
          <p className="text-sm text-gray-500 mt-1">Items Returned</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden w-fit">
          <button
            onClick={() => setFilter('checked_out')}
            className={`px-5 py-2 text-sm font-semibold transition-colors ${filter === 'checked_out' ? 'bg-[#1a2744] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Checked Out ({checkedOut.length})
          </button>
          <button
            onClick={() => setFilter('returned')}
            className={`px-5 py-2 text-sm font-semibold transition-colors ${filter === 'returned' ? 'bg-[#1a2744] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Returned ({returned.length})
          </button>
        </div>
      </div>

      {/* Records */}
      <div className="max-w-4xl mx-auto px-4 pb-10">
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <PackageCheck className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">{filter === 'checked_out' ? 'No gear currently checked out' : 'No returned gear yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(record => {
              const gearLabel = record.tent_number ? `${record.gear_item} #${record.tent_number}` : record.gear_item;
              return (
                <div key={record.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${record.status === 'checked_out' ? 'bg-red-100' : 'bg-green-100'}`}>
                      {record.status === 'checked_out'
                        ? <PackageOpen className="w-5 h-5 text-red-600" />
                        : <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a2744]">{gearLabel}</p>
                      <p className="text-sm text-gray-500">{record.scout_name} — <span className="text-gray-400">{record.scout_email}</span></p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Checked out: {record.checkout_date}
                        {record.checkin_date && <span className="ml-2 text-green-600">· Returned: {record.checkin_date}</span>}
                      </p>
                      {record.notes && <p className="text-xs text-gray-400 italic mt-0.5">"{record.notes}"</p>}
                    </div>
                  </div>
                  {record.status === 'checked_out' && (
                    <button
                      onClick={() => setCheckInRecord(record)}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Return Gear
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />}
      {checkInRecord && <CheckInModal record={checkInRecord} onClose={() => setCheckInRecord(null)} />}
    </div>
  );
}