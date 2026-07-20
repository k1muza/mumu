"use client";

import { useEffect, useRef } from "react";
import { useAudioGenerationStore } from "@/lib/tts/generationStore";
import { VOICE_OPTIONS } from "@/lib/tts/protocol";

/**
 * Root-mounted owner of audio generation. Because this component lives in the
 * app layout, client-side navigation cannot unmount or cancel the active job.
 */
export default function AudioGenerationManager() {
  const jobId = useAudioGenerationStore((state) => state.jobId);
  const phase = useAudioGenerationStore((state) => state.phase);
  const voice = useAudioGenerationStore((state) => state.voice);
  const completed = useAudioGenerationStore((state) => state.completed);
  const total = useAudioGenerationStore((state) => state.total);
  const stop = useAudioGenerationStore((state) => state.stop);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (phase !== "generating" || !voice) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    const run = async () => {
      try {
        const [{ speech }, library] = await Promise.all([
          import("@/lib/tts"),
          import("@/lib/tts/library"),
        ]);
        if (controller.signal.aborted) {
          useAudioGenerationStore.getState().finish(jobId);
          return;
        }
        const texts = library.speechLibraryTexts(voice);

        void navigator.storage?.persist?.();
        speech.stop();
        await library.removeObsoleteSpeechClips(voice);

        let done = await library.countSpeechLibraryClips(voice);
        useAudioGenerationStore.getState().setProgress(jobId, done, texts.length);

        for (const text of texts) {
          if (controller.signal.aborted) break;
          if (await library.getSpeechClip(text, voice)) continue;

          const blob = await speech.generateClip(text, { voice });
          if (controller.signal.aborted) break;
          await library.putSpeechClip(text, voice, 1, blob);
          done += 1;
          useAudioGenerationStore.getState().setProgress(jobId, done, texts.length);
        }

        useAudioGenerationStore.getState().finish(jobId);
      } catch (cause) {
        if (controller.signal.aborted) {
          useAudioGenerationStore.getState().finish(jobId);
        } else {
          useAudioGenerationStore
            .getState()
            .fail(jobId, cause instanceof Error ? cause.message : "Audio generation failed.");
        }
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    };

    void run();
    return () => controller.abort();
  }, [jobId, phase, voice]);

  useEffect(() => {
    if (phase === "stopping") controllerRef.current?.abort();
  }, [phase]);

  if (phase === "idle" || !voice) return null;

  const voiceLabel = VOICE_OPTIONS.find((option) => option.id === voice)?.label ?? voice;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-[max(4.75rem,env(safe-area-inset-bottom))] left-1/2 z-[95] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 rounded-[18px] bg-white px-4 py-3 sm:bottom-[max(1rem,env(safe-area-inset-bottom))]"
      style={{ boxShadow: "0 10px 30px rgba(60,40,90,.22)", border: "2px solid #DDD2F2" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-baloo text-[13px] font-extrabold" style={{ color: "#3b2a63" }}>
            {phase === "stopping" ? "Stopping audio generation…" : `Generating ${voiceLabel} audio`}
          </div>
          <div className="font-bold text-[11px]" style={{ color: "#8578a6" }}>
            {total ? `${completed}/${total} clips · ${percent}%` : "Preparing the voice model…"}
          </div>
        </div>
        <button
          type="button"
          disabled={phase === "stopping"}
          onClick={stop}
          className="flex-none rounded-full px-3 py-1.5 font-baloo text-[12px] font-extrabold"
          style={{ background: "#FDEBEA", color: "#C33A32", opacity: phase === "stopping" ? 0.6 : 1 }}
        >
          {phase === "stopping" ? "Stopping…" : "Stop"}
        </button>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#EEE7F5" }}>
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${percent}%`, background: "#6C3AD6" }}
        />
      </div>
    </aside>
  );
}
