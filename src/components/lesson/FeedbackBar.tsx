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
      className="font-baloo font-extrabold text-white text-[15px] rounded-[16px] px-4 py-3 flex-none sm:text-[16px] sm:px-6"
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
        className="max-w-[860px] mx-auto m-3 rounded-[20px] px-4 py-3 flex items-center gap-3 sm:m-4 sm:rounded-[24px] sm:px-6 sm:py-4 sm:gap-4"
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
          className={`w-[44px] h-[48px] object-contain flex-none sm:w-[56px] sm:h-[62px] ${feedback?.celebration === "level-up" ? "lu-pop lu-shimmer" : ""}`}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-baloo font-extrabold text-[17px] leading-tight sm:text-[19px]"
            style={{ color: correct ? "#2E7D24" : "#C25B12" }}
          >
            {feedback?.title}
          </div>
          <div className="font-bold text-[13px] leading-snug sm:text-[14px]" style={{ color: "#5c4d7d" }}>
            {feedback?.message}
          </div>
        </div>
        {correct && <AutoAdvanceButton accent={accent} onNext={onNext} />}
      </div>
    </div>
  );
}
