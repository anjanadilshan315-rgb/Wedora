import { createClient, type Client } from "@libsql/client";
import { mkdir } from "node:fs/promises";
import path from "node:path";

let database: Promise<Client> | undefined;

/** SQLite locally; a remote libSQL URL can be used on hosted deployments. */
export function freeDatabase(): Promise<Client> {
  if (!database) database = openDatabase().catch((error) => { database = undefined; throw error; });
  return database;
}

async function openDatabase() {
  const configured = process.env.FREE_DATABASE_URL;
  if (process.env.NODE_ENV === "production" && (!configured || configured.startsWith("file:")) && process.env.FREE_ALLOW_LOCAL_DATABASE !== "true") {
    throw new Error("Configure FREE_DATABASE_URL, or enable FREE_ALLOW_LOCAL_DATABASE on a server with persistent disk.");
  }
  if (!configured) await mkdir(path.join(process.cwd(), ".data"), { recursive: true });
  const db = createClient({ url: configured || "file:.data/free-studio.db", authToken: process.env.FREE_DATABASE_AUTH_TOKEN });
  await db.batch([
    `CREATE TABLE IF NOT EXISTS studio_users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS studio_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES studio_users(id), expires_at INTEGER NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS studio_sessions_expiry ON studio_sessions(expires_at)`,
    `CREATE TABLE IF NOT EXISTS studio_invitations (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL UNIQUE REFERENCES studio_users(id), slug TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL DEFAULT 'free' CHECK (plan = 'free'), draft_details TEXT NOT NULL,
      published_details TEXT, version INTEGER NOT NULL DEFAULT 1, published_version INTEGER, updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS studio_guests (
      token TEXT PRIMARY KEY, invitation_id TEXT NOT NULL REFERENCES studio_invitations(id), name TEXT NOT NULL,
      name_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','attending','declined')),
      replied_at TEXT, UNIQUE(invitation_id, name_key)
    )`,
    `CREATE INDEX IF NOT EXISTS studio_guests_invitation ON studio_guests(invitation_id)`,
    `CREATE TABLE IF NOT EXISTS basic_invitations (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL UNIQUE REFERENCES studio_users(id), slug TEXT NOT NULL UNIQUE,
      draft_details TEXT NOT NULL, published_details TEXT, version INTEGER NOT NULL DEFAULT 1,
      published_version INTEGER, updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS basic_guests (
      token TEXT PRIMARY KEY, invitation_id TEXT NOT NULL REFERENCES basic_invitations(id), name TEXT NOT NULL,
      name_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','attending','declined')),
      replied_at TEXT, UNIQUE(invitation_id, name_key)
    )`,
    `CREATE INDEX IF NOT EXISTS basic_guests_invitation ON basic_guests(invitation_id)`,
    `CREATE TABLE IF NOT EXISTS standard_invitations (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL UNIQUE REFERENCES studio_users(id), slug TEXT NOT NULL UNIQUE,
      draft_details TEXT NOT NULL, published_details TEXT, version INTEGER NOT NULL DEFAULT 1,
      published_version INTEGER, updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS standard_guests (
      token TEXT PRIMARY KEY, invitation_id TEXT NOT NULL REFERENCES standard_invitations(id), name TEXT NOT NULL,
      name_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','attending','declined')),
      replied_at TEXT, reply TEXT, UNIQUE(invitation_id, name_key)
    )`,
    `CREATE INDEX IF NOT EXISTS standard_guests_invitation ON standard_guests(invitation_id)`,
    `CREATE TABLE IF NOT EXISTS premium_invitations (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL UNIQUE REFERENCES studio_users(id), slug TEXT NOT NULL UNIQUE,
      draft_details TEXT NOT NULL, published_details TEXT, version INTEGER NOT NULL DEFAULT 1,
      published_version INTEGER, updated_at TEXT NOT NULL, password_hash TEXT, published_password_hash TEXT,
      views INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS premium_guests (
      token TEXT PRIMARY KEY, invitation_id TEXT NOT NULL REFERENCES premium_invitations(id), name TEXT NOT NULL,
      name_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','attending','declined')),
      replied_at TEXT, reply TEXT, table_id TEXT NOT NULL DEFAULT '', guest_group TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '', opened_at TEXT, visits INTEGER NOT NULL DEFAULT 0, UNIQUE(invitation_id,name_key)
    )`,
    `CREATE INDEX IF NOT EXISTS premium_guests_invitation ON premium_guests(invitation_id)`,
    `CREATE TABLE IF NOT EXISTS premium_media (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES studio_users(id), mime TEXT NOT NULL, data BLOB NOT NULL, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS premium_access (token_hash TEXT PRIMARY KEY, invitation_id TEXT NOT NULL, password_hash TEXT NOT NULL, expires_at INTEGER NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS premium_support (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES studio_users(id), message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'priority-queued', created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS studio_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL)`,
  ], "write");
  return db;
}
