# Saffron · Standard Plan

Saffron is an additional Standard template with marigold, oat and ink stationery. A side-opening envelope releases a photograph letter, followed by oversized names, an editorial photo journal, ticket countdown and falling paper confetti. The Vow, Solstice and Moonlit remain available.

- Preview: `/standard-invitation/saffron`
- Customize: `/standard-invitation?layout=saffron`
- Guest dashboard: `/standard-invitation/dashboard`

## Customer setup

Choose Saffron in the appearance editor. Choose Marigold & Oat, Cobalt & Butter, Ink & Citron or Persimmon & Linen, or use the custom colour pickers. All four fonts are supported. Upload your own portrait and up to six gallery photographs. Add family details, dates, wedding/homecoming venues, an RSVP deadline and playable HTTPS music/video links. Save and publish using a Studio account. Existing saved drafts take priority over demonstration content.

Print, Unfold, Confetti and Still use the existing animation codes with separate Saffron keyframes. The motion toggle and system reduced-motion preference disable decoration. Photo autoplay also follows the system preference; previous/next and thumbnails remain available. Confetti is decorative, ignores taps and pauses while the film dialog is open.

## All 17 Standard features

| Feature | Where it works |
| --- | --- |
| Animated invitation | Paper photo reveal, rising names and confetti |
| Invitation video | Built-in Saffron movie or a supplied direct video URL |
| Couple slideshow | Photo journal with thumbnail selection, previous/next and pause |
| Animated text | Oversized cover names with staggered entrance |
| Music controls | Play/pause and volume for a supplied audio file |
| Video background | Muted looping cover video with pause/play |
| Countdown | Ticket-style live countdown in Sri Lanka time |
| Animated envelope | Paper sleeve and sliding letter before opening |
| Animation styles | Print, Unfold, Confetti and Still |
| Personal welcome | Guest name from personal invitation links |
| Schedule | Each event has its own date, time, address and directions |
| Multiple events | Wedding, homecoming and up to five celebrations |
| Advanced RSVP | Attendance, party size, events, dietary needs and message |
| Guest tracking | Private dashboard with event counts, party totals and CSV |
| Custom URL | Unique published invitation slug |
| 500 guests | Shared server quota includes party sizes |
| Downloadable video | Saffron artwork exported as a 12-second silent WebM/MP4 |

Basic features are shared: account-saved drafts, photo uploads, family details, maps, no watermark, personal links and WhatsApp/email/QR sharing. Supplied audio/video must be playable media files, rather than YouTube or Spotify page links. Keep the browser tab visible during movie export; supported desktop Chrome/Edge browsers can create the keepsake. Background music plays separately from the silent exported film.

## Beginner editing map

| File | What to change |
| --- | --- |
| `src/lib/standard-invitation.ts` | `SAFFRON_SAMPLE`: demo names, dates, message and events |
| `src/lib/standard-appearance.ts` | `SAFFRON_PALETTES`: four colour sets |
| `src/components/invitation/saffron/SaffronCover.tsx` | Welcome, paper sleeve, cover and confetti count |
| `src/components/invitation/saffron/SaffronGallery.tsx` | `CAPTIONS`, `SLIDE_INTERVAL`, photo controls |
| `src/components/invitation/saffron/SaffronCountdown.tsx` | Countdown labels and time calculation |
| `src/components/invitation/saffron/Saffron.module.css` | Clearly commented design sections, animation speeds and mobile rules |
| `src/lib/saffron-video.ts` | Canvas artwork shared by playback and video export |

The shared `StandardInvitation.tsx` owns music, RSVP and sharing. Saffron components handle presentation. CSS Modules `composes` reuses working forms from the shared stylesheet before applying Saffron styles. All colours arrive through CSS variables, so customer choices apply to both the page and film. Demo photos appear only in sample previews; published invitations use customer uploads.

Run `npm run test:standard` and `npm run build`. Tests cover safe settings, independent colours, draft/publish persistence, personal event RSVP and the 500-place quota on an isolated test database.

Local sample photos: Unsplash IDs `1519741497674-611481863552` (cover), `1464366400600-7168b8af9bc3` (reception), `1537633552985-df8429e8048b` (couple), `1511795409834-ef04bbd61622` (table). Photographs are illustrative, not customer endorsements.
