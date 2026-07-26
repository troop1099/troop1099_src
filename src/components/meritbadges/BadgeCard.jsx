import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function BadgeCard({ badge, count, onClick }) {
  const [imgError, setImgError] = useState(false);
  const savedImg = localStorage.getItem(`badge_img_${badge.id}`) || badge.image_url;

  return (
    <button
      onClick={onClick}
      className="bg-white border-2 border-[#FFD700]/40 hover:border-[#FFD700] rounded-lg p-4 text-center hover:shadow-md transition-all group"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-[#FFD700]/30 bg-gray-100 flex items-center justify-center">
        {savedImg && !imgError ? (
          <img
            src={savedImg}
            alt={badge.name}
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
          />
        ) : (
          <Star className="w-6 h-6 text-[#FFD700]" />
        )}
      </div>
      <p className="font-semibold text-[#1a2744] text-xs leading-tight group-hover:text-[#1a2744]">{badge.name}</p>
      <p className="text-gray-400 text-xs mt-1">{count} Counselor{count !== 1 ? 's' : ''}</p>
    </button>
  );
}