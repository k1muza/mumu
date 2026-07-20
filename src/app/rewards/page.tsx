"use client";

import Link from "next/link";
import TwinkleField from "@/components/TwinkleField";
import { useProfile, useUniverseOverview } from "@/lib/hooks";
import { levelProgress } from "@/lib/progress";
import { rankArt, universeRank, worldRank } from "@/lib/ranks";

const COUNTERS = [
  { img: "star_gold", color: "#F59E0B", label: "Stars", key: "stars" },
  { img: "gem_purple", color: "#7A3FD0", label: "Gems", key: "gems" },
  { img: "gem_green", color: "#3E9A34", label: "Leaves", key: "leaves" },
  { img: "level_badge", color: "#6C3AD6", label: "Level", key: "level" },
] as const;

export default function RewardsPage() {
  const profile = useProfile();
  const overview = useUniverseOverview();
  const level = levelProgress(profile?.stars ?? 0);
  const overallRank = universeRank(
    overview?.totalEarned ?? 0,
    overview?.totalBadges ?? 0,
  );

  const worldsStarted =
    overview?.subjects.filter((s) => s.statuses.some((b) => b.state !== "not-started")).length ?? 0;
  const worldsMastered =
    overview?.subjects.filter((s) => s.total > 0 && s.earned >= s.total).length ?? 0;

  const achievements = [
    {
      img: "treasure_chest",
      name: "First Badge",
      unlocked: (overview?.totalEarned ?? 0) >= 1,
      hint: "Earn your first badge",
    },
    {
      img: "crystal_cluster",
      name: "Explorer",
      unlocked: worldsStarted >= 3,
      hint: "Play in 3 worlds",
    },
    {
      img: "star_radiant",
      name: "Star Collector",
      unlocked: (profile?.stars ?? 0) >= 30,
      hint: "Collect 30 stars",
    },
    {
      img: "shield_winged_crystal",
      name: "World Master",
      unlocked: worldsMastered >= 1,
      hint: "Finish a whole world",
    },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden flex-1"
      style={{
        background: "radial-gradient(120% 90% at 50% 0%,#7b5ce0 0%,#5f45bd 42%,#463398 100%)",
      }}
    >
      <TwinkleField />

      <div className="relative z-10 max-w-[1060px] mx-auto px-4 pt-5 pb-14 sm:px-7">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="Back" className="flex items-center gap-2">
            <img
              src="/universe/ui/back_button_small.webp"
              alt=""
              className="w-[50px] h-[54px] object-contain"
            />
            <span className="font-baloo font-extrabold text-[15px] text-white">Universe</span>
          </Link>
          <img
            src="/universe/dragon/dragon_holding_star.webp"
            alt={profile?.mascot ?? "Aki"}
            className="w-[80px] h-[86px] object-contain lu-bob"
            style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,.3))" }}
          />
          <Link href="/parent" aria-label="Profile">
            <img
              src="/universe/ui/profile_avatar.webp"
              alt=""
              className="w-[46px] h-[46px] object-contain"
            />
          </Link>
        </div>

        <div className="text-center mt-1">
          <h1
            className="font-baloo font-extrabold text-white text-[30px] leading-none sm:text-[36px]"
            style={{ textShadow: "0 4px 10px rgba(0,0,0,.25)" }}
          >
            My Treasure
          </h1>
          <p className="font-bold text-[15px] mt-1" style={{ color: "#e0d5ff" }}>
            Look at everything you&apos;ve collected{profile?.child ? `, ${profile.child}` : ""}!
          </p>
          <div
            className="inline-flex items-center gap-3 rounded-full px-4 py-1.5 mt-3 text-left"
            style={{
              background: "rgba(255,255,255,.16)",
              border: "2px solid rgba(255,255,255,.32)",
            }}
          >
            <img
              src={`/universe/rewards/${rankArt(overallRank.tier)}.webp`}
              alt=""
              className="w-[28px] h-[32px] object-contain"
            />
            <span>
              <span className="block font-baloo font-extrabold text-[15px] text-white leading-none">
                {overallRank.name}
              </span>
              <span className="block font-bold text-[11.5px] mt-0.5" style={{ color: "#d8cdf7" }}>
                Universe rank {overallRank.tier} of {overallRank.total}
                {overallRank.next
                  ? ` · ${overallRank.toNext} badge${overallRank.toNext === 1 ? "" : "s"} to ${overallRank.next}`
                  : " · highest rank"}
              </span>
            </span>
          </div>
        </div>

        {/* counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
          {COUNTERS.map((c) => (
            <div
              key={c.key}
              className="bg-white/95 rounded-[22px] px-4 py-4 flex items-center gap-3"
              style={{ boxShadow: "0 10px 24px rgba(20,0,60,.25)" }}
            >
              <img
                src={`/universe/rewards/${c.img}.webp`}
                alt=""
                className="w-[46px] h-[46px] object-contain"
              />
              <div className="flex-1 min-w-0">
                <div
                  className="font-baloo font-extrabold text-[26px] leading-none"
                  style={{ color: c.color }}
                >
                  {profile?.[c.key] ?? 0}
                </div>
                <div className="font-bold text-[12.5px]" style={{ color: "#8a7ab0" }}>
                  {c.label}
                </div>
                {c.key === "level" && (
                  <div className="mt-1.5 w-full min-w-[70px]">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E8E0F4" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${level.percent}%`, background: c.color }}
                      />
                    </div>
                    <div className="font-bold text-[9.5px] mt-0.5" style={{ color: "#9B8CB8" }}>
                      {level.neededForNext} stars to level {level.level + 1}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* subject medals */}
        <div className="flex items-center justify-between mt-8 mb-3">
          <h2 className="font-baloo font-extrabold text-white text-[22px]">World Badges</h2>
          <span
            className="font-baloo font-extrabold text-[14px] rounded-full px-4 py-1.5"
            style={{
              background: "rgba(255,255,255,.16)",
              color: "#fff",
              border: "2px solid rgba(255,255,255,.3)",
            }}
          >
            {overview?.totalEarned ?? 0} / {overview?.totalBadges ?? 0} earned
          </span>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
          {overview?.subjects.map(({ subject, earned, total, statuses }) => {
            const rank = worldRank(subject, earned, total);
            return (
              <Link
                key={subject.id}
                href={`/world/${subject.id}`}
                className="bg-white rounded-[24px] px-5 py-5 flex items-center gap-4"
                style={{
                  boxShadow: "0 10px 24px rgba(20,0,60,.22)",
                  borderTop: `5px solid ${subject.accent}`,
                }}
              >
                <img
                  src={`/universe/rewards/${rankArt(rank.tier)}.webp`}
                  alt=""
                  className={`w-[62px] h-[70px] object-contain flex-none ${earned >= total && total > 0 ? "lu-shimmer" : ""}`}
                  style={earned === 0 ? { filter: "grayscale(.5) opacity(.7)" } : undefined}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-baloo font-extrabold text-[18px] leading-tight"
                    style={{ color: "#3b2a63" }}
                  >
                    {subject.name}
                  </div>
                  <div className="font-bold text-[13px] mb-2" style={{ color: subject.accent }}>
                    {rank.name} · Rank {rank.tier}/{rank.total}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {statuses.map((b) => (
                      <span
                        key={b.badge.id}
                        title={b.badge.name}
                        className="rounded-full"
                        style={{
                          width: 13,
                          height: 13,
                          background: b.state === "earned" ? subject.accent : "#E4DCF0",
                          boxShadow:
                            b.state === "earned" ? `0 0 0 2px ${subject.accent}33` : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* world rank ladders */}
        <h2 className="font-baloo font-extrabold text-white text-[22px] mt-9 mb-3">
          World Ranks
        </h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
          {overview?.subjects.map(({ subject, earned, total }) => {
            const rank = worldRank(subject, earned, total);
            return (
              <div
                key={subject.id}
                className="bg-white rounded-[24px] px-5 py-4"
                style={{
                  boxShadow: "0 10px 24px rgba(20,0,60,.22)",
                  borderTop: `5px solid ${subject.accent}`,
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="font-baloo font-extrabold text-[17px]" style={{ color: "#3b2a63" }}>
                    {subject.name}
                  </div>
                  <img
                    src={`/universe/rewards/${rankArt(rank.tier)}.webp`}
                    alt=""
                    className="w-[32px] h-[36px] object-contain"
                  />
                </div>
                {rank.names.map((name, index) => {
                  const reached = index < rank.tier;
                  const current = index === rank.tier - 1;
                  const needed = rank.thresholds[index];
                  return (
                    <div
                      key={name}
                      className={`flex items-center gap-2.5 py-[5px] rounded-[12px] ${current ? "px-2 -mx-2" : ""}`}
                      style={current ? { background: subject.chip } : undefined}
                    >
                      <span
                        className="rounded-full flex-none inline-flex items-center justify-center text-[12px] font-black text-white"
                        style={{ width: 20, height: 20, background: reached ? subject.accent : "#E4DCF0" }}
                      >
                        {reached ? "✓" : ""}
                      </span>
                      <span
                        className="flex-1 font-baloo font-extrabold text-[14px]"
                        style={{ color: reached ? "#3b2a63" : "#a99ac8" }}
                      >
                        {name}
                        {current && (
                          <span className="text-[11px] ml-1" style={{ color: subject.accent }}>
                            ← you
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-[11.5px]" style={{ color: "#b3a5cf" }}>
                        {needed === 0 ? "start" : `${needed} badge${needed === 1 ? "" : "s"}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* achievements */}
        <h2 className="font-baloo font-extrabold text-white text-[22px] mt-9 mb-3">
          Special Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((a) => (
            <div
              key={a.name}
              className="bg-white rounded-[22px] px-4 py-5 text-center"
              style={{ boxShadow: "0 10px 24px rgba(20,0,60,.2)" }}
            >
              <img
                src={`/universe/rewards/${a.img}`}
                alt=""
                className={`w-[68px] h-[68px] object-contain mx-auto ${a.unlocked ? "lu-bob" : ""}`}
                style={a.unlocked ? undefined : { filter: "grayscale(1) opacity(.4)" }}
              />
              <div className="font-baloo font-extrabold text-[15px] mt-2" style={{ color: "#3b2a63" }}>
                {a.name}
              </div>
              <div
                className="font-bold text-[11.5px] mt-0.5"
                style={{ color: a.unlocked ? "#3c8f26" : "#a99ac8" }}
              >
                {a.unlocked ? "Unlocked!" : a.hint}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
