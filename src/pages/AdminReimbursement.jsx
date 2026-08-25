import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Loader2, Receipt, Eye, Lock, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAdmin } from '@/lib/AdminContext';
import { safeFormatDate } from '@/lib/dateUtils';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700' },
  reimbursed: { label: 'Reimbursed', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
};

function ReimbursementCard({ req, onStatus, onNote, onView, viewing }) {
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
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          <select value={status} onChange={e => onStatus(req.id, e.target.value)} className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${cfg.color}`}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="reimbursed">Reimbursed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="mt-3">
        <label className="text-xs font-semibold text-gray-400 uppercase block mb-1">Admin Note (optional)</label>
        <div className="flex gap-2">
          <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for this request..." />
          <button onClick={() => onNote(req.id, note)} className="bg-[#1a2744] text-white px-3 py-2 rounded-lg text-xs font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReimbursement() {
  const { adminUnlocked } = useAdmin();
  const { toast } = useToast();
  const [viewing, setViewing] = useState({});

  const { data: requests = [], refetch, isFetching } = useQuery({
    queryKey: ['reimbursements'],
    queryFn: () => base44.entities.Reimbursement.list('-created_date'),
    enabled: adminUnlocked,
  });

  const updateStatus = async (id, status) => {
    try {
      await base44.entities.Reimbursement.update(id, { status });
      toast({ title: 'Status updated' });
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

  if (!adminUnlocked) {
    return (
      <div className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full shadow-sm text-center">
          <div className="w-14 h-14 bg-[#1a2744] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#FFD700]" />
          </div>
          <h1 className="text-xl font-bold text-[#1a2744] mb-2 flex items-center justify-center gap-2"><Shield className="w-5 h-5" /> Reimbursement Dashboard</h1>
          <p className="text-gray-500 text-sm mb-4">Enter the master admin code using the <strong>Admin</strong> button at the top of the page to access reimbursement requests.</p>
        </div>
      </div>
    );
  }

  const counts = {
    pending: requests.filter(r => (r.status || 'pending') === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    reimbursed: requests.filter(r => r.status === 'reimbursed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Receipt className="w-6 h-6 text-[#FFD700]" /> Reimbursement Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''} submitted</p>
          </div>
          <button onClick={() => refetch()} disabled={isFetching} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Refresh
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className={`rounded-lg p-3 text-center ${STATUS_CONFIG[k].color}`}>
              <p className="text-2xl font-bold">{v}</p>
              <p className="text-xs font-semibold uppercase tracking-wide">{STATUS_CONFIG[k].label}</p>
            </div>
          ))}
        </div>

        {isFetching && requests.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No reimbursement requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <ReimbursementCard key={req.id} req={req} onStatus={updateStatus} onNote={saveNote} onView={viewReceipt} viewing={viewing[req.id]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}