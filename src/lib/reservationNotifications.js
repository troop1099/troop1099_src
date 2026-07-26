import { base44 } from '@/api/base44Client';

export function validateEmail(email) {
  return /^[^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function loadNotificationSettings() {
  const settings = await base44.entities.Setting.filter({ key: 'reservation_notification_settings' });
  if (settings.length > 0) {
    try {
      return JSON.parse(settings[0].value);
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveNotificationSettings(settings) {
  const existing = await base44.entities.Setting.filter({ key: 'reservation_notification_settings' });
  if (existing.length > 0) {
    await base44.entities.Setting.update(existing[0].id, { value: JSON.stringify(settings) });
  } else {
    await base44.entities.Setting.create({ key: 'reservation_notification_settings', value: JSON.stringify(settings) });
  }
}

export async function sendReservationNotification(action, reservation, openSlots) {
  try {
    const settings = await loadNotificationSettings();
    if (!settings || !settings.enabled) return { sent: false, reason: 'disabled' };

    const emails = [settings.email, settings.email_2].filter(Boolean).filter(validateEmail);
    if (emails.length === 0) return { sent: false, reason: 'no_valid_email' };

    const typeLabel = reservation.type === 'scoutmaster_conference' ? 'Scoutmaster Conference' : 'Board of Review';
    const dateLabel = reservation.meeting_date
      ? new Date(reservation.meeting_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : 'N/A';

    const actionLabel = action === 'new' ? 'New Reservation' : 'Cancellation';
    const subject = action === 'new'
      ? `New ${typeLabel} Reservation — ${dateLabel}`
      : `Reservation Canceled — ${typeLabel} — ${dateLabel}`;

    const body = `Action: ${actionLabel}\n` +
      `Scout: ${reservation.scout_name || 'N/A'}\n` +
      `Rank: ${reservation.rank || 'N/A'}\n` +
      `Request Type: ${typeLabel}\n` +
      `Monday Date: ${dateLabel}\n` +
      `Meeting Time: 7:00 PM\n` +
      `Open Spots Remaining: ${openSlots}\n` +
      `Submission Time: ${new Date().toLocaleString()}\n` +
      (reservation.notes ? `Notes: ${reservation.notes}\n` : '');

    for (const email of emails) {
      try {
        await base44.integrations.Core.SendEmail({
          to: email,
          subject,
          body,
          from_name: settings.name || 'Troop 1099',
        });
      } catch (err) {
        // Email delivery may fail for non-registered users
      }
    }

    return { sent: true };
  } catch {
    return { sent: false, reason: 'error' };
  }
}

export async function sendTestEmail(email) {
  await base44.integrations.Core.SendEmail({
    to: email,
    subject: 'Reservation Notification Test',
    body: 'This is a test message confirming that reservation notifications are configured for Troop 1099.',
    from_name: 'Troop 1099',
  });
  return { sent: true };
}