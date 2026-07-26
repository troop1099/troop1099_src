import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Save, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { loadNotificationSettings, saveNotificationSettings, sendTestEmail, validateEmail } from '@/lib/reservationNotifications';

export default function EmailNotificationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({ name: '', email: '', email_2: '', enabled: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    loadNotificationSettings().then(s => {
      if (s) setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (settings.email && !validateEmail(settings.email)) {
      toast({ title: 'Invalid email address', variant: 'destructive' });
      return;
    }
    if (settings.email_2 && !validateEmail(settings.email_2)) {
      toast({ title: 'Invalid secondary email address', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await saveNotificationSettings(settings);
      toast({ title: 'Settings saved' });
    } catch (err) {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleTestEmail = async () => {
    if (!settings.email) {
      toast({ title: 'Please enter an email address first', variant: 'destructive' });
      return;
    }
    if (!validateEmail(settings.email)) {
      toast({ title: 'Invalid email address', variant: 'destructive' });
      return;
    }
    setSendingTest(true);
    try {
      await sendTestEmail(settings.email);
      toast({ title: 'Test email sent', description: 'Check the inbox for the test message.' });
    } catch (err) {
      toast({ title: 'Failed to send test email', description: 'Email delivery only works for registered app users. Make sure the email is a registered user account.', variant: 'destructive' });
    }
    setSendingTest(false);
  };

  if (loading) return <div className="text-center py-4 text-gray-400 text-sm">Loading notification settings…</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-[#1a2744] text-white p-5 flex items-center gap-2">
        <Mail className="w-5 h-5" />
        <h2 className="font-bold text-lg">Reservation Email Notifications</h2>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">Notifications</label>
          <button
            onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.enabled ? 'translate-x-6' : ''}`} />
          </button>
          <span className="text-sm text-gray-500">{settings.enabled ? 'On' : 'Off'}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Scoutmaster Name</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={settings.name} onChange={e => setSettings(s => ({ ...s, name: e.target.value }))} placeholder="Scoutmaster name" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Scoutmaster Email</label>
          <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} placeholder="scoutmaster@email.com" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Secondary Email (optional)</label>
          <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={settings.email_2} onChange={e => setSettings(s => ({ ...s, email_2: e.target.value }))} placeholder="second@email.com" />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button onClick={handleTestEmail} disabled={sendingTest} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50">
            {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sendingTest ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>
      </div>
    </div>
  );
}