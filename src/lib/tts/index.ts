/**
 * Kokoro text-to-speech for words, sentences and stories.
 *
 * Parent-generated clips are read from IndexedDB first. Missing audio is
 * generated in a web worker (see tts.worker.ts), with browser speechSynthesis
 * as the first-load/device fallback.
 */
import { DEFAULT_VOICE, type VoiceId, type WorkerRequest, type WorkerResponse } from "./protocol";
import { countSpeechLibraryClips, getSpeechClip, speechLibraryTexts } from "./library";
import { speakable, speechClipKey } from "./text";

/** Only cache short clips (words / prompts) — story audio is too big to keep. */
const CACHEABLE_CHARS = 120;
const CACHE_MAX = 40;

/**
 * Kokoro + onnxruntime peaks at several hundred MB of WASM memory, enough to
 * OOM the tab on phones, and the ~90 MB download stalls lessons on mobile
 * networks — so Android always stays on the speechSynthesis fallback.
 * Elsewhere, low-RAM devices (deviceMemory is Chromium-only) are gated too.
 */
function shouldUseFallbackVoice(): boolean {
  if (/Android/i.test(navigator.userAgent)) return true;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return deviceMemory !== undefined && deviceMemory < 4;
}

type Pending = { resolve: (wav: ArrayBuffer) => void; reject: (err: Error) => void };
type ReadyWaiter = { resolve: () => void; reject: (err: Error) => void };
type StreamHandler = { onChunk: (blob: Blob) => void; onDone: () => void };
type SpeechOptions = { speed?: number; onPreparingChange?: (preparing: boolean) => void };
type NextRequest = {
  text: string;
  speed: number;
  onPreparingChange?: SpeechOptions["onPreparingChange"];
};
export type SpeechStatus = "idle" | "loading" | "ready" | "generating" | "failed";

class SpeechManager {
  private voice: VoiceId = DEFAULT_VOICE;
  private worker: Worker | null = null;
  private ready = false;
  private failed = false;
  private waitingForServiceWorkerUpdate = false;
  private status: SpeechStatus = "idle";
  private listeners = new Set<() => void>();
  private preparingId: number | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private readyWaiters: ReadyWaiter[] = [];
  private streams = new Map<number, StreamHandler>();
  private activeStream: number | null = null;
  private cache = new Map<string, Blob>();
  private el: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private queue: Blob[] = [];
  private playing = false;
  /** Bumped by stop(); in-flight async work compares against it and drops out. */
  private session = 0;
  /**
   * Generation is expensive (seconds on wasm), so while one clip is being
   * generated, further speak() calls collapse into just the latest one instead
   * of queueing a backlog in the worker.
   */
  private generating = false;
  private nextRequest: NextRequest | null = null;

  /** Start loading the model only when this voice's local library is incomplete. */
  preload() {
    const voice = this.voice;
    const total = speechLibraryTexts(voice).length;
    void countSpeechLibraryClips(voice)
      .then((stored) => {
        if (stored < total) this.ensureWorker();
      })
      .catch(() => this.ensureWorker());
  }

  /** Observable state used by the UI to explain first-load and synthesis delays. */
  getStatus = () => this.status;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Switch the Kokoro voice; applies to the next speak/readAloud call. */
  setVoice(voice: VoiceId) {
    this.voice = voice;
  }

  /** Text longer than this is streamed sentence-by-sentence instead. */
  private static readonly STREAM_THRESHOLD = 80;

  /** Speak a word or sentence as a single clip; long text streams as a story. */
  speak(text: string, opts: SpeechOptions = {}) {
    if (typeof window === "undefined" || !text.trim()) return;
    text = speakable(text);
    this.stop();
    const speed = opts.speed ?? 1;
    const key = speechClipKey(text, this.voice, speed);
    const cached = this.cache.get(key);
    if (cached) {
      this.enqueue(cached);
      return;
    }
    const session = this.session;
    void getSpeechClip(text, this.voice, speed)
      .then((clip) => {
        if (this.session !== session) return;
        if (clip) {
          this.remember(key, clip.blob);
          this.enqueue(clip.blob);
          return;
        }
        this.speakNormally(text, opts);
      })
      .catch(() => {
        if (this.session === session) this.speakNormally(text, opts);
      });
  }

  /** Generate one clip without playing it, for the Parent audio library tool. */
  async generateClip(
    text: string,
    opts: { voice?: VoiceId; speed?: number } = {},
  ): Promise<Blob> {
    text = speakable(text);
    await this.waitUntilReady();
    const id = this.nextId++;
    const voice = opts.voice ?? this.voice;
    const speed = opts.speed ?? 1;
    this.setStatus("generating");
    try {
      const wav = await new Promise<ArrayBuffer>((resolve, reject) => {
        this.pending.set(id, { resolve, reject });
        this.send({ type: "generate", id, text, voice, speed });
      });
      return new Blob([wav], { type: "audio/wav" });
    } finally {
      if (this.ready) this.setStatus("ready");
    }
  }

  /** Existing on-demand path used whenever no generated clip is stored. */
  private speakNormally(text: string, opts: SpeechOptions) {
    if (text.length > SpeechManager.STREAM_THRESHOLD) {
      this.readAloud(text, opts);
      return;
    }
    const speed = opts.speed ?? 1;
    const key = speechClipKey(text, this.voice, speed);
    if (!this.ensureWorker() || !this.ready) {
      this.speakFallback(text);
      return;
    }
    if (this.generating) {
      this.nextRequest?.onPreparingChange?.(false);
      opts.onPreparingChange?.(true);
      this.nextRequest = { text, speed, onPreparingChange: opts.onPreparingChange };
      return;
    }
    this.generating = true;
    opts.onPreparingChange?.(true);
    const session = this.session;
    const id = this.nextId++;
    this.preparingId = id;
    this.setStatus("generating");
    new Promise<ArrayBuffer>((resolve, reject) => this.pending.set(id, { resolve, reject }))
      .then((wav) => {
        const blob = new Blob([wav], { type: "audio/wav" });
        if (text.length <= CACHEABLE_CHARS) this.remember(key, blob);
        if (this.session === session) this.enqueue(blob);
      })
      .catch(() => {
        if (this.session === session) this.speakFallback(text);
      })
      .finally(() => {
        opts.onPreparingChange?.(false);
        this.generating = false;
        const next = this.nextRequest;
        this.nextRequest = null;
        if (next) {
          this.speak(next.text, {
            speed: next.speed,
            onPreparingChange: next.onPreparingChange,
          });
        }
      });
    this.send({ type: "generate", id, text, voice: this.voice, speed });
  }

  /**
   * Read long text (a story) aloud, streaming sentence-by-sentence so playback
   * starts as soon as the first sentence is ready.
   */
  readAloud(text: string, opts: SpeechOptions = {}) {
    if (typeof window === "undefined" || !text.trim()) return;
    text = speakable(text);
    this.stop();
    if (!this.ensureWorker() || !this.ready) {
      this.speakFallback(text);
      return;
    }
    const session = this.session;
    const id = this.nextId++;
    this.activeStream = id;
    this.preparingId = id;
    this.setStatus("generating");
    let preparing = true;
    const finishPreparing = () => {
      if (!preparing) return;
      preparing = false;
      opts.onPreparingChange?.(false);
    };
    opts.onPreparingChange?.(true);
    this.streams.set(id, {
      onChunk: (blob) => {
        finishPreparing();
        if (this.session === session) this.enqueue(blob);
      },
      onDone: () => {
        finishPreparing();
        if (this.activeStream === id) this.activeStream = null;
      },
    });
    this.send({ type: "stream", id, text, voice: this.voice, speed: opts.speed ?? 1 });
  }

  /** Stop all playback and pending speech immediately. */
  stop() {
    if (typeof window === "undefined") return;
    this.session++;
    this.nextRequest?.onPreparingChange?.(false);
    this.nextRequest = null;
    if (this.activeStream !== null) {
      if (this.preparingId === this.activeStream) {
        this.preparingId = null;
        if (this.ready) this.setStatus("ready");
      }
      this.send({ type: "cancel", id: this.activeStream });
      this.streams.get(this.activeStream)?.onDone();
      this.streams.delete(this.activeStream);
      this.activeStream = null;
    }
    this.queue = [];
    this.playing = false;
    if (this.el) this.el.pause();
    if (this.currentUrl) {
      URL.revokeObjectURL(this.currentUrl);
      this.currentUrl = null;
    }
    window.speechSynthesis?.cancel();
  }

  /* ---------- worker plumbing ---------- */

  private ensureWorker(): Worker | null {
    if (typeof window === "undefined" || this.failed) return null;
    if (this.worker) return this.worker;
    if (shouldUseFallbackVoice()) {
      this.failed = true;
      this.setStatus("failed");
      return null;
    }
    try {
      this.worker = new Worker(new URL("./tts.worker.ts", import.meta.url), { type: "module" });
    } catch {
      this.failed = true;
      this.setStatus("failed");
      return null;
    }
    this.setStatus("loading");
    this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => this.handleMessage(e.data);
    this.worker.onerror = () => this.fail();
    this.send({ type: "init" });
    return this.worker;
  }

  private send(msg: WorkerRequest) {
    this.worker?.postMessage(msg);
  }

  private handleMessage(msg: WorkerResponse) {
    switch (msg.type) {
      case "ready":
        this.ready = true;
        this.setStatus("ready");
        for (const waiter of this.readyWaiters) waiter.resolve();
        this.readyWaiters = [];
        break;
      case "audio": {
        this.finishPreparing(msg.id);
        this.pending.get(msg.id)?.resolve(msg.wav);
        this.pending.delete(msg.id);
        break;
      }
      case "chunk":
        this.finishPreparing(msg.id);
        this.streams.get(msg.id)?.onChunk(new Blob([msg.wav], { type: "audio/wav" }));
        break;
      case "done": {
        this.finishPreparing(msg.id);
        this.streams.get(msg.id)?.onDone();
        this.streams.delete(msg.id);
        break;
      }
      case "error": {
        if (msg.id === undefined) {
          // Model failed to load — give up on Kokoro for this session.
          this.fail();
        } else {
          this.finishPreparing(msg.id);
          this.pending.get(msg.id)?.reject(new Error(msg.message));
          this.pending.delete(msg.id);
          this.streams.get(msg.id)?.onDone();
          this.streams.delete(msg.id);
        }
        break;
      }
    }
  }

  private fail() {
    this.failed = true;
    this.ready = false;
    this.preparingId = null;
    this.setStatus("failed");
    for (const p of this.pending.values()) p.reject(new Error("TTS worker failed"));
    this.pending.clear();
    for (const waiter of this.readyWaiters) waiter.reject(new Error("TTS model failed to load"));
    this.readyWaiters = [];
    for (const s of this.streams.values()) s.onDone();
    this.streams.clear();
    this.worker?.terminate();
    this.worker = null;
    this.retryAfterServiceWorkerUpdate();
  }

  /** Retry if a newly activated PWA worker replaces one that broke startup. */
  private retryAfterServiceWorkerUpdate() {
    if (
      this.waitingForServiceWorkerUpdate ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }
    this.waitingForServiceWorkerUpdate = true;
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        this.waitingForServiceWorkerUpdate = false;
        if (!this.failed) return;
        this.failed = false;
        this.setStatus("idle");
        this.ensureWorker();
      },
      { once: true },
    );
  }

  private finishPreparing(id: number) {
    if (this.preparingId !== id) return;
    this.preparingId = null;
    if (this.ready) this.setStatus("ready");
  }

  private waitUntilReady(): Promise<void> {
    if (this.ready) return Promise.resolve();
    if (!this.ensureWorker()) {
      return Promise.reject(new Error("This device cannot generate the offline audio library."));
    }
    return new Promise((resolve, reject) => this.readyWaiters.push({ resolve, reject }));
  }

  private setStatus(status: SpeechStatus) {
    if (this.status === status) return;
    this.status = status;
    for (const listener of this.listeners) listener();
  }

  /* ---------- playback ---------- */

  private enqueue(blob: Blob) {
    this.queue.push(blob);
    if (!this.playing) this.playNext();
  }

  private playNext() {
    const blob = this.queue.shift();
    if (!blob) {
      this.playing = false;
      return;
    }
    this.playing = true;
    const el = (this.el ??= new Audio());
    const url = URL.createObjectURL(blob);
    this.currentUrl = url;
    const next = () => {
      if (this.currentUrl === url) this.currentUrl = null;
      URL.revokeObjectURL(url);
      this.playNext();
    };
    el.onended = next;
    el.onerror = next;
    el.src = url;
    el.play().catch(next);
  }

  private remember(key: string, blob: Blob) {
    this.cache.delete(key);
    this.cache.set(key, blob);
    if (this.cache.size > CACHE_MAX) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
  }

  private speakFallback(text: string) {
    if (!window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    } catch {
      /* speech is best-effort */
    }
  }
}

/** App-wide speech singleton. */
export const speech = new SpeechManager();
