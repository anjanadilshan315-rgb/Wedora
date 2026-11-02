export interface HeirloomStoryMoment {
  year: string;
  titleEn: string;
  titleSi: string;
  descriptionEn: string;
  descriptionSi: string;
}

/** Saved in invitation.extraDetails.heirloom. Keep presentation settings together. */
export interface HeirloomSettings {
  language: "en" | "si";
  palette: string;
  font: "classic" | "romantic" | "modern";
  main: string;
  accent: string;
  background: string;
  envelope: string;
  musicUrl: string;
  storyEn: string;
  storySi: string;
  messageSi: string;
  dressEn: string;
  dressSi: string;
  timeline: HeirloomStoryMoment[];
  bloom: string;
  scenePhotos: Partial<Record<HeirloomScene, string>>;
}

export type HeirloomScene =
  "door" | "courtyard" | "poruwa" | "house" | "ceremony" | "night";
export const HEIRLOOM_SCENES: HeirloomScene[] = [
  "door",
  "courtyard",
  "poruwa",
  "house",
  "ceremony",
  "night",
];

// The six original Heritage Door palettes from wedding-invitation-2.zip.
// Existing colour keys are retained so saved invitations remain compatible.
export const HEIRLOOM_PALETTES = [
  {
    id: "heritage-gold",
    name: "Heritage Gold",
    background: "#f6d9bd",
    bloom: "#f2b8bd",
    main: "#1c3f8f",
    accent: "#e6c58f",
    envelope: "#7a4a28",
  },
  {
    id: "rose-garden",
    name: "Rose Garden",
    background: "#f7d4d8",
    bloom: "#e98aa6",
    main: "#3b1f4a",
    accent: "#f0c7a0",
    envelope: "#6e3d2f",
  },
  {
    id: "emerald-dusk",
    name: "Emerald Dusk",
    background: "#dcebd5",
    bloom: "#f2d27a",
    main: "#0f3d3a",
    accent: "#d9c27a",
    envelope: "#5e4a2a",
  },
  {
    id: "royal-navy",
    name: "Royal Navy",
    background: "#d5e2f2",
    bloom: "#c9d8f5",
    main: "#0e1f4d",
    accent: "#cdd6e6",
    envelope: "#5a3d2b",
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral",
    background: "#fbd3b4",
    bloom: "#ee8f72",
    main: "#4a1d3a",
    accent: "#f5c78f",
    envelope: "#7a4528",
  },
  {
    id: "ivory-sage",
    name: "Ivory Sage",
    background: "#eef0e2",
    bloom: "#dfe8d4",
    main: "#25362e",
    accent: "#e3d3a2",
    envelope: "#6b5638",
  },
] as const;

export const DEFAULT_HEIRLOOM: HeirloomSettings = {
  language: "en",
  palette: "heritage-gold",
  font: "classic",
  main: "",
  accent: "",
  background: "",
  envelope: "",
  musicUrl: "",
  storyEn: "",
  storySi: "",
  messageSi: "",
  dressEn: "",
  dressSi: "",
  timeline: [],
  bloom: "",
  scenePhotos: {},
};

/** Only accept known options and safe colours from saved API data. */
export function heirloomSettings(value: unknown): HeirloomSettings {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const settings = {
    ...DEFAULT_HEIRLOOM,
    scenePhotos: {} as HeirloomSettings["scenePhotos"],
  };
  if (source.language === "si") settings.language = "si";
  if (source.font === "romantic" || source.font === "modern")
    settings.font = source.font;
  if (HEIRLOOM_PALETTES.some((p) => p.id === source.palette))
    settings.palette = source.palette as string;
  const previousPalettes: Record<string, string> = {
    burgundy: "heritage-gold",
    navy: "royal-navy",
    emerald: "emerald-dusk",
    rose: "rose-garden",
    purple: "rose-garden",
    teal: "emerald-dusk",
    noir: "royal-navy",
    sage: "ivory-sage",
    peach: "sunset-coral",
  };
  if (typeof source.palette === "string" && previousPalettes[source.palette])
    settings.palette = previousPalettes[source.palette];
  for (const key of [
    "main",
    "accent",
    "background",
    "envelope",
    "bloom",
  ] as const) {
    if (typeof source[key] === "string" && /^#[0-9a-f]{6}$/i.test(source[key]))
      settings[key] = source[key];
  }
  if (source.scenePhotos && typeof source.scenePhotos === "object") {
    const photos = source.scenePhotos as Record<string, unknown>;
    for (const scene of HEIRLOOM_SCENES) {
      if (
        typeof photos[scene] === "string" &&
        /^(https:\/\/|\/(?!\/))/.test(photos[scene])
      )
        settings.scenePhotos[scene] = photos[scene];
    }
  }
  for (const key of [
    "storyEn",
    "storySi",
    "messageSi",
    "dressEn",
    "dressSi",
  ] as const) {
    if (typeof source[key] === "string") settings[key] = source[key];
  }
  if (
    typeof source.musicUrl === "string" &&
    /^(https:\/\/|\/(?!\/))/.test(source.musicUrl)
  )
    settings.musicUrl = source.musicUrl;
  if (Array.isArray(source.timeline)) {
    settings.timeline = source.timeline.slice(0, 10).map((item) => {
      const row =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};
      const string = (key: string) =>
        typeof row[key] === "string" ? (row[key] as string) : "";
      return {
        year: string("year"),
        titleEn: string("titleEn"),
        titleSi: string("titleSi"),
        descriptionEn: string("descriptionEn"),
        descriptionSi: string("descriptionSi"),
      };
    });
  }
  return settings;
}

export function heirloomColours(settings: HeirloomSettings) {
  const palette =
    HEIRLOOM_PALETTES.find((p) => p.id === settings.palette) ??
    HEIRLOOM_PALETTES[0];
  return {
    main: settings.main || palette.main,
    accent: settings.accent || palette.accent,
    background: settings.background || palette.background,
    envelope: settings.envelope || palette.envelope,
    bloom: settings.bloom || palette.bloom,
  };
}

/** All guest-facing labels have an English and Sinhala version. */
export const HEIRLOOM_TEXT = {
  en: {
    invited: "You are invited",
    open: "Open invitation",
    together: "Together with our families",
    request:
      "Request the honour of your presence at the celebration of our marriage",
    getting: "We are getting",
    married: "Married",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    storyEyebrow: "How it all began",
    story: "Our story",
    details: "The details",
    detailsEyebrow: "A day to remember",
    moments: "Our favourite moments",
    gallery: "Photo gallery",
    locationEyebrow: "We will meet you here",
    location: "The location",
    map: "Open in Maps",
    rsvpEyebrow: "Kindly reply",
    rsvp: "Will you join us?",
    rsvpLead:
      "Your presence is the greatest gift. Please let us know if you will be joining us.",
    name: "Full name",
    attending: "Will you attend?",
    yes: "Joyfully accepts",
    no: "Regretfully declines",
    guests: "Number of guests",
    send: "Send our RSVP",
    sending: "Sending…",
    thanks: "With heartfelt thanks",
    sent: "Your reply has been saved. Thank you for letting us know.",
    edit: "Change my reply",
    demo: "This is a preview. Your reply stays in this browser session.",
    preview: "RSVP is disabled in the couple’s preview.",
    deadline: "Please reply by",
    datePending: "Date to be announced",
    venuePending: "Venue to be announced",
    save: "Save the date",
    calendar: "Add to calendar",
    bride: "Call bride",
    groom: "Call groom",
    daughter: "Daughter of",
    son: "Son of",
    foot: "With love & gratitude",
    home: "Home",
    navDetails: "Details",
    navRsvp: "RSVP",
    navGallery: "Gallery",
    navLocation: "Location",
    music: "Play music",
    stopMusic: "Pause music",
    musicError: "Music could not play. Please try again.",
    customize: "Explore the design",
    palette: "Colour theme",
    font: "Font style",
    classic: "Elegant",
    romantic: "Calligraphy",
    modern: "Classic",
    replay: "Replay door",
    close: "Close",
    dress: "Dress code",
    dear: "Especially for",
    countLess: "Fewer guests",
    countMore: "More guests",
    attendRequired: "Please choose whether you will attend.",
    nameRequired: "Please enter your name.",
    submitError: "Your reply could not be saved. Please try again.",
    invitationLabel: "Wedding invitation",
    muteSound: "Mute invitation sound",
    enableSound: "Enable invitation sound",
    tagline: "A day, a promise, a lifetime",
    discover: "Discover the celebration",
    familiesLine:
      "We warmly invite you to share in the beginning of our new chapter.",
    keepDate: "Keep the date close",
    momentsTitle: "The moments we keep",
    seatTitle: "A seat saved for you",
    seatText:
      "Your presence will make our celebration complete. We look forward to sharing this day with you.",
  },
  si: {
    invited: "ඔබට ආරාධනා කරමු",
    open: "ආරාධනය විවෘත කරන්න",
    together: "අපගේ පවුල් සමඟ එක්ව",
    request: "අපගේ විවාහ මංගල්‍යයට ඔබගේ සහභාගීත්වය ඉතා ගෞරවයෙන් ඉල්ලා සිටිමු",
    getting: "අපගේ සුන්දර",
    married: "විවාහ මංගල්‍යය",
    days: "දින",
    hours: "පැය",
    minutes: "මිනිත්තු",
    seconds: "තත්පර",
    storyEyebrow: "ආදරයේ ආරම්භය",
    story: "අපගේ කතාව",
    details: "මංගල විස්තර",
    detailsEyebrow: "මතකයේ රැඳෙන දිනයක්",
    moments: "අපගේ සුන්දර මොහොත",
    gallery: "ඡායාරූප එකතුව",
    locationEyebrow: "අප හමුවන තැන",
    location: "මංගල ස්ථානය",
    map: "සිතියමේ බලන්න",
    rsvpEyebrow: "කරුණාකර දන්වන්න",
    rsvp: "ඔබත් එක්වෙනවාද?",
    rsvpLead: "ඔබගේ පැමිණීමම අපට ලොකුම තෑග්ගයි. කරුණාකර ඔබ පැමිණෙන බව දන්වන්න.",
    name: "සම්පූර්ණ නම",
    attending: "ඔබ පැමිණෙනවාද?",
    yes: "සතුටින් පැමිණෙමි",
    no: "කණගාටුවෙන් නොපැමිණෙමි",
    guests: "අමුත්තන් ගණන",
    send: "පිළිතුර යවන්න",
    sending: "යවමින් පවතී…",
    thanks: "හදපිරි ස්තූතියි",
    sent: "ඔබගේ පිළිතුර සුරැකුණි. අපට දැනුම් දුන්නාට ස්තූතියි.",
    edit: "පිළිතුර වෙනස් කරන්න",
    demo: "මෙය ආදර්ශයකි. පිළිතුර මෙම බ්‍රවුසර සැසියේ පමණක් පවතී.",
    preview: "මෙම පෙරදසුනේ පිළිතුරු යැවීම අක්‍රියයි.",
    deadline: "කරුණාකර පිළිතුරු දෙන්න",
    datePending: "දිනය පසුව දැනුම් දෙනු ලැබේ",
    venuePending: "ස්ථානය පසුව දැනුම් දෙනු ලැබේ",
    save: "දිනය සටහන් කරගන්න",
    calendar: "දින දර්ශනයට එක් කරන්න",
    bride: "මනාලියට අමතන්න",
    groom: "මනාලයාට අමතන්න",
    daughter: "දියණිය",
    son: "පුත්‍රයා",
    foot: "ආදරයෙන් හා කෘතඥතාවෙන්",
    home: "මුල",
    navDetails: "විස්තර",
    navRsvp: "පිළිතුර",
    navGallery: "ඡායාරූප",
    navLocation: "ස්ථානය",
    music: "සංගීතය අරඹන්න",
    stopMusic: "සංගීතය නවත්වන්න",
    musicError: "සංගීතය වාදනය කළ නොහැකි විය. නැවත උත්සාහ කරන්න.",
    customize: "නිර්මාණය බලන්න",
    palette: "වර්ණ තේමාව",
    font: "අකුරු විලාසය",
    classic: "සම්ප්‍රදායික",
    romantic: "ආදරණීය",
    modern: "නවීන",
    replay: "දොරටුව නැවත විවෘත කරන්න",
    close: "වසන්න",
    dress: "ඇඳුම් පැළඳුම්",
    dear: "ආදරයෙන් ආරාධනා ලබන්නේ",
    countLess: "ගණන අඩු කරන්න",
    countMore: "ගණන වැඩි කරන්න",
    attendRequired: "ඔබ පැමිණෙනවාද යන්න තෝරන්න.",
    nameRequired: "කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.",
    submitError: "පිළිතුර සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
    invitationLabel: "මංගල ආරාධනය",
    muteSound: "ආරාධනයේ ශබ්දය නවත්වන්න",
    enableSound: "ආරාධනයේ ශබ්දය සක්‍රිය කරන්න",
    tagline: "සුන්දර දිනයක්, පොරොන්දුවක්, ජීවිත කාලයක්",
    discover: "මංගල සැමරුම බලන්න",
    familiesLine:
      "අපගේ ජීවිතයේ නව පරිච්ඡේදය ආරම්භ කිරීමට ඔබට ආදරයෙන් ඇරයුම් කරමු.",
    keepDate: "දිනය සටහන් කරගන්න",
    momentsTitle: "අපගේ සුන්දර මතක",
    seatTitle: "ඔබ වෙනුවෙන් වෙන්වූ අසුනක්",
    seatText:
      "ඔබගේ පැමිණීම අපගේ සැමරුම සම්පූර්ණ කරයි. මේ සුන්දර දිනය ඔබ සමඟ බෙදාගන්නට අපි බලා සිටිමු.",
  },
};
