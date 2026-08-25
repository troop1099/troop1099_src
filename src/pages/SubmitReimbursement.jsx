import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Receipt, Upload, Loader2, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ScoutPhoneLookup from '@/components/advancement/ScoutPhoneLookup';
import { useAdmin } from '@/lib/AdminContext';
import AdminReimbursement from '@/pages/AdminReimbursement';
import { safeFormatDate } from '@/lib/dateUtils';

function normalizePhone(phone) {
  if (!phone) return '';
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('1') && d.length === 11) d = d.slice(1);
  return d.slice(-10);
}

function QueueCard({ req, onDismiss, dismissing }) {
  const pending = req.status === 'pending';
  const accepted = req.status === 'accepted';
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-[#1a2744]">${Number(req.amount || 0).toFixed(2)} — {req.purpose}</p>
          <p className="text-xs text-gray-400">Purchased {safeFormatDate(req.purchase_date, 'MMM d, yyyy')} • Submitted {safeFormatDate(req.created_date, 'MMM d, yyyy')}</p>
          {req.description && <p className="text-sm text-gray-600 mt-1">{req.description}</p>}
        </div>
        <div className="shrink-0">
          {pending ? (
            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"><Clock className="w-3 h-3" /> Waiting</span>
          ) : accepted ? (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"><CheckCircle className="w-3 h-3" /> Accepted</span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"><XCircle className="w-3 h-3" /> Denied</span>
          )}
        </div>
      </div>
      {!pending && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-600 leading-snug">
            {accepted ? 'Your reimbursement was accepted. An adult leader will follow up about payment.' : 'Your reimbursement was denied. Contact the Scoutmaster if you have questions.'}
            {req.admin_note && <span className="block mt-1"><strong>Scoutmaster note:</strong> {req.admin_note}</span>}
          </p>
          <button onClick={() => onDismiss(req.id)} disabled={dismissing} className="text-xs text-gray-400 hover:text-[#1a2744] underline disabled:opacity-50 whitespace-nowrap shrink-0">
            {dismissing ? 'Removing...' : 'Dismiss'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SubmitReimbursement() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef();
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [scoutName, setScoutName] = useState('');
  const [form, setForm] = useState({ purchase_date: '', amount: '', purpose: '', description: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dismissing, setDismissing] = useState(null);
  const { adminUnlocked } = useAdmin();

  const normPhone = normalizePhone(verifiedPhone);

  const { data: myRequests = [], isFetching } = useQuery({
    queryKey: ['reimbursements', normPhone],
    queryFn: () => base44.entities.Reimbursement.filter({ phone: normPhone }, '-created_date'),
    enabled: !!normPhone,
  });

  if (adminUnlocked) return <AdminReimbursement />;

  const queue = myRequests.filter(r =>
    r.status === 'pending' ||
    ((r.status === 'accepted' || r.status === 'denied') && !r.scout_acknowledged)
  );

  const canSubmit = verifiedPhone && scoutName && form.purchase_date && form.amount && form.purpose.trim() && file;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const uploadRes = await base44.integrations.Core.UploadPrivateFile({ file });
      await base44.entities.Reimbursement.create({
        name: scoutName,
        phone: normPhone,
        purchase_date: form.purchase_date,
        amount: Number(form.amount),
        purpose: form.purpose.trim(),
        description: form.description.trim(),
        receipt_file_uri: uploadRes.file_uri,
        status: 'pending',
        scout_acknowledged: false,
      });
      // Notify the Scoutmaster that a new request was submitted
      try {
        const s = await base44.entities.Setting.filter({ key: 'scoutmaster_email' });
        const email = s[0]?.value;
        if (email) {
          await base44.integrations.Core.SendEmail({
            to: email,
            subject: 'New reimbursement request submitted',
            body: `${scoutName} submitted a reimbursement request.\n\nAmount: $${Number(form.amount).toFixed(2)}\nPurpose: ${form.purpose.trim()}\nPurchase date: ${form.purchase_date}\n\nOpen the Reimbursement Dashboard (admin) to review it.`,
          });
        }
      } catch (e) { /* notification is best-effort */ }
      toast({ title: 'Reimbursement submitted!' });
      setForm({ purchase_date: '', amount: '', purpose: '', description: '' });
      setFile(null);
      qc.invalidateQueries(['reimbursements', normPhone]);
    } catch (err) {
      toast({ title: 'Submission failed', description: err?.message || 'Please try again.', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  const dismiss = async (id) => {
    setDismissing(id);
    try {
      await base44.entities.Reimbursement.update(id, { scout_acknowledged: true });
      qc.invalidateQueries(['reimbursements', normPhone]);
    } catch (e) {
      toast({ title: 'Could not dismiss', variant: 'destructive' });
    }
    setDismissing(null);
  };

  if (!verifiedPhone) {
    return (
      <div className="pt-14 min-h-screen bg-gray-50">
        <div className="bg-[#1a2744] text-white py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-2"><Receipt className="w-7 h-7 text-[#FFD700]" /> Submit a Reimbursement</h1>
            <p className="text-white/70 mt-2">Verify your identity with the phone number on file with the troop to submit a reimbursement and track its status.</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ScoutPhoneLookup
            instruction="Enter the phone number registered with Troop 1099. Only verified members can submit reimbursements and view their queue."
            onVerified={(phone, name) => { setVerifiedPhone(phone); setScoutName(name); }}
            onReset={() => { setVerifiedPhone(''); setScoutName(''); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Receipt className="w-7 h-7 text-[#FFD700]" /> Submit a Reimbursement</h1>
            <p className="text-white/70 mt-2">Hi <strong>{scoutName}</strong> — submit a troop expense with a receipt and track it below.</p>
          </div>
          <button onClick={() => { setVerifiedPhone(''); setScoutName(''); }} className="text-xs text-white/60 hover:text-white underline">Verify a different number</button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Date of Purchase *</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.purchase_date} onChange={e => setForm(f => ({ ...f, purchase_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Amount Spent ($) *</label>
              <input type="number" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">What Was the Purchase For? *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="e.g. Patrol food for March campout" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Short Description</label>
            <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Any details the Scoutmaster should know (optional)" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Receipt Upload * <span className="text-gray-400 font-normal">(photo, PDF, or screenshot — required)</span></label>
            <button type="button" onClick={() => fileRef.current.click()} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#1a2744] transition-colors">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-[#1a2744] font-semibold truncate max-w-[80%]">{file.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-gray-400 hover:text-red-500 shrink-0"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Tap to take a photo or choose a file</span>
                </div>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => setFile(e.target.files[0] || null)} />
          </div>
          <button onClick={handleSubmit} disabled={!canSubmit || submitting} className="w-full bg-[#1a2744] text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Reimbursement'}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1a2744] mb-3 flex items-center gap-2"><Clock className="w-5 h-5" /> Your Reimbursement Queue</h2>
          {isFetching && queue.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...</div>
          ) : queue.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
              <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No active reimbursements. Submit one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map(req => (
                <QueueCard key={req.id} req={req} onDismiss={dismiss} dismissing={dismissing === req.id} />
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">Only you can see this queue — it is tied to your verified phone number.</p>
        </div>
      </div>
    </div>
  );
}