"use client";

import Link from "next/link";
import CssCloud from "@/components/CssCloud";
import FaIcon from "@/components/FaIcon";
import StarPill from "@/components/StarPill";
import TwinkleField from "@/components/TwinkleField";
import WorldProgressBar from "@/components/WorldProgressBar";
import { useProfile, useUniverseOverview } from "@/lib/hooks";
import { universeRank } from "@/lib/ranks";

/** Per-world card geometry: width, illustration height, top offset (visual scatter). */
const GEO: Record<string, [number, number, number]> = {
  english: [250, 218, 56],
  maths: [205, 238, 2],
  science: [205, 244, 14],
  shona: [222, 222, 66],
  mandarin: [205, 240, 30],
};
const GEO_FALLBACK: [number, number, number] = [210, 232, 24];

const NAV = [
  { icon: "house", label: "Home", href: "/" },
  { icon: "globe", label: "Worlds", href: "/" },
  { icon: "trophy", label: "Badges", href: "/rewards" },
  { icon: "user", label: "Profile", href: "/parent" },
];

export default function UniversePage() {
  const profile = useProfile();
  const overview = useUniverseOverview();

  // Recommend the first world (by order) that still has badges to earn.
  const recommendedId =
    overview?.subjects.find((s) => s.earned < s.total)?.subject.id ??
    overview?.subjects[0]?.subject.id;
  const rank = universeRank(overview?.totalEarned ?? 0, overview?.totalBadges ?? 0);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex-1"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 6%,#8a6ce0 0%,#6a4dc0 38%,#4c39a0 68%,#3f2f8e 100%)",
      }}
    >
      <TwinkleField />
      <CssCloud
        variant="puffy"
        style={{ left: -50, bottom: -34, width: 380, opacity: 0.92, zIndex: 1 }}
      />
      <CssCloud
        variant="wide"
        style={{ right: -40, bottom: -38, width: 440, opacity: 0.92, zIndex: 1 }}
      />
      <CssCloud
        variant="small"
        style={{ left: "44%", bottom: -26, width: 240, opacity: 0.85, zIndex: 1 }}
      />

      {/* top bar */}
      <div className="relative z-10 flex items-start justify-between gap-4 px-7 pt-5 pb-1.5 flex-wrap">
        <div className="flex shrink-0 items-center gap-2">
          <img
            src="/universe/dragon/dragon_wave.png"
            alt={`${profile?.mascot ?? "Aki"} the dragon`}
            className="w-[92px] h-[92px] object-contain lu-bob"
            style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,.25))" }}
          />
          <div
            className="relative bg-white rounded-[20px] px-4 py-3 max-w-[236px]"
            style={{ boxShadow: "0 8px 18px rgba(30,10,70,.28)" }}
          >
            <div
              className="font-baloo font-extrabold text-[13px] tracking-wide"
              style={{ color: "#2C9AA6" }}
            >
              {profile?.mascot ?? "Aki"}
            </div>
            <div className="font-bold text-[13.5px] leading-tight" style={{ color: "#6b5e8c" }}>
              Where shall we explore today{profile?.child ? `, ${profile.child}` : ""}?
            </div>
          </div>
        </div>
        <img
          src="/universe/ui/logo_learning_universe.png"
          alt="Learning Universe"
          className="w-[250px] object-contain mt-1 h-[100px]"
          style={{ filter: "drop-shadow(0 6px 12px rgba(20,0,60,.3))" }}
        />
        <div className="flex shrink-0 items-center gap-2.5">
          <StarPill dark />
          <Link href="/rewards" aria-label="Rewards" className="lu-icon-button text-[#FFD43B]">
            <FaIcon name="gift" className="lu-control-icon text-[24px]" />
          </Link>
          <Link href="/parent" aria-label="Grown-up settings" className="lu-icon-button text-white">
            <FaIcon name="gear" className="lu-control-icon text-[24px]" />
          </Link>
          <Link
            href="/parent"
            className="flex shrink-0 items-center gap-2.5 rounded-full pl-1.5 pr-4 py-1"
            style={{
              background: "rgba(255,255,255,.16)",
              border: "2px solid rgba(255,255,255,.32)",
            }}
          >
            <FaIcon name="circle-user" className="lu-control-icon w-[38px] h-[38px] text-[38px] text-[#d8d0ff]" />
            <span className="text-left">
              <span className="block font-baloo font-extrabold text-white text-[15px]">
                {profile?.child ?? ""}
              </span>
              <span className="block font-bold text-[11.5px]" style={{ color: "#e3d7ff" }}>
                Level {profile?.level ?? 1} · {rank.name}
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* worlds */}
      <div className="relative z-[2] mx-auto flex max-w-[1240px] flex-wrap items-end justify-center gap-x-3 gap-y-1 px-6 pb-8 pt-1">
        {overview?.subjects.map(({ subject, earned, total, continueBadge }, i) => {
          const [w, artHeight, mt] = GEO[subject.id] ?? GEO_FALLBACK;
          const progressLabel = `${subject.name}: ${earned} of ${total} badges earned`;
          const complete = total > 0 && earned === total;
          const nextLabel = complete
            ? "World complete!"
            : `${earned > 0 ? "Next" : "Start"}: ${continueBadge?.badge.name ?? "Explore"}`;

          return (
            <Link
              key={subject.id}
              href={`/world/${subject.id}`}
              className="relative block rounded-[26px] bg-transparent lu-float focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80"
              style={{
                width: w,
                height: artHeight + 78,
                marginTop: mt,
                animationDuration: `${5 + i * 0.7}s`,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              {subject.id === recommendedId && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 -top-1 z-[4] whitespace-nowrap font-baloo font-extrabold text-[11.5px] rounded-full px-3 py-[3px]"
                  style={{
                    color: "#B4770B",
                    background: "#FFF3CE",
                    border: "2px solid #F5D269",
                    boxShadow: "0 4px 10px rgba(0,0,0,.2)",
                  }}
                >
                  ★ Pick up here
                </span>
              )}
              <img
                src={subject.art.card}
                alt=""
                className="absolute left-0 top-0 z-[1] w-full object-contain object-bottom"
                style={{
                  height: artHeight,
                  filter: "drop-shadow(0 14px 18px rgba(20,0,50,.34))",
                }}
              />

              <div
                className="absolute inset-x-1 bottom-8 z-[3] rounded-[22px] border-[3px] px-3.5 pb-3 pt-2.5 text-center"
                style={{
                  background: `linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,0) 55%), ${subject.chip}`,
                  borderColor: `${subject.accent}55`,
                  boxShadow: "0 10px 18px rgba(20,0,50,.28)",
                }}
              >
                <h2
                  className="font-baloo text-[19px] font-extrabold leading-none"
                  style={{ color: subject.accent }}
                >
                  {subject.name}
                </h2>
                {earned > 0 ? (
                  <div className="mt-2 flex items-center gap-2">
                    <WorldProgressBar
                      value={earned}
                      max={total}
                      accent={subject.accent}
                      chip={subject.chip}
                      ariaLabel={progressLabel}
                      className="min-w-0 flex-1"
                    />
                    <span
                      className="font-baloo text-[13px] font-extrabold leading-none"
                      style={{ color: subject.accent }}
                    >
                      {earned}/{total}
                    </span>
                  </div>
                ) : (
                  <div
                    role="img"
                    aria-label={progressLabel}
                    className="mt-2 flex items-center justify-center gap-1"
                  >
                    {Array.from({ length: total }, (_, socket) => (
                      <FaIcon
                        key={socket}
                        name="star"
                        className="text-[13px]"
                        style={{ color: `${subject.accent}40` }}
                      />
                    ))}
                  </div>
                )}
                {(subject.id === recommendedId || complete) && (
                  <p
                    className="mt-1.5 truncate text-[12px] font-bold leading-none"
                    style={{ color: "#7C6DA0" }}
                  >
                    {nextLabel}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* bottom nav */}
      <div className="lu-nav-bar relative z-10 flex items-end justify-center px-6 pb-5">
        {NAV.map((n, i) => (
          <Link
            key={n.label}
            href={n.href}
            aria-current={i === 0 ? "page" : undefined}
            className={`lu-nav-item${i === 0 ? " is-active" : ""}`}
          >
            <FaIcon name={n.icon} />
            <span className="lu-nav-label">{n.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
