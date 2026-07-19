"use client";

import { useState } from "react";
import type { ListenActivity } from "@/lib/types";
import SpeakerButton from "./SpeakerButton";
import type { StageProps } from "./stage";

export default function ListenStage({
  activity,
  accent,
  chip,
  onAdvance,
  speechEnabled,
}: StageProps<ListenActivity>) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="bg-white rounded-[26px] px-4 py-6 flex flex-col items-center gap-4 sm:px-6 sm:py-7"
      style={{ boxShadow: "0 8px 22px rgba(60,40,90,.1)", border: "1px solid rgba(0,0,0,.04)" }}
    >
      <img src={activity.img} alt="" className="w-[120px] h-[120px] object-contain lu-pop sm:w-[150px] sm:h-[150px]" />
      <SpeakerButton
        word={activity.word}
        accent={accent}
        chip={chip}
        speechEnabled={speechEnabled}
        onPlay={() => setRevealed(true)}
      />
      <div
        className="font-baloo font-extrabold text-[32px] tracking-wide transition-opacity duration-300 sm:text-[40px]"
        style={{ color: accent, opacity: revealed ? 1 : 0 }}
      >
        {activity.word}
      </div>
      <button
        type="button"
        onClick={onAdvance}
        className="font-baloo font-extrabold text-white text-[16px] rounded-[16px] px-8 py-3 mt-1"
        style={{ background: accent, boxShadow: "0 5px 0 rgba(0,0,0,.18)" }}
      >
        Got it!
      </button>
    </div>
  );
}
