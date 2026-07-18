"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GrownUpGate from "@/components/GrownUpGate";
import { useProfile, useUniverseOverview } from "@/lib/hooks";
import { resetEverything, resetProgress, updateChildName, updateSettings } from "@/lib/progress";
import { universeRank, worldRank } from "@/lib/ranks";
import { speech } from "@/lib/tts";
import { DEFAULT_VOICE, VOICE_OPTIONS, type VoiceId } from "@/lib/tts/protocol";
import type { Settings } from "@/lib/types";

const TOGGLES: { key: keyof Settings; label: string; hint: string }[] = [
  {
    key: "speech",
    label: "Read words aloud (device voice)",
    hint: "Use your device speech to say words",
  },
  { key: "sfx", label: "Sound effects", hint: "Cheers and taps during lessons" },
  {
    key: "autoplay",
    label: "Auto-advance lessons",
    hint: "Move to the next question automatically",
  },
];

function NameRow({ current }: { current: string }) {
  const [draft, setDraft] = useState(current);
  const [saved, setSaved] = useState(false);
  const dirty = draft.trim() !== current && draft.trim() !== "";

  return (
    <div className="flex items-center justify-between gap-4 py-4 flex-wrap">
      <div>
        <div className="font-baloo font-extrabold text-[15px]" style={{ color: "#3b2a63" }}>
          Child&apos;s name
        </div>
        <div className="font-bold text-[12.5px]" style={{ color: "#8578a6" }}>
          Used in greetings across the app
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          maxLength={20}
          aria-label="Child's name"
          onChange={(e) => {
            setDraft(e.target.value);
            setSaved(false);
          }}
          className="font-baloo font-extrabold text-[16px] rounded-[14px] px-4 py-2.5 outline-none w-[180px]"
          style={{
            color: "#3b2a63",
            background: "#F4F1FA",
            border: "2px solid rgba(108,58,214,.2)",
          }}
        />
        <button
          type="button"
          disabled={!dirty}
          onClick={async () => {
            await updateChildName(draft);
            setSaved(true);
          }}
          className="font-baloo font-extrabold text-[13px] rounded-full px-4 py-2.5 text-white transition-opacity"
          style={{ background: "#6C3AD6", opacity: dirty ? 1 : 0.4 }}
        >
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}

function VoiceRow({ current }: { current: VoiceId }) {
  // Warm up Kokoro so previews use the real voice, not the device fallback.
  useEffect(() => {
    speech.preload();
  }, []);

  return (
    <div className="py-4">
      <div className="font-baloo font-extrabold text-[15px]" style={{ color: "#3b2a63" }}>
        Reading voice
      </div>
      <div className="font-bold text-[12.5px]" style={{ color: "#8578a6" }}>
        Tap a voice to hear it — used for words, questions and stories
      </div>
      <div className="flex flex-wrap gap-2 mt-3" role="radiogroup" aria-label="Reading voice">
        {VOICE_OPTIONS.map((v) => {
          const active = v.id === current;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                speech.setVoice(v.id);
                speech.speak(`Hi! I'm ${v.label}. Let's read together!`);
                void updateSettings({ voice: v.id });
              }}
              className="font-baloo font-extrabold text-[13px] rounded-[14px] px-4 py-2 text-left"
              style={{
                background: active ? "#6C3AD6" : "#F4F1FA",
                color: active ? "#fff" : "#3b2a63",
                border: `2px solid ${active ? "#6C3AD6" : "rgba(108,58,214,.2)"}`,
              }}
            >
              {v.label}
              <span
                className="block font-bold text-[11px]"
                style={{ color: active ? "rgba(255,255,255,.75)" : "#8578a6" }}
              >
                {v.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DangerRow({
  label,
  hint,
  buttonLabel,
  confirmLabel,
  onConfirm,
}: {
  label: string;
  hint: string;
  buttonLabel: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 py-4 flex-wrap">
      <div>
        <div className="font-baloo font-extrabold text-[15px]" style={{ color: "#3b2a63" }}>
          {label}
        </div>
        <div className="font-bold text-[12.5px]" style={{ color: "#8578a6" }}>
          {hint}
        </div>
      </div>
      {confirming ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onConfirm();
              setBusy(false);
              setConfirming(false);
            }}
            className="font-baloo font-extrabold text-[13px] rounded-full px-4 py-2.5 text-white"
            style={{ background: "#C33A32", opacity: busy ? 0.6 : 1 }}
          >
            {busy ? "Resetting…" : confirmLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirming(false)}
            className="font-baloo font-extrabold text-[13px] rounded-full px-4 py-2.5"
            style={{ background: "#F4F1FA", color: "#3b2a63" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="font-baloo font-extrabold text-[13px] rounded-full px-4 py-2.5"
          style={{ background: "#FDEBEA", color: "#C33A32", border: "2px solid #F3C9C6" }}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default function ParentPage() {
  const [unlocked, setUnlocked] = useState(false);
  const profile = useProfile();
  const overview = useUniverseOverview();

  const worlds =
    overview?.subjects.filter((s) => s.statuses.some((b) => b.state !== "not-started")).length ?? 0;
  const pct = overview?.totalBadges
    ? Math.round((overview.totalEarned / overview.totalBadges) * 100)
    : 0;
  const rank = universeRank(overview?.totalEarned ?? 0, overview?.totalBadges ?? 0);

  const stats = [
    { value: overview?.totalEarned ?? 0, label: "Badges earned", color: "#6C3AD6" },
    { value: profile?.stars ?? 0, label: "Stars collected", color: "#F59E0B" },
    { value: `${worlds} / ${overview?.subjects.length ?? 0}`, label: "Worlds explored", color: "#3E9A34" },
    { value: `${pct}%`, label: "Overall progress", color: "#C33A32" },
  ];

  return (
    <div className="min-h-screen flex-1" style={{ background: "#F4F1FA" }}>
      {!unlocked && <GrownUpGate onPass={() => setUnlocked(true)} />}

      <div
        className="max-w-[1040px] mx-auto px-7 pt-6 pb-16 transition-opacity duration-300"
        style={{ opacity: unlocked ? 1 : 0 }}
      >
        {/* header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img
              src="/universe/ui/profile_avatar.png"
              alt=""
              className="w-[58px] h-[58px] object-contain"
            />
            <div>
              <div className="font-baloo font-extrabold text-[24px] leading-none" style={{ color: "#3b2a63" }}>
                {profile?.child ?? ""}
              </div>
              <div className="font-bold text-[13.5px]" style={{ color: "#8578a6" }}>
                Level {profile?.level ?? 1} · {rank.name} · Universe rank {rank.tier}/{rank.total}
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="font-baloo font-extrabold text-[14px] rounded-full px-5 py-2.5"
            style={{
              background: "#fff",
              color: "#6C3AD6",
              border: "2px solid rgba(108,58,214,.2)",
              boxShadow: "0 4px 12px rgba(60,40,90,.08)",
            }}
          >
            ← Back to app
          </Link>
        </div>

        {/* summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-[18px] px-5 py-4"
              style={{ boxShadow: "0 5px 16px rgba(60,40,90,.07)" }}
            >
              <div className="font-baloo font-extrabold text-[30px] leading-none" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="font-bold text-[12.5px] mt-1" style={{ color: "#8578a6" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* per-subject progress */}
        <h2 className="font-baloo font-extrabold text-[19px] mt-8 mb-3" style={{ color: "#3b2a63" }}>
          Progress by world
        </h2>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
          {overview?.subjects.map(({ subject, earned, total, statuses }) => {
            const subjectRank = worldRank(subject, earned, total);
            return (
              <div
              key={subject.id}
              className="bg-white rounded-[22px] px-5 py-5"
              style={{
                boxShadow: "0 5px 16px rgba(60,40,90,.07)",
                borderLeft: `5px solid ${subject.accent}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-baloo font-extrabold text-[17px]" style={{ color: "#3b2a63" }}>
                  {subject.name}
                </span>
                <span className="font-baloo font-extrabold text-[14px]" style={{ color: subject.accent }}>
                  {earned}/{total}
                </span>
              </div>
              <div className="font-bold text-[12.5px] mb-2" style={{ color: subject.accent }}>
                🏅 {subjectRank.name} · Rank {subjectRank.tier}/{subjectRank.total}
                {subjectRank.next
                  ? ` · ${subjectRank.toNext} badge${subjectRank.toNext === 1 ? "" : "s"} to ${subjectRank.next}`
                  : " · top rank"}
              </div>
              <div className="rounded-full h-2.5 overflow-hidden mb-3" style={{ background: "#EEE7F5" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: total ? `${Math.round((earned / total) * 100)}%` : 0,
                    background: subject.accent,
                  }}
                />
              </div>
              {statuses.map(({ badge, state, lessons, completedLessonIds }) => {
                const done = state === "earned";
                return (
                  <div key={badge.id} className="flex items-center gap-2 py-1">
                    <span
                      className="rounded-full flex-none inline-flex items-center justify-center text-white text-[11px] font-black"
                      style={{ width: 16, height: 16, background: done ? subject.accent : "#EAE3F4" }}
                    >
                      {done ? "✓" : ""}
                    </span>
                    <span
                      className="font-bold text-[13px]"
                      style={{ color: done ? "#3b2a63" : "#a99ac8" }}
                    >
                      {badge.name}
                      {lessons.length > 1 ? ` (${completedLessonIds.length}/${lessons.length} lessons)` : ""}
                    </span>
                  </div>
                );
              })}
              </div>
            );
          })}
        </div>

        {/* settings */}
        <h2 className="font-baloo font-extrabold text-[19px] mt-8 mb-3" style={{ color: "#3b2a63" }}>
          Settings
        </h2>
        <div
          className="bg-white rounded-[22px] px-6 py-3 divide-y divide-[#EEE7F5]"
          style={{ boxShadow: "0 5px 16px rgba(60,40,90,.07)", border: "1px solid rgba(0,0,0,.04)" }}
        >
          {/* key remounts the row when the stored name loads/changes */}
          <NameRow key={profile?.child ?? ""} current={profile?.child ?? ""} />
          {TOGGLES.map((t) => {
            const on = !!profile?.settings[t.key];
            return (
              <div key={t.key} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <div className="font-baloo font-extrabold text-[15px]" style={{ color: "#3b2a63" }}>
                    {t.label}
                  </div>
                  <div className="font-bold text-[12.5px]" style={{ color: "#8578a6" }}>
                    {t.hint}
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={t.label}
                  onClick={() => updateSettings({ [t.key]: !on })}
                  className="rounded-full flex-none transition-all relative"
                  style={{ width: 56, height: 32, background: on ? "#6C3AD6" : "#D8CFE8" }}
                >
                  <span
                    className="absolute rounded-full bg-white"
                    style={{
                      top: 3,
                      left: on ? 27 : 3,
                      width: 26,
                      height: 26,
                      boxShadow: "0 2px 5px rgba(0,0,0,.2)",
                      transition: "left .2s",
                    }}
                  />
                </button>
              </div>
            );
          })}
          <VoiceRow current={profile?.settings.voice ?? DEFAULT_VOICE} />
          <DangerRow
            label="Reset all progress"
            hint="Clear badges and stars on this device — keeps name and settings"
            buttonLabel="Reset"
            confirmLabel="Yes, reset progress"
            onConfirm={resetProgress}
          />
          <DangerRow
            label="Reset everything"
            hint="Erase the name, settings, and all progress — starts the app fresh"
            buttonLabel="Reset everything"
            confirmLabel="Yes, erase it all"
            onConfirm={resetEverything}
          />
        </div>

        <p className="font-bold text-[12px] text-center mt-8" style={{ color: "#a99ac8" }}>
          Progress is saved on this device. Learning Universe · early-learner demo
        </p>
      </div>
    </div>
  );
}
