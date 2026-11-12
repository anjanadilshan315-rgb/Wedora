# Modern Luxe: beginner guide

Modern Luxe (`tpl_modern`) uses ivory paper, a charcoal cover, champagne gold
lines and a diamond-shaped monogram. It has its own layout. No extra packages
or image downloads are needed for the design.

The cover includes reusable Art Deco corners, a soft gold glow and a gentle
entrance animation. A stationery seal, calendar date, venue emblem and linked
wedding rings add detail throughout the invitation. Reduced-motion settings
disable the animation. The `DecoCorner` component draws the cover artwork;
its colour and size are controlled by the CSS file.

## View the design

1. Run `npm run dev` in the project folder.
2. Open `http://localhost:3000/invite/demo-modern` for the sample invitation.
3. Open `/free-invitation` and choose **Modern Luxe** to enter your own details.
4. Use the studio preview to check your invitation before publishing.

The gallery, studio preview and shared invitation all use the same component.
Free invitations work without photos and include the Liora Free Plan credit.

## Where to make changes

| File | Purpose |
| --- | --- |
| `src/components/invitation/templates/ModernTemplate.tsx` | Invitation sections, wording and form markup |
| `src/components/invitation/templates/ModernTemplate.module.css` | Colours, typography, spacing and mobile layout |
| `src/components/invitation/FreeInvitationTemplate.tsx` | Connects the free invitation selector to Modern Luxe |
| `src/lib/template-catalog.ts` | Gallery title, description and preview colours |

### Change the colours

Edit the variables at the top of `ModernTemplate.module.css`. `--paper` is the
page background, `--ink` is the dark cover and text, `--gold` is the accent,
`--muted` is secondary text, and `--line` is the border colour. A few cover and
button shades are set directly in the same file for readable contrast.

### Change the content

Use the studio for names, date, time, venue, families and greeting. The component
reads these fields from `data`, so do not hardcode a couple's details in JSX.
To change a default phrase, edit its text in `ModernTemplate.tsx`.

Numbered comments explain the main sections. Optional photos, schedule and
gallery only appear when the invitation data contains them. Free Studio does
not add these media or schedule fields. Wishes and guest counts are only shown
when the component is used without `freePlan`.

### Keep replies working

`useInvitationActions` in `hooks.ts` handles RSVP and wish submission. Keep the
hook and form handlers when changing the layout. Preview mode disables replies;
demo mode uses sample interactions. Published Free Studio invitations save
replies through the existing server. Older device-only links show a notice and
offer a WhatsApp reply when a number is supplied.

### Check your changes

Run `npx tsc --noEmit` and `npm run test:free`. Check the preview on both a phone
and a desktop, including long names, no photos and both RSVP choices.
