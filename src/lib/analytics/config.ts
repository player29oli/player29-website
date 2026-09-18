export const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

export const ANALYTICS_CONSENT_COOKIE = "p29_analytics";
export const ANALYTICS_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const ANALYTICS_CONSENT_EVENT = "p29-open-analytics-consent";

export function getGaMeasurementId(): string | null {
  const value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  if (!GA_MEASUREMENT_ID_PATTERN.test(value)) return null;
  return value;
}
