import type { CSSProperties } from "react";

const STARS = [
  { top: 6, left: 20, size: 25, kind: "sparkle", rotate: -8, fill: "#78B8FF", edge: "#D9E9FF", glow: "#78B8FF" },
  { top: 15, left: 62, size: 20, kind: "burst", rotate: 8, fill: "#FFD83D", edge: "#FFF8C5", glow: "#FFE05B" },
  { top: 24, left: 12, size: 29, kind: "star", rotate: -5, fill: "#FFC431", edge: "#FFF3AF", glow: "#FFD64D" },
  { top: 30, left: 84, size: 31, kind: "sunburst", rotate: 5, fill: "#CA8FFF", edge: "#F0DCFF", glow: "#D6A2FF" },
  { top: 12, left: 40, size: 17, kind: "sparkle", rotate: 18, fill: "#FFE15B", edge: "#FFF9CD", glow: "#FFE477" },
  { top: 42, left: 6, size: 25, kind: "star", rotate: 6, fill: "#FFD33D", edge: "#FFF7BC", glow: "#FFE066" },
  { top: 50, left: 90, size: 21, kind: "flare", rotate: -12, fill: "#67E2F2", edge: "#D9FBFF", glow: "#78ECFA" },
  { top: 60, left: 30, size: 19, kind: "burst", rotate: 10, fill: "#E09BFF", edge: "#F5DFFF", glow: "#E6AAFF" },
  { top: 8, left: 78, size: 22, kind: "star", rotate: -9, fill: "#FFDA49", edge: "#FFF8C2", glow: "#FFE36C" },
  { top: 38, left: 52, size: 16, kind: "sparkle", rotate: 4, fill: "#8CAFFF", edge: "#DFE7FF", glow: "#9CB9FF" },
] as const;

type TwinkleStyle = CSSProperties & {
  "--twinkle-fill": string;
  "--twinkle-edge": string;
  "--twinkle-glow": string;
};

/** Crisp CSS stars scattered over dark universe backgrounds. */
export default function TwinkleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {STARS.map((star, index) => (
        <span
          key={`${star.top}-${star.left}`}
          className="lu-css-twinkle"
          style={{
            position: "absolute",
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animation: `luTwinkle ${2.4 + (index % 4) * 0.6}s ease-in-out ${index * 0.3}s infinite`,
          }}
        >
          <span
            className={`lu-css-twinkle-shape is-${star.kind}`}
            style={
              {
                "--twinkle-fill": star.fill,
                "--twinkle-edge": star.edge,
                "--twinkle-glow": star.glow,
                rotate: `${star.rotate}deg`,
              } as TwinkleStyle
            }
          />
        </span>
      ))}
    </div>
  );
}
