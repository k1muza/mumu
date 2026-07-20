import { ALL_CONTENT } from "@/content";
import { STORIES } from "@/content/stories";
import { db } from "@/lib/db";
import type { Activity, SpeechClip } from "@/lib/types";
import { VOICE_OPTIONS, type VoiceId } from "./protocol";
import { speakable, speechClipKey } from "./text";

function promptFor(activity: Activity): string {
  switch (activity.kind) {
    case "listen":
      return `Listen to the word “${activity.word}”`;
    case "build-word":
      return "Build the word — tap the letters in order";
    default:
      return activity.prompt;
  }
}

/** Every phrase reachable through a speech button, for one selected voice. */
export function speechLibraryTexts(voice: VoiceId): string[] {
  const texts = new Set<string>();

  for (const content of ALL_CONTENT) {
    for (const lesson of content.lessons) {
      for (const slot of lesson.activities) {
        for (const activity of slot) {
          if (activity.kind !== "choice" || !activity.suppressPromptSpeech) {
            texts.add(speakable(promptFor(activity)));
          }
          if (activity.kind === "listen") texts.add(speakable(activity.word));
          if (activity.kind === "choice" && activity.audioWord) {
            texts.add(speakable(activity.audioWord));
          }
        }
      }
    }
  }

  for (const story of STORIES) {
    for (const page of story.pages) texts.add(speakable(page.text));
  }

  const voiceOption = VOICE_OPTIONS.find((option) => option.id === voice);
  if (voiceOption) texts.add(`Hi! I'm ${voiceOption.label}. Let's read together!`);

  return [...texts].sort((a, b) => a.localeCompare(b));
}

export async function getSpeechClip(
  text: string,
  voice: VoiceId,
  speed = 1,
): Promise<SpeechClip | undefined> {
  return db.speechClips.get(speechClipKey(text, voice, speed));
}

export async function putSpeechClip(
  text: string,
  voice: VoiceId,
  speed: number,
  blob: Blob,
): Promise<void> {
  const normalized = speakable(text);
  await db.speechClips.put({
    key: speechClipKey(normalized, voice, speed),
    voice,
    speed,
    text: normalized,
    blob,
    createdAt: Date.now(),
  });
}

export async function countSpeechLibraryClips(voice: VoiceId): Promise<number> {
  const keys = speechLibraryTexts(voice).map((text) => speechClipKey(text, voice));
  const clips = await db.speechClips.bulkGet(keys);
  return clips.filter(Boolean).length;
}

/** Remove clips from older content/model versions for this voice. */
export async function removeObsoleteSpeechClips(voice: VoiceId): Promise<void> {
  const wanted = new Set(
    speechLibraryTexts(voice).map((text) => speechClipKey(text, voice)),
  );
  const stored = await db.speechClips.where("voice").equals(voice).primaryKeys();
  const obsolete = stored.filter((key) => !wanted.has(key));
  if (obsolete.length) await db.speechClips.bulkDelete(obsolete);
}
