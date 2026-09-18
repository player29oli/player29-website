import { getGaMeasurementId } from "@/lib/analytics/config";
import { CONSENT_GRANTED, readAnalyticsConsent } from "@/lib/analytics/consent";

type GtagCommand = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagCommand;
  }
}

const deniedDefaults = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

export type ContactLocation = "header" | "hero" | "closing" | "footer" | "form";

function ensureStub(): GtagCommand {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  return window.gtag;
}

export function loadGoogleAnalytics(measurementId: string): void {
  if (document.getElementById("p29-gtag")) return;

  const gtag = ensureStub();
  gtag("consent", "default", deniedDefaults);
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.id = "p29-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function trackEvent(
  name: string,
  params?: Record<string, string>,
): void {
  if (typeof window === "undefined") return;
  if (readAnalyticsConsent() !== CONSENT_GRANTED) return;
  const id = getGaMeasurementId();
  if (!id) return;
  loadGoogleAnalytics(id);
  window.gtag?.("event", name, params);
}

export function trackContactClick(location: ContactLocation): void {
  trackEvent("contact_click", { location });
}

export function trackContactSubmit(location: ContactLocation = "form"): void {
  trackEvent("contact_submit", { location });
}
