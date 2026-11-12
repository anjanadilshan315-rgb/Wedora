# Rosé Atelier · Premium Plan

Premium also includes [Aureline](aureline-invitation.md), a separate mandala-and-journey template with its own illustrations, palette collection, opening styles and visual effects. Select either design in the shared editor.

The welcome now uses photographic floral stationery and a realistic embossed crimson envelope matching the supplied screenshot, with additional lights, sparkles and butterflies. See the [artwork files and generation prompts](rose-atelier-artwork.md).

A separate Premium invitation inspired by the supplied video: blush stationery, burgundy botanicals, an embossed floral envelope with a metallic wax seal, soft falling petals, centered wedding typography, arch event cards and a compact bottom navigation. The original reference video stays outside public assets and is not published.

- Experience: `/premium-invitation/preview`
- Create and customize: `/premium-invitation`
- Guests, seating and analytics: `/premium-invitation/dashboard`
- Published invitation: `/celebrate/premium/<generated-id>`

Premium includes the Standard guest experience except custom URL editing. The server generates its permanent opaque link. Guest invitations have no 500-place quota; fair use, request rate limits and media storage limits still apply. One invitation is saved per account in the separate Premium tables. Existing Studio accounts work here.

## All 19 Premium additions

| Feature | Implementation |
| --- | --- |
| Full custom design | Separate Rosé Atelier components and original vector botanicals |
| Custom colour combinations | Three starting palettes and three colour pickers, with readable text colours |
| Custom typography | Four font families, heading scale and tracking controls |
| Custom animation effects | Petal drift, photographic reveal, breathing botanicals and Still |
| Custom video background | HTTPS video or an uploaded video, with pause/play controls |
| Personalized layout | Atelier, portrait editorial and intimate letter compositions |
| Custom opening | Wax seal, silk curtain and bloom openings |
| Upload wedding video | MP4/WebM upload and controlled guest playback |
| Multiple galleries | Up to three named galleries, each with four photos and slideshow controls |
| Custom music upload | MP3/WAV/OGG upload, guest play/pause and volume |
| Unlimited guest invitations | No per-plan guest quota in Premium server operations |
| Advanced guest management | Search, attendance filter, editable names/groups, private notes, replies and CSV |
| Individual guest links | Random personal tokens; linked replies update that party |
| Seating management | Named tables, capacities and party assignments; capacity enforced atomically on assignment and RSVP |
| Custom RSVP questions | Up to eight text/select questions, optional or required for attending guests |
| Analytics | Page opens, opened personal links, reply states, people attending and event totals |
| Password protection | Server-enforced password before details/media/RSVP; scrypt hashes and revocable access cookies |
| Priority support | Saved priority request queue and explicit contact link to the existing support number |
| No platform branding | Guest invitation, password gate and error screens contain no platform logo, watermark or attribution |

Priority requests are stored with status `priority-queued`. The studio provides a contact handoff; it does not promise an automated email, staffed response or SLA. Operations staff need their existing support process to follow up. The implementation adds no billing or payment workflow.

Standard tools retained: animated invitation, animated names, invitation movie player, photo slideshows, music controls, background video, Sri Lanka countdown, opening animation, multiple events, schedule/maps, personal welcome, party RSVP, dietary notes, attendance tracking, QR/WhatsApp/email sharing and a downloadable 12-second silent invitation movie. No externally hosted fonts or arbitrary CSS are accepted from guests or editor inputs.

## Quick setup

1. Open the editor; choose the composition, font, palette and opening effect.
2. Add names, message, dates, family details, venue and optional WhatsApp/maps.
3. Upload the portrait and gallery photos. Preview photographs are illustrative; they are not saved into the customer's live invitation.
4. Sign in using a Studio account to upload media, save and publish.
5. Add event details, RSVP questions and seating tables. Save before assigning guests.
6. Optionally enable a shared invitation password. Keep it separate from the account password. Password changes take effect on publication.
7. Publish, add guests, assign seats and share individual links from Guest Concierge.

Photo inputs accept JPEG/PNG/WebP up to 10 MB and resize them before saving. Audio/video upload limits are 8 MB per file and 80 MB of stored audio/video per account. Larger media can use direct HTTPS file links. YouTube/Spotify page URLs are not playable media files. The keepsake export is a separate silent movie; it does not include uploaded music or re-encode the customer's uploaded film. Keep the tab visible during export. A modern Chrome/Edge browser is recommended for recording.

Uploaded audio/video lives in `premium_media` BLOBs in the configured SQLite/libSQL database. Configure a persistent database in production using the existing Studio database guide. Hosting/request limits may require smaller uploads or external media storage. Old uploads remain stored when detached from a draft; contact support to arrange storage cleanup. No guest data is stored only in browser local storage.

The Next.js configuration excludes `.data` from server bundle traces. Runtime databases and QA profiles are local/persistent runtime state, never application source to ship with a build.

Password protection covers the invitation's details, uploaded audio/video and replies. Direct external HTTPS media hosts remain responsible for their own access control. Names in the private guest list, planning notes, password hashes and the full seating plan are never returned by the public API. A guest sees only their own assigned table. Page-open analytics are page loads rather than unique visitors.

## Beginner editing map

| File | Edit here |
| --- | --- |
| `src/lib/premium-invitation.ts` | Demo content, types, validation, analytics and CSV |
| `src/components/premium/PremiumFlorals.tsx` | Original burgundy vector flowers and leaves |
| `src/components/premium/PremiumInvitation.tsx` | Welcome, envelope, celebration, media and guest RSVP |
| `src/components/premium/PremiumInvitation.module.css` | Clearly separated stationery, opening, mobile and motion sections |
| `src/components/premium/PremiumGallery.tsx` | Slideshow and thumbnails |
| `src/components/premium/PremiumStudio.tsx` | Customer editor, uploads, privacy and support forms |
| `src/components/premium/PremiumDashboard.tsx` | Guest list, seating, analytics and exports |
| `src/lib/premium-video.ts` | Movie artwork reused by playback and export |
| `src/lib/server/premium-studio.ts` | Private persistence, passwords, seating capacity and media access |
| `src/app/api/premium/[[...path]]/route.ts` | Same-origin API, session cookies, rate limits and media byte ranges |

`npm run test:premium` uses an isolated disposable database. It checks protected publishing, ownership, upload boundaries, access revocation, RSVP questions, seating capacity, more than 500 guests and private analytics. `npm run build` verifies all routes. Shared Standard/Basic/Free tests verify existing packages remain independent.
