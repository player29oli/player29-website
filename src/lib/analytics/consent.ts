import {
  ANALYTICS_CONSENT_COOKIE,
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_MAX_AGE,
} from "@/lib/analytics/config";

export const CONSENT_GRANTED = "granted";
export const CONSENT_DENIED = "denied";

export type AnalyticsConsent = typeof CONSENT_GRANTED | typeof CONSENT_DENIED;

const listeners = new Set<() => void>();

function emitConsentChange(): void {
  for (const listener of listeners) listener();
}

function isConsent(value: string | null | undefined): value is AnalyticsConsent {
  return value === CONSENT_GRANTED || value === CONSENT_DENIED;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const piece = part.trim();
    if (piece.startsWith(prefix)) {
      return decodeURIComponent(piece.slice(prefix.length));
    }
  }
  return null;
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  const fromCookie = readCookie(ANALYTICS_CONSENT_COOKIE);
  if (isConsent(fromCookie)) return fromCookie;
  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_COOKIE);
    if (isConsent(stored)) return stored;
  } catch {
    // Private mode can block storage.
  }
  return null;
}

export function subscribeAnalyticsConsent(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener(ANALYTICS_CONSENT_EVENT, onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, onStoreChange);
  };
}

export function writeAnalyticsConsent(value: AnalyticsConsent): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${value}; Path=/; Max-Age=${ANALYTICS_CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_COOKIE, value);
  } catch {
    // Preference cookie is enough if localStorage is blocked.
  }
  emitConsentChange();
}

export function requestAnalyticsConsentPrompt(): void {
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
}

export function focusMainContent(): void {
  const main = document.getElementById("main");
  if (!main) return;
  if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
}
