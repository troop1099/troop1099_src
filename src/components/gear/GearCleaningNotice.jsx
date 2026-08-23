import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const CLEANING_STEPS = [
  {
    item: 'Tents',
    text: "Set up completely with the rainfly and let it dry in your backyard. Go inside and remove any leaves or debris. Wash the tarp. Check for missing poles, stakes, or parts — note what is missing and tell the quartermaster on return.",
  },
  {
    item: 'Stoves',
    text: 'Thoroughly scrub by hand and use Clorox wipes to make sure it is clean.',
  },
  {
    item: 'Boxes',
    text: 'Put utensils in the dishwasher. Any non-dishwasher-safe items must be cleaned by hand.',
  },
];

export default function GearCleaningNotice() {
  const [open, setOpen] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6">
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-yellow-100/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-yellow-700 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-[#1a2744] text-sm leading-tight">Gear Cleaning & Return Reminder</p>
              <p className="text-xs text-yellow-800 truncate">Read before returning troop gear.</p>
            </div>
          </div>
          {open
            ? <ChevronUp className="w-4 h-4 text-yellow-700 shrink-0" />
            : <ChevronDown className="w-4 h-4 text-yellow-700 shrink-0" />}
        </button>

        {open && (
          <div className="px-4 pb-3 pt-1 border-t border-yellow-200">
            <p className="text-xs text-gray-700 leading-snug mb-2">
              Scouts are expected to return the gear they were assigned to clean as soon as possible after any outing.
            </p>
            <p className="text-xs font-semibold text-[#1a2744] mb-1.5">If unfamiliar with the cleaning process:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CLEANING_STEPS.map(step => (
                <div key={step.item} className="bg-white rounded-md border border-yellow-200 p-2.5">
                  <p className="text-xs font-bold text-[#1a2744] mb-0.5">{step.item}</p>
                  <p className="text-xs text-gray-700 leading-snug">{step.text}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-700 mt-2 leading-snug">
              Return gear to a quartermaster present so they can mark it cleaned.{' '}
              <span className="font-bold text-[#1a2744]">Parents must vouch that their scout followed the cleaning process and is returning gear in good condition.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}