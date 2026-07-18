/** Messages exchanged between the TTS manager and the Kokoro worker. */

/** Kokoro voice ids we expose (see kokoro-js VOICES for the full list). */
export type VoiceId = "af_heart" | "af_bella" | "bf_emma" | "am_michael";

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
