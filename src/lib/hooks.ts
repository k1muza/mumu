"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, PROFILE_ID } from "./db";
import { badgeStatuses } from "./progress";
import type { BadgeStatus, Profile, Subject } from "./types";

export function useProfile(): Profile | undefined {
  return useLiveQuery(() => db.profiles.get(PROFILE_ID), []);
}

export function useSubjects(): Subject[] | undefined {
  return useLiveQuery(() => db.subjects.orderBy("order").toArray(), []);
}

export function useSubject(subjectId: string): Subject | undefined {
  return useLiveQuery(() => db.subjects.get(subjectId), [subjectId]);
}

/** Live per-badge statuses for one subject (recommended flag included). */
export function useBadgeStatuses(subjectId: string): BadgeStatus[] | undefined {
  return useLiveQuery(async () => {
    const [badges, lessons, progress] = await Promise.all([
      db.badges.where("subjectId").equals(subjectId).toArray(),
      db.lessons.where("subjectId").equals(subjectId).toArray(),
      db.progress.where("subjectId").equals(subjectId).toArray(),
    ]);
    return badgeStatuses(badges, lessons, progress);
  }, [subjectId]);
}

export interface UniverseOverview {
  subjects: {
    subject: Subject;
    earned: number;
    total: number;
    statuses: BadgeStatus[];
    continueBadge: BadgeStatus | undefined;
  }[];
  totalEarned: number;
  totalBadges: number;
}

/** Everything the home / rewards / parent screens need, in one live query. */
export function useUniverseOverview(): UniverseOverview | undefined {
  return useLiveQuery(async () => {
    const [subjects, badges, lessons, progress] = await Promise.all([
      db.subjects.orderBy("order").toArray(),
      db.badges.toArray(),
      db.lessons.toArray(),
      db.progress.toArray(),
    ]);
    const perSubject = subjects.map((subject) => {
      const statuses = badgeStatuses(
        badges.filter((b) => b.subjectId === subject.id),
        lessons.filter((l) => l.subjectId === subject.id),
        progress.filter((p) => p.subjectId === subject.id),
      );
      const earned = statuses.filter((s) => s.state === "earned").length;
      return {
        subject,
        earned,
        total: statuses.length,
        statuses,
        continueBadge: statuses.find((s) => s.recommended),
      };
    });
    return {
      subjects: perSubject,
      totalEarned: perSubject.reduce((n, s) => n + s.earned, 0),
      totalBadges: perSubject.reduce((n, s) => n + s.total, 0),
    };
  }, []);
}
