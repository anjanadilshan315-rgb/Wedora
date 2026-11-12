# Moonlit · Standard Plan

Moonlit is an additional template. It has its own midnight/pearl palettes, photographs, envelope, cinematic cover, pearl-card countdown, floating Afterglow photo stage and evening-film artwork. Existing designs remain selectable.

- Preview: `/standard-invitation/moonlit`
- Create: `/standard-invitation?layout=moonlit`
- Private guest dashboard: `/standard-invitation/dashboard`

## Make it yours

Choose **Moonlit** in the studio, then select Velvet & Opal, Deep Lagoon & Opal, Graphite & Copper, or Dusk & Iris. Customers can also choose custom colours and any signature font. Upload a couple portrait and up to six gallery photos, add event details, then save and publish with a Studio account. Drafts belonging to existing accounts take priority over sample content.

Animation choices are Eclipse, Drift, Constellation and Still. They share the existing saved animation codes, but Moonlit has its own CSS keyframes. Decorative stars and shooting light respect the motion switch and reduced-motion preference. A published invitation uses the customer's uploaded pictures, not demo photos.

## Afterglow styling and background motion

The gallery now uses a single cinematic photo with a floating glass thumbnail tray, caption transitions, a gently drifting outline and opal sparkles. The invitation interior has slow aurora ribbons, 24 opal lights, 48 falling luminous petals and four shooting-star trails. On mobile, 32 petals remain visible. All decoration ignores clicks, disappears while the film dialog is open, and respects reduced-motion preferences and the studio motion toggle. Edit `PETAL_COUNT` and `LIGHT_COUNT` in `MoonlitAtmosphere.tsx` to change the density; the CSS controls speed and shape. Custom colours remain available; the new palettes preserve existing saved colour codes.

For a beginner, start with `MoonlitGallery.tsx`: edit `CAPTIONS` and `SLIDE_INTERVAL_MS` at the top. Appearance rules live separately in `AfterglowGallery.module.css`. Background decoration is isolated in `MoonlitAtmosphere.tsx` and `MoonlitAtmosphere.module.css`. Each file explains its purpose. The motion switch and reduced-motion preference disable decorative effects; slideshow autoplay responds immediately when the preference changes.

## All 17 Standard features

| Feature | Implementation |
| --- | --- |
| Animated invitation | Eclipse cover reveal, rising typography and constellation effects |
| Invitation video | Built-in evening-film player, or a direct HTTPS video supplied by the couple |
| Photo slideshow | Floating glass thumbnails, a cinematic photograph, direct selection, previous/next and pause |
| Animated text | Separate Moonlit name and photo transitions |
| Music controls | Shared play/pause and volume, using the couple's HTTPS audio URL |
| Video background | Full-cover muted video with its own pause/play control |
| Countdown | Pearl-card countdown, using the wedding time in Asia/Colombo |
| Opening envelope | Floating portrait card with a satin ribbon, diamond monogram and animated ribbon release |
| Multiple animation styles | Eclipse, Drift, Constellation and Still |
| Personalized welcome | Couple message and guest name from a personal invitation link |
| Event schedule | Individual dates, times, venues and directions |
| Multiple events | Wedding, homecoming and up to five total events |
| Advanced RSVP | Party size, selected events, dietary requirements and message |
| Attendance tracking | Private dashboard with party totals, event counts and CSV export |
| Custom URL | Unique slug with the existing publication protections |
| Up to 500 guests | Server-enforced quota, including party sizes |
| Downloadable video | Distinct 12-second silent Moonlit movie in the browser's supported WebM/MP4 format |

Basic tools remain shared: photo uploads, family details, colour/font controls, no watermark, venue maps, guest management, personal links, WhatsApp/email/QR sharing and account-saved drafts. Audio/video links must point to playable files; YouTube/Spotify web pages are not audio/video files. Keep the tab visible while exporting the film. No payment/billing flow is added.

## Portrait welcome cover

The welcome uses a ribbon-wrapped portrait invitation instead of the original triangular envelope. A softly moving couple photo sits behind the heading, while the portrait card floats beside it. Tapping the card releases the satin ribbon before the invitation opens. The controls retain the same personalization and music-start behavior.

Edit `MoonlitEntrance.tsx` for the welcome headline, button labels and card content. `MoonlitEntrance.module.css` groups the background, ribbon, opening state and mobile rules. Customer-uploaded photos take priority over demo images. Reduced motion and the studio motion setting disable decorative animation.

## Beginner editing map

| File | Edit here |
| --- | --- |
| `src/lib/standard-invitation.ts` | `MOONLIT_SAMPLE`: example names, dates and events |
| `src/lib/standard-appearance.ts` | `MOONLIT_PALETTES`: four colour sets |
| `src/components/invitation/moonlit/MoonlitCover.tsx` | Welcome entry point, stars and cinematic hero |
| `src/components/invitation/moonlit/MoonlitGallery.tsx` | Afterglow photograph, captions and slideshow controls |
| `src/components/invitation/moonlit/MoonlitCountdown.tsx` | Countdown layout and time calculation |
| `src/components/invitation/moonlit/Moonlit.module.css` | Design sections, animations and responsive rules |
| `src/lib/moonlit-video.ts` | Artwork shared by playback and exported movie |

The stylesheet uses CSS Modules `composes` to reuse functional Standard controls. A class such as `.rsvpForm` keeps the base form rules, then applies Moonlit's own treatment. `StandardInvitation.tsx` selects the template and provides shared publishing, RSVP, music and sharing behavior. The existing film-player component is reused with the Moonlit frame renderer, so preview and download share the same artwork.

Run `npm run test:standard` and `npm run build`. Tests verify layout validation, palette independence, publication, RSVP party sizes, event choices and the 500-place quota. The integration test uses a separate local database.

Local sample photographs were downloaded from Unsplash IDs `photo-1591604466107-ec97de577aff` (cover), `photo-1523438885200-e635ba2c371e`, `photo-1529636798458-92182e662485` and `photo-1515934751635-c81c6bc9a2d8`. Sample people are not customers or endorsements.

## Framed evening refresh

The interior cover now pairs centered wedding names with an arch-framed portrait, fine offset border and a floating date card. The welcome portrait follows the same arch shape, retaining its ribbon release. The countdown is a pearl stationery keepsake with four small arch cards, and Afterglow has an asymmetric photo frame. Customer palettes, fonts, background video controls, RSVP and decorative-motion settings remain shared.

Edit `MoonlitHero.module.css` for the interior cover and `MoonlitCountdown.module.css` for the countdown. Their corresponding TSX components keep content separate from styling. Both layouts stack on mobile and respect reduced motion.
