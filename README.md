This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Free invitation creation now includes a four-step studio, account-saved drafts,
stable published links and a private guest RSVP dashboard. See
[Free Studio setup and beginner guide](docs/free-invitation.md).

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
