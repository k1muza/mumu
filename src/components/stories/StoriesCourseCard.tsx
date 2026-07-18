"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { STORIES } from "@/content/stories";
import { db } from "@/lib/db";

/** "Story Reader" course banner shown on the English world page. */
export default function StoriesCourseCard({ accent }: { accent: string }) {
  const answered = useLiveQuery(() => db.storyCredit.count(), []) ?? 0;
  const totalQuestions = STORIES.reduce((n, s) => n + s.questions.length, 0);

  return (
    <Link
      href="/stories"
      className="group flex items-center gap-5 bg-white rounded-[24px] px-6 py-4 mt-4 flex-wrap transition-transform hover:-translate-y-1"
      style={{ border: `2px solid ${accent}`, boxShadow: "0 12px 28px rgba(60,40,90,.14)" }}
    >
      <img
        src="/universe/dragon/dragon_reading_book.png"
        alt=""
        className="w-[72px] h-[78px] object-contain flex-none lu-bob"
      />
      <div className="flex-1 min-w-[220px]">
        <span
          className="font-baloo font-extrabold text-[11px] tracking-wide rounded-full px-3 py-1"
          style={{ color: accent, background: `${accent}15` }}
        >
          READING COURSE
        </span>
        <div
          className="font-baloo font-extrabold text-[21px] leading-tight mt-1.5"
          style={{ color: "#3b2a63" }}
        >
          Storybook Library
        </div>
        <div className="font-bold text-[13.5px] leading-snug mt-0.5" style={{ color: "#7C6DA0" }}>
          {STORIES.length} read-along picture stories · {answered} of {totalQuestions} questions
          answered
        </div>
      </div>
      <span
        className="font-baloo font-extrabold text-white text-[13px] rounded-[12px] px-4 py-2.5 flex-none transition-transform group-hover:scale-[1.04]"
        style={{ background: accent, boxShadow: "0 3px 0 rgba(0,0,0,.17)" }}
      >
        Open the library →
      </span>
    </Link>
  );
}
