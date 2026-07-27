import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, ExternalLink, Loader2 } from 'lucide-react';

const ALBUM_URL = 'https://photos.app.goo.gl/TS2G7TYTRUtwFTzs5';

export default function PhotoGallery() {
  const [lightbox, setLightbox] = useState(null);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['album-photos'],
    queryFn: async () => {
      const res = await base44.functions.invoke('fetch-album-photos', {});
      return res.data?.photos || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Troop Photo Gallery</h1>
            <p className="text-white/70 mt-1">Memories from the trail.</p>
          </div>

        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#1a2744] animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-xl font-semibold">No photos found in album.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((url, idx) => (
              <div
                key={idx}
                className="break-inside-avoid group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setLightbox(url)}
              >
                <img
                  src={url}
                  alt={`Troop photo ${idx + 1}`}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white"><X className="w-8 h-8" /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox} alt="Troop photo" className="w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}