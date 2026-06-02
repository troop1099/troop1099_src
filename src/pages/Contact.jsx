import React, { useState } from 'react';
import { MapPin, Mail, Clock, Send, Phone, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill out all fields', variant: 'destructive' });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: 'Message sent!', description: "We'll get back to you soon." });
    setForm({ name: '', email: '', message: '' });
    setSending(false);
  };

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
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a2744] text-lg mb-5">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
                      value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
                      value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Message</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744] resize-none"
                    rows={5}
                    value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    placeholder="Tell us about your interest in Troop 1099..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a2744] hover:bg-[#1a2744]/90 text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors"
                >
                  {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1a2744]/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#1a2744]" />
                  </div>
                  <p className="text-sm text-gray-700">troop1099@bsa.org</p>
                </div>
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