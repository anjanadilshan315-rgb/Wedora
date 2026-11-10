# Basic invitation — beginner guide

Open `/packages` and choose **Create Basic invitation**, or visit
`http://localhost:3000/basic-invitation` after `npm run dev`.

## භාවිත කරන ආකාරය

1. Basic Wedding Invitation, Ever After Editorial, Botanical Vow හෝ Maison Amour template එක තෝරා Royal Ivory, Sage Garden, Midnight Gold හෝ Rose Blush colour theme එක තෝරන්න.
2. නම්, පවුලේ විස්තර, දිනය, වේලාව, ස්ථානය සහ invitation message එක ඇතුළත් කරන්න.
3. Couple photo එක upload කරන්න. අවශ්‍ය නම් direct HTTPS music link සහ Google Maps link එක ඇතුළත් කරන්න.
4. Account එකක් සාදා හෝ දැනට තිබෙන Free Studio account එකෙන් sign in වී **Save draft** ඔබන්න.
5. Preview එක පරීක්ෂා කර **Publish invitation** ඔබන්න.
6. Link එක WhatsApp/email හරහා share කරන්න හෝ QR code එක download කරන්න.
7. **Guest dashboard** එකෙන් guests එකතු කර personal links share කරන්න. RSVP replies සහ guest counts එහි පෙන්වයි.

## What is included

| Basic feature | Where it works |
| --- | --- |
| Premium static templates and multiple designs | Basic arch, Ever After Editorial, Botanical Vow and Maison Amour layouts, each with four colour themes |
| Couple photo upload | JPG/PNG/WebP, up to 10 MB; browser resizes to 1400px and saves a compressed photo with the draft |
| Background music | Optional direct HTTPS audio URL, played with a guest-controlled play/pause button |
| Custom wedding message | Up to 600 characters; line breaks preserved |
| Google Maps | Embedded venue/address map plus an optional Google Maps share link for directions |
| RSVP with name | General guests enter a name; personal links identify the invited guest |
| Guest management | Add, search, remove, refresh and export guest CSV in `/basic-invitation/dashboard` |
| WhatsApp and email | Opens WhatsApp or the guest's configured email app with invitation text and link |
| Invitation QR | Locally generated downloadable PNG, including personal guest links |
| Guest counts | Total, attending, declined and awaiting reply |
| No watermark | Shared invitation has no Forever branding |
| Up to 100 guests | Enforced on the server for both owner additions and public replies, including concurrent requests |
| Free essentials | Couple/family details, venue, date/time, preview, saved drafts, permanent links and private RSVP inbox |

Each named person uses one place; Basic does not support plus-one head counts.
There is one Basic invitation per account, separate from its Free invitation.
Saving changes keeps them private until republished. Unpublishing disables the
public page and new replies while preserving the draft and guest list.

Music starts only after a guest taps Play. Use a public audio file URL, not a
YouTube/Spotify web page. The couple supplies that URL; audio uploads are not
part of this editor. A heart placeholder appears until the couple uploads their photo.
Email sharing prepares a message in the email app; it does not send bulk email.

## Understand the code

Follow the data in this order:

1. `src/lib/basic-invitation.ts`: sample values, four templates, four themes, types, limits and validation.
2. `src/components/basic-studio/BasicStudio.tsx`: form state, save/publish buttons and guest dashboard.
3. `src/components/invitation/BasicInvitation.tsx`: the actual guest invitation and RSVP form.
4. `src/components/invitation/BasicInvitation.module.css`: colours, spacing, photo frames and responsive layouts.
5. `src/components/basic-studio/ShareInvitation.tsx`: WhatsApp, email, clipboard and QR generation.
6. `src/lib/couple-photo.ts`: photo resizing and compression before saving.
7. `src/lib/basic-studio-client.ts`: browser requests to `/api/basic`.
8. `src/app/api/basic/[[...path]]/route.ts`: same-origin checks, sessions and request routing.
9. `src/lib/server/basic-studio.ts`: database save, publish and guest operations.
10. `src/lib/server/free-database.ts`: creates both plan tables without changing existing Free data.

For a new default message, edit `BASIC_SAMPLE`. To change a design colour, edit
`BASIC_DESIGNS`. To adjust invitation spacing, edit the CSS module. Keep limits
in the shared settings and server validation together; a browser-only limit
cannot enforce plan capacity.

## Database and deployment

Basic reuses the existing Free Studio account/session system and database
settings. Locally it uses `.data/free-studio.db`. The new `basic_invitations` and
`basic_guests` tables are created automatically. Photo data lives in the saved
invitation JSON, so there is no additional upload service to configure.

Use the existing `FREE_DATABASE_URL` and `FREE_DATABASE_AUTH_TOKEN` settings for
a shared remote libSQL database. Production requires that remote database, or
`FREE_ALLOW_LOCAL_DATABASE=true` on a server with persistent disk. See
[Free Studio setup](free-invitation.md) for the existing configuration.

This implements the Basic feature set. There is no payment checkout or paid
entitlement check; any Studio account can currently create a Basic invitation.
Connect a verified purchase to the server routes before selling restricted access.

## How the ZIP became project code

The source is the supplied `wedding-invitation.zip`. Its files are a visual and
functional reference; you do not need to run or deploy that standalone folder.

| ZIP source | Next.js implementation |
| --- | --- |
| `index.html` invitation sections | `BasicInvitation.tsx`: circular photo, double-border arch, names, message, details, embedded map, radio RSVP, sharing and footer |
| `style.css` theme variables | `BASIC_DESIGNS` and scoped `BasicInvitation.module.css` |
| `script.js` countdown | `WeddingCountdown.tsx`, using the Sri Lankan timezone |
| Customize panel | `BasicStudio.tsx`, with a live preview |
| Browser-only RSVP and guest list | Authenticated database API and private Basic dashboard |
| External QR image API | Local QR generation in `ShareInvitation.tsx` |
| CSV download | `guest-export.ts` and the dashboard's download button |

The ZIP's themes `royal`, `garden`, `midnight` and `blush` map to saved project
codes `champagne`, `sage`, `midnight` and `rose`. Existing Basic drafts keep working.
The project uses its existing Cormorant and Montserrat fonts. Photos are saved
to the database and included in published invitations. Music uses a direct
HTTPS link. The ZIP's group-size/note inputs are not shown: this Basic guest
model tracks one named person per place. Public sharing uses the general
invitation URL, so it does not pass on a guest's private RSVP token.

## Ever After Editorial template

The original invitation remains available as **Basic Wedding Invitation**.
The new **Ever After Editorial** has a separate layout: a monogram masthead,
large editorial title, rectangular photo, circular love seal, couple nameplate,
numbered event details, square RSVP card and generous spacing.

Choose either template under Basic Plan on `/packages`, or use the template
cards in the editor. Package links use `?template=arch` or `?template=editorial`.
Template selection does not replace a saved invitation until you save and
publish your change. Existing details, guests and the permanent link are retained.

To edit this new design, start with:

- `src/components/basic-studio/BasicTemplatePicker.tsx`: editor selection cards.
- `src/components/invitation/templates/EditorialBasicHero.tsx`: editorial hero markup.
- `src/components/invitation/templates/EditorialBasic.module.css`: editorial layout and responsive styling.
- `src/components/invitation/BasicInvitation.tsx`: shared photo, music, Maps, RSVP and sharing features; selects the stylesheet and hero by `details.layout`.

The optional `layout` field defaults to `arch` for old saved data. Adding a
template does not require new database tables or changes to the guest API.

## Botanical Vow template

The third template adds a full photo cover, dark green botanical framing,
large couple names, an overlapping welcome card, leaf seal, arched event cards
and venue map, and a bordered RSVP card. The cover uses the couple's uploaded
photo; its dark botanical background appears until a photo is uploaded.

Select **Botanical Vow** under Basic Plan on `/packages`, or open
`/basic-invitation?template=botanical&design=sage`. It is also available in the
editor's template picker. All four colour themes work with it; its photo cover
keeps a dark green overlay so text stays readable.

Beginner editing guide:

- Edit `templates/BotanicalBasicHero.tsx` in `src/components/invitation` for the cover and welcome content.
- Edit `templates/BotanicalBasic.module.css` for the cover, cards, typography and responsive layout. Comments group each part of the stylesheet.
- `BasicInvitation.tsx` selects the matching stylesheet and hero. Photo, music, RSVP, Maps and sharing behaviour are shared with the original templates.
- `BASIC_TEMPLATES` in `src/lib/basic-invitation.ts` supplies the package links, editor labels and server validation.

Saved drafts without a layout still use the original arch template. Changing
the layout keeps the same invitation ID, permanent link and guest list.

## Maison Amour template

The fourth template uses a distinct asymmetric composition: large couple names
beside a portrait with one sculpted corner, a circular love stamp, a calendar
date card, clean ruled event details and understated square RSVP controls.
The photograph placeholder uses two interlocking rings until the couple adds
their own photo. All existing templates remain available.

Open `/basic-invitation?template=maison`, or choose **Maison Amour** under
Basic Plan on `/packages`. The editor also includes a dedicated selection card.
All four colour themes and the existing Basic features work with this template.

For beginner edits:

- `src/components/invitation/templates/MaisonBasicHero.tsx`: names, portrait, date card and countdown markup.
- `src/components/invitation/templates/MaisonBasic.module.css`: styling, grouped into cover, date card, shared sections and responsive rules.
- `src/components/invitation/BasicInvitation.tsx`: look up the hero and stylesheet in `templateHeroes` and `templateStyles`. The RSVP, map, music and sharing code is shared.
- `src/lib/basic-invitation.ts`: change the template label or description in `BASIC_TEMPLATES`.

## Verification commands

```bash
npm run test:basic
npm run test:free
npm run build
npm run test:basic:integration
npm run test:free:integration
```

Integration tests start their own production servers on ports 3188 and 3187
and use isolated databases in `.next`. They do not change your development data.
