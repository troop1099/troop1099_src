import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Loader2, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';

/**
 * Reusable phone-based scout verification component.
 *
 * Props:
 *  - onVerified(phone, scoutName): called when a single match is found
 *  - onReset(): called when phone changes after a match, or when lookup fails
 *  - instruction: optional instruction text shown above the field
 */
export default function ScoutPhoneLookup({ onVerified, onReset, instruction }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle');
  const [scoutName, setScoutName] = useState('');
  const [lastLookedUp, setLastLookedUp] = useState('');

  const handleLookup = async () => {
    if (!phone.trim()) return;
    if (status === 'searching') return;
    if (phone === lastLookedUp && status === 'found') return;

    setStatus('searching');
    try {
      const res = await base44.functions.invoke('lookup-scout-by-phone', {
        phone_number: phone,
      });
      const data = res.data;
      setLastLookedUp(phone);

      if (data?.status === 'found' && data.scout_name) {
        setScoutName(data.scout_name);
        setStatus('found');
        onVerified?.(phone, data.scout_name);
      } else if (data?.status === 'duplicate') {
        setStatus('duplicate');
        onReset?.();
      } else {
        setStatus('not_found');
        onReset?.();
      }
    } catch {
      setStatus('error');
      onReset?.();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    if (status === 'found' || scoutName) {
      setScoutName('');
      setStatus('idle');
      onReset?.();
    }
  };

  const handleBlur = () => {
    if (phone.trim() && phone !== lastLookedUp && status !== 'searching') {
      handleLookup();
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="w-5 h-5 text-[#1a2744]" />
        <h3 className="font-bold text-[#1a2744] text-sm">Scout Verification</h3>
      </div>
      {instruction && (
        <p className="text-xs text-gray-500 mb-3">{instruction}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="tel"
          placeholder="(770) 555-1234"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a2744]"
          value={phone}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
        />
        <button
          onClick={handleLookup}
          disabled={!phone.trim() || status === 'searching'}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1a2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-[#1a2744]/90 transition-colors whitespace-nowrap"
        >
          {status === 'searching' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</>
          ) : (
            <><Search className="w-4 h-4" /> Find My Scout Record</>
          )}
        </button>
      </div>

      {status === 'found' && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Scout found: <strong>{scoutName}</strong>
          </p>
        </div>
      )}
      {status === 'not_found' && (
        <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            We could not find a Scout associated with that phone number. Please check the number or contact the Scoutmaster.
          </p>
        </div>
      )}
      {status === 'duplicate' && (
        <div className="mt-3 flex items-start gap-2 bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            More than one Scout is associated with this phone number. Please contact the Scoutmaster.
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            Something went wrong during lookup. Please try again or contact the Scoutmaster.
          </p>
        </div>
      )}
    </div>
  );
}