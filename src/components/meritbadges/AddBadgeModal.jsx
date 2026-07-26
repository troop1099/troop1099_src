import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Loader2, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { validateImageUrl } from '@/lib/meritBadgeUtils';

export default function AddBadgeModal({ onClose, onSaved, existingUrls }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    bsa_url: '',
    name: '',
    image_url: '',
    description: '',
    requirements: '',
    eagle_required: false,
  });
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleFetch = async () => {
    if (!form.bsa_url.trim()) {
      toast({ title: 'Please enter the BSA link first', variant: 'destructive' });
      return;
    }
    setFetching(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Go to this BSA Scouting merit badge page: ${form.bsa_url}\n\nExtract the following:\n1. The exact merit badge name\n2. A 1-2 sentence description of the badge\n3. The full list of official requirements (one per line)\n4. The URL of the badge image if visible on the page\n5. Is this badge listed as "Eagle required" on the page? Set eagle_required to true ONLY if the page explicitly says it is Eagle required.`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            requirements: { type: 'array', items: { type: 'string' } },
            image_url: { type: 'string' },
            eagle_required: { type: 'boolean' }
          }
        }
      });
      if (result.name) setForm(f => ({ ...f, name: result.name }));
      if (result.description) setForm(f => ({ ...f, description: result.description }));
      if (result.requirements) setForm(f => ({ ...f, requirements: result.requirements.join('\n') }));
      if (result.image_url) setForm(f => ({ ...f, image_url: result.image_url }));
      if (typeof result.eagle_required === 'boolean') setForm(f => ({ ...f, eagle_required: result.eagle_required }));
      toast({ title: 'Data fetched from BSA page', description: 'Review and edit before saving.' });
    } catch (err) {
      toast({ title: 'Could not fetch automatically', description: 'Please enter the details manually.', variant: 'destructive' });
    }
    setFetching(false);
  };

  const handleSave = async () => {
    if (!form.bsa_url.trim()) {
      toast({ title: 'BSA link is required', variant: 'destructive' });
      return;
    }
    if (!form.name.trim()) {
      toast({ title: 'Badge name is required', variant: 'destructive' });
      return;
    }
    if (existingUrls?.includes(form.bsa_url.trim())) {
      toast({ title: 'This merit badge has already been added.' });
      return;
    }
    setSaving(true);
    try {
      const existing = await base44.entities.MeritBadge.filter({ bsa_url: form.bsa_url.trim() });
      if (existing.length > 0) {
        toast({ title: 'This merit badge has already been added.' });
        setSaving(false);
        return;
      }
      const reqArray = form.requirements
        .split('\n')
        .map(r => r.trim())
        .filter(r => r);
      let imageUrl = form.image_url.trim() || null;
      if (imageUrl) {
        const valid = await validateImageUrl(imageUrl);
        if (!valid) imageUrl = null;
      }
      await base44.entities.MeritBadge.create({
        name: form.name.trim(),
        bsa_url: form.bsa_url.trim(),
        image_url: imageUrl,
        description: form.description.trim(),
        requirements: JSON.stringify(reqArray),
        eagle_required: form.eagle_required,
      });
      onSaved?.();
      toast({ title: 'Merit badge added!', description: `${form.name} has been added to the library.` });
      onClose();
    } catch (err) {
      toast({ title: 'Failed to save', description: err?.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#1a2744] text-lg">Add a New Merit Badge</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Official BSA Merit Badge Link *</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                value={form.bsa_url}
                onChange={e => setForm(f => ({ ...f, bsa_url: e.target.value }))}
                placeholder="https://www.scouting.org/merit-badges/..."
              />
              <button
                onClick={handleFetch}
                disabled={fetching}
                className="flex items-center gap-1 px-3 py-2 bg-[#1a2744] text-white rounded text-xs font-semibold disabled:opacity-50 whitespace-nowrap"
              >
                {fetching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                {fetching ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Click Fetch to auto-fill from the BSA page, or enter manually below.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Merit Badge Name</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Fire Safety"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Merit Badge Image URL</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the merit badge..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Official Requirements</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={6}
              value={form.requirements}
              onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              placeholder="One requirement per line..."
            />
            <p className="text-xs text-gray-400 mt-1">Enter each requirement on a new line.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="eagle-required"
            checked={form.eagle_required}
            onChange={e => setForm(f => ({ ...f, eagle_required: e.target.checked }))}
            className="w-4 h-4"
          />
          <label htmlFor="eagle-required" className="text-sm font-semibold text-gray-700">Eagle Required Badge</label>
          <span className="text-xs text-gray-400">— only check if the BSA page says Eagle required</span>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || !form.bsa_url.trim() || !form.name.trim()}
            className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Badge'}
          </button>
        </div>
      </div>
    </div>
  );
}