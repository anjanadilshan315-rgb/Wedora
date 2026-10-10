"use client";

import { useSyncExternalStore } from "react";
import { getSession, onSessionChange, type Session } from "./api";

// getSnapshot must return the same object while nothing changed, so the parsed
// session is cached by its raw JSON.
let cachedRaw: string | null = null;
let cachedSession: Session | null = null;

function snapshot(): Session | null {
  const session = getSession();
  const raw = session ? JSON.stringify(session) : null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSession = session;
  }
  return cachedSession;
}

const noopSubscribe = () => () => undefined;

/**
 * Current customer session. `ready` is false on the server and during
 * hydration (localStorage is browser-only), so markup always matches.
 */
export function useSession(): { session: Session | null; ready: boolean } {
  const session = useSyncExternalStore(onSessionChange, snapshot, () => null);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return { session, ready };
}
