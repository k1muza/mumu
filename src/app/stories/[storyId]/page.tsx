"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { use, useState } from "react";
import FaIcon from "@/components/FaIcon";
import SpeakerButton from "@/components/lesson/SpeakerButton";
import StoryImageSlot, { copyText } from "@/components/stories/StoryImageSlot";
import StoryShell from "@/components/stories/StoryShell";
import { STORIES, storyPrompt } from "@/content/stories";
import { db, PROFILE_ID } from "@/lib/db";
import { useProfile } from "@/lib/hooks";
import { levelForStars } from "@/lib/progress";
import { useStoryEditMode } from "@/lib/storyEditMode";
import type { Story, StoryChoice, StoryPage, StoryQuestion } from "@/lib/types";

const STARS_PER_QUESTION = 3;

/** Pay out stars for a question, once ever. */
async function award(storyId: string, questionIndex: number) {
  const key = `${storyId}:q${questionIndex}`;
  return db.transaction("rw", [db.storyCredit, db.profiles], async () => {
    const profile = await db.profiles.get(PROFILE_ID);
    const previousLevel = profile?.level ?? 1;
    if (await db.storyCredit.get(key)) return null;
    await db.storyCredit.add({ key });
    let level = previousLevel;
    await db.profiles.where("id").equals(PROFILE_ID).modify((profile) => {
      profile.stars += STARS_PER_QUESTION;
      profile.level = levelForStars(profile.stars);
      level = profile.level;
    });
    return level > previousLevel ? level : null;
  });
}

function StoryChoiceTile({
  story,
  choice,
  questionIndex,
  choiceIndex,
}: {
  story: Story;
  choice: StoryChoice;
  questionIndex: number;
  choiceIndex: number;
}) {
  const editing = useStoryEditMode();
  const slotId = `story-${story.id}-q${questionIndex}-c${choiceIndex}`;
  const hasUploadedImage =
    useLiveQuery(() => db.storyImages.where("id").equals(slotId).count(), [slotId], 0) > 0;
  const showPicture = editing || Boolean(choice.image) || hasUploadedImage;

  if (showPicture) {
    return (
      <StoryImageSlot
        slotId={slotId}
        prompt={storyPrompt(choice.img)}
        defaultImage={choice.image}
        alt={choice.text}
        pickOnClick={false}
        compact
      />
    );
  }

  return (
    <span
      className="absolute inset-0 flex items-center justify-center px-3 text-center font-baloo font-extrabold text-[17px] leading-tight"
      style={{ color: story.accent, background: story.tint }}
    >
      {choice.text}
    </span>
  );
}

function QuestionCard({
  story,
  question,
  questionIndex,
}: {
  story: Story;
  question: StoryQuestion;
  questionIndex: number;
}) {
  const [solved, setSolved] = useState(false);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [tried, setTried] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);

  const pick = (choiceIndex: number, correct: boolean) => {
    if (solved) return;
    setTried(true);
    if (correct) {
      setSolved(true);
      setWrongIndex(null);
      void award(story.id, questionIndex).then(setLevelUp);
    } else {
      setWrongIndex(choiceIndex);
      setTimeout(() => setWrongIndex(null), 700);
    }
  };

  return (
    <div
      className="bg-white rounded-[20px] overflow-hidden"
      style={{ boxShadow: "0 8px 20px rgba(60,40,90,.1)", border: "1px solid rgba(0,0,0,.05)" }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: story.tint }}>
        <span className="font-baloo font-extrabold text-[13px]" style={{ color: story.accent }}>
          Question {questionIndex + 1}
        </span>
      </div>
      <div className="p-4">
        <div className="font-baloo font-extrabold text-[18px] mb-3" style={{ color: "#25455e" }}>
          {question.q}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {question.choices.map((choice, choiceIndex) => {
            const isSolvedPick = solved && choice.correct;
            const isWrongPick = wrongIndex === choiceIndex;
            return (
              <button
                key={choiceIndex}
                type="button"
                aria-label={choice.text}
                className="relative rounded-[14px] overflow-hidden transition-transform"
                onClick={() => pick(choiceIndex, choice.correct)}
                style={{
                  aspectRatio: "1",
                  background: "#fff",
                  border: `3px solid ${
                    isSolvedPick ? "#3fae4a" : isWrongPick ? "#e46161" : "rgba(0,0,0,.08)"
                  }`,
                  boxShadow: isSolvedPick
                    ? "0 0 0 4px #3fae4a55,0 6px 16px rgba(60,40,90,.14)"
                    : undefined,
                  opacity: solved && !choice.correct ? 0.5 : 1,
                }}
              >
                <StoryChoiceTile
                  story={story}
                  choice={choice}
                  questionIndex={questionIndex}
                  choiceIndex={choiceIndex}
                />
              </button>
            );
          })}
        </div>
        <div
          className="flex items-center gap-1.5 mt-3 font-baloo font-extrabold text-[14px] h-[20px]"
          style={{ opacity: tried ? 1 : 0, transition: "opacity .2s" }}
        >
          {solved ? (
            levelUp ? (
              <span className="inline-flex items-center gap-1.5" style={{ color: "#6C3AD6" }}>
                <img
                  src="/universe/rewards/level_badge.webp"
                  alt=""
                  className="w-[24px] h-[26px] object-contain lu-pop lu-shimmer"
                />
                Level {levelUp}! You levelled up!
              </span>
            ) : (
              <span style={{ color: "#2E7D24" }}>★ Yes! Well done!</span>
            )
          ) : (
            tried && <span style={{ color: "#C25B12" }}>Not quite — try again!</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StoryPageCard({
  story,
  page,
  pageIndex,
  speechEnabled,
}: {
  story: Story;
  page: StoryPage;
  pageIndex: number;
  speechEnabled: boolean;
}) {
  const editing = useStoryEditMode();
  const slotId = `story-${story.id}-p${pageIndex}`;
  const hasUploadedImage =
    useLiveQuery(() => db.storyImages.where("id").equals(slotId).count(), [slotId], 0) > 0;
  const showPicture = editing || Boolean(page.image) || hasUploadedImage;

  return (
    <div
      className="relative bg-white rounded-[20px] overflow-hidden flex flex-col"
      style={{ boxShadow: "0 8px 20px rgba(60,40,90,.1)", border: "1px solid rgba(0,0,0,.05)" }}
    >
      {showPicture && (
        <div className="relative" style={{ aspectRatio: "4/3" }}>
          <StoryImageSlot
            slotId={slotId}
            prompt={storyPrompt(page.img)}
            defaultImage={page.image}
            alt={page.text}
          />
        </div>
      )}
      <span
        className="absolute left-2.5 top-2.5 z-10 pointer-events-none font-baloo font-extrabold text-white text-[12px] rounded-[10px] px-2.5 py-1"
        style={{ background: story.accent, boxShadow: "0 3px 8px rgba(0,0,0,.25)" }}
      >
        Page {pageIndex + 1}
      </span>
      <div
        className={`px-4 py-5 flex-1 flex flex-col items-center justify-center gap-4 ${
          showPicture ? "" : "min-h-[260px] pt-14"
        }`}
      >
        <span
          className="font-baloo font-extrabold text-[22px] leading-snug text-center"
          style={{ color: "#2b3f4c", textWrap: "balance" }}
        >
          {page.text}
        </span>
        <SpeakerButton
          word={page.text}
          accent={story.accent}
          chip={story.tint}
          speechEnabled={speechEnabled}
        />
      </div>
    </div>
  );
}

export default function StoryReaderPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = use(params);
  const story = STORIES.find((s) => s.id === storyId);
  const editing = useStoryEditMode();
  const profile = useProfile();
  const [copiedAll, setCopiedAll] = useState(false);

  if (!story) {
    return (
      <StoryShell backHref="/stories" backLabel="Story Library" title="Story not found">
        <Link
          href="/stories"
          className="font-baloo font-extrabold text-[16px]"
          style={{ color: "#1F97A6" }}
        >
          ← Back to the Story Library
        </Link>
      </StoryShell>
    );
  }

  const copyAllPrompts = () => {
    const lines = [`Story: ${story.title}`, "", `COVER: ${storyPrompt(story.cover)}`, ""];
    story.pages.forEach((p, i) => lines.push(`PAGE ${i + 1} — “${p.text}”: ${storyPrompt(p.img)}`));
    lines.push("");
    story.questions.forEach((q, qi) => {
      lines.push(`QUESTION ${qi + 1} — ${q.q}`);
      q.choices.forEach((c, ci) =>
        lines.push(
          `  ${String.fromCharCode(65 + ci)}${c.correct ? " (correct)" : ""}: ${storyPrompt(c.img)}`,
        ),
      );
    });
    copyText(lines.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1400);
  };

  return (
    <StoryShell backHref="/stories" backLabel="Story Library" title={story.title}>
      <div className="flex gap-6 flex-wrap items-start">
        {/* cover panel */}
        <div className="flex-none w-full max-w-[280px] mx-auto sm:mx-0 sm:w-[250px]">
          <div
            className="inline-flex items-center gap-2 font-baloo font-extrabold text-white text-[14px] rounded-t-[14px] px-5 py-2"
            style={{ background: story.accent }}
          >
            <FaIcon name="book" className="text-[14px]" />
            STORY
          </div>
          <div
            className="bg-white rounded-b-[20px] rounded-tr-[20px] p-3"
            style={{ boxShadow: "0 12px 28px rgba(60,40,90,.14)", border: "1px solid rgba(0,0,0,.05)" }}
          >
            <div className="relative rounded-[14px] overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <StoryImageSlot
                slotId={`story-${story.id}-cover`}
                prompt={storyPrompt(story.cover)}
                defaultImage={story.coverImage}
                alt={story.title}
                chipPos="top"
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
            <div
              className="font-baloo font-extrabold text-[20px] text-center mt-2.5 leading-tight"
              style={{ color: "#25455e" }}
            >
              {story.title}
            </div>
            {editing && (
              <button
                type="button"
                onClick={copyAllPrompts}
                className="w-full mt-3 font-baloo font-extrabold text-[13px] rounded-[13px] px-3 py-2.5 flex items-center justify-center gap-1.5"
                style={{
                  background: story.tint,
                  color: story.accent,
                  border: `2px solid ${story.accent}33`,
                }}
              >
                <FaIcon name="copy" className="text-[13px]" />
                {copiedAll ? "Copied all!" : "Copy all prompts"}
              </button>
            )}
          </div>
        </div>

        {/* pages */}
        <div className="flex-1 min-w-[280px]">
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))" }}>
            {story.pages.map((page, i) => (
              <StoryPageCard
                key={i}
                story={story}
                page={page}
                pageIndex={i}
                speechEnabled={profile?.settings.speech ?? true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* questions */}
      <div className="flex items-center gap-2 mt-9 mb-3 ml-1">
        <img
          src="/universe/dragon/dragon_thinking.webp"
          alt=""
          className="w-[40px] h-[44px] object-contain"
        />
        <span className="font-baloo font-extrabold text-[20px]" style={{ color: "#25455e" }}>
          Let’s check what you read!
        </span>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,320px),1fr))" }}>
        {story.questions.map((question, qi) => (
          <QuestionCard key={qi} story={story} question={question} questionIndex={qi} />
        ))}
      </div>
    </StoryShell>
  );
}
