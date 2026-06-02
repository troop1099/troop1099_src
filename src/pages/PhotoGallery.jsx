import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, X, Trash2, Upload } from 'lucide-react';

const LOGO = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/21ffdd64d_Screenshot2026-06-01at100515PM.png';

function UploadModal({ onClose }) {
  const [form, setForm] = useState({ caption: '', uploaded_by: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.TroopPhoto.create({ image_url: file_url, caption: form.caption, uploaded_by: form.uploaded_by });
    queryClient.invalidateQueries(['photos']);
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg">Upload a Photo</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#1a2744] transition-colors"
            onClick={() => document.getElementById('photo-input').click()}
          >
            {preview ? (
              <img src={preview} className="max-h-48 mx-auto rounded object-cover" />
            ) : (
              <div className="text-gray-400">
                <Upload className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">Click to select a photo</p>
              </div>
            )}
            <input id="photo-input" type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Caption</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Describe the photo..." value={form.caption} onChange={e => setForm(f => ({...f, caption: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Who's uploading?" value={form.uploaded_by} onChange={e => setForm(f => ({...f, uploaded_by: e.target.value}))} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={!file || uploading} className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PhotoGallery() {
  const [showUpload, setShowUpload] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const queryClient = useQueryClient();

  const { data: photos = [] } = useQuery({
    queryKey: ['photos'],
    queryFn: () => base44.entities.TroopPhoto.list('-created_date', 200),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TroopPhoto.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['photos'])
  });

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="Troop 1099" className="w-14 h-14 rounded-full object-contain bg-white p-1" />
            <div>
              <h1 className="text-3xl font-bold">Troop Photo Gallery</h1>
              <p className="text-white/70 mt-1">Memories from the trail. Upload your troop photos!</p>
            </div>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-semibold text-sm"
          >
            <Plus className="w-4 h-4" /> Upload Photo
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {photos.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Upload className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold">No photos yet!</p>
            <p className="text-sm mt-2">Be the first to share a troop memory.</p>
            <button onClick={() => setShowUpload(true)} className="mt-6 bg-[#1a2744] text-white px-6 py-2.5 rounded font-semibold text-sm">
              Upload the First Photo
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map(photo => (
              <div key={photo.id} className="break-inside-avoid group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLightbox(photo)}>
                <img src={photo.image_url} alt={photo.caption || 'Troop photo'} className="w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3">
                  {photo.caption && <p className="text-sm text-gray-700 leading-snug">{photo.caption}</p>}
                  {photo.uploaded_by && <p className="text-xs text-gray-400 mt-1">— {photo.uploaded_by}</p>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(photo.id); }}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-red-100 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
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
            <img src={lightbox.image_url} alt={lightbox.caption} className="w-full max-h-[80vh] object-contain rounded-lg" />
            {lightbox.caption && <p className="text-white text-center mt-4 text-lg">{lightbox.caption}</p>}
            {lightbox.uploaded_by && <p className="text-white/60 text-center text-sm mt-1">— {lightbox.uploaded_by}</p>}
          </div>
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}