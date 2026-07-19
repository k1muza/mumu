import { speech } from "@/lib/tts";
import type { Activity } from "@/lib/types";

/** Contract every activity stage component implements. */
export interface StageProps<A extends Activity = Activity> {
  activity: A;
  accent: string;
  chip: string;
  /** Locked after a correct answer while the feedback bar is open. */
  answered: boolean;
  /** Correct response chosen — show explaining feedback with a Next button. */
  onCorrect: (message: string) => void;
  /** Wrong response — flash a gentle hint. */
  onWrong: (hint: string) => void;
  /** Stage finished on its own (no right/wrong), move on. */
  onAdvance: () => void;
  speechEnabled: boolean;
}

/** Fisher–Yates shuffle (non-mutating). */
export function shuffle<T>(items: T[]): T[] {
  const r = [...items];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Speak a word or sentence with Kokoro TTS (speechSynthesis until it loads). */
export function speak(
  text: string,
  enabled: boolean,
  onPreparingChange?: (preparing: boolean) => void,
) {
  if (!enabled) return;
  speech.speak(text, { onPreparingChange });
}

export const shake = (el: HTMLElement) =>
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-7px)" },
      { transform: "translateX(7px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 300 },
  );
