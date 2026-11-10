# Standard Plan · The Vow

The Standard package card at `/packages` opens the editor and includes a full-screen sample invitation.

| Route | Purpose |
| --- | --- |
| `/standard-invitation/preview` | Sample invitation with animated envelope |
| `/standard-invitation` | Editor, live preview, save and publish |
| `/standard-invitation/dashboard` | Private guest list, party totals, event attendance, dietary notes, messages and CSV export |
| `/celebrate/standard/[slug]` | Published invitation with optional `?guest=TOKEN` personalization |

## Create and share

1. Open the editor and choose The Vow, Secret Garden or Modern Muse. Select a colour theme or open **Make your own colour palette** to choose main, accent and paper colours. Choose one of four signature fonts and cinematic, romantic, enchanted or minimal animation. The live preview updates immediately. Accent text contrast adjusts automatically; the chosen colours, font and design are saved with your invitation. Existing invitations default to The Vow and Classic Romance.
2. Add names, families, wedding date/time, venue and reply deadline. Times use Asia/Colombo.
3. Upload the cover photograph and up to six slideshow photos. Preview photographs are illustrative samples; they are never saved as the couple's photos or included in a published invitation.
4. Add a welcome message, optional custom slug, and direct HTTPS links for music, the invitation film and the background video. YouTube and Spotify page links cannot play in these media elements.
5. Add up to five celebrations, including a wedding and homecoming. Each has a separate date, time and venue. The main wedding date controls the countdown; edit event details separately.
6. Register or sign in using the existing Studio account, save the draft, then publish. Draft changes become public only when published again.
7. Open the dashboard, add guests and share personal links by WhatsApp, email, copied link or QR code. Generic-link guests can also respond. Refresh the dashboard for new replies.

RSVP collects attendance, party size (1–10), selected events, dietary requirements and a message. The server enforces a total of 500 places: pending and declined guest entries reserve one place each, while attending parties reserve their stated party size. Guest lists remain private. Personal links and the returning guest cookie let a guest update their reply. RSVP closes after the configured deadline in Sri Lankan time.

Custom slugs use 3–64 lowercase letters, digits and single hyphens. They must be unique. Unpublish before changing an existing URL; previously shared links will stop working.

## Media and download

Music begins with the invitation-opening gesture when a valid audio URL is present. Guests can pause it and adjust volume. Background videos play muted with a pause control. HTTPS media must remain publicly accessible; host the files on your own media service. Uploaded photos are compressed before saving, as in the Basic Plan.

The **Download invitation film** button renders a 12-second silent portrait keepsake from the names, date, venue and uploaded photos. It exports WebM or MP4 according to browser support. Use current desktop Chrome/Edge and keep the tab visible while rendering. This exported keepsake is separate from the optional externally hosted invitation film; it does not embed the music track.

The decorative motion setting lets you disable animated petals, sparkles, botanical movement, floating date cards, staggered text and scroll reveals. Reduced-motion preferences also disable CSS motion and automatic slideshow advancement. Guests can control slides manually. Actual uploaded videos may contain motion.

The sample preview has design, colour and font selectors. **Make it yours** carries these selections into the editor. The downloadable film also uses the selected font and main colour.

The **Our kind of magic** section is a compact framed album: a central slideshow and two smaller clickable keepsake photographs. The demo includes four local sample photos. Uploading your own photos replaces sample imagery; fewer than three uploads gracefully show fewer frames. The gallery includes previous/next, direct photo selection and pause controls. Standard has its own Rosewater & Berry, Lilac & Plum, Midnight Romance and Peach & Terracotta palettes; Basic palettes are unchanged. Decorative hearts fall behind the invitation, while frames drift gently. The existing motion toggle, minimal animation style and reduced-motion preference suppress decorative movement.

## Development

Run `npm run test:standard` for validation, CSV safety, draft/publication isolation, custom URL conflicts, advanced RSVP persistence, cross-plan separation and guest-cap enforcement.

The Standard studio uses the existing private Studio session and `FREE_DATABASE_URL` configuration documented in [Free Studio setup](free-invitation.md). Tables `standard_invitations` and `standard_guests` are created automatically, independently of Free and Basic invitations. Production needs persistent storage or a remote libSQL database; the existing database guard still applies. Paid-plan billing and payment verification are not implemented by this studio.

Main files:

- `src/components/invitation/StandardInvitation.tsx` and `.module.css`: guest design and interactions.
- `src/components/standard-studio/StandardStudio.tsx`: editor and private dashboard.
- `src/lib/standard-invitation.ts`: types, demo content and validation.
- `src/lib/server/standard-studio.ts`: persistence, publication, quota and RSVP.
- `src/app/api/standard/[[...path]]/route.ts`: same-origin, authenticated API.
- `src/lib/invitation-video.ts`: browser video renderer.

The local demo photographs in `public/assets/standard/` come from the Unsplash image URLs already used in the project sample gallery: `photo-1511285560929-80b456fea0bc`, `photo-1520854221256-17451cc331bf`, `photo-1519225421980-715cb0215aed` and `photo-1606800052052-a08af7148866`.
