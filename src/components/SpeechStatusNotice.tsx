"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { speech, type SpeechStatus } from "@/lib/tts";

const serverStatus = (): SpeechStatus => "idle";

function LoadingToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 3_000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-[max(4.75rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full px-3.5 py-2 font-bold sm:bottom-[max(1rem,env(safe-area-inset-bottom))]"
      style={{
        background: "#FFF8DC",
        border: "2px solid rgba(232,174,37,.28)",
        color: "#654B16",
        boxShadow: "0 8px 24px rgba(60,40,90,.18)",
      }}
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 flex-none animate-spin rounded-full border-2 border-current border-t-transparent"
      />
      <span className="text-[12.5px] leading-tight">
        Getting the reading voice ready… First setup may take a moment.
      </span>
    </div>
  );
}

export default function SpeechStatusNotice() {
  const status = useSyncExternalStore(speech.subscribe, speech.getStatus, serverStatus);

  return status === "loading" ? <LoadingToast /> : null;
}
