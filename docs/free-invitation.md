# Liora Free Studio

Free Studio includes template selection, account-saved drafts, preview,
publishing, personal guest links and a central Yes / No RSVP inbox.

## Run locally

1. Run `npm install`, then `npm run dev`.
2. Open `/free-invitation` and choose a design.
3. Add the couple's details. Switching designs preserves those details.
4. Create a Free Studio account with an email and a password of at least 12 characters.
5. **Save draft**, then check the **Preview** step.
6. Use **Publish invitation**. Share the `/celebrate/<slug>` link.
7. Open `/free-invitation/dashboard` to add guests, copy personal links and refresh replies.

Development creates a real SQLite database at `.data/free-studio.db` on first
use. It is ignored by Git. No separate paid API is needed for this flow.
A localhost link is only accessible on your own machine; deploy the site before
sending invitations to your guests.

Free Studio has its own account/session system. The pre-existing paid
customer login still uses the external API in `NEXT_PUBLIC_API_URL`.
Free Studio accounts do not automatically become paid customer accounts.
Email verification, email delivery and password-reset delivery are not
implemented in this change.

## What the Free Plan includes

- Four designs: Lotus Arch, Royal Kandyan, Floral Garden and Modern Luxe.
- One invitation per account, enforced by a database uniqueness constraint.
- Ten guest places, including named personal links and replies to the general link.
- Yes / No responses saved to the server and shown in the owner's dashboard.
- A Liora watermark on every Free template.
- Saved drafts and a stable published link. Saving does not update the live
  invitation; publishing explicitly copies the draft to the public version.
- Unpublish and republish without changing the link.

Removing a guest also removes their reply and invalidates their personal link.
The general invitation link can be forwarded, but the server still enforces
its ten-guest limit. Existing guests can change their reply when the list is full.
Reply deadlines use the Asia/Colombo calendar date.

## Deployment and durable data

The storage client is `@libsql/client`. It supports local SQLite and remote
libSQL databases: https://docs.turso.tech/sdk/ts/reference

Copy `.env.example` to `.env.local` for development settings. Keep database
tokens in server environment variables, never in a `NEXT_PUBLIC_` variable.

For hosting with ephemeral or shared filesystem instances, configure a remote
database:

```text
FREE_DATABASE_URL=libsql://your-database-host
FREE_DATABASE_AUTH_TOKEN=your-server-only-token
```

For a single Node server with a persistent disk, use an absolute database path
and explicitly allow local storage:

```text
FREE_DATABASE_URL=file:/absolute/persistent/path/free-studio.db
FREE_ALLOW_LOCAL_DATABASE=true
```

The parent directory must already exist for a configured file path. Back up
the database using your storage provider's backup tools. Do not place the file
under `public/` or a build-output directory in production. The application
refuses an unconfigured local database in production to avoid silently saving
invitations to an ephemeral deployment disk. Use HTTPS in production; session
and reply cookies are HttpOnly and become Secure on HTTPS requests. Configure
your reverse proxy to supply a trustworthy client IP for rate limiting.

## Beginner's map of the code

| File | What to change there |
| --- | --- |
| `src/lib/template-catalog.ts` | Template names, plans, descriptions, colours and Free Plan limits |
| `src/components/invitation/registry.ts` | Connect a catalog code to its React design component |
| `src/components/invitation/FreeInvitationTemplate.tsx` | Select the matching Free design for editor and public pages |
| `src/lib/free-invitation.ts` | Typed invitation fields, sample content and validation |
| `src/components/free-studio/FreeStudio.tsx` | Four-step editor, sign-in form and private guest dashboard |
| `src/lib/server/free-database.ts` | Database connection and table creation |
| `src/lib/server/free-studio.ts` | Accounts, drafts, publishing, quotas and RSVP rules |
| `src/app/api/free/[[...path]]/route.ts` | Same-origin HTTP API and cookies |
| `src/app/celebrate/[slug]/page.tsx` | Reads the published version and submits guest responses |

The catalog contains no React components, so server validation can use exactly
the same template availability as the gallery and editor. To add a Free design,
add its metadata to the catalog and connect its component in the registry and
Free component selector. The package and editor lists update automatically.

Passwords are salted and hashed with scrypt. Session tokens are random and
stored as hashes in the database. Private operations derive the owner from
the session cookie; an invitation ID supplied by the browser cannot change
ownership. Mutations require the same site Origin, use bounded JSON input and
parameterized SQL, and apply database-backed request limits.

## Compatibility with earlier invitations

Older `/invite/free?details=...` links still work with their original local-only
RSVP behaviour, which is stated on those pages. No new links use that format.
The editor offers **Import an earlier draft from this browser**. Importing
copies the couple's details; browser-only guest lists/replies are not moved to
the new account. Save and publish to create the new server-backed invitation.

## Checks

```text
npm run test:free
npm run build
npm run test:free:integration
```

The integration test starts its own production server and uses a separate test
database under `.next/`. It covers session protection, Free-only templates,
private drafts, stable links, independent public versions, central replies,
concurrent guest limits, account isolation, unpublish and server restarts.
