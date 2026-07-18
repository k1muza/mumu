"use client";

import { useEffect, useId, useRef, useState } from "react";
import FaIcon from "@/components/FaIcon";
import {
  BADGE_AWARD_STARTED_EVENT,
  BADGE_LANDED_EVENT,
  type BadgeAwardEventDetail,
} from "@/lib/badgeAward";
import { useBadgeStatuses } from "@/lib/hooks";

const SUBJECT_LABELS: Record<string, string> = {
  english: "English",
  maths: "Math",
  science: "Science",
  shona: "Shona",
  mandarin: "Mandarin",
};

/** Live counter for badges earned in the current subject world. */
export default function BadgePill({
  subjectId,
  accent = "#6C3AD6",
}: {
  subjectId: string;
  accent?: string;
}) {
  const statuses = useBadgeStatuses(subjectId);
  const earned = statuses?.filter((status) => status.state === "earned").length ?? 0;
  const total = statuses?.length ?? 0;
  const [displayedEarned, setDisplayedEarned] = useState(earned);
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const holdIncrement = useRef(false);
  const subjectLabel = SUBJECT_LABELS[subjectId] ?? subjectId;
  const tooltipText = `You have ${displayedEarned} ${subjectLabel} ${displayedEarned === 1 ? "badge" : "badges"}`;

  useEffect(() => {
    const handleStarted = (event: Event) => {
      const { subjectId: awardedSubject } = (event as CustomEvent<BadgeAwardEventDetail>).detail;
      if (awardedSubject === subjectId) holdIncrement.current = true;
    };
    const handleLanded = (event: Event) => {
      const { subjectId: awardedSubject } = (event as CustomEvent<BadgeAwardEventDetail>).detail;
      if (awardedSubject !== subjectId) return;
      holdIncrement.current = false;
      setDisplayedEarned(earned);
    };

    window.addEventListener(BADGE_AWARD_STARTED_EVENT, handleStarted);
    window.addEventListener(BADGE_LANDED_EVENT, handleLanded);
    return () => {
      window.removeEventListener(BADGE_AWARD_STARTED_EVENT, handleStarted);
      window.removeEventListener(BADGE_LANDED_EVENT, handleLanded);
    };
  }, [earned, subjectId]);

  useEffect(() => {
    if (earned === displayedEarned) return;
    const delay = earned > displayedEarned && holdIncrement.current ? 4000 : 0;
    const timer = setTimeout(() => {
      holdIncrement.current = false;
      setDisplayedEarned(earned);
    }, delay);
    return () => clearTimeout(timer);
  }, [displayedEarned, earned]);

  return (
    <div className="lu-counter-pill-wrap">
      <button
        type="button"
        className="lu-counter-pill flex items-center gap-1.5 rounded-full pl-2 pr-4 py-1.5"
        data-badge-pill-subject={subjectId}
        aria-label={`${displayedEarned} of ${total} badges earned in this world. Show badge summary`}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((current) => !current)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        style={{
          background: "#fff",
          border: "2px solid rgba(0,0,0,.06)",
          boxShadow: "0 5px 14px rgba(60,40,90,.12)",
        }}
      >
        <FaIcon
          name="award"
          className="lu-control-icon w-[25px] h-[25px] text-[24px]"
          style={{ color: accent }}
        />
        <span
          key={displayedEarned}
          aria-hidden="true"
          className="lu-counter-update font-baloo font-extrabold text-[17px]"
          style={{ color: accent }}
        >
          {displayedEarned}
        </span>
      </button>
      {open && (
        <span id={tooltipId} role="tooltip" className="lu-counter-tooltip">
          {tooltipText}
        </span>
      )}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {displayedEarned} of {total} badges earned in this world
      </span>
    </div>
  );
}
