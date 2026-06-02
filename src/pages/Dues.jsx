import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';
const BSA_LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/6bb3dd785_Screenshot2026-06-01at102718PM.png';

const PAYMENT_OPTIONS = [
  { label: 'Annual Dues', amount: '$139.00 USD' },
  { label: 'Summer Camp', amount: '$375.00 USD' },
  { label: 'New Scout Registration', amount: '$65.00 USD' },
];

const included = [
  'BSA Annual Membership Registration',
  "Boys' Life Magazine subscription",
  'Troop operations and equipment',
  'Patches and court of honor recognition',
  'Thanksgiving outing (partial)',
];

export default function Dues() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(PAYMENT_OPTIONS[0].label);
  const [scoutName, setScoutName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePay = async () => {
    if (!scoutName.trim()) {
      toast({ title: 'Please enter the scout name', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    // Send notification email to troop treasurer
    await base44.integrations.Core.SendEmail({
      to: 'troop1099@bsa.org',
      subject: `Payment Request: ${selected} — ${scoutName}`,
      body: `A payment request has been submitted:\n\nScout Name: ${scoutName}\nPayment Type: ${selected}\nAmount: ${PAYMENT_OPTIONS.find(o => o.label === selected)?.amount}\n\nPlease follow up to collect payment.`,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-[#1a2744] mb-2">Request Submitted!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Your payment request for <strong>{scoutName}</strong> ({selected}) has been sent to the troop treasurer. They will follow up with payment instructions.
          </p>
          <button onClick={() => { setSubmitted(false); setScoutName(''); }} className="text-sm text-[#1a2744] underline">Submit another payment</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <img src={BSA_LOGO} alt="Boy Scouts of America Troop 1099" className="h-14 object-contain mx-auto mb-4 drop-shadow" />
          <h1 className="text-3xl font-bold">Troop 1099 Payments</h1>
          <p className="text-white/70 mt-2 max-w-lg mx-auto">
            Make your Annual Dues and Summer Camp payment below. Choose the appropriate option. If you have more than one scout, you will need to submit multiple times.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Pay Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-xl mb-5">Troop All Payments</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Payment Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
                value={selected}
                onChange={e => setSelected(e.target.value)}
              >
                {PAYMENT_OPTIONS.map(o => (
                  <option key={o.label} value={o.label}>{o.label} — {o.amount}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Scout Name</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
                placeholder="Enter scout's full name"
                value={scoutName}
                onChange={e => setScoutName(e.target.value)}
              />
            </div>
            <div className="bg-[#1a2744]/5 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount Due:</span>
              <span className="font-bold text-[#1a2744] text-lg">{PAYMENT_OPTIONS.find(o => o.label === selected)?.amount}</span>
            </div>
            <button
              onClick={handlePay}
              disabled={submitting}
              className="w-full bg-[#FFD700] hover:bg-yellow-400 text-[#1a2744] font-bold py-3 rounded-lg text-base transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Pay Now'}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Submitting this form notifies the troop treasurer. Payment may be made by check at a Monday meeting or via Venmo/PayPal as directed by the treasurer.
            </p>
          </div>
        </div>

        {/* Fee Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-lg mb-4">Fee Schedule</h2>
          <div className="space-y-3">
            {[
              { label: 'Annual Dues (Current Scout)', amount: '$139', note: 'Due by end of January each year' },
              { label: 'Summer Camp', amount: '$375', note: 'Usually early–mid June' },
              { label: 'New Scout / Crossover', amount: '$65', note: 'BSA membership already paid by pack' },
              { label: 'Normal Outing Fee', amount: '$30–$80', note: 'Food/campsite + activity fee' },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-[#1a2744] text-sm">{c.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.note}</p>
                </div>
                <span className="font-bold text-[#1a2744] shrink-0 ml-4">{c.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-lg mb-3">Annual Dues Include</h2>
          <div className="space-y-2">
            {included.map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">* Outing fees and summer camp are paid separately per event.</p>
        </div>

        {/* Scholarships */}
        <div className="bg-[#1a2744] rounded-xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-2">💛 Scholarships Available</p>
          <p className="text-white/70 text-sm">We do not want any boy to miss out on Scouting due to financial reasons. Scholarships are available — please speak confidentially with the Scoutmaster.</p>
        </div>

        <div className="text-center">
          <Link to="/new-scout" className="text-[#1a2744] text-sm underline">← New Scout Info</Link>
        </div>
      </div>
    </div>
  );
}