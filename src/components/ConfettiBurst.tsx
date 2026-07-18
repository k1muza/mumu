"use client";

import { useMemo } from "react";

const COLORS = ["#FFD34D", "#FF7DAB", "#6C3AD6", "#37C0B4", "#FF9C42", "#7DC9FF"];
const PIECE_COUNT = 36;

/** Full-screen falling-confetti overlay for celebration screens. */
export default function ConfettiBurst({ accent }: { accent?: string }) {
  const pieces = useMemo(() => {
    const palette = accent ? [...COLORS, accent, accent] : COLORS;
    return Array.from({ length: PIECE_COUNT }, (_, i) => ({
      left: `${(i / PIECE_COUNT) * 100 + Math.random() * (100 / PIECE_COUNT)}%`,
      color: palette[Math.floor(Math.random() * palette.length)],
      delay: `${Math.random() * 1.6}s`,
      duration: `${2.6 + Math.random() * 1.8}s`,
      drift: `${Math.random() * 90 - 45}px`,
      spin: `${Math.random() * 540 + 360}deg`,
      width: 7 + Math.random() * 5,
      height: 10 + Math.random() * 6,
      round: Math.random() < 0.3,
    }));
  }, [accent]);

  return (
    <div className="lu-confetti" aria-hidden="true">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="lu-confetti-piece"
          style={
            {
              left: piece.left,
              width: piece.width,
              height: piece.round ? piece.width : piece.height,
              background: piece.color,
              borderRadius: piece.round ? "50%" : 2,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              "--confetti-drift": piece.drift,
              "--confetti-spin": piece.spin,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
