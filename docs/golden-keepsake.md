# The Golden Keepsake

The replacement for Aurelia Gold and The Modern Muse is a React/TypeScript port of
`wedding-invitation-pro.zip`, using the source's colours, typography, mandala and
lotus ornaments, wax-seal animation and section layouts. Both former component
files have been removed. The package now contains one invitation with three
colour variants: Betel and Lotus, Midnight Sapphire, and Ruby and Gold.

Preview: `/invite/demo-keepsake`. Previously shared `/invite/demo-template` and
`/invite/demo-minimal` previews show the replacement design.

The new design retains the existing `tpl_classic` API code and template ID, so
draft creation works with the existing backend catalogue. `tpl_minimal` is
excluded from the frontend catalogue and package lists. This checkout contains
the frontend only; backend template rows are not deleted or renamed here.

Edit the wedding's Message & Schedule step to choose its theme, Sinhala wording,
blessing, heading, dress note, music URL and custom colours. These settings are
stored in `extraDetails.keepsake`, preserving other extra details. Music is
optional: provide an HTTPS audio URL or a path to an audio file in `public/`.
The source ZIP did not include a music file.

Live invitations use the existing RSVP and wishes API, and the existing customer
dashboard for guest management. Couple login opens that authenticated dashboard.
The standalone ZIP's browser-only guest database and PIN login are replaced by
these existing project features. Messages use the wishes endpoint; phone numbers
are not collected by the RSVP form because the project's public RSVP contract
has no phone field. Demo replies are temporary and clearly labelled.

Verification: TypeScript and desktop/mobile browser checks passed, including
opening the seal, Sinhala text, schedule, RSVP choices and all three themes.
The production build was attempted but the existing root layout's Google Fonts
downloads failed. Live API persistence requires an available backend and an
authenticated customer session and was not exercised by the browser demo checks.

## Animation fixes

The hero entrance now starts after the wax seal and doors finish opening. The
normal door transition has a timer fallback; Skip animation and Escape also
open the invitation. The demo's Replay opening animation button resets both the
cover and its animation elements. Every new visit or refresh starts with a fresh cover; old opened-session flags are no longer reused.

Gallery frames, invitation cards, countdown tiles, the event timeline and RSVP
sections reveal on scroll. Mandalas, botanical details and gold glints animate
within this template only. Reduced-motion preferences show all content without
motion, and print output keeps the timeline visible. Missing music files show a
message instead of interrupting the invitation; audio pauses on navigation and
when the page is hidden.

Current verification covers five colour themes, eight photo frames, 320px/390px
mobile and desktop layouts, section reveals, keyboard focus, skip/replay,
transition fallback, fresh visits, music failure and RSVP error/retry:

```sh
node .verification/golden-keepsake-animation-check.cjs
```
Repeated-opening regression check:

```sh
node .verification/keepsake-repeat-check.cjs
```

Replay cancels the previous opening timer and pending music requests before
starting a new animation run. Rapid seal taps are ignored once opening starts.
The live Golden Keepsake keeps its component mounted when RSVP identifies the
guest, so a successful response does not reset the page or restart the cover.