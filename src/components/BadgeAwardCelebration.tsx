"use client";

import { useEffect, useRef, useState } from "react";
import { BADGE_LANDED_EVENT, type BadgeAwardEventDetail } from "@/lib/badgeAward";

export default function BadgeAwardCelebration({
  subjectId,
  subjectName,
  badgeName,
  badgeImage,
  accent,
}: {
  subjectId: string;
  subjectName: string;
  badgeName: string;
  badgeImage: string;
  accent: string;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [flying, setFlying] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let disposed = false;
    let landed = false;
    let frame = 0;
    let flight: Animation | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;

    const target = document.querySelector<HTMLElement>(
      `[data-badge-pill-subject="${subjectId}"]`,
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finishLanding = () => {
      if (disposed || landed) return;
      landed = true;

      window.dispatchEvent(
        new CustomEvent<BadgeAwardEventDetail>(BADGE_LANDED_EVENT, {
          detail: { subjectId },
        }),
      );

      if (target && !reducedMotion) {
        target.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.18)" },
            { transform: "scale(0.96)" },
            { transform: "scale(1)" },
          ],
          { duration: 480, easing: "cubic-bezier(.2,.9,.25,1)" },
        );
      }

      closeTimer = setTimeout(() => setVisible(false), reducedMotion ? 0 : 160);
    };

    const revealTimer = setTimeout(
      () => {
        if (disposed) return;
        setFlying(true);

        if (reducedMotion) {
          finishLanding();
          return;
        }

        frame = requestAnimationFrame(() => {
          const badge = badgeRef.current;
          if (!badge || !target) {
            finishLanding();
            return;
          }

          const badgeBox = badge.getBoundingClientRect();
          const targetBox = target.getBoundingClientRect();
          const deltaX = targetBox.left + targetBox.width / 2 - (badgeBox.left + badgeBox.width / 2);
          const deltaY = targetBox.top + targetBox.height / 2 - (badgeBox.top + badgeBox.height / 2);

          flight = badge.animate(
            [
              {
                transform: "translate(-50%, -50%) translate(0, 0) scale(1) rotate(0deg)",
                opacity: 1,
                offset: 0,
              },
              {
                transform: `translate(-50%, -50%) translate(${deltaX * 0.78}px, ${deltaY * 0.7}px) scale(.48) rotate(8deg)`,
                opacity: 1,
                offset: 0.72,
              },
              {
                transform: `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px) scale(.16) rotate(0deg)`,
                opacity: 0.25,
                offset: 1,
              },
            ],
            {
              duration: 900,
              easing: "cubic-bezier(.32,.72,.22,1)",
              fill: "forwards",
            },
          );
          flight.finished.then(finishLanding).catch(() => {
            if (!disposed) finishLanding();
          });
        });
      },
      reducedMotion ? 700 : 1450,
    );

    return () => {
      disposed = true;
      clearTimeout(revealTimer);
      if (closeTimer) clearTimeout(closeTimer);
      cancelAnimationFrame(frame);
      flight?.cancel();
    };
  }, [subjectId]);

  if (!visible) return null;

  return (
    <div
      className="lu-badge-award-overlay"
      data-flying={flying || undefined}
      role="status"
      aria-live="assertive"
      aria-label={`Badge earned: ${badgeName}`}
    >
      <div className="lu-badge-award-backdrop" />
      <div className="lu-badge-award-sparkles" aria-hidden="true">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <div ref={badgeRef} className="lu-badge-award-badge" style={{ borderColor: `${accent}66` }}>
        <span className="lu-badge-award-glow" style={{ background: `${accent}55` }} />
        <img src={badgeImage} alt="" />
      </div>
      <div className="lu-badge-award-copy">
        <span style={{ color: accent }}>New badge!</span>
        <strong>{badgeName}</strong>
        <small>{subjectName}</small>
      </div>
    </div>
  );
}
