"use client";

import { useEffect, useState } from "react";

const AUTO_ADVANCE_SECONDS = 3;

function AutoAdvanceButton({ accent, onNext }: { accent: string; onNext: () => void }) {
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SECONDS);

  useEffect(() => {
    let secondsLeft = AUTO_ADVANCE_SECONDS;
    const countdownTimer = window.setInterval(() => {
      if (secondsLeft <= 1) return;
      secondsLeft -= 1;
      setCountdown(secondsLeft);
    }, 1000);
    const advanceTimer = window.setTimeout(onNext, AUTO_ADVANCE_SECONDS * 1000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(advanceTimer);
    };
  }, [onNext]);

  return (
    <button
      type="button"
      onClick={onNext}
      className="font-baloo font-extrabold text-white text-[16px] rounded-[16px] px-6 py-3 flex-none"
      style={{ background: accent, boxShadow: "0 5px 0 rgba(0,0,0,.2)" }}
    >
      <span>Next</span>
      <span
        className="ml-2 inline-flex min-w-7 h-6 items-center justify-center rounded-full px-1 text-[12px] tabular-nums"
        style={{ background: "rgba(255,255,255,.22)" }}
        aria-label={`Automatically continuing in ${countdown} seconds`}
      >
        {countdown}s
      </span>
    </button>
  );
}

export interface Feedback {
  kind: "correct" | "wrong";
  title: string;
  message: string;
  celebration?: "level-up";
}

export default function FeedbackBar({
  feedback,
  accent,
  onNext,
}: {
  feedback: Feedback | null;
  accent: string;
  onNext: () => void;
}) {
  const correct = feedback?.kind === "correct";
  return (
    <div
      className="fixed inset-x-0 bottom-0 transition-transform duration-300 z-30"
      style={{ transform: feedback ? "translateY(0)" : "translateY(100%)" }}
      aria-live="polite"
    >
      <div
        className="max-w-[860px] mx-auto m-4 rounded-[24px] px-6 py-4 flex items-center gap-4"
        style={{
          background: correct ? "#EAF9E4" : "#FFF3E6",
          boxShadow: "0 -6px 30px rgba(60,40,90,.2)",
        }}
      >
        <img
          src={
            feedback?.celebration === "level-up"
              ? "/universe/rewards/level_badge.png"
              : `/universe/dragon/${correct ? "dragon_cheer" : "dragon_thinking"}.png`
          }
          alt=""
          className={`w-[56px] h-[62px] object-contain flex-none ${feedback?.celebration === "level-up" ? "lu-pop lu-shimmer" : ""}`}
        />
        <div className="flex-1">
          <div
            className="font-baloo font-extrabold text-[19px] leading-tight"
            style={{ color: correct ? "#2E7D24" : "#C25B12" }}
          >
            {feedback?.title}
          </div>
          <div className="font-bold text-[14px] leading-snug" style={{ color: "#5c4d7d" }}>
            {feedback?.message}
          </div>
        </div>
        {correct && <AutoAdvanceButton accent={accent} onNext={onNext} />}
      </div>
    </div>
  );
}
