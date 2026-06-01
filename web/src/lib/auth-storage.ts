import type { SessionResponse } from "@/types/auth";

const STORAGE_KEY = "churchapp-web-session";

export function readStoredSession() {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as SessionResponse;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function persistSession(session: SessionResponse) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
}
