import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const sections = [
  {
    title: 'Camping Trips / Troop Outings',
    content: `Registration – Camping trip registration, payment and permission slips are required to be turned into the troop scribe at the troop meeting prior to the camping trip. If the scout fails to turn in the paper work and payment, he will not be allowed to attend the outing. The patrols plan and purchase food based on the number of scouts that have registered for the camping trip.

Cancellation Fee – If a scout has registered and paid for a camping trip, he must notify the Scoutmaster by the Monday prior to the Camping Trip to receive a credit or refund. The registration fee for a camping trip will not be refunded to a scout that cancels after the Monday prior to the camping trip.

Activity Fee – There are activity fees associated with some camping trips such as rock climbing or boat rentals. These fees must be paid along with the camping trip registration. The activity fee will be refundable only if the troop is not required to pay for the scout that has cancelled.

Outing Food – The overall outing fee will include food expenses for the troop. For outings where meals are cooked by patrol, individual patrol members will be assigned to purchase the food based on the patrol meal planning document. Food expenses will be reimbursed by the troop, by submitting the receipts and outing meal planning document to the troop treasurer.

Parent Participation – Fathers that attend a camping must be a registered BSA leader and must complete the Safeguarding Youth Training Certificate Course prior to attending the camping trip. This provision is relaxed for participation in the November Family outing. Females are not allowed to attend camping trips. This provision does not include the November Family outing where all family members are invited to attend the dinner but are not allowed to stay overnight.

Leader Camping Fees – Leader will not be required to pay the registration fee but, must still sign up for the camping trip at the troop meeting prior to the camping trip. Food is purchased for the number of leaders that have signed up for the camping trip. The leader will be responsible for any activity fees.`
  },
  {
    title: 'Summer Camp',
    content: `Summer Camp Fees: Summer camp fees will normally be divided into three equal payments. The schedule for the payment will vary depending on the camp the troop is attending. Merit Badge fees are the responsibility of the individual scout and should be included in the final payment.

Summer Camp Bus: The troop will rent a bus to transport scouts to and from summer camp. Fees related to the bus rental are incorporated into the Summer Camp fee whether the scout rides the bus or not.

Required Training: Parents attending summer camp must be a registered BSA leader and must complete the required training courses (Safeguarding Youth Training, Weather Hazard, Safe Swim Defense, Safety Afloat, Fast Start: Boy Scouting).

Leader Fees: Adult leaders are required to pay any associated summer camp fees prior to attending summer camp.`
  },
  {
    title: 'Annual Dues / Re-chartering Process',
    content: `Annual Dues: Current Scouts are required to pay the troop's annual dues in the month of January. Failure to pay dues by the end of January may prevent scouts from attending trips and activities. Dues are currently $135 per scout (last updated Dec 2020).

Boys Life Registration: The current policy of the troop is to purchase one (1) subscription of Boys Life per household. The subscription will be renewed in the name of the oldest scout in the multi-scout household.

Leader Fees: Adult leaders are not required to pay the annual registration fee. The troop will pay this for the adult leaders (All adults must complete the Safeguarding Youth Training Certificate Course every 2 years to be eligible for inclusion in the re-charter).

Crossover Scouts Fees/Dues: Annual dues for scouts crossing over from Cub Scouts will be $65 as their BSA membership and Boys Life have already been paid.

New Scout Fees: New Scouts joining the troop that have not crossed over from Cub Scouts or transferred from an existing troop, will be required to pay the full troop dues ($65) and pro-rated BSA dues ($5 per month).`
  },
  {
    title: 'General Items',
    content: `Class B T-Shirt Fee: The troop sells the Class B T-Shirts at cost.

Class A Uniform: All scouts and adult leaders are required to purchase and wear the full Class A uniform to all scout meetings (shirt, pants, belt, and socks). Class A uniforms are also worn to and from all camping trips.

Troop Meeting: Troop meetings are held on Monday night starting at 7:00 pm and ending at 8:30 pm. Troop meetings are not held on general holidays or school holidays. Any changes to the Troop meeting night and time must be approved by a majority of the Troop Committee.

Patrol Leaders Council (PLC) Meetings: PLC meetings are held on the Monday following an outing starting at 7:00 pm and ending no later than 8:30 pm. The PLC is primarily a meeting between the Scout Leadership Team and the Scoutmaster.

Troop Committee: Parents of all active and former scouts are invited to participate in the troop committee. All committee members are required to take the Safeguarding Youth Training Certificate Course and Troop Committee Training which are available online. The Troop Committee will meet a minimum of twice per year.`
  },
  {
    title: 'Merit Badges',
    content: `Blue cards, signed by the Scoutmaster, are required prior to beginning working on any merit badge.

It is expected that the scout review the merit badge requirements before going to the Scoutmaster for a blue card.

The troop policy for Eagle Required merit badges is blue cards will only be issued for: troop merit badge counselors, District merit badge counselors, summer camp programs, and Council or District sponsored and run events (like the Etowah District Advance-a-Rama). The troop will not accept Eagle required merit badges obtained from out-of-council merit badge clinics.

Personal Management and Family Life merit badges may ONLY be earned with in-troop merit badge counselors.

Pre-requisites should be completed prior to attending any MB classes if possible.`
  },
  {
    title: 'Training',
    content: `Adult Leaders are required to complete the Safeguarding Youth Training Certificate Course once every two years to be considered an active leader. The council will not allow a leader to be included in the re-charter process if they have not met the Youth Protection training requirement.

Parents attending summer camp must be a registered BSA leader and must complete the required training courses (Safeguarding Youth Training, Weather Hazard, Safe Swim Defense, Safety Afloat, Fast Start: Boy Scouting).

Leaders are encouraged to take leader specific training such as ITOLS and Scoutmaster and Assistant Scoutmaster training.

Leaders are encouraged to take advanced training such as Wilderness First Aid, Wood Badge and training available at the University of Scouting.`
  },
  {
    title: 'Term Limits',
    content: `Scoutmaster Term Limit: The Scoutmaster will serve a two year term. The candidate must have completed required training including Scoutmaster & Asst. Scoutmaster Leader Specific Training (SALT) and Introduction to Outdoor Skills Leader Training (ITOLS). The candidate must have completed one full year as an adult leader with Troop 1099 prior to being considered for this position. The Scoutmaster may not serve two consecutive terms.

Committee Chairman: The Committee Chairman will serve a two year term. Requirements mirror those of the Scoutmaster. The Committee Chairman may not serve two consecutive terms.

Alternating Terms: The Scoutmaster and the Committee Chairman terms will expire on alternating years.

Term Start and End Dates: The new Scoutmaster or Committee Chairman will officially begin their term on January 1st.`
  },
];

function Section({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded bg-white">
      <button
        className="w-full flex items-center gap-2 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <ChevronDown className="w-4 h-4 text-[#1a2744] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[#1a2744] shrink-0" />}
        <span className="font-semibold text-[#1a2744]">{title}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="mt-4 space-y-3">
            {content.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-700 text-sm leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TroopGuidelines() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold">Troop Guidelines</h1>
          <p className="text-white/70 mt-2">Revised 2020. Click each section to expand.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-2">
        {sections.map(s => <Section key={s.title} title={s.title} content={s.content} />)}
      </div>
    </div>
  );
}