import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FileText, Upload, X, Download, ExternalLink, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = [
  { id: 'all', label: 'All Documents' },
  { id: 'trip_docs', label: 'Trip Docs' },
  { id: 'health_safety', label: 'Health & Safety' },
  { id: 'advancement', label: 'Advancement' },
  { id: 'governance', label: 'Governance' },
  { id: 'fundraising', label: 'Fundraising' },
];

const CATEGORY_COLORS = {
  trip_docs: 'bg-blue-100 text-blue-700',
  health_safety: 'bg-green-100 text-green-700',
  advancement: 'bg-yellow-100 text-yellow-700',
  governance: 'bg-purple-100 text-purple-700',
  fundraising: 'bg-orange-100 text-orange-700',
};

function UploadModal({ onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef();
  const [form, setForm] = useState({ title: '', category: 'trip_docs', description: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim() || !file) {
      toast({ title: 'Please enter a title and select a file.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Document.create({ ...form, file_url });
    queryClient.invalidateQueries(['documents']);
    setUploading(false);
    toast({ title: 'Document uploaded!', description: form.title });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#1a2744] text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#1a2744]" /> Upload Document
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Title *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Philmont Packing List 2026" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Category *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Description (optional)</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Brief note about this document" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">File *</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#1a2744] transition-colors"
              onClick={() => fileRef.current.click()}
            >
              {file ? (
                <p className="text-sm text-[#1a2744] font-semibold">{file.name}</p>
              ) : (
                <div>
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-500">Click to select a file (PDF, Word, image)</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={e => setFile(e.target.files[0])} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={uploading} className="flex-1 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Documents() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const queryClient = useQueryClient();

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date', 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['documents']),
  });

  const filtered = activeCategory === 'all' ? documents : documents.filter(d => d.category === activeCategory);

  // BSA pinned quick links
  const BSA_LINKS = [
    { label: 'Blue Card (PDF)', url: 'https://filestore.scouting.org/filestore/pdf/34124.pdf', note: 'BSA Merit Badge Application' },
    { label: 'Annual Health Form (PDF)', url: 'https://filestore.scouting.org/filestore/HealthSafety/pdf/680-001_ABC.pdf', note: 'Parts A, B & C' },
    { label: 'All Merit Badge PDFs', url: 'https://www.scouting.org/skills/merit-badges/all/', note: 'Free from scouting.org' },
    { label: 'ScoutBook', url: 'https://www.scoutbook.scouting.org/', note: 'Advancement tracking' },
  ];

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Documents & Forms</h1>
            <p className="text-white/70 mt-1">Packing lists, health forms, advancement docs, and more.</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-[#FFD700] hover:bg-yellow-400 text-[#1a2744] px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* BSA Quick Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-[#1a2744] mb-4 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#FFD700]" /> BSA Pinned Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BSA_LINKS.map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group">
                <div className="w-9 h-9 bg-[#1a2744] rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#FFD700]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1a2744] text-sm group-hover:text-blue-700">{link.label}</p>
                  <p className="text-xs text-gray-400">{link.note}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 ml-auto" />
              </a>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                activeCategory === cat.id
                  ? 'bg-[#1a2744] text-white border-[#1a2744]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#1a2744]'
              }`}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({documents.filter(d => d.category === cat.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Document List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-400">No documents in this category yet.</p>
            <button onClick={() => setShowUpload(true)} className="mt-3 text-sm text-[#1a2744] underline">Upload the first one</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-3 group hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a2744] text-sm">{doc.title}</p>
                  {doc.description && <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>}
                  <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[doc.category] || 'bg-gray-100 text-gray-600'}`}>
                    {CATEGORIES.find(c => c.id === doc.category)?.label || doc.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Download">
                    <Download className="w-4 h-4 text-gray-600" />
                  </a>
                  <button onClick={() => deleteMutation.mutate(doc.id)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors" title="Delete">
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}