import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function FacebookSection() {
  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          <h2 className="font-bold text-[#1a2744] mb-2 flex items-center justify-center gap-2">
            <span className="text-blue-600 text-xl font-bold">f</span> Join Our Facebook Community
          </h2>
          <p className="text-gray-500 text-sm mb-4">Stay connected with Troop 1099 families, get updates, and see photos from outings.</p>
          <a
            href="https://www.facebook.com/groups/137754326238273/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1565d8] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Join the Troop 1099 Facebook Group
          </a>
        </div>
      </div>
    </section>
  );
}