import type { InvitationViewData } from "./types";
import { DEFAULT_KEEPSAKE } from "./keepsake";
import { DEFAULT_HEIRLOOM } from "./heirloom";
import { DEFAULT_ENVELOPE } from "./envelope";
import { sunsetSettings } from "./sunset";
import { gildedSettings } from "./gilded";

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=900`;

export const SAMPLE_GALLERY = [
  unsplash("photo-1520854221256-17451cc331bf"),
  unsplash("photo-1519225421980-715cb0215aed"),
  unsplash("photo-1511285560929-80b456fea0bc"),
  unsplash("photo-1606800052052-a08af7148866"),
  "/assets/gallery-wedding-celebration.jpg",
];

/** Shown on the template gallery previews (/invite/demo-…). */
export function sampleInvitation(code: string, guestName: string | null): InvitationViewData {
  if (code === "tpl_gilded_celebration") return {
    gilded: gildedSettings({ eventDates: ["2027-02-20", "2027-02-20", "2027-02-22"] }),
    guestName, brideName: "Amelia", groomName: "Noah", brideParents: null, groomParents: null,
    bridePhone: null, groomPhone: null,
    weddingDate: "2027-02-20", weddingTime: "09:00", rsvpDeadline: "2027-02-01",
    venueName: "The Grand Ballroom", venueAddress: "Colombo, Sri Lanka", mapUrl: null, greetingMessage: null,
    eventsSchedule: [
      { name: "Poruwa Ceremony", time: "09:00", venue: "The Grand Ballroom, Colombo" },
      { name: "Wedding Reception", time: "18:30", venue: "The Garden Pavilion, Colombo" },
      { name: "Homecoming", time: "18:00", venue: "Family Residence, Colombo" },
    ],
    coverPhoto: null, bridePhoto: null, groomPhoto: null,
    gallery: ["/assets/gilded/gallery-1.jpg", "/assets/gilded/gallery-2.jpg", "/assets/gilded/gallery-3.jpg"],
  };
  if (code === "tpl_sunset_journey") return {
    sunset: sunsetSettings({ eventDates: ["2026-12-11", "2026-12-12", "2026-12-12"] }), guestName,
    brideName: "Sanduni", groomName: "Ravindu",
    brideParents: "Mr. & Mrs. Rajapaksha", groomParents: "Mr. & Mrs. Fernando",
    bridePhone: null, groomPhone: null,
    weddingDate: "2026-12-12", weddingTime: "10:00", rsvpDeadline: "2026-12-01",
    venueName: "Araliya Grand", venueAddress: "Nuwara Eliya, Sri Lanka", mapUrl: null, greetingMessage: null,
    eventsSchedule: [
      { name: "Registration", time: "08:30", venue: "Araliya Grand, Nuwara Eliya" },
      { name: "Poruwa Ceremony", time: "10:00", venue: "Araliya Grand, Nuwara Eliya" },
      { name: "Wedding Reception", time: "18:30", venue: "Araliya Grand, Nuwara Eliya" },
    ],
    coverPhoto: null, bridePhoto: null, groomPhoto: null, gallery: [],
  };
  if (code === "tpl_heirloom_envelope") return {
    floralEnvelope: { ...DEFAULT_ENVELOPE, timeline: [
      { year: "2019", titleEn: "First Met", titleSi: "පළමු හමුවීම", descriptionEn: "Two strangers, one coffee, and a conversation that never really ended.", descriptionSi: "සුළු හමුවීමක් — එය අවසන් නොවූ කතාබහක් විය." },
      { year: "2022", titleEn: "The Promise", titleSi: "පොරොන්දුව", descriptionEn: "Under a golden sky we promised to walk every road together.", descriptionSi: "රන්වන් අහසක් යට, සෑම මඟක්ම එකට ගමන් කරන බවට පොරොන්දු වුණා." },
      { year: "2026", titleEn: "Forever Begins", titleSi: "සදාකාලය ඇරඹේ", descriptionEn: "With our families’ blessings, we are engaged and ready for forever.", descriptionSi: "දෙමාපියන්ගේ ආශීර්වාදයෙන් අපි විවාහයට සූදානම්." },
    ] },
    guestName, brideName: "Diyuni", groomName: "Rashmika", brideParents: "Mr. & Mrs. Perera", groomParents: "Mr. & Mrs. Fernando",
    bridePhone: null, groomPhone: null, weddingDate: "2027-04-03", weddingTime: "09:30", rsvpDeadline: "2027-03-20",
    venueName: "Lotus Garden Hall", venueAddress: "123 Temple Road, Colombo 07", mapUrl: null, greetingMessage: null,
    eventsSchedule: [
      { name: "Poruwa Ceremony · පෝරුව චාරිත්‍රය", time: "09:30", description: "At the auspicious hour · සුබ මොහොතේදී" },
      { name: "Welcome Drink · පිළිගැනීමේ පානය", time: "10:30", description: "Garden Terrace" },
      { name: "Wedding Reception · මංගල සංග්‍රහය", time: "11:30", venue: "Grand Heritage Hotel" },
      { name: "Wedding Lunch · මංගල දිවා භෝජනය", time: "13:00", description: "Banquet Hall" },
      { name: "Dance & Celebration · නැටුම් හා සැමරුම", time: "14:30", description: "Dance floor opens" },
    ], coverPhoto: null, groomPhoto: null, bridePhoto: null, gallery: [],
  };
  if (code === "tpl_grand_heirloom") return {
    heirloom: { ...DEFAULT_HEIRLOOM, dressEn: "Elegant celebration attire.", dressSi: "උත්සවයට ගැළපෙන අලංකාර ඇඳුමකින් සැරසී එන්න." },
    guestName,
    brideName: "Anuki", groomName: "Sahan",
    brideParents: "The Perera family", groomParents: "The Jayawardena family",
    bridePhone: null, groomPhone: null,
    weddingDate: "2027-08-21", weddingTime: "10:30", rsvpDeadline: "2027-08-01",
    venueName: "The Golden House · Demo Walawwa", venueAddress: "Fictional heritage courtyard, Kandy, Sri Lanka", mapUrl: null,
    greetingMessage: "Together with our families, we invite you to celebrate our wedding.",
    eventsSchedule: [
      { name: "The Poruwa Ceremony", time: "10:30", venue: "The Golden House · Demo Walawwa", description: "Please join us as we honour tradition and begin our journey together." },
      { name: "An evening to remember", time: "18:30", venue: "The Courtyard · Demo Walawwa", description: "Join us for dinner, music and a celebration under the stars." },
    ],
    coverPhoto: null, bridePhoto: null, groomPhoto: null, gallery: [],
  };
  if (code === "tpl_classic") return {
    keepsake: { ...DEFAULT_KEEPSAKE },
    guestName: guestName ?? "Guest Name",
    groomName: "Kasun", brideName: "Nimali",
    groomParents: null, brideParents: null,
    weddingDate: "2026-12-20", weddingTime: "10:30", rsvpDeadline: "2026-12-01",
    venueName: "The Grand Pavilion", venueAddress: "Galle Road, Colombo 03", mapUrl: null,
    greetingMessage: "Two hearts, one journey.\nWe joyfully invite you to share in our happiness as we begin our new life together.\nYour presence will make our day complete.",
    eventsSchedule: [
      { time: "09:30", name: "Guests arrive", description: "Welcome drink and seating" },
      { time: "10:30", name: "Poruwa ceremony", description: "The couple is wed" },
      { time: "12:00", name: "Wedding lunch", description: "Please stay and dine with us" },
      { time: "14:00", name: "Going away", description: "Send-off for the couple" },
    ],
    coverPhoto: SAMPLE_GALLERY[2], groomPhoto: null, bridePhoto: null,
    gallery: [SAMPLE_GALLERY[0], SAMPLE_GALLERY[2], SAMPLE_GALLERY[3], SAMPLE_GALLERY[4]],
  };
  const goldenHour = code === "tpl_golden_hour";
  return {
    guestName: guestName ?? "Guest Name",
    groomName: goldenHour ? "Ravindu" : "Kaveen",
    brideName: goldenHour ? "Sanduni" : "Ishara",
    groomParents: "Mr. & Mrs. Perera",
    brideParents: goldenHour ? "Mr. & Mrs. Fernando" : "Mr. & Mrs. Silva",
    weddingDate: goldenHour ? "2026-12-12" : "2026-11-28",
    weddingTime: goldenHour ? "10:30" : "16:30",
    rsvpDeadline: goldenHour ? "2026-12-01" : "2026-11-15",
    venueName: goldenHour ? "Aralya Grand" : "The Kingsbury",
    venueAddress: goldenHour ? "Nuwara Eliya, Sri Lanka" : "Colombo 03, Sri Lanka",
    mapUrl: null,
    greetingMessage: goldenHour ? "ඔබගේ පැමිණීමෙන් අපගේ සතුට දෙගුණ වේ. Together with our families, we joyfully invite you to celebrate the beginning of our forever." : "Together with our families, we joyfully invite you to celebrate our wedding.",
    eventsSchedule: goldenHour
      ? [
          { name: "Registration", time: "09:00" },
          { name: "Poruwa Ceremony", time: "10:30" },
          { name: "Reception", time: "18:30" },
        ]
      : [
          { name: "Welcome Drinks & Guest Arrival", time: "16:00" },
          { name: "Wedding Ceremony", time: "16:30" },
          { name: "Cocktails & Photos", time: "17:30" },
          { name: "Dinner & Reception", time: "19:00" },
          { name: "After Party & Dancing", time: "20:30" },
        ],
    coverPhoto: SAMPLE_GALLERY[2],
    groomPhoto: null,
    bridePhoto: null,
    gallery: SAMPLE_GALLERY,
  };
}
