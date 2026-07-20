"use client";

import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { countSpeechLibraryClips, speechLibraryTexts } from "@/lib/tts/library";
import { useAudioGenerationStore } from "@/lib/tts/generationStore";
import type { VoiceId } from "@/lib/tts/protocol";

export default function AudioLibraryRow({ voice }: { voice: VoiceId }) {
  const texts = useMemo(() => speechLibraryTexts(voice), [voice]);
  const storedCount = useLiveQuery(() => countSpeechLibraryClips(voice), [voice], 0);
  const phase = useAudioGenerationStore((state) => state.phase);
  const jobVoice = useAudioGenerationStore((state) => state.voice);
  const completed = useAudioGenerationStore((state) => state.completed);
  const jobTotal = useAudioGenerationStore((state) => state.total);
  const error = useAudioGenerationStore((state) => state.error);
  const start = useAudioGenerationStore((state) => state.start);
  const stop = useAudioGenerationStore((state) => state.stop);
  const running = phase !== "idle";
  const ready = storedCount === texts.length;
  const showingThisVoice = running && jobVoice === voice;
  const shownCompleted = showingThisVoice ? completed : storedCount;
  const shownTotal = showingThisVoice ? jobTotal || texts.length : texts.length;
  const percent = shownTotal ? Math.round((shownCompleted / shownTotal) * 100) : 100;

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
            onClick={() => start(voice)}
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
          {showingThisVoice
            ? `${phase === "stopping" ? "Finishing the current clip" : "Generating"} · ${shownCompleted}/${shownTotal}`
            : running
              ? `Another voice is generating · ${storedCount}/${texts.length} clips stored`
              : `${storedCount}/${texts.length} clips stored`}
        </span>
        <span>{percent}%</span>
      </div>
      {error && jobVoice === voice && (
        <p role="alert" className="mt-2 font-bold text-[12px]" style={{ color: "#C33A32" }}>
          {error}
        </p>
      )}
      <p className="mt-2 font-bold text-[11.5px]" style={{ color: "#a99ac8" }}>
        Generation continues while you visit other pages. Completed clips are saved as it goes.
      </p>
    </div>
  );
}
