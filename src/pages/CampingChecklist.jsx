import React, { useState } from 'react';
import { CheckCircle, X, Download } from 'lucide-react';

const SCOUT_SECTIONS = [
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
      { item: "Pocketknife (Totin' Chip required)", required: false },
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
      { item: "Giant fluffy (cotton) sleeping bags — they don't retain heat when wet", required: true },
    ],
  },
];

// Quartermaster checklist from the official Troop 1099 PDF
const QTR_SECTIONS = [
  {
    title: 'Shelter & Lighting',
    color: 'bg-blue-50 border-blue-200',
    items: [
      { item: 'Tents (6+ — clean ones)', qty: '6+' },
      { item: 'Tarps (6+ — clean ones)', qty: '6+' },
      { item: 'Lamps (working)', qty: '4' },
      { item: 'Propane Tanks (more than half full)', qty: '4' },
      { item: 'Orange Water Jugs', qty: '4' },
    ],
  },
  {
    title: 'White Box 1 — Tableware',
    color: 'bg-green-50 border-green-200',
    items: [
      { item: 'Small Plates', qty: '40' },
      { item: 'Medium Plates', qty: '40' },
      { item: 'Large Plates', qty: '40' },
      { item: 'Bowls', qty: '40' },
      { item: 'Forks', qty: '50' },
      { item: 'Spoons', qty: '50' },
      { item: 'Knives', qty: '50' },
      { item: 'Paper Napkins', qty: '40' },
      { item: 'Bounty Rolls', qty: '2' },
    ],
  },
  {
    title: 'White Box 2 — Supplies',
    color: 'bg-teal-50 border-teal-200',
    items: [
      { item: 'Aluminium Foil', qty: '1' },
      { item: 'Ziplock Bag Box', qty: '2' },
    ],
  },
  {
    title: 'Blue Box 1 — Pantry',
    color: 'bg-indigo-50 border-indigo-200',
    items: [
      { item: 'Cake Mix (check expire date)', qty: '2' },
      { item: 'Brownie Mix (check expire date)', qty: '1' },
      { item: 'Fruit Cans (check expire date)', qty: '2' },
      { item: 'Parchment Paper', qty: '1' },
      { item: 'Can Opener', qty: '2' },
    ],
  },
  {
    title: 'Cleaning Station',
    color: 'bg-yellow-50 border-yellow-200',
    items: [
      { item: 'Black Tubs', qty: '3' },
      { item: 'Scrubbers', qty: '3' },
      { item: 'Dish Soap', qty: '1' },
      { item: 'Rags', qty: '3' },
      { item: 'Boiling Pot', qty: '1' },
      { item: 'Burner Stand', qty: '1' },
    ],
  },
  {
    title: 'Cooking Equipment',
    color: 'bg-orange-50 border-orange-200',
    items: [
      { item: 'Patrol Boxes', qty: '3' },
      { item: 'Gas Stoves', qty: '4' },
      { item: 'Gas Hose Bag', qty: '1' },
      { item: 'Black Stone Griddle', qty: '1' },
      { item: 'Trash Cans', qty: '2' },
      { item: 'Trash Can Covers', qty: '10' },
    ],
  },
  {
    title: 'Adult Wooden Box',
    color: 'bg-amber-50 border-amber-200',
    items: [
      { item: 'Salt', qty: '1' },
      { item: 'Pepper', qty: '1' },
      { item: 'Ketchup', qty: '1' },
      { item: 'Oil', qty: '1' },
      { item: 'Sugar', qty: '1' },
      { item: 'Coffee Tins', qty: '2' },
      { item: 'Coffee Pots', qty: '2' },
      { item: 'Spice Sauce', qty: '2' },
      { item: 'Lighters', qty: '4' },
      { item: 'Fire Starter', qty: '2' },
      { item: 'Cleaning Kit', qty: '1' },
      { item: 'Peelers Box', qty: '1' },
    ],
  },
  {
    title: 'Dutch Oven & Charcoal',
    color: 'bg-red-50 border-red-200',
    items: [
      { item: 'Dutch Oven with Lids', qty: '3' },
      { item: 'Lid Opener', qty: '2' },
      { item: 'Charcoal Bags', qty: '2' },
      { item: 'Gloves (pair)', qty: '1' },
      { item: 'Coal Pans', qty: '4' },
      { item: 'Charcoal Chimney', qty: '2' },
    ],
  },
  {
    title: 'Tools & Safety',
    color: 'bg-purple-50 border-purple-200',
    items: [
      { item: 'Shovel', qty: '1' },
      { item: 'Broom', qty: '1' },
      { item: 'Tool Box', qty: '1' },
      { item: 'First Aid Box', qty: '1' },
      { item: 'Fire Buckets', qty: '4' },
      { item: 'Axe Yard Bin', qty: '1' },
      { item: 'Games Bin', qty: '1' },
      { item: 'Fire Wood', qty: 'as needed' },
    ],
  },
];

function ScoutChecklist() {
  const [checked, setChecked] = useState({});
  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const totalRequired = SCOUT_SECTIONS.slice(0, -1).flatMap(s => s.items).filter(i => i.required).length;
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((totalChecked / totalRequired) * 100);

  return (
    <div className="space-y-5">
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

      {SCOUT_SECTIONS.map((section) => (
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
  );
}

function QtrMasterChecklist() {
  const [checked, setChecked] = useState({});
  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const total = QTR_SECTIONS.flatMap(s => s.items).length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-[#1a2744]">Quartermaster Progress</p>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">{done} / {total} items verified</p>
            <a
              href="https://media.base44.com/files/public/6a1da1101f26862b7b863a4a/c75f4b21b_CampingChecklist.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#1a2744] border border-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </a>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-[#1a2744] h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{pct}% checked</span>
          <button onClick={() => setChecked({})} className="text-xs text-gray-400 hover:text-red-500">Reset</button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <p className="font-bold mb-1">Before Every Outing</p>
        <p>ASPL and SPL must initial the completed checklist. The Quartermaster is responsible for all items below being loaded, clean, and in working order.</p>
      </div>

      {QTR_SECTIONS.map((section) => (
        <div key={section.title} className={`rounded-xl border-2 p-5 ${section.color}`}>
          <h2 className="font-bold text-[#1a2744] text-lg mb-4">{section.title}</h2>
          <div className="space-y-2">
            {section.items.map((gear, i) => {
              const key = `qtr-${section.title}-${i}`;
              return (
                <div
                  key={key}
                  onClick={() => toggle(key)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg bg-white/60 cursor-pointer hover:bg-white/90 transition-colors ${checked[key] ? 'opacity-60' : ''}`}
                >
                  <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${checked[key] ? 'bg-green-500 border-green-500' : 'border-[#1a2744]'}`}>
                    {checked[key] && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm text-gray-800 font-medium flex-1 ${checked[key] ? 'line-through text-gray-400' : ''}`}>{gear.item}</span>
                  <span className="text-xs text-gray-500 font-mono bg-white/80 px-2 py-0.5 rounded shrink-0">×{gear.qty}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CampingChecklist() {
  const [tab, setTab] = useState('scout');

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Camping Checklists</h1>
          <p className="text-white/70 mt-2">Scout packing list and official Quartermaster gear checklist for Troop 1099.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('scout')}
            className={`px-4 py-2 rounded font-semibold text-sm ${tab === 'scout' ? 'bg-[#1a2744] text-white' : 'bg-white border border-gray-300 text-gray-600'}`}
          >
            🎒 Scout Packing List
          </button>
          <button
            onClick={() => setTab('qtr')}
            className={`px-4 py-2 rounded font-semibold text-sm ${tab === 'qtr' ? 'bg-[#1a2744] text-white' : 'bg-white border border-gray-300 text-gray-600'}`}
          >
            📦 Quartermaster Checklist
          </button>
        </div>

        {tab === 'scout' ? <ScoutChecklist /> : <QtrMasterChecklist />}
      </div>
    </div>
  );
}