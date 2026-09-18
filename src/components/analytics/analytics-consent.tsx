"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ANALYTICS_CONSENT_EVENT, getGaMeasurementId } from "@/lib/analytics/config";
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  focusMainContent,
  readAnalyticsConsent,
  requestAnalyticsConsentPrompt,
  subscribeAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics/consent";
import { loadGoogleAnalytics } from "@/lib/analytics/gtag";
import { cn } from "@/lib/utils";

function subscribeIsClient() {
  return () => {};
}

export function AnalyticsConsent() {
  const measurementId = getGaMeasurementId();
  const titleId = useId();
  const isClient = useSyncExternalStore(
    subscribeIsClient,
    () => true,
    () => false,
  );
  const stored = useSyncExternalStore(
    subscribeAnalyticsConsent,
    readAnalyticsConsent,
    () => null,
  );
  const [prompt, setPrompt] = useState(false);

  useEffect(() => {
    if (!measurementId) return;
    const onPrompt = () => setPrompt(true);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onPrompt);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onPrompt);
  }, [measurementId]);

  useEffect(() => {
    if (measurementId && stored === CONSENT_GRANTED) {
      loadGoogleAnalytics(measurementId);
    }
  }, [measurementId, stored]);

  if (!measurementId || !isClient) return null;
  if (stored !== null && !prompt) return null;
  const id = measurementId;

  function decide(next: AnalyticsConsent) {
    writeAnalyticsConsent(next);
    setPrompt(false);
    if (next === CONSENT_GRANTED) {
      loadGoogleAnalytics(id);
    }
    if (next === CONSENT_DENIED && stored === CONSENT_GRANTED) {
      window.location.reload();
      return;
    }
    focusMainContent();
  }

  return (
    <div
      role="region"
      aria-labelledby={titleId}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white p-4 motion-reduce:transition-none md:p-5"
    >
      <div className="container-site flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <h2 id={titleId} className="font-display text-base font-semibold text-ink">
            Analytics cookies
          </h2>
          <p className="text-muted-text mt-1 text-sm leading-relaxed">
            Google Analytics helps us see which pages are useful. It runs only
            if you accept, and we do not use it for advertising.{" "}
            <Link
              href="/privacy"
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="cta"
            onClick={() => decide(CONSENT_DENIED)}
          >
            Reject
          </Button>
          <Button
            type="button"
            size="cta"
            onClick={() => decide(CONSENT_GRANTED)}
          >
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSettingsLink({
  className,
}: {
  className?: string;
}) {
  const measurementId = getGaMeasurementId();
  if (!measurementId) return null;

  return (
    <button
      type="button"
      className={cn(
        "min-h-11 text-left font-semibold text-white/80 transition-colors hover:text-white",
        className,
      )}
      onClick={() => requestAnalyticsConsentPrompt()}
    >
      Analytics cookies
    </button>
  );
}
