"use client";

import { useEffect, useState } from "react";
import CssCloud from "@/components/CssCloud";
import TwinkleField from "@/components/TwinkleField";
import { useProfile } from "@/lib/hooks";
import { completeOnboarding } from "@/lib/progress";

const MAX_NAME_LENGTH = 20;

/**
 * Full-screen first-run welcome: Aki asks the child's name. Covers every
 * route until the profile is onboarded; renders nothing afterwards.
 */
export default function OnboardingGate() {
  const profile = useProfile();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const onboardingOpen = !!profile && !profile.onboarded;

  useEffect(() => {
    if (!onboardingOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [onboardingOpen]);

  // Nothing to show while the profile is still loading or already onboarded.
  if (!onboardingOpen) return null;

  const trimmed = name.trim();

  const start = async () => {
    if (!trimmed || submitting) return;
    setSubmitting(true);
    await completeOnboarding(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto overscroll-contain"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 6%,#8a6ce0 0%,#6a4dc0 38%,#4c39a0 68%,#3f2f8e 100%)",
      }}
    >
      <TwinkleField />
      <CssCloud
        variant="puffy"
        style={{ left: -50, bottom: -34, width: 380, opacity: 0.92 }}
      />
      <CssCloud
        variant="wide"
        style={{ right: -40, bottom: -38, width: 440, opacity: 0.92 }}
      />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-center px-6 py-10">
        <img
          src="/universe/ui/logo_learning_universe.webp"
          alt="Learning Universe"
          className="w-[280px] object-contain mb-6"
          style={{ filter: "drop-shadow(0 6px 12px rgba(20,0,60,.3))" }}
        />

        <div
          className="bg-white rounded-[28px] px-8 py-8 max-w-[440px] w-full text-center lu-rise"
          style={{ boxShadow: "0 24px 60px rgba(30,10,70,.35)" }}
        >
          <img
            src="/universe/dragon/dragon_wave.webp"
            alt="Aki the dragon waving"
            className="w-[130px] h-[130px] object-contain mx-auto lu-bob"
            style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,.2))" }}
          />
          <div className="font-baloo font-extrabold text-[26px] mt-2" style={{ color: "#3b2a63" }}>
            Hi there! I&apos;m Aki!
          </div>
          <p className="font-bold text-[15px] mt-1" style={{ color: "#7c6da0" }}>
            We&apos;re going to explore whole worlds together.
            <br />
            What should I call you?
          </p>

          <input
            type="text"
            value={name}
            autoFocus
            maxLength={MAX_NAME_LENGTH}
            placeholder="Type your name"
            aria-label="Your name"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") start();
            }}
            className="w-full mt-5 text-center font-baloo font-extrabold text-[24px] rounded-[18px] px-5 py-4 outline-none transition-colors"
            style={{
              color: "#3b2a63",
              background: "#F4F1FA",
              border: `3px solid ${trimmed ? "#6C3AD6" : "rgba(108,58,214,.25)"}`,
            }}
          />

          <button
            type="button"
            onClick={start}
            disabled={!trimmed || submitting}
            className="w-full font-baloo font-extrabold text-white text-[19px] rounded-[18px] px-7 py-4 mt-4 transition-opacity"
            style={{
              background: "#6C3AD6",
              boxShadow: "0 6px 0 rgba(0,0,0,.2)",
              opacity: trimmed ? 1 : 0.45,
            }}
          >
            Start the adventure! 🚀
          </button>
        </div>

        <p className="font-bold text-[12.5px] mt-5 text-center" style={{ color: "#cfc2f2" }}>
          A grown-up can change this later in the settings.
        </p>
      </div>
    </div>
  );
}
