import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Receipt, Upload, CheckCircle, Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function SubmitReimbursement() {
  const { toast } = useToast();
  const fileRef = useRef();
  const [form, setForm] = useState({ name: '', purchase_date: '', amount: '', purpose: '', description: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = form.name.trim() && form.purchase_date && form.amount && form.purpose.trim() && file;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const uploadRes = await base44.integrations.Core.UploadPrivateFile({ file });
      await base44.entities.Reimbursement.create({
        name: form.name.trim(),
        purchase_date: form.purchase_date,
        amount: Number(form.amount),
        purpose: form.purpose.trim(),
        description: form.description.trim(),
        receipt_file_uri: uploadRes.file_uri,
        status: 'pending',
      });
      setSubmitted(true);
    } catch (err) {
      toast({ title: 'Submission failed', description: err?.message || 'Please try again.', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  const reset = () => {
    setForm({ name: '', purchase_date: '', amount: '', purpose: '', description: '' });
    setFile(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-[#1a2744] mb-2">Reimbursement Submitted!</h2>
          <p className="text-gray-600 text-sm mb-6">Your request and receipt have been sent securely to the Scoutmaster. An adult leader will review it and follow up about reimbursement.</p>
          <button onClick={reset} className="text-sm text-[#1a2744] underline">Submit another reimbursement</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2"><Receipt className="w-7 h-7 text-[#FFD700]" /> Submit a Reimbursement</h1>
          <p className="text-white/70 mt-2">Purchased something for the troop? Submit your expense with a receipt and an adult leader will review it.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Your Name *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
          </div>
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
          <p className="text-xs text-gray-400 text-center">Your request is private — only an adult leader who enters the admin code can view it.</p>
        </div>
      </div>
    </div>
  );
}