/** Shared hand-drawn maths visuals: clock faces, coins, length bars and flat shapes. */

import type { Shape2D } from "@/lib/types";

const SHAPE_COLORS: Record<Shape2D, string> = {
  triangle: "#3D8BF2",
  square: "#43B649",
  circle: "#F5A623",
};

/** A crisp flat 2D shape with softly rounded corners — for side/corner questions. */
export function FlatShape({ kind, size, color }: { kind: Shape2D; size: number; color?: string }) {
  const fill = color ?? SHAPE_COLORS[kind];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 3px 6px rgba(60,40,90,.18))" }}
    >
      {kind === "triangle" ? (
        // Same-colour thick stroke with round joins gives the rounded corners.
        <path d="M50 14 L90 84 L10 84 Z" fill={fill} stroke={fill} strokeWidth={12} strokeLinejoin="round" />
      ) : kind === "square" ? (
        <rect x="12" y="12" width="76" height="76" rx="14" fill={fill} />
      ) : (
        <circle cx="50" cy="50" r="41" fill={fill} />
      )}
    </svg>
  );
}

export function ClockFace({ h, m, size, accent }: { h: number; m: number; size: number; accent: string }) {
  const hourAngle = ((h % 12) + m / 60) * 30;
  const minuteAngle = m * 6;
  const rim = Math.max(5, size * 0.055);

  return (
    <div
      className="relative rounded-full bg-white"
      style={{
        width: size,
        height: size,
        border: `${rim}px solid ${accent}`,
        boxShadow: "0 6px 16px rgba(60,40,90,.14)",
      }}
    >
      {Array.from({ length: 12 }, (_, i) => {
        const k = i + 1;
        const angle = ((k * 30 - 90) * Math.PI) / 180;
        const cardinal = k % 3 === 0;
        return (
          <span
            key={k}
            className="absolute -translate-x-1/2 -translate-y-1/2 font-baloo font-extrabold"
            style={{
              left: `${50 + 40 * Math.cos(angle)}%`,
              top: `${50 + 40 * Math.sin(angle)}%`,
              fontSize: size * (cardinal ? 0.15 : 0.108),
              color: cardinal ? "#8a7ab0" : "#b3a7cd",
            }}
          >
            {k}
          </span>
        );
      })}
      <div
        className="absolute left-1/2 bottom-1/2 rounded-[10px] bg-[#3b2a63]"
        style={{
          width: rim,
          height: size * 0.26,
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${hourAngle}deg)`,
        }}
      />
      <div
        className="absolute left-1/2 bottom-1/2 rounded-[10px]"
        style={{
          width: Math.max(3, size * 0.038),
          height: size * 0.38,
          background: accent,
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b2a63]"
        style={{ width: size * 0.11, height: size * 0.11 }}
      />
    </div>
  );
}

export function CoinFace({ cents, size }: { cents: number; size: number }) {
  const copper = cents === 1;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: copper
          ? "radial-gradient(circle at 34% 30%,#f0b45f,#c17d29)"
          : "radial-gradient(circle at 34% 30%,#eef2f6,#a4b4c4)",
        border: `${size * 0.06}px solid ${copper ? "#9c5f18" : "#7f8ea0"}`,
        boxShadow: "0 4px 10px rgba(60,40,90,.18)",
      }}
    >
      <span
        className="font-baloo font-extrabold"
        style={{ fontSize: size * 0.3, color: copper ? "#6b3d0a" : "#3f4b5e" }}
      >
        {cents}¢
      </span>
    </span>
  );
}

/** A cartoon pencil whose total length is `len` px — eraser, ferrule, painted body, wood tip. */
export function PencilBar({ len, color }: { len: number; color: string }) {
  const bodyLen = Math.max(24, len - 52);
  return (
    <span
      className="inline-flex max-w-full items-center"
      style={{ filter: "drop-shadow(0 4px 8px rgba(60,40,90,.2))" }}
    >
      <span
        className="h-[22px] w-[18px] flex-none"
        style={{ background: "#F49BB4", borderRadius: "9px 2px 2px 9px" }}
      />
      <span
        className="h-[26px] w-[10px] flex-none"
        style={{ background: "linear-gradient(180deg,#dde3ea,#96a2b2)" }}
      />
      <span
        className="h-[26px] min-w-0"
        style={{
          width: bodyLen,
          background: `linear-gradient(180deg, rgba(255,255,255,.4), rgba(255,255,255,0) 40%, rgba(0,0,0,.12)), ${color}`,
        }}
      />
      <span className="relative flex-none">
        <span
          className="block h-0 w-0"
          style={{
            borderTop: "13px solid transparent",
            borderBottom: "13px solid transparent",
            borderLeft: "24px solid #EFC98F",
          }}
        />
        <span
          className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2"
          style={{
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeft: "10px solid #4a3b5e",
          }}
        />
      </span>
    </span>
  );
}

export function LengthBar({ len, color }: { len: number; color: string }) {
  return (
    <span
      className="inline-block h-[26px] max-w-full rounded-[14px]"
      style={{ width: len, background: color, boxShadow: "0 4px 10px rgba(60,40,90,.16)" }}
    />
  );
}
