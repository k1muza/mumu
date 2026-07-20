import Dexie, { type EntityTable } from "dexie";
import { ALL_CONTENT, CONTENT_VERSION } from "@/content";
import { DEFAULT_VOICE } from "./tts/protocol";
import type {
  Badge,
  Lesson,
  LessonProgress,
  MetaEntry,
  Profile,
  StoryCreditEntry,
  StoryImage,
  SpeechClip,
  Subject,
  VariantCreditEntry,
} from "./types";

export const PROFILE_ID = "default";

export const DEFAULT_PROFILE: Profile = {
  id: PROFILE_ID,
  child: "",
  onboarded: false,
  mascot: "Aki",
  stars: 0,
  gems: 0,
  leaves: 0,
  level: 1,
  settings: { speech: true, sfx: true, autoplay: true, voice: DEFAULT_VOICE },
};

class LearningUniverseDB extends Dexie {
  subjects!: EntityTable<Subject, "id">;
  badges!: EntityTable<Badge, "id">;
  lessons!: EntityTable<Lesson, "id">;
  profiles!: EntityTable<Profile, "id">;
  progress!: EntityTable<LessonProgress, "lessonId">;
  meta!: EntityTable<MetaEntry, "key">;
  storyImages!: EntityTable<StoryImage, "id">;
  storyCredit!: EntityTable<StoryCreditEntry, "key">;
  variantCredit!: EntityTable<VariantCreditEntry, "key">;
  speechClips!: EntityTable<SpeechClip, "key">;
}

export const db = new LearningUniverseDB("learning-universe");

db.version(1).stores({
  subjects: "id, order",
  badges: "id, subjectId, [subjectId+order]",
  lessons: "id, badgeId, subjectId, [badgeId+order]",
  profiles: "id",
  progress: "lessonId, badgeId, subjectId",
  meta: "key",
});

// v2: profiles gained an `onboarded` flag. Pre-existing profiles carried the
// placeholder name "Zane", so send them through onboarding once to fix it.
db.version(2).upgrade((tx) =>
  tx
    .table("profiles")
    .toCollection()
    .modify((p) => {
      if (p.onboarded === undefined) {
        p.onboarded = false;
        if (p.child === "Zane") p.child = "";
      }
    }),
);

// v3: Story Reader — uploaded illustrations and per-question star credit.
db.version(3).stores({
  storyImages: "id",
  storyCredit: "key",
});

// v4: remember which question variations have been answered correctly.
db.version(4).stores({
  variantCredit: "key",
});

// v5: generated speech clips are kept locally for delay-free playback.
db.version(5).stores({
  speechClips: "key, voice",
});

/**
 * Seed (or re-seed) content from `src/content` whenever CONTENT_VERSION
 * changes. Content tables are replaced wholesale; profile and progress are
 * preserved across content updates.
 */
db.on("ready", async () => {
  const stored = await db.meta.get("contentVersion");
  if (stored?.value !== CONTENT_VERSION) {
    await db.transaction("rw", [db.subjects, db.badges, db.lessons, db.meta], async () => {
      await Promise.all([db.subjects.clear(), db.badges.clear(), db.lessons.clear()]);
      await db.subjects.bulkAdd(ALL_CONTENT.map((c) => c.subject));
      await db.badges.bulkAdd(ALL_CONTENT.flatMap((c) => c.badges));
      await db.lessons.bulkAdd(ALL_CONTENT.flatMap((c) => c.lessons));
      await db.meta.put({ key: "contentVersion", value: CONTENT_VERSION });
    });
  }
  const profile = await db.profiles.get(PROFILE_ID);
  if (!profile) {
    await db.profiles.add(DEFAULT_PROFILE);
  }
});
