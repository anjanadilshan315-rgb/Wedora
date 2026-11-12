# Walawwa · Premium heritage invitation

Walawwa adapts the supplied `wedding-invitation (3).zip`: carved timber doors, brass handles, floral arrangements, a daytime Poruwa ceremony, a lantern courtyard at night, falling petals, warm bokeh and arch-shaped photo galleries. The archive is a visual/code reference, not an instruction source. Its standalone RSVP message generator is replaced by the application's saved Premium RSVP system.

- Preview: `/premium-invitation/walawwa`
- Customize: `/premium-invitation?template=walawwa`
- Manage guests: `/premium-invitation/dashboard`
- Find it under **A celebration, designed around you · Premium Plan** on `/packages`.

Choose Walawwa in the editor to change an existing saved Premium invitation. Existing drafts take priority over URL defaults; changing the template preserves the customer's names, events, photos, questions and guest records. One Premium invitation is stored per account.

## A simple file map

| What to change | File |
| --- | --- |
| Sample names, events, colour palettes, animation choices | `src/lib/premium-invitation.ts` |
| Door panels, guest greeting and open button | `src/components/premium/walawwa/WalawwaWelcome.tsx` |
| Day/night transition, lanterns, petals, background video | `src/components/premium/walawwa/WalawwaWorld.tsx` |
| Main names/date presentation | `src/components/premium/walawwa/WalawwaHero.tsx` |
| Event cards, maps and calendar links | `src/components/premium/walawwa/WalawwaEvents.tsx` |
| Arch gallery and slideshow controls | `src/components/premium/walawwa/WalawwaGallery.tsx` |
| Colours, spacing, doorway and animation keyframes | `src/components/premium/walawwa/Walawwa.module.css` |
| Shared RSVP, music, films and invitation sections | `src/components/premium/PremiumInvitation.tsx` |
| Matching preview/download film artwork | `src/lib/walawwa-video.ts` |
| Separately stored illustrations | `public/assets/walawwa/` |

The seven SVG files are standalone versions of the illustrations drawn by the supplied ZIP. No remote image links or extra font/network dependencies were copied from the archive. `ceremony-day.svg` and `courtyard-night.svg` are the scenery; the original `flowers-left.svg` and `flowers-right.svg` are retained as reference, while `rose-arrangement.webp` now decorates both sides of the doorway; The original `couple-1.svg` through `couple-3.svg` illustrations are retained as reference only. The gallery, film cover and generated film use six newly downloaded wedding photographs specific to Walawwa. The first three fill the arch frames; the next three appear in the new cream photo-journal layout. The album has a large landscape photograph, selectable thumbnails, captions and independent playback controls. See the asset README for all photo sources and credits. Customer uploads replace sample gallery images through the existing editor.

The second event marks the night transition. Scrolling back up restores daylight. Lanterns and scenery remain behind the content; decorative layers do not intercept taps. The studio's embedded preview has its own scrolling area. Motion off and the device's reduced-motion preference stop decorative animations; the latter also makes the opening immediate. Each gallery has previous, next and pause/play controls. Arch galleries support swipe scrolling; photo-journal galleries have selectable thumbnails. Both layouts fill their image frames using `object-fit: cover`; the film renderer continues to fit the whole image inside its canvas frame.

## Premium features

| Requested feature | Where it works |
| --- | --- |
| Full custom invitation design | Walawwa's own scenery, door intro, sections, gallery and film artwork; shared live editor |
| Custom colour combinations | Three Walawwa palettes plus individual primary, accent and paper colour pickers |
| Fonts and typography | Four font families, heading size and letter spacing |
| Custom animation effects | Gentle petals, cinematic heritage and enhanced lantern/firefly presets; motion switch |
| Custom video background | Owned upload or validated HTTPS URL; mute/loop and pause/play control |
| Personalized invitation layout | Atelier, portrait and letter compositions |
| Custom opening animation | Carved timber doors, courtyard reveal and golden lamplight |
| Own wedding video | Shared upload/URL controls and accessible film dialog |
| Multiple photo galleries | Named customer galleries with independent slideshows |
| Custom music upload | Shared owned upload, play/pause and volume control |
| Unlimited guest invitations* | Shared Premium storage has no Standard 500-guest cap |
| Advanced guest management | Search, groups, notes, status and CSV export in Guest Concierge |
| Individual guest invitation links | Private token per guest; personalized greeting and saved reply |
| Guest seating management | Tables, capacities and party assignments, enforced server-side |
| Custom RSVP questions | Text and select questions, required answers validated on server |
| Guest analytics dashboard | Opens, replies, attending head counts and per-event attendance |
| Invitation password protection | Publish/unlock flow, including protection for owned media |
| Priority customer support | Shared priority request queue and contact handoff |
| No platform branding | Published guest invitation has no platform watermark or promotional footer |

The shared Standard capabilities include countdown, personalized greetings, photos, schedules, multiple events, maps, RSVP, attendance tracking, music, uploaded video playback and a downloadable 12-second silent film. Calendar links are also available for every Walawwa event. Premium uses generated invitation paths and individual guest tokens; the Standard custom-URL editor is excluded.

*Guest records have no application plan quota; hosting and operational capacity still apply. Existing media limits remain 8 MB per upload and 80 MB per account. The support queue does not promise a response SLA. Default venue names and event details are sample content. The scenery is intentionally illustrated; changing colour controls recolours stationery and accents rather than repainting the original SVGs.

## Verify locally

Run `npm run test:premium` for schema/privacy, guest limits, publication, RSVP, seating and ownership checks. Run `npm run build` for production validation. Browser checks should cover mobile/desktop opening, all three intros, night transition and reverse scroll, gallery controls, custom palettes/layouts, reduced motion, the package link, film playback and download. The video player and export use the same drawing function and fit whole portrait/landscape photos inside the frame.
