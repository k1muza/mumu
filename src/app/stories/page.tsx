"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import StoryImageSlot from "@/components/stories/StoryImageSlot";
import StoryShell from "@/components/stories/StoryShell";
import { STORIES, storyPrompt } from "@/content/stories";
import { db } from "@/lib/db";

export default function StoryLibraryPage() {
  const credit = useLiveQuery(() => db.storyCredit.toArray(), []);
  const answered = (storyId: string) =>
    credit?.filter((c) => c.key.startsWith(`${storyId}:`)).length ?? 0;

  return (
    <StoryShell backHref="/world/english" backLabel="English World" title="Story Library">
      <div
        className="flex items-center gap-3 bg-white rounded-[24px] px-4 py-4 mb-6 sm:gap-4 sm:px-6"
        style={{ boxShadow: "0 10px 26px rgba(60,40,90,.1)", border: "1px solid rgba(0,0,0,.04)" }}
      >
        <img
          src="/universe/dragon/dragon_with_speech_bubble.webp"
          alt=""
          className="w-[60px] h-[65px] object-contain flex-none sm:w-[76px] sm:h-[82px]"
        />
        <div>
          <div className="font-baloo font-extrabold text-[20px]" style={{ color: "#25455e" }}>
            Pick a story to read!
          </div>
          <div className="font-bold text-[14.5px]" style={{ color: "#5b7686" }}>
            Tap a book. Read each page, then answer the picture questions.
          </div>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))" }}>
        {STORIES.map((story) => {
          const done = answered(story.id);
          const total = story.questions.length;
          return (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="group block bg-white rounded-[24px] overflow-hidden"
              style={{ boxShadow: "0 10px 24px rgba(60,40,90,.12)", border: "1px solid rgba(0,0,0,.05)" }}
            >
              <div className="h-[10px]" style={{ background: story.accent }} />
              <div className="p-4">
                <div
                  className="relative rounded-[16px] overflow-hidden"
                  style={{ aspectRatio: "3/4", boxShadow: "0 6px 14px rgba(60,40,90,.14)" }}
                >
                  <StoryImageSlot
                    slotId={`story-${story.id}-cover`}
                    prompt={storyPrompt(story.cover)}
                    defaultImage={story.coverImage}
                    alt={story.title}
                    chipPos="top"
                    pickOnClick={false}
                  />
                  <div
                    className="absolute left-0 right-0 bottom-0 px-3 py-2 pointer-events-none"
                    style={{ background: "linear-gradient(0deg,rgba(0,0,0,.55),transparent)" }}
                  >
                    <span className="font-baloo font-extrabold text-white text-[11px] tracking-wide">
                      A Learning Universe Story
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <div className="min-w-0">
                    <div
                      className="font-baloo font-extrabold text-[19px] leading-tight truncate"
                      style={{ color: "#25455e" }}
                    >
                      {story.title}
                    </div>
                    <div className="font-bold text-[12.5px]" style={{ color: "#8a9aa6" }}>
                      {story.pages.length} pages · {total} questions
                      {done > 0 && (
                        <span style={{ color: done >= total ? "#438D32" : "#F59E0B" }}>
                          {" "}
                          · {done >= total ? "✓ all answered" : `${done}/${total} answered`}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className="flex-none font-baloo font-extrabold text-white text-[14px] rounded-[14px] px-4 py-2.5 transition-transform group-hover:scale-[1.04]"
                    style={{ background: story.accent, boxShadow: "0 4px 0 rgba(0,0,0,.18)" }}
                  >
                    Read
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </StoryShell>
  );
}
