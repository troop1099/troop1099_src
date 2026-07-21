import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, ExternalLink } from 'lucide-react';

const aboutSections = [
  {
    title: 'We Meet Outdoors Year-Round',
    content: `Meetings are held on the grounds of Lanier United Methodist Church from 7pm to 8:30pm every Monday throughout the year, but are not held on school holidays.`,
    hasMap: true,
  },
  {
    title: 'We are a Boy Led Troop',
    content: `Meetings and outings are planned and run by the youth leadership. Adults are here to enable and empower the boys through guidance where needed as well as to ensure a safe scouting experience.\n\nA Patrol Leadership Council (PLC) meeting is held the Monday after each monthly outing where the youth leadership plan the upcoming meetings, outings and activities as well as makes decisions regarding troop operations.`,
  },
  {
    title: 'Every Boy Advances at his Own Pace',
    content: `Every scout advances at his own pace. We offer plenty of advancement opportunities at weekly meetings, on outings, and at summer camp. Scouts who participate regularly and take initiative can make steady progress toward achieving the First Class rank.\n\nMost merit badges are earned at summer camp and district merit badge clinics. Additionally, we have troop merit badge counselors for over 50 different merit badges. Troop 1099 holds a Court of Honor two or three times each year.`,
  },
  {
    title: 'We Attend Summer Camp Each June',
    content: `Troop 1099 attends summer camp every year, usually in early to mid-June. The Scouts spend a full week enjoying nature, swimming, practicing survival skills, cooking cobblers, earning merit badges, and getting to know other troop members.\n\nSummer camp is especially important for new scouts/crossovers as this is where they really get a chance to bond with the other troop members and kick-start their adventures in scouting.`,
  },
  {
    title: 'We Have an Active Outdoor Program',
    content: `In addition to meeting outside each week. We go on outings every month, weather permitting.\n\nSome of our typical outings include hiking, backpacking, orienteering, whitewater rafting, canoeing, fishing, rock climbing, snow tubing, mountain biking, geocaching, and more.\n\nMost outing destinations are in the North Georgia mountains, Tennessee or North Carolina. Most destinations are within a 2 hour drive. Usually 2 nights, Fri 6pm to Sun 12pm. We camp rain or shine, hot or cold. Boys plan, buy and cook meals by patrol. Registered adults may participate.\n\nAdults and scouts travel to and from each outing as a group.`,
  },
  {
    title: 'We Give Thanks',
    content: `In mid-November we host a Thanksgiving outing at Scoutland on Lake Lanier. Family members and guests are welcome to join us for a full Thanksgiving feast and a campfire program Saturday evening.\n\nWe also invite Arrow of Light scouts and their dads to join us and get to know our troop on this traditional yearly troop outing.`,
  },
  {
    title: 'We Raise Funds Selling Pinestraw',
    content: `Every March, Troop 1099 holds a pine straw fundraiser in neighboring communities. This fundraiser usually brings in enough funds to support the troop's operating expenses and help cover troop outing costs throughout the year.`,
  },
  {
    title: 'We Serve Others',
    content: `Troop 1099 is active in the community through service projects of all kinds. We participate in multiple Eagle Service Projects for Scouts in our troop as well as various other service opportunities that arise throughout the year.\n\nEach year, Troop 1099 participates in July 4th Spirit Day, Church Sundays, Rivers Alive, and other community-service activities.`,
  },
  {
    title: 'We Believe Parental Involvement is Key',
    content: `Parental involvement is critical to the success of the scouting program. We encourage adults to get involved with the troop as Assistant Scoutmasters, Committee Members, and Merit Badge Counselors.\n\nRegistered Adults can help drive on outings, assist with advancement activities during troop meetings, and serve as Assistant Scoutmasters.\n\nTo get started as an adult leader, just fill out an Adult Leader Application and take the Safeguarding Youth Training Certificate Course online. All leaders must have a class A uniform in order to go on outings or attend summer camp.`,
  },
  {
    title: 'We Try to Keep Scouting Affordable for Everyone',
    content: `Annual troop dues are $135, and normal outing fees are $30. Backpacking trips and summer camp may have different costs. Please look out for troop communications regarding upcoming fees and payment instructions. Scouts must purchase their own Class A uniform and Scout Handbook. Contact the Scoutmaster for information about purchasing Class B shirts and paying outing fees.\n\nThe troop provides: tents, lanterns, stoves, patrol cooking gear, dutch ovens, clean drinking water. Scouts must provide their own personal camping gear (sleeping bags/pads, backpacks, etc).\n\nBecause we do not want any boy to miss out on scouting due to financial reasons, scholarships are available. Please see the Scoutmaster for details.`,
  },
];

function Section({ title, content, hasMap }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded bg-white">
      <button className="w-full flex items-center gap-2 px-5 py-4 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(o => !o)}>
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
          {hasMap && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1a2744]" />
                <p className="font-semibold text-[#1a2744] text-sm">Lanier United Methodist Church, Cumming, GA</p>
              </div>
              <a href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-blue-600 text-sm hover:underline">
                View on Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function About() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold">About Troop 1099</h1>
          <p className="text-white/70 mt-2">BSA Troop 1099 — Cumming, GA. Part of the Northeast Georgia Council. Chartered 2005.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-2">
        {aboutSections.map(s => <Section key={s.title} title={s.title} content={s.content} hasMap={s.hasMap} />)}
      </div>
    </div>
  );
}