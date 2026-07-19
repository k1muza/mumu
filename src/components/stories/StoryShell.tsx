"use client";

import Link from "next/link";
import { useState } from "react";
import BadgePill from "@/components/BadgePill";
import FaIcon from "@/components/FaIcon";
import GrownUpGate from "@/components/GrownUpGate";
import StarPill from "@/components/StarPill";
import { useProfile } from "@/lib/hooks";
import { setStoryEditMode, useStoryEditMode } from "@/lib/storyEditMode";

/** Shared page chrome for the Story Reader screens. */
export default function StoryShell({
  backHref,
  backLabel,
  title,
  children,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  children: React.ReactNode;
}) {
  const profile = useProfile();
  const editing = useStoryEditMode();
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex-1"
      style={{ background: "linear-gradient(180deg,#E7F6F8 0%,#F6FCFC 60%)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 pt-5 pb-14 sm:px-7">
        <div className="flex items-center justify-between gap-3 flex-wrap sm:gap-4">
          <Link href={backHref} className="flex items-center gap-2.5">
            <img
              src="/universe/ui/back_button_small.png"
              alt=""
              className="w-[44px] h-[48px] object-contain sm:w-[52px] sm:h-[56px]"
            />
            <span
              className="hidden font-baloo font-extrabold text-[16px] sm:inline"
              style={{ color: "#1F97A6" }}
            >
              {backLabel}
            </span>
          </Link>
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/universe/dragon/dragon_reading_book.png"
              alt={profile?.mascot ?? "Aki"}
              className="w-[52px] h-[57px] object-contain lu-bob sm:w-[62px] sm:h-[68px]"
              style={{ filter: "drop-shadow(0 6px 10px rgba(60,40,90,.18))" }}
            />
            <div className="min-w-0">
              <div
                className="font-baloo font-extrabold text-[11px] tracking-[.16em] uppercase"
                style={{ color: "#1F97A6" }}
              >
                Story Reader
              </div>
              <div
                className="font-baloo font-extrabold text-[18px] leading-none truncate sm:text-[22px]"
                style={{ color: "#25455e" }}
              >
                {title}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => (editing ? setStoryEditMode(false) : setGateOpen(true))}
              className="flex items-center gap-1.5 rounded-full px-4 py-2.5 font-baloo font-extrabold text-[13px]"
              style={
                editing
                  ? { background: "#6C3AD6", color: "#fff", boxShadow: "0 5px 14px rgba(60,40,90,.22)" }
                  : {
                      background: "#fff",
                      color: "#7d93a0",
                      border: "2px solid rgba(0,0,0,.06)",
                      boxShadow: "0 5px 14px rgba(60,40,90,.12)",
                    }
              }
            >
              <FaIcon name={editing ? "check" : "pen"} className="text-[12px]" />
              {editing ? "Editing on" : "Grown-ups"}
            </button>
            <StarPill />
            <BadgePill subjectId="english" accent="#1F97A6" />
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>

      {gateOpen && !editing && (
        <GrownUpGate
          onPass={() => {
            setStoryEditMode(true);
            setGateOpen(false);
          }}
          onCancel={() => setGateOpen(false)}
        />
      )}
    </div>
  );
}
