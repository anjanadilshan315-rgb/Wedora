import type { InvitationViewData } from "./types";

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=900`;

export const SAMPLE_GALLERY = [
  unsplash("photo-1520854221256-17451cc331bf"),
  unsplash("photo-1519225421980-715cb0215aed"),
  unsplash("photo-1511285560929-80b456fea0bc"),
  unsplash("photo-1606800052052-a08af7148866"),
  unsplash("photo-1583939000148-73599b533d3c"),
];

/** Shown on the template gallery previews (/invite/demo-…). */
export function sampleInvitation(code: string, guestName: string | null): InvitationViewData {
  const traditional = code === "tpl_royal";
  return {
    guestName: guestName ?? "Guest Name",
    groomName: "Kaveen",
    brideName: "Ishara",
    groomParents: "Mr. & Mrs. Perera",
    brideParents: "Mr. & Mrs. Silva",
    weddingDate: "2026-11-28",
    weddingTime: traditional ? "09:15" : "16:30",
    rsvpDeadline: "2026-11-15",
    venueName: traditional ? "Cinnamon Grand" : "The Kingsbury",
    venueAddress: "Colombo 03, Sri Lanka",
    mapUrl: null,
    greetingMessage: "Together with our families, we joyfully invite you to celebrate our wedding.",
    eventsSchedule: traditional
      ? [
          { name: "Welcome of Guests with Magul Bera & Kandyan Dancers", time: "09:15" },
          { name: "Arrival of the Bride & Groom", time: "09:45" },
          { name: "Auspicious Poruwa Ceremony (Nekatha)", time: "10:18" },
          { name: "Traditional Oil Lamp & Cake Cutting", time: "11:30" },
          { name: "Royal Feast & Lunch", time: "12:30" },
          { name: "Going Away Procession", time: "14:30" },
        ]
      : [
          { name: "Welcome Drinks & Guest Arrival", time: "16:00" },
          { name: "Wedding Ceremony", time: "16:30" },
          { name: "Cocktails & Photos", time: "17:30" },
          { name: "Dinner & Reception", time: "19:00" },
          { name: "After Party & Dancing", time: "20:30" },
        ],
    coverPhoto: traditional ? SAMPLE_GALLERY[4] : SAMPLE_GALLERY[2],
    groomPhoto: null,
    bridePhoto: null,
    gallery: SAMPLE_GALLERY,
  };
}
