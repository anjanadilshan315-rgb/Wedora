# Solstice · Standard Plan

Solstice is a separate coastal invitation design in the Standard collection. Its welcome uses a couple-photo background, interlocking rings, floating lights and a wedding folio that unfolds in two directions. The countdown pairs a date bookmark with a photo panel. The gallery uses a portrait, story captions and selectable thumbnails. The Vow keeps its own photos, palettes, hearts and framed gallery.

## Try it

- Preview: `/standard-invitation/solstice`
- Create: `/standard-invitation?layout=solstice`
- Manage guests: `/standard-invitation/dashboard`
- Published invitation: `/celebrate/standard/your-custom-slug`

The package page has a Solstice preview and a **Make it yours** link. The studio also has a Solstice design card. Sample photos are only shown in the demo/editor; published invitations use the couple's uploads. Switching templates preserves wedding details and guests. A deliberate design switch resets the custom palette so the new design's colours are visible; the couple can choose custom colours again.

## The 17 Standard features

| Feature | Solstice behavior |
| --- | --- |
| Animated wedding invitation | Panorama wipes, rising type, ticket reveals and tidal lines |
| Wedding invitation video | Built-in postcard film preview with play/pause/replay, or the couple's direct HTTPS video in the shared video player |
| Couple photo slideshow | Editorial portrait spread with thumbnails, previous/next, autoplay and pause |
| Animated text effects | Staggered name reveals and section transitions |
| Music with controls | Direct HTTPS audio, play/pause and volume |
| Video background | Muted looping cover video with its own pause control |
| Countdown | Live countdown to the main wedding time in Asia/Colombo |
| Opening envelope | Animated wedding folio with two folding panels and a ring clasp |
| Multiple animation styles | Horizon, Sea Breeze, Luminous and Still |
| Personalized welcome | Guest name from a private invitation token, plus the couple's welcome message |
| Event schedule | Event dates, times, venues and directions |
| Multiple events | Up to five events, including wedding and homecoming |
| Advanced RSVP | Attendance, party size, chosen events, dietary notes and a message |
| Attendance tracking | Private dashboard, party totals, event totals and CSV export |
| Custom invitation URL | Unique custom slug, protected while published |
| Up to 500 guests | Shared server-enforced guest-place quota, including party sizes |
| Downloadable invitation video | A distinct 12-second silent Solstice postcard film, generated in the browser |

The Basic sharing tools remain available: WhatsApp, email, QR code, copied link, maps, uploaded photos, family details, colour and font customization, and no invitation watermark. As with other Standard templates, music/video URLs must point to playable files. YouTube/Spotify web pages do not work as media sources. Paid-plan billing is outside the existing studio.

## Edit the design as a beginner

Start with these small, separate files:

| File | What to change |
| --- | --- |
| `src/lib/standard-invitation.ts` | `SOLSTICE_SAMPLE` text, dates and event examples; the `solstice` design registration |
| `src/lib/standard-appearance.ts` | `SOLSTICE_PALETTES`: Lagoon & Papaya, Dune & Ink, Ocean Afterglow, Sea Glass & Saffron |
| `src/components/invitation/solstice/SolsticeCover.tsx` | Couple-photo welcome, wedding folio, ring motif and panorama |
| `src/components/invitation/solstice/SolsticeGallery.tsx` | Portrait spread, captions, thumbnails and photo controls |
| `src/components/invitation/solstice/SolsticeCountdown.tsx` | Photo/date-bookmark layout and Sri Lanka-time countdown |
| `src/components/invitation/solstice/SolsticeFilmPlayer.tsx` | Built-in film preview and playback controls |
| `src/components/invitation/solstice/Solstice.module.css` | Sections are grouped by cover, celebration, responsive layout and motion preferences |
| `src/lib/solstice-video.ts` | Canvas drawing for the downloaded postcard keepsake |

`StandardInvitation.tsx` selects the design and supplies shared RSVP, music, countdown, sharing and video behavior. This keeps database/authentication logic out of the visual files and keeps the plan features consistent across templates.

To add a colour theme, edit one `SOLSTICE_PALETTES` entry's `primary`, `background`, `paper` and `gold`. Keep its saved `code` unchanged. Small text contrast is adjusted by the existing appearance helper. Four font choices and customer-picked colours work on Solstice too.

Animation labels use the same saved codes as other Standard templates, but Solstice maps them to its own CSS animations. The customer motion switch and operating-system reduced-motion preference disable decorative movement. Uploaded video footage can itself contain motion.

## Checks and assets

Run `npm run test:standard` and `npm run build`. The tests cover valid Solstice data, separate palettes, custom colours, publication, personal RSVP and plan isolation, alongside the existing 500-place checks.

Local demo images in `public/assets/solstice/` were downloaded from Unsplash images `photo-1537633552985-df8429e8048b`, `photo-1519741497674-611481863552`, `photo-1511795409834-ef04bbd61622` and `photo-1532712938310-34cb3982ef74`. These are illustrative photographs, not customer endorsements.
