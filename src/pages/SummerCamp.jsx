import React, { useState } from 'react';
import { ExternalLink, Calendar, DollarSign, MapPin, CheckCircle, Star, Sun, Mail, Phone, Package, AlertTriangle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHAT_TO_EXPECT = [
'Merit badge classes every morning — choose 3–5 badges for the week',
'Patrol cooking in the campsite — Grubmaster rotation',
'Evening campfires, skits, and troop ceremonies',
'Free swim, boating, shooting sports, and COPE/climbing tower',
'Eagle-required merit badges available (Cooking, Camping, Swimming, etc.)',
'Staff-led programming keeps Scouts busy from 7am to 10pm',
'Scouts sleep in patrol tents at the troop campsite',
'Family Night typically Wednesday or Thursday evening'];


const PACKING_HIGHLIGHTS = [
{ item: 'Class A uniform — wear on travel days', required: true },
{ item: '4–5 Class B T-shirts for activity days', required: true },
{ item: 'Sleeping bag and pillow', required: true },
{ item: 'Footlocker — rolling plastic preferred', required: true },
{ item: 'Closed-toe shoes', required: true },
{ item: 'Water shoes or Crocs', required: true },
{ item: 'Rain gear', required: true },
{ item: 'Sunscreen', required: true },
{ item: 'Bug spray', required: true },
{ item: 'Water bottle — 32 oz or larger', required: true },
{ item: 'Spending money for the Trading Post — approximately $30–$50', required: false },
{ item: 'Completed Health Form Parts A, B, and C — NO FORM = NO CAMP', required: true },
{ item: 'Prescription medications in their original containers', required: true },
{ item: 'Label all personal belongings with the Scout\u2019s name', required: true }];


const REGISTRATION_STEPS = [
{ step: 1, text: 'Tell the Scoutmaster by the sign-up deadline (usually April) that your Scout is attending.' },
{ step: 2, text: 'Pay the summer camp fee via the Dues page or by check to the troop treasurer. Payment plans available — ask the Scoutmaster.' },
{ step: 3, text: 'Complete the BSA Annual Health & Medical Record (Parts A, B, and C). Part C requires a doctor\'s signature within 12 months of camp.' },
{ step: 4, text: 'Submit TWO copies of health form + both sides of insurance card to the Scoutmaster at least 2 weeks before departure.' },
{ step: 5, text: 'Take the BSA Swim Test at the designated troop pre-camp meeting (Grand Cascades pool). Everyone attending — scouts AND adults — must pass.' },
{ step: 6, text: 'Choose your merit badge classes — the Scoutmaster will share the course catalog before registration opens.' }];


export default function SummerCamp() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">Annual Event</p>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sun className="w-8 h-8 text-[#FFD700]" /> Summer Camp — Camp Rainey Mountain
          </h1>
          <p className="text-white/70 mt-2">Clayton, GA · Week 2 of Summer Session · The highlight of every Scout's year.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {[
          { id: 'overview', label: 'Overview' },
          { id: 'registration', label: 'Registration' },
          { id: 'departure', label: 'Travel & Logistics' },
          { id: 'packing', label: 'Packing' },
          { id: 'meds', label: 'Medications' }].
          map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#1a2744] text-[#1a2744]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' &&
        <>
            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
                <Calendar className="w-8 h-8 text-[#1a2744] mx-auto mb-2" />
                <p className="font-bold text-[#1a2744] text-lg">When</p>
                <p className="text-gray-700 font-semibold mt-1">Week 2 of Summer Session</p>
                <p className="text-gray-500 text-sm mt-1">Typically depart Sunday, return Saturday (6 nights)</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
                <MapPin className="w-8 h-8 text-[#1a2744] mx-auto mb-2" />
                <p className="font-bold text-[#1a2744] text-lg">Where</p>
                <p className="text-gray-700 font-semibold mt-1">Camp Rainey Mountain</p>
                <p className="text-gray-500 text-sm mt-1">1494 Rainey Mountain Rd, Clayton, GA 30525</p>
                <a href="https://www.northfulton.org/camping" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 justify-center mt-1">
                  Council camping page <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-bold text-[#1a2744] text-lg">Cost</p>
                <p className="text-gray-700 font-semibold mt-1">~$375 per Scout</p>
                <p className="text-gray-500 text-sm mt-1">Adults: ~$160 full week / ~$80 half week</p>
                <Link to="/dues" className="text-xs text-blue-600 hover:underline mt-1 block">Pay via Dues page</Link>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-xl mb-4">What to Expect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {WHAT_TO_EXPECT.map((item, i) =>
              <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
              )}
              </div>
            </div>

            {/* Merit Badge Courses */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-xl mb-3">Merit Badge Class Selection</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Review the available course schedule with your Scout before registering. Some Eagle-required merit badges (Personal Management, Family Life) may only be earned with In-Troop counselors — the Scoutmaster will clarify which badges are available at camp each year.
              </p>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-sm text-yellow-800"><strong>Course schedule requests are typically due by March 1st.</strong> Register early — popular badges fill up quickly.</p>
              </div>
            </div>

            {/* Adults */}
            <div className="bg-[#1a2744] text-white rounded-xl p-6">
              <h2 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFD700]" /> Adults Needed
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Adults and adult leaders are needed to attend camp to help Scouts (especially new Scouts) with schedules, locations, and activities. The only way our troop functions is through volunteers like you. Please sign up as soon as possible.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-bold text-[#FFD700]">Full Week</p>
                  <p className="text-white/80 text-sm">The troop will provide cost information.</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-bold text-[#FFD700]">Half  Week</p>
                  <p className="text-white/80 text-sm">The troop will provide cost information.</p>
                </div>
              </div>
            </div>

            {/* Scholarships */}
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5">
              <p className="font-bold text-[#1a2744] mb-1">💛 Scholarship Assistance Available</p>
              <p className="text-gray-700 text-sm">We do not want any Scout to miss summer camp due to cost. Financial assistance is available — please speak confidentially with the Scoutmaster well before the payment deadline.</p>
            </div>
          </>
        }

        {/* REGISTRATION TAB */}
        {activeTab === 'registration' &&
        <>
            <div className="bg-[#1a2744] text-white rounded-xl p-6">
              <h2 className="font-bold text-xl mb-5 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFD700]" /> How to Register
              </h2>
              <ol className="space-y-4">
                {REGISTRATION_STEPS.map((s) =>
              <li key={s.step} className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-[#FFD700] text-[#1a2744] rounded-full flex items-center justify-center font-bold text-sm shrink-0">{s.step}</span>
                    <span className="text-white/85 text-sm leading-relaxed">{s.text}</span>
                  </li>
              )}
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

            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
              <div className="flex gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-700 text-lg">NO MEDICAL FORMS = NO SUMMER CAMP = NO REFUNDS</p>
                  <p className="text-red-700 text-sm mt-1">All medical forms are due no later than May 15th. Please plan physicals accordingly — Part C requires a doctor's signature within 12 months of camp start date.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-lg mb-4">Medical Form Requirements</h2>
              <p className="text-gray-600 text-sm mb-3">Submit <strong>TWO copies</strong> of each of the following:</p>
              <ul className="space-y-2">
                {[
              'All pages of BSA Annual Health & Medical Record (Parts A, B pg 1, B pg 2, and C)',
              'Both sides of health insurance card (front and back)',
              'Certificate of Immunization (Scouts only)'].
              map((item, i) =>
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
              )}
              </ul>
              <p className="text-sm text-gray-600 mt-4 font-semibold">Also make sure:</p>
              <ul className="space-y-1 mt-2">
                {[
              'Doctor has signed, dated, and office info is filled out',
              'Tetanus shot date is filled in for adults (no full record needed, just dates)',
              'All pages are properly filled out'].
              map((item, i) =>
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-[#1a2744] rounded-full mt-1.5 shrink-0" />{item}
                  </li>
              )}
              </ul>
            </div>

            {/* Payment plan */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-lg mb-3">Payment Options</h2>
              <p className="text-gray-600 text-sm mb-4">You may pay in full or in 2 installments:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
              { label: '1st Payment', due: 'Due February 1' },
              { label: '2nd Payment', due: 'Due March 1' }].
              map((p) =>
              <div key={p.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="font-bold text-[#1a2744] text-sm">{p.label}</p>
                    <p className="text-gray-500 text-xs mt-1">{p.due}</p>
                  </div>
              )}
              </div>
              <p className="text-xs text-gray-400 mt-3">If your plans change and your Scout cannot attend, we will refund all fees paid to that point. Some classes require additional activity fees.</p>
            </div>
          </>
        }

        {/* DEPARTURE TAB */}
        {activeTab === 'departure' &&
        <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-xl mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FFD700]" /> Departure Day
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-bold text-[#1a2744]">Meet-Up Location</p>
                  <p className="text-gray-700 text-sm mt-1">Lanier United Methodist Church</p>
                  <a href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2">
                    Get Directions <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-bold text-[#1a2744] text-sm">Arrival Time</p>
                    <p className="text-gray-600 text-sm mt-1">9:00 AM — The check-in process takes time. Please be prompt.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-bold text-[#1a2744] text-sm">Uniform</p>
                    <p className="text-gray-600 text-sm mt-1">Full Class A (with Class B undershirt) required for travel.</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-bold text-[#1a2744] text-sm mb-2">Bring on Departure Day</p>
                  <ul className="space-y-1">
                    {[
                  'Bring money to purchase food when the troop stops to eat on the way',
                  'All medications in original packaging — hand delivered to a leader',
                  'Any missing medical forms (will be collected BEFORE boarding)'].
                  map((item, i) =>
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{item}
                      </li>
                  )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-xl mb-5 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#1a2744]" /> While Your Scout is at Camp
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-[#1a2744] mb-2">📬 Sending Mail</p>
                  <p className="text-gray-600 text-sm mb-2">Send cards or care packages to:</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm text-gray-700">
                    <p>[Scout's Name]</p>
                    <p>Troop 1099</p>
                    <p>1494 Rainey Mountain Rd</p>
                    <p>Clayton, GA 30525</p>
                  </div>
                  <p className="text-xs text-orange-600 mt-2 font-semibold">⚠ Do not send mail after Tuesday — it may not arrive before the troop leaves Saturday.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-bold text-[#1a2744] mb-1">📵 Cell Coverage</p>
                  <p className="text-red-700 text-sm">There is very limited or no cell coverage at Camp Rainey Mountain. You will NOT be able to reach your Scout by phone, text, or email. Leaders will contact you immediately in the event of any emergency.</p>
                </div>
              </div>
            </div>
          </>
        }

        {/* PACKING TAB */}
        {activeTab === 'packing' &&
        <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-xl mb-2">Summer Camp Packing List</h2>
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <p className="text-sm text-gray-500">See also the full <Link to="/camping-checklist" className="text-[#1a2744] underline">Regular Campout packing list</Link>. These are summer camp specifics:</p>
                <a href="https://docs.google.com/spreadsheets/d/1WylZyykyC7GjcIviTxCHcJN94XiRTcQb4oMx3R0ZrkI/edit?gid=0#gid=0" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1a2744] border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 shrink-0">
                  <Download className="w-3.5 h-3.5" /> Download Full Packing List (Google Sheet)
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PACKING_HIGHLIGHTS.map((item, i) =>
              <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg ${item.required ? 'bg-gray-50' : 'bg-gray-50 opacity-70'}`}>
                    <div className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 ${item.required ? 'border-[#1a2744]' : 'border-gray-400'}`}>
                      {item.required && <div className="w-full h-full bg-[#1a2744] rounded-sm scale-75" />}
                    </div>
                    <span className={`text-sm ${item.required ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{item.item}</span>
                    {!item.required && <span className="text-xs text-gray-400 italic ml-auto shrink-0">optional</span>}
                  </div>
              )}
              </div>
            </div>

            <div className="bg-[#1a2744] text-white rounded-xl p-5">
              <p className="font-bold text-[#FFD700] text-lg mb-2">🏷 LABEL EVERYTHING</p>
              <p className="text-white/80 text-sm">Write your name on everything — especially items you carry with you during the day (water bottles, headlamps, etc.). Every year scouts lose items, and labels help us reunite lost items with their owners.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-lg mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" /> Footlocker
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                You will need a footlocker to store your clothes and personal items during the week. The most common type scouts use is the <strong>Contico Storage Locker with Wheels</strong> (~$32 at Walmart). Any similar-sized plastic rolling footlocker works — plastic is preferred since it may get wet and dirty during the week.
              </p>
            </div>
          </>
        }

        {/* MEDICATIONS TAB */}
        {activeTab === 'meds' &&
        <>
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
              <p className="font-bold text-red-700 text-lg mb-1">Important: Read Before Camp</p>
              <p className="text-red-700 text-sm">All medications must be in their original labeled containers and handed directly to an adult leader by a parent before boarding. Scouts are NOT allowed to carry or possess prescription medicines (except EpiPens and fast-acting inhalers).</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-xl mb-4">What to Bring</h2>
              <ul className="space-y-3">
                {[
              { title: 'All regularly prescribed medications', desc: 'If your Scout takes it daily, do not think they can "get by" without it. This is a busy week with long days — skipping medication is not a good idea.' },
              { title: 'Correct quantity + 2 backup doses', desc: 'If it\'s a daily pill, bring 8 (6 daily + 2 backup). It can be dropped somewhere you won\'t want to retrieve it from. Medication must cover Sunday Lunch through Saturday morning Breakfast.' },
              { title: 'All medications in original labeled containers', desc: 'No exceptions. Pill organizers are not acceptable for prescription medications.' },
              { title: 'Cold-storage medications', desc: 'We will have an ice chest, and the camp medical station has a secured refrigerator. Note this on your medication form.' },
              { title: 'On-demand / as-needed medications', desc: 'Include EpiPens, inhalers, Benadryl, etc. They will be checked in and administered by leaders as needed, with every administration logged.' }].
              map((item, i) =>
              <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#1a2744] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <div>
                      <p className="font-bold text-[#1a2744] text-sm">{item.title}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </li>
              )}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="font-bold text-[#1a2744] mb-2">🩺 Medical Staff at Camp</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Camp Rainey Mountain has a fully staffed medical station with a registered nurse and/or physician on-site. All Scout leaders are here to ensure your Scout's regular medication routine is properly maintained during camp. Our leaders are experienced parents who care about your kids — and they're supported by an excellent professional medical staff.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="font-bold text-[#1a2744] mb-2">Medication Storage Process</p>
              <ul className="space-y-2">
                {[
              'Each Scout\'s medication is placed in a labeled Ziploc bag by patrol leaders',
              'All medications are stored in a locked "med box" with a medical administration log',
              'EpiPens and fast-acting inhalers (e.g., Albuterol) should be carried in the Scout\'s backpack or satchel at all times',
              'Daily inhalers must be checked in — only fast-acting emergency inhalers stay with the Scout'].
              map((item, i) =>
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{item}
                  </li>
              )}
              </ul>
            </div>
          </>
        }
      </div>
    </div>);

}