"use client";

import Link from "next/link";
import { use } from "react";
import BadgePill from "@/components/BadgePill";
import StarPill from "@/components/StarPill";
import StoriesCourseCard from "@/components/stories/StoriesCourseCard";
import WorldProgressBar from "@/components/WorldProgressBar";
import { useBadgeStatuses, useProfile, useSubject } from "@/lib/hooks";
import { rankArt, worldRank } from "@/lib/ranks";
import type { BadgeStatus, Lesson } from "@/lib/types";

function lessonCard(
  status: BadgeStatus,
  lesson: Lesson,
  lessonNumber: number,
  recommended: boolean,
  accent: string,
  subjectId: string,
) {
  const complete = status.completedLessonIds.includes(lesson.id);
  const icon = complete ? "star_gold" : recommended ? "star_radiant" : "star_empty";
  const action = complete ? "Practice again" : recommended ? "Start here" : "Start lesson";

  return (
    <Link
      key={lesson.id}
      href={`/lesson/${subjectId}/${status.badge.slug}?lesson=${lesson.order}`}
      className="group flex flex-col bg-white rounded-[24px] px-5 py-5 min-h-[236px] transition-transform hover:-translate-y-1"
      style={{
        border: `2px solid ${recommended ? accent : complete ? "#9AD883" : "rgba(0,0,0,.05)"}`,
        boxShadow: recommended
          ? "0 12px 28px rgba(60,40,90,.16)"
          : "0 6px 16px rgba(60,40,90,.09)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-baloo font-extrabold text-[11px] tracking-wide rounded-full px-3 py-1"
            style={{ color: accent, background: `${accent}15` }}
          >
            LESSON {lessonNumber}
          </span>
          {lesson.order > 0 && !complete && (
            <span
              className="font-baloo font-extrabold text-[10px] tracking-wide rounded-full px-2.5 py-1"
              style={{ color: "#A05C00", background: "#FFF0BD" }}
            >
              NEW
            </span>
          )}
          {complete && (
            <span className="font-baloo font-extrabold text-[10px] tracking-wide text-[#438D32]">
              ✓ COMPLETE
            </span>
          )}
        </div>
        <img
          src={`/universe/rewards/${icon}.webp`}
          alt=""
          className={`w-[48px] h-[48px] object-contain flex-none ${complete ? "lu-shimmer" : ""}`}
        />
      </div>

      <div
        className="font-baloo font-extrabold text-[21px] leading-tight mt-2"
        style={{ color: "#3b2a63" }}
      >
        {lesson.title}
      </div>
      <div className="font-bold text-[13.5px] leading-snug mt-1" style={{ color: "#7C6DA0" }}>
        {lesson.objective}
      </div>

      <div className="mt-auto pt-4">
        <div className="font-extrabold text-[11.5px] mb-2" style={{ color: accent }}>
          {status.badge.name} · {lesson.activities.length} interactive activities
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-[11px] truncate" style={{ color: "#998AB7" }}>
            {status.badge.skills.slice(0, 2).join(" · ")}
          </span>
          <span
            className="font-baloo font-extrabold text-white text-[12px] rounded-[12px] px-3.5 py-2 flex-none"
            style={{
              background: complete ? "#68BD4B" : accent,
              boxShadow: "0 3px 0 rgba(0,0,0,.17)",
            }}
          >
            {action} →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function WorldPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const profile = useProfile();
  const subject = useSubject(subjectId);
  const statuses = useBadgeStatuses(subjectId);

  if (!subject) return <div className="min-h-screen" />;

  const earned = statuses?.filter((s) => s.state === "earned").length ?? 0;
  const total = statuses?.length ?? 0;
  const completedLessons =
    statuses?.reduce((sum, status) => sum + status.completedLessonIds.length, 0) ?? 0;
  const totalLessons = statuses?.reduce((sum, status) => sum + status.lessons.length, 0) ?? 0;
  const lessonCards =
    statuses?.flatMap((status) => status.lessons.map((lesson) => ({ lesson, status }))) ?? [];
  const recommendedStatus = statuses?.find((status) => status.recommended);
  const recommendedLessonId = recommendedStatus?.lessons.find(
    (lesson) => !recommendedStatus.completedLessonIds.includes(lesson.id),
  )?.id;
  const rank = worldRank(subject, earned, total);

  return (
    <div className="min-h-screen flex-1" style={{ background: subject.bg }}>
      <div className="max-w-[1120px] mx-auto px-4 pt-5 pb-12 sm:px-7">
        {/* header */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" aria-label="Back to Universe" className="flex items-center gap-2.5">
            <img
              src="/universe/ui/back_button_small.webp"
              alt=""
              className="w-[44px] h-[48px] object-contain sm:w-[52px] sm:h-[56px]"
            />
            <span
              className="hidden font-baloo font-extrabold text-[16px] sm:inline"
              style={{ color: subject.accent }}
            >
              Universe
            </span>
          </Link>
          {subject.art.plaque ? (
            <img
              src={subject.art.plaque}
              alt={subject.name}
              className="h-[52px] min-w-0 object-contain sm:h-[76px]"
              style={{ filter: "drop-shadow(0 6px 10px rgba(60,40,90,.18))" }}
            />
          ) : (
            <div
              className="min-w-0 rounded-full border-[3px] bg-white px-4 py-2 text-center font-baloo text-[15px] font-extrabold leading-tight sm:px-7 sm:py-3 sm:text-[20px]"
              style={{
                color: subject.accent,
                borderColor: `${subject.accent}66`,
                boxShadow: "0 6px 10px rgba(60,40,90,.18)",
              }}
            >
              {subject.name}
            </div>
          )}
          <div className="flex items-center gap-2">
            <StarPill />
            <BadgePill subjectId={subjectId} accent={subject.accent} />
          </div>
        </div>

        {/* hero */}
        <div
          className="flex items-center gap-4 bg-white rounded-[28px] px-4 py-4 mt-4 flex-wrap sm:gap-6 sm:px-6 sm:py-5"
          style={{ boxShadow: "0 12px 30px rgba(60,40,90,.12)", border: "1px solid rgba(0,0,0,.04)" }}
        >
          <img
            src={subject.art.badge ?? subject.art.card}
            alt=""
            className="w-[76px] h-[76px] object-contain flex-none lu-bob sm:w-[104px] sm:h-[104px]"
          />
          <div className="flex-1 min-w-[220px]">
            <div className="font-baloo font-extrabold text-[26px] leading-tight" style={{ color: "#3b2a63" }}>
              {subject.name}
              {subject.environment && (
                <span className="font-bold text-[15px] ml-2" style={{ color: "#8a7ab0" }}>
                  · {subject.environment}
                </span>
              )}
            </div>
            <div className="font-bold text-[15px] mt-0.5 mb-3" style={{ color: subject.accent }}>
              {subject.verbs}
            </div>
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span
                className="inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 font-baloo font-extrabold text-[13px]"
                style={{ color: subject.accent, background: subject.chip }}
              >
                <img
                  src={`/universe/rewards/${rankArt(rank.tier)}.webp`}
                  alt=""
                  className="w-[25px] h-[28px] object-contain"
                />
                {rank.name} · Rank {rank.tier}/{rank.total}
              </span>
              <span className="font-bold text-[12.5px]" style={{ color: "#8a7ab0" }}>
                {rank.next
                  ? `${rank.toNext} more badge${rank.toNext === 1 ? "" : "s"} to ${rank.next}`
                  : "Top world rank achieved!"}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <WorldProgressBar
                value={completedLessons}
                max={totalLessons}
                accent={subject.accent}
                chip={subject.chip}
                ariaLabel={`${completedLessons} of ${totalLessons} lessons completed in ${subject.name}`}
                className="min-w-[140px] flex-1"
              />
              <span
                className="font-baloo font-extrabold text-[13px] whitespace-nowrap sm:text-[15px]"
                style={{ color: "#3b2a63" }}
              >
                {completedLessons} of {totalLessons} lessons · {earned}/{total} badges
              </span>
            </div>
          </div>
          <div
            className="flex-none flex items-center gap-2.5 rounded-[20px] pl-3 pr-4 py-3 w-full sm:w-auto sm:max-w-[260px]"
            style={{ background: subject.chip }}
          >
            <img
              src="/universe/dragon/dragon_point.webp"
              alt={profile?.mascot ?? "Aki"}
              className="w-[58px] h-[64px] object-contain"
              style={{ transform: "scaleX(-1)" }}
            />
            <span
              className="font-extrabold text-[13.5px] leading-snug"
              style={{ color: subject.accent }}
            >
              {subject.dragonLine}
            </span>
          </div>
        </div>

        <div className="font-baloo font-extrabold text-[19px] mt-6 mb-3 ml-1" style={{ color: "#3b2a63" }}>
          {totalLessons} lesson adventures — choose a card
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
          {lessonCards.map(({ lesson, status }, index) =>
            lessonCard(
              status,
              lesson,
              index + 1,
              lesson.id === recommendedLessonId,
              subject.accent,
              subjectId,
            ),
          )}
        </div>

        {subjectId === "english" && <StoriesCourseCard accent={subject.accent} />}
      </div>
    </div>
  );
}
