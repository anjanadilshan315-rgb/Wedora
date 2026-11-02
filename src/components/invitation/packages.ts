/** Service packages built from the invitation designs and features already in Wedora. */
export interface InvitationPackage {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  templateCodes: string[];
  highlights: string[];
  includesPackageId?: string;
  featured?: boolean;
  note: string;
}

export const INVITATION_PACKAGES: InvitationPackage[] = [
  {
    id: "essential",
    name: "The Golden Keepsake",
    eyebrow: "Essential · Basic",
    description: "One wedding, beautifully introduced with an elegant ready-made digital invitation.",
    templateCodes: ["tpl_classic", "tpl_golden_hour"],
    highlights: [
      "Wax-seal invitation in Betel and Lotus, Midnight Sapphire or Ruby and Gold",
      "Ruby Heart Romance design with ruby, blush and gold styling",
      "Bride and groom names, wedding date, time and venue",
      "Custom wedding message and invitation wording",
      "Wedding countdown timer",
      "Google Maps venue link",
      "RSVP form: attending or not attending",
      "Guest list and RSVP dashboard",
      "Share the invitation with guests on WhatsApp",
      "Mobile-friendly invitation page",
      "Basic colour and text customization",
      "Manage one wedding event",
    ],
    note: "A considered, easy-to-share invitation for one wedding celebration.",
  },
  {
    id: "celebration",
    name: "The Gilded Celebration",
    eyebrow: "Standard",
    description: "A complete invitation with deeper customization and thoughtful guest management.",
    templateCodes: ["tpl_gilded_celebration"],
    highlights: [
      "Premium font, colour and layout customization",
      "Couple pre-shoot photo gallery",
      "Dedicated love story section",
      "Animated invitation opening",
      "Optional background music",
      "Multiple event schedules: Poruwa, church, reception, homecoming and more",
      "Separate venue and map for each event",
      "Guest-specific invitation links",
      "RSVP guest counts and guest-list filters",
      "RSVP deadline and guest messages",
      "QR code invitation sharing",
      "Shareable messages for event reminders",
      "Edit invitation details from the customer dashboard",
      "Standard customer support and setup assistance",
    ],
    featured: true,
    note: "For couples who want guests to have all the details at hand.",
  },
  {
    id: "signature",
    name: "The Grand Heirloom",
    eyebrow: "Premium · Bespoke",
    description: "Step through carved heritage doors into an illustrated Sri Lankan wedding, from a sunlit Poruwa to a lantern-lit evening.",
    templateCodes: ["tpl_grand_heirloom", "tpl_heirloom_envelope", "tpl_sunset_journey"],
    highlights: [
      "Carved double-door opening and cinematic courtyard walk-through",
      "Additional Floral Envelope design with a wax seal and nine colour themes",
      "Sunset Journey design with a vintage car intro, bouquet toss, petals, six colour themes and three font styles",
      "Switch between Sinhala and English",
      "Six original Heritage Door colour themes",
      "Elegant, Calligraphy and Classic typography",
      "Custom day sky, flowers, night sky, wood and accent colours",
      "Original illustrated scenes with optional personal scene photos",
      "Arched couple photo gallery with illustrated fallbacks",
      "Your love story and invitation message",
      "Wedding countdown and event schedule",
      "Venue details and Google Maps directions",
      "RSVP with attendance and guest counts",
      "Guest-specific links and RSVP dashboard",
      "Door-opening sounds, gentle footsteps and welcome chimes",
      "Mute / unmute controls and an optional custom music URL",
      "Downloadable calendar invitation",
      "Bride and groom contact buttons",
      "Save your design and wording from the customer dashboard",
    ],
    note: "A heritage wedding journey with changing scenes, floating fireflies and warm, personal details.",
  },
];
