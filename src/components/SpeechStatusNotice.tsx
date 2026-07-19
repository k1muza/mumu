"use client";

import { useSyncExternalStore } from "react";
import { speech, type SpeechStatus } from "@/lib/tts";

const serverStatus = (): SpeechStatus => "idle";

export default function SpeechStatusNotice({ className = "" }: { className?: string }) {
  const status = useSyncExternalStore(speech.subscribe, speech.getStatus, serverStatus);

  if (status !== "loading") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`flex w-fit items-center gap-2.5 rounded-full px-3.5 py-2 font-bold ${className}`}
      style={{
        background: "#FFF8DC",
        border: "2px solid rgba(232,174,37,.28)",
        color: "#654B16",
        boxShadow: "0 5px 14px rgba(60,40,90,.08)",
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
