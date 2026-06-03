import React from 'react';
import { ExternalLink, Calendar, DollarSign, MapPin, CheckCircle, Star, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHAT_TO_EXPECT = [
  'Merit badge classes every morning — choose 3–5 badges for the week',
  'Patrol cooking in the campsite — Grubmaster rotation',
  'Evening campfires, skits, and troop ceremonies',
  'Free swim, boating, shooting sports, and COPE/climbing tower',
  'Eagle-required merit badges available (Cooking, Camping, Swimming, etc.)',
  'Staff-led programming keeps Scouts busy from 7am to 10pm',
  'Scouts sleep in patrol tents at the troop campsite',
  'Parents are welcome for "Family Night" (usually Wednesday or Thursday)',
];

const PACKING_HIGHLIGHTS = [
  'Class A uniform (wear on travel days)',
  'Class B t-shirts (4–5 for activity days)',
  'Sleeping bag + pillow',
  'Closed-toe shoes + one pair of water shoes',
  'Rain gear',
  'Sunscreen + bug spray',
  'Water bottle (32oz+)',
  'Spending money for trading post ($30–$50 typical)',
  'Completed Health Form Parts A, B & C (required to attend)',
  'Prescription medications in original containers',
];

export default function SummerCamp() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">Annual Event</p>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sun className="w-8 h-8 text-[#FFD700]" /> Summer Camp 2026
          </h1>
          <p className="text-white/70 mt-2">A week of merit badges, adventure, and memories. The highlight of every Scout's year.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Key Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <Calendar className="w-8 h-8 text-[#1a2744] mx-auto mb-2" />
            <p className="font-bold text-[#1a2744] text-lg">Dates</p>
            <p className="text-gray-600 text-sm mt-1">Typically mid-June</p>
            <p className="text-gray-400 text-xs mt-1">Confirm with Scoutmaster</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <MapPin className="w-8 h-8 text-[#1a2744] mx-auto mb-2" />
            <p className="font-bold text-[#1a2744] text-lg">Location</p>
            <p className="text-gray-600 text-sm mt-1">Northeast Georgia Council Camp</p>
            <a href="https://www.northfulton.org/camping" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 justify-center mt-1">
              Council camping page <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-bold text-[#1a2744] text-lg">Cost</p>
            <p className="text-gray-600 text-sm mt-1">$375 per Scout</p>
            <Link to="/dues" className="text-xs text-blue-600 hover:underline mt-1 block">Pay via Dues page</Link>
          </div>
        </div>

        {/* Registration */}
        <div className="bg-[#1a2744] text-white rounded-xl p-6">
          <h2 className="font-bold text-xl mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FFD700]" /> How to Register
          </h2>
          <ol className="space-y-3">
            {[
              { step: 1, text: 'Tell the Scoutmaster by the sign-up deadline (usually April) that your Scout is attending.' },
              { step: 2, text: 'Pay the $375 summer camp fee via the Dues page or by check to the troop treasurer.' },
              { step: 3, text: 'Complete the BSA Annual Health & Medical Record (Parts A, B, and C). Part C requires a doctor\'s signature within 12 months of camp.' },
              { step: 4, text: 'Submit health form to the Scoutmaster at least 2 weeks before departure.' },
              { step: 5, text: 'Choose your merit badges — the Scoutmaster will share the camp\'s course catalog before registration opens.' },
            ].map(s => (
              <li key={s.step} className="flex items-start gap-3">
                <span className="w-7 h-7 bg-[#FFD700] text-[#1a2744] rounded-full flex items-center justify-center font-bold text-sm shrink-0">{s.step}</span>
                <span className="text-white/85 text-sm leading-relaxed">{s.text}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://filestore.scouting.org/filestore/HealthSafety/pdf/680-001_ABC.pdf" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#FFD700] text-[#1a2744] font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors">
              Download Health Form <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link to="/dues" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
              Pay Summer Camp Fee
            </Link>
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-xl mb-4">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {WHAT_TO_EXPECT.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2744] text-xl mb-2">Packing Highlights</h2>
          <p className="text-sm text-gray-500 mb-4">See the full <Link to="/outing-prep" className="text-[#1a2744] underline">Regular Campout packing list</Link> plus these summer camp specifics:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PACKING_HIGHLIGHTS.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-[#1a2744] rounded-full shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarships */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5">
          <p className="font-bold text-[#1a2744] mb-1">💛 Scholarship Assistance Available</p>
          <p className="text-gray-700 text-sm">We do not want any Scout to miss summer camp due to cost. Financial assistance is available — please speak confidentially with the Scoutmaster well before the payment deadline.</p>
        </div>

      </div>
    </div>
  );
}