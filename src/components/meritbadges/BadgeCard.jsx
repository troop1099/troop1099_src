import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

export default function BadgeCard({ badge, count, onClick, adminUnlocked, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const savedImg = localStorage.getItem(`badge_img_${badge.id}`) || badge.image_url;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirming) {
      onDelete(badge);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-white border-2 border-[#FFD700]/40 hover:border-[#FFD700] rounded-lg p-4 text-center hover:shadow-md transition-all group cursor-pointer"
    >
      {adminUnlocked && (
        <button
          onClick={handleDelete}
          title={confirming ? 'Click again to confirm' : 'Delete badge'}
          className={`absolute top-1 right-1 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            confirming
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
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
    </div>
  );
}