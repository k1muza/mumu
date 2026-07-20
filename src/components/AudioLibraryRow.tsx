"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { speech } from "@/lib/tts";
import {
  countSpeechLibraryClips,
  getSpeechClip,
  putSpeechClip,
  removeObsoleteSpeechClips,
  speechLibraryTexts,
} from "@/lib/tts/library";
import type { VoiceId } from "@/lib/tts/protocol";

type Phase = "idle" | "generating" | "stopping";

export default function AudioLibraryRow({ voice }: { voice: VoiceId }) {
  const texts = useMemo(() => speechLibraryTexts(voice), [voice]);
  const storedCount = useLiveQuery(() => countSpeechLibraryClips(voice), [voice], 0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [completed, setCompleted] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const running = phase !== "idle";
  const ready = storedCount === texts.length;
  const shownCompleted = running ? completed : storedCount;
  const percent = texts.length ? Math.round((shownCompleted / texts.length) * 100) : 100;

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, [voice]);

  const generate = async () => {
    const controller = new AbortController();
    controllerRef.current = controller;
    setPhase("generating");
    setCompleted(0);
    setError(null);
    speech.stop();

    try {
      void navigator.storage?.persist?.();
      await removeObsoleteSpeechClips(voice);

      let done = 0;
      for (const text of texts) {
        if (controller.signal.aborted) break;

        const existing = await getSpeechClip(text, voice);
        if (!existing) {
          const blob = await speech.generateClip(text, { voice });
          if (controller.signal.aborted) break;
          await putSpeechClip(text, voice, 1, blob);
        }

        done += 1;
        setCompleted(done);
      }
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : "Audio generation failed.");
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      setPhase("idle");
    }
  };

  const stop = () => {
    controllerRef.current?.abort();
    setPhase("stopping");
  };

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="font-baloo font-extrabold text-[15px]" style={{ color: "#3b2a63" }}>
            Offline audio library
          </div>
          <div className="font-bold text-[12.5px]" style={{ color: "#8578a6" }}>
            You can pre-generate audio for faster reading, using the selected voice.
          </div>
        </div>
        {running ? (
          <button
            type="button"
            disabled={phase === "stopping"}
            onClick={stop}
            className="font-baloo font-extrabold text-[13px] rounded-full px-4 py-2.5"
            style={{
              background: "#FDEBEA",
              color: "#C33A32",
              border: "2px solid #F3C9C6",
              opacity: phase === "stopping" ? 0.6 : 1,
            }}
          >
            {phase === "stopping" ? "Stopping…" : "Stop"}
          </button>
        ) : (
          <button
            type="button"
            disabled={ready}
            onClick={() => void generate()}
            className="font-baloo font-extrabold text-[13px] rounded-full px-4 py-2.5 text-white"
            style={{ background: ready ? "#3E9A34" : "#6C3AD6", opacity: ready ? 0.8 : 1 }}
          >
            {ready ? "Audio ready ✓" : storedCount ? "Continue generating" : "Generate audio"}
          </button>
        )}
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full" style={{ background: "#EEE7F5" }}>
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${percent}%`, background: ready ? "#3E9A34" : "#6C3AD6" }}
        />
      </div>
      <div className="mt-1.5 flex justify-between gap-3 font-bold text-[11.5px]" style={{ color: "#8578a6" }}>
        <span>
          {running
            ? `${phase === "stopping" ? "Finishing the current clip" : "Generating"} · ${shownCompleted}/${texts.length}`
            : `${storedCount}/${texts.length} clips stored`}
        </span>
        <span>{percent}%</span>
      </div>
      {error && (
        <p role="alert" className="mt-2 font-bold text-[12px]" style={{ color: "#C33A32" }}>
          {error}
        </p>
      )}
      <p className="mt-2 font-bold text-[11.5px]" style={{ color: "#a99ac8" }}>
        Keep this page open while generating. Completed clips are saved as it goes.
      </p>
    </div>
  );
}
