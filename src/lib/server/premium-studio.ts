import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Row } from "@libsql/client";
import { freeDatabase } from "./free-database";
import { StudioError } from "./free-studio";
import { PREMIUM_PLAN, readPremiumDetails, readPremiumReply, type PremiumDetails, type PremiumSnapshot, type PublicPremiumInvitation } from "../premium-invitation";
export { accountSession, authenticate, endSession, rateLimit, SESSION_COOKIE, SESSION_SECONDS, StudioError } from "./free-studio";

type Owner = { id: string; email: string };
const derive = promisify(scrypt);
const token = () => randomBytes(24).toString("hex");
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
async function passwordHash(password: string) {
  if (password.length < 8 || password.length > 128) throw new StudioError(400, "Use an invitation password of 8–128 characters.");
  const salt = token();
  return `${salt}:${(await derive(password, salt, 64) as Buffer).toString("hex")}`;
}
async function owned(ownerId: string) {
  const row = (await (await freeDatabase()).execute({ sql: "SELECT * FROM premium_invitations WHERE owner_id=?", args: [ownerId] })).rows[0];
  if (!row) throw new StudioError(404, "Save your Premium draft first.");
  return row;
}
export async function snapshot(user: Owner): Promise<PremiumSnapshot> {
  const db = await freeDatabase();
  const row = (await db.execute({ sql: "SELECT * FROM premium_invitations WHERE owner_id=?", args: [user.id] })).rows[0];
  const tickets = (await db.execute({ sql: "SELECT id,message,status,created_at FROM premium_support WHERE owner_id=? ORDER BY created_at DESC LIMIT 25", args: [user.id] })).rows.map((t) => ({ id: String(t.id), message: String(t.message), status: String(t.status), createdAt: String(t.created_at) }));
  if (!row) return { user: { email: user.email }, invitation: null, guests: [], tickets };
  const guests = (await db.execute({ sql: "SELECT * FROM premium_guests WHERE invitation_id=? ORDER BY name", args: [String(row.id)] })).rows;
  return {
    user: { email: user.email },
    invitation: { id: String(row.id), slug: String(row.slug), details: JSON.parse(String(row.draft_details)), published: row.published_details !== null, version: Number(row.version), hasChanges: row.version !== row.published_version, views: Number(row.views) },
    guests: guests.map((g) => ({ token: String(g.token), name: String(g.name), status: String(g.status) as "pending" | "attending" | "declined", repliedAt: g.replied_at ? String(g.replied_at) : null, reply: g.reply ? JSON.parse(String(g.reply)) : null, tableId: String(g.table_id), group: String(g.guest_group), notes: String(g.notes), openedAt: g.opened_at ? String(g.opened_at) : null, visits: Number(g.visits) })), tickets,
  };
}
function validate(input: unknown, publishing = false) {
  const details = readPremiumDetails(input);
  if (!details) throw new StudioError(400, "Check your Premium names, media, colours, galleries, questions and seating tables.");
  if (publishing && (!details.weddingDate || !details.weddingTime || !details.venueName || details.events.some((e) => !e.date || !e.time || !e.venue))) throw new StudioError(400, "Every celebration needs a date, time and venue.");
  if (publishing && details.rsvpDeadline && details.rsvpDeadline > details.weddingDate) throw new StudioError(400, "Set the reply deadline on or before your wedding date.");
  return details;
}
export async function saveDraft(user: Owner, input: unknown, password?: unknown) {
  const details = validate(input);
  const db = await freeDatabase();
  const existing = (await db.execute({ sql: "SELECT * FROM premium_invitations WHERE owner_id=?", args: [user.id] })).rows[0];
  let protectedHash = existing?.password_hash ? String(existing.password_hash) : null;
  if (!details.passwordEnabled) protectedHash = null;
  else if (typeof password === "string" && password) protectedHash = await passwordHash(password);
  else if (!protectedHash) throw new StudioError(400, "Enter a password before enabling invitation protection.");
  // Only this owner's uploads may be attached to a draft.
  for (const url of [details.musicUrl, details.videoUrl, details.backgroundVideoUrl]) {
    if (!url.startsWith("/api/premium/media/")) continue;
    const media = (await db.execute({ sql: "SELECT id,mime FROM premium_media WHERE id=? AND owner_id=?", args: [url.split("/").pop()!, user.id] })).rows[0];
    if (!media) throw new StudioError(400, "This upload does not belong to your account.");
    if ((url === details.musicUrl && !String(media.mime).startsWith("audio/")) || ((url === details.videoUrl || url === details.backgroundVideoUrl) && !String(media.mime).startsWith("video/"))) throw new StudioError(400, "Choose an audio file for music and video files for the film or background.");
  }
  if (existing) {
    const seated = (await db.execute({ sql: "SELECT table_id,SUM(CASE WHEN status='declined' THEN 0 ELSE MAX(1,COALESCE(CAST(json_extract(reply,'$.headCount') AS INTEGER),1)) END) AS places FROM premium_guests WHERE invitation_id=? AND table_id<>'' GROUP BY table_id", args: [String(existing.id)] })).rows;
    for (const row of seated) {
      const table = details.seatingTables.find((t) => t.id === row.table_id);
      if (!table || table.capacity < Number(row.places)) throw new StudioError(409, "Unassign seated guests before removing a table or reducing its capacity below its assigned places.");
    }
  }
  const saved = await db.execute({ sql: `INSERT INTO premium_invitations(id,owner_id,slug,draft_details,updated_at,password_hash) VALUES (?,?,?,?,?,?)
    ON CONFLICT(owner_id) DO UPDATE SET draft_details=excluded.draft_details,password_hash=excluded.password_hash,version=version+1,updated_at=excluded.updated_at
    WHERE NOT EXISTS(SELECT table_id FROM premium_guests WHERE invitation_id=premium_invitations.id AND table_id<>'' GROUP BY table_id
      HAVING SUM(CASE WHEN status='declined' THEN 0 ELSE MAX(1,COALESCE(CAST(json_extract(reply,'$.headCount') AS INTEGER),1)) END) >
      COALESCE((SELECT CAST(json_extract(value,'$.capacity') AS INTEGER) FROM json_each(excluded.draft_details,'$.seatingTables') WHERE json_extract(value,'$.id')=table_id),-1))`,
    args: [randomUUID(), user.id, existing ? String(existing.slug) : randomBytes(12).toString("hex"), JSON.stringify(details), new Date().toISOString(), protectedHash] });
  if (!saved.rowsAffected) throw new StudioError(409, "Seating changed. Refresh before reducing or removing an assigned table.");
  return snapshot(user);
}
export async function publishInvitation(user: Owner, version: unknown, publish: boolean) {
  const row = await owned(user.id);
  if (publish) validate(JSON.parse(String(row.draft_details)), true);
  if (!Number.isSafeInteger(version)) throw new StudioError(400, "Reload your draft first.");
  const result = await (await freeDatabase()).execute({ sql: `UPDATE premium_invitations SET published_details=${publish ? "draft_details" : "NULL"},published_password_hash=${publish ? "password_hash" : "NULL"},published_version=${publish ? "version" : "NULL"} WHERE owner_id=? AND version=?`, args: [user.id, Number(version)] });
  if (!result.rowsAffected) throw new StudioError(409, "This draft changed. Reload before publishing.");
  return snapshot(user);
}
async function live(slug: string) {
  const row = (await (await freeDatabase()).execute({ sql: "SELECT * FROM premium_invitations WHERE slug=? AND published_details IS NOT NULL", args: [slug] })).rows[0];
  if (!row) throw new StudioError(404, "This invitation is not available. Please contact the couple.");
  return row;
}
async function checkAccess(row: Row, access?: string) {
  if (!row.published_password_hash) return;
  if (!access || !/^[a-f0-9]{48}$/.test(access)) throw new StudioError(423, "This invitation is private. Enter the password shared by the couple.");
  const found = (await (await freeDatabase()).execute({ sql: "SELECT token_hash FROM premium_access WHERE token_hash=? AND invitation_id=? AND password_hash=? AND expires_at>?", args: [hash(access), String(row.id), String(row.published_password_hash), Date.now()] })).rows[0];
  if (!found) throw new StudioError(423, "Enter the invitation password to continue.");
}
export async function unlockInvitation(slug: string, password: unknown) {
  const row = await live(slug);
  if (typeof password !== "string" || password.length > 128 || !row.published_password_hash) throw new StudioError(400, "Check your invitation password.");
  const [salt, expected] = String(row.published_password_hash).split(":");
  const actual = await derive(password, salt, 64) as Buffer;
  if (!timingSafeEqual(actual, Buffer.from(expected, "hex"))) throw new StudioError(401, "That password does not match. Please check with the couple.");
  const code = token();
  const db = await freeDatabase();
  await db.batch([{ sql: "DELETE FROM premium_access WHERE expires_at<?", args: [Date.now()] }, { sql: "INSERT INTO premium_access(token_hash,invitation_id,password_hash,expires_at) VALUES (?,?,?,?)", args: [hash(code), String(row.id), String(row.published_password_hash), Date.now() + 7 * 86400000] }], "write");
  return code;
}
export async function publicInvitation(slug: string, guestToken?: string, access?: string, countView = false): Promise<PublicPremiumInvitation> {
  const row = await live(slug);
  await checkAccess(row, access);
  const db = await freeDatabase();
  const details = JSON.parse(String(row.published_details)) as PremiumDetails;
  let guest: PublicPremiumInvitation["guest"] = null;
  if (guestToken) {
    const g = (await db.execute({ sql: "SELECT * FROM premium_guests WHERE token=? AND invitation_id=?", args: [guestToken, String(row.id)] })).rows[0];
    if (!g) throw new StudioError(404, "This personal invitation link is no longer available.");
    const draft = JSON.parse(String(row.draft_details)) as PremiumDetails;
    guest = { name: String(g.name), status: String(g.status) as "pending" | "attending" | "declined", reply: g.reply ? JSON.parse(String(g.reply)) : null, table: draft.seatingTables.find((t) => t.id === g.table_id)?.name ?? "" };
    if (countView) await db.execute({ sql: "UPDATE premium_guests SET opened_at=COALESCE(opened_at,?),visits=visits+1 WHERE token=?", args: [new Date().toISOString(), guestToken] });
  }
  if (countView) await db.execute({ sql: "UPDATE premium_invitations SET views=views+1 WHERE id=?", args: [String(row.id)] });
  // Seating plans, private notes, hashes and analytics never reach the guest page.
  return { details: { ...details, seatingTables: [] }, guest };
}
export async function addGuest(user: Owner, input: Record<string, unknown>) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > 150) throw new StudioError(400, "Enter a name of 1–150 characters.");
  const row = await owned(user.id);
  try {
    await (await freeDatabase()).execute({ sql: "INSERT INTO premium_guests(token,invitation_id,name,name_key) VALUES (?,?,?,?)", args: [token(), String(row.id), name, name.toLowerCase()] });
  } catch (error) { if (String(error).includes("UNIQUE")) throw new StudioError(409, "That guest is already on your list."); throw error; }
  return snapshot(user);
}
export async function updateGuest(user: Owner, input: Record<string, unknown>) {
  const row = await owned(user.id);
  const db = await freeDatabase();
  const guest = (await db.execute({ sql: "SELECT * FROM premium_guests WHERE token=? AND invitation_id=?", args: [String(input.token), String(row.id)] })).rows[0];
  if (!guest) throw new StudioError(404, "Guest not found.");
  const name = typeof input.name === "string" ? input.name.trim() : String(guest.name);
  const group = typeof input.group === "string" ? input.group.trim() : String(guest.guest_group);
  const notes = typeof input.notes === "string" ? input.notes.trim() : String(guest.notes);
  const tableId = typeof input.tableId === "string" ? input.tableId : String(guest.table_id);
  if (!name || name.length > 150 || group.length > 100 || notes.length > 1000) throw new StudioError(400, "Check the guest name, group and notes.");
  const details = JSON.parse(String(row.draft_details)) as PremiumDetails;
  const table = details.seatingTables.find((t) => t.id === tableId);
  if (tableId && !table) throw new StudioError(400, "Choose a saved seating table.");
  const places = guest.status === "declined" ? 0 : Math.max(1, guest.reply ? JSON.parse(String(guest.reply)).headCount : 1);
  try {
    const result = await db.execute({ sql: `UPDATE premium_guests SET name=?,name_key=?,guest_group=?,notes=?,table_id=? WHERE token=? AND invitation_id=?
      AND (?='' OR (SELECT COALESCE(SUM(CASE WHEN status='declined' THEN 0 ELSE MAX(1,COALESCE(CAST(json_extract(reply,'$.headCount') AS INTEGER),1)) END),0) FROM premium_guests WHERE invitation_id=? AND table_id=? AND token<>?) + ? <=
        COALESCE((SELECT CAST(json_extract(value,'$.capacity') AS INTEGER) FROM premium_invitations,json_each(draft_details,'$.seatingTables') WHERE premium_invitations.id=? AND json_extract(value,'$.id')=?),-1))`,
      args: [name, name.toLowerCase(), group, notes, tableId, String(guest.token), String(row.id), tableId, String(row.id), tableId, String(guest.token), places, String(row.id), tableId] });
    if (!result.rowsAffected) throw new StudioError(409, "That table does not have enough seats for this party.");
  } catch (error) { if (String(error).includes("UNIQUE")) throw new StudioError(409, "Another guest already has that name."); throw error; }
  return snapshot(user);
}
export async function removeGuest(user: Owner, code: unknown) {
  await (await freeDatabase()).execute({ sql: "DELETE FROM premium_guests WHERE token=? AND invitation_id IN (SELECT id FROM premium_invitations WHERE owner_id=?)", args: [String(code), user.id] });
  return snapshot(user);
}
export async function replyToInvitation(slug: string, input: Record<string, unknown>, guestToken?: string, access?: string) {
  const invitation = await publicInvitation(slug, guestToken, access);
  const reply = readPremiumReply(input, invitation.details);
  if (!reply) throw new StudioError(400, "Check your party size, event choices and required RSVP answers.");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  if (invitation.details.rsvpDeadline && today > invitation.details.rsvpDeadline) throw new StudioError(409, "The reply deadline has passed. Please contact the couple.");
  const name = invitation.guest?.name || (typeof input.name === "string" ? input.name.trim() : "");
  if (!name || name.length > 150) throw new StudioError(400, "Enter your name.");
  const db = await freeDatabase();
  const row = await live(slug);
  const code = guestToken || token();
  const status = input.attending ? "attending" : "declined";
  if (guestToken) {
    const g = (await db.execute({ sql: "SELECT table_id FROM premium_guests WHERE token=? AND invitation_id=?", args: [code, String(row.id)] })).rows[0];
    if (!g) throw new StudioError(404, "This personal invitation is no longer available.");
    const result = await db.execute({ sql: `UPDATE premium_guests SET status=?,reply=?,replied_at=? WHERE token=? AND invitation_id=?
      AND (table_id='' OR (SELECT COALESCE(SUM(CASE WHEN status='declined' THEN 0 ELSE MAX(1,COALESCE(CAST(json_extract(reply,'$.headCount') AS INTEGER),1)) END),0) FROM premium_guests WHERE invitation_id=? AND table_id=? AND token<>?) + ? <=
        COALESCE((SELECT CAST(json_extract(value,'$.capacity') AS INTEGER) FROM premium_invitations,json_each(draft_details,'$.seatingTables') WHERE premium_invitations.id=? AND json_extract(value,'$.id')=?),-1))
      AND EXISTS(SELECT 1 FROM premium_invitations WHERE id=? AND published_details IS NOT NULL)`,
      args: [status, JSON.stringify(reply), new Date().toISOString(), code, String(row.id), String(row.id), String(g.table_id), code, reply.headCount, String(row.id), String(g.table_id), String(row.id)] });
    if (!result.rowsAffected) throw new StudioError(409, "Please contact the couple to arrange seats for your updated party size.");
  } else {
    try {
      const result = await db.execute({ sql: "INSERT INTO premium_guests(token,invitation_id,name,name_key,status,reply,replied_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM premium_invitations WHERE id=? AND published_details IS NOT NULL)", args: [code, String(row.id), name, name.toLowerCase(), status, JSON.stringify(reply), new Date().toISOString(), String(row.id)] });
      if (!result.rowsAffected) throw new StudioError(409, "This invitation is no longer accepting replies.");
    } catch (error) { if (String(error).includes("UNIQUE")) throw new StudioError(409, "Please use your personal invitation link to update your reply."); throw error; }
  }
  return { code, invitation: await publicInvitation(slug, code, access) };
}

/** Upload files stay in the configured database, not temporary server filesystem storage. */
export async function storeMedia(user: Owner, mime: string, bytes: Buffer) {
  if (!bytes.length || bytes.length > PREMIUM_PLAN.mediaBytes) throw new StudioError(413, "Choose a media file up to 8 MB.");
  const mp4 = bytes.subarray(4, 8).toString() === "ftyp";
  const webm = bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
  const mp3 = bytes.subarray(0, 3).toString() === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  const wav = bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WAVE";
  const ogg = bytes.subarray(0, 4).toString() === "OggS";
  if (!((mime === "video/mp4" && mp4) || (mime === "video/webm" && webm) || (mime === "audio/mpeg" && mp3) || (["audio/wav", "audio/x-wav"].includes(mime) && wav) || (mime === "audio/ogg" && ogg))) throw new StudioError(415, "Use a valid MP4, WebM, MP3, WAV or OGG file.");
  const db = await freeDatabase();
  const usage = (await db.execute({ sql: "SELECT COALESCE(SUM(length(data)),0) AS size FROM premium_media WHERE owner_id=?", args: [user.id] })).rows[0];
  if (Number(usage.size) + bytes.length > 80 * 1024 * 1024) throw new StudioError(413, "Your media storage is full (80 MB). Contact support for a storage upgrade.");
  const id = token();
  const stored = await db.execute({ sql: "INSERT INTO premium_media(id,owner_id,mime,data,created_at) SELECT ?,?,?,?,? WHERE (SELECT COALESCE(SUM(length(data)),0) FROM premium_media WHERE owner_id=?) + ? <= ?", args: [id, user.id, mime, bytes, new Date().toISOString(), user.id, bytes.length, 80 * 1024 * 1024] });
  if (!stored.rowsAffected) throw new StudioError(413, "Your media storage is full (80 MB). Contact support for a storage upgrade.");
  return { url: `/api/premium/media/${id}` };
}
export async function mediaFile(id: string, ownerId: string | undefined, accessForSlug: (slug: string) => string | undefined) {
  const db = await freeDatabase();
  const media = (await db.execute({ sql: "SELECT * FROM premium_media WHERE id=?", args: [id] })).rows[0];
  if (!media) throw new StudioError(404, "Media not found.");
  if (ownerId !== media.owner_id) {
    const rows = (await db.execute({ sql: "SELECT * FROM premium_invitations WHERE owner_id=? AND published_details IS NOT NULL", args: [String(media.owner_id)] })).rows;
    let allowed = false;
    for (const row of rows) {
      const details = JSON.parse(String(row.published_details)) as PremiumDetails;
      if (![details.musicUrl, details.videoUrl, details.backgroundVideoUrl].includes(`/api/premium/media/${id}`)) continue;
      await checkAccess(row, accessForSlug(String(row.slug))); allowed = true;
    }
    if (!allowed) throw new StudioError(404, "Media not found.");
  }
  return { bytes: Buffer.from(media.data as ArrayBuffer), mime: String(media.mime) };
}
export async function supportRequest(user: Owner, message: unknown) {
  if (typeof message !== "string" || message.trim().length < 10 || message.length > 2000) throw new StudioError(400, "Describe your request in 10–2000 characters.");
  await (await freeDatabase()).execute({ sql: "INSERT INTO premium_support(id,owner_id,message,created_at) VALUES (?,?,?,?)", args: [randomUUID(), user.id, message.trim(), new Date().toISOString()] });
  return snapshot(user);
}
