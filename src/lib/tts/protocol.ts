/** Messages exchanged between the TTS manager and the Kokoro worker. */

/** Kokoro voice ids we expose (see kokoro-js VOICES for the full list). */
export type VoiceId = "af_heart" | "af_bella" | "af_nicole" | "bf_emma" | "am_michael";

export const DEFAULT_VOICE: VoiceId = "af_heart";

/** Voices offered in the parent settings picker. */
export const VOICE_OPTIONS: { id: VoiceId; label: string; hint: string }[] = [
  { id: "af_nicole", label: "Nicole", hint: "Soft and hushed" },
  { id: "af_heart", label: "Heart", hint: "Warm and friendly" },
  { id: "af_bella", label: "Bella", hint: "Bright and lively" },
  { id: "bf_emma", label: "Emma", hint: "Gentle British accent" },
  { id: "am_michael", label: "Michael", hint: "Calm and deep" },
];

export type WorkerRequest =
  | { type: "init" }
  | { type: "generate"; id: number; text: string; voice: VoiceId; speed: number }
  | { type: "stream"; id: number; text: string; voice: VoiceId; speed: number }
  | { type: "cancel"; id: number };

export type WorkerResponse =
  | { type: "ready"; device: "webgpu" | "wasm" }
  | { type: "error"; id?: number; message: string }
  /** Full clip for a `generate` request. */
  | { type: "audio"; id: number; wav: ArrayBuffer }
  /** One sentence of a `stream` request, in reading order. */
  | { type: "chunk"; id: number; text: string; wav: ArrayBuffer }
  | { type: "done"; id: number };
