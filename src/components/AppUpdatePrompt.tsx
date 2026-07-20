"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// How often an already-open app asks the server whether a new worker exists.
// Installed PWAs can stay open for days without a navigation, so without this
// poll they'd only notice a deploy on a cold start.
const POLL_MS = 30 * 60 * 1000;
// Coming back to the app is the other natural moment to check, but tab
// switching can be rapid — don't re-check more often than this.
const FOREGROUND_MS = 5 * 60 * 1000;

/**
 * Watches for a newer build of the app and offers a refresh.
 *
 * The service worker precaches the new build and then deliberately parks in
 * "waiting" (see src/sw/service-worker.js) rather than taking over, so nothing
 * swaps out mid-lesson. This component surfaces that waiting worker: on accept
 * it tells the worker to activate and reloads once it has control, which is the
 * point where every open page is guaranteed to be on the new build.
 *
 * Registration itself lives in OfflineReadyGate; we only observe here.
 */
export default function AppUpdatePrompt() {
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [applying, setApplying] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    let lastCheck = Date.now();
    let onVisible: (() => void) | undefined;

    const offer = (worker: ServiceWorker | null) => {
      // No controller means this is the very first install, not an update —
      // there is no older version running to interrupt, so stay silent.
      if (cancelled || !worker || !navigator.serviceWorker.controller) return;
      waitingRef.current = worker;
      setReady(true);
    };

    const onControllerChange = () => {
      if (!reloadingRef.current) return;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );

    navigator.serviceWorker.ready
      .then((registration) => {
        if (cancelled) return;

        // A worker that finished installing during an earlier visit is already
        // parked and fires no event, so check for it up front.
        offer(registration.waiting);

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            // "installed" is only reached once the new shell is precached, so
            // accepting the prompt can never leave the app half-updated.
            if (installing.state === "installed") offer(registration.waiting);
          });
        });

        const check = () => {
          lastCheck = Date.now();
          registration.update().catch(() => {
            // Offline, or the server is down — the next check retries.
          });
        };
        interval = setInterval(check, POLL_MS);
        onVisible = () => {
          if (
            document.visibilityState === "visible" &&
            Date.now() - lastCheck > FOREGROUND_MS
          ) {
            check();
          }
        };
        document.addEventListener("visibilitychange", onVisible);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      clearInterval(interval);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
      if (onVisible) document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const apply = useCallback(() => {
    const waiting = waitingRef.current;
    if (!waiting) return;
    setApplying(true);
    reloadingRef.current = true;
    waiting.postMessage("lu-skip-waiting");
    // If the worker never takes control (an install that failed after
    // reporting "installed"), reload anyway rather than spinning forever.
    setTimeout(() => window.location.reload(), 4000);
  }, []);

  if (!ready || dismissed) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[150] w-[calc(100%-2rem)] max-w-[420px]"
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 border-2"
        style={{
          background: "linear-gradient(180deg,#6a4dc0,#4c39a0)",
          borderColor: "rgba(255,255,255,.35)",
          boxShadow: "0 10px 26px rgba(20,0,60,.35)",
        }}
      >
        <img
          src="/universe/dragon/dragon_holding_star.webp"
          alt=""
          aria-hidden="true"
          className="w-11 h-11 object-contain shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="font-baloo font-extrabold text-white text-[16px] leading-tight">
            A new version is ready!
          </div>
          <div className="font-bold text-[12.5px]" style={{ color: "#d9ccff" }}>
            Refresh to get the newest worlds and fixes.
          </div>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={apply}
            disabled={applying}
            className="font-baloo font-extrabold text-[14px] rounded-full px-4 py-1.5 disabled:opacity-70"
            style={{ background: "#FFD64D", color: "#3f2f8e" }}
          >
            {applying ? "Updating…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="font-bold text-[12px] rounded-full px-4 py-1"
            style={{ color: "#cfc2f2" }}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
