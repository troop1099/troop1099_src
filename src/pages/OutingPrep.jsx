import React, { useState } from 'react';
import { Backpack, Thermometer, Droplets, Mountain, Flame, ChefHat, Package, AlertTriangle } from 'lucide-react';

const OUTING_TYPES = [
  {
    id: 'regular',
    label: 'Regular Campout',
    icon: Flame,
    color: 'bg-orange-50 border-orange-300',
    activeColor: 'bg-orange-600',
    gear: [
      { item: 'Tent or hammock (or share a troop tent)', required: true },
      { item: 'Sleeping bag (rated to 30°F minimum)', required: true },
      { item: 'Sleeping pad or inflatable mat', required: true },
      { item: 'Backpack or duffel bag', required: true },
      { item: 'Class A uniform (for travel and campfire)', required: true },
      { item: 'Class B t-shirt (for activities)', required: true },
      { item: 'Rain gear / poncho', required: true },
      { item: 'Closed-toe shoes (sneakers or boots)', required: true },
      { item: 'Extra socks (2+ pairs)', required: true },
      { item: 'Water bottle (32oz minimum)', required: true },
      { item: 'Headlamp + extra batteries', required: true },
      { item: 'Personal first aid items / medications', required: true },
      { item: 'Sunscreen and bug spray', required: true },
      { item: 'Pocket knife (Totin\' Chip required)', required: false },
      { item: 'Camp chair or sit pad', required: false },
      { item: 'Small day pack for hikes', required: false },
    ],
    notes: 'Leave electronics at home unless specifically permitted. Arrive in Class A uniform. Troop tents are available to borrow — see the Gear Checkout page.',
  },
  {
    id: 'backpacking',
    label: 'Backpacking',
    icon: Backpack,
    color: 'bg-green-50 border-green-300',
    activeColor: 'bg-green-600',
    gear: [
      { item: 'Backpack (40–65L frame pack)', required: true },
      { item: 'Lightweight tent or bivy (under 4 lbs)', required: true },
      { item: 'Sleeping bag rated to 20–30°F', required: true },
      { item: 'Sleeping pad (foam or inflatable)', required: true },
      { item: 'Water filter or purification tablets', required: true },
      { item: 'Stove + fuel canister', required: true },
      { item: 'Lightweight cookpot and utensils', required: true },
      { item: 'Food (dehydrated/lightweight — 3 meals/day)', required: true },
      { item: 'Trekking poles (recommended)', required: false },
      { item: 'Gaiters (for wet/muddy terrain)', required: false },
      { item: 'Headlamp + backup', required: true },
      { item: 'Navigation (map + compass + GPS)', required: true },
      { item: 'Rain gear (pack cover + jacket)', required: true },
      { item: 'Blister kit (moleskin, tape)', required: true },
      { item: 'Bear canister or hang bag + cord', required: true },
      { item: 'Leave No Trace waste bags / trowel', required: true },
    ],
    notes: 'Total pack weight should be under 1/3 of body weight. Break in your boots before the trip! Practice setting up your tent at home.',
  },
  {
    id: 'snow',
    label: 'Snow / Cold Weather',
    icon: Thermometer,
    color: 'bg-blue-50 border-blue-300',
    activeColor: 'bg-blue-600',
    gear: [
      { item: 'Moisture-wicking base layer (top + bottom)', required: true },
      { item: 'Insulating mid-layer (fleece or down)', required: true },
      { item: 'Waterproof outer layer (jacket + pants)', required: true },
      { item: 'Wool or synthetic socks (NO COTTON)', required: true },
      { item: 'Insulated, waterproof boots', required: true },
      { item: 'Warm hat covering ears', required: true },
      { item: 'Balaclava or neck gaiter', required: true },
      { item: 'Insulated gloves + liner gloves', required: true },
      { item: 'Hand/foot warmers (extras)', required: true },
      { item: 'Sleeping bag rated to 0°F', required: true },
      { item: 'Insulated sleeping pad (R-value 4+)', required: true },
      { item: 'Snowshoes or microspikes (per trip)', required: false },
      { item: 'Sunglasses / goggles (UV protection)', required: true },
      { item: 'Sunscreen (UV is intense on snow)', required: true },
      { item: 'Insulated water bottle (prevent freezing)', required: true },
      { item: 'High-calorie snacks (nuts, jerky, chocolate)', required: true },
    ],
    notes: 'The #1 rule for cold weather: NO COTTON. Cotton kills — it holds moisture and causes hypothermia. Dress in synthetic or wool layers only.',
  },
  {
    id: 'water',
    label: 'Water / Aquatics',
    icon: Droplets,
    color: 'bg-cyan-50 border-cyan-300',
    activeColor: 'bg-cyan-600',
    gear: [
      { item: 'BSA-approved life jacket (PFD) — troop has some', required: true },
      { item: 'Swimsuit', required: true },
      { item: 'Quick-dry shorts and shirt', required: true },
      { item: 'Water shoes or sandals with heel strap', required: true },
      { item: 'Dry bag for valuables and clothes', required: true },
      { item: 'Towel (fast-dry recommended)', required: true },
      { item: 'Sunscreen (water-resistant SPF 50+)', required: true },
      { item: 'Sun hat with brim', required: true },
      { item: 'Sunglasses (with strap)', required: false },
      { item: 'Rash guard for sun protection', required: false },
      { item: 'Change of dry clothes for after', required: true },
      { item: 'Extra water (you forget to drink on water)', required: true },
    ],
    notes: 'All Scouts must pass the BSA swim test before any open water activities. Scouts who cannot swim will be restricted to wading areas. No exceptions.',
  },
  {
    id: 'high_adventure',
    label: 'High Adventure',
    icon: Mountain,
    color: 'bg-purple-50 border-purple-300',
    activeColor: 'bg-purple-600',
    gear: [
      { item: 'All Regular Campout gear (see above)', required: true },
      { item: 'Trekking poles', required: true },
      { item: 'Hiking boots (broken in — no new boots!)', required: true },
      { item: 'Water filter + 2L water capacity minimum', required: true },
      { item: 'Navigation tools (topo map, compass)', required: true },
      { item: 'Emergency bivy / space blanket', required: true },
      { item: 'Whistle', required: true },
      { item: 'Fire starter kit', required: true },
      { item: 'Extra food (emergency 1-day supply)', required: true },
      { item: 'Altitude sickness medication (if applicable)', required: false },
      { item: 'Trekking gaiters', required: false },
      { item: 'Permit documents (troop will provide)', required: true },
    ],
    notes: 'High adventure trips (Philmont, Sea Base, Northern Tier) have strict gear lists from BSA. Your troop-specific list will be provided 60 days before departure.',
  },
];

const GRUBMASTER = {
  role: 'The Grubmaster is the Scout responsible for planning, shopping for, and preparing meals for their patrol on an outing.',
  budget: '$5 per person per meal',
  responsibilities: [
    'Create a meal menu 2+ weeks before the outing',
    'Get menu approved by the patrol and an ASM',
    'Check for allergies and dietary restrictions in the patrol (ASK every time)',
    'Shop for ingredients within the $5/person/meal budget',
    'Keep receipts — submit to patrol account for reimbursement',
    'Arrive early on outing day to set up cooking area',
    'Lead meal prep and cleanup with patrol assistance',
    'Store food properly to prevent wildlife encounters (bear bag/canister when required)',
  ],
  allergies: 'Before every outing, the Grubmaster MUST ask every patrol member and leader for food allergies, intolerances, or dietary restrictions. This is not optional. If in doubt, choose a menu that accommodates everyone.',
  storage: 'All food must be stored in airtight containers. On backcountry trips, food MUST be hung at least 10 feet off the ground and 4 feet from the trunk, or stored in a bear canister.',
};

const PATROL_BOX = [
  'Coleman 2-burner stove', 'Fuel canisters (2)', 'Large pot (12 qt)', 'Medium pot (6 qt)',
  'Cast iron skillet (12")', 'Cutting board', 'Chef\'s knife + sheath', 'Can opener',
  'Spatula', 'Ladle', 'Tongs', 'Mixing spoon', 'Whisk',
  'Paper plates (50ct)', 'Paper bowls (50ct)', 'Plastic utensils (50ct)', 'Aluminum foil',
  'Ziplock bags (gallon)', 'Dish soap + scrubber', 'Collapsible wash basin',
  'Trash bags (10)', 'Matches + lighter', 'Aluminum foil (heavy duty)',
];

export default function OutingPrep() {
  const [activeType, setActiveType] = useState('regular');
  const [activeTab, setActiveTab] = useState('packing');
  const current = OUTING_TYPES.find(t => t.id === activeType);

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Outing Prep Guides</h1>
          <p className="text-white/70 mt-2">Packing lists, Grubmaster guide, and patrol box inventory — everything you need before a campout.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Top Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'packing', label: 'Packing Lists', icon: Backpack },
            { id: 'grubmaster', label: 'Grubmaster Guide', icon: ChefHat },
            { id: 'patrolbox', label: 'Patrol Box Inventory', icon: Package },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === tab.id ? 'bg-[#1a2744] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-[#1a2744]'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Packing Lists */}
        {activeTab === 'packing' && (
          <div>
            {/* Outing type selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {OUTING_TYPES.map(type => (
                <button key={type.id} onClick={() => setActiveType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors border-2 ${activeType === type.id ? `${type.activeColor} text-white border-transparent` : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  <type.icon className="w-4 h-4" /> {type.label}
                </button>
              ))}
            </div>

            <div className={`rounded-xl border-2 p-6 ${current.color}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-lg ${current.activeColor} flex items-center justify-center`}>
                  <current.icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-[#1a2744] text-xl">{current.label} — Gear Checklist</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
                {current.gear.map((g, i) => (
                  <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg bg-white/70 ${g.required ? '' : 'opacity-70'}`}>
                    <div className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center ${g.required ? 'border-[#1a2744]' : 'border-gray-400'}`}>
                      {g.required && <div className="w-2 h-2 bg-[#1a2744] rounded-sm" />}
                    </div>
                    <span className={`text-sm ${g.required ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{g.item}</span>
                    {!g.required && <span className="text-xs text-gray-400 italic ml-auto shrink-0">optional</span>}
                  </div>
                ))}
              </div>

              {current.notes && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">{current.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grubmaster Guide */}
        {activeTab === 'grubmaster' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1a2744] text-xl">Grubmaster Guide</h2>
                  <p className="text-sm text-gray-500">Budget: <strong className="text-green-700">{GRUBMASTER.budget}</strong></p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-5 leading-relaxed">{GRUBMASTER.role}</p>
              <h3 className="font-bold text-[#1a2744] mb-3">Responsibilities (in order)</h3>
              <ol className="space-y-2">
                {GRUBMASTER.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#FFD700] text-[#1a2744] rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="text-gray-700 text-sm">{r}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Allergy Check — Non-Negotiable</h3>
              <p className="text-red-700 text-sm leading-relaxed">{GRUBMASTER.allergies}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-bold text-[#1a2744] mb-2">Food Storage Rules</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{GRUBMASTER.storage}</p>
            </div>
          </div>
        )}

        {/* Patrol Box */}
        {activeTab === 'patrolbox' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h2 className="font-bold text-[#1a2744] text-xl">Patrol Box Inventory</h2>
                <p className="text-sm text-gray-500">Items available in the troop patrol box — Grubmasters, check here before buying duplicates.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {PATROL_BOX.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-5 italic">* Inventory is maintained by the Equipment Coordinator. If an item is missing or damaged, notify a leader. Updated June 2026.</p>
          </div>
        )}
      </div>
    </div>
  );
}