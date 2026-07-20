"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import CssCloud from "@/components/CssCloud";
import TwinkleField from "@/components/TwinkleField";

type ConnectionNavigator = Navigator & {
  connection?: { saveData?: boolean };
};

type Progress = { cached: number; total: number; phase: string };

// Set once the first offline-caching run reports "done"; on later visits its
// presence lets us skip the splash entirely instead of flashing it.
const READY_KEY = "lu-offline-ready";
// If caching makes no progress for this long we reveal the app anyway — a stall
// shouldn't hold a child hostage behind the splash. The art still fills in the
// background and the fetch handler falls back to the network meanwhile.
const STALL_MS = 30000;
const FADE_MS = 450;

// Whether this visit should offer the blocking splash: a first visit that hasn't
// finished caching, on a connection that didn't ask to save data. Read through
// useSyncExternalStore so the client value never trips a hydration mismatch.
const subscribeOffer = () => () => {};
function offerSnapshot() {
  if (typeof navigator === "undefined") return false;
  const saveData = (navigator as ConnectionNavigator).connection?.saveData;
  return localStorage.getItem(READY_KEY) !== "1" && !saveData;
}

/**
 * Registers the PWA service worker and, on a first visit that hasn't finished
 * caching yet, shows a blocking Aki splash with a progress bar so the child (and
 * grown-up) can see the app is getting ready for offline play rather than just
 * feeling slow. Renders nothing once everything is cached.
 */
export default function OfflineReadyGate() {
  const shouldOffer = useSyncExternalStore(
    subscribeOffer,
    offerSnapshot,
    () => false
  );
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const visible = shouldOffer && !dismissed;

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // In dev the cache-first handling of /_next/static would serve stale
    // chunks across edits, so only take over in production builds.
    if (process.env.NODE_ENV !== "production") return;

    const offering = offerSnapshot();
    const saveData = (navigator as ConnectionNavigator).connection?.saveData;
    let cancelled = false;
    let stallTimer: ReturnType<typeof setTimeout> | undefined;

    const dismiss = () => {
      if (cancelled) return;
      clearTimeout(stallTimer);
      setClosing(true);
      setTimeout(() => {
        if (!cancelled) setDismissed(true);
      }, FADE_MS);
    };

    const armStall = () => {
      clearTimeout(stallTimer);
      stallTimer = setTimeout(dismiss, STALL_MS);
    };

    const onMessage = (event: MessageEvent) => {
      if (cancelled || !event.data || event.data.type !== "lu-progress") return;
      if (event.data.done) {
        localStorage.setItem(READY_KEY, "1");
        if (offering) dismiss();
        return;
      }
      if (!offering) return;
      armStall();
      setProgress({
        cached: event.data.cached,
        total: event.data.total,
        phase: event.data.phase,
      });
    };

    if (offering) armStall();
    navigator.serviceWorker.addEventListener("message", onMessage);

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(async () => {
        const registration = await navigator.serviceWorker.ready;
        if (cancelled) return;
        // Kick off (or resume) offline precaching of route shells and world
        // art — but not for users who asked to save data.
        if (!saveData) registration.active?.postMessage("lu-sync");
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
        dismiss();
      });

    return () => {
      cancelled = true;
      clearTimeout(stallTimer);
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, []);

  // Lock scrolling while the splash covers the app, mirroring OnboardingGate.
  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement.style.overflow;
    const body = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = html;
      document.body.style.overflow = body;
    };
  }, [visible]);

  if (!visible) return null;

  const pct =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.cached / progress.total) * 100))
      : 0;
  const caption =
    pct >= 92
      ? "Almost ready!"
      : progress?.phase === "art"
        ? "Painting the pictures…"
        : "Packing up the adventure…";

  return (
    <div
      className="fixed inset-0 z-[140] overflow-hidden transition-opacity"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 6%,#8a6ce0 0%,#6a4dc0 38%,#4c39a0 68%,#3f2f8e 100%)",
        opacity: closing ? 0 : 1,
        pointerEvents: closing ? "none" : "auto",
        transitionDuration: `${FADE_MS}ms`,
      }}
      role="status"
      aria-live="polite"
      aria-label="Getting Learning Universe ready to play offline"
    >
      <TwinkleField />
      <CssCloud
        variant="puffy"
        style={{ left: -50, bottom: -34, width: 380, opacity: 0.92 }}
      />
      <CssCloud
        variant="wide"
        style={{ right: -40, bottom: -38, width: 440, opacity: 0.92 }}
      />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-center px-6 py-10">
        <img
          src="/universe/ui/logo_learning_universe.webp"
          alt="Learning Universe"
          className="w-[260px] object-contain mb-2"
          style={{ filter: "drop-shadow(0 6px 12px rgba(20,0,60,.3))" }}
        />

        <img
          src="/universe/dragon/dragon_holding_star.webp"
          alt=""
          aria-hidden="true"
          className="w-[150px] h-[150px] object-contain lu-float"
          style={{ filter: "drop-shadow(0 10px 14px rgba(0,0,0,.25))" }}
        />

        <div
          className="font-baloo font-extrabold text-white text-center text-[24px] mt-3"
          style={{ textShadow: "0 3px 10px rgba(20,0,60,.4)" }}
        >
          Getting your worlds ready!
        </div>

        <div className="w-full max-w-[340px] mt-6">
          <div
            className="lu-world-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            style={{
              borderColor: "rgba(255,255,255,.45)",
              background: "linear-gradient(180deg,#efe8ff,#f8f6fc)",
            }}
          >
            <span
              className="lu-world-progress-fill"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg,#7c5cff,#FFD64D,#7c5cff)",
                boxShadow: "0 0 10px rgba(124,92,255,.6)",
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-[14px]" style={{ color: "#d9ccff" }}>
              {caption}
            </span>
            <span
              className="font-baloo font-extrabold text-[16px]"
              style={{ color: "#fff" }}
            >
              {pct}%
            </span>
          </div>
        </div>

        <p
          className="font-bold text-[12.5px] mt-7 text-center max-w-[300px]"
          style={{ color: "#cfc2f2" }}
        >
          This only happens once — so you can play even without the internet.
        </p>
      </div>
    </div>
  );
}
