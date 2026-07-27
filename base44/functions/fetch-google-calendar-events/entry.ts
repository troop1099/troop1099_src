import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const ICAL_URL = (calId) =>
  `https://calendar.google.com/calendar/ical/${encodeURIComponent(calId)}/public/basic.ics`;

// Parse an iCal DTSTART/DTEND value into a JS Date
function parseIcalDate(value, params) {
  if (!value) return null;
  // All-day date: VALUE=DATE → YYYYMMDD
  if (params?.VALUE === 'DATE' || /^\d{8}$/.test(value)) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return new Date(`${y}-${m}-${d}T00:00:00`);
  }
  // UTC datetime: ends with Z → YYYYMMDDTHHMMSSZ
  if (value.endsWith('Z')) {
    const y = value.slice(0, 4);
    const mo = value.slice(4, 6);
    const d = value.slice(6, 8);
    const h = value.slice(9, 11);
    const mi = value.slice(11, 13);
    const s = value.slice(13, 15);
    return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}Z`);
  }
  // Local datetime with TZID → YYYYMMDDTHHMMSS
  // Google iCal uses America/New_York; we treat it as that for simplicity
  const y = value.slice(0, 4);
  const mo = value.slice(4, 6);
  const d = value.slice(6, 8);
  const h = value.slice(9, 11);
  const mi = value.slice(11, 13);
  const s = value.slice(13, 15);
  // Build a date assuming America/New_York offset (GMT-5 or GMT-4 for DST)
  // We use a simple approach: create as local time then adjust to UTC
  // Since the server is UTC, we need to interpret this as New York time
  const date = new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}`);
  // Adjust from UTC to New York: subtract the NY offset
  // For simplicity, treat as if the string was in New York local time
  // Convert: the Date constructor interprets it as UTC, so we need to add the offset
  // New York is GMT-4 (EDT) during summer, GMT-5 (EST) during winter
  // We'll use a simple heuristic based on the month
  const month = parseInt(mo, 10);
  const isDST = month >= 3 && month <= 10; // April through October (approx DST)
  const offsetHours = isDST ? 4 : 5;
  return new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
}

function parseIcal(text) {
  // Unfold lines (RFC 5545 line folding: lines starting with space/tab are continuations)
  const unfolded = text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
  const lines = unfolded.split('\n');

  const events = [];
  let current = null;
  let currentKey = null;
  let currentParams = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      currentKey = null;
    } else if (line === 'END:VEVENT') {
      if (current) events.push(current);
      current = null;
    } else if (current) {
      // Parse property: NAME;PARAM1=VAL1;PARAM2=VAL2:VALUE
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const leftPart = line.slice(0, colonIdx);
      const value = line.slice(colonIdx + 1);
      const semicolonIdx = leftPart.indexOf(';');
      const key = semicolonIdx === -1 ? leftPart : leftPart.slice(0, semicolonIdx);
      const paramsStr = semicolonIdx === -1 ? '' : leftPart.slice(semicolonIdx + 1);
      const params = {};
      if (paramsStr) {
        for (const pair of paramsStr.split(';')) {
          const [k, v] = pair.split('=');
          if (k && v) params[k] = v;
        }
      }
      current[key] = { value, params };
    }
  }

  return events;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    // Read the calendar ID from the Setting entity
    const settings = await base44.asServiceRole.entities.Setting.filter({
      key: 'google_calendar_id',
    });
    const calendarId = settings[0]?.value;
    if (!calendarId) {
      return Response.json({ events: [] });
    }

    // Fetch the iCal feed
    const res = await fetch(ICAL_URL(calendarId), { redirect: 'follow' });
    if (!res.ok) {
      return Response.json({ error: 'Failed to fetch calendar feed' }, { status: 502 });
    }
    const icalText = await res.text();
    const rawEvents = parseIcal(icalText);

    const now = new Date();
    const upcoming = [];

    for (const ev of rawEvents) {
      const dtstart = ev.DTSTART;
      if (!dtstart) continue;
      const startDate = parseIcalDate(dtstart.value, dtstart.params);
      if (!startDate || startDate < now) continue;

      const dtend = ev.DTEND;
      const endDate = dtend ? parseIcalDate(dtend.value, dtend.params) : null;

      // Unescape iCal text (\\, → ,, \\; → ;, \\\\ → \\, \\n → newline)
      const unescape = (str) =>
        (str || '').replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');

      upcoming.push({
        title: unescape(ev.SUMMARY?.value || 'Untitled Event'),
        start: startDate.toISOString(),
        end: endDate ? endDate.toISOString() : null,
        location: unescape(ev.LOCATION?.value || ''),
        all_day: dtstart.params?.VALUE === 'DATE' || /^\d{8}$/.test(dtstart.value),
      });
    }

    // Sort by start date ascending
    upcoming.sort((a, b) => new Date(a.start) - new Date(b.start));

    // Return the next 10 events
    return Response.json({ events: upcoming.slice(0, 10) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}