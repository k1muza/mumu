"use client";

import { useState } from "react";
import { speak } from "./stage";

export default function SpeakerButton({
  word,
  accent,
  chip,
  speechEnabled,
  onPlay,
  iconOnly = false,
}: {
  word: string;
  accent: string;
  chip: string;
  speechEnabled: boolean;
  onPlay?: () => void;
  iconOnly?: boolean;
}) {
  const [played, setPlayed] = useState(false);
  const [preparing, setPreparing] = useState(false);

  if (iconOnly) {
    return (
      <button
        type="button"
        aria-busy={preparing}
        aria-label={`Hear “${word}”`}
        className="inline-flex items-center justify-center align-middle w-[44px] h-[44px] -my-2 rounded-full transition-transform active:scale-95"
        style={{ color: accent }}
        onClick={(e) => {
          setPlayed(true);
          speak(word, speechEnabled, setPreparing);
          onPlay?.();
          e.currentTarget.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
            { duration: 300 },
          );
        }}
      >
        {preparing ? (
          <span
            role="status"
            aria-live="polite"
            className="h-[26px] w-[26px] animate-spin rounded-full border-[3px] border-current border-t-transparent"
          />
        ) : (
          <img
            src="/universe/ui/sound_button.webp"
            alt=""
            className="w-[32px] h-[32px] object-contain"
          />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-busy={preparing}
      className="inline-flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 font-baloo font-extrabold text-[15px] transition-transform active:scale-95"
      style={{ background: chip, color: accent, border: `2px solid ${accent}33` }}
      onClick={(e) => {
        setPlayed(true);
        speak(word, speechEnabled, setPreparing);
        onPlay?.();
        e.currentTarget.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
          { duration: 300 },
        );
      }}
    >
      {preparing ? (
        <>
          <span
            aria-hidden="true"
            className="ml-1 h-[26px] w-[26px] flex-none animate-spin rounded-full border-[3px] border-current border-t-transparent"
          />
          <span role="status" aria-live="polite">
            Preparing
          </span>
        </>
      ) : (
        <>
          <img src="/universe/ui/sound_button.webp" alt="" className="w-[34px] h-[34px] object-contain" />
          <span>{played ? `“${word}”` : "Tap to hear"}</span>
        </>
      )}
    </button>
  );
}
