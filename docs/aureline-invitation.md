#
The opening journey fills the screen edge to edge using a full-bleed image, with its focal point on the couple and car. The names overlay a soft gradient, while a gentle zoom settles into the scene. Twenty-seven colourful rings wind down the centre of the opening and invitation background. The film preview and download share the same renderer: both fit each whole photo inside its frame, with a small reveal that stays within those bounds.
 Aureline · Premium wedding journey

The background now uses 81 larger, softly glowing seed lanterns drifting down in new iris-violet (`#9748d6`), cerulean (`#087fb4`) and peridot (`#8aab28`) accents. Mobile shows 54. Eighteen slow edge glints add light without covering the couple. Their size, stroke and opacity are stronger than the original faint lights; the silk beams use the same accents. Edit `EFFECT_COLOURS`, `SEED_COUNT`, `SEEDS_PER_BAND` and `GLINT_COUNT` in `AurelineAtmosphere.tsx` to customize them. Existing motion settings, film-pausing and click-through behavior remain in effect.

Gallery photographs and thumbnails use `object-fit: contain`, so portrait couples and landscape photos remain complete. The large image sits on a softly tinted mat, with its caption beneath the picture. Hover effects highlight thumbnail borders without zooming or cropping the photo.

Aureline is an additional Premium template inspired by the second reference video. It follows the mandala welcome, illustrated vintage-car journey, white-petal transition, centered couple/date presentation, ceremonial procession, event timeline and mosaic photo story. Its own copper, glacier-blue and porcelain palette is distinct from Rosé Atelier and the Standard designs. The provided phone recording is a design reference; it is not published as an application asset.

- Preview: `/premium-invitation/aureline`
- Customize: `/premium-invitation?template=aureline`
- Guest concierge: `/premium-invitation/dashboard`

Existing saved drafts take priority over demo defaults. Choose **Aureline** in the editor to change an existing invitation's design while retaining names, photos, questions and guest data. The studio stores one Premium invitation per account. Choosing a template in the public preview resets its sample content; changing a template in the editor preserves the customer's content and applies that template's default palette/opening.

## The experience

The opening has an original editable mandala and an elephant procession. A deliberate tap reveals a cinematic 3D illustration of a Sri Lankan couple in a vintage convertible, with a short parallax drive and a white-petal transition. This is an animated illustration, not a newly generated video file. Guests can skip the 3.6-second intro. Reduced motion and the editor motion switch open the invitation immediately.

Opening options are Wedding Journey, Mandala Iris and Parchment Reveal. Inside the invitation, moving silk beams and rising seed lights replace falling rose petals and floral backgrounds. Animation styles are Journey, Breeze, Illumination and Still. New keyframes live in Aureline's stylesheet. The atmosphere disappears during film playback and respects reduced-motion preferences.

The wedding hero uses names, a three-part date ribbon and an illustrated couple, or the customer's uploaded portrait/background video. The second illustration is a transparent full-length couple, not a customer photograph. The gallery uses a mosaic with direct selection and slideshow controls. The generated 12-second silent keepsake has its own mandala movie artwork, shared between playback and export.

## Premium features

All Standard tools except custom URL editing remain available. Premium generates opaque permanent links. All 19 Premium additions use the existing persisted Premium services:

| Feature | Aureline implementation |
| --- | --- |
| Full custom design | A separate mandala/journey presentation and original artwork |
| Colour combinations | Copper & Porcelain, Inkstone & Juniper, Obsidian & Frost, plus custom colours |
| Fonts and typography | Four font families, heading scale and letter spacing |
| Animation effects | Silk light, rising seeds, illustrated reveal and mosaic printing |
| Custom video background | A supplied HTTPS video or the owner's uploaded video, with pause/play |
| Personalized layout | Ceremonial, portrait-first and centered compositions |
| Custom opening | Journey, iris and parchment, with a skip control |
| Wedding-video upload | Existing authenticated MP4/WebM storage and guest player |
| Multiple galleries | Up to three named galleries with direct photo and slideshow controls |
| Custom music upload | Authenticated MP3/WAV/OGG upload; play/pause and volume |
| Unlimited guests | No Standard 500-guest quota; fair use applies |
| Advanced management | Search, status filtering, groups, private notes, replies and CSV |
| Personal guest links | Random individual tokens and party-specific welcome/RSVP |
| Seating | Table capacities and atomic party assignments |
| Custom RSVP questions | Text/select questions with server-side required-answer validation |
| Analytics | Opens, personal-link opens, attendance and event totals |
| Password protection | Server-side protection for details, uploaded media and replies |
| Priority support | Persisted priority request queue and explicit support contact handoff |
| No branding | Guest invitation, password screen and metadata remain unbranded |

Uploads retain the Premium limits: 8 MB per media file and 80 MB of stored audio/video per account. Larger files can use direct HTTPS media URLs. The download is a separate 12-second silent movie, not a re-encoded uploaded film. Keep the tab visible while exporting. Priority support requests do not promise an automated response or SLA; follow up with the support team using the studio contact link.

## Beginner file map

| File | Change here |
| --- | --- |
| `src/lib/premium-invitation.ts` | `AURELINE_SAMPLE`, `AURELINE_PALETTES`, template defaults and validation |
| `src/components/premium/aureline/AurelineOrnaments.tsx` | Mandala linework and procession SVGs |
| `src/components/premium/aureline/AurelineWelcome.tsx` | Welcome text, illustrated opening and skip button |
| `src/components/premium/aureline/AurelineHero.tsx` | Couple/date layout and video control |
| `src/components/premium/aureline/AurelineGallery.tsx` | Mosaic, slideshow controls and `INTERVAL_MS` |
| `src/components/premium/aureline/AurelineAtmosphere.tsx` | Seed-light count and positions |
| `src/components/premium/aureline/Aureline.module.css` | Commented visual sections, timing and mobile rules |
| `src/lib/aureline-video.ts` | Movie artwork |

The shared `PremiumInvitation.tsx` selects the presentation and retains the working RSVP, music, sharing and film controls. CSS Modules `composes` reuses functional base controls. The ornaments are code-native vectors; the two character scenes are raster illustrations. Original raster images were created with the built-in **image_gen** tool, optimized with Sharp and saved into the project:

- `public/assets/aureline/journey.webp`
- `public/assets/aureline/couple.webp` (alpha preserved)

Run `npm run test:premium` and `npm run build`. Tests check backward compatibility for older Rosé drafts, template validation, palette independence, saved Aureline publishing, personal RSVP and seating, plus shared Premium privacy, upload ownership and unlimited-guest behavior.

## Illustration prompts

**Journey (built-in image_gen):** Create a polished cinematic 3D storybook wedding illustration for a premium Sri Lankan wedding invitation website, portrait 2:3. A smiling adult Sri Lankan bride and groom, full elegant ivory bridal saree and tasteful head jewelry for bride, groom wearing ivory and warm copper formal wedding suit, seated together in a beautiful vintage open-top silver and warm copper convertible sports car, front three-quarter view. Both are visible smiling warmly, groom at steering wheel. Car is centered in the lower half; ornate grille and round headlights, no visible brand badges or text. A winding stone terrace with balustrade among Sri Lankan hill country trees and mountains, soft dawn sky in pale glacier blue, porcelain white and muted copper. White flowering branches frame the sides; a few luminous motes in air. Refined charming realistic Pixar-like high-quality 3D animation artwork, sophisticated adult characters, silk textures and cinematic soft lighting, natural tasteful proportions. Upper third is mostly open luminous blue sky to overlay a wedding title. Distinct cool porcelain-blue and burnished copper palette, not pink, no dark red roses, no hearts, no stars, no lettering, no logo, no watermark, no phone UI. It should look like the first frame of a luxurious animated invitation journey, not a static wedding photograph. Save image and report local file path.

**Couple (built-in image_gen, journey used as character/style reference):** Use the newly generated vintage-car wedding illustration ONLY as a character/style reference. Create a NEW isolated full-length portrait of the same adult Sri Lankan bride and groom STANDING together, with a genuinely transparent background. The bride wears a refined ivory Kandyan bridal saree, delicate pearl/gold head jewelry and jasmine in her hair; groom wears an elegant ivory suit with a soft warm copper waistcoat and tie. They face one another lovingly, hands lightly joined, happy natural adult faces. Show both people fully from their hair to their shoes, with 8 percent clear transparent margin on all sides. Sophisticated cinematic 3D storybook style matching the reference, luminous porcelain fabric, beautifully detailed embroidery, natural adult proportions, refined and charming. Very subtle contact shadow beneath their shoes is okay, otherwise fully transparent. NO car, no scenery, no flowers in the background, no floor plane, no text, no logo, no badge, no watermark. This will be a cutout illustration placed on a pale glacier-blue wedding invitation. Save image and report local file path.
