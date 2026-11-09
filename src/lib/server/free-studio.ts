import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Row } from "@libsql/client";
import { freeDatabase } from "./free-database";
import { readFreeDetails, type FreeInvitationDetails } from "../free-invitation";
import { FREE_PLAN, isFreeTemplate } from "../template-catalog";
import type { PublicFreeInvitation, StudioSnapshot } from "../free-studio-types";

const deriveKey = promisify(scrypt);
const token = () => randomBytes(24).toString("hex");
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export class StudioError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export const SESSION_COOKIE = "forever_studio_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 30;

export async function rateLimit(key: string, limit: number, seconds: number) {
  const db = await freeDatabase();
  const now = Date.now();
  const bucket = Math.floor(now / (seconds * 1000));
  const result = await db.execute({
    sql: `INSERT INTO studio_rate_limits(key,count,expires_at) VALUES (?,1,?)
      ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count`,
    args: [hash(`${key}:${bucket}`), now + seconds * 1000],
  });
  await db.execute({ sql: "DELETE FROM studio_rate_limits WHERE expires_at < ?", args: [now] });
  if (Number(result.rows[0].count) > limit) throw new StudioError(429, "Too many attempts. Please try again later.");
}

export async function accountSession(rawToken?: string) {
  if (!rawToken || !/^[a-f0-9]{48}$/.test(rawToken)) return null;
  const db = await freeDatabase();
  const result = await db.execute({ sql: `SELECT u.id,u.email FROM studio_users u JOIN studio_sessions s ON s.user_id=u.id
    WHERE s.token_hash=? AND s.expires_at>?`, args: [hash(rawToken), Date.now()] });
  return result.rows[0] ? { id: String(result.rows[0].id), email: String(result.rows[0].email) } : null;
}

export async function authenticate(mode: "login" | "register", input: Record<string, unknown>) {
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 12 || password.length > 128) {
    throw new StudioError(400, "Enter a valid email and a password of 12–128 characters.");
  }
  const db = await freeDatabase();
  const existing = await db.execute({ sql: "SELECT id,password_hash FROM studio_users WHERE email=?", args: [email] });
  let userId: string;
  if (mode === "register") {
    if (existing.rows.length) throw new StudioError(409, "This email already has a Free Studio account. Please sign in.");
    userId = randomUUID();
    const salt = token();
    const derived = await deriveKey(password, salt, 64) as Buffer;
    try {
      await db.execute({ sql: "INSERT INTO studio_users(id,email,password_hash,created_at) VALUES (?,?,?,?)", args: [userId, email, `${salt}:${derived.toString("hex")}`, new Date().toISOString()] });
    } catch (error) {
      if (String(error).includes("UNIQUE")) throw new StudioError(409, "This email already has an account. Please sign in.");
      throw error;
    }
  } else {
    const stored = existing.rows[0]?.password_hash ? String(existing.rows[0].password_hash) : `${"0".repeat(48)}:${"0".repeat(128)}`;
    const [salt, expected] = stored.split(":");
    const actual = await deriveKey(password, salt, 64) as Buffer;
    if (!existing.rows[0] || !timingSafeEqual(actual, Buffer.from(expected, "hex"))) throw new StudioError(401, "Email or password is incorrect.");
    userId = String(existing.rows[0].id);
  }
  const sessionToken = token();
  await db.batch([
    { sql: "DELETE FROM studio_sessions WHERE expires_at < ?", args: [Date.now()] },
    { sql: "INSERT INTO studio_sessions(token_hash,user_id,expires_at) VALUES (?,?,?)", args: [hash(sessionToken), userId, Date.now() + SESSION_SECONDS * 1000] },
  ], "write");
  return { sessionToken, user: { email } };
}

export async function endSession(rawToken?: string) {
  if (rawToken) await (await freeDatabase()).execute({ sql: "DELETE FROM studio_sessions WHERE token_hash=?", args: [hash(rawToken)] });
}

function invitationFromRow(row: Row) {
  return { id: String(row.id), slug: String(row.slug), details: JSON.parse(String(row.draft_details)) as FreeInvitationDetails,
    published: row.published_details !== null, hasChanges: row.published_version !== row.version, updatedAt: String(row.updated_at), version: Number(row.version) };
}

export async function snapshot(user: { id: string; email: string }): Promise<StudioSnapshot> {
  const db = await freeDatabase();
  const result = await db.execute({ sql: "SELECT * FROM studio_invitations WHERE owner_id=?", args: [user.id] });
  const row = result.rows[0];
  if (!row) return { user: { email: user.email }, invitation: null, guests: [] };
  const guests = await db.execute({ sql: "SELECT token,name,status,replied_at FROM studio_guests WHERE invitation_id=? ORDER BY name", args: [String(row.id)] });
  return { user: { email: user.email }, invitation: invitationFromRow(row), guests: guests.rows.map((guest) => ({
    token: String(guest.token), name: String(guest.name), status: String(guest.status) as "pending" | "attending" | "declined", repliedAt: guest.replied_at ? String(guest.replied_at) : null,
  })) };
}

function validateDetails(input: unknown, publish: boolean) {
  const details = readFreeDetails(input);
  if (!details || !isFreeTemplate(details.templateCode ?? "tpl_free_arch")) throw new StudioError(400, "Choose an available Free template and check your invitation details.");
  if (publish && (!details.weddingDate || !details.weddingTime || !details.venueName)) throw new StudioError(400, "Add your wedding date, time and venue before publishing.");
  if (publish && details.rsvpDeadline && details.weddingDate && details.rsvpDeadline > details.weddingDate) throw new StudioError(400, "The reply deadline must be on or before the wedding date.");
  return details;
}

export async function saveDraft(user: { id: string; email: string }, input: unknown) {
  const details = validateDetails(input, false);
  const db = await freeDatabase();
  // A UNIQUE owner_id constraint enforces one Free invitation per account.
  await db.execute({ sql: `INSERT INTO studio_invitations(id,owner_id,slug,draft_details,updated_at) VALUES (?,?,?,?,?)
    ON CONFLICT(owner_id) DO UPDATE SET draft_details=excluded.draft_details,version=version+1,updated_at=excluded.updated_at`,
    args: [randomUUID(), user.id, randomBytes(12).toString("hex"), JSON.stringify(details), new Date().toISOString()] });
  return snapshot(user);
}

async function ownedInvitation(ownerId: string) {
  const db = await freeDatabase();
  const result = await db.execute({ sql: "SELECT * FROM studio_invitations WHERE owner_id=?", args: [ownerId] });
  if (!result.rows[0]) throw new StudioError(404, "Save your invitation draft first.");
  return result.rows[0];
}

export async function publishInvitation(user: { id: string; email: string }, version: unknown, publish: boolean) {
  const row = await ownedInvitation(user.id);
  if (publish) validateDetails(JSON.parse(String(row.draft_details)), true);
  if (!Number.isSafeInteger(version)) throw new StudioError(400, "Reload your draft before publishing.");
  const result = await (await freeDatabase()).execute({ sql: `UPDATE studio_invitations SET published_details=${publish ? "draft_details" : "NULL"},
    published_version=${publish ? "version" : "NULL"} WHERE owner_id=? AND version=?`, args: [user.id, Number(version)] });
  if (!result.rowsAffected) throw new StudioError(409, "This draft changed in another tab. Reload it before publishing.");
  return snapshot(user);
}

export async function addGuest(user: { id: string; email: string }, nameInput: unknown) {
  const name = typeof nameInput === "string" ? nameInput.trim() : "";
  if (!name || name.length > 150) throw new StudioError(400, "Enter a guest name of 1–150 characters.");
  const invitation = await ownedInvitation(user.id);
  const db = await freeDatabase();
  try {
    const result = await db.execute({ sql: `INSERT INTO studio_guests(token,invitation_id,name,name_key)
      SELECT ?,?,?,? WHERE (SELECT count(*) FROM studio_guests WHERE invitation_id=?) < ?`,
      args: [token(), String(invitation.id), name, name.toLowerCase(), String(invitation.id), FREE_PLAN.guestLimit] });
    if (!result.rowsAffected) throw new StudioError(409, `The Free Plan includes ${FREE_PLAN.guestLimit} guests. Remove a guest before adding another.`);
  } catch (error) {
    if (String(error).includes("UNIQUE")) throw new StudioError(409, "This guest is already on your list.");
    throw error;
  }
  return snapshot(user);
}

export async function removeGuest(user: { id: string; email: string }, guestToken: unknown) {
  if (typeof guestToken !== "string") throw new StudioError(400, "Choose a guest to remove.");
  await (await freeDatabase()).execute({ sql: "DELETE FROM studio_guests WHERE token=? AND invitation_id IN (SELECT id FROM studio_invitations WHERE owner_id=?)", args: [guestToken, user.id] });
  return snapshot(user);
}

export async function publicInvitation(slug: string, guestToken?: string): Promise<PublicFreeInvitation> {
  const db = await freeDatabase();
  const result = await db.execute({ sql: "SELECT id,published_details FROM studio_invitations WHERE slug=? AND published_details IS NOT NULL", args: [slug] });
  const row = result.rows[0];
  if (!row) throw new StudioError(404, "This invitation is not published. Please check with the couple.");
  let guest = null;
  if (guestToken) {
    const found = await db.execute({ sql: "SELECT name,status FROM studio_guests WHERE invitation_id=? AND token=?", args: [String(row.id), guestToken] });
    if (!found.rows[0]) throw new StudioError(404, "This personal invitation link is no longer available.");
    guest = { name: String(found.rows[0].name), status: String(found.rows[0].status) as "pending" | "attending" | "declined" };
  }
  return { details: JSON.parse(String(row.published_details)), guest };
}

export async function replyToInvitation(slug: string, input: Record<string, unknown>, guestToken?: string) {
  if (typeof input.attending !== "boolean") throw new StudioError(400, "Please choose Yes or No.");
  const invitation = await publicInvitation(slug, guestToken);
  const deadline = invitation.details.rsvpDeadline;
  if (deadline && new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()) > deadline) throw new StudioError(409, "The reply deadline has passed. Please contact the couple directly.");
  const name = invitation.guest?.name || (typeof input.name === "string" ? input.name.trim() : "");
  if (!name || name.length > 150) throw new StudioError(400, "Please enter your name (up to 150 characters).");
  const db = await freeDatabase();
  const row = (await db.execute({ sql: "SELECT id FROM studio_invitations WHERE slug=?", args: [slug] })).rows[0];
  const code = guestToken || token();
  const status = input.attending ? "attending" : "declined";
  // Both new replies and personal links count toward the same server-side quota.
  if (!guestToken) {
    try {
      const result = await db.execute({ sql: `INSERT INTO studio_guests(token,invitation_id,name,name_key,status,replied_at)
        SELECT ?,?,?,?,?,? WHERE (SELECT count(*) FROM studio_guests WHERE invitation_id=?) < ?
        AND EXISTS(SELECT 1 FROM studio_invitations WHERE id=? AND published_details IS NOT NULL)`,
        args: [code, String(row.id), name, name.toLowerCase(), status, new Date().toISOString(), String(row.id), FREE_PLAN.guestLimit, String(row.id)] });
      if (!result.rowsAffected) throw new StudioError(409, "Replies are currently unavailable. Please contact the couple directly.");
    } catch (error) {
      if (String(error).includes("UNIQUE")) throw new StudioError(409, "This name is already on the guest list. Please use your personal invitation link.");
      throw error;
    }
  } else {
    const result = await db.execute({ sql: `UPDATE studio_guests SET status=?,replied_at=? WHERE token=? AND invitation_id=?
      AND EXISTS(SELECT 1 FROM studio_invitations WHERE id=? AND published_details IS NOT NULL)`, args: [status, new Date().toISOString(), code, String(row.id), String(row.id)] });
    if (!result.rowsAffected) throw new StudioError(409, "This invitation link is no longer active.");
  }
  return { code, invitation: await publicInvitation(slug, code) };
}
