/**
 * Client for the Wedding Invitation API (backend/).
 *
 * - Stores the customer session (tokens + user) in localStorage.
 * - Adds the Bearer token, refreshes it once on TOKEN_EXPIRED and retries.
 * - Throws ApiError with the backend's `code`, `message` and field `details`.
 */

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1").replace(/\/$/, "");

const SESSION_KEY = "wedora.customer.session";
const SESSION_EVENT = "wedora:session";

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiresAt: string;
}

export interface Session {
  user: Customer;
  tokens: Tokens;
}

export interface FieldError {
  location: string;
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: FieldError[];

  constructor(status: number, code: string, message: string, details?: FieldError[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** { fieldName: message } for showing errors next to form inputs. */
  fieldErrors(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const d of this.details ?? []) if (d.field && !map[d.field]) map[d.field] = d.message;
    return map;
  }
}

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    if (error.code === "VALIDATION_ERROR" && error.details?.length) {
      return error.details.map((d) => d.message).join(" · ");
    }
    return error.message;
  }
  return fallback;
}

// ---------------------------------------------------------------------------
// Session storage
// ---------------------------------------------------------------------------

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  try {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable (private mode) — the session lives for this page only */
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function updateSessionUser(user: Customer): void {
  const session = getSession();
  if (session) setSession({ ...session, user });
}

/** Re-renders subscribers when the user logs in or out (also across tabs). */
export function onSessionChange(callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) callback();
  };
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export interface ApiResult<T> {
  data: T;
  message?: string;
  meta?: { page: number; limit: number; total: number; totalPages: number; [key: string]: unknown };
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  form?: FormData;
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
}

let refreshing: Promise<boolean> | null = null;

/** Single-flight token refresh: parallel 401s share one refresh call. */
function refreshTokens(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const session = getSession();
      if (!session) return false;
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: session.tokens.refreshToken }),
        });
        if (!res.ok) return false;
        const json = await res.json();
        setSession({ ...session, tokens: json.data.tokens });
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${API_URL}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function api<T = unknown>(path: string, options: RequestOptions = {}, retried = false): Promise<ApiResult<T>> {
  const { method = "GET", body, form, auth = true, query } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const session = auth ? getSession() : null;
  if (session) headers.Authorization = `Bearer ${session.tokens.accessToken}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server. Please check your connection.");
  }

  if (res.status === 204) return { data: undefined as T };

  let json: { success?: boolean; data?: T; message?: string; code?: string; details?: FieldError[]; meta?: ApiResult<T>["meta"] } = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (res.status === 401 && auth && session && !retried && json.code === "TOKEN_EXPIRED") {
    if (await refreshTokens()) return api<T>(path, options, true);
  }

  if (!res.ok) {
    if (res.status === 401 && auth && session) setSession(null); // session is no longer valid
    throw new ApiError(res.status, json.code ?? "ERROR", json.message ?? `Request failed (${res.status})`, json.details);
  }

  return { data: json.data as T, message: json.message, meta: json.meta };
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

export async function login(email: string, password: string): Promise<Session> {
  const { data } = await api<Session>("/auth/login", { method: "POST", body: { email, password }, auth: false });
  setSession(data);
  return data;
}

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<Session> {
  const { data } = await api<Session>("/auth/register", { method: "POST", body: input, auth: false });
  setSession(data);
  return data;
}

export async function logout(): Promise<void> {
  const session = getSession();
  setSession(null);
  if (session) {
    await api("/auth/logout", { method: "POST", body: { refreshToken: session.tokens.refreshToken }, auth: false }).catch(() => undefined);
  }
}

export const sampleGuestExcelUrl = `${API_URL}/public/samples/guest-list.xlsx`;
