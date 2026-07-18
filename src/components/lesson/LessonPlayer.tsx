"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BadgeAwardCelebration from "@/components/BadgeAwardCelebration";
import BadgePill from "@/components/BadgePill";
import StarPill from "@/components/StarPill";
import { BADGE_AWARD_STARTED_EVENT, type BadgeAwardEventDetail } from "@/lib/badgeAward";
import { db } from "@/lib/db";
import { useBadgeStatuses, useProfile } from "@/lib/hooks";
import {
  awardCorrectAnswer,
  completeLesson,
  nextLesson,
  type CompletionResult,
} from "@/lib/progress";
import { speech } from "@/lib/tts";
import { rankArt, worldRank } from "@/lib/ranks";
import type { Activity, ChoiceActivity, Lesson } from "@/lib/types";
import BuildWordStage from "./BuildWordStage";
import ChoiceStage from "./ChoiceStage";
import FeedbackBar, { type Feedback } from "./FeedbackBar";
import ListenStage from "./ListenStage";
import MathStimulus from "./MathStimulus";
import type { StageProps } from "./stage";

/** Registry of activity renderers — add new activity kinds here. */
const STAGES: Record<Activity["kind"], React.ComponentType<StageProps<never>>> = {
  choice: ChoiceStage as React.ComponentType<StageProps<never>>,
  listen: ListenStage as React.ComponentType<StageProps<never>>,
  "build-word": BuildWordStage as React.ComponentType<StageProps<never>>,
};

const PRAISE = ["Great job!", "You did it!", "Brilliant!", "Well done!", "Superstar!", "Yes!"];

function promptFor(activity: Activity): string {
  switch (activity.kind) {
    case "listen":
      return `Listen to the word “${activity.word}”`;
    case "build-word":
      return "Build the word — tap the letters in order";
    default:
      return activity.prompt;
  }
}

export default function LessonPlayer({
  subjectId,
  badgeSlug,
  lessonOrder,
}: {
  subjectId: string;
  badgeSlug: string;
  lessonOrder?: number;
}) {
  const profile = useProfile();
  const statuses = useBadgeStatuses(subjectId);

  const data = useLiveQuery(async () => {
    const [subject, badge] = await Promise.all([
      db.subjects.get(subjectId),
      db.badges.get(`${subjectId}:${badgeSlug}`),
    ]);
    if (!subject || !badge) return null;
    const [lessons, progress] = await Promise.all([
      db.lessons.where("badgeId").equals(badge.id).sortBy("order"),
      db.progress.where("badgeId").equals(badge.id).toArray(),
    ]);
    return { subject, badge, lessons, progress };
  }, [subjectId, badgeSlug]);

  // Freeze the lesson on first load so live progress updates don't swap it mid-play.
  const [lesson, setLesson] = useState<Lesson | null>(null);
  useEffect(() => {
    if (lesson || !data?.lessons.length) return;

    const doneIds = new Set(data.progress.map((progress) => progress.lessonId));
    const requested = data.lessons.find((candidate) => candidate.order === lessonOrder);
    const selected =
      requested ?? data.lessons.find((candidate) => !doneIds.has(candidate.id)) ?? data.lessons[0];
    let active = true;
    queueMicrotask(() => {
      if (active) setLesson(selected);
    });

    return () => {
      active = false;
    };
  }, [data, lesson, lessonOrder]);

  const [idx, setIdx] = useState(0);
  // Manually chosen variation per slot index; unset slots follow the rotation.
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [result, setResult] = useState<CompletionResult | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completing = useRef(false);

  const slots = lesson?.activities ?? [];
  const finished = lesson !== null && idx >= slots.length;

  // Variations of this lesson already answered correctly (any session).
  const answeredKeys = useLiveQuery(
    () =>
      lesson
        ? db.variantCredit.where("key").startsWith(`${lesson.id}:`).primaryKeys()
        : Promise.resolve([] as string[]),
    [lesson?.id],
  );
  const answeredSet = new Set(answeredKeys ?? []);

  useEffect(() => {
    if (finished && lesson && !completing.current) {
      completing.current = true;
      void completeLesson(lesson).then((completion) => {
        if (completion.badgeEarned) {
          window.dispatchEvent(
            new CustomEvent<BadgeAwardEventDetail>(BADGE_AWARD_STARTED_EVENT, {
              detail: { subjectId },
            }),
          );
        }
        setResult(completion);
      });
    }
  }, [finished, lesson, subjectId]);

  useEffect(() => () => {
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    speech.stop();
  }, []);

  // Warm up the Kokoro model so the first tap-to-hear doesn't need the fallback voice.
  const speechEnabled = !!profile?.settings.speech;
  useEffect(() => {
    if (speechEnabled) speech.preload();
  }, [speechEnabled]);

  const advance = useCallback(() => {
    speech.stop();
    setFeedback(null);
    setIdx((i) => i + 1);
  }, []);

  if (!data || !lesson) {
    return <div className="min-h-screen flex-1" style={{ background: data?.subject.bg }} />;
  }

  const { subject, badge } = data;
  const completedIds = new Set(data.progress.map((p) => p.lessonId));
  const nextLessonInBadge = data.lessons.find(
    (candidate) => candidate.order > lesson.order && !completedIds.has(candidate.id),
  );
  // Rotate variations with each replay so revision practises the skill, not the answer.
  const completions =
    data.progress.find((p) => p.lessonId === lesson.id)?.timesCompleted ?? 0;
  const slot = slots[idx];
  const variantIdx = slot?.length ? (picked[idx] ?? completions % slot.length) : 0;
  const activity = slot?.[variantIdx] as Activity | undefined;
  const answered = feedback?.kind === "correct";

  const handleCorrect = (message: string) => {
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    void awardCorrectAnswer(`${lesson.id}:${idx}:${variantIdx}`).then((award) => {
      if (award.awarded && award.level > award.previousLevel) {
        setFeedback({
          kind: "correct",
          title: `Level ${award.level}!`,
          message: "You levelled up — keep collecting stars!",
          celebration: "level-up",
        });
      }
    });
    setFeedback({
      kind: "correct",
      title: PRAISE[Math.floor(Math.random() * PRAISE.length)],
      message,
    });
  };

  const handleWrong = (hint: string) => {
    setFeedback({ kind: "wrong", title: "Try again", message: hint });
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    wrongTimer.current = setTimeout(() => setFeedback(null), 1600);
  };

  const switchVariant = (i: number) => {
    if (i === variantIdx) return;
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    speech.stop();
    setFeedback(null);
    setPicked((prev) => ({ ...prev, [idx]: i }));
  };

  const continueBadge = () => {
    if (!nextLessonInBadge || !result) return;
    completing.current = false;
    setResult(null);
    setFeedback(null);
    setIdx(0);
    setPicked({});
    setLesson(nextLessonInBadge);
  };

  const Stage = activity ? STAGES[activity.kind] : null;
  const stimulus = activity?.kind === "choice" ? (activity as ChoiceActivity).stimulus : undefined;
  const dragonSrc = answered
    ? "/universe/dragon/dragon_thumbs_up.png"
    : "/universe/dragon/dragon_point.png";

  const recommendedNext = statuses?.find((s) => s.recommended && s.badge.slug !== badgeSlug);
  const nextRecLesson = recommendedNext ? nextLesson(recommendedNext) : undefined;
  const completionRank = result
    ? worldRank(subject, result.worldBadgesEarned, result.worldBadgesTotal)
    : null;
  const previousRank = result?.badgeEarned
    ? worldRank(subject, Math.max(0, result.worldBadgesEarned - 1), result.worldBadgesTotal)
    : completionRank;
  const rankedUp = !!completionRank && !!previousRank && completionRank.tier > previousRank.tier;

  return (
    <div className="min-h-screen flex-1" style={{ background: subject.bg }}>
      <div className="max-w-[860px] mx-auto px-6 pt-4 pb-10">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <Link href={`/world/${subjectId}`} aria-label="Back to world" className="flex items-center">
            <img
              src="/universe/ui/back_button_small.png"
              alt=""
              className="w-[50px] h-[54px] object-contain"
            />
          </Link>
          <div className="flex-1 mx-2">
            <div
              className="font-baloo font-extrabold text-[15px] leading-none mb-1.5"
              style={{ color: "#3b2a63" }}
            >
              {badge.name} · {lesson.title}
            </div>
            <div className="flex items-center gap-2">
              {slots.map((_, i) => (
                <span
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    height: 10,
                    width: i === idx ? 26 : 10,
                    background: i <= idx ? subject.accent : "#DBD1EC",
                    opacity: i <= idx ? 1 : 0.8,
                  }}
                />
              ))}
              <span
                className="rounded-full"
                style={{
                  height: 10,
                  width: 10,
                  background: finished ? subject.accent : "#DBD1EC",
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarPill />
            <BadgePill subjectId={subjectId} accent={subject.accent} />
          </div>
        </div>

        {finished ? (
          /* completion celebration */
          <div className="text-center lu-rise mt-8">
            <img
              src="/universe/dragon/dragon_confetti.png"
              alt=""
              className="w-[188px] h-[200px] object-contain mx-auto lu-bob"
            />
            <div className="font-baloo font-extrabold text-[34px] mt-1" style={{ color: "#3b2a63" }}>
              {result?.badgeEarned ? "Badge earned!" : "Lesson complete!"}
            </div>
            <div
              className="inline-flex items-center gap-3 bg-white rounded-[22px] px-6 py-4 mt-3"
              style={{ boxShadow: "0 10px 26px rgba(60,40,90,.14)" }}
            >
              <img
                src="/universe/rewards/shield_gold.png"
                alt=""
                className="w-[64px] h-[74px] object-contain lu-shimmer"
              />
              <div className="text-left">
                <div className="font-baloo font-extrabold text-[20px]" style={{ color: "#3b2a63" }}>
                  {badge.name}
                </div>
                <div className="font-bold text-[13.5px]" style={{ color: "#8a7ab0" }}>
                  {badge.skills.join(" · ")}
                </div>
              </div>
            </div>
            {rankedUp && completionRank && (
              <div
                className="inline-flex items-center gap-3.5 rounded-[22px] px-6 py-4 mt-4 sm:ml-3 lu-rise"
                style={{
                  background: `linear-gradient(135deg,${subject.accent} 0%,#3b2a63 100%)`,
                  boxShadow: "0 14px 32px rgba(30,10,70,.35)",
                }}
              >
                <img
                  src={`/universe/rewards/${rankArt(completionRank.tier)}.png`}
                  alt=""
                  className="w-[58px] h-[66px] object-contain lu-shimmer"
                />
                <div className="text-left">
                  <div className="font-baloo font-extrabold text-[12px] tracking-[.18em] text-white/75">
                    ↑ RANK UP!
                  </div>
                  <div className="font-baloo font-extrabold text-[24px] leading-tight text-white">
                    {completionRank.name}
                  </div>
                  <div className="font-bold text-[12px] text-white/75">
                    Rank {completionRank.tier} of {completionRank.total} in {subject.name}
                  </div>
                </div>
              </div>
            )}
            {!rankedUp && result?.badgeEarned && completionRank?.next && (
              <div className="font-bold text-[13.5px] mt-3" style={{ color: "#8a7ab0" }}>
                {completionRank.toNext} more badge{completionRank.toNext === 1 ? "" : "s"} to become{" "}
                <b style={{ color: subject.accent }}>{completionRank.next}</b>!
              </div>
            )}
            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              {nextLessonInBadge ? (
                <button
                  type="button"
                  disabled={!result}
                  onClick={continueBadge}
                  className="font-baloo font-extrabold text-white text-[17px] rounded-[18px] px-7 py-3.5 disabled:opacity-60"
                  style={{ background: subject.accent, boxShadow: "0 6px 0 rgba(0,0,0,.2)" }}
                >
                  Next lesson →
                </button>
              ) : recommendedNext && nextRecLesson ? (
                <Link
                  href={`/lesson/${subjectId}/${recommendedNext.badge.slug}`}
                  className="font-baloo font-extrabold text-white text-[17px] rounded-[18px] px-7 py-3.5"
                  style={{ background: subject.accent, boxShadow: "0 6px 0 rgba(0,0,0,.2)" }}
                >
                  Next lesson →
                </Link>
              ) : null}
              <Link
                href={`/world/${subjectId}`}
                className="font-baloo font-extrabold text-[17px] rounded-[18px] px-7 py-3.5"
                style={{
                  background: "#fff",
                  color: subject.accent,
                  border: `2px solid ${subject.accent}44`,
                  boxShadow: "0 5px 14px rgba(60,40,90,.1)",
                }}
              >
                Back to {subject.name}
              </Link>
              <Link
                href="/rewards"
                className="font-baloo font-extrabold text-[17px] rounded-[18px] px-7 py-3.5"
                style={{
                  background: "#fff",
                  color: "#6C3AD6",
                  border: "2px solid rgba(108,58,214,.28)",
                  boxShadow: "0 5px 14px rgba(60,40,90,.1)",
                }}
              >
                See my rewards
              </Link>
            </div>
            {result?.subjectComplete && (
              <div
                className="font-baloo font-extrabold text-[16px] mt-5"
                style={{ color: subject.accent }}
              >
                🎉 You&apos;ve earned every badge in {subject.name}!
              </div>
            )}
          </div>
        ) : (
          <>
            {/* dragon + prompt */}
            <div className="flex items-end gap-3 mt-5">
              <img
                src={dragonSrc}
                alt={profile?.mascot ?? "Aki"}
                className="w-[92px] h-[100px] object-contain flex-none lu-bob"
                style={{ transform: "scaleX(-1)" }}
              />
              <div
                className="relative bg-white rounded-[22px] rounded-bl-[6px] px-5 py-4 flex-1"
                style={{ boxShadow: "0 10px 24px rgba(60,40,90,.14)", border: "2px solid rgba(0,0,0,.04)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="font-baloo font-extrabold text-[21px] leading-tight flex-1"
                    style={{ color: "#3b2a63" }}
                  >
                    {activity ? promptFor(activity) : ""}
                  </div>
                  {speechEnabled && activity && (
                    <button
                      type="button"
                      aria-label="Read the prompt aloud"
                      className="flex-none transition-transform active:scale-90"
                      onClick={() => speech.speak(promptFor(activity))}
                    >
                      <img
                        src="/universe/ui/sound_button.png"
                        alt=""
                        className="w-[38px] h-[38px] object-contain"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {slot && slot.length > 1 && (
              <div className="flex items-center justify-end gap-1.5 mt-3">
                <span
                  className="font-baloo font-extrabold text-[13px] mr-1"
                  style={{ color: "#8a7ab0" }}
                >
                  Try another way
                </span>
                {slot.map((_, i) => {
                  const done = answeredSet.has(`${lesson.id}:${idx}:${i}`);
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Variation ${letter}${done ? " — already answered" : ""}`}
                      aria-pressed={i === variantIdx}
                      onClick={() => switchVariant(i)}
                      className="relative font-baloo font-extrabold text-[14px] w-[34px] h-[34px] rounded-full transition-transform active:scale-90"
                      style={
                        i === variantIdx
                          ? {
                              background: subject.accent,
                              color: "#fff",
                              boxShadow: "0 3px 0 rgba(0,0,0,.18)",
                            }
                          : {
                              background: "#fff",
                              color: subject.accent,
                              border: `2px solid ${subject.accent}44`,
                              boxShadow: "0 3px 10px rgba(60,40,90,.1)",
                            }
                      }
                    >
                      {letter}
                      {done && (
                        <img
                          src="/universe/rewards/star_gold.png"
                          alt=""
                          className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] object-contain"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {stimulus && (
              <MathStimulus
                key={`${idx}:${variantIdx}`}
                stimulus={stimulus}
                chip={subject.chip}
                accent={subject.accent}
              />
            )}

            <div className="mt-5">
              {Stage && activity && (
                <Stage
                  key={`${idx}:${variantIdx}`}
                  activity={activity as never}
                  accent={subject.accent}
                  chip={subject.chip}
                  answered={!!answered}
                  onCorrect={handleCorrect}
                  onWrong={handleWrong}
                  onAdvance={advance}
                  speechEnabled={speechEnabled}
                />
              )}
            </div>
          </>
        )}
      </div>

      <FeedbackBar feedback={feedback} accent={subject.accent} onNext={advance} />
      {result?.badgeEarned && (
        <BadgeAwardCelebration
          subjectId={subjectId}
          subjectName={subject.name}
          badgeName={badge.name}
          badgeImage={subject.art.badge}
          accent={subject.accent}
        />
      )}
    </div>
  );
}
