import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ExternalLink } from 'lucide-react';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

const included = [
  'BSA Annual Membership Registration',
  'Boys\' Life Magazine subscription',
  'Troop operations and equipment',
  'Patches and court of honor recognition',
  'Thanksgiving outing (partial)',
];

const costs = [
  { label: 'Annual Dues (Current Scout)', amount: '$125', note: 'Due by end of January each year' },
  { label: 'Crossover from Cub Scouts', amount: '$65', note: 'BSA membership already paid by pack' },
  { label: 'New Scout (no prior troop)', amount: '$65 + pro-rated BSA dues', note: '$5/month for remaining months' },
];

export default function Dues() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <img src={LOGO} alt="Troop 1099" className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-2 object-contain" />
          <h1 className="text-3xl font-bold">Join Troop 1099</h1>
          <p className="text-white/70 mt-2 max-w-lg mx-auto">We're excited to welcome you to the troop! Pay dues below to complete registration.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Fee Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-xl mb-4">Annual Dues Schedule</h2>
          <div className="space-y-3">
            {costs.map(c => (
              <div key={c.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-[#1a2744] text-sm">{c.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.note}</p>
                </div>
                <span className="font-bold text-[#1a2744] text-lg shrink-0 ml-4">{c.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-lg mb-3">What's Included</h2>
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

        {/* Payment options */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-lg mb-4">Pay Your Dues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Check */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">✉️</div>
              <p className="font-semibold text-[#1a2744]">Pay by Check</p>
              <p className="text-gray-500 text-sm mt-2">Make checks payable to <strong>BSA Troop 1099</strong></p>
              <p className="text-gray-500 text-sm mt-1">Bring to the Scoutmaster at any Monday meeting.</p>
            </div>

            {/* Online / Contact */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">📧</div>
              <p className="font-semibold text-[#1a2744]">Questions?</p>
              <p className="text-gray-500 text-sm mt-2">Contact the Scoutmaster or Treasurer to arrange payment or ask about financial assistance.</p>
              <Link to="/contact" className="inline-flex items-center gap-1 mt-3 text-blue-600 text-sm hover:underline">
                Contact Us <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
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