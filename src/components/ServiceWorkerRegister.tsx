"use client";

import { useEffect } from "react";

/** Registers the PWA service worker so the app is installable and works offline. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // In dev the cache-first handling of /_next/static would serve stale
    // chunks across edits, so only take over in production builds.
    if (process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  }, []);

  return null;
}
