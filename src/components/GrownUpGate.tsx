"use client";

import { useEffect, useState } from "react";
import { shuffle } from "@/components/lesson/stage";

interface Puzzle {
  a: number;
  b: number;
  answer: number;
  options: number[];
}

function makePuzzle(): Puzzle {
  const a = 5 + Math.floor(Math.random() * 5);
  const b = 6 + Math.floor(Math.random() * 6);
  const answer = a + b;
  return { a, b, answer, options: shuffle([answer, answer + 2, answer - 3]) };
}

/** Simple maths gate so young children don't wander into grown-up features. */
export default function GrownUpGate({
  onPass,
  onCancel,
}: {
  onPass: () => void;
  /** When provided, shows a Cancel button (for gates opened from a button). */
  onCancel?: () => void;
}) {
  // Generated after mount: puzzles are random, so rendering one during SSR
  // would never match the client and cause a hydration error.
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setPuzzle(makePuzzle()), 0);
    return () => clearTimeout(id);
  }, []);
  const [tried, setTried] = useState<number[]>([]);

  if (!puzzle) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(58,42,99,.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white rounded-[28px] px-8 py-9 max-w-[420px] w-full text-center lu-rise"
        style={{ boxShadow: "0 24px 60px rgba(30,10,70,.35)" }}
      >
        <img
          src="/universe/dragon/dragon_thinking.webp"
          alt=""
          className="w-[92px] h-[100px] object-contain mx-auto"
        />
        <div className="font-baloo font-extrabold text-[24px] mt-2" style={{ color: "#3b2a63" }}>
          Grown-ups only
        </div>
        <p className="font-bold text-[14px] mt-1" style={{ color: "#7c6da0" }}>
          Ask a grown-up to answer to continue.
        </p>
        <div className="font-baloo font-extrabold text-[20px] mt-5 mb-3" style={{ color: "#6C3AD6" }}>
          What is {puzzle.a} + {puzzle.b}?
        </div>
        <div className="grid grid-cols-3 gap-3">
          {puzzle.options.map((o) => (
            <button
              key={o}
              type="button"
              disabled={tried.includes(o)}
              onClick={() => (o === puzzle.answer ? onPass() : setTried((t) => [...t, o]))}
              className="font-baloo font-extrabold text-[22px] rounded-[16px] py-3.5"
              style={{
                background: "#F4F1FA",
                color: "#3b2a63",
                border: "2px solid rgba(108,58,214,.15)",
                opacity: tried.includes(o) ? 0.4 : 1,
              }}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="font-bold text-[13px] mt-3 h-4" style={{ color: "#e0584f" }}>
          {tried.length > 0 ? "Not quite — try again." : ""}
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="font-baloo font-extrabold text-[13px] rounded-full px-5 py-2.5 mt-2"
            style={{ background: "#F4F1FA", color: "#3b2a63" }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
