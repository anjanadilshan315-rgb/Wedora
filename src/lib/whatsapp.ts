interface WhatsAppGuest {
  name: string;
  phone: string | null;
  inviteUrl: string | null;
}

interface WhatsAppInvitation {
  brideName: string | null;
  groomName: string | null;
  weddingDate: string | null;
  weddingTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
}

function weddingDateLabel(value: string | null): string {
  if (!value) return 'To be announced';
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return 'To be announced';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}

function weddingTimeLabel(value: string | null): string {
  if (!value?.trim()) return 'To be announced';
  const time = value.trim();
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(time);
  if (!match) return time;
  const hour = Number(match[1]);
  if (hour > 23 || Number(match[2]) > 59) return 'To be announced';
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function guestWhatsAppLink(
  guest: WhatsAppGuest,
  invitation: WhatsAppInvitation,
): string | null {
  if (!guest.phone || !guest.inviteUrl) return null;
  // Local Sri Lankan numbers and full international numbers are supported.
  const raw = guest.phone.trim();
  if (!/^[+\d\s().-]+$/.test(raw)) return null;
  let phone = raw.replace(/\D/g, '');
  if (phone.startsWith('00')) phone = phone.slice(2);
  else if (phone.startsWith('0')) {
    if (!/^0\d{9}$/.test(phone)) return null;
    phone = `94${phone.slice(1)}`;
  }
  if (!/^[1-9]\d{7,14}$/.test(phone)) return null;
  if (phone.startsWith('94') && !/^94\d{9}$/.test(phone)) return null;

  const couple = `${invitation.brideName?.trim() || 'Bride'} & ${invitation.groomName?.trim() || 'Groom'}`;
  const venue = [invitation.venueName?.trim(), invitation.venueAddress?.trim()]
    .filter(Boolean).join(', ') || 'To be announced';
  // WhatsApp uses *bold* and _italic_ rather than Markdown double asterisks.
  const message = `💍✨ *Wedding Invitation* ✨💍
_Two hearts, one love, and a beautiful journey together..._ ❤️

Dear ${guest.name},

With hearts full of love and happiness, we warmly invite you to celebrate the most special day of our lives. 💕

👰🏻‍♀️🤵🏻 *${couple}*

📅 *Date:* ${weddingDateLabel(invitation.weddingDate)}
🕒 *Time:* ${weddingTimeLabel(invitation.weddingTime)}
📍 *Venue:* ${venue}

💌 *View Our Wedding Invitation:*
${guest.inviteUrl}

Your presence and blessings would mean the world to us as we begin this beautiful journey together. ❤️

We look forward to celebrating our special day with you! 🥂✨

*With Love,*
*${couple}* 💕`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}