import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const CLEANING_STEPS = [
  {
    item: 'Tents',
    text: 'Set them up completely with the rainfly and let it dry out in your backyard. Also, go inside of the tent and remove any leaves or other material inside of it. Wash the tarp as well. Check to see if there are any missing poles, stakes, or other parts. If there are, remember what is missing and tell the quartermaster that you return this to.',
  },
  {
    item: 'Stoves',
    text: 'Thoroughly scrub it by hand and use Clorox wipes to make sure it is clean.',
  },
  {
    item: 'Boxes',
    text: 'Take the utensils and put them in a dishwasher. Some of the materials in the boxes might not be dishwasher-safe, so make sure to clean those items by hand.',
  },
];

export default function GearCleaningNotice() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6">
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between gap-3 p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-yellow-700" />
            </div>
            <div>
              <p className="font-bold text-[#1a2744] text-sm">Gear Cleaning & Return Reminder</p>
              <p className="text-xs text-yellow-800 mt-0.5">Scouts assigned to clean gear from the August Scoutland outing — read before returning.</p>
            </div>
          </div>
          {open
            ? <ChevronUp className="w-5 h-5 text-yellow-700 shrink-0" />
            : <ChevronDown className="w-5 h-5 text-yellow-700 shrink-0" />}
        </button>

        {open && (
          <div className="px-5 pb-5 pt-1 border-t border-yellow-200">
            <p className="text-sm text-[#1a2744] mb-3 leading-relaxed">
              This is a reminder for scouts who went on the August outing at Scoutland that the troop gear they were assigned to clean is expected to be returned as soon as possible.
            </p>
            <p className="text-sm font-semibold text-[#1a2744] mb-3">
              For scouts who are unfamiliar with the cleaning process, this is what you should do—
            </p>
            <div className="space-y-3">
              {CLEANING_STEPS.map(step => (
                <div key={step.item} className="bg-white rounded-lg border border-yellow-200 p-3">
                  <p className="text-sm font-bold text-[#1a2744] mb-1">{step.item}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}