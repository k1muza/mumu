"use client";

import { useId, useState } from "react";
import FaIcon from "@/components/FaIcon";
import { useProfile } from "@/lib/hooks";
import { levelProgress } from "@/lib/progress";

/** Star counter pill. `dark` renders the translucent style used on the universe background. */
export default function StarPill({ dark = false }: { dark?: boolean }) {
  const stars = useProfile()?.stars ?? 0;
  const level = levelProgress(stars);
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <div className="lu-counter-pill-wrap">
      <button
        type="button"
        className="lu-counter-pill flex items-center gap-1.5 rounded-full pl-1.5 pr-4 py-1.5"
        aria-label={`${stars} ${stars === 1 ? "star" : "stars"}, level ${level.level}. Show star summary`}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((current) => !current)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        style={
          dark
            ? { background: "rgba(255,255,255,.16)", border: "2px solid rgba(255,255,255,.32)" }
            : {
                background: "#fff",
                border: "2px solid rgba(0,0,0,.06)",
                boxShadow: "0 5px 14px rgba(60,40,90,.12)",
              }
        }
      >
        <FaIcon name="star" className="lu-control-icon w-[25px] h-[25px] text-[25px] text-[#FFD43B]" />
        <span
          key={stars}
          aria-hidden="true"
          className="lu-counter-update font-baloo font-extrabold text-[17px]"
          style={{ color: dark ? "#fff" : "#F59E0B" }}
        >
          {stars}
        </span>
      </button>
      {open && (
        <span id={tooltipId} role="tooltip" className="lu-counter-tooltip">
          {stars} {stars === 1 ? "star" : "stars"} · Level {level.level} · {level.neededForNext} to
          next level
        </span>
      )}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {stars} {stars === 1 ? "star" : "stars"}
      </span>
    </div>
  );
}
