"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import StoryImageSlot from "@/components/stories/StoryImageSlot";
import StoryShell from "@/components/stories/StoryShell";
import { STORIES, storyPrompt } from "@/content/stories";
import { db } from "@/lib/db";

export default function StoryLibraryPage() {
  const credit = useLiveQuery(() => db.storyCredit.toArray(), []);
  const featuredStoryId = useLiveQuery(
    async () => {
      const answeredQuestions = await db.storyCredit.toArray();
      const startedStoryIds = new Set(answeredQuestions.map(({ key }) => key.split(":")[0]));
      const unvisitedStories = STORIES.filter(({ id }) => !startedStoryIds.has(id));
      const storyPool = unvisitedStories.length > 0 ? unvisitedStories : STORIES;

      return storyPool[Math.floor(Math.random() * storyPool.length)]?.id ?? STORIES[0].id;
    },
    [],
    STORIES[0].id,
  );

  const featuredStory = STORIES.find(({ id }) => id === featuredStoryId) ?? STORIES[0];
  const answered = (storyId: string) =>
    credit?.filter((c) => c.key.startsWith(`${storyId}:`)).length ?? 0;

  return (
    <StoryShell backHref="/world/english" backLabel="English World" title="Story Library">
      <div
        className="flex items-center gap-3 bg-white rounded-[24px] px-4 py-4 mb-6 sm:gap-4 sm:px-6"
        style={{ boxShadow: "0 10px 26px rgba(60,40,90,.1)", border: "1px solid rgba(0,0,0,.04)" }}
      >
        <div className="w-0 min-w-0 flex-1">
          <div
            className="font-baloo text-[18px] font-extrabold leading-tight sm:text-[20px]"
            style={{ color: "#25455e" }}
          >
            Pick a story to read!
          </div>
          <div className="text-[13px] font-bold sm:text-[14.5px]" style={{ color: "#5b7686" }}>
            Tap a book. Read each page, then answer the picture questions.
          </div>
        </div>
        <Link
          href={`/stories/${featuredStory.id}`}
          aria-label={`Read ${featuredStory.title}`}
          data-testid="story-suggestion"
          className="relative ml-auto block w-[160px] flex-none transition-transform hover:scale-[1.02] sm:w-[220px]"
        >
          <img
            src="/universe/dragon/dragon_with_speech_bubble.webp"
            alt=""
            className="block h-auto w-full object-contain"
            style={{ transform: "scaleX(-1)" }}
          />
          <span className="absolute left-[3%] right-[42%] top-[6%] flex h-[40%] flex-col items-center justify-center px-1.5 text-center leading-none">
            <span
              className="font-baloo text-[7px] font-extrabold uppercase tracking-[.08em] sm:text-[8px]"
              style={{ color: "#9362bd" }}
            >
              Try this story
            </span>
            <span
              className="mt-0.5 font-baloo text-[9.5px] font-extrabold leading-[1.05] sm:text-[11px]"
              style={{ color: "#25455e" }}
            >
              {featuredStory.title}
            </span>
          </span>
        </Link>
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
