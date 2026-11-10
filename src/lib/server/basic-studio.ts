import { randomBytes, randomUUID } from "node:crypto";
import type { Row } from "@libsql/client";
import { freeDatabase } from "./free-database";
import { StudioError } from "./free-studio";
import { BASIC_PLAN, readBasicDetails, type BasicInvitationDetails, type BasicSnapshot, type PublicBasicInvitation } from "../basic-invitation";
export { accountSession, authenticate, endSession, rateLimit, SESSION_COOKIE, SESSION_SECONDS, StudioError } from "./free-studio";
const token = () => randomBytes(24).toString("hex");
function invitationFromRow(row: Row) {
  return { id: String(row.id), slug: String(row.slug), details: JSON.parse(String(row.draft_details)) as BasicInvitationDetails,
    published: row.published_details !== null, hasChanges: row.published_version !== row.version, updatedAt: String(row.updated_at), version: Number(row.version) };
}

export async function snapshot(user: { id: string; email: string }): Promise<BasicSnapshot> {
  const db = await freeDatabase();
  const result = await db.execute({ sql: "SELECT * FROM basic_invitations WHERE owner_id=?", args: [user.id] });
  const row = result.rows[0];
  if (!row) return { user: { email: user.email }, invitation: null, guests: [] };
  const guests = await db.execute({ sql: "SELECT token,name,status,replied_at FROM basic_guests WHERE invitation_id=? ORDER BY name", args: [String(row.id)] });
  return { user: { email: user.email }, invitation: invitationFromRow(row), guests: guests.rows.map((guest) => ({
    token: String(guest.token), name: String(guest.name), status: String(guest.status) as "pending" | "attending" | "declined", repliedAt: guest.replied_at ? String(guest.replied_at) : null,
  })) };
}

function validateDetails(input: unknown, publish: boolean) {
  const details = readBasicDetails(input);
  if (!details) throw new StudioError(400, "Check your Basic invitation details, photo, music and map links.");
  if (publish && (!details.weddingDate || !details.weddingTime || !details.venueName)) throw new StudioError(400, "Add your wedding date, time and venue before publishing.");
  if (publish && details.rsvpDeadline && details.weddingDate && details.rsvpDeadline > details.weddingDate) throw new StudioError(400, "The reply deadline must be on or before the wedding date.");
  return details;
}

export async function saveDraft(user: { id: string; email: string }, input: unknown) {
  const details = validateDetails(input, false);
  const db = await freeDatabase();
  // A UNIQUE owner_id constraint enforces one Basic invitation per account.
  await db.execute({ sql: `INSERT INTO basic_invitations(id,owner_id,slug,draft_details,updated_at) VALUES (?,?,?,?,?)
    ON CONFLICT(owner_id) DO UPDATE SET draft_details=excluded.draft_details,version=version+1,updated_at=excluded.updated_at`,
    args: [randomUUID(), user.id, randomBytes(12).toString("hex"), JSON.stringify(details), new Date().toISOString()] });
  return snapshot(user);
}

async function ownedInvitation(ownerId: string) {
  const db = await freeDatabase();
  const result = await db.execute({ sql: "SELECT * FROM basic_invitations WHERE owner_id=?", args: [ownerId] });
  if (!result.rows[0]) throw new StudioError(404, "Save your invitation draft first.");
  return result.rows[0];
}

export async function publishInvitation(user: { id: string; email: string }, version: unknown, publish: boolean) {
  const row = await ownedInvitation(user.id);
  if (publish) validateDetails(JSON.parse(String(row.draft_details)), true);
  if (!Number.isSafeInteger(version)) throw new StudioError(400, "Reload your draft before publishing.");
  const result = await (await freeDatabase()).execute({ sql: `UPDATE basic_invitations SET published_details=${publish ? "draft_details" : "NULL"},
    published_version=${publish ? "version" : "NULL"} WHERE owner_id=? AND version=?`, args: [user.id, Number(version)] });
  if (!result.rowsAffected) throw new StudioError(409, "This draft changed in another tab. Reload it before publishing.");
  return snapshot(user);
}

export async function addGuest(user: { id: string; email: string }, nameInput: unknown) {
  const name = typeof nameInput === "string" ? nameInput.trim() : "";
  if (!name || name.length > 150) throw new StudioError(400, "Enter a guest name of 1-150 characters.");
  const invitation = await ownedInvitation(user.id);
  const db = await freeDatabase();
  try {
    const result = await db.execute({ sql: `INSERT INTO basic_guests(token,invitation_id,name,name_key)
      SELECT ?,?,?,? WHERE (SELECT count(*) FROM basic_guests WHERE invitation_id=?) < ?`,
      args: [token(), String(invitation.id), name, name.toLowerCase(), String(invitation.id), BASIC_PLAN.guestLimit] });
    if (!result.rowsAffected) throw new StudioError(409, `The Basic Plan includes ${BASIC_PLAN.guestLimit} guests. Remove a guest before adding another.`);
  } catch (error) {
    if (String(error).includes("UNIQUE")) throw new StudioError(409, "This guest is already on your list.");
    throw error;
  }
  return snapshot(user);
}

export async function removeGuest(user: { id: string; email: string }, guestToken: unknown) {
  if (typeof guestToken !== "string") throw new StudioError(400, "Choose a guest to remove.");
  await (await freeDatabase()).execute({ sql: "DELETE FROM basic_guests WHERE token=? AND invitation_id IN (SELECT id FROM basic_invitations WHERE owner_id=?)", args: [guestToken, user.id] });
  return snapshot(user);
}

export async function publicInvitation(slug: string, guestToken?: string): Promise<PublicBasicInvitation> {
  const db = await freeDatabase();
  const result = await db.execute({ sql: "SELECT id,published_details FROM basic_invitations WHERE slug=? AND published_details IS NOT NULL", args: [slug] });
  const row = result.rows[0];
  if (!row) throw new StudioError(404, "This invitation is not published. Please check with the couple.");
  let guest = null;
  if (guestToken) {
    const found = await db.execute({ sql: "SELECT name,status FROM basic_guests WHERE invitation_id=? AND token=?", args: [String(row.id), guestToken] });
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
  const row = (await db.execute({ sql: "SELECT id FROM basic_invitations WHERE slug=?", args: [slug] })).rows[0];
  const code = guestToken || token();
  const status = input.attending ? "attending" : "declined";
  // Both new replies and personal links count toward the same server-side quota.
  if (!guestToken) {
    try {
      const result = await db.execute({ sql: `INSERT INTO basic_guests(token,invitation_id,name,name_key,status,replied_at)
        SELECT ?,?,?,?,?,? WHERE (SELECT count(*) FROM basic_guests WHERE invitation_id=?) < ?
        AND EXISTS(SELECT 1 FROM basic_invitations WHERE id=? AND published_details IS NOT NULL)`,
        args: [code, String(row.id), name, name.toLowerCase(), status, new Date().toISOString(), String(row.id), BASIC_PLAN.guestLimit, String(row.id)] });
      if (!result.rowsAffected) throw new StudioError(409, "Replies are currently unavailable. Please contact the couple directly.");
    } catch (error) {
      if (String(error).includes("UNIQUE")) throw new StudioError(409, "This name is already on the guest list. Please use your personal invitation link.");
      throw error;
    }
  } else {
    const result = await db.execute({ sql: `UPDATE basic_guests SET status=?,replied_at=? WHERE token=? AND invitation_id=?
      AND EXISTS(SELECT 1 FROM basic_invitations WHERE id=? AND published_details IS NOT NULL)`, args: [status, new Date().toISOString(), code, String(row.id), String(row.id)] });
    if (!result.rowsAffected) throw new StudioError(409, "This invitation link is no longer active.");
  }
  return { code, invitation: await publicInvitation(slug, code) };
}


