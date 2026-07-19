"use client";

import { useEffect } from "react";

type ConnectionNavigator = Navigator & {
  connection?: { saveData?: boolean };
};

/** Registers the PWA service worker so the app is installable and works offline. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // In dev the cache-first handling of /_next/static would serve stale
    // chunks across edits, so only take over in production builds.
    if (process.env.NODE_ENV !== "production") return;
    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(async () => {
        const registration = await navigator.serviceWorker.ready;
        if (cancelled) return;
        // Kick off (or resume) offline precaching of route shells and world
        // art — but not for users who asked to save data.
        const saveData = (navigator as ConnectionNavigator).connection?.saveData;
        if (!saveData) registration.active?.postMessage("lu-sync");
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
