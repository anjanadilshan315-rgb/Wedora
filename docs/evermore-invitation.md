# Evermore · video-opening wedding invitation

Evermore adapts the updated `wedding-invitation (3).zip` supplied on November 12, 2026 into this project's Next.js App Router, React, TypeScript and CSS Modules. It is an additional Premium template; the existing invitation designs remain selectable.

- Preview: `/premium-invitation/evermore`
- Customize: `/premium-invitation?template=evermore`
- Guest management: `/premium-invitation/dashboard`
- Collection: **A celebration, designed around you · Premium Plan** on `/packages`

Existing saved drafts take priority over a URL's sample selection. Select Evermore in the editor to change an existing invitation while keeping the customer's wedding details, media and guest data. Each account still stores one Premium invitation.

## What was adapted from the ZIP

| Reference section                                     | Application implementation                                                                    |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Illustrated splash with Open Invitation button        | Full-screen supplied wedding video, personalised greeting, pause/play and three reveal styles |
| Floral arch with the couple's names / Getting Married | Floral arch stationery with an animated, softened video backdrop                              |
| Three alternating photo-story rows                    | Three organic photo frames, captions and scroll reveals                                       |
| Cordial invitation and couple portrait                | Invitation note, new wedding portrait and customer message                                    |
| Two family/name cards                                 | Responsive family cards with central ampersand                                                |
| Date/time, Poruwa, countdown                          | Editable event schedule, Sri Lanka times and live countdown                                   |
| Venue and directions                                  | Per-event venue/address, map links and calendar links                                         |
| RSVP and best wishes                                  | Real saved Premium RSVP, custom questions, dietary notes and wishes sent in its message field |
| Floral closing                                        | Personal closing and links to replay the opening                                              |

The archive's browser-only `localStorage` RSVP and public wishes list are not presented as server delivery. Wishes are sent privately to the couple with the saved RSVP, where they appear in Guest Concierge. No separate public guestbook is claimed.

## Beginner-friendly file map

| File                                                     | Responsibility                                                                            |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/lib/premium-invitation.ts`                          | `EVERMORE_SAMPLE`, new palettes, photo paths and allowed opening styles                   |
| `src/components/premium/evermore/EvermoreWelcome.tsx`    | Film welcome, guest name and open button                                                  |
| `src/components/premium/evermore/EvermoreVideo.tsx`      | Reusable muted video with pause/play, viewport pause, poster and reduced-motion behaviour |
| `src/components/premium/evermore/EvermoreHero.tsx`       | Floral arch and soft moving video background                                              |
| `src/components/premium/evermore/EvermoreGallery.tsx`    | Alternating story rows and an independent keepsake slideshow                              |
| `src/components/premium/evermore/EvermoreFamilies.tsx`   | Cordial invitation, portrait and family cards                                             |
| `src/components/premium/evermore/EvermoreEvents.tsx`     | Event times, venues, calendar and directions                                              |
| `src/components/premium/evermore/EvermoreAtmosphere.tsx` | Floating petal lights, silk illumination and reveal observer                              |
| `src/components/premium/evermore/Evermore.module.css`    | Numbered style sections, responsive layouts and named animation keyframes                 |
| `src/components/premium/PremiumInvitation.tsx`           | Shared music, RSVP, sharing, privacy-facing guest content and film dialog                 |
| `src/lib/evermore-video.ts`                              | Same matching canvas artwork for film playback and download                               |
| `public/assets/evermore/`                                | All new photographs, supplied video, poster and floral corner                             |

To edit sample content, begin with `EVERMORE_SAMPLE`. To change spacing or the visual style, work in the numbered CSS sections. Change a single presentation component at a time; shared RSVP and guest management do not need to be copied into another application. All asset paths are ordinary local URLs, not base64 strings embedded in components.

## Media and appearance

The opening uses the supplied `14249219_1920_1080_100fps.mp4`, saved as `opening-hands.mp4`. Its measured length is 14.43 seconds at 1920×1080. The welcome and soft cover backdrop loop it muted; music plays separately through the existing controls. The source is preserved rather than re-encoded. `opening-poster.png` is an actual frame captured from the clip at four seconds.

The video initially loads metadata and a poster. Muted autoplay is attempted only in the viewport when decorative motion is enabled. A visible pause/play control allows manual playback; a blocked autoplay attempt leaves a play control. Scrolling the video out of view pauses it. Device reduced motion or the editor's motion-off setting suppresses autoplay and decorative animations. Guests may explicitly play the film themselves. A failed media URL leaves the poster and still allows opening the invitation.

Three new romantic palettes are provided: **Amethyst & Peach**, **Fig & Honey** and **Wisteria & Pearl**. Customers can also choose individual colours, four font families, heading scale, spacing, three layouts and three opening effects: film, silk ribbon or petal light. The uploaded wedding video, background video, music, galleries, custom questions, guest links, seating, analytics and password protection use the existing Premium editor/backend.

The cover now uses a transparent photorealistic rose/orchid corner instead of the ZIP illustration; see [the floral artwork and animation guide](evermore-flower-artwork.md). Its film backdrop is more visible, while the stronger paper name panel preserves readability. The opened invitation includes 72 highlighted coloured petals and 27 edge sparkles, with 48 petals shown on mobile. The four new sample photographs were downloaded specifically for Evermore and are stored separately. See the asset README for photographer credits, source links and image IDs. Sample names/venues are illustrative; photos are not endorsements or a claim to depict the named sample couple. Published invitations use customer uploads for portrait/gallery content. The supplied opening clip and floral decoration remain part of the template.

The downloadable invitation film is a separate 12-second silent keepsake using Evermore's colours, arch and photos. It is not advertised as a download of the uploaded clip. The player and exporter share one renderer, and portrait/landscape photos fit fully within its canvas frame. Existing media limits and Premium operational limits remain unchanged.

## Verification

Run `npm run test:premium` and `npm run build`. Browser checks cover real video playback and pause, all openings, mobile/desktop, the ZIP-inspired section flow, background video pause outside the viewport, story/keepsake photos, RSVP fields, film playback/download, palettes/layouts, motion settings, the package link and an existing-template regression check.
