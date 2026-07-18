import type { Subject } from "./types";

export const UNIVERSE_RANKS = [
  "Explorer",
  "Adventurer",
  "Star Voyager",
  "Universe Hero",
  "Universe Legend",
] as const;

export interface RankInfo {
  name: string;
  tier: number;
  total: number;
  next: string | null;
  toNext: number;
  thresholds: number[];
  names: readonly string[];
}

/** Five useful milestones that scale to worlds with different badge counts. */
export function rankThresholds(totalBadges: number): number[] {
  if (totalBadges <= 0) return [0, 0, 0, 0, 0];
  const tierTwo = Math.max(2, Math.round(totalBadges * 0.4));
  const tierThree = Math.min(
    totalBadges - 1,
    Math.max(tierTwo + 1, Math.round(totalBadges * 0.75)),
  );
  return [0, 1, tierTwo, tierThree, totalBadges];
}

export function rankInfo(
  names: readonly string[],
  badgesEarned: number,
  totalBadges: number,
): RankInfo {
  const thresholds = rankThresholds(totalBadges);
  let index = 0;
  if (totalBadges > 0) {
    thresholds.forEach((threshold, candidate) => {
      if (badgesEarned >= threshold) index = candidate;
    });
  }
  index = Math.min(index, Math.max(0, names.length - 1));
  const hasNext = index < names.length - 1;

  return {
    name: names[index] ?? "Explorer",
    tier: index + 1,
    total: names.length,
    next: hasNext ? names[index + 1] : null,
    toNext: hasNext ? Math.max(0, thresholds[index + 1] - badgesEarned) : 0,
    thresholds,
    names,
  };
}

export function worldRank(
  subject: Pick<Subject, "ranks">,
  badgesEarned: number,
  totalBadges: number,
): RankInfo {
  return rankInfo(subject.ranks, badgesEarned, totalBadges);
}

export function universeRank(badgesEarned: number, totalBadges: number): RankInfo {
  return rankInfo(UNIVERSE_RANKS, badgesEarned, totalBadges);
}

const RANK_ART = [
  "medal_bronze",
  "medal_silver",
  "medal_gold",
  "shield_crystal",
  "shield_winged_crystal",
] as const;

export function rankArt(tier: number): (typeof RANK_ART)[number] {
  return RANK_ART[Math.max(0, Math.min(RANK_ART.length - 1, tier - 1))];
}
