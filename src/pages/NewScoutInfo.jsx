import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Mail } from 'lucide-react';

export default function NewScoutInfo() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">New Scout Info</h1>
          <p className="text-white/70 mt-2">Welcome to Troop 1099. Here's everything new scouts and families need to know.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Visiting */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1a2744] mb-3">Visiting the Troop</h2>
          <p className="text-gray-700 leading-relaxed">
            We welcome visitors to the troop that are in the final year of Cub Scouts, those that may have recently moved into the area and are looking for a new Troop home, as well as those that are brand new to scouting altogether.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            To visit Troop 1099, please <Link to="/contact" className="text-blue-600 hover:underline">contact us</Link> and let us know when you would like to visit.
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
            <p className="font-semibold text-[#1a2744]">Meeting Location</p>
            <p className="text-gray-700 mt-1">Lanier United Methodist Church — 7:00 PM to 8:30 PM every Monday throughout the year.</p>
            <p className="text-gray-500 text-sm mt-1">Note: Meetings are not held on school holidays.</p>
            <a
              href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline"
            >
              📍 View on Google Maps <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* After Crossover */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1a2744] mb-3">After Crossover</h2>
          <p className="text-gray-700 leading-relaxed">
            After crossing into Troop 1099, new scouts will be placed in their own patrol. The patrol is the basic building block of the troop. The patrol will elect its own leader, select a patrol name and will be assigned an older scout, called the <strong>Troop Guide</strong>. The Troop Guide's job is to serve the needs of the new patrol and help them with the transition to Boy Scouting.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            An Assistant Scoutmaster will also be assigned to this patrol to make sure the boy's advancement and scouting experience is going as planned.
          </p>
        </div>

        {/* Getting Connected */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1a2744] mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#1a2744]" /> Getting Connected
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Troop 1099 communicates primarily through email. All notices and information are sent out through our Google Group.
          </p>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="font-semibold text-[#1a2744] mb-2">To Subscribe to the Google Group:</p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm">
              <li>Create a Google account if you do not already have one (you may create one with your current email address).</li>
              <li>Navigate to the Google Group link (contact the Scoutmaster for the current link).</li>
              <li>Click the <strong>"Apply for membership"</strong> link at the top of the page.</li>
            </ol>
            <p className="text-gray-500 text-xs mt-3">NOTE: To subscribe, you will need a Google account. For those that do not have one and wish to use your current (non-gmail) email address, you can create a Google account with your existing email.</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#1a2744] rounded-lg p-6 text-white">
          <h2 className="font-bold text-lg mb-4">Quick Links for New Scouts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Upcoming Events', path: '/events' },
              { label: 'Trail to Eagle', path: '/advancement' },
              { label: 'Merit Badge Library', path: '/merit-badges' },
              { label: 'Troop Guidelines', path: '/guidelines' },
              { label: 'Contact Us', path: '/contact' },
            ].map(link => (
              <Link key={link.path} to={link.path} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded px-4 py-2 text-sm transition-colors">
                <ArrowRight className="w-4 h-4 text-[#FFD700]" /> {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}