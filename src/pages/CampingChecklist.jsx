import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Clothing',
    color: 'bg-blue-50 border-blue-200',
    items: [
      { item: 'Class A uniform (shirt, pants/shorts, belt, socks) — wear during travel', required: true },
      { item: 'Class B troop t-shirt (2–3 for activity days)', required: true },
      { item: '2 short sleeve synthetic shirts', required: true },
      { item: '1–2 long sleeve synthetic shirts', required: true },
      { item: 'Long pants or synthetic sweats', required: true },
      { item: 'Sweatshirt or jacket', required: true },
      { item: 'Cold weather: heavy jacket + extra long pants', required: false },
      { item: 'Hiking boots or sturdy closed-toe shoes', required: true },
      { item: 'Socks (at least 2 pair per day — dry socks are priceless!)', required: true },
      { item: 'Rain gear — waterproof jacket or heavy poncho + rain pants. ALWAYS bring, even if 0% rain.', required: true },
      { item: 'Underwear (1 per day)', required: true },
      { item: 'Optional: sleeping clothes (t-shirt, dry socks, shorts)', required: false },
      { item: 'Cold weather: wool or pull-on cap + lightweight gloves', required: false },
      { item: 'Zip-off pants (highly recommended — warm/cold/rain versatile)', required: false },
    ],
  },
  {
    title: 'Personal Items',
    color: 'bg-green-50 border-green-200',
    items: [
      { item: 'Boy Scout Handbook (in Ziplock bag or book cover)', required: true },
      { item: 'Headlamp + extra batteries (scouts always forget this!)', required: true },
      { item: 'Small first aid kit: bandaids, gauze, moleskin, antiseptic, adhesive tape', required: true },
      { item: 'All medications in original containers — turn in to leader before departure', required: true },
      { item: 'Toiletries: toothbrush, toothpaste, soap, toilet paper, hand sanitizer, chapstick', required: true },
      { item: 'Washcloth / microfiber towel', required: true },
      { item: 'Pocketknife (Totin\' Chip required)', required: false },
      { item: 'Compass', required: true },
      { item: 'Sun protection: sunscreen SPF35+, sunglasses, hat', required: true },
      { item: 'Insect repellant (no aerosol cans)', required: false },
      { item: 'Plastic trash bags (1–2 to keep gear dry)', required: false },
      { item: 'Optional: camera, watch, whistle', required: false },
    ],
  },
  {
    title: 'Sleeping Gear',
    color: 'bg-purple-50 border-purple-200',
    items: [
      { item: 'Sleeping bag (30°F rated or better)', required: true },
      { item: 'Sleeping pad (essential for body heat retention)', required: true },
      { item: 'Pillow', required: false },
      { item: 'Optional: sleeping bag liner', required: false },
      { item: 'Optional: camp chair', required: false },
    ],
  },
  {
    title: 'Shelter & Pack',
    color: 'bg-orange-50 border-orange-200',
    items: [
      { item: 'Backpack or duffle bag (army surplus duffle works for campouts)', required: true },
      { item: 'Tent (or borrow a troop tent via Gear Checkout)', required: true },
      { item: 'Ground cloth / tarp', required: false },
    ],
  },
  {
    title: 'Mess Kit',
    color: 'bg-yellow-50 border-yellow-200',
    items: [
      { item: 'Drinking cup with handle', required: true },
      { item: 'Plate or bowl', required: true },
      { item: 'Water bottle (wide-mouth Nalgene recommended)', required: true },
      { item: 'Eating utensils (spork or spoon + fork)', required: true },
    ],
  },
  {
    title: 'DO NOT Bring',
    color: 'bg-red-50 border-red-200',
    items: [
      { item: 'Electronics: cell phones, tablets, gaming devices (unless Scoutmaster approved)', required: true },
      { item: 'Personal snacks (food in tents attracts bears)', required: true },
      { item: 'Hunting knives or blades over 3 inches', required: true },
      { item: 'Fireworks, alcohol, or firearms', required: true },
      { item: 'Aerosol spray cans', required: true },
      { item: 'Lots of changes of clothing, multiple coats', required: true },
      { item: 'Giant fluffy (cotton) sleeping bags — they don\'t retain heat when wet', required: true },
    ],
  },
];

export default function CampingChecklist() {
  const [checked, setChecked] = useState({});

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const totalRequired = SECTIONS.slice(0, -1).flatMap(s => s.items).filter(i => i.required).length;
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((totalChecked / totalRequired) * 100);

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Camping Checklist</h1>
          <p className="text-white/70 mt-2">Combined from Troop 1099 and Troop 143 packing guides. Check off items as you pack.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">
        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-[#1a2744]">Packing Progress</p>
            <p className="text-sm text-gray-500">{totalChecked} / {totalRequired} required items</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">{pct}% packed</span>
            <button onClick={() => setChecked({})} className="text-xs text-gray-400 hover:text-red-500">Reset</button>
          </div>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className={`rounded-xl border-2 p-5 ${section.color}`}>
            <h2 className={`font-bold text-[#1a2744] text-lg mb-4 ${section.title === 'DO NOT Bring' ? 'text-red-700' : ''}`}>
              {section.title === 'DO NOT Bring' ? '🚫 ' : ''}{section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {section.items.map((gear, i) => {
                const key = `${section.title}-${i}`;
                const isDontBring = section.title === 'DO NOT Bring';
                return (
                  <div
                    key={key}
                    onClick={() => !isDontBring && toggle(key)}
                    className={`flex items-start gap-3 p-2.5 rounded-lg bg-white/60 ${!isDontBring ? 'cursor-pointer hover:bg-white/90 transition-colors' : ''} ${checked[key] ? 'opacity-60' : ''}`}
                  >
                    {isDontBring ? (
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <div className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center ${checked[key] ? 'bg-green-500 border-green-500' : gear.required ? 'border-[#1a2744]' : 'border-gray-400'}`}>
                        {checked[key] && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    )}
                    <span className={`text-sm ${gear.required ? 'text-gray-800 font-medium' : 'text-gray-500'} ${checked[key] ? 'line-through text-gray-400' : ''}`}>{gear.item}</span>
                    {!gear.required && !isDontBring && <span className="text-xs text-gray-400 italic ml-auto shrink-0 whitespace-nowrap">optional</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-[#1a2744] text-white rounded-xl p-5 text-center">
          <p className="font-bold text-[#FFD700] text-lg mb-1">🏷 LABEL EVERYTHING</p>
          <p className="text-white/80 text-sm">Write your name on every single item, especially those you carry during the day. Every campout, scouts lose water bottles and headlamps. Labels reunite them with their owners.</p>
        </div>
      </div>
    </div>
  );
}