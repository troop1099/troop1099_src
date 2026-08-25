import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Loader2, Receipt, Eye, Lock, RefreshCw, Check, X, Mail, Clock, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAdmin } from '@/lib/AdminContext';
import { safeFormatDate } from '@/lib/dateUtils';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  denied: { label: 'Denied', color: 'bg-red-100 text-red-700' },
};

function AdminCard({ req, onDecide, onNote, onView, viewing }) {
  const status = req.status || 'pending';
  const cfg = STATUS_CONFIG[status];
  const [note, setNote] = useState(req.admin_note || '');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
        <div>
          <p className="font-bold text-[#1a2744]">{req.name}</p>
          <p className="text-xs text-gray-400">Submitted {safeFormatDate(req.created_date, 'MMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-700">${Number(req.amount || 0).toFixed(2)}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase">Purchase Date</p>
          <p className="text-gray-700">{safeFormatDate(req.purchase_date, 'MMM d, yyyy')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase">Purpose</p>
          <p className="text-gray-700">{req.purpose}</p>
        </div>
      </div>
      {req.description && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-400 uppercase">Description</p>
          <p className="text-gray-700 text-sm">{req.description}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
        <button onClick={() => onView(req)} disabled={viewing === 'loading'} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 disabled:opacity-50">
          {viewing === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />} View Receipt
        </button>
        {status === 'pending' ? (
          <div className="flex items-center gap-2">
            <button onClick={() => onDecide(req.id, 'accepted')} className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700">
              <Check className="w-3.5 h-3.5" /> Accept
            </button>
            <button onClick={() => onDecide(req.id, 'denied')} className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700">
              <X className="w-3.5 h-3.5" /> Deny
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Decision recorded • {cfg.label}</span>
        )}
      </div>
      <div className="mt-3">
        <label className="text-xs font-semibold text-gray-400 uppercase block mb-1">Scoutmaster Note (optional)</label>
        <div className="flex gap-2">
          <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for this request..." />
          <button onClick={() => onNote(req.id, note)} className="bg-[#1a2744] text-white px-3 py-2 rounded-lg text-xs font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}

function RequestList({ items, onDecide, onNote, onView, viewing, emptyText }) {
  if (items.length === 0) {
    return <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-400 text-sm">{emptyText}</div>;
  }
  return (
    <div className="space-y-4">
      {items.map(req => (
        <AdminCard key={req.id} req={req} onDecide={onDecide} onNote={onNote} onView={onView} viewing={viewing[req.id]} />
      ))}
    </div>
  );
}

export default function AdminReimbursement() {
  const { adminUnlocked } = useAdmin();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [viewing, setViewing] = useState({});
  const [notifEmail, setNotifEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  const { data: requests = [], refetch, isFetching } = useQuery({
    queryKey: ['reimbursements-admin'],
    queryFn: () => base44.entities.Reimbursement.list('-created_date'),
    enabled: adminUnlocked,
  });

  const { data: notifSetting = [] } = useQuery({
    queryKey: ['setting', 'scoutmaster_email'],
    queryFn: () => base44.entities.Setting.filter({ key: 'scoutmaster_email' }),
    enabled: adminUnlocked,
  });

  useEffect(() => {
    if (notifSetting[0]) setNotifEmail(notifSetting[0].value || '');
  }, [notifSetting]);

  const decide = async (id, status) => {
    try {
      await base44.entities.Reimbursement.update(id, { status });
      toast({ title: status === 'accepted' ? 'Reimbursement accepted' : 'Reimbursement denied' });
      refetch();
    } catch (err) {
      toast({ title: 'Update failed', variant: 'destructive' });
      refetch();
    }
  };

  const saveNote = async (id, note) => {
    try {
      await base44.entities.Reimbursement.update(id, { admin_note: note });
      toast({ title: 'Note saved' });
    } catch (err) {
      toast({ title: 'Note save failed', variant: 'destructive' });
    }
  };

  const viewReceipt = async (req) => {
    if (!req.receipt_file_uri) {
      toast({ title: 'No receipt attached', variant: 'destructive' });
      return;
    }
    setViewing(v => ({ ...v, [req.id]: 'loading' }));
    try {
      const res = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: req.receipt_file_uri });
      window.open(res.signed_url, '_blank');
    } catch (err) {
      toast({ title: 'Could not open receipt', variant: 'destructive' });
    }
    setViewing(v => ({ ...v, [req.id]: null }));
  };

  const saveEmail = async () => {
    setSavingEmail(true);
    try {
      const existing = notifSetting[0];
      if (existing) await base44.entities.Setting.update(existing.id, { value: notifEmail.trim() });
      else await base44.entities.Setting.create({ key: 'scoutmaster_email', value: notifEmail.trim() });
      qc.invalidateQueries(['setting', 'scoutmaster_email']);
      toast({ title: 'Notification email saved' });
    } catch (e) {
      toast({ title: 'Could not save email', variant: 'destructive' });
    }
    setSavingEmail(false);
  };

  if (!adminUnlocked) {
    return (
      <div className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full shadow-sm text-center">
          <div className="w-14 h-14 bg-[#1a2744] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#FFD700]" />
          </div>
          <h1 className="text-xl font-bold text-[#1a2744] mb-2 flex items-center justify-center gap-2"><Shield className="w-5 h-5" /> Reimbursement Dashboard</h1>
          <p className="text-gray-500 text-sm mb-4">Enter the master admin code using the <strong>Admin</strong> button at the top of the page to review reimbursement requests.</p>
        </div>
      </div>
    );
  }

  const pending = requests.filter(r => (r.status || 'pending') === 'pending');
  const history = requests.filter(r => r.status === 'accepted' || r.status === 'denied');
  const counts = {
    pending: pending.length,
    accepted: history.filter(r => r.status === 'accepted').length,
    denied: history.filter(r => r.status === 'denied').length,
  };

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Receipt className="w-6 h-6 text-[#FFD700]" /> Reimbursement Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''} • review pending and view full history</p>
          </div>
          <button onClick={() => refetch()} disabled={isFetching} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Refresh
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className={`rounded-lg p-3 text-center ${STATUS_CONFIG[k].color}`}>
              <p className="text-2xl font-bold">{v}</p>
              <p className="text-xs font-semibold uppercase tracking-wide">{STATUS_CONFIG[k].label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-[#1a2744] font-semibold text-sm shrink-0">
              <Mail className="w-4 h-4" /> Notification email
            </div>
            <input type="email" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]" value={notifEmail} onChange={e => setNotifEmail(e.target.value)} placeholder="scoutmaster@troop1099.org" />
            <button onClick={saveEmail} disabled={savingEmail} className="bg-[#1a2744] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 whitespace-nowrap">
              {savingEmail ? 'Saving...' : 'Save'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">You'll get an email here whenever someone submits a new reimbursement request.</p>
        </div>

        {isFetching && requests.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading requests...
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-bold text-[#1a2744] mb-3 flex items-center gap-2"><Clock className="w-5 h-5" /> Pending Review ({pending.length})</h2>
              <RequestList items={pending} onDecide={decide} onNote={saveNote} onView={viewReceipt} viewing={viewing} emptyText="No requests waiting for review." />
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1a2744] mb-3 flex items-center gap-2"><History className="w-5 h-5" /> History ({history.length})</h2>
              <RequestList items={history} onDecide={decide} onNote={saveNote} onView={viewReceipt} viewing={viewing} emptyText="No past requests yet." />
            </section>
          </>
        )}
      </div>
    </div>
  );
}