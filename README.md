This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

**New: Evermore · Premium Plan** adapts the updated ZIP into a supplied-video welcome, romantic amethyst/peach arch, alternating photo story, family cards and luminous background animation. Photos and video are stored separately in `public/assets/evermore/`. Preview `/premium-invitation/evermore`, customize `/premium-invitation?template=evermore`. See the [Evermore beginner guide](docs/evermore-invitation.md).

**New: Walawwa · Premium Plan** adapts the supplied ZIP into carved timber doors, daytime floral scenery, a lantern-lit courtyard at night, falling petals and illustrated arch galleries. Includes all shared Premium guest tools. Preview `/premium-invitation/walawwa`, customize `/premium-invitation?template=walawwa`. See the [Walawwa editing and feature guide](docs/walawwa-invitation.md).

## Getting Started

**New: Aureline · Premium Plan**, a second Premium invitation inspired by the mandala/vintage-car reference. It has porcelain-blue and copper palettes, a cinematic illustrated journey, ceremonial borders, seed-light/silk animations and the full Premium guest tools. Preview `/premium-invitation/aureline`, customize `/premium-invitation?template=aureline`. See the [Aureline beginner guide and artwork prompts](docs/aureline-invitation.md).

**New: Rosé Atelier · Premium Plan** follows the reference video's blush-and-burgundy floral stationery, wax-sealed opening and falling petals. Includes a separate saved Premium editor, uploads, multiple galleries, custom RSVP questions, seating, analytics, password protection and guest links without the Standard 500-place limit. Preview `/premium-invitation/preview`, create `/premium-invitation`, manage guests `/premium-invitation/dashboard`. See the [Premium setup and editing guide](docs/premium-invitation.md).


**New: Saffron**, an editorial Standard template with marigold stationery, a sliding-envelope opening, photo journal, paper-confetti motion and all 17 Standard features. Preview `/standard-invitation/saffron`, customize `/standard-invitation?layout=saffron`. See the [Saffron beginner guide](docs/saffron-invitation.md).

**New: Moonlit**, an additional Standard invitation in pearl and midnight with
a lunar envelope, a cinematic cover, mosaic slideshow, orbital countdown and
its own invitation film. Preview `/standard-invitation/moonlit` or create at
`/standard-invitation?layout=moonlit`. See the
[Moonlit beginner guide](docs/moonlit-invitation.md).

**New: Solstice**, a separate Standard Plan template with coastal palettes,
panoramic photos, a folding wedding folio, photo-led motion and all Standard
guest tools. Preview `/standard-invitation/solstice` or create at
`/standard-invitation?layout=solstice`. See the
[Solstice beginner editing guide](docs/solstice-invitation.md).

Standard Plan now includes **The Vow**, an animated invitation with a wax-seal
envelope, six layouts, four animation styles, four fonts, colour themes and custom palettes, slideshow, music controls,
video backgrounds, wedding/homecoming events and advanced RSVP for up to 500
guest places. Explore `/standard-invitation/preview`, personalize it at
`/standard-invitation`, and manage replies at `/standard-invitation/dashboard`.
See the [Standard invitation guide](docs/standard-invitation.md).

Basic Plan invitations now include the original arch, Ever After Editorial,
Botanical Vow and Maison Amour templates, each with four colour themes, couple
photo upload, background music, Google Maps, named RSVP, up to 100 guests and
WhatsApp/email/QR sharing. Start at `/basic-invitation`. See the
[Basic invitation beginner guide](docs/basic-invitation.md) for setup, feature
details and where to edit the code.

Free invitation creation now includes a four-step studio, account-saved drafts,
stable published links and a private guest RSVP dashboard. See
[Free Studio setup and beginner guide](docs/free-invitation.md).

For the redesigned Modern Luxe invitation, see the
[Modern Luxe design and beginner editing guide](docs/modern-luxe.md).

Use Node.js 20.9 or newer. On a new laptop, or after pulling dependency updates,
open a terminal in the project folder and run:

```bash
npm run setup
npm run dev
```

Stop an already running dev server with **Ctrl+C** before doing this. Copy or
pull both `package.json` and `package-lock.json`; do not copy `node_modules`
from another computer. `npm run dev` now checks dependencies first and installs
missing packages, including `@libsql/client`, before starting Next.js. This
repair needs internet access. Build and production startup also check for
missing dependencies and show the repair command in the terminal.

If the message is **Module not found: Can't resolve '@libsql/client'**, run
`npm run setup` and restart the development server. For an incomplete or
cross-platform copied install that still fails, stop the server and run
`npm ci --include=dev --include=optional`, then `npm run dev`.

Each laptop uses its own local Free Studio database during development.
To access the same saved accounts and invitations from multiple computers,
configure the same remote database as described in the Free Studio guide.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


//ckjdwoji//
