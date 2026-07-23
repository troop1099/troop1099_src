import React from 'react';
import { Link } from 'react-router-dom';
import { Tent, Award, Heart } from 'lucide-react';

const pillars = [
  {
    icon: Tent,
    title: 'Outdoor Adventures',
    description: 'Monthly campouts, hiking, canoeing, and summer camps in the great outdoors.',
    path: '/adventures',
  },
  {
    icon: Award,
    title: 'Advancement',
    description: 'Developing life skills and leadership on the path to the Eagle Rank.',
    path: '/advancement',
  },
  {
    icon: Heart,
    title: 'Service',
    description: 'Giving back to our community through conservation and service projects.',
    path: '/contact',
  },
];

export default function MissionSection() {
  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          Troop 1099 is proudly chartered by Lanier United Methodist Church. We meet every Monday night from 7:00 PM to 8:30 PM. We welcome youth and families from Cumming, Forsyth County, and all surrounding school districts and neighboring communities.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 rounded-full bg-[#1a2744]/10 flex items-center justify-center mx-auto mb-4">
              <p.icon className="w-7 h-7 text-[#1a2744]" />
            </div>
            <h3 className="font-heading font-semibold text-[#1a2744] text-lg mb-2">{p.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}