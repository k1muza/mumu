import { db, PROFILE_ID } from "./db";
import type { Badge, BadgeStatus, Lesson, LessonProgress, Settings } from "./types";

export const STARS_CORRECT_ANSWER = 1;
export const STARS_PER_LEVEL = 25;

export const levelForStars = (stars: number) => 1 + Math.floor(stars / STARS_PER_LEVEL);

export function levelProgress(stars: number) {
  const level = levelForStars(stars);
  const earnedInLevel = stars % STARS_PER_LEVEL;
  return {
    level,
    earnedInLevel,
    neededForNext: STARS_PER_LEVEL - earnedInLevel,
    percent: (earnedInLevel / STARS_PER_LEVEL) * 100,
  };
}

/** Award one star the first time a specific question variation is solved. */
export interface AnswerAwardResult {
  awarded: boolean;
  previousLevel: number;
  level: number;
}

export async function awardCorrectAnswer(variationKey: string): Promise<AnswerAwardResult> {
  return db.transaction("rw", [db.variantCredit, db.profiles], async () => {
    const profile = await db.profiles.get(PROFILE_ID);
    const previousLevel = profile?.level ?? 1;
    if (await db.variantCredit.get(variationKey)) {
      return { awarded: false, previousLevel, level: previousLevel };
    }

    await db.variantCredit.add({ key: variationKey });
    let level = previousLevel;
    await db.profiles
      .where("id")
      .equals(PROFILE_ID)
      .modify((profile) => {
        profile.stars += STARS_CORRECT_ANSWER;
        profile.level = levelForStars(profile.stars);
        level = profile.level;
      });
    return { awarded: true, previousLevel, level };
  });
}

/**
 * Compute per-badge status for a subject from raw rows. Recommended = the
 * first badge (by order) that is not yet earned.
 */
export function badgeStatuses(
  badges: Badge[],
  lessons: Lesson[],
  progress: LessonProgress[],
): BadgeStatus[] {
  const doneIds = new Set(progress.map((p) => p.lessonId));
  const ordered = [...badges].sort((a, b) => a.order - b.order);
  const statuses: BadgeStatus[] = ordered.map((badge) => {
    const badgeLessons = lessons
      .filter((l) => l.badgeId === badge.id)
      .sort((a, b) => a.order - b.order);
    const completed = badgeLessons.filter((l) => doneIds.has(l.id)).map((l) => l.id);
    const state =
      badgeLessons.length > 0 && completed.length === badgeLessons.length
        ? "earned"
        : completed.length > 0
          ? "in-progress"
          : "not-started";
    return { badge, lessons: badgeLessons, completedLessonIds: completed, state, recommended: false };
  });
  const rec = statuses.find((s) => s.state !== "earned") ?? statuses[0];
  if (rec) rec.recommended = true;
  return statuses;
}

/** The lesson to play for a badge: first incomplete, or first for practice. */
export function nextLesson(status: BadgeStatus): Lesson | undefined {
  return (
    status.lessons.find((l) => !status.completedLessonIds.includes(l.id)) ?? status.lessons[0]
  );
}

export interface CompletionResult {
  firstCompletion: boolean;
  badgeEarned: boolean;
  subjectComplete: boolean;
  worldBadgesEarned: number;
  worldBadgesTotal: number;
}

/**
 * Record a finished lesson and report whether it earned the badge / finished the world.
 * Stars are awarded per question in `awardCorrectAnswer`, not at completion.
 */
export async function completeLesson(lesson: Lesson): Promise<CompletionResult> {
  return db.transaction("rw", [db.progress, db.profiles, db.lessons], async () => {
    const prev = await db.progress.get(lesson.id);
    const firstCompletion = !prev;
    await db.progress.put({
      lessonId: lesson.id,
      badgeId: lesson.badgeId,
      subjectId: lesson.subjectId,
      timesCompleted: (prev?.timesCompleted ?? 0) + 1,
      completedAt: Date.now(),
    });

    const badgeLessons = await db.lessons.where("badgeId").equals(lesson.badgeId).toArray();
    const badgeDone = await db.progress.where("badgeId").equals(lesson.badgeId).toArray();
    const doneIds = new Set(badgeDone.map((p) => p.lessonId));
    const badgeEarned = firstCompletion && badgeLessons.every((l) => doneIds.has(l.id));

    const subjectLessons = await db.lessons.where("subjectId").equals(lesson.subjectId).toArray();
    const subjectDone = await db.progress.where("subjectId").equals(lesson.subjectId).toArray();
    const subjectDoneIds = new Set(subjectDone.map((p) => p.lessonId));
    const subjectComplete = subjectLessons.every((l) => subjectDoneIds.has(l.id));
    const badgeIds = [...new Set(subjectLessons.map((subjectLesson) => subjectLesson.badgeId))];
    const worldBadgesEarned = badgeIds.filter((badgeId) =>
      subjectLessons
        .filter((subjectLesson) => subjectLesson.badgeId === badgeId)
        .every((subjectLesson) => subjectDoneIds.has(subjectLesson.id)),
    ).length;

    await db.profiles
      .where("id")
      .equals(PROFILE_ID)
      .modify((p) => {
        if (badgeEarned) p.gems += 1;
      });

    return {
      firstCompletion,
      badgeEarned,
      subjectComplete,
      worldBadgesEarned,
      worldBadgesTotal: badgeIds.length,
    };
  });
}

/** Finish first-run onboarding with the child's name. */
export async function completeOnboarding(name: string): Promise<void> {
  await db.profiles
    .where("id")
    .equals(PROFILE_ID)
    .modify((p) => {
      p.child = name.trim();
      p.onboarded = true;
    });
}

export async function updateChildName(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;
  await db.profiles
    .where("id")
    .equals(PROFILE_ID)
    .modify((p) => {
      p.child = trimmed;
    });
}

export async function updateSettings(patch: Partial<Settings>): Promise<void> {
  await db.profiles
    .where("id")
    .equals(PROFILE_ID)
    .modify((p) => {
      p.settings = { ...p.settings, ...patch };
    });
}

/**
 * Factory reset: delete the entire database — profile (name, settings),
 * progress, and content. Reloads the app, which recreates and re-seeds the
 * database and shows onboarding again.
 */
export async function resetEverything(): Promise<void> {
  await db.delete();
  window.location.assign("/");
}

/** Clear all learner progress and reset profile counters (content is kept). */
export async function resetProgress(): Promise<void> {
  await db.transaction(
    "rw",
    [db.progress, db.profiles, db.variantCredit],
    async () => {
      await Promise.all([db.progress.clear(), db.variantCredit.clear()]);
      await db.profiles
        .where("id")
        .equals(PROFILE_ID)
        .modify((p) => {
          p.stars = 0;
          p.gems = 0;
          p.leaves = 0;
          p.level = 1;
        });
    },
  );
}
