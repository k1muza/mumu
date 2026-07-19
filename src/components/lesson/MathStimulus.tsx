import FaIcon from "@/components/FaIcon";
import type { Stimulus } from "@/lib/types";
import { ClockFace, CoinFace, FlatShape, LengthBar } from "./math-art";

interface StarGroupProps {
  count: number;
  crossedOut?: number;
  img?: string;
}

/** A reusable, touch-friendly group of countable objects. */
export function StarGroup({ count, crossedOut = 0, img = "/universe/rewards/star_gold.png" }: StarGroupProps) {
  const firstCrossedOut = count - crossedOut;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      {Array.from({ length: count }, (_, index) => {
        const removed = index >= firstCrossedOut;
        return (
          <span
            key={index}
            className="relative inline-grid h-[52px] w-[52px] place-items-center sm:h-[62px] sm:w-[62px]"
          >
            <img
              src={img}
              alt=""
              className="h-full w-full object-contain lu-pop"
              style={{
                animationDelay: `${index * 0.08}s`,
                filter: removed ? "grayscale(.75)" : undefined,
                opacity: removed ? 0.38 : 1,
              }}
            />
            {removed && (
              <span
                aria-hidden="true"
                className="absolute h-[5px] w-[58px] rotate-[-18deg] rounded-full bg-[#E35D6A] shadow-[0_2px_0_rgba(139,35,49,.16)] sm:w-[68px]"
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

function SubtractionScene({ start, takeAway }: { start: number; takeAway: number }) {
  return (
    <div className="w-full text-center">
      <div className="sr-only">
        Start with {start} stars. {takeAway} are crossed out. Count the stars that are left.
      </div>
      <StarGroup count={start} crossedOut={takeAway} />
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="rounded-full bg-[#FFF4CC] px-3 py-1.5 font-extrabold text-[#A05C00]">
          Start with {start}
        </span>
        <span className="text-[22px] font-black text-[#9B8AB9]">−</span>
        <span className="rounded-full bg-[#FFE7EA] px-3 py-1.5 font-extrabold text-[#C54555]">
          Take away {takeAway}
        </span>
        <span className="text-[22px] font-black text-[#9B8AB9]">=</span>
        <span className="rounded-full bg-[#EEE7FB] px-4 py-1.5 font-baloo text-[20px] font-extrabold text-[#6C3AD6]">
          ?
        </span>
      </div>
    </div>
  );
}

const RULER_UNIT = 48;

function RulerScene({ n, accent }: { n: number; accent: string }) {
  // The clip row must span exactly the same width as the line — one clip per unit —
  // so the child can see how many clips fill the line. Both share the same min()
  // width so they stay aligned when the line shrinks on narrow screens.
  const width = `min(${n * RULER_UNIT}px, 100%)`;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <span className="inline-block h-[20px] rounded-[12px] bg-[#3b2a63]" style={{ width }} />
      <div className="flex items-center" style={{ width }}>
        {Array.from({ length: n }, (_, i) => (
          <span
            key={i}
            className="lu-pop flex flex-1 justify-center text-[28px] sm:text-[40px]"
            style={{ color: accent, animationDelay: `${i * 0.08}s` }}
          >
            {/* FA draws the paperclip at a slant; counter-rotate so it lies flat along the line. */}
            <FaIcon name="paperclip" className="rotate-45" />
          </span>
        ))}
      </div>
      <div className="text-[13px] font-bold text-[#8a7ab0]">Each paperclip is 1 unit long</div>
    </div>
  );
}

function scene(stimulus: Stimulus, chip: string, accent: string) {
  switch (stimulus.kind) {
    case "count":
      return <StarGroup count={stimulus.n} />;
    case "add":
      return (
        <>
          <div className="rounded-[18px] px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: chip }}>
            <StarGroup count={stimulus.a} />
          </div>
          <span className="font-baloo text-[30px] font-extrabold sm:text-[40px]" style={{ color: accent }}>
            +
          </span>
          <div className="rounded-[18px] px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: chip }}>
            <StarGroup count={stimulus.b} />
          </div>
        </>
      );
    case "subtract":
      return <SubtractionScene start={stimulus.start} takeAway={stimulus.takeAway} />;
    case "objects":
      return <StarGroup count={stimulus.n} img={stimulus.img} />;
    case "shapes":
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {Array.from({ length: stimulus.n }, (_, i) => (
            <span key={i} className="lu-pop inline-flex" style={{ animationDelay: `${i * 0.08}s` }}>
              <FlatShape kind={stimulus.shape} size={58} />
            </span>
          ))}
        </div>
      );
    case "clock":
      return (
        <>
          <div className="sm:hidden">
            <ClockFace h={stimulus.h} m={stimulus.m} size={160} accent={accent} />
          </div>
          <div className="hidden sm:block">
            <ClockFace h={stimulus.h} m={stimulus.m} size={196} accent={accent} />
          </div>
        </>
      );
    case "coins":
      return (
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          {stimulus.coins.map((cents, i) => (
            <span key={i} className="lu-pop" style={{ animationDelay: `${i * 0.08}s` }}>
              <CoinFace cents={cents} size={74} />
            </span>
          ))}
        </div>
      );
    case "ruler":
      return <RulerScene n={stimulus.n} accent={accent} />;
    case "bars":
      return (
        <div className="flex w-full max-w-[420px] flex-col gap-3">
          {stimulus.items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-[22px] font-baloo text-[18px] font-extrabold" style={{ color: accent }}>
                {item.label}
              </span>
              <LengthBar len={item.len} color={accent} />
            </div>
          ))}
        </div>
      );
  }
}

export default function MathStimulus({
  stimulus,
  chip,
  accent,
}: {
  stimulus: Stimulus;
  chip: string;
  accent: string;
}) {
  return (
    <div
      className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-[24px] bg-white px-3 py-5 sm:gap-4 sm:px-5 sm:py-6"
      style={{ boxShadow: "0 8px 22px rgba(60,40,90,.1)", border: "1px solid rgba(0,0,0,.04)" }}
    >
      {scene(stimulus, chip, accent)}
    </div>
  );
}
