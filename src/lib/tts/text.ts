import type { VoiceId } from "./protocol";

/**
 * Kokoro reads phonics notation like /t/ as "slash t slash". Convert those
 * teaching sounds before both cache lookup and synthesis so their keys match.
 */
const PHONEME_SOUNDS: Record<string, string> = {
  a: "ah",
  b: "buh",
  c: "kuh",
  d: "duh",
  e: "eh",
  f: "fff",
  g: "guh",
  h: "hah",
  i: "ih",
  j: "juh",
  k: "kuh",
  l: "lll",
  m: "mmm",
  n: "nnn",
  o: "aw",
  p: "puh",
  q: "kwuh",
  r: "rrr",
  s: "sss",
  t: "tuh",
  u: "uh",
  v: "vvv",
  w: "wuh",
  x: "ks",
  y: "yuh",
  z: "zzz",
  sh: "shh",
  ch: "chuh",
  th: "thh",
  ng: "ng",
};

export const AUDIO_MODEL_VERSION = "kokoro-82m-v1-q8";

export function speakable(text: string): string {
  return text
    .trim()
    .replace(/\/([a-z]{1,3})\//gi, (_, phoneme: string) =>
      PHONEME_SOUNDS[phoneme.toLowerCase()] ?? phoneme,
    );
}

/** A model/voice/speed/text-specific key for persistent generated audio. */
export function speechClipKey(text: string, voice: VoiceId, speed = 1): string {
  return `${AUDIO_MODEL_VERSION}|${voice}|${speed}|${speakable(text)}`;
}
