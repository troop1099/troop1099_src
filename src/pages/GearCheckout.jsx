import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PackageCheck, PackageOpen, RotateCcw, CheckCircle, X } from 'lucide-react';
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
    return_code: '',
  });
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const isAdmin = user?.role === 'admin';

  const isTent = form.gear_item === 'Troop Tent';

  const handleSubmit = async () => {
    if (!form.scout_name.trim() || !form.scout_email.trim()) {
      toast({ title: 'Please fill in your name and email.', variant: 'destructive' });
      return;
    }
    if (isTent && !form.tent_number.trim()) {
      toast({ title: 'Please enter the tent number.', variant: 'destructive' });
      return;
    }
    setSaving(true);
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
            <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.scout_name} onChange={e => setForm(f => ({...f, scout_name: e.target.value}))} placeholder="Scout's full name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Your Email *</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.scout_email} onChange={e => setForm(f => ({...f, scout_email: e.target.value}))} placeholder="your@email.com" />
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
          {isAdmin && (
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Return Code (admin only)</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.return_code} onChange={e => setForm(f => ({...f, return_code: e.target.value}))} placeholder="Code required to return this gear" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Notes (optional)</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Any condition notes..." />
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
    if (record.return_code && returnCode.trim() !== record.return_code.trim()) {
      toast({ title: 'Incorrect return code', description: 'Please enter the correct return code to verify the gear return.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    await base44.entities.GearCheckout.update(record.id, {
      status: 'returned',
      checkin_date: format(new Date(), 'yyyy-MM-dd'),
      notes: notes || record.notes,
    });
    queryClient.invalidateQueries(['gear_checkouts']);
    setSaving(false);
    toast({ title: 'Gear returned!', description: `${record.gear_item} has been checked back in.` });
    onClose();
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
        {record.return_code && (
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Return Code *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={returnCode} onChange={e => setReturnCode(e.target.value)} placeholder="Enter the return code provided by your leader" />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Return Notes (optional)</label>
          <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any condition notes on return..." />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={handleCheckIn} disabled={saving || (record.return_code && !returnCode.trim())} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Saving...' : 'Confirm Return'}
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