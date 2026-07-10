import React from 'react';
import { MapPin, Mail, Clock, Phone, ExternalLink } from 'lucide-react';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';
const TROOP_EMAIL = 'troop1099@bsa.org';

export default function Contact() {
  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <img src={LOGO} alt="Troop 1099" className="w-16 h-16 rounded-full object-contain bg-white p-1.5 shrink-0 hidden sm:block" />
          <div>
            <h1 className="text-3xl font-bold">Contact Troop 1099</h1>
            <p className="text-white/70 mt-1">Interested in joining or have a question? We'd love to hear from you.</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Email CTA */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-lg mb-3">Send Us a Message</h2>
              <p className="text-gray-600 text-sm mb-5">Have a question about joining, upcoming events, or anything else? Click below to compose an email — it'll open your email app ready to write.</p>
              <a
                href={`mailto:${TROOP_EMAIL}?subject=Inquiry from Troop 1099 Website`}
                className="w-full flex items-center justify-center gap-2 bg-[#1a2744] hover:bg-[#1a2744]/90 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                <Mail className="w-4 h-4" /> Email Troop 1099
              </a>
            </div>
          </div>

          {/* Info column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Meeting info */}
            <div className="bg-[#1a2744] text-white rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FFD700] mb-4">Visit a Meeting</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FFD700] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Every Monday</p>
                    <p className="text-white/70 text-xs">7:00 PM – 8:30 PM</p>
                    <p className="text-white/50 text-xs">Not held on school holidays</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FFD700] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Lanier United Methodist Church</p>
                    <p className="text-white/70 text-xs">Cumming, GA</p>
                    <a href="https://maps.google.com/?q=Lanier+United+Methodist+Church+Cumming+GA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#FFD700] text-xs mt-1 hover:underline">
                      View on Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Contact Info</p>
              <div className="space-y-3">
                <a href={`mailto:${TROOP_EMAIL}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-[#1a2744]/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#1a2744]" />
                  </div>
                  <p className="text-sm text-[#1a2744] font-medium">{TROOP_EMAIL}</p>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1a2744]/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#1a2744]" />
                  </div>
                  <p className="text-sm text-gray-700">(770) 555-1099</p>
                </div>
              </div>
            </div>

            {/* Join CTA */}
            <div className="bg-red-600 text-white rounded-xl p-5 text-center">
              <p className="font-bold text-lg mb-1">Ready to Join?</p>
              <p className="text-white/80 text-sm mb-4">Prospective scouts and families are always welcome. No RSVP needed — just show up!</p>
              <a href="/dues" className="block bg-white text-red-600 font-bold text-sm py-2.5 rounded-lg hover:bg-red-50 transition-colors">
                Register &amp; Pay Dues
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}